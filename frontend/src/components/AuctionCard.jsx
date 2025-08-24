import { useEffect, useState } from "react";
import HighestBid from "./HighestBid";
import PlaceBid from "./PlaceBid";
import styles from "../stylesheets/auctionCard.module.css";
import { IoTimeOutline } from "react-icons/io5";
import { useSelector } from "react-redux";
import CountDown from "./Countdown.jsx";
import { supabase } from "../supabase-client.js";

export default function AuctionCard({ data }) {
  const [status, setStatus] = useState("loading");
  const [auctionProcessed, setAuctionProcessed] = useState(false);
  const socket = useSelector((state) => state.socketClient.socket);

  useEffect(() => {
    const fetchAuctionStatus = async () => {
      try {
        const { data: auctionData, error } = await supabase
          .from("auction")
          .select("status")
          .eq("itemName", data.itemName)
          .eq("sellerEmail", data.sellerEmail)
          .single();

        if (error) {
          console.error("Supabase error fetching auction status:", error);
          calculateInitialStatus();
          return;
        }

        if (auctionData?.status === "ended") {
          setStatus("ended");
          return;
        }

        if (auctionData?.status && ["upcoming", "live", "ended"].includes(auctionData.status)) {
          setStatus(auctionData.status);
          return;
        }

        calculateInitialStatus();
      } catch (error) {
        console.error("Error fetching auction status:", error);
        calculateInitialStatus();
      }
    };

    fetchAuctionStatus();
  }, [data.liveDateTime, data.duration, data.itemName, data.sellerEmail]);

  const updateAuctionStatusInSupabase = async (newStatus) => {
    try {
      const { error } = await supabase
        .from("auction")
        .update({ status: newStatus })
        .eq("itemName", data.itemName)
        .eq("sellerEmail", data.sellerEmail);

      if (error) {
        console.error("Supabase error updating auction status:", error);
      }
    } catch (error) {
      console.error("Error updating auction status:", error);
    }
  };

  const calculateInitialStatus = async () => {
    let auctionStartTime;
    if (data.liveDateTime && data.liveDateTime.trim() && data.liveDateTime.includes(" ")) {
      const [datePart, timePart] = data.liveDateTime.trim().split(" ");
      const [dayStr, monthStr, yearStr] = datePart.split("-");
      const [hoursStr = "0", minutesStr = "0"] = (timePart || "00:00").split(":");
      const day = Number(dayStr);
      const month = Number(monthStr);
      const year = Number(yearStr);
      const hours = Number(hoursStr);
      const minutes = Number(minutesStr);
      auctionStartTime = new Date(year, month - 1, day, hours, minutes);
    } else {
      setStatus("upcoming");
      await updateAuctionStatusInSupabase("upcoming");
      return;
    }

    const now = new Date();
    const auctionEndTime = new Date(auctionStartTime.getTime() + (Number(data.duration) || 0) * 60 * 1000);

    let initialStatus;
    if (now >= auctionStartTime && now < auctionEndTime) {
      initialStatus = "live";
    } else if (auctionStartTime > now) {
      initialStatus = "upcoming";
    } else {
      initialStatus = "ended";
    }

    setStatus(initialStatus);
    await updateAuctionStatusInSupabase(initialStatus);
  };

  const handleStatusChange = (newStatus) => {
    setStatus(newStatus);
  };

  const handleAuctionEnd = () => {
    if (!auctionProcessed) {
      console.log("Auction ended, emitting auction-end for:", data.itemName);
      setAuctionProcessed(true);
      socket.emit("auction-end", {
        itemName: data.itemName,
        sellerEmail: data.sellerEmail
      });
    }
  };

  if (status === "loading") {
    return (
      <div className={styles.card}>
        <div className={styles.contentWrapper}>
          <p>Loading auction status...</p>
        </div>
      </div>
    );
  }

  const formatDateTime = () => {
    if (data.liveDateTime && data.liveDateTime.trim()) {
      return data.liveDateTime.trim();
    }
    return "Not scheduled";
  };

  return (
    <div className={styles.card}>
      <div className={styles.contentWrapper}>
        <div>
          <h3 className={styles.header}>{data.itemName || "Auction Item"}</h3>
          <p className={styles.description}>{data.description || "No description provided."}</p>
        </div>

        <div className={styles.detailsGrid}>
          <div className={styles.detailItem}>
            <span className={styles.detailLabel}>Starting Price</span>
            <strong>{data.desiredStartingPrice ? `₹${data.desiredStartingPrice}` : "—"}</strong>
          </div>

          <div className={styles.detailItem}>
            <span className={styles.detailLabel}>Bid Increment</span>
            <strong>{data.bidIncrement ? `₹${data.bidIncrement}` : "—"}</strong>
          </div>

          <div className={styles.detailItem}>
            <span className={styles.detailLabel}>Live DateTime</span>
            <strong>{formatDateTime()}</strong>
          </div>

          <div className={styles.detailItem}>
            <span className={styles.detailLabel}>Duration</span>
            <strong>{data.duration ? `${data.duration} minutes` : "—"}</strong>
          </div>

          {status !== "ended" && (
            <CountDown
              liveDateTime={data.liveDateTime}
              duration={data.duration}
              status={status}
              itemName={data.itemName}
              sellerEmail={data.sellerEmail}
              onStatusChange={handleStatusChange}
              onAuctionEnd={handleAuctionEnd}
            />
          )}
        </div>
      </div>

      <hr className={styles.divider} />

      {(() => {
        switch (status) {
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
              <div className={styles.notLiveContainer}>
                <IoTimeOutline className={styles.notLiveIcon} />
                <p className={styles.notLiveText}>Bidding hasn't started yet.</p>
              </div>
            );
          case "ended":
            return (
              <div className={styles.notLiveContainer}>
                <p className={styles.notLiveText}>
                  This auction has ended. The results have been announced.<br /><br />
                  Please check your email if you placed a bid on this item.
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
