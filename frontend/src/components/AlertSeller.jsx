import { useEffect } from "react";
import { useSelector } from "react-redux";
import { toast } from 'react-toastify';
export default function AlertSeller() {
    const socket = useSelector((state) => state.socketClient.socket);

    useEffect(() => {
        if (!socket) return;

        const handleBidAlert = (data) => {
            toast(`For this item ${data.itemName} highest Bid Amount ${data.bid}`);
        };

        socket.on("bid-alert-seller", handleBidAlert);

        return () => {
            socket.off("bid-alert-seller", handleBidAlert);
        };
    }, [socket]);

    return null;
}
