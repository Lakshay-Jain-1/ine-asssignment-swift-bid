import { useEffect, useState } from "react";
import { useSelector } from "react-redux";
import AuctionCard from "../components/AuctionCard";
import { supabase } from "../supabase-client";
import AlertHighestBidder from "../components/AlertHighestBidder";
import AlertAllUsers from "../components/AlertAllUsers";

export const Auction = () => {
    const socket = useSelector((state) => state.socketClient.socket);
    const [auctionData, setAuctionData] = useState([]);
    const [loading, setLoading] = useState(true); // Added loading state

    // --- Style objects for cleaner JSX ---
    const styles = {
        pageContainer: {
            padding: "24px",
            backgroundColor: "#DDE6ED", // Updated color
            minHeight: "100vh",
        },
        gridContainer: {
            display: "grid",
            gridTemplateColumns: "repeat(auto-fit, minmax(350px, 1fr))",
            gap: "24px",
            placeItems:"center" 
        },
        messageText: {
            textAlign: 'center',
            fontSize: '3em',
            color: '#27374D',
            backgroundColor: "#DDE6ED",
            width:"100vw",
            height:"100vh",
            display:"flex",
            justifyContent:"center",
            alignItems:"center",
            fontWeight:"900"
        }
    };
    
    
    useEffect(() => {
        const fetchAuctionData = async () => {
            setLoading(true);
            const { error, data } = await supabase.from("auction").select("*");
            if (data) {
                setAuctionData(data);
            }
            setLoading(false); // Stop loading after data is fetched
        };

        fetchAuctionData();
    }, []);

    useEffect(() => {
        if (!socket) return;
        
        const handleNewAuction = (newCardData) => {
            // Avoid adding duplicates if the card already exists
            setAuctionData((prev) => 
                prev.some(card => card.id === newCardData.id) ? prev : [...prev, newCardData]
            );
        };

        socket.on("auction-cards", handleNewAuction);

        return () => {
            socket.off("auction-cards", handleNewAuction);
        };
    }, [socket]);

    // --- Loading and Empty State Handling ---
    if (loading) {
        return <div style={styles.messageText}>Loading auctions... ⏳</div>;
    }

    return (
        <div style={styles.pageContainer}>
            {auctionData.length > 0 ? (
                <div style={styles.gridContainer}>
                    {auctionData.map((ele) => (
                        // The key prop must be on the outermost element in the map
                        <div key={ele.id || `${ele.itemName}-${ele.sellerEmail}`}>
                            <AuctionCard data={ele} />
                        </div>
                    ))}
                </div>
            ) : (
                <div style={styles.messageText}>No active auctions found. 😢</div>
            )}

            {/* Alerts are kept here, assuming they are self-positioning (e.g., toasts) */}
            <AlertHighestBidder />
            <AlertAllUsers />
        </div>
    );
};