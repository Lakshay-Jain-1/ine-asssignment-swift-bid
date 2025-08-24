import { useEffect, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { push, replace } from "../store/features/highestBid.js";
import styles from "../stylesheets/highestBid.module.css";
import { supabase } from "../supabase-client.js";


export default function HighestBid({ itemName, sellerEmail, startingPrice }) {
  const socket = useSelector((state) => state.socketClient.socket);
  let highestBidList = useSelector((state) => state.highestBid.highestBid);
  const [highestBid, setHighestBid] = useState(null);
  const dispatch = useDispatch();

  useEffect(() => {
    const fetchInitialBid = async () => {
      const { data, error } = await supabase
        .from("bid")
        .select("*")
        .eq("itemName", itemName)
        .eq("sellerEmail", sellerEmail)
        .order("bid", { ascending: false })
        .limit(1);

      if (error) {
        console.error("Error fetching initial bid:", error);
        return;
      }

      if (data && data.length > 0) {
        const topBid = data[0];
        setHighestBid(topBid.bid);
        dispatch(
          replace([
            ...highestBidList.filter(
              (bid) =>
                !(
                  bid.itemName === itemName &&
                  bid.sellerEmail === sellerEmail
                )
            ),
            { itemName, sellerEmail, bid: topBid.bid },
          ])
        );
      } else {
        setHighestBid(startingPrice);
        dispatch(push({ itemName, sellerEmail, bid: startingPrice }));
      }
    };

    fetchInitialBid();
  }, [itemName, sellerEmail]);

  useEffect(() => {
    if (!socket) return;

    const handleItemPriceAlert = (data) => {
      if (data.itemName === itemName && data.sellerEmail === sellerEmail) {
        const updatedList = highestBidList
          .filter(
            (bid) =>
              !(
                bid.itemName === data.itemName &&
                bid.sellerEmail === data.sellerEmail
              )
          )
          .concat({
            itemName: data.itemName,
            sellerEmail: data.sellerEmail,
            bid: data.bid,
          });
        setHighestBid(data.bid);
        dispatch(replace(updatedList));
      }
    };

    socket.on("item-price-alert", handleItemPriceAlert);

    return () => {
      socket.off("item-price-alert", handleItemPriceAlert);
    };
  }, [socket, itemName, sellerEmail]);

  return (
    <div className={styles.container}>
      {highestBid!=startingPrice? (
        <p className={styles.text}>
          Highest Bid: <span className={styles.amount}>₹{highestBid}</span>
        </p>
      ) : (
        <p className={styles.noBidText}>Be the first to bid!</p>
      )}
    </div>
  );
}
