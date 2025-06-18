"use client";

import { Heading, Text } from "@medusajs/ui";
import styles from "./review.module.css";

import PaymentButton from "../payment-button";
import { RazorpayPaymentButton } from "../payment-button/razorpay-payment-button";
import { useSearchParams } from "next/navigation";

const Review = ({ cart }: { cart: any }) => {
  const searchParams = useSearchParams();

  const isOpen = searchParams.get("step") === "review";

  const paidByGiftcard =
    cart?.gift_cards && cart?.gift_cards?.length > 0 && cart?.total === 0;

  const previousStepsCompleted =
    cart.shipping_address &&
    cart.shipping_methods.length > 0 &&
    (cart.payment_collection || paidByGiftcard);

  return (
    <div className={styles.container}>
      <div className={styles.header}>
        <Heading
          level="h2"
          className={`${styles.title} ${!isOpen ? styles.titleDisabled : ""}`}
        >
          Review
        </Heading>
      </div>

      {isOpen && previousStepsCompleted && (
        <>
          <div className={styles.content}>
            <div className={styles.text}>
              <Text className={styles.textLabel}>
                By clicking the Place Order button, you confirm that you have
                read, understand and accept our Terms of Use, Terms of Sale and
                Returns Policy and acknowledge that you have read Medusa
                Store&apos;s Privacy Policy.
              </Text>
            </div>
          </div>

          <PaymentButton cart={cart} data-testid="submit-order-button" />
        </>
      )}
    </div>
  );
};

export default Review;
