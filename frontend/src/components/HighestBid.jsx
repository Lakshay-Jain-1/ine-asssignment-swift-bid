import { useEffect, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { push, replace } from "../store/features/highestBid.js";
import { highestBid as styles } from "../stylesheets/styles.js";

export default function HighestBid({ itemName, sellerEmail, startingPrice }) {
  const socket = useSelector((state) => state.socketClient.socket);
  let highestBidList = useSelector((state) => state.highestBid.highestBid);
  const [highestBid, setHighestBid] = useState(null);
  const dispatch = useDispatch()
  useEffect(() => {
    if (!highestBidList.find(bid => bid.itemName === itemName && bid.sellerEmail === sellerEmail)) {
      dispatch(push({ itemName, sellerEmail, bid: startingPrice }));
    }
  }, []);

  useEffect(() => {
    if (!socket) return;

    const handleItemPriceAlert = (data) => {
      if (data.itemName === itemName && data.sellerEmail === sellerEmail) {
        const updatedList = highestBidList
          .filter(bid => !(bid.itemName === data.itemName && bid.sellerEmail === data.sellerEmail))
          .concat({ itemName: data.itemName, sellerEmail: data.sellerEmail, bid: data.bid });
        setHighestBid(data.bid)
        dispatch(replace(updatedList));
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