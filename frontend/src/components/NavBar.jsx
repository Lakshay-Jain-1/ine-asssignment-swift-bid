import { useNavigate } from "react-router-dom";
import { IoArrowBack } from "react-icons/io5";
import { FaUserCircle } from "react-icons/fa";
import { BsFillLightningChargeFill } from "react-icons/bs";
import { useLocation } from 'react-router-dom';
import { useEffect ,useState} from "react";
import styles from "../stylesheets/navBar.module.css";
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


    return (
        <nav className={styles.navContainer}>
            <div className={styles.leftSection}>
                { currentPath!="/"?
                    <button onClick={handleBack} className={styles.iconButton}>
                    <IoArrowBack size={28} color="#526D82" />
                </button> : "" }

                <div className={styles.logo}>
                    <BsFillLightningChargeFill size={24} />
                    <span className={styles.logoText}>SwiftBid</span>
                </div>
            </div>

            <FaUserCircle size={32} color="#27374D" />
        </nav>
    );
}