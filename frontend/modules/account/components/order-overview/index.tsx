"use client";

import { Button } from "@medusajs/ui";
import styles from "./styles.module.css";

import OrderCard from "../order-card";
import { HttpTypes } from "@medusajs/types";
import Link from "next/link";

const OrderOverview = ({ orders }: { orders: HttpTypes.StoreOrder[] }) => {
  if (orders?.length) {
    return (
      <div className={styles.ordersContainer}>
        {orders.map((o) => (
          <div key={o.id} className={styles.orderItem}>
            <OrderCard order={o} />
          </div>
        ))}
      </div>
    );
  }

  return (
    <div className={styles.emptyContainer} data-testid="no-orders-container">
      <h2 className={styles.emptyTitle}>Nothing to see here</h2>
      <p className={styles.emptyText}>
        You don&apos;t have any orders yet, let us change that {":)"}
      </p>
      <div className={styles.buttonContainer}>
        <Link href="/" passHref>
          <Button data-testid="continue-shopping-button">
            Continue shopping
          </Button>
        </Link>
      </div>
    </div>
  );
};

export default OrderOverview;
