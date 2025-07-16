"use client";

import { Text, clx, Input } from "@medusajs/ui";
import { updateLineItem } from "@/lib/data/cart";
import { HttpTypes } from "@medusajs/types";
import { useState } from "react";

import Link from "next/link";
import Thumbnail from "@/components/shop/Thumbnail";
import LineItemOptions from "./line-item-options";
import DeleteButton from "@/components/store-front/delete-button";
import Spinner from "@/components/store-front/spinner";
import ErrorMessage from "@/components/store-front/error-message";
import LineItemPrice from "@/components/store-front/line-item-price";
import LineItemUnitPrice from "@/components/store-front/line-item-unit-price";

import styles from "@/styles/cart-item.module.css";

type ItemProps = {
  item: HttpTypes.StoreCartLineItem;
  type?: "full" | "preview";
  currencyCode: string;
};

const Item = ({ item, type = "full", currencyCode }: ItemProps) => {
  const [updating, setUpdating] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const changeQuantity = async (quantity: number) => {
    setError(null);
    setUpdating(true);

    await updateLineItem({
      lineId: item.id,
      quantity,
    })
      .catch((err) => {
        setError(err.message);
      })
      .finally(() => {
        setUpdating(false);
      });
  };

  const maxQtyFromInventory = 10;
  const maxQuantity = item.variant?.manage_inventory ? 10 : maxQtyFromInventory;

  // Desktop Table Row
  const TableRow = () => (
    <tr className={styles.row} data-testid="product-row">
      <td className={styles.imageCell}>
        <Link
          href={`/product/${item.product_handle}`}
          className={
            type === "preview" ? styles.imageLinkPreview : styles.imageLinkFull
          }
        >
          <Thumbnail
            thumbnail={item.thumbnail}
            images={item.variant?.product?.images}
            size="square"
          />
        </Link>
      </td>

      <td className={styles.textLeft}>
        <Text className={styles.title} data-testid="product-title">
          {item.product_title}
        </Text>
        <LineItemOptions variant={item.variant} data-testid="product-variant" />
      </td>

      {type === "full" && (
        <td className={styles.quantityCell}>
          <div className={styles.quantityWrapper}>
            <DeleteButton id={item.id} data-testid="product-delete-button" />
            <Input
              type="number"
              value={item.quantity}
              className={styles.input}
              onChange={(value) => {
                if (
                  !isNaN(parseInt(value.target.value)) &&
                  parseInt(value.target.value) <= 100
                ) {
                  changeQuantity(parseInt(value.target.value));
                }
              }}
            />
            {updating && <Spinner />}
          </div>
          <ErrorMessage error={error} data-testid="product-error-message" />
        </td>
      )}

      {type === "full" && (
        <td className={styles.priceCell}>
          <LineItemUnitPrice
            item={item}
            style="tight"
            currencyCode={currencyCode}
          />
        </td>
      )}

      <td className={styles.priceCell}>
        <span className={type === "preview" ? styles.pricePreview : undefined}>
          {type === "preview" && (
            <span className={styles.priceX}>
              <Text>{item.quantity}x </Text>
              <LineItemUnitPrice
                item={item}
                style="tight"
                currencyCode={currencyCode}
              />
            </span>
          )}
          <LineItemPrice
            item={item}
            style="tight"
            currencyCode={currencyCode}
          />
        </span>
      </td>
    </tr>
  );

  // Mobile Card
  const MobileCard = () => (
    <div className={styles.mobileCard} data-testid="product-row">
      <div className={styles.mobileCardHeader}>
        <Link
          href={`/product/${item.product_handle}`}
          className={styles.mobileImageLink}
        >
          <Thumbnail
            thumbnail={item.thumbnail}
            images={item.variant?.product?.images}
            size="square"
          />
        </Link>
        <div className={styles.mobileProductInfo}>
          <Text className={styles.mobileTitle} data-testid="product-title">
            {item.product_title}
          </Text>
          <LineItemOptions
            variant={item.variant}
            data-testid="product-variant"
          />
        </div>
        <DeleteButton id={item.id} data-testid="product-delete-button" />
      </div>

      <div className={styles.mobileCardBody}>
        {type === "full" && (
          <div className={styles.mobileQuantitySection}>
            <div className={styles.mobileQuantityWrapper}>
              <Input
                type="number"
                value={item.quantity}
                className={styles.mobileInput}
                onChange={(value) => {
                  if (
                    !isNaN(parseInt(value.target.value)) &&
                    parseInt(value.target.value) <= 100
                  ) {
                    changeQuantity(parseInt(value.target.value));
                  }
                }}
              />
              {updating && <Spinner />}
            </div>
            <ErrorMessage error={error} data-testid="product-error-message" />
          </div>
        )}

        <div className={styles.mobilePriceSection}>
          {type === "full" && (
            <div className={styles.mobileUnitPrice}>
              <LineItemUnitPrice
                item={item}
                style="tight"
                currencyCode={currencyCode}
              />
            </div>
          )}
          <div className={styles.mobileTotalPrice}>
            <LineItemPrice
              item={item}
              style="tight"
              currencyCode={currencyCode}
            />
          </div>
        </div>
      </div>
    </div>
  );

  return (
    <>
      <TableRow />
      <MobileCard />
    </>
  );
};

export default Item;
