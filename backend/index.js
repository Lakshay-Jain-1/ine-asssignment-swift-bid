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
    userSocketMap.set(email, socket.id);
  });

  socket.on("bid", async ({ bid, itemName, email, SellerName, BuyerEmail }) => {
    // major flaw with this logic is that we are assuming that bid will always be bigger
    // but this is how usually it happens
    // in frontend will make sure that bid amount can't be lesser than high amount
    const { err, prevData } = await supabase
      .from("bid")
      .select(BuyerEmail)
      .eq({ itemName, email });
    const { error } = await supabase
      .from("auction")
      .update(bid)
      .eq({ itemName, email });
    // to all the users
    io.emit("bid-alert-users", { highestBid: bid });
    // to that previous highest bidder
    if (userSocketMap.has(prevData.BuyerEmail)) {
      let previousHighestBidderID = userSocketMap.get(prevData.BuyerEmail);
      io.to(previousHighestBidderID).emit("bid-alert-highest-bidder", {
        itemName,
      });
    }
    // to that seller
    if (userSocketMap.has(email)) {
      let sellerId = userSocketMap.get(email);
      io.to(sellerId).emit("bid-alert-seller", { newBidAmount: bid });
    }
  });

  socket.on("disconnect", () => {
    for (const email in userSocketMap) {
      if (userSocketMap[email] === socket.id) {
        delete userSocketMap[email];
        break;
      }
    }
  });
});

const PORT = process.env.PORT_NUMBER || 3000;
httpServer.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
});
