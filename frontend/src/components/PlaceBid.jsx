import { useState } from "react";
import { useSelector } from "react-redux";
import { supabase } from "../supabase-client";
import { placeBid as styles } from "../stylesheets/styles.js";
export default function PlaceBid({ itemName, sellerEmail, sellerName }) {
  const [bidAmount, setBidAmount] = useState("");
  const socket = useSelector((state) => state.socketClient.socket);

  async function sendAmount() {
    if (!bidAmount) return; 
    const { data, error } = await supabase.auth.getUser();
    if (error || !data.user) {
        console.error("User not found");
        return;
    }
    const email = data.user.email;

    socket.emit("register-user", email);
    socket.emit("bid", {
      bid: bidAmount,
      itemName,
      sellerEmail,
      sellerName,
      buyerEmail: email,
    });
    setBidAmount("");
  }

  return (
    <div style={styles.container}>
      <input
        type="number"
        value={bidAmount}
        placeholder="Enter your bid"
        onChange={(event) => setBidAmount(event.target.value)}
        style={styles.input}
      />
      <button onClick={sendAmount} style={styles.button}>
        Place Bid
      </button>
    </div>
  );
}