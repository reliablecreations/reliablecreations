"use client";

import { Plus } from "@medusajs/icons";
import { Button, Heading } from "@medusajs/ui";
import { useEffect, useState, useActionState } from "react";

import useToggleState from "@/lib/hooks/use-toggle-state";
// import CountrySelect from "@modules/checkout/components/country-select"
import CountrySelect from "@/modules/checkout/components/country-select";
import Input from "@/components/store-front/input";
// import Modal from "@modules/common/components/modal";
import Modal from "@/components/store-front/modal";
// import { SubmitButton } from "@modules/checkout/components/submit-button"
import { SubmitButton } from "@/modules/checkout/components/submit-button";
import { HttpTypes } from "@medusajs/types";
import { addCustomerAddress } from "@/lib/data/customer";
import { useFormState } from "react-dom";
import styles from "./add-address.module.css";

const AddAddress = ({
  region,
  addresses,
}: {
  region: HttpTypes.StoreRegion;
  addresses: HttpTypes.StoreCustomerAddress[];
}) => {
  const [successState, setSuccessState] = useState(false);
  const { state, open, close: closeModal } = useToggleState(false);

  const [formState, formAction] = useFormState(addCustomerAddress, {
    isDefaultShipping: addresses.length === 0,
    success: false,
    error: null,
  });

  const close = () => {
    setSuccessState(false);
    closeModal();
  };

  useEffect(() => {
    if (successState) {
      close();
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [successState]);

  useEffect(() => {
    if (formState.success) {
      setSuccessState(true);
    }
  }, [formState]);

  return (
    <>
      <button
        className={styles.addAddressButton}
        onClick={open}
        data-testid="add-address-button"
      >
        <span className={styles.addAddressText}>New address</span>
        <Plus />
      </button>

      <Modal isOpen={state} close={close} data-testid="add-address-modal">
        <Modal.Title>
          <p className={styles.modalTitle}>Add address</p>
        </Modal.Title>
        <form action={formAction}>
          <Modal.Body>
            <div className={styles.formContainer}>
              <div className={styles.nameGrid}>
                <Input
                  label="First name"
                  name="first_name"
                  required
                  autoComplete="given-name"
                  data-testid="first-name-input"
                />
                <Input
                  label="Last name"
                  name="last_name"
                  required
                  autoComplete="family-name"
                  data-testid="last-name-input"
                />
              </div>
              <Input
                label="Company"
                name="company"
                autoComplete="organization"
                data-testid="company-input"
              />
              <Input
                label="Address"
                name="address_1"
                required
                autoComplete="address-line1"
                data-testid="address-1-input"
              />
              <Input
                label="Apartment, suite, etc."
                name="address_2"
                autoComplete="address-line2"
                data-testid="address-2-input"
              />
              <div className={styles.postalCityGrid}>
                <Input
                  label="Postal code"
                  name="postal_code"
                  required
                  autoComplete="postal-code"
                  data-testid="postal-code-input"
                />
                <Input
                  label="City"
                  name="city"
                  required
                  autoComplete="locality"
                  data-testid="city-input"
                />
              </div>
              <Input
                label="Province / State"
                name="province"
                autoComplete="address-level1"
                data-testid="state-input"
              />
              <CountrySelect
                region={region}
                name="country_code"
                required
                autoComplete="country"
                data-testid="country-select"
              />
              <Input
                label="Phone"
                name="phone"
                autoComplete="phone"
                data-testid="phone-input"
              />
            </div>
            {formState.error && (
              <div className={styles.errorMessage} data-testid="address-error">
                {formState.error}
              </div>
            )}
          </Modal.Body>
          <Modal.Footer>
            <div className={styles.footerContainer}>
              <Button
                type="reset"
                variant="secondary"
                onClick={close}
                className={styles.footerButton}
                data-testid="cancel-button"
              >
                Cancel
              </Button>
              <SubmitButton data-testid="save-button">Save</SubmitButton>
            </div>
          </Modal.Footer>
        </form>
      </Modal>
    </>
  );
};

export default AddAddress;
