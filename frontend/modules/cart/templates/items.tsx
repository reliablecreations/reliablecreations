import repeat from "@/lib/util/repeat";
import { HttpTypes } from "@medusajs/types";
import { Heading } from "@medusajs/ui";
import Item from "@/modules/cart/components/item";

import styles from "@/styles/items.module.css";

type ItemsTemplateProps = {
  cart?: HttpTypes.StoreCart;
};

const ItemsTemplate = ({ cart }: ItemsTemplateProps) => {
  const items = cart?.items;

  return (
    <div className={styles.wrapper}>
      <div className={styles.header}>
        <Heading className={styles.heading}>Cart</Heading>
      </div>

      {/* Desktop Table View */}
      <div className={styles.tableContainer}>
        <table className={styles.table}>
          <thead>
            <tr className={styles.tableHeader}>
              <th className={styles.headerCell}>Item</th>
              <th className={styles.headerCell}></th>
              <th className={styles.headerCell}>Quantity</th>
              <th className={`${styles.headerCell} ${styles.hiddenOnSmall}`}>
                Price
              </th>
              <th className={`${styles.headerCell} ${styles.rightAlign}`}>
                Total
              </th>
            </tr>
          </thead>
          <tbody>
            {items
              ? items
                  .sort((a, b) =>
                    (a.created_at ?? "") > (b.created_at ?? "") ? -1 : 1
                  )
                  .map((item) => (
                    <Item
                      key={item.id}
                      item={item}
                      currencyCode={cart?.currency_code}
                    />
                  ))
              : repeat(5).map((i) => (
                  <tr key={i} className={styles.loadingRow}>
                    <td colSpan={5} className={styles.loadingCell}>
                      Loading...
                    </td>
                  </tr>
                ))}
          </tbody>
        </table>
      </div>

      {/* Mobile Card View */}
      <div className={styles.mobileContainer}>
        {items
          ? items
              .sort((a, b) =>
                (a.created_at ?? "") > (b.created_at ?? "") ? -1 : 1
              )
              .map((item) => (
                <Item
                  key={item.id}
                  item={item}
                  currencyCode={cart?.currency_code}
                />
              ))
          : repeat(5).map((i) => (
              <div key={i} className={styles.mobileLoadingCard}>
                Loading...
              </div>
            ))}
      </div>
    </div>
  );
};

export default ItemsTemplate;
