import { Metadata } from "next";
import styles from "./checkout.module.css";
import { notFound } from "next/navigation";
import { retrieveCart } from "@/lib/data/cart";
import { retrieveCustomer } from "@/lib/data/customer";
import CheckoutSummary from "@/modules/checkout/templates/checkout-summary";
import CheckoutForm from "@/modules/checkout/templates/checkout-form";

export const metadata: Metadata = {
  title: "Checkout",
  description: "Checkout page",
};

export default async function Checkout() {
  const cart = await retrieveCart();

  if (!cart) {
    return notFound();
  }

  const customer = await retrieveCustomer();

  return (
    <>
      <div className={styles.container}>
        <CheckoutForm cart={cart} customer={customer} />
        <CheckoutSummary cart={cart} />
      </div>
    </>
  );
}
