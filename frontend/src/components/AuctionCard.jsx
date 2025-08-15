import { useEffect,useState } from "react";
import HighestBid from "./HighestBid";
import PlaceBid from "./PlaceBid";
import { auctionCard as styles } from "../stylesheets/styles.js";

export default function AuctionCard({ data }) {

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




  return (
    <div style={styles.card}>

      <div style={styles.contentWrapper}>
        <div>
          <h3 style={styles.header}>{data.itemName || "Auction Item"}</h3>
          <p style={styles.description}>
            {data.description || "No description provided."}
          </p>
        </div>

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