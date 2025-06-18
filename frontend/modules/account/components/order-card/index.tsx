import { Button } from "@medusajs/ui";
import { useMemo } from "react";
import styles from "./styles.module.css";

import { convertToLocale } from "@/lib/util/money";
import { HttpTypes } from "@medusajs/types";
import Thumbnail from "@/components/shop/Thumbnail";
import Link from "next/link";

type OrderCardProps = {
  order: HttpTypes.StoreOrder;
};

const OrderCard = ({ order }: OrderCardProps) => {
  const numberOfLines = useMemo(() => {
    return (
      order.items?.reduce((acc, item) => {
        return acc + item.quantity;
      }, 0) ?? 0
    );
  }, [order]);

  const numberOfProducts = useMemo(() => {
    return order.items?.length ?? 0;
  }, [order]);

  return (
    <div className={styles.container} data-testid="order-card">
      <div className={styles.orderId}>
        #<span data-testid="order-display-id">{order.display_id}</span>
      </div>
      <div className={styles.orderInfo}>
        <span className={styles.orderInfoItem} data-testid="order-created-at">
          {new Date(order.created_at).toDateString()}
        </span>
        <span className={styles.orderInfoItem} data-testid="order-amount">
          {convertToLocale({
            amount: order.total,
            currency_code: order.currency_code,
          })}
        </span>
        <span className={styles.orderInfoItem}>{`${numberOfLines} ${
          numberOfLines > 1 ? "items" : "item"
        }`}</span>
      </div>
      <div className={styles.itemsGrid}>
        {order.items?.slice(0, 3).map((i) => {
          return (
            <div
              key={i.id}
              className={styles.itemContainer}
              data-testid="order-item"
            >
              <Thumbnail thumbnail={i.thumbnail} images={[]} size="full" />
              <div className={styles.itemInfo}>
                <span className={styles.itemTitle} data-testid="item-title">
                  {i.title}
                </span>
                <span className={styles.itemQuantity}>x</span>
                <span data-testid="item-quantity">{i.quantity}</span>
              </div>
            </div>
          );
        })}
        {numberOfProducts > 4 && (
          <div className={styles.moreItems}>
            <span className={styles.moreItemsText}>+ {numberOfLines - 4}</span>
            <span className={styles.moreItemsText}>more</span>
          </div>
        )}
      </div>
      <div className={styles.buttonContainer}>
        <Link href={`/account/orders/details/${order.id}`}>
          <Button data-testid="order-details-link" variant="secondary">
            See details
          </Button>
        </Link>
      </div>
    </div>
  );
};

export default OrderCard;
