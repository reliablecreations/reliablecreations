import { Heading } from "@medusajs/ui";

import Divider from "@/components/store-front/divider";
import CartTotals from "@/modules/cart/components/cart-total";
import ItemsPreviewTemplate from "@/modules/cart/templates/preview";

const CheckoutSummary = ({ cart }: { cart: any }) => {
  return (
    <div className="sticky top-0 flex flex-col-reverse small:flex-col gap-y-8 py-8 small:py-0 ">
      <div className="w-full bg-white flex flex-col">
        <Divider className="my-6 small:hidden" />
        <Heading
          level="h2"
          className="flex flex-row text-3xl-regular items-baseline"
        >
          In your Cart
        </Heading>
        <Divider className="my-6" />
        <CartTotals totals={cart} />
        <ItemsPreviewTemplate cart={cart} />
        {/* <div className="my-6">
          <DiscountCode cart={cart} />
        </div> */}
      </div>
    </div>
  );
};

export default CheckoutSummary;
