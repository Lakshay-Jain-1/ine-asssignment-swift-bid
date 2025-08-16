import { useState } from "react";
import { useSelector } from "react-redux";
import { sellerForm as styles } from "../stylesheets/styles.js";
import { toast } from 'react-toastify';
import { supabase } from "../supabase-client.js";
export default function SellerForm() {

    const socket = useSelector((state) => state.socketClient.socket);
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
            [`${name}Raw`]: value,
            [name]: `${day}-${month}-${year}`
        }));
    };


    const handleSubmit = async (e) => {
        e.preventDefault();

        // 1. Authenticate user from Supabase
        const { data: { user }, error } = await supabase.auth.getUser();
        if (error || !user) {
            toast.error("Please login before auctioning an item");
            return;
        }

        // 2. Embed seller’s actual username + email
        const date = new Date();
        let nowTime = `${date.getDate()}-${date.getMonth() + 1}-${date.getFullYear()}`;

        const updatedSeller = {
            ...seller,
            sellerName: user.user_metadata?.full_name || user.email,
            sellerEmail: user.email,
            postDate: nowTime,
        };

        socket.emit("register-user", updatedSeller.sellerEmail);
        socket.emit("auction-card", updatedSeller);

        toast(`Now this item ${seller.itemName} will get auctioned`);
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
                        <label style={styles.label}>Duration (in minutes):</label>
                        <input
                            style={styles.input}
                            type="number"
                            name="duration"
                            value={seller.duration}
                            onChange={handleChange}
                            step="1"
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
        </>
    );
}