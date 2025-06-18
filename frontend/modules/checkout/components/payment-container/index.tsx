import { Radio as RadioGroupOption } from "@headlessui/react";
import { Text } from "@medusajs/ui";
import React, { useContext, useMemo, type JSX } from "react";
import { BiCheckCircle, BiCircle } from "react-icons/bi";
import styles from "./payment-container.module.css";

import { isManual } from "@/lib/constants";
import PaymentTest from "../payment-test";

type PaymentContainerProps = {
  paymentProviderId: string;
  selectedPaymentOptionId: string | null;
  disabled?: boolean;
  paymentInfoMap: Record<string, { title: string; icon: JSX.Element }>;
  children?: React.ReactNode;
};

const PaymentContainer: React.FC<PaymentContainerProps> = ({
  paymentProviderId,
  selectedPaymentOptionId,
  paymentInfoMap,
  disabled = false,
  children,
}) => {
  const isDevelopment = process.env.NODE_ENV === "development";

  return (
    <RadioGroupOption
      key={paymentProviderId}
      value={paymentProviderId}
      disabled={disabled}
      className={`${styles.container} ${
        selectedPaymentOptionId === paymentProviderId
          ? styles.containerSelected
          : ""
      }`}
    >
      <div className={styles.header}>
        <div className={styles.content}>
          {selectedPaymentOptionId === paymentProviderId ? (
            <BiCheckCircle />
          ) : (
            <BiCircle />
          )}

          <Text className={styles.title}>
            {paymentInfoMap[paymentProviderId]?.title || paymentProviderId}
          </Text>
          {isManual(paymentProviderId) && isDevelopment && (
            <PaymentTest className={styles.testPayment} />
          )}
        </div>
        <span className={styles.icon}>
          {paymentInfoMap[paymentProviderId]?.icon}
        </span>
      </div>
      {isManual(paymentProviderId) && isDevelopment && (
        <PaymentTest className={styles.testPaymentMobile} />
      )}
      {children}
    </RadioGroupOption>
  );
};

export default PaymentContainer;
