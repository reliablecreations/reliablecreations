"use client";

import { Button, Heading } from "@medusajs/ui";
import { HttpTypes } from "@medusajs/types";
import Link from "next/link";
import CartTotals from "../components/cart-total";

type SummaryProps = {
  cart: HttpTypes.StoreCart & {
    promotions: HttpTypes.StorePromotion[];
  };
};

function getCheckoutStep(cart: HttpTypes.StoreCart) {
  if (!cart?.shipping_address?.address_1 || !cart.email) {
    return "address";
  } else if (cart?.shipping_methods?.length === 0) {
    return "delivery";
  } else {
    return "payment";
  }
}

const Summary = ({ cart }: SummaryProps) => {
  const step = getCheckoutStep(cart);

  return (
    <div className="flex flex-col gap-y-4">
      <Heading level="h2" className="text-[2rem] leading-[2.75rem]">
        Summary
      </Heading>
      {/* <Divider /> */}
      <CartTotals totals={cart} />
      <Link href={"/checkout?step=" + step} data-testid="checkout-button">
        <Button className="w-full h-10">Go to checkout</Button>
      </Link>
    </div>
  );
};

export default Summary;
