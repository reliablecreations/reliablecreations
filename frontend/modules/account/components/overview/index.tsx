import { Container } from "@medusajs/ui";
import styles from "./styles.module.css";

import { convertToLocale } from "@/lib/util/money";
import { HttpTypes } from "@medusajs/types";
import { BiChevronDown } from "react-icons/bi";
import Link from "next/link";

type OverviewProps = {
  customer: HttpTypes.StoreCustomer | null;
  orders: HttpTypes.StoreOrder[] | null;
};

const Overview = ({ customer, orders }: OverviewProps) => {
  return (
    <div data-testid="overview-page-wrapper">
      <div className={styles.desktopView}>
        <div className={styles.header}>
          <span data-testid="welcome-message" data-value={customer?.first_name}>
            Hello {customer?.first_name}
          </span>
          <span className={styles.signedInText}>
            Signed in as:{" "}
            <span
              className={styles.signedInEmail}
              data-testid="customer-email"
              data-value={customer?.email}
            >
              {customer?.phone}
            </span>
          </span>
        </div>
        <div className={styles.content}>
          <div className={styles.statsContainer}>
            <div className={styles.statsRow}>
              <div className={styles.statGroup}>
                <h3 className={styles.statTitle}>Profile</h3>
                <div className={styles.statValue}>
                  <span
                    className={styles.statNumber}
                    data-testid="customer-profile-completion"
                    data-value={getProfileCompletion(customer)}
                  >
                    {getProfileCompletion(customer)}%
                  </span>
                  <span className={styles.statLabel}>Completed</span>
                </div>
              </div>

              <div className={styles.statGroup}>
                <h3 className={styles.statTitle}>Addresses</h3>
                <div className={styles.statValue}>
                  <span
                    className={styles.statNumber}
                    data-testid="addresses-count"
                    data-value={customer?.addresses?.length || 0}
                  >
                    {customer?.addresses?.length || 0}
                  </span>
                  <span className={styles.statLabel}>Saved</span>
                </div>
              </div>
            </div>

            <div className={styles.ordersSection}>
              <div className={styles.ordersHeader}>
                <h3 className={styles.statTitle}>Recent orders</h3>
              </div>
              <ul className={styles.ordersList} data-testid="orders-wrapper">
                {orders && orders.length > 0 ? (
                  orders.slice(0, 5).map((order) => {
                    return (
                      <li
                        key={order.id}
                        data-testid="order-wrapper"
                        data-value={order.id}
                      >
                        <Link href={`/account/orders/details/${order.id}`}>
                          <Container className={styles.orderContainer}>
                            <div className={styles.orderInfo}>
                              <span className={styles.orderLabel}>
                                Date placed
                              </span>
                              <span className={styles.orderLabel}>
                                Order number
                              </span>
                              <span className={styles.orderLabel}>
                                Total amount
                              </span>
                              <span data-testid="order-created-date">
                                {new Date(order.created_at).toDateString()}
                              </span>
                              <span
                                data-testid="order-id"
                                data-value={order.display_id}
                              >
                                #{order.display_id}
                              </span>
                              <span data-testid="order-amount">
                                {convertToLocale({
                                  amount: order.total,
                                  currency_code: order.currency_code,
                                })}
                              </span>
                            </div>
                            <button
                              className={styles.orderButton}
                              data-testid="open-order-button"
                            >
                              <span className="sr-only">
                                Go to order #{order.display_id}
                              </span>
                              <BiChevronDown
                                className={styles.orderButtonIcon}
                              />
                            </button>
                          </Container>
                        </Link>
                      </li>
                    );
                  })
                ) : (
                  <span data-testid="no-orders-message">No recent orders</span>
                )}
              </ul>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

const getProfileCompletion = (customer: HttpTypes.StoreCustomer | null) => {
  let count = 0;

  if (!customer) {
    return 0;
  }

  if (customer.email) {
    count++;
  }

  if (customer.first_name && customer.last_name) {
    count++;
  }

  if (customer.phone) {
    count++;
  }

  const billingAddress = customer.addresses?.find(
    (addr) => addr.is_default_billing
  );

  if (billingAddress) {
    count++;
  }

  return (count / 4) * 100;
};

export default Overview;
