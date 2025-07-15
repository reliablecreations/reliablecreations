import { Text } from "@medusajs/ui";
//@ts-ignore
import { VariantPrice } from "types/global";
import styles from "./price.module.css";

export default function PreviewPrice({
  price,
  className,
}: {
  price: VariantPrice;
  className?: string;
}) {
  if (!price) {
    return null;
  }

  return (
    <div className="d-flex align-items-center gap-2">
      <Text
        className={`${styles.price} ${
          price.price_type === "sale" ? styles.sale : ""
        } ${className || ""}`}
        data-testid="price"
      >
        {price.calculated_price}
      </Text>

      {price.price_type === "sale" && (
        <Text className={styles.originalPrice} data-testid="original-price">
          {price.original_price}
        </Text>
      )}
    </div>
  );
}
