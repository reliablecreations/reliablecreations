import { Heading, Text } from "@medusajs/ui";
import Link from "next/link";
import styles from "@/styles/empty-cart.module.css";

const EmptyCartMessage = () => {
  return (
    <div className={styles.wrapper} data-testid="empty-cart-message">
      <Heading level="h1" className={styles.heading}>
        Cart
      </Heading>
      <Text className={styles.message}>
        You don&apos;t have anything in your cart. Let&apos;s change that, use
        the link below to start browsing our products.
      </Text>
      <div>
        <Link href="/" className={styles.link}>
          Explore products
        </Link>
      </div>
    </div>
  );
};

export default EmptyCartMessage;
