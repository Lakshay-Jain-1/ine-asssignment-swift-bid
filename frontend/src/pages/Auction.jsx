import { useEffect, useState } from "react";
import { useSelector } from "react-redux";
import AuctionCard from "../components/AuctionCard";
import { supabase } from "../supabase-client";
import AlertHighestBidder from "../components/AlertHighestBidder";
import AlertAllUsers from "../components/AlertAllUsers";
import { auction as styles } from "../stylesheets/styles.js";
export const Auction = () => {
    const socket = useSelector((state) => state.socketClient.socket);
    const [auctionData, setAuctionData] = useState([]);
    const [loading, setLoading] = useState(true);

    
    useEffect(() => {
        const fetchAuctionData = async () => {
            setLoading(true);
            const { error, data } = await supabase.from("auction").select("*");
            if (data) {
                setAuctionData(data);
            }
            setLoading(false);
        };

        fetchAuctionData();
    }, []);

    useEffect(() => {
        if (!socket) return;
        
        const handleNewAuction = (newCardData) => {
            setAuctionData((prev) => [...prev, newCardData]);
        };

        socket.on("auction-cards", handleNewAuction);

        return () => {
            socket.off("auction-cards", handleNewAuction);
        };
    }, [socket]);

    if (loading) {
        return <div style={styles.messageText}>Loading auctions... ⏳</div>;
    }

    return (
        <>
              
        <div style={styles.pageContainer}>
            {auctionData.length > 0 ? (
                <div style={styles.gridContainer}>
                    {auctionData.map((ele) => (
                        <div key={ele.id || `${ele.itemName}-${ele.sellerEmail}`}>
                            <AuctionCard data={ele} />
                        </div>
                    ))}
                </div>
            ) : (
                <div style={styles.messageText}>No active auctions found. 😢</div>
            )}

         
            <AlertHighestBidder />
            <AlertAllUsers />
        </div>
        </>
    );
};