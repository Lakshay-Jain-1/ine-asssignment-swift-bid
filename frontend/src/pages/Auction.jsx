import { useEffect, useState } from "react";
import { useSelector } from "react-redux";
import AuctionCard from "../components/AuctionCard";
import { supabase } from "../supabase-client";
import AlertHighestBidder from "../components/AlertHighestBidder";
import AlertAllUsers from "../components/AlertAllUsers";
import styles from "../stylesheets/auction.module.css";

export const Auction = () => {
    const socket = useSelector((state) => state.socketClient.socket);
    const [auctionData, setAuctionData] = useState([]);
    const [loading, setLoading] = useState(true);

    
    useEffect(() => {
        const fetchAuctionData = async () => {
            setLoading(true);
            const { error, data } = await supabase.from("auction").select("*").order("id", { ascending: true }); 
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
        return <div className={styles.messageText}>Loading auctions... ⏳</div>;
    }

    return (
        <>
        <div className={styles.pageContainer}>
            {auctionData.length > 0 ? (
                <div className={styles.gridContainer}>
                    {auctionData.map((ele) => (
                        <div key={ele.id || `${ele.itemName}-${ele.sellerEmail}`}>
                            <AuctionCard data={ele} />
                        </div>
                    ))}
                </div>
            ) : (
                <div className={styles.messageText}>No active auctions found. 😢</div>
            )}
            
            <AlertHighestBidder />
            <AlertAllUsers />
        </div>
        </>
    );
};