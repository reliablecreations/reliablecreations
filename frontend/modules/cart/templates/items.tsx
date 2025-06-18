import repeat from "@/lib/util/repeat";
import { HttpTypes } from "@medusajs/types";
import { Heading, Table } from "@medusajs/ui";
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
      <Table>
        <Table.Header>
          <Table.Row className={styles.tableHeader}>
            <Table.HeaderCell className="!pl-0">Item</Table.HeaderCell>
            <Table.HeaderCell></Table.HeaderCell>
            <Table.HeaderCell>Quantity</Table.HeaderCell>
            <Table.HeaderCell className={styles.hiddenOnSmall}>
              Price
            </Table.HeaderCell>
            <Table.HeaderCell className={`${styles.rightAlign} !pr-0`}>
              Total
            </Table.HeaderCell>
          </Table.Row>
        </Table.Header>
        <Table.Body>
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
            : repeat(5).map((i) => <div key={i}>Loading...</div>)}
        </Table.Body>
      </Table>
    </div>
  );
};

export default ItemsTemplate;
