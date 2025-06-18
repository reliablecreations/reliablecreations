"use client";

import { isManual, isRazorpay, isStripe } from "@/lib/constants";
import { placeOrder } from "@/lib/data/cart";
import { HttpTypes } from "@medusajs/types";
import { Button } from "@medusajs/ui";
// import { useElements, useStripe } from "@stripe/react-stripe-js"
import React, { useState } from "react";
import ErrorMessage from "../error-message";
import { RazorpayPaymentButton } from "./razorpay-payment-button";

type PaymentButtonProps = {
  cart: HttpTypes.StoreCart;
  "data-testid": string;
};

const PaymentButton: React.FC<PaymentButtonProps> = ({
  cart,
  "data-testid": dataTestId,
}) => {
  const notReady =
    !cart ||
    !cart.shipping_address ||
    !cart.billing_address ||
    !cart.email ||
    (cart.shipping_methods?.length ?? 0) < 1;

  const paymentSession = cart.payment_collection?.payment_sessions?.[0];

  switch (true) {
    case isStripe(paymentSession?.provider_id):
      return (
        <StripePaymentButton
          notReady={notReady}
          cart={cart}
          data-testid={dataTestId}
        />
      );
    case isManual(paymentSession?.provider_id):
      return (
        <ManualTestPaymentButton notReady={notReady} data-testid={dataTestId} />
      );
    case isRazorpay(paymentSession?.provider_id):
      return (
        <RazorpayPaymentButton
          session={paymentSession as any}
          notReady={notReady}
          cart={cart}
        />
      );
    default:
      return <Button disabled>Select a payment method</Button>;
  }
};

const StripePaymentButton = ({
  cart,
  notReady,
  "data-testid": dataTestId,
}: {
  cart: HttpTypes.StoreCart;
  notReady: boolean;
  "data-testid"?: string;
}) => {
  const [submitting, setSubmitting] = useState(false);
  const [errorMessage, setErrorMessage] = useState<string | null>(null);

  const onPaymentCompleted = async () => {
    await placeOrder()
      .catch((err) => {
        setErrorMessage(err.message);
      })
      .finally(() => {
        setSubmitting(false);
      });
  };

  const session = cart.payment_collection?.payment_sessions?.find(
    (s) => s.status === "pending"
  );

  const handlePayment = async () => {
    setSubmitting(true);

    if (!cart) {
      setSubmitting(false);
      return;
    }
  };

  return (
    <>
      <Button
        disabled={notReady}
        onClick={handlePayment}
        size="large"
        isLoading={submitting}
        data-testid={dataTestId}
      >
        Place order
      </Button>
      <ErrorMessage
        error={errorMessage}
        data-testid="stripe-payment-error-message"
      />
    </>
  );
};

const ManualTestPaymentButton = ({ notReady }: { notReady: boolean }) => {
  const [submitting, setSubmitting] = useState(false);
  const [errorMessage, setErrorMessage] = useState<string | null>(null);

  const onPaymentCompleted = async () => {
    await placeOrder()
      .catch((err) => {
        setErrorMessage(err.message);
      })
      .finally(() => {
        setSubmitting(false);
      });
  };

  const handlePayment = () => {
    setSubmitting(true);

    onPaymentCompleted();
  };

  return (
    <>
      <Button
        disabled={notReady}
        isLoading={submitting}
        onClick={handlePayment}
        size="large"
        data-testid="submit-order-button"
      >
        Place order
      </Button>
      <ErrorMessage
        error={errorMessage}
        data-testid="manual-payment-error-message"
      />
    </>
  );
};

export default PaymentButton;
