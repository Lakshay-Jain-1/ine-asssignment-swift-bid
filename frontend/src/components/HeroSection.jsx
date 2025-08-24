import styles from "../stylesheets/heroSection.module.css";

export default function HeroSection() {


    return (
        <div className={styles.heroSection}>
            <h1 className={styles.headline}>The Future of Auctions is Here.</h1>
            <p className={styles.subheadline}>
                Decentralizing auctions with a seamless, hassle-free experience.
            </p>
        </div>
    )

}