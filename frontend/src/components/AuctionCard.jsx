import { useEffect,useState } from "react";
import HighestBid from "./HighestBid";
import PlaceBid from "./PlaceBid";

export default function AuctionCard({ data }) {
  // --- Style Objects ---

  const [dateRelated,setDateRelated] = useState({
    date:"",
    placeBid:"disabled"
  })

  useEffect(()=>{
    let timeLeft = Math.ceil(
          (new Date(data.liveDate.split("-").reverse().join("-")) -
           new Date(data.postDate.split("-").reverse().join("-"))) /
          (1000 * 60 * 60 * 24)
        )
    if(timeLeft>0){
      setDateRelated((prev)=>({...prev,"date":timeLeft}))
    }else if(timeLeft==0){
      // will start counter till data.duration
    }

  },[])


  const styles = {
    card: {
      fontFamily: 'Arial, sans-serif',
      border: "1px solid #9DB2BF", // Updated color
      borderRadius: "12px",
      padding: "24px",
      width: "350px",
      minHeight: "460px",
      backgroundColor: "#ffffff",
      boxShadow: "0 4px 12px rgba(82, 109, 130, 0.15)", // Updated color
      display: 'flex',
      flexDirection: 'column',
      gap: '16px',
    },
    contentWrapper: {
      flex: '1 1 auto',
      display: 'flex',
      flexDirection: 'column',
      gap: '16px',
    },
    header: {
      margin: 0,
      fontSize: '1.5em',
      color: '#27374D', // Updated color
    },
    description: {
      margin: 0,
      color: '#526D82', // Updated color
      fontSize: '0.9em',
      lineHeight: '1.4',
      height: '4.2em',
      overflow: 'hidden',
      display: '-webkit-box',
      WebkitBoxOrient: 'vertical',
      WebkitLineClamp: 3,
    },
    detailsGrid: {
      display: 'grid',
      gridTemplateColumns: '1fr 1fr',
      gap: '12px',
    },
    detailItem: {
      fontSize: '0.85em',
      color: '#27374D', // Updated color
    },
    detailLabel: {
      display: 'block',
      color: '#526D82', // Updated color
      marginBottom: '4px',
    },
    divider: {
      border: 'none',
      borderTop: '1px solid #DDE6ED', // Updated color
      margin: '8px 0',
    }
  };


  return (
    <div style={styles.card}>
      {/* This wrapper makes sure the bidding section is pushed to the bottom */}
      <div style={styles.contentWrapper}>
        {/* --- Item Info Section --- */}
        <div>
          <h3 style={styles.header}>{data.itemName || "Auction Item"}</h3>
          <p style={styles.description}>
            {data.description || "No description provided."}
          </p>
        </div>

        {/* --- Details Section --- */}
        <div style={styles.detailsGrid}>
          <div style={styles.detailItem}>
            <span style={styles.detailLabel}>Starting Price</span>
            <strong>{data.desiredStartingPrice ? `₹${data.desiredStartingPrice}` : "—"}</strong>
          </div>
          <div style={styles.detailItem}>
            <span style={styles.detailLabel}>Bid Increment</span>
            <strong>{data.bidIncrement ? `₹${data.bidIncrement}` : "—"}</strong>
          </div>
          <div style={styles.detailItem}>
            <span style={styles.detailLabel}>Live Date</span>
            <strong>{data.liveDate || "Not scheduled"}</strong>
          </div>
          <div style={styles.detailItem}>
            <span style={styles.detailLabel}>Duration</span>
            <strong>{data.duration ? `${data.duration} days` : "—"}</strong>
          </div>
           <div style={styles.detailItem}>
            <span style={styles.detailLabel}>Time left</span>
            <strong>{data.duration ? `${data.liveDate-data.postData} days` : "—"}</strong>
          </div>
        </div>
      </div>

      <hr style={styles.divider} />

      {/* --- Bidding Section --- */}
      <div>
        <HighestBid itemName={data.itemName} sellerEmail={data.sellerEmail} />
        <PlaceBid
          itemName={data.itemName}
          sellerEmail={data.sellerEmail}
          sellerName={data.sellerName}
        />
      </div>
    </div>
  );
}