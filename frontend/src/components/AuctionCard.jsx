import { useEffect, useState } from "react";
import HighestBid from "./HighestBid";
import PlaceBid from "./PlaceBid";
import { auctionCard as styles } from "../stylesheets/styles.js";
import { IoTimeOutline } from "react-icons/io5";
import { useSelector } from "react-redux";

export default function AuctionCard({ data }) {
  const [dateRelated, setDateRelated] = useState({
    countdown: "",
    status: "loading" // "loading", "upcoming", "live", "ended"
  });

  const socket = useSelector((state)=>state.socketClient.socket)

  useEffect(() => {
    const updateCountdown = () => {
      // Parse DD-MM-YYYY into proper Date
      const [day, month, year] = data.liveDate.split("-");
      const liveDate = new Date(`${year}-${month}-${day}`);
      const now = new Date();

      if (liveDate > now) {
        // Auction hasn't started yet
        const diffMs = liveDate - now;
        const minutes = Math.floor(diffMs / (1000 * 60));
        const seconds = Math.floor((diffMs / 1000) % 60);

        setDateRelated({
          countdown: `${minutes}m ${seconds}s`,
          status: "upcoming"
        });
      } else {
        // Auction started → add duration in minutes
        const endDate = new Date(liveDate.getTime() + data.duration * 60 * 1000);
        const remainingMs = endDate - now;

        if (remainingMs > 0) {
          const minutes = Math.floor(remainingMs / (1000 * 60));
          const seconds = Math.floor((remainingMs / 1000) % 60);

          setDateRelated({
            countdown: `${minutes}m ${seconds}s`,
            status: "live"
          });
        } else {
          // Auction ended
          setDateRelated({
            countdown: "Auction ended",
            status: "ended"
          });
          socket.emit("auction-end",{itemName:data.itemName,sellerEmail:data.sellerEmail})
          
        }
      }
    };

    updateCountdown(); // run immediately
    const interval = setInterval(updateCountdown, 1000); // update every second

    return () => clearInterval(interval); // cleanup
  }, [data.liveDate, data.duration]);

  return (
    <div style={styles.card}>
      <div style={styles.contentWrapper}>
        <div>
          <h3 style={styles.header}>{data.itemName || "Auction Item"}</h3>
          <p style={styles.description}>
            {data.description || "No description provided."}
          </p>
        </div>

        <div style={styles.detailsGrid}>
          <div style={styles.detailItem}>
            <span style={styles.detailLabel}>Starting Price</span>
            <strong>
              {data.desiredStartingPrice ? `₹${data.desiredStartingPrice}` : "—"}
            </strong>
          </div>
          <div style={styles.detailItem}>
            <span style={styles.detailLabel}>Bid Increment</span>
            <strong>
              {data.bidIncrement ? `₹${data.bidIncrement}` : "—"}
            </strong>
          </div>
          <div style={styles.detailItem}>
            <span style={styles.detailLabel}>Live Date</span>
            <strong>{data.liveDate || "Not scheduled"}</strong>
          </div>
          <div style={styles.detailItem}>
            <span style={styles.detailLabel}>Duration</span>
            <strong>
              {data.duration ? `${data.duration} minutes` : "—"}
            </strong>
          </div>
          {dateRelated.status !== "ended" && (
            <div style={styles.detailItem}>
              <span style={styles.detailLabel}>
                {dateRelated.status === "live" ? "Time left" : "Starts in"}
              </span>
              <strong>{dateRelated.countdown || "—"}</strong>
            </div>
          )}
        </div>
      </div>

      <hr style={styles.divider} />

      {(() => {
        switch (dateRelated.status) {
          case "live":
            return (
              <div>
                <HighestBid
                  itemName={data.itemName}
                  sellerEmail={data.sellerEmail}
                  startingPrice={data.desiredStartingPrice}
                />
                <PlaceBid
                  itemName={data.itemName}
                  sellerEmail={data.sellerEmail}
                  sellerName={data.sellerName}
                  bidIncrement={data.bidIncrement}
                  startingPrice={data.desiredStartingPrice}
                />
              </div>
            );
          case "upcoming":
            return (
              <div style={styles.notLiveContainer}>
                <IoTimeOutline style={styles.notLiveIcon} />
                <p style={styles.notLiveText}>Bidding hasn't started yet.</p>
              </div>
            );
          case "ended":
            return (
              <div style={styles.notLiveContainer}>
                <p style={styles.notLiveText}>
                  This auction has ended. The results have been announced,<br/> <br/>Please check your email if you placed a bid on this item.
                </p>
              </div>
            );
          default:
            return null;
        }
      })()}
    </div>
  );
}
