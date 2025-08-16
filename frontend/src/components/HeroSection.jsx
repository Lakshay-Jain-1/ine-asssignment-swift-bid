export default function HeroSection() {

    const styles = {
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
        headline: {
            fontSize: '3.5em',
            fontWeight: 'bold',
            lineHeight: '1.2',
            marginBottom: '20px',
            overflowY:"hidden"
        },
        subheadline: {
            fontSize: '1.2em',
            color: '#9DB2BF',
            lineHeight: '1.6',
            maxWidth: '500px',
        }
    };


    return (
        <div style={styles.heroSection}>
            <h1 style={styles.headline}>The Future of Auctions is Here.</h1>
            <p style={styles.subheadline}>
                Decentralizing auctions with a seamless, hassle-free experience.
            </p>
        </div>
    )

}