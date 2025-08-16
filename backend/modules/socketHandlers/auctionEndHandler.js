
import sendMail from "../emailService.js";

export async function handleAuctionEnd(socket, io, supabase, itemName, sellerEmail) {
  try {
    const { data, error } = await supabase
      .from("bid")
      .select("*")
      .eq("itemName", itemName)
      .eq("sellerEmail", sellerEmail)
      .order("bid", { ascending: false });

    if (error) return console.error(error);
    if (!data || data.length === 0) return;

    const highestBid = data[0];
    const losingBidders = data.slice(1);

    await sendMail(highestBid.buyerEmail, {
      subject: `Congratulations! You won ${itemName}`,
      text: `You won with $${highestBid.bid}. Contact seller at ${sellerEmail}`,
    });

    for (const bidder of losingBidders) {
      await sendMail(bidder.buyerEmail, {
        subject: `Auction ended - ${itemName}`,
        text: `You lost. Winning bid: $${highestBid.bid}`,
      });
    }

    io.emit("auction-ended", {
      itemName,
      winningBid: highestBid.bid,
      winnerEmail: highestBid.buyerEmail,
      sellerEmail,
    });

  } catch (error) {
    console.error("Error in auction-end handler:", error);
  }
}
