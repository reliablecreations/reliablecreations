import ItemsTemplate from "./items";
import Summary from "./summary";
import EmptyCartMessage from "../components/empty-cart-message";
import Divider from "@/components/store-front/divider";
import { HttpTypes } from "@medusajs/types";

import styles from "@/styles/cart-template.module.css";

const CartTemplate = ({
  cart,
  customer,
}: {
  cart: HttpTypes.StoreCart | null;
  customer: HttpTypes.StoreCustomer | null;
}) => {
  return (
    <div className={styles.wrapper}>
      <div className={styles.container} data-testid="cart-container">
        {cart?.items?.length ? (
          <div className={styles.layout}>
            <ItemsTemplate cart={cart} />
            <div className={styles.right}>
              <div className={styles.stickyRight}>
                {cart && cart.region && (
                  <div className={styles.summaryBox}>
                    <Summary cart={cart as any} />
                  </div>
                )}
              </div>
            </div>
          </div>
        ) : (
          <EmptyCartMessage />
        )}
      </div>
    </div>
  );
};

export default CartTemplate;
