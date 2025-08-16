import { useNavigate } from "react-router-dom";
import { IoArrowBack } from "react-icons/io5";
import { FaUserCircle } from "react-icons/fa";
import { BsFillLightningChargeFill } from "react-icons/bs";
import { useLocation } from 'react-router-dom';
import { useEffect ,useState} from "react";

export default function NavBar() {
    const navigate = useNavigate();
    const location = useLocation();
    const [currentPath,setCurrentPath] = useState(null)
    function handleBack() {
        navigate("/");
    }
    useEffect(()=>{
        setCurrentPath(location.pathname)
    },[location])
    // --- Style Objects for a clean UI ---
    const styles = {
        navContainer: {
            display: "flex",
            flexDirection: "row",
            justifyContent: "space-between",
            alignItems: "center",
            padding: "16px 24px",
            backgroundColor: "#ffffff",
            boxShadow: "0 2px 8px rgba(82, 109, 130, 0.15)",
            width: '100%',
            boxSizing: 'border-box',
            fontFamily: "'Segoe UI', 'Roboto', 'Arial', sans-serif", // Set a modern font
        },
        // New wrapper to group items on the left side
        leftSection: {
            display: 'flex',
            alignItems: 'center',
            gap: '24px', // Space between back arrow and logo
        },
        iconButton: {
            background: "none",
            border: "none",
            cursor: "pointer",
            padding: 0,
            display: 'flex',
            alignItems: 'center',
        },
        // New styles for the logo
        logo: {
            display: 'flex',
            alignItems: 'center',
            gap: '8px',
            color: '#27374D', // Uses the primary theme color
        },
        logoText: {
            fontSize: '1.6em',
            fontWeight: 'bold',
        },
    };

    return (
        <nav style={styles.navContainer}>
            {/* --- Left Section: Back Arrow and Logo --- */}
            <div style={styles.leftSection}>
                { currentPath!="/"?
                    <button onClick={handleBack} style={styles.iconButton}>
                    <IoArrowBack size={28} color="#526D82" />
                </button> : "" }

                <div style={styles.logo}>
                    <BsFillLightningChargeFill size={24} />
                    <span style={styles.logoText}>SwiftBid</span>
                </div>
            </div>

            {/* --- Right Section: User Account Icon --- */}
            <FaUserCircle size={32} color="#27374D" />
        </nav>
    );
}