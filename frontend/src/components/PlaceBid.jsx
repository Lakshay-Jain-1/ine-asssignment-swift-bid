import { useState } from "react"
import { useSelector } from "react-redux"

export default function PlaceBid({itemName,email}) {
    const [bidAmount, setBidAmount] = useState()
    const socket = useSelector((state) => state.socketClient.socket)
    function sendAmount() {
        socket.emit("bid",{bid:bidAmount,itemName,email})
    }

    return (
        <>
            <input type="number" onChange={(event) => setBidAmount(event.target.value)} ></input>
            <button onClick={sendAmount}> Place Bid </button>

        </>
    )

}