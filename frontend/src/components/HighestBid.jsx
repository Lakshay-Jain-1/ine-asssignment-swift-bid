import { useEffect, useState } from "react";
import { useSelector } from "react-redux";

export default function HighestBid({ itemName, sellerEmail }) {
  const socket = useSelector((state) => state.socketClient.socket);
  const [highestBid, setHighestBid] = useState(null);

  // --- Style Objects ---
  const styles = {
    container: {
      marginBottom: '12px',
      padding: '12px',
      borderRadius: '8px',
      backgroundColor: '#DDE6ED', // Updated color
      textAlign: 'center',
    },
    text: {
      margin: 0,
      fontSize: '1em',
      color: '#526D82', // Updated color
    },
    amount: {
      fontWeight: 'bold',
      marginLeft: '8px',
      color: '#27374D', // Updated color
    },
    noBidText: {
        margin: 0,
        fontSize: '1em',
        color: '#526D82', // Updated color
        fontStyle: 'italic',
    }
  };


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