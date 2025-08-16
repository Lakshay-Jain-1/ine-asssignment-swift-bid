import { useState } from "react";
import { supabase } from "../supabase-client";
import { useNavigate, useSearchParams } from "react-router-dom";
// Import icons for the logo and branding
import { BsFillLightningChargeFill } from "react-icons/bs";
import HeroSection from "./HeroSection";

const SignUp = () => {
    const [userData, setUserData] = useState({ email: '', password: '' });
    const [searchParams] = useSearchParams();
    const navigate = useNavigate();
    const role = searchParams.get("role");

    // --- Style Objects ---
    const styles = {
        pageContainer: {
            display: 'flex',
            width: '100vw',
            minHeight: '100vh',
            fontFamily: "'Segoe UI', 'Roboto', 'Arial', sans-serif",
        },
        // --- Hero Section (Consistent with Landing Page) ---
        heroSection: {
            width: '50%',
            backgroundColor: '#27374D',
            color: '#DDE6ED',
            display: 'flex',
            flexDirection: 'column',
            justifyContent: 'center',
            padding: '60px',
            boxSizing: 'border-box',
        },
        logo: {
            display: 'flex',
            alignItems: 'center',
            gap: '12px',
            fontSize: '2em',
            fontWeight: 'bold',
            marginBottom: '40px',
        },
        headline: {
            fontSize: '3.5em',
            fontWeight: 'bold',
            lineHeight: '1.2',
            marginBottom: '20px',
        },
        subheadline: {
            fontSize: '1.2em',
            color: '#9DB2BF',
            lineHeight: '1.6',
            maxWidth: '500px',
        },
        // --- Form Section ---
        formSection: {
            width: '50%',
            backgroundColor: '#ffffff',
            display: 'flex',
            justifyContent: 'center',
            alignItems: 'center',
            padding: '60px',
            boxSizing: 'border-box',
        },
        formContainer: {
            width: '100%',
            maxWidth: '400px',
            display: 'flex',
            flexDirection: 'column',
        },
        title: {
            fontSize: '2.5em',
            fontWeight: 'bold',
            color: '#27374D',
            marginBottom: '10px',
        },
        subtitle: {
            fontSize: '1em',
            color: '#526D82',
            marginBottom: '30px',
        },
        input: {
            padding: '15px',
            border: '1px solid #9DB2BF',
            borderRadius: '8px',
            fontSize: '1em',
            color: '#27374D',
            outline: 'none',
            marginBottom: '20px',
            boxSizing: 'border-box',
            width: '100%',
        },
        button: {
            padding: '15px 20px',
            border: 'none',
            borderRadius: '8px',
            backgroundColor: '#27374D',
            color: 'white',
            fontSize: '1.1em',
            fontWeight: 'bold',
            cursor: 'pointer',
            width: '100%',
            transition: 'background-color 0.2s',
        },
        footerText: {
            marginTop: '30px',
            textAlign: 'center',
            color: '#526D82',
        },
        link: {
            color: '#27374D',
            fontWeight: 'bold',
            cursor: 'pointer',
            textDecoration: 'underline',
            marginLeft: '5px',
        },
    };

    function handleNavigation(path) {
        navigate(path);
    }

    const handleChange = (e) => {
        const { name, value } = e.target;
        setUserData((prev) => ({ ...prev, [name]: value }));
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        const { error } = await supabase.auth.signUp(userData);
        if (error) {
            console.error(error);
            // You can add a toast notification here for the user
        } else {
            // After successful signup, navigate based on role
            handleNavigation(role === "buyer" ? "/auction" : "/seller");
        }
    };

    return (
        <div style={styles.pageContainer}>
            {/* --- Hero Section (Left Side) --- */}
            <HeroSection/>

            {/* --- Sign-Up Form (Right Side) --- */}
            <div style={styles.formSection}>
                <div style={styles.formContainer}>
                    <h2 style={styles.title}>
                        Create a {role === "buyer" ? "Buyer" : "Seller"} Account
                    </h2>
                    <p style={styles.subtitle}>
                        {role === "buyer" 
                            ? "Get ready to discover and bid on unique items." 
                            : "Start selling and reach thousands of potential buyers today."}
                    </p>
                    <form onSubmit={handleSubmit}>
                        <input
                            style={styles.input}
                            name="email"
                            type="email"
                            placeholder="Email"
                            onChange={handleChange}
                            required
                        />
                        <input
                            style={styles.input}
                            name="password"
                            type="password"
                            placeholder="Password"
                            onChange={handleChange}
                            required
                        />
                        <button 
                            type="submit" 
                            style={styles.button}
                            onMouseOver={(e) => e.currentTarget.style.backgroundColor = '#526D82'}
                            onMouseOut={(e) => e.currentTarget.style.backgroundColor = '#27374D'}
                        >
                            Sign Up
                        </button>
                    </form>
                    <p style={styles.footerText}>
                        Already have an account?
                        <span onClick={() => handleNavigation("/signIn")} style={styles.link}>
                            Sign In
                        </span>
                    </p>
                </div>
            </div>
        </div>
    );
};

export default SignUp;