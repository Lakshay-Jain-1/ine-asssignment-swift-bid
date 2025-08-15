import { useState } from "react"
import { useSelector } from "react-redux"
import { supabase } from "../supabase-client"

export default function PlaceBid({ itemName, sellerEmail, sellerName }) {
    const [bidAmount, setBidAmount] = useState()
    const socket = useSelector((state) => state.socketClient.socket)
    async function sendAmount() {
        const { data, error } = await supabase.auth.getUser()
        const email = data.user.email;

        // Register user in userSocketMap
        console.log("ema",email)
        socket.emit("register-user", email);
        socket.emit("bid", { bid: bidAmount, itemName, sellerEmail, sellerName, "buyerEmail": data.user.email })
    }

    return (
        <>
            <input type="number" onChange={(event) => setBidAmount(event.target.value)} ></input>
            <button onClick={sendAmount}> Place Bid </button>

        </>
    )

}