import { HttpTypes } from "@medusajs/types";
import styles from "./checkout-form.module.css";
import Review from "@/modules/checkout/components/review";
import { listCartPaymentMethods } from "@/lib/data/payment";
import Payment from "@/modules/checkout/components/payment";
import Shipping from "@/modules/checkout/components/shipping";
import Addresses from "@/modules/checkout/components/addresses";
import { listCartShippingMethods } from "@/lib/data/fulfillment";

export default async function CheckoutForm({
  cart,
  customer,
}: {
  cart: HttpTypes.StoreCart | null;
  customer: HttpTypes.StoreCustomer | null;
}) {
  if (!cart) {
    return null;
  }

  const shippingMethods = await listCartShippingMethods(cart.id);
  const paymentMethods = await listCartPaymentMethods(cart.region?.id ?? "");

  if (!shippingMethods || !paymentMethods) {
    return null;
  }

  return (
    <div className={styles.container}>
      <Addresses cart={cart} customer={customer} />
      <Shipping cart={cart} availableShippingMethods={shippingMethods} />
      <Payment cart={cart} availablePaymentMethods={paymentMethods} />
      <Review cart={cart} />
    </div>
  );
}
