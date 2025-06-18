import { clx } from "@medusajs/ui";

import { getProductPrice } from "@/lib/util/get-product-price";
import { HttpTypes } from "@medusajs/types";

export default function ProductPrice({
  product,
  variant,
}: {
  product: HttpTypes.StoreProduct;
  variant?: HttpTypes.StoreProductVariant;
}) {
  const { cheapestPrice, variantPrice } = getProductPrice({
    product,
    variantId: variant?.id,
  });

  const selectedPrice = variant ? variantPrice : cheapestPrice;

  if (!selectedPrice) {
    return <div className="block w-32 h-9 bg-gray-100 animate-pulse" />;
  }

  if (selectedPrice?.price_type === "sale") {
    return (
      <div className="flex gap-2 items-end">
        {/* <span className="text-2xl font-semibold text-red-500">
          {selectedPrice.calculated_price}
        </span>
        <span className="line-through text-gray-500">
          ₹{selectedPrice.original_price_number}
        </span> */}
        <div className="tpproduct-details__price mb-30">
          <del>₹{selectedPrice.original_price_number}</del>
          <span>₹{selectedPrice.calculated_price_number}</span>
        </div>
      </div>
    );
  }

  return (
    <div className="flex flex-col text-ui-fg-base">
      {/* {variant?.sku && (
        <div className="flex flex-wrap gap-2 text-gray-500 text-sm mb-2">
          <b className="font-extrabold">SKU</b>
          <p>{variant?.sku}</p>
        </div>
      )} */}
      <span
        className={clx("text-xl-semi", {
          "text-ui-fg-interactive": selectedPrice.price_type === "sale",
        })}
      >
        {!variant && "From "}

        <div className="tpproduct-details__price mb-30">
          <span
            data-testid="product-price"
            data-value={selectedPrice.calculated_price_number}
          >
            {selectedPrice.calculated_price}
          </span>
        </div>
      </span>
      {/* {selectedPrice.price_type === "sale" && (
        <>
          <p className="flex">
            <span className="text-ui-fg-subtle">Original: </span>
            <span
              className="line-through"
              data-testid="original-product-price"
              data-value={selectedPrice.original_price_number}
            >
              {selectedPrice.original_price}
            </span>
          </p>
          <span className="text-ui-fg-interactive">
            -{selectedPrice.percentage_diff}%
          </span>
        </>
      )} */}
    </div>
  );
}
