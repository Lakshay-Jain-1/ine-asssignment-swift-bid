import { useEffect } from "react";
import AlertSeller from "../components/AlertSeller";
import SellerForm from "../components/SellerForm";
import { supabase } from "../supabase-client";
import { useNavigate } from "react-router-dom";
import { toast } from "react-toastify";
import styles from "../stylesheets/seller.module.css";

export const Seller = () => {
    const navigate = useNavigate();


    async function fetchUserData() {
        const { data, error } = await supabase.auth.getUser();
        if (error) {
            toast.error("You have not access to seller page!! Make sellers account")
            console.error("Error fetching user:", error.message);
            navigate("/");
            return;
        }

        if (!data.user) {
            toast.error("You have not access to seller page!! Make sellers account")
            navigate("/");
            return;
        }

        const role = data.user.user_metadata?.role;

        if (role === "buyer") {
            navigate("/auction");
        } else if (role !== "seller") {
            toast.error("You have not access to seller page!! Make sellers account")
            navigate("/");
        }
    }
    useEffect(() => {
        fetchUserData()
    }, [])

    return (
        <div className={styles.pageContainer}>
            <SellerForm />
            <AlertSeller />
        </div>
    );
};