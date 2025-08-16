import { useEffect, useState } from "react";
import { supabase } from "../supabase-client";
import { useNavigate, useSearchParams } from "react-router-dom";
import HeroSection from "./HeroSection";
import { signup as styles } from "../stylesheets/styles.js";
import { toast } from "react-toastify";

const SignUp = () => {
  const [userData, setUserData] = useState({ email: "", password: "", role: "" });
  const [searchParams] = useSearchParams();
  const navigate = useNavigate();
  const role = searchParams.get("role"); // role passed via query param

  useEffect(() => {
    setUserData((prev) => ({ ...prev, role }));
  }, [role]);

  function handleNavigation(path) {
    navigate(path);
  }

  const handleChange = (e) => {
    const { name, value } = e.target;
    setUserData((prev) => ({ ...prev, [name]: value }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    // Sign up user and store role in user_metadata
    const { data, error } = await supabase.auth.signUp({
      email: userData.email,
      password: userData.password,
      options: {
        data: { role: userData.role }, 
      },
    });

    if (error) {
      console.error(error);
      toast.error("Sorry for the inconvenience !!");
      return;
    }

    // After successful signup, use the stored role to decide navigation
    const signedUpRole = data.user?.user_metadata?.role;
    handleNavigation(signedUpRole === "buyer" ? "/auction" : "/seller");
  };

  return (
    <div style={styles.pageContainer}>
      <HeroSection />

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
            <button type="submit" style={styles.button}>
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