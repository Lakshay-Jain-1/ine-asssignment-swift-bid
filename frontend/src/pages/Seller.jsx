import AlertSeller from "../components/AlertSeller";
import SellerForm from "../components/SellerForm";

export const Seller = () => {
    // Styles for the overall page layout
    const styles = {
        pageContainer: {
            display: 'flex',
            flexDirection: 'column', // Stack form and alerts vertically
            justifyContent: 'center',
            alignItems: 'center',
            backgroundColor: '#DDE6ED',
            width: '100vw', // Full viewport width as requested
            minHeight: '100vh', // Full viewport height
            padding: '24px',
            boxSizing: 'border-box', // Ensures padding is included in the width
        }
    };

    return (
        <div style={styles.pageContainer}>
            <SellerForm />
            <AlertSeller />
        </div>
    );
};