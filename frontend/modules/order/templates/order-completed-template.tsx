"use client";

import { Button } from "@medusajs/ui";
import { HttpTypes } from "@medusajs/types";
import Link from "next/link";
import { convertToLocale } from "@/lib/util/money";
import Thumbnail from "@/components/shop/Thumbnail";
import styles from "./order-completed-template.module.css";

type OrderCompletedTemplateProps = {
  order: HttpTypes.StoreOrder;
};

const OrderCompletedTemplate = ({ order }: OrderCompletedTemplateProps) => {
  const numberOfItems =
    order.items?.reduce((acc, item) => acc + item.quantity, 0) ?? 0;

  const getStatusClass = (status: string) => {
    switch (status.toLowerCase()) {
      case "completed":
        return styles.statusCompleted;
      case "canceled":
        return styles.statusCanceled;
      case "requires_action":
        return styles.statusRequiresAction;
      default:
        return styles.statusPending;
    }
  };

  return (
    <div className={styles.container}>
      <div className={styles.content}>
        {/* Success Header */}
        <div className={styles.header}>
          <div className={styles.successIcon}>
            <svg
              width="24"
              height="24"
              viewBox="0 0 24 24"
              fill="none"
              xmlns="http://www.w3.org/2000/svg"
            >
              <path
                d="M9 12L11 14L15 10M21 12C21 16.9706 16.9706 21 12 21C7.02944 21 3 16.9706 3 12C3 7.02944 7.02944 3 12 3C16.9706 3 21 7.02944 21 12Z"
                stroke="currentColor"
                strokeWidth="2"
                strokeLinecap="round"
                strokeLinejoin="round"
              />
            </svg>
          </div>
          <h1 className={styles.title}>Thank you for your order!</h1>
          <p className={styles.subtitle}>
            We've received your order and will begin processing it right away.
          </p>
        </div>

        {/* Order Summary */}
        <div className={styles.orderSummary}>
          <div className={styles.summaryHeader}>
            <h2 className={styles.summaryTitle}>Order Summary</h2>
            <div className={styles.orderId}>Order #{order.display_id}</div>
          </div>

          {/* Order Details */}
          <div className={styles.orderDetails}>
            <div className={styles.detailRow}>
              <span className={styles.detailLabel}>Order Date:</span>
              <span className={styles.detailValue}>
                {new Date(order.created_at).toLocaleDateString()}
              </span>
            </div>
            <div className={styles.detailRow}>
              <span className={styles.detailLabel}>Total Items:</span>
              <span className={styles.detailValue}>
                {numberOfItems} {numberOfItems === 1 ? "item" : "items"}
              </span>
            </div>
            <div className={styles.detailRow}>
              <span className={styles.detailLabel}>Total Amount:</span>
              <span className={styles.detailValue}>
                {convertToLocale({
                  amount: order.total,
                  currency_code: order.currency_code,
                })}
              </span>
            </div>
            <div className={styles.detailRow}>
              <span className={styles.detailLabel}>Status:</span>
              <span
                className={`${styles.status} ${getStatusClass(order.status)}`}
              >
                {order.status}
              </span>
            </div>
          </div>

          {/* Shipping Address */}
          {order.shipping_address && (
            <div className={styles.addressSection}>
              <h3 className={styles.addressTitle}>Shipping Address</h3>
              <div className={styles.addressContent}>
                <p className={styles.addressLine}>
                  {order.shipping_address.first_name}{" "}
                  {order.shipping_address.last_name}
                </p>
                {order.shipping_address.address_1 && (
                  <p className={styles.addressLine}>
                    {order.shipping_address.address_1}
                  </p>
                )}
                {order.shipping_address.address_2 && (
                  <p className={styles.addressLine}>
                    {order.shipping_address.address_2}
                  </p>
                )}
                <p className={styles.addressLine}>
                  {[
                    order.shipping_address.city,
                    order.shipping_address.province,
                    order.shipping_address.postal_code,
                  ]
                    .filter(Boolean)
                    .join(", ")}
                </p>
                <p className={styles.addressLine}>
                  {order.shipping_address.country_code}
                </p>
              </div>
            </div>
          )}

          {/* Order Items */}
          {order.items && order.items.length > 0 && (
            <div className={styles.itemsSection}>
              <h3 className={styles.itemsTitle}>Items Ordered</h3>
              <div className={styles.itemsList}>
                {order.items.map((item) => (
                  <div key={item.id} className={styles.itemCard}>
                    <div className={styles.itemImage}>
                      <Thumbnail
                        thumbnail={item.thumbnail}
                        images={[]}
                        size="full"
                      />
                    </div>
                    <div className={styles.itemDetails}>
                      <h4 className={styles.itemTitle}>{item.title}</h4>
                      <p className={styles.itemVariant}>
                        {item.variant?.title &&
                          `Variant: ${item.variant.title}`}
                      </p>
                      <div className={styles.itemMeta}>
                        <span className={styles.itemQuantity}>
                          Quantity: {item.quantity}
                        </span>
                        <span className={styles.itemPrice}>
                          {convertToLocale({
                            amount: item.unit_price,
                            currency_code: order.currency_code,
                          })}
                        </span>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          )}
        </div>

        {/* Action Buttons */}
        <div className={styles.actions}>
          <Link href="/" passHref>
            <Button className={styles.primaryButton}>Continue Shopping</Button>
          </Link>
          <Link href={`/account/orders/details/${order.id}`} passHref>
            <Button variant="secondary" className={styles.secondaryButton}>
              View Order Details
            </Button>
          </Link>
        </div>

        {/* Additional Info */}
        <div className={styles.additionalInfo}>
          <h3 className={styles.infoTitle}>What's Next?</h3>
          <div className={styles.infoContent}>
            <p className={styles.infoText}>
              You'll receive an email confirmation shortly. We'll also send you
              updates about your order status and tracking information once your
              order ships.
            </p>
            <p className={styles.infoText}>
              If you have any questions about your order, please don't hesitate
              to contact our customer support team.
            </p>
          </div>
        </div>
      </div>
    </div>
  );
};

export default OrderCompletedTemplate;
