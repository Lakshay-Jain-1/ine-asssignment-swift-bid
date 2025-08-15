import { useState } from "react";
import { useSelector } from "react-redux";
import { ToastContainer, toast } from 'react-toastify';
export default function SellerForm() {

    const socket = useSelector((state) => state.socketClient.socket)
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
        let date = new Date()
        let nowTime = `${date.getDate()}-${date.getMonth() + 1}-${date.getFullYear()}`
        const updatedSeller = { ...seller, sellerName: "Lakshay", sellerEmail: "jainlakshay502@gmail.com", postDate: nowTime };
        let email = updatedSeller.sellerEmail
        socket.emit("register-user", email)
        socket.emit("auction-card", updatedSeller);

    };

    return (
        <>
            <form onSubmit={handleSubmit}>
                <div>
                    <label>Item Name:</label>
                    <input
                        type="text"
                        name="itemName"
                        value={seller.itemName}
                        onChange={handleChange}
                        required
                    />
                </div>

                <div>
                    <label>Description:</label>
                    <textarea
                        name="description"
                        value={seller.description}
                        onChange={handleChange}
                        required
                    />
                </div>

                <div>
                    <label>Desired Starting Price:</label>
                    <input
                        type="number"
                        name="desiredStartingPrice"
                        value={seller.desiredStartingPrice}
                        onChange={handleChange}
                        required
                    />
                </div>

                <div>
                    <label>Bid Increment:</label>
                    <input
                        type="number"
                        name="bidIncrement"
                        value={seller.bidIncrement}
                        onChange={handleChange}
                        required
                    />
                </div>

                <div>
                    <label>Live Date:</label>
                    <input
                        type="date"
                        name="liveDate"
                        value={seller.liveDateRaw || ""}
                        onChange={handleChangeDate}
                        required
                    />
                </div>

                <div>
                    <label>Duration (in days):</label>
                    <input
                        type="number"
                        name="duration"
                        value={seller.duration}
                        onChange={handleChange}
                        required
                    />
                </div>

                <button type="submit">Post Item</button>
            </form>
            <ToastContainer autoClose={1000} />
        </>
    );
}
