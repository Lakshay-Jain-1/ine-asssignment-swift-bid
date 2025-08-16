const sellerForm = {
  formContainer: {
    fontFamily: "Arial, sans-serif",
    backgroundColor: "#ffffff",
    padding: "40px",
    borderRadius: "12px",
    boxShadow: "0 4px 12px rgba(82, 109, 130, 0.15)",
    maxWidth: "600px",
    width: "100%",
    display: "flex",
    flexDirection: "column",
    gap: "20px",
  },
  header: {
    color: "#27374D",
    textAlign: "center",
    margin: "0 0 10px 0",
    fontSize: "2em",
  },
  inputGroup: {
    display: "flex",
    flexDirection: "column",
    width: "100%",
  },
  label: {
    color: "#526D82",
    fontWeight: "bold",
    marginBottom: "8px",
    fontSize: "0.9em",
  },
  input: {
    padding: "12px",
    border: "1px solid #9DB2BF",
    borderRadius: "8px",
    fontSize: "1em",
    color: "#27374D",
    outline: "none",
    width: "100%",
    boxSizing: "border-box",
  },
  textarea: {
    padding: "12px",
    border: "1px solid #9DB2BF",
    borderRadius: "8px",
    fontSize: "1em",
    color: "#27374D",
    outline: "none",
    minHeight: "100px",
    resize: "vertical",
    width: "100%",
    boxSizing: "border-box",
  },
  row: {
    display: "flex",
    gap: "20px",
    width: "100%",
  },
  button: {
    padding: "15px 20px",
    border: "none",
    borderRadius: "8px",
    backgroundColor: "#27374D",
    color: "white",
    fontSize: "1.1em",
    fontWeight: "bold",
    cursor: "pointer",
    width: "100%",
    marginTop: "10px",
    transition: "background-color 0.2s",
  },
};


const auctionCard = {
  card: {
    fontFamily: "Arial, sans-serif",
    border: "1px solid #9DB2BF",
    borderRadius: "12px",
    padding: "24px",
    width: "350px",
    minHeight: "460px",
    backgroundColor: "#ffffff",
    boxShadow: "0 4px 12px rgba(82, 109, 130, 0.15)",
    display: "flex",
    flexDirection: "column",
    gap: "16px",
  },
  contentWrapper: {
    flex: "1 1 auto",
    display: "flex",
    flexDirection: "column",
    gap: "16px",
  },
  header: {
    margin: 0,
    fontSize: "1.5em",
    color: "#27374D",
  },
  description: {
    margin: 0,
    color: "#526D82",
    fontSize: "0.9em",
    lineHeight: "1.4",
    height: "4.2em",
    overflow: "hidden",
    display: "-webkit-box",
    WebkitBoxOrient: "vertical",
    WebkitLineClamp: 3,
  },
  detailsGrid: {
    display: "grid",
    gridTemplateColumns: "1fr 1fr",
    gap: "12px",
  },
  detailItem: {
    fontSize: "0.85em",
    color: "#27374D",
  },
  detailLabel: {
    display: "block",
    color: "#526D82",
    marginBottom: "4px",
  },
  divider: {
    border: "none",
    borderTop: "1px solid #DDE6ED",
    margin: "8px 0",
  },
  // --- ADD THESE NEW STYLES ---
  notLiveContainer: {
    display: 'flex',
    flexDirection: 'column',
    justifyContent: 'center',
    alignItems: 'center',
    height: '100%',
    backgroundColor: '#f9fafb',
    borderRadius: '8px',
    padding: '20px',
    boxSizing: 'border-box',
    margin:"15px"
  },
  notLiveIcon: {
    fontSize: '2.5em',
    color: '#9DB2BF',
    marginBottom: '10px',
  },
  notLiveText: {
    margin: 0,
    fontSize: '1em',
    color: '#526D82',
    fontWeight: 'bold',
  },
};

const auction = {
  pageContainer: {
    padding: "24px",
    backgroundColor: "#DDE6ED", // Updated color
    minHeight: "100vh",
  },
  gridContainer: {
    display: "grid",
    gridTemplateColumns: "repeat(auto-fit, minmax(350px, 1fr))",
    gap: "24px",
    placeItems: "center",
  },
  messageText: {
    textAlign: "center",
    fontSize: "3em",
    color: "#27374D",
    backgroundColor: "#DDE6ED",
    width: "100vw",
    height: "100vh",
    display: "flex",
    justifyContent: "center",
    alignItems: "center",
    fontWeight: "900",
  },
};

const placeBid = {
  input: {
    flex: 1,
    padding: "10px 12px",
    border: "1px solid #9DB2BF", // Updated theme color
    borderRadius: "6px",
    fontSize: "1em",
    outline: "none",
    color: "#27374D", // Updated theme color
  },
  container: {
    display: "flex",
    flexDirection: "column",
    gap: "30px",
    marginBottom: "0px",
    justifyContent: "space-between", // space between input and button vertically
  },
  button: {
    padding: "10px 20px",
    border: "none",
    borderRadius: "12px",
    backgroundColor: "#27374D",
    color: "white",
    fontSize: "1em",
    fontWeight: "bold",
    cursor: "pointer",
    width: "160px",
    height: "40px",
    alignSelf: "center", // centers horizontally
    transition: "background-color 0.2s",
    overflowY: "hidden",
  },
};

const highestBid = {
  container: {
    marginBottom: "12px",
    padding: "12px",
    borderRadius: "8px",
    backgroundColor: "#DDE6ED", // Updated color
    textAlign: "center",
  },
  text: {
    margin: 0,
    fontSize: "1em",
    color: "#526D82", // Updated color
  },
  amount: {
    fontWeight: "bold",
    marginLeft: "8px",
    color: "#27374D", // Updated color
  },
  noBidText: {
    margin: 0,
    fontSize: "1em",
    color: "#526D82", // Updated color
    fontStyle: "italic",
  },
};

const lander = {
  pageContainer: {
    display: "flex",
    width: "100vw",
    minHeight: "100vh",
    fontFamily: "'Segoe UI', 'Roboto', 'Arial', sans-serif",
    overflowX: "hidden",
  },
  // --- Right Side: Action Section ---
  actionSection: {
    width: "47%",
    backgroundColor: "#ffffff",
    display: "flex",
    flexDirection: "column",
    justifyContent: "center",
    alignItems: "center",
    padding: "60px",
    boxSizing: "border-box",
  },
  actionTitle: {
    fontSize: "2em",
    fontWeight: "bold",
    color: "#27374D",
    marginBottom: "40px",
  },
  roleContainer: {
    display: "flex",
    gap: "30px",
    width: "100%",
    justifyContent: "center",
  },
  roleCard: {
    flex: 1,
    maxWidth: "250px",
    border: "2px solid #DDE6ED",
    borderRadius: "12px",
    padding: "30px",
    textAlign: "center",
    cursor: "pointer",
    transition: "all 0.3s ease",
  },
  roleTitle: {
    fontSize: "1.5em",
    fontWeight: "bold",
    color: "#27374D",
    marginTop: "15px",
  },
  roleDescription: {
    fontSize: "0.9em",
    color: "#526D82",
    marginTop: "10px",
  },
  signInContainer: {
    marginTop: "50px",
    textAlign: "center",
    color: "#526D82",
  },
  signInLink: {
    color: "#27374D",
    fontWeight: "bold",
    cursor: "pointer",
    textDecoration: "underline",
    marginLeft: "8px",
  },
};

const signin = {
  pageContainer: {
    display: "flex",
    width: "100vw",
    minHeight: "100vh",
    fontFamily: "'Segoe UI', 'Roboto', 'Arial', sans-serif",
  },
  // --- Form Section ---
  formSection: {
    width: "50%",
    backgroundColor: "#ffffff",
    display: "flex",
    justifyContent: "center",
    alignItems: "center",
    padding: "60px",
    boxSizing: "border-box",
  },
  formContainer: {
    width: "100%",
    maxWidth: "400px",
    display: "flex",
    flexDirection: "column",
  },
  title: {
    fontSize: "2.5em",
    fontWeight: "bold",
    color: "#27374D",
    marginBottom: "10px",
  },
  subtitle: {
    fontSize: "1em",
    color: "#526D82",
    marginBottom: "30px",
  },
  input: {
    padding: "15px",
    border: "1px solid #9DB2BF",
    borderRadius: "8px",
    fontSize: "1em",
    color: "#27374D",
    outline: "none",
    marginBottom: "20px",
    boxSizing: "border-box",
    width: "100%",
  },
  button: {
    padding: "15px 20px",
    border: "none",
    borderRadius: "8px",
    backgroundColor: "#27374D",
    color: "white",
    fontSize: "1.1em",
    fontWeight: "bold",
    cursor: "pointer",
    width: "100%",
    transition: "background-color 0.2s",
  },
  footerText: {
    marginTop: "30px",
    textAlign: "center",
    color: "#526D82",
  },
  link: {
    color: "#27374D",
    fontWeight: "bold",
    cursor: "pointer",
    textDecoration: "underline",
    marginLeft: "5px",
  },
};

const signup = {
  pageContainer: {
    display: "flex",
    width: "100vw",
    minHeight: "100vh",
    fontFamily: "'Segoe UI', 'Roboto', 'Arial', sans-serif",
  },
  formSection: {
    width: "50%",
    backgroundColor: "#ffffff",
    display: "flex",
    justifyContent: "center",
    alignItems: "center",
    padding: "60px",
    boxSizing: "border-box",
  },
  formContainer: {
    width: "100%",
    maxWidth: "400px",
    display: "flex",
    flexDirection: "column",
  },
  title: {
    fontSize: "2.5em",
    fontWeight: "bold",
    color: "#27374D",
    marginBottom: "10px",
  },
  subtitle: {
    fontSize: "1em",
    color: "#526D82",
    marginBottom: "30px",
  },
  input: {
    padding: "15px",
    border: "1px solid #9DB2BF",
    borderRadius: "8px",
    fontSize: "1em",
    color: "#27374D",
    outline: "none",
    marginBottom: "20px",
    boxSizing: "border-box",
    width: "100%",
  },
  button: {
    padding: "15px 20px",
    border: "none",
    borderRadius: "8px",
    backgroundColor: "#27374D",
    color: "white",
    fontSize: "1.1em",
    fontWeight: "bold",
    cursor: "pointer",
    width: "100%",
    transition: "background-color 0.2s",
  },
  footerText: {
    marginTop: "30px",
    textAlign: "center",
    color: "#526D82",
  },
  link: {
    color: "#27374D",
    fontWeight: "bold",
    cursor: "pointer",
    textDecoration: "underline",
    marginLeft: "5px",
  },
};

export {
  sellerForm,
  auctionCard,
  auction,
  placeBid,
  highestBid,
  lander,
  signin,
  signup,
};
