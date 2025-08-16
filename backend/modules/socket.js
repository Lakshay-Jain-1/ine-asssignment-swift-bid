import { handleAuctionCard, handleRegisterUser } from "./socketHandlers/auctionHandlers.js";
import { handleBid } from "./socketHandlers/bidHandler.js";
import { handleAuctionEnd } from "./socketHandlers/auctionEndHandler.js";

export function setupSockets(io, supabase, userSocketMap) {
  io.on("connection", (socket) => {
    console.log(`New client connected: ${socket.id}`);

    socket.on("auction-card", (data) => handleAuctionCard(socket, io, supabase, data));
    socket.on("register-user", (email) => handleRegisterUser(socket, userSocketMap, email));
    socket.on("bid", (bidData) => handleBid(socket, io, supabase, userSocketMap, bidData));
    socket.on("auction-end", ({ itemName, sellerEmail }) => handleAuctionEnd(socket, io, supabase, itemName, sellerEmail));

    socket.on("disconnect", () => {
      for (let [email, id] of userSocketMap.entries()) {
        if (id === socket.id) {
          userSocketMap.delete(email);
          break;
        }
      }
    });
  });
}
