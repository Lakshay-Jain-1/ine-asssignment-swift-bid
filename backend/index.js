import express from "express";
import cors from "cors";
import sendGridMail from "@sendgrid/mail";
import { createServer } from "http";
import { Server } from "socket.io";
import { supabase } from "./supabase-client.js";
import dotenv from "dotenv";
dotenv.config();
import path from "path";
import { fileURLToPath } from "url";

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);
const app = express();
app.use(cors());
app.use(express.json());
app.use(express.static(path.join(__dirname, "public")));
sendGridMail.setApiKey(process.env.SENDGRID_API_KEY);

// app.get("*", (req, res) => {
//   res.sendFile(path.join(__dirname, "public", "index.html"));
// });

app.get("/", (req, res) => {
  res.send("Hello, world!");
});

async function sendMail(emailId, { subject, html, text }) {
  const msg = {
    to: emailId,
    from: "lakshayjain@orbitalnotes.info",
    subject,
    text,
    html,
  };

  console.log("sendMail", emailId);

  try{
  await sendGridMail.send(msg)
  console.log('Email sent')
  }catch(error){
    console.log("error",error)
  }
}

const httpServer = createServer(app);

const io = new Server(httpServer, {
  cors: {
    origin: process.env.FRONTEND_URL,
    methods: ["GET", "POST"],
  },
});

const userSocketMap = new Map();

io.on("connection", (socket) => {
  console.log(`New client connected: ${socket.id}`);

  socket.on("auction-card", async (data) => {
    console.log("auctionCardData", data);
    delete data["liveDateRaw"];
    const { error } = await supabase.from("auction").insert(data);
    if (error) {
      console.error(error);
    }
    io.emit("auction-cards", data);
  });

  socket.on("register-user", (email) => {
    console.log("Email", email);
    userSocketMap.set(email, socket.id);
  });

socket.on(
  "bid",
  async ({ bid, itemName, sellerEmail, sellerName, buyerEmail }) => {
    try {
      // Get all bids for this item to find the current highest bidder
      let { data: allBids, error: fetchError } = await supabase
        .from("bid")
        .select("*")
        .eq("itemName", itemName)
        .order("bid", { ascending: false }); // Order by bid amount descending

      if (fetchError) {
        console.error("Error fetching bids:", fetchError);
        return;
      }

      console.log("allBids", allBids);
      console.log("hashmap", userSocketMap);

      let previousHighestBidderEmail = null;
      let currentHighestBid = 0;

      // Find current highest bidder (if any)
      if (allBids && allBids.length > 0) {
        previousHighestBidderEmail = allBids[0].buyerEmail;
        currentHighestBid = allBids[0].bid;
      }

      // Check if new bid is higher than current highest
      if (bid <= currentHighestBid) {
        // Reject bid if it's not higher than current highest
        socket.emit("bid-rejected", { 
          message: "Bid must be higher than current highest bid",
          currentHighestBid 
        });
        return;
      }

      // Check if this buyer already has a bid for this item
      let { data: existingBid, error: existingBidError } = await supabase
        .from("bid")
        .select("*")
        .eq("itemName", itemName)
        .eq("buyerEmail", buyerEmail)
        .single();

      if (existingBidError && existingBidError.code !== 'PGRST116') {
        // Error other than "no rows returned"
        console.error("Error checking existing bid:", existingBidError);
        return;
      }

      if (existingBid) {
        // Update existing bid
        const { error: updateError } = await supabase
          .from("bid")
          .update({ bid })
          .eq("itemName", itemName)
          .eq("buyerEmail", buyerEmail);

        if (updateError) {
          console.error("Error updating bid:", updateError);
          return;
        }
      } else {
        // Insert new bid
        const { error: insertError } = await supabase
          .from("bid")
          .insert({
            bid,
            itemName,
            sellerEmail,
            sellerName,
            buyerEmail
          });

        if (insertError) {
          console.error("Error inserting bid:", insertError);
          return;
        }
      }

      // Notify previous highest bidder (if different from current bidder)
      if (previousHighestBidderEmail && 
          previousHighestBidderEmail !== buyerEmail && 
          userSocketMap.has(previousHighestBidderEmail)) {
        let previousHighestBidderID = userSocketMap.get(previousHighestBidderEmail);
        io.to(previousHighestBidderID).emit("bid-alert-highest-bidder", {
          auctionItemName: itemName,
          message: "You have been outbid!"
        });
      }

      // Notify all users about the new bid
      io.emit("bid-alert-users", { bid, itemName, buyerEmail });

      // Notify seller
      if (sellerEmail && userSocketMap.has(sellerEmail)) {
        let sellerId = userSocketMap.get(sellerEmail);
        io.to(sellerId).emit("bid-alert-seller", {
          bid,
          itemName,
          buyerEmail
        });
      }

      // Update item price for all users
      io.emit("item-price-alert", { itemName, sellerEmail, bid, buyerEmail });

    } catch (error) {
      console.error("Error in bid handler:", error);
      socket.emit("bid-error", { message: "An error occurred while processing your bid" });
    }
  }
);

socket.on("auction-end", async ({ itemName, sellerEmail }) => {
  try {
    const { data, error } = await supabase
      .from("bid")
      .select("*")
      .eq("itemName", itemName)
      .eq("sellerEmail", sellerEmail)
      .order("bid", { ascending: false });

    console.log("Auction end data:", data, error);
    
    if (error) {
      console.error("Error fetching auction data:", error);
      return;
    }
    
    if (!data || data.length === 0) {
      console.log("No bids found for this auction");
      return;
    }

    // The data is already sorted by bid amount (highest first)
    const highestBid = data[0];
    const losingBidders = data.slice(1); // All other bidders

    console.log("Highest bidder:", highestBid);
    console.log("Other bidders:", losingBidders);

    // Send success email to the winning bidder
    const successfulData = {
      subject: `Congratulations! You won the auction for ${itemName}`,
      html: `
        <h2>Auction Won!</h2>
        <p>Congratulations! You have won the auction for <strong>${itemName}</strong></p>
        <p>Your winning bid: $${highestBid.bid}</p>
        <p>Please contact the seller at: ${sellerEmail}</p>
      `,
      text: `Congratulations! You won the auction for ${itemName} with a bid of $${highestBid.bid}. Please contact the seller at: ${sellerEmail}`
    };
    
    await sendMail(highestBid.buyerEmail, successfulData);
    console.log("Success email sent to:", highestBid.buyerEmail);

    // Send failure emails to losing bidders
    const failedData = {
      subject: `Auction ended - ${itemName}`,
      html: `
        <h2>Auction Ended</h2>
        <p>Unfortunately, you did not win the auction for <strong>${itemName}</strong></p>
        <p>The winning bid was: $${highestBid.bid}</p>
        <p>Thank you for participating!</p>
      `,
      text: `The auction for ${itemName} has ended. The winning bid was $${highestBid.bid}. Thank you for participating!`
    };

    for (const bidder of losingBidders) {
      const personalizedFailedData = {
        ...failedData,
        html: failedData.html.replace('{{BID_AMOUNT}}', bidder.bid),
        text: failedData.text.replace('{{BID_AMOUNT}}', bidder.bid)
      };
      
    await  sendMail(bidder.buyerEmail, personalizedFailedData);
      console.log("Failure email sent to:", bidder.buyerEmail);
    }

    io.emit("auction-ended", {
      itemName,
      winningBid: highestBid.bid,
      winnerEmail: highestBid.buyerEmail,
      sellerEmail
    });
  } catch (error) {
    console.error("Error in auction-end handler:", error);
  }
});

  socket.on("disconnect", () => {
    for (let [email, id] of userSocketMap.entries()) {
      if (id === socket.id) {
        userSocketMap.delete(email);
        break;
      }
    }
  });
});

const PORT = process.env.PORT_NUMBER || 3000;
httpServer.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
});
