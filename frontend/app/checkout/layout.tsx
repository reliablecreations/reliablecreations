import { BiChevronDown } from "react-icons/bi";
import Link from "next/link";
import styles from "./layout.module.css";

export default function CheckoutLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <div className={styles.container}>
      <div className={styles.navContainer}>
        <nav className={styles.nav}>
          <Link
            href="/mycart"
            className={styles.backLink}
            data-testid="back-to-cart-link"
          >
            <BiChevronDown className={styles.backIcon} size={16} />
            <span className={`${styles.backText} ${styles.backTextDesktop}`}>
              Back to shopping cart
            </span>
            <span className={`${styles.backText} ${styles.backTextMobile}`}>
              Back
            </span>
          </Link>
          <Link href="/" className={styles.storeLink} data-testid="store-link">
            Reliable Creations
          </Link>
          <div className={styles.spacer} />
        </nav>
      </div>
    <div className={`${styles.checkoutContainer} px-4 md:px-8`} data-testid="checkout-container">
  {children}
</div>

    </div>
  );
}
