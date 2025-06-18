import { HttpTypes } from "@medusajs/types";
import { listCartShippingMethods } from "@/lib/data/fulfillment";
import { listCartPaymentMethods } from "@/lib/data/payment";
import Addresses from "@/modules/checkout/components/addresses";
import Review from "@/modules/checkout/components/review";
import Payment from "@/modules/checkout/components/payment";
import Shipping from "@/modules/checkout/components/shipping";
import styles from "./checkout-form.module.css";

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
      {JSON.stringify({
        shippingMethods,
      })}
      <Addresses cart={cart} customer={customer} />
      <Shipping cart={cart} availableShippingMethods={shippingMethods} />
      <Payment cart={cart} availablePaymentMethods={paymentMethods} />
      <Review cart={cart} />
    </div>
  );
}
