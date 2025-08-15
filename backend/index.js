import express from "express";
import cors from "cors";
import { createServer } from "http";
import { Server } from "socket.io";
import { supabase } from "./supabase-client.js";
import dotenv from "dotenv";
dotenv.config();

const app = express();
app.use(cors());
app.use(express.json());

app.get("/", (req, res) => {
  res.send("Hello, world!");
});

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
    const { error } = await supabase.from("auction").insert(data);
    io.emit("auction-cards", data);
  });

  socket.on("register-user", (email) => {
    console.log("Email",email)
    userSocketMap.set(email, socket.id);
  });

  socket.on(
    "bid",
    async ({ bid, itemName, sellerEmail, sellerName, buyerEmail }) => {
      // major flaw with this logic is that we are assuming that bid will always be bigger
      // but this is how usually it happens
      // in frontend will make sure that bid amount can't be lesser than high amount

      // there are two cases
      // Case 1 when there is no bid and that person is the first bidder

      let { data: prevData, error: prevError } = await supabase
        .from("bid")
        .select("*")
        .eq("itemName", itemName)
        .eq("buyerEmail", buyerEmail);

      console.log("prevData", prevData);
      console.log("hashmap",userSocketMap)
      // Case 1 when bid is first
      if (!prevData || prevData.length == 0) {
        const { error: insertError } = await supabase
          .from("bid")
          .insert({ bid, itemName, sellerEmail, sellerName, buyerEmail });
      } else {
        // Case 2 consecutive bids want to know previous Highest bidder and sellerEmail also
        prevData = prevData[0];
        let previousHighestBidderEmail = prevData.buyerEmail;
        let sellerEmailId = prevData.sellerEmail;
        let auctionItemName = prevData.itemName;

        // Update to the database
        await supabase
          .from("bid")
          .update({ bid, buyerEmail })
          .eq("itemName", itemName)
          .eq("buyerEmail", previousHighestBidderEmail);

        // to that previous highest bidder
        if (
          previousHighestBidderEmail &&
          userSocketMap.has(previousHighestBidderEmail)
        ) {
          let previousHighestBidderID = userSocketMap.get(
            previousHighestBidderEmail
          );
          io.to(previousHighestBidderID).emit("bid-alert-highest-bidder", {
            auctionItemName,
          });
        }
      }
      // to all the users
      io.emit("bid-alert-users", {  bid, itemName });

      // to that seller
      if (sellerEmail && userSocketMap.has(sellerEmail)) {
        let sellerId = userSocketMap.get(sellerEmail);
        io.to(sellerId).emit("bid-alert-seller", {
          bid,
          itemName,
        });
      
        // updating higest bid
      io.emit("item-price-alert",{itemName,sellerEmail,bid})

      }
    }
  );

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
