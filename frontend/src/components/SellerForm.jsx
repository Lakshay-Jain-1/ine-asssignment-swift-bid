import { useState } from "react";
import { useSelector } from "react-redux";
import { ToastContainer, toast } from 'react-toastify';
import { sellerForm as styles } from "../stylesheets/styles.js";
export default function SellerForm() {

    const socket = useSelector((state) => state.socketClient.socket);
    const notify = () => toast('Not authenticated !');
    const [seller, setSeller] = useState({
        itemName: "",
        description: "",
        desiredStartingPrice: "",
        bidIncrement: "",
        liveDate: "",
        duration: ""
    });

    const handleChange = (e) => {
        const { name, value } = e.target;
        setSeller((prev) => ({ ...prev, [name]: value }));
    };

    const handleChangeDate = (e) => {
        const { name, value } = e.target;
        if (!value) return;
        const [year, month, day] = value.split("-");
        setSeller((prev) => ({
            ...prev,
            [`${name}Raw`]: value, // for binding the date picker
            [name]: `${day}-${month}-${year}`
        }));
    };

    const handleSubmit = (e) => {
        e.preventDefault();
        console.log("Seller Data:", seller);
        // first i willl autheticate from supabase client then send info to the backend else will notify them
        // embed seller's username and email also
        // doing hardcode right now
        let date = new Date();
        let nowTime = `${date.getDate()}-${date.getMonth() + 1}-${date.getFullYear()}`;
        const updatedSeller = { ...seller, sellerName: "Lakshay", sellerEmail: "jainlakshay502@gmail.com", postDate: nowTime };
        let email = updatedSeller.sellerEmail;
        socket.emit("register-user", email);
        socket.emit("auction-card", updatedSeller);
        toast(`Now this item ${seller.itemName} will get auctioned`)
    };

    return (
        <>
            <form onSubmit={handleSubmit} style={styles.formContainer}>
                <h2 style={styles.header}>Create a New Auction</h2>

                <div style={styles.inputGroup}>
                    <label style={styles.label}>Item Name:</label>
                    <input
                        style={styles.input}
                        type="text"
                        name="itemName"
                        value={seller.itemName}
                        onChange={handleChange}
                        required
                    />
                </div>

                <div style={styles.inputGroup}>
                    <label style={styles.label}>Description:</label>
                    <textarea
                        style={styles.textarea}
                        name="description"
                        value={seller.description}
                        onChange={handleChange}
                        required
                    />
                </div>

                <div style={styles.row}>
                    <div style={styles.inputGroup}>
                        <label style={styles.label}>Desired Starting Price (₹):</label>
                        <input
                            style={styles.input}
                            type="number"
                            name="desiredStartingPrice"
                            value={seller.desiredStartingPrice}
                            onChange={handleChange}
                            required
                        />
                    </div>

                    <div style={styles.inputGroup}>
                        <label style={styles.label}>Bid Increment (₹):</label>
                        <input
                            style={styles.input}
                            type="number"
                            name="bidIncrement"
                            value={seller.bidIncrement}
                            onChange={handleChange}
                            required
                        />
                    </div>
                </div>

                <div style={styles.row}>
                    <div style={styles.inputGroup}>
                        <label style={styles.label}>Live Date:</label>
                        <input
                            style={styles.input}
                            type="date"
                            name="liveDate"
                            value={seller.liveDateRaw || ""}
                            onChange={handleChangeDate}
                            required
                        />
                    </div>

                    <div style={styles.inputGroup}>
                        <label style={styles.label}>Duration (in days):</label>
                        <input
                            style={styles.input}
                            type="number"
                            name="duration"
                            value={seller.duration}
                            onChange={handleChange}
                            required
                        />
                    </div>
                </div>

                <button 
                    type="submit" 
                    style={styles.button}
                    onMouseOver={(e) => e.currentTarget.style.backgroundColor = '#526D82'}
                    onMouseOut={(e) => e.currentTarget.style.backgroundColor = '#27374D'}
                >
                    Post Item
                </button>
            </form>
            <ToastContainer autoClose={1000} />
        </>
    );
}