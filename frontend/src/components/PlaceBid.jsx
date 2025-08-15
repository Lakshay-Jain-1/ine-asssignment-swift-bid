import { useState } from "react";
import { useSelector } from "react-redux";
import { supabase } from "../supabase-client";

export default function PlaceBid({ itemName, sellerEmail, sellerName }) {
  const [bidAmount, setBidAmount] = useState("");
  const socket = useSelector((state) => state.socketClient.socket);

  // --- Style Objects ---
const styles = {
    container: {
      display: "flex",
      gap: "8px", 
      flexDirection:"column",
      position:"relative",
      marginBottom: "30px", 
    },
    input: {
      flex: 1,
      padding: "10px 12px",
      border: "1px solid #9DB2BF", // Updated theme color
      borderRadius: "6px",
      fontSize: "1em",
      outline: 'none',
      color: '#27374D', // Updated theme color
    },
    button: {
      padding: "10px 20px",
      border: "none",
      borderRadius: "12px",
      backgroundColor: "#27374D", // Updated theme color
      color: "white",
      fontSize: "1em",
      fontWeight: "bold",
      cursor: "pointer",
      width:"160px",
      height:"40px",
      position:"absolute",
      bottom:"-65px",
      left:"75px",
      transition: 'background-color 0.2s', // Smooth transition for hover
    },
  };

  async function sendAmount() {
    if (!bidAmount) return; // Prevent empty bids
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
    setBidAmount(""); // Clear input after placing bid
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