"use client";

import { Loader } from "@medusajs/icons";
import { HttpTypes } from "@medusajs/types";
import { convertToLocale } from "@/lib/util/money";
import { CheckCircleSolid } from "@medusajs/icons";
import { useEffect, useRef, useState } from "react";
import { RadioGroup, Radio } from "@headlessui/react";
import { Button, Heading, Text, clx } from "@medusajs/ui";
import { RazorpayPaymentButton } from "./payment-button";
import ErrorMessage from "@/modules/checkout/components/error-message";
import { calculatePriceForShippingOption } from "@/lib/data/fulfillment";
import { setShippingMethod, initiatePaymentSession } from "@/lib/data/cart";

type Props = {
  cart: HttpTypes.StoreCart;
  availableShippingMethods: HttpTypes.StoreCartShippingOption[] | null;
  availablePaymentMethods: any[];
};

const DEFAULT_PAYMENT_PROVIDER = "pp_razorpay_my-custom-payment";

const MasterStep = ({
  cart,
  availableShippingMethods,
}: //   availablePaymentMethods,
Props) => {
  const ref = useRef(null);

  // Shipping Methods State Management
  const [isLoading, setIsLoading] = useState(false);
  const [isLoadingPrices, setIsLoadingPrices] = useState(true);
  const [calculatedPricesMap, setCalculatedPricesMap] = useState<
    Record<string, number>
  >({});
  const [error, setError] = useState<string | null>(null);
  const [shippingMethodId, setShippingMethodId] = useState<string | null>(
    cart.shipping_methods?.at(-1)?.shipping_option_id || null
  );
  // Payment Methods State Management
  const activeSession = cart.payment_collection?.payment_sessions?.find(
    (paymentSession: any) => paymentSession.status === "pending"
  );
  const NotDeliverable =
    !cart || !cart.shipping_address || !cart.billing_address || !cart.email;

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

  const handleSubmit = async () => {
    // @ts-ignore
    setIsLoading(true);
    try {
      await initiatePaymentSession(cart, {
        provider_id: DEFAULT_PAYMENT_PROVIDER,
      });
      // @ts-ignore
      ref.current.click();
    } catch (err: any) {
      setError(err.message);
    } finally {
      setIsLoading(false);
    }

    // setPaymentMethodLogic
  };

  useEffect(() => {
    setError(null);
  }, [NotDeliverable]);

  const notReady =
    !cart ||
    !cart.shipping_address ||
    !cart.billing_address ||
    !cart.email ||
    (cart.shipping_methods?.length ?? 0) < 1;

  return (
    <div className="bg-white">
      {JSON.stringify(cart.shipping_methods)}
      <div className="flex flex-row items-center justify-between mb-6">
        <Heading
          level="h2"
          className={clx(
            "flex flex-row text-3xl-regular gap-x-2 items-baseline",
            {
              "opacity-50 pointer-events-none select-none":
                NotDeliverable && cart.shipping_methods?.length === 0,
            }
          )}
        >
          Delivery
          {NotDeliverable && (cart.shipping_methods?.length ?? 0) > 0 && (
            <CheckCircleSolid />
          )}
        </Heading>
      </div>
      {!NotDeliverable ? (
        <div data-testid="delivery-options-container">
          <div className="pb-2">
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
                    className={clx(
                      "flex items-center justify-between text-small-regular cursor-pointer py-4 border rounded-rounded px-8 mb-2 hover:shadow-borders-interactive-with-active",
                      {
                        "border-ui-border-interactive":
                          option.id === shippingMethodId,
                        "hover:shadow-brders-none cursor-not-allowed":
                          isDisabled,
                      }
                    )}
                  >
                    <div className="flex items-center gap-x-4">
                      {/* @ts-ignore */}
                      <Radio checked={option.id === shippingMethodId} />
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

          <Button
            size="large"
            className="mt-6"
            onClick={handleSubmit}
            isLoading={isLoading}
            disabled={!cart.shipping_methods?.[0]}
            data-testid="submit-delivery-option-button"
          >
            Place Order
          </Button>
        </div>
      ) : (
        <div>
          <div className="text-small-regular">
            {cart && (cart.shipping_methods?.length ?? 0) > 0 && (
              <div className="flex flex-col w-1/3">
                <Text className="txt-medium-plus text-ui-fg-base mb-1">
                  Method
                </Text>
                <Text className="txt-medium text-ui-fg-subtle">
                  {cart.shipping_methods?.at(-1)?.name}{" "}
                  {convertToLocale({
                    // @ts-ignore
                    amount: cart.shipping_methods.at(-1)?.amount!,
                    currency_code: cart?.currency_code,
                  })}
                </Text>
              </div>
            )}
          </div>
        </div>
      )}

      {!notReady && (
        <RazorpayPaymentButton
          ref={ref}
          cart={cart}
          notReady={notReady}
          session={activeSession ?? ({} as any)}
        />
      )}
    </div>
  );
};

export default MasterStep;
