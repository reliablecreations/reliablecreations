"use client";
import { addToCart } from "@/lib/data/cart";
import { HttpTypes } from "@medusajs/types";
import { Button } from "@medusajs/ui";
import { isEqual } from "lodash";
import React, { useEffect, useMemo, useState } from "react";
import styles from "./add-to-cart-btn.module.css";

type CartButtonProps = {
  product: HttpTypes.StoreProduct;

  countryCode: string;
  disabled?: boolean;
};

const optionsAsKeymap = (
  variantOptions: HttpTypes.StoreProductVariant["options"]
) => {
  return variantOptions?.reduce((acc: Record<string, string>, varopt: any) => {
    acc[varopt.option_id] = varopt.value;
    return acc;
  }, {});
};

const AddToCartButton = ({
  product,
  countryCode,
  disabled,
}: CartButtonProps) => {
  const [options, setOptions] = useState<Record<string, string | undefined>>(
    {}
  );

  const [isAdding, setIsAdding] = useState(false);

  // If there is only 1 variant, preselect the options
  useEffect(() => {
    const variantOptions = optionsAsKeymap(
      product.variants && product.variants[0].options
    );
    setOptions(variantOptions ?? {});
  }, [product.variants]);

  const selectedVariant = useMemo(() => {
    if (!product.variants || product.variants.length === 0) {
      return;
    }
    const fVariant = product.variants.find((v) => {
      const variantOptions = optionsAsKeymap(v.options);
      return isEqual(variantOptions, options);
    });
    return fVariant;
  }, [product.variants, options]);

  // update the options when a variant is selected
  const setOptionValue = (optionId: string, value: string) => {
    setOptions((prev) => ({
      ...prev,
      [optionId]: value,
    }));
  };

  //check if the selected options produce a valid variant
  const isValidVariant = useMemo(() => {
    return product.variants?.some((v) => {
      const variantOptions = optionsAsKeymap(v.options);
      return isEqual(variantOptions, options);
    });
  }, [product.variants, options]);

  // check if the selected variant is in stock

  const inStock = useMemo(() => {
    // If we don't manage inventory, we can always add to cart
    if (selectedVariant && !selectedVariant.manage_inventory) {
      return true;
    }

    // If we allow back orders on the variant, we can add to cart
    if (selectedVariant?.allow_backorder) {
      return true;
    }

    if (
      selectedVariant?.inventory_quantity &&
      (selectedVariant?.inventory_quantity || 0) == 0
    ) {
      return true;
    }

    // If there is inventory available, we can add to cart
    if (
      // @ts-ignore
      selectedVariant?.inventory &&
      // @ts-ignore
      (selectedVariant?.inventory_items.length || 0) > 0
    ) {
      return true;
    }

    // Otherwise, we can't add to cart
    return false;
  }, [selectedVariant]);

  // add the selected variant to the cart
  const handleAddToCart = async () => {
    if (!selectedVariant?.id) return null;

    setIsAdding(true);

    await addToCart({
      variantId: selectedVariant.id,
      quantity: 1,
      countryCode,
    });

    setIsAdding(false);
  };

  return (
    <Button
      onClick={handleAddToCart}
      disabled={
        !inStock ||
        !selectedVariant ||
        !!disabled ||
        isAdding ||
        !isValidVariant
      }
      className={styles.addToCartButton}
      data-testid="add-product-button"
    >
      <span className={isAdding ? styles.loadingText : ""}>
        {!selectedVariant && !options
          ? "Select variant"
          : !inStock || !isValidVariant
          ? "Out of stock"
          : "Add to Cart"}
        {isAdding && "..."}
      </span>
    </Button>
  );
};

export default AddToCartButton;
