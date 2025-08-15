import { useState } from "react"
import { useSelector } from "react-redux"
import { supabase } from "../supabase-client"

export default function PlaceBid({ itemName, email, name }) {
    const [bidAmount, setBidAmount] = useState()
    const socket = useSelector((state) => state.socketClient.socket)
    async function sendAmount() {
        const { data:userData,error } = supabase.auth.getUser()
        socket.on("register-user",userData.user.email)
        socket.emit("bid", { bid: bidAmount, itemName, email, "SellerName": name, "BuyerEmail": userData.user.email })
    }

    return (
        <>
            <input type="number" onChange={(event) => setBidAmount(event.target.value)} ></input>
            <button onClick={sendAmount}> Place Bid </button>

        </>
    )

}