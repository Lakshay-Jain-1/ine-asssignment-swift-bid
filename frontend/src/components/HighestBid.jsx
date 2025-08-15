import { useEffect, useState } from "react";
import { useSelector } from "react-redux";
import { highestBid as styles } from "../stylesheets/styles.js";
export default function HighestBid({ itemName, sellerEmail }) {
  const socket = useSelector((state) => state.socketClient.socket);
  const [highestBid, setHighestBid] = useState(null);



  useEffect(() => {
    if (!socket) return;

    const handleItemPriceAlert = (data) => {
      if (data.itemName === itemName && data.sellerEmail === sellerEmail) {
        setHighestBid(data.bid);
      }
    };

    socket.on("item-price-alert", handleItemPriceAlert);

    return () => {
      socket.off("item-price-alert", handleItemPriceAlert);
    };
  }, [socket, itemName, sellerEmail]);

  return (
    <div style={styles.container}>
      {highestBid ? (
        <p style={styles.text}>
          Highest Bid: <span style={styles.amount}>₹{highestBid}</span>
        </p>
      ) : (
        <p style={styles.noBidText}>Be the first to bid!</p>
      )}
    </div>
  );
}