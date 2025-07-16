"use client";

import { RadioGroup, Radio } from "@headlessui/react";
import { setShippingMethod } from "@/lib/data/cart";
import { calculatePriceForShippingOption } from "@/lib/data/fulfillment";
import { convertToLocale } from "@/lib/util/money";
import { CheckCircleSolid, Loader } from "@medusajs/icons";
import { HttpTypes } from "@medusajs/types";
import { Heading, Text } from "@medusajs/ui";
import ErrorMessage from "@/modules/checkout/components/error-message";
import Divider from "@/components/store-front/divider";
import MedusaRadio from "@/modules/checkout/components/radio";
import { SubmitButton } from "@/modules/checkout/components/submit-button";
import { usePathname, useRouter, useSearchParams } from "next/navigation";
import { useEffect, useState } from "react";
import styles from "./shipping.module.css";
import { BiCheckCircle, BiCheckDouble, BiCircle } from "react-icons/bi";

type ShippingProps = {
  cart: HttpTypes.StoreCart;
  availableShippingMethods: HttpTypes.StoreCartShippingOption[] | null;
};

const Shipping: React.FC<ShippingProps> = ({
  cart,
  availableShippingMethods,
}) => {
  const [isLoading, setIsLoading] = useState(false);
  const [isLoadingPrices, setIsLoadingPrices] = useState(true);
  const [calculatedPricesMap, setCalculatedPricesMap] = useState<
    Record<string, number>
  >({});
  const [error, setError] = useState<string | null>(null);
  const [shippingMethodId, setShippingMethodId] = useState<string | null>(
    cart.shipping_methods?.at(-1)?.shipping_option_id || null
  );

  const searchParams = useSearchParams();
  const router = useRouter();
  const pathname = usePathname();

  const isOpen = searchParams.get("step") === "delivery";

  useEffect(() => {
    setIsLoadingPrices(true);

    if (availableShippingMethods?.length) {
      const promises = availableShippingMethods
        .filter((sm) => sm.price_type === "calculated")
        .map((sm) => calculatePriceForShippingOption(sm.id, cart.id));

      if (promises.length) {
        Promise.allSettled(promises).then((res) => {
          const pricesMap: Record<string, number> = {};
          res
            .filter((r) => r.status === "fulfilled")
            .forEach((p) => (pricesMap[p.value?.id || ""] = p.value?.amount!));

          setCalculatedPricesMap(pricesMap);
          setIsLoadingPrices(false);
        });
      }
    }
  }, [availableShippingMethods]);

  const handleEdit = () => {
    router.push(pathname + "?step=delivery", { scroll: false });
  };

  const handleSubmit = () => {
    router.push(pathname + "?step=payment", { scroll: false });
  };

  const handleSetShippingMethod = async (id: string) => {
    setError(null);
    let currentId: string | null = null;
    setIsLoading(true);
    setShippingMethodId((prev) => {
      currentId = prev;
      return id;
    });

    await setShippingMethod({ cartId: cart.id, shippingMethodId: id })
      .catch((err) => {
        setShippingMethodId(currentId);
        setError(err.message);
      })
      .finally(() => {
        setIsLoading(false);
      });
  };

  useEffect(() => {
    setError(null);
  }, [isOpen]);

  return (
    <div className={styles.container}>
      <div className={styles.header}>
        <Heading
          level="h2"
          className={`${styles.title} ${
            !isOpen && cart.shipping_methods?.length === 0
              ? styles.titleDisabled
              : ""
          }`}
        >
          Delivery
          {!isOpen && (cart.shipping_methods?.length ?? 0) > 0 && (
            <CheckCircleSolid />
          )}
        </Heading>
        {!isOpen &&
          cart?.shipping_address &&
          cart?.billing_address &&
          cart?.email && (
            <Text>
              <button
                onClick={handleEdit}
                className={styles.editButton}
                data-testid="edit-delivery-button"
              >
                Edit
              </button>
            </Text>
          )}
      </div>

      {isOpen ? (
        <div data-testid="delivery-options-container">
          <div className={styles.deliveryOptions}>
            <RadioGroup
              value={shippingMethodId}
              onChange={handleSetShippingMethod}
            >
              {availableShippingMethods?.map((option) => {
                const isDisabled =
                  option.price_type === "calculated" &&
                  !isLoadingPrices &&
                  typeof calculatedPricesMap[option.id] !== "number";

                return (
                  <Radio
                    key={option.id}
                    value={option.id}
                    data-testid="delivery-option-radio"
                    disabled={isDisabled}
                    className={`${styles.radioOption} ${
                      option.id === shippingMethodId
                        ? styles.radioOptionSelected
                        : ""
                    } ${isDisabled ? styles.radioOptionDisabled : ""}`}
                  >
                    <div className={styles.radioContent}>
                      {option.id === shippingMethodId ? (
                        <BiCheckCircle className={styles.checkIcon} />
                      ) : (
                        <BiCircle className={styles.checkIcon} />
                      )}
                      <span className="text-base-regular">{option.name}</span>
                    </div>
                    <span className="justify-self-end text-ui-fg-base">
                      {option.price_type === "flat" ? (
                        convertToLocale({
                          amount: option.amount!,
                          currency_code: cart?.currency_code,
                        })
                      ) : calculatedPricesMap[option.id] ? (
                        convertToLocale({
                          amount: calculatedPricesMap[option.id],
                          currency_code: cart?.currency_code,
                        })
                      ) : isLoadingPrices ? (
                        <Loader />
                      ) : (
                        "-"
                      )}
                    </span>
                  </Radio>
                );
              })}
            </RadioGroup>
          </div>

          <ErrorMessage
            error={error}
            data-testid="delivery-option-error-message"
          />

          <button
            className={styles.submitButton}
            onClick={handleSubmit}
            disabled={!cart.shipping_methods?.[0] || isLoading}
            data-testid="submit-delivery-option-button"
          >
            {isLoading && <span className={styles.spinner}></span>}
            Continue to payment
          </button>
        </div>
      ) : (
        <div>
          <div className="text-small-regular">
            {cart && (cart.shipping_methods?.length ?? 0) > 0 && (
              <div className={styles.summary}>
                <Text className={styles.summaryLabel}>Method</Text>
                <Text className="txt-medium text-ui-fg-subtle">
                  {cart.shipping_methods?.at(-1)?.name}{" "}
                  {convertToLocale({
                    amount: cart.shipping_methods.at(-1)?.amount!,
                    currency_code: cart?.currency_code,
                  })}
                </Text>
              </div>
            )}
          </div>
        </div>
      )}
      <Divider className={styles.divider} />
    </div>
  );
};

export default Shipping;
