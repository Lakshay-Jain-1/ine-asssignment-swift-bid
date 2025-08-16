import { useEffect, useState } from "react";
import HighestBid from "./HighestBid";
import PlaceBid from "./PlaceBid";
import { auctionCard as styles } from "../stylesheets/styles.js";
import { IoTimeOutline } from "react-icons/io5"; // Import the clock icon

export default function AuctionCard({ data }) {
  const [dateRelated, setDateRelated] = useState({
    countdown: "",
    status: "loading" // "loading", "upcoming", "live", "ended"
  });

  useEffect(() => {
    const updateCountdown = () => {
      const liveDateParts = data.liveDate.split("-"); // DD-MM-YYYY
      const liveDate = new Date(`${liveDateParts[2]}-${liveDateParts[1]}-${liveDateParts[0]}`);
      const now = new Date();

      if (liveDate > now) {
        // Auction hasn't started yet
        const diffMs = liveDate - now;
        const days = Math.floor(diffMs / (1000 * 60 * 60 * 24));
        const hours = Math.floor((diffMs / (1000 * 60 * 60)) % 24);
        const minutes = Math.floor((diffMs / (1000 * 60)) % 60);

        setDateRelated({
          countdown: `${days}d ${hours}h ${minutes}m`,
          status: "upcoming"
        });
      } else {
        // Auction started
        const endDate = new Date(liveDate.getTime() + data.duration * 24 * 60 * 60 * 1000);
        const remainingMs = endDate - now;

        if (remainingMs > 0) {
          const days = Math.floor(remainingMs / (1000 * 60 * 60 * 24));
          const hours = Math.floor((remainingMs / (1000 * 60 * 60)) % 24);
          const minutes = Math.floor((remainingMs / (1000 * 60)) % 60);

          setDateRelated({
            countdown: `${days}d ${hours}h ${minutes}m`,
            status: "live"
          });
        } else {
          // Auction ended
          setDateRelated({
            countdown: "Auction ended",
            status: "ended"
          });
        }
      }
    };

    updateCountdown(); // run immediately
    const interval = setInterval(updateCountdown, 60 * 1000); // update every minute

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
            <strong>{data.desiredStartingPrice ? `₹${data.desiredStartingPrice}` : "—"}</strong>
          </div>
          <div style={styles.detailItem}>
            <span style={styles.detailLabel}>Bid Increment</span>
            <strong>{data.bidIncrement ? `₹${data.bidIncrement}` : "—"}</strong>
          </div>
          <div style={styles.detailItem}>
            <span style={styles.detailLabel}>Live Date</span>
            <strong>{data.liveDate || "Not scheduled"}</strong>
          </div>
          <div style={styles.detailItem}>
            <span style={styles.detailLabel}>Duration</span>
            <strong>{data.duration ? `${data.duration} days` : "—"}</strong>
          </div>
          {/* This section is now dynamic based on auction status */}
          {dateRelated.status !== "ended" && (
            <div style={styles.detailItem}>
              <span style={styles.detailLabel}>
                {dateRelated.status === 'live' ? 'Time left' : 'Starts in'}
              </span>
              <strong>{dateRelated.countdown || "—"}</strong>
            </div>
          )}
        </div>
      </div>

      <hr style={styles.divider} />

      {/* Renders different UI based on the auction's status */}
      {(() => {
        switch (dateRelated.status) {
          case 'live':
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
          case 'upcoming':
            return (
              <div style={styles.notLiveContainer}>
                <IoTimeOutline style={styles.notLiveIcon} />
                <p style={styles.notLiveText}>Bidding hasn't started yet.</p>
              </div>
            );
          case 'ended':
            return (
              <div style={styles.notLiveContainer}>
                <IoTimeOutline style={styles.notLiveIcon} />
                <p style={styles.notLiveText}>This auction has ended.</p>
              </div>
            );
          default:
            return null; // Or a loading spinner
        }
      })()}
    </div>
  );
}