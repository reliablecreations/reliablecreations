import { getPercentageDiff } from "@/lib/util/get-precentage-diff";
import { convertToLocale } from "@/lib/util/money";
import { HttpTypes } from "@medusajs/types";
import styles from "@/styles/line-item-price.module.css";

type LineItemPriceProps = {
  item: HttpTypes.StoreCartLineItem | HttpTypes.StoreOrderLineItem;
  style?: "default" | "tight";
  currencyCode: string;
};

const LineItemPrice = ({
  item,
  style = "default",
  currencyCode,
}: LineItemPriceProps) => {
  const { total, original_total } = item;
  const originalPrice = original_total ?? 0;
  const currentPrice = total ?? 0;
  const hasReducedPrice = currentPrice < originalPrice;

  return (
    <div className={styles.container}>
      <div className={styles.textLeft}>
        {hasReducedPrice && (
          <>
            <p>
              {style === "default" && (
                <span style={{ color: "var(--text-muted)" }}>Original: </span>
              )}
              <span
                className={styles.lineThrough}
                data-testid="product-original-price"
              >
                {convertToLocale({
                  amount: originalPrice,
                  currency_code: currencyCode,
                })}
              </span>
            </p>
            {style === "default" && (
              <span className={styles.textInteractive}>
                -{getPercentageDiff(originalPrice, currentPrice)}%
              </span>
            )}
          </>
        )}
        <span
          className={`${styles.textBaseRegular} ${
            hasReducedPrice ? styles.textInteractive : ""
          }`}
          data-testid="product-price"
        >
          {convertToLocale({
            amount: currentPrice,
            currency_code: currencyCode,
          })}
        </span>
      </div>
    </div>
  );
};

export default LineItemPrice;
