import PlaceBid from "./PlaceBid";

export default function AuctionCard({data }) {

  return (
    <>
    {console.log(data)}
    <div style={{
      border: "1px solid #ccc",
      borderRadius: "8px",
      padding: "16px",
      maxWidth: "300px",
      backgroundColor: "#fafafa"
    }}>
      <h3>{data.itemName || "Auction Item"}</h3>
      <p>{data.description || "No description provided."}</p>

      <p>
        <strong>Starting Price:</strong>{" "}
        {data.desiredStartingPrice ? `₹${data.desiredStartingPrice}` : "—"}
      </p>
      <p>
        <strong>Bid Increment:</strong>{" "}
        {data.bidIncrement ? `₹${data.bidIncrement}` : "—"}
      </p>
      <p>
        <strong>Live Date:</strong>{" "}
        {data.liveDate || "Not scheduled"}
      </p>
      <p>
        <strong>Duration:</strong>{" "}
        {data.duration ? `${data.duration} days` : "—"}
      </p>
    </div>

      <PlaceBid  itemName={data.itemName} sellerEmail={data.sellerEmail} sellerName={data.sellerName} />
    </>
  );
}


