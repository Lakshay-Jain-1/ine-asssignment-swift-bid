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
  const [auctionProcessed, setAuctionProcessed] = useState(false);

  const socket = useSelector((state) => state.socketClient.socket)

  useEffect(() => {
    let auctionEndDate = null;
    let auctionEndEmitted = false;
    let interval;

    const updateCountdown = () => {
      if (dateRelated.status === "ended" && dateRelated.countdown=="Auction ended") {
        return;
      }
      const [day, month, year] = data.liveDate.split("-");
      const liveDate = new Date(year, month - 1, day);
      const now = new Date();

      const sameDay =
        liveDate.getDate() === now.getDate() &&
        liveDate.getMonth() === now.getMonth() &&
        liveDate.getFullYear() === now.getFullYear();

      if (sameDay) {
        if (!auctionEndDate) {
          auctionEndDate = new Date(now.getTime() + data.duration * 60 * 1000);
        }

        const remainingMs = auctionEndDate - now;

        if (remainingMs > 0) {
          const minutes = Math.floor(remainingMs / (1000 * 60));
          const seconds = Math.floor((remainingMs / 1000) % 60);
          setDateRelated({ countdown: `${minutes}m ${seconds}s`, status: "live" });
        } else {
          setDateRelated({ countdown: "Auction ended", status: "ended" });

          if (!auctionProcessed) {
            console.log("Auction ended, emitting auction-end for:", data.itemName);
            setAuctionProcessed(true)
            socket.emit("auction-end", {
              itemName: data.itemName,
              sellerEmail: data.sellerEmail,
            });

            // Clear the interval since auction has ended
            if (interval) {
              clearInterval(interval);
            }
          }
        }
      } else if (liveDate > now) {
        const diffMs = liveDate - now;
        const minutes = Math.floor(diffMs / (1000 * 60));
        const seconds = Math.floor((diffMs / 1000) % 60);
        setDateRelated({ countdown: `${minutes}m ${seconds}s`, status: "upcoming" });
      } else {
        setDateRelated({ countdown: "Auction ended", status: "ended" });
      }
    };

    updateCountdown();
    interval = setInterval(updateCountdown, 1000);

    return () => {
      if (interval) {
        clearInterval(interval);
      }
    };
  }, [data.liveDate, data.duration, data.itemName, data.sellerEmail]);

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
                  This auction has ended. The results have been announced,<br /> <br />Please check your email if you placed a bid on this item.
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
