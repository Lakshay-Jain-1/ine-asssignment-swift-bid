import { useState } from "react";
import { supabase } from "../supabase-client";
import { useNavigate, useSearchParams } from "react-router-dom";
// Import icons for the logo and branding
import { BsFillLightningChargeFill } from "react-icons/bs";
import HeroSection from "./HeroSection";
import { signup as styles } from "../stylesheets/styles.js";
const SignUp = () => {
    const [userData, setUserData] = useState({ email: '', password: '' });
    const [searchParams] = useSearchParams();
    const navigate = useNavigate();
    const role = searchParams.get("role");


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