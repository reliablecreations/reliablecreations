import React from "react";
import styles from "./styles.module.css";

import AddAddress from "../address-card/add-address";
import EditAddress from "../address-card/edit-address-modal";
import { HttpTypes } from "@medusajs/types";

type AddressBookProps = {
  customer: HttpTypes.StoreCustomer;
  region: HttpTypes.StoreRegion;
};

const AddressBook: React.FC<AddressBookProps> = ({ customer, region }) => {
  const { addresses } = customer;
  return (
    <div className={styles.container}>
      <div className={styles.grid}>
        <AddAddress region={region} addresses={addresses} />
        {addresses.map((address) => {
          return (
            <EditAddress region={region} address={address} key={address.id} />
          );
        })}
      </div>
    </div>
  );
};

export default AddressBook;
