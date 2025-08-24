import { useEffect, useState, useRef } from "react";
import styles from "../stylesheets/auctionCard.module.css";
import { supabase } from "../supabase-client.js";

export default function CountDown({
  liveDateTime,
  duration,
  status,
  itemName,
  sellerEmail,
  onStatusChange,
  onAuctionEnd
}) {
  const [timer, setTimer] = useState("—");
  const auctionEndDateRef = useRef(null);
  const auctionEndedRef = useRef(false);

  const updateAuctionStatus = async (newStatus) => {
    try {
      const { error } = await supabase
        .from("auction")
        .update({ status: newStatus })
        .eq("itemName", itemName)
        .eq("sellerEmail", sellerEmail);

      if (error) console.error("Supabase error updating auction status:", error);
    } catch (err) {
      console.error("Error updating auction status:", err);
    }
  };

  useEffect(() => {
    if (status === "ended") {
      setTimer("Auction ended");
      return;
    }

    const updateCountdown = () => {
      if (!liveDateTime || !liveDateTime.trim()) {
        setTimer("Not scheduled");
        return;
      }

      const parts = liveDateTime.trim().split(" ");
      const datePart = parts[0];
      const timePart = parts[1] || "00:00";
      const [dayStr, monthStr, yearStr] = datePart.split("-");
      const day = Number(dayStr);
      const month = Number(monthStr);
      const year = Number(yearStr);
      const [hoursStr = "0", minutesStr = "0"] = timePart.split(":");
      const hours = Number(hoursStr);
      const minutes = Number(minutesStr);

      const auctionStartTime = new Date(year, month - 1, day, hours || 0, minutes || 0);
      const now = new Date();

      if (status === "live") {
        if (!auctionEndDateRef.current) {
          auctionEndDateRef.current = new Date(auctionStartTime.getTime() + (Number(duration) || 0) * 60 * 1000);
        }

        const remainingMs = auctionEndDateRef.current - now;
        if (remainingMs > 0) {
          const hoursLeft = Math.floor(remainingMs / (1000 * 60 * 60));
          const minutesLeft = Math.floor((remainingMs % (1000 * 60 * 60)) / (1000 * 60));
          const secondsLeft = Math.floor((remainingMs % (1000 * 60)) / 1000);
          setTimer(hoursLeft > 0 ? `${hoursLeft}h ${minutesLeft}m ${secondsLeft}s` : `${minutesLeft}m ${secondsLeft}s`);
        } else {
          setTimer("Auction ended");
          if (!auctionEndedRef.current) {
            auctionEndedRef.current = true;
            updateAuctionStatus("ended");
            onStatusChange("ended");
            onAuctionEnd?.();
          }
        }
      } else if (status === "upcoming") {
        const diffMs = auctionStartTime - now;
        const days = Math.floor(diffMs / (1000 * 60 * 60 * 24));
        const hoursLeft = Math.floor((diffMs % (1000 * 60 * 60 * 24)) / (1000 * 60 * 60));
        const minutesLeft = Math.floor((diffMs % (1000 * 60 * 60)) / (1000 * 60));
        const secondsLeft = Math.floor((diffMs % (1000 * 60)) / 1000);

        if (days > 0) {
          setTimer(`${days}d ${hoursLeft}h ${minutesLeft}m`);
        } else if (hoursLeft > 0) {
          setTimer(`${hoursLeft}h ${minutesLeft}m ${secondsLeft}s`);
        } else {
          setTimer(`${minutesLeft}m ${secondsLeft}s`);
        }

        if (diffMs <= 0) {
          updateAuctionStatus("live");
          onStatusChange("live");
          auctionEndDateRef.current = null;
        }
      }
    };

    updateCountdown();
    const interval = setInterval(updateCountdown, 1000);
    return () => clearInterval(interval);
  }, [liveDateTime, duration, status, onStatusChange, onAuctionEnd, itemName, sellerEmail]);

  useEffect(() => {
    if (status !== "ended") auctionEndedRef.current = false;
    if (status === "live") auctionEndDateRef.current = null;
  }, [status]);

  return (
    <div className={styles.detailItem}>
      <span className={styles.detailLabel}>
        {status === "live" ? "Time left" : status === "upcoming" ? "Starts in" : "Status"}
      </span>
      <strong>{timer}</strong>
    </div>
  );
}
