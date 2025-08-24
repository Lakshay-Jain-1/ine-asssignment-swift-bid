import { useEffect } from "react"
import { useSelector } from "react-redux"
import { toast } from 'react-toastify';

export default function AlertHighestBidder() {
    const socket = useSelector((state) => state.socketClient.socket);
    const handleOutbid = ({ auctionItemName }) => {
        toast(`You have been outbid for this item: ${auctionItemName}`);
    };

    useEffect(() => {
        if (!socket) return;
        socket.on("bid-alert-highest-bidder", handleOutbid);

        return () => {
            socket.off("bid-alert-highest-bidder", handleOutbid);
        };
    }, [socket]);

    return null;
}
