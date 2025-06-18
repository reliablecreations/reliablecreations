"use client";

import React, { useEffect } from "react";
import { useFormState } from "react-dom";
import styles from "./styles.module.css";

import Input from "@/components/store-front/input";

import AccountInfo from "../account-info";
import { HttpTypes } from "@medusajs/types";
// import { updateCustomer } from "@lib/data/customer"

type MyInformationProps = {
  customer: HttpTypes.StoreCustomer;
};

const ProfileEmail: React.FC<MyInformationProps> = ({ customer }) => {
  const [successState, setSuccessState] = React.useState(false);

  // TODO: It seems we don't support updating emails now?
  const updateCustomerEmail = (
    _currentState: Record<string, unknown>,
    formData: FormData
  ) => {
    const customer = {
      email: formData.get("email") as string,
    };

    try {
      // await updateCustomer(customer)
      return { success: true, error: null };
    } catch (error: any) {
      return { success: false, error: error.toString() };
    }
  };

  const [state, formAction] = useFormState(updateCustomerEmail, {
    error: false,
    success: false,
  });

  const clearState = () => {
    setSuccessState(false);
  };

  useEffect(() => {
    setSuccessState(state.success);
  }, [state]);

  return (
    <form action={formAction} className={styles.form}>
      <AccountInfo
        label="Email"
        currentInfo={`${customer.email}`}
        isSuccess={successState}
        isError={!!state.error}
        errorMessage={state.error}
        clearState={clearState}
        data-testid="account-email-editor"
      >
        <div className={styles.inputGrid}>
          <Input
            label="Email"
            name="email"
            type="email"
            autoComplete="email"
            required
            defaultValue={customer.email}
            data-testid="email-input"
          />
        </div>
      </AccountInfo>
    </form>
  );
};

export default ProfileEmail;
