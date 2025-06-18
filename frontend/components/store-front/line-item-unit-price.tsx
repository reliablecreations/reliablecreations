import { HttpTypes } from "@medusajs/types";
import { convertToLocale } from "@/lib/util/money";
import styles from "@/styles/line-item-unit-price.module.css";

type LineItemUnitPriceProps = {
  item: HttpTypes.StoreCartLineItem | HttpTypes.StoreOrderLineItem;
  style?: "default" | "tight";
  currencyCode: string;
};

const LineItemUnitPrice = ({
  item,
  style = "default",
  currencyCode,
}: LineItemUnitPriceProps) => {
  const { total = 0, original_total = 0, quantity = 1 } = item;
  const hasReducedPrice = total < original_total;

  const percentage_diff = Math.round(
    ((original_total - total) / original_total) * 100
  );

  return (
    <div className={styles.container}>
      {hasReducedPrice && (
        <>
          <p>
            {style === "default" && (
              <span style={{ color: "var(--text-muted)" }}>Original: </span>
            )}
            <span
              className={styles.lineThrough}
              data-testid="product-unit-original-price"
            >
              {convertToLocale({
                amount: original_total / quantity,
                currency_code: currencyCode,
              })}
            </span>
          </p>
          {style === "default" && (
            <span className={styles.textInteractive}>-{percentage_diff}%</span>
          )}
        </>
      )}
      <span
        className={`${styles.textBaseRegular} ${
          hasReducedPrice ? styles.textInteractive : ""
        }`}
        data-testid="product-unit-price"
      >
        {convertToLocale({
          amount: total / quantity,
          currency_code: currencyCode,
        })}
      </span>
    </div>
  );
};

export default LineItemUnitPrice;
