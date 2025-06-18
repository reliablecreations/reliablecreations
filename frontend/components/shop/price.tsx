import { Text, clx } from "@medusajs/ui"
//@ts-ignore
import { VariantPrice } from "types/global"

export default function PreviewPrice({ price,className }: { price: VariantPrice,className?:string }) {
  if (!price) {
    return null
  }

  return (
    <>
      <Text
        className={clx("md:text-lg text-xs font-semibold !text-red-500", {
          "text-ui-fg-interactive----": price.price_type === "sale"
        },className)}
        data-testid="price"
      >
        {price.calculated_price}
      </Text>

      {price.price_type === "sale" && (
        <Text
          className="line-through text-gray-400 text-xs md:text-md"
          data-testid="original-price"
        >
          {price.original_price}
        </Text>
      )}
    </>
  )
}
