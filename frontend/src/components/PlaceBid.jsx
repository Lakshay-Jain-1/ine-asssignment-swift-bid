import { useEffect, useState } from "react";
import { useSelector } from "react-redux";
import { supabase } from "../supabase-client";
import { placeBid as styles } from "../stylesheets/styles.js";
import { ToastContainer, toast } from 'react-toastify';
export default function PlaceBid({ itemName, sellerEmail, sellerName, bidIncrement, startingPrice }) {
  const [bidAmount, setBidAmount] = useState(startingPrice);
  const socket = useSelector((state) => state.socketClient.socket);
  let highestBidList = useSelector((state) => state.highestBid.highestBid);
  async function sendAmount() {
    const bidChecker = Number(bidIncrement) + Number(highestBidList.find(h => h.itemName === itemName)?.bid || startingPrice)
    if (!bidAmount || bidAmount < bidChecker) {
      toast(`Bid must be at least the minimum required amount. ${bidChecker}`);
      return;
    }
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
    setBidAmount(Number(bidAmount) + Number(bidIncrement));
  }

  useEffect(() => {
    const bidObj = highestBidList.find(
      ({ itemName: name, sellerEmail: email }) =>
        name === itemName && email === sellerEmail
    );

    if (bidObj) {
      setBidAmount(Number(bidObj.bid) + Number(bidIncrement));
    }
  }, [highestBidList, itemName, sellerEmail, bidIncrement]);

  return (
    <>
    <div style={styles.container}>
      <input
        type="number"
        min={bidAmount}
        value={bidAmount}
        placeholder="Enter your bid"
        onChange={(event) => setBidAmount(event.target.value)}
        style={styles.input}
      />
      <button onClick={sendAmount} className="gavel-cursor" style={styles.button}  >
        Place Bid
      </button>
    </div>
    <ToastContainer autoClose={1000} />
    </>
  );
}