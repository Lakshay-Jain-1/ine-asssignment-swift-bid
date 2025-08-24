import { useNavigate } from "react-router-dom";
import { FaGavel, FaStore } from "react-icons/fa";
import styles from "../stylesheets/lander.module.css";
import HeroSection from "../components/HeroSection.jsx";

export default function Lander() {
    const navigate = useNavigate();

    function handleNavigation(path) {
        navigate(path);
    }

    const handleMouseOver = (e) => {
        e.currentTarget.style.borderColor = '#526D82';
        e.currentTarget.style.transform = 'translateY(-1px)';
        e.currentTarget.style.boxShadow = '0 8px 20px rgba(82, 109, 130, 0.15)';
    };
    const handleMouseOut = (e) => {
        e.currentTarget.style.borderColor = '#DDE6ED';
        e.currentTarget.style.transform = 'none';
        e.currentTarget.style.boxShadow = 'none';
    };


    return (
        <div className={styles.pageContainer}>
            <HeroSection />

            <div className={styles.actionSection}>
                <h2 className={styles.actionTitle}>Choose Your Role</h2>
                <div className={styles.roleContainer}>
                    <div
                        className={styles.roleCard}
                        onClick={() => handleNavigation(`signUp/?role=seller`)}
                        onMouseOver={handleMouseOver}
                        onMouseOut={handleMouseOut}
                    >
                        <FaStore size={48} color="#27374D" />
                        <h3 className={styles.roleTitle}>Seller</h3>
                        <p className={styles.roleDescription}>List your items and reach thousands of interested buyers.</p>
                    </div>

                    <div
                        className={styles.roleCard}
                        onClick={() => handleNavigation(`signUp/?role=buyer`)}
                        onMouseOver={handleMouseOver}
                        onMouseOut={handleMouseOut}
                    >
                        <FaGavel size={48} color="#27374D" />
                        <h3 className={styles.roleTitle}>Buyer</h3>
                        <p className={styles.roleDescription}>Discover unique items and place your winning bid with confidence.</p>
                    </div>
                </div>
                <div className={styles.signInContainer}>
                    <span>Already a user?</span>
                    <span onClick={() => handleNavigation(`signIn`)} className={styles.signInLink}>
                        Sign In
                    </span>
                </div>
            </div>
        </div>
    );
}