import { useState } from "react";
import { useSelector } from "react-redux";
import styles from "../stylesheets/sellerForm.module.css";
import { toast } from "react-toastify";
import { supabase } from "../supabase-client.js";

export default function SellerForm() {
  const socket = useSelector((state) => state.socketClient.socket);

  const [seller, setSeller] = useState({
    itemName: "",
    description: "",
    desiredStartingPrice: "",
    bidIncrement: "",
    liveDateRaw: "",   // yyyy-mm-dd from date input
    liveTime: "",      // "HH:MM"
    duration: "2"
  });

  const handleChange = (e) => {
    const { name, value } = e.target;
    setSeller((prev) => ({ ...prev, [name]: value }));
  };

  const handleChangeDate = (e) => {
    const { name, value } = e.target;
    setSeller((prev) => ({ ...prev, [name]: value }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    if (parseInt(seller.duration, 10) < 2) {
      toast.error("Duration should be greater than or equal to 2 minutes");
      return;
    }

    const [yearStr, monthStr, dayStr] = seller.liveDateRaw.split("-");
    if (!yearStr || !monthStr || !dayStr) {
      toast.error("Invalid date selected");
      return;
    }
    const year = Number(yearStr);
    const month = Number(monthStr);
    const day = Number(dayStr);

    const [hoursStr, minutesStr] = seller.liveTime.split(":");
    const hours = Number(hoursStr || 0);
    const minutes = Number(minutesStr || 0);

    const selectedDateTime = new Date(year, month - 1, day, hours, minutes);
    const now = new Date();
    if (selectedDateTime <= now) {
      toast.error("Auction start time must be in the future");
      return;
    }

    const { data: { user }, error: userError } = await supabase.auth.getUser();
    if (userError || !user) {
      toast.error("Please login before auctioning an item");
      return;
    }

    const createdAt = new Date();
    const postDate = `${createdAt.getDate()}-${createdAt.getMonth() + 1}-${createdAt.getFullYear()}`;

    const formattedDay = day;       // 24
    const formattedMonth = month;   // 8
    const formattedYear = year;     // 2025
    const liveDateTime = `${formattedDay}-${formattedMonth}-${formattedYear} ${seller.liveTime}`;

    const updatedSeller = {
      itemName: seller.itemName,
      description: seller.description,
      desiredStartingPrice: Number(seller.desiredStartingPrice) || 0,
      bidIncrement: Number(seller.bidIncrement) || 0,
      duration: Number(seller.duration) || 0,
      liveDateTime,                
      sellerEmail: user.email,
      postDate,
      status: "upcoming"
    };

    try {
      socket.emit("register-user", updatedSeller.sellerEmail);
      socket.emit("auction-card", updatedSeller);
    } catch (err) {
      console.warn("Socket emit failed:", err);
    }

    toast(`Now this item "${seller.itemName}" will get auctioned`);
  };

  const today = new Date().toISOString().split("T")[0]; // YYYY-MM-DD
  const nowForMinTime = new Date();
  const currentTime = nowForMinTime.getHours().toString().padStart(2, "0") + ":" +
                      nowForMinTime.getMinutes().toString().padStart(2, "0");

  return (
    <form onSubmit={handleSubmit} className={styles.formContainer}>
      <h2 className={styles.header}>Create a New Auction</h2>

      <div className={styles.inputGroup}>
        <label className={styles.label}>Item Name:</label>
        <input
          className={styles.input}
          type="text"
          name="itemName"
          value={seller.itemName}
          onChange={handleChange}
          required
        />
      </div>

      <div className={styles.inputGroup}>
        <label className={styles.label}>Description:</label>
        <textarea
          className={styles.textarea}
          name="description"
          value={seller.description}
          onChange={handleChange}
          required
        />
      </div>

      <div className={styles.row}>
        <div className={styles.inputGroup}>
          <label className={styles.label}>Desired Starting Price (₹):</label>
          <input
            className={styles.input}
            type="number"
            name="desiredStartingPrice"
            value={seller.desiredStartingPrice}
            onChange={handleChange}
            min="1"
            required
          />
        </div>

        <div className={styles.inputGroup}>
          <label className={styles.label}>Bid Increment (₹):</label>
          <input
            className={styles.input}
            type="number"
            name="bidIncrement"
            value={seller.bidIncrement}
            onChange={handleChange}
            min="1"
            required
          />
        </div>
      </div>

      <div className={styles.row}>
        <div className={styles.inputGroup}>
          <label className={styles.label}>Live Date:</label>
          <input
            className={styles.input}
            type="date"
            name="liveDateRaw"
            min={today}
            value={seller.liveDateRaw}
            onChange={handleChangeDate}
            required
          />
        </div>

        <div className={styles.inputGroup}>
          <label className={styles.label}>Live Time:</label>
          <input
            className={styles.input}
            type="time"
            name="liveTime"
            value={seller.liveTime}
            onChange={handleChange}
            min={seller.liveDateRaw === today ? currentTime : undefined}
            required
          />
        </div>
      </div>

      <div className={styles.inputGroup}>
        <label className={styles.label}>Duration (in minutes):</label>
        <input
          className={styles.input}
          type="number"
          name="duration"
          value={seller.duration}
          onChange={handleChange}
          min="2"
          step="1"
          required
        />
      </div>

      <button
        type="submit"
        className={styles.button}
        onMouseOver={(e) => e.currentTarget.style.backgroundColor = "#526D82"}
        onMouseOut={(e) => e.currentTarget.style.backgroundColor = "#27374D"}
      >
        Post Item
      </button>
    </form>
  );
}
