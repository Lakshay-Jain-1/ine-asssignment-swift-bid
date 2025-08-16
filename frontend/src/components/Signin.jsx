import { useState } from "react";
import { supabase } from "../supabase-client";
import { useNavigate } from "react-router-dom";
import HeroSection from "./HeroSection";
import { signin as styles } from "../stylesheets/styles.js";
const SignIn = () => {
    const [userData, setUserData] = useState({ email: '', password: '' });
    const navigate = useNavigate();

    const handleChange = (e) => {
        const { name, value } = e.target;
        setUserData((prev) => ({ ...prev, [name]: value }));
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        const { data, error } = await supabase.auth.signInWithPassword(userData);
        if (error) {
            console.error(error);
            toast.error("Wrong Password, Make a new account, It is totally free !!")
        } else {
            if (data.user.user_metadata?.role == "seller") {
                navigate("/seller")
            } else {
                navigate("/auction")
            }
        }
    };

    return (
        <div style={styles.pageContainer}>
            <HeroSection />

            <div style={styles.formSection}>
                <div style={styles.formContainer}>
                    <h2 style={styles.title}>Welcome Back!</h2>
                    <p style={styles.subtitle}>
                        Enter your credentials to access your account.
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
                            Sign In
                        </button>
                    </form>
                    <p style={styles.footerText}>
                        Don't have an account?
                        <span onClick={() => navigate("/")} style={styles.link}>
                            Sign Up
                        </span>
                    </p>
                </div>
            </div>
        </div>
    );
};

export default SignIn;