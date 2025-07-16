"use client";

import { useState } from "react";
import ErrorMessage from "../error-message";
import { HttpTypes } from "@medusajs/types";
import { setAddresses } from "@/lib/data/cart";
import BillingAddress from "../billing_address";
import { SubmitButton } from "../submit-button";
import ShippingAddress from "../shipping-address";
import { CheckCircleSolid } from "@medusajs/icons";
import styles from "./addresses.module.css";

import Spinner from "@/components/store-front/spinner";
import Divider from "@/components/store-front/divider";
import compareAddresses from "@/util/compare-addresses";
import { Heading, Text, useToggleState } from "@medusajs/ui";
import { usePathname, useRouter, useSearchParams } from "next/navigation";

const Addresses = ({
  cart,
  customer,
}: {
  cart: HttpTypes.StoreCart | null;
  customer: HttpTypes.StoreCustomer | null;
}) => {
  const searchParams = useSearchParams();
  const router = useRouter();
  const pathname = usePathname();
  const [error, setError] = useState<string | null>(null);
  const [isLoading, setIsLoading] = useState(false);

  const isOpen = searchParams.get("step") === "address";

  const { state: sameAsBilling, toggle: toggleSameAsBilling } = useToggleState(
    cart?.shipping_address && cart?.billing_address
      ? compareAddresses(cart?.shipping_address, cart?.billing_address)
      : true
  );

  const handleEdit = () => {
    router.push(pathname + "?step=address");
  };

  const handleSubmit = async (formData: FormData) => {
    try {
      setIsLoading(true);
      setError(null);
      await setAddresses(null, formData);
      router.push(pathname + "?step=delivery");
      // window.location.reload();
    } catch (err: any) {
      setError(err.message);
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className={styles.container}>
      <div className={styles.header}>
        <Heading level="h2" className={styles.title}>
          Shipping Address
          {!isOpen && <CheckCircleSolid />}
        </Heading>
        {!isOpen && cart?.shipping_address && (
          <Text>
            <button
              onClick={handleEdit}
              className={styles.editButton}
              data-testid="edit-address-button"
            >
              Edit
            </button>
          </Text>
        )}
      </div>
      {isOpen ? (
        <form action={handleSubmit}>
          <div className={styles.form}>
            <ShippingAddress
              customer={customer}
              checked={sameAsBilling}
              onChange={toggleSameAsBilling}
              cart={cart}
            />

            {!sameAsBilling && (
              <div>
                <Heading level="h2" className={styles.billingSection}>
                  Billing address
                </Heading>

                <BillingAddress cart={cart} />
              </div>
            )}
            <SubmitButton
              className={styles.submitButton}
              data-testid="submit-address-button"
              disabled={isLoading}
            >
              Continue to delivery
            </SubmitButton>
            <ErrorMessage error={error} data-testid="address-error-message" />
          </div>
        </form>
      ) : (
        <div>
          <div className="text-small-regular">
            {cart && cart.shipping_address ? (
              <div className={styles.addressSummary}>
                <div className={styles.addressColumn}>
                  <div
                    className={styles.addressBlock}
                    data-testid="shipping-address-summary"
                  >
                    <Text className={styles.addressLabel}>
                      Shipping Address
                    </Text>
                    <Text className="txt-medium text-ui-fg-subtle">
                      {cart.shipping_address.first_name}{" "}
                      {cart.shipping_address.last_name}
                    </Text>
                    <Text className="txt-medium text-ui-fg-subtle">
                      {cart.shipping_address.address_1}{" "}
                      {cart.shipping_address.address_2}
                    </Text>
                    <Text className="txt-medium text-ui-fg-subtle">
                      {cart.shipping_address.postal_code},{" "}
                      {cart.shipping_address.city}
                    </Text>
                    <Text className="txt-medium text-ui-fg-subtle">
                      {cart.shipping_address.country_code?.toUpperCase()}
                    </Text>
                  </div>

                  <div
                    className={styles.addressBlock}
                    data-testid="shipping-contact-summary"
                  >
                    <Text className={styles.addressLabel}>Contact</Text>
                    <Text className="txt-medium text-ui-fg-subtle">
                      {cart.shipping_address.phone}
                    </Text>
                    <Text className="txt-medium text-ui-fg-subtle">
                      {cart.email}
                    </Text>
                  </div>

                  <div
                    className={styles.addressBlock}
                    data-testid="billing-address-summary"
                  >
                    <Text className={styles.addressLabel}>Billing Address</Text>

                    {sameAsBilling ? (
                      <Text className="txt-medium text-ui-fg-subtle">
                        Billing- and delivery address are the same.
                      </Text>
                    ) : (
                      <>
                        <Text className="txt-medium text-ui-fg-subtle">
                          {cart.billing_address?.first_name}{" "}
                          {cart.billing_address?.last_name}
                        </Text>
                        <Text className="txt-medium text-ui-fg-subtle">
                          {cart.billing_address?.address_1}{" "}
                          {cart.billing_address?.address_2}
                        </Text>
                        <Text className="txt-medium text-ui-fg-subtle">
                          {cart.billing_address?.postal_code},{" "}
                          {cart.billing_address?.city}
                        </Text>
                        <Text className="txt-medium text-ui-fg-subtle">
                          {cart.billing_address?.country_code?.toUpperCase()}
                        </Text>
                      </>
                    )}
                  </div>
                </div>
              </div>
            ) : (
              <div>
                <Spinner />
              </div>
            )}
          </div>
        </div>
      )}
      <Divider className={styles.divider} />
    </div>
  );
};

export default Addresses;
