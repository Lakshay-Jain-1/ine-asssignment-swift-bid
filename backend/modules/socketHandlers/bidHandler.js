
export async function handleBid(socket, io, supabase, userSocketMap, bidData) {
  const { bid, itemName, sellerEmail, sellerName, buyerEmail } = bidData;

  try {
    const { data: allBids, error: fetchError } = await supabase
      .from("bid")
      .select("*")
      .eq("itemName", itemName)
      .order("bid", { ascending: false });

    if (fetchError) return console.error(fetchError);

    const previousHighestBidderEmail = allBids?.[0]?.buyerEmail || null;
    const currentHighestBid = allBids?.[0]?.bid || 0;

    if (bid <= currentHighestBid) {
      return socket.emit("bid-rejected", { 
        message: "Bid must be higher than current highest bid", 
        currentHighestBid 
      });
    }

    const { data: existingBid, error: existingBidError } = await supabase
      .from("bid")
      .select("*")
      .eq("itemName", itemName)
      .eq("buyerEmail", buyerEmail)
      .single();

    if (existingBidError && existingBidError.code !== "PGRST116") return console.error(existingBidError);

    if (existingBid) {
      await supabase.from("bid").update({ bid }).eq("itemName", itemName).eq("buyerEmail", buyerEmail);
    } else {
      await supabase.from("bid").insert({ bid, itemName, sellerEmail, sellerName, buyerEmail });
    }

    if (previousHighestBidderEmail && previousHighestBidderEmail !== buyerEmail && userSocketMap.has(previousHighestBidderEmail)) {
      const prevId = userSocketMap.get(previousHighestBidderEmail);
      io.to(prevId).emit("bid-alert-highest-bidder", { auctionItemName: itemName, message: "You have been outbid!" });
    }

    io.emit("bid-alert-users", { bid, itemName, buyerEmail });

    if (sellerEmail && userSocketMap.has(sellerEmail)) {
      const sellerId = userSocketMap.get(sellerEmail);
      io.to(sellerId).emit("bid-alert-seller", { bid, itemName, buyerEmail });
    }

    io.emit("item-price-alert", { itemName, sellerEmail, bid, buyerEmail });

  } catch (error) {
    console.error("Error in bid handler:", error);
    socket.emit("bid-error", { message: "An error occurred while processing your bid" });
  }
}
