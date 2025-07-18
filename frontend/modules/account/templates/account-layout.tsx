import React from "react";
import styles from "./account-layout.module.css";

import Link from "next/link";
import AccountNav from "../components/account-nav";
import { HttpTypes } from "@medusajs/types";

interface AccountLayoutProps {
  customer: HttpTypes.StoreCustomer | null;
  children: React.ReactNode;
}

const AccountLayout: React.FC<AccountLayoutProps> = ({
  customer,
  children,
}) => {
  return (
    <div
  className={`${styles.container} px-4 sm:px-6 lg:px-8`}
  data-testid="account-page"
>
  <div className={styles.contentContainer}>
    <div className={styles.mainGrid}>
      <div>{customer && <AccountNav customer={customer} />}</div>
      <div className={styles.mainContent}>{children}</div>
    </div>
    <div className={styles.footer}>
      <div>
        <h3 className={styles.footerTitle}>Got questions?</h3>
        <span className={styles.footerText}>
          You can find frequently asked questions and answers on our
          customer service page.
        </span>
      </div>
      <div>
        <Link href="/contact" className={styles.footerLink}>
          Customer Service
        </Link>
      </div>
    </div>
  </div>
</div>

  );
};

export default AccountLayout;
