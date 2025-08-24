import { useEffect, useState } from "react";
import { supabase } from "../supabase-client";
import { useNavigate, useSearchParams } from "react-router-dom";
import HeroSection from "./HeroSection";
import styles from "../stylesheets/signup.module.css";
import { toast } from "react-toastify";

const SignUp = () => {
  const [userData, setUserData] = useState({ email: "", password: "", role: "" });
  const [searchParams] = useSearchParams();
  const navigate = useNavigate();
  const role = searchParams.get("role"); 

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

    toast("Check your mail!! We have sent out a mail")
  };

  return (
    <div className={styles.pageContainer}>
      <HeroSection />

      <div className={styles.formSection}>
        <div className={styles.formContainer}>
          <h2 className={styles.title}>
            Create a {role === "buyer" ? "Buyer" : "Seller"} Account
          </h2>
          <p className={styles.subtitle}>
            {role === "buyer"
              ? "Get ready to discover and bid on unique items."
              : "Start selling and reach thousands of potential buyers today."}
          </p>
          <form onSubmit={handleSubmit}>
            <input
              className={styles.input}
              name="email"
              type="email"
              placeholder="Email"
              onChange={handleChange}
              required
            />
            <input
              className={styles.input}
              name="password"
              type="password"
              placeholder="Password"
              onChange={handleChange}
              required
            />
            <button type="submit" className={styles.button}>
              Sign Up
            </button>
          </form>
          <p className={styles.footerText}>
            Already have an account?
            <span onClick={() => handleNavigation("/signIn")} className={styles.link}>
              Sign In
            </span>
          </p>
        </div>
      </div>
    </div>
  );
};

export default SignUp;