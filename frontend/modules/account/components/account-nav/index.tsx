"use client";

import { clx } from "@medusajs/ui";
import { ArrowRightOnRectangle } from "@medusajs/icons";
import { useParams, usePathname } from "next/navigation";
import { HttpTypes } from "@medusajs/types";
import { signout } from "@/lib/data/customer";
import { BiChevronDown, BiUser, BiMapPin, BiPackage } from "react-icons/bi";
import Link from "next/link";
import styles from "./styles.module.css";

const AccountNav = ({
  customer,
}: {
  customer: HttpTypes.StoreCustomer | null;
}) => {
  const route = usePathname();
  const { countryCode } = useParams() as { countryCode: string };

  const handleLogout = async () => {
    await signout(countryCode);
  };

  return (
    <div>
      <div className={styles.mobileNav} data-testid="mobile-account-nav">
        {route !== `/${countryCode}/account` ? (
          <Link
            href="/account"
            className={styles.navItem}
            data-testid="account-main-link"
          >
            <>
              <BiChevronDown className={styles.backIcon} />
              <span>Account</span>
            </>
          </Link>
        ) : (
          <>
            <div className={styles.greeting}>Hello {customer?.first_name}</div>
            <div className={styles.navList}>
              <ul>
                <li>
                  <Link
                    href="/account/profile"
                    className={styles.navItem}
                    data-testid="profile-link"
                  >
                    <>
                      <div className={styles.navItemContent}>
                        <BiUser size={20} />
                        <span>Profile</span>
                      </div>
                      <BiChevronDown className={styles.navItemIcon} />
                    </>
                  </Link>
                </li>
                <li>
                  <Link
                    href="/account/addresses"
                    className={styles.navItem}
                    data-testid="addresses-link"
                  >
                    <>
                      <div className={styles.navItemContent}>
                        <BiMapPin size={20} />
                        <span>Addresses</span>
                      </div>
                      <BiChevronDown className={styles.navItemIcon} />
                    </>
                  </Link>
                </li>
                <li>
                  <Link
                    href="/account/orders"
                    className={styles.navItem}
                    data-testid="orders-link"
                  >
                    <div className={styles.navItemContent}>
                      <BiPackage size={20} />
                      <span>Orders</span>
                    </div>
                    <BiChevronDown className={styles.navItemIcon} />
                  </Link>
                </li>
                <li>
                  <button
                    type="button"
                    className={styles.navButton}
                    onClick={handleLogout}
                    data-testid="logout-button"
                  >
                    <div className={styles.navButtonContent}>
                      <ArrowRightOnRectangle />
                      <span>Log out</span>
                    </div>
                    <BiChevronDown className={styles.navItemIcon} />
                  </button>
                </li>
              </ul>
            </div>
          </>
        )}
      </div>
      <div className={styles.desktopNav} data-testid="account-nav">
        <div>
          <div className={styles.desktopNavContainer}>
            <h3 className={styles.desktopNavTitle}>Account</h3>
          </div>
          <div className={styles.navList}>
            <ul className={styles.desktopNavList}>
              <li>
                <AccountNavLink
                  href="/account"
                  route={route!}
                  data-testid="overview-link"
                >
                  Overview
                </AccountNavLink>
              </li>
              <li>
                <AccountNavLink
                  href="/account/profile"
                  route={route!}
                  data-testid="profile-link"
                >
                  Profile
                </AccountNavLink>
              </li>
              <li>
                <AccountNavLink
                  href="/account/addresses"
                  route={route!}
                  data-testid="addresses-link"
                >
                  Addresses
                </AccountNavLink>
              </li>
              <li>
                <AccountNavLink
                  href="/account/orders"
                  route={route!}
                  data-testid="orders-link"
                >
                  Orders
                </AccountNavLink>
              </li>
              <li>
                <button
                  type="button"
                  onClick={handleLogout}
                  className={styles.logoutButton}
                  data-testid="logout-button"
                >
                  Log out
                </button>
              </li>
            </ul>
          </div>
        </div>
      </div>
    </div>
  );
};

type AccountNavLinkProps = {
  href: string;
  route: string;
  children: React.ReactNode;
  "data-testid"?: string;
};

const AccountNavLink = ({
  href,
  route,
  children,
  "data-testid": dataTestId,
}: AccountNavLinkProps) => {
  const { countryCode }: { countryCode: string } = useParams();

  const active = route.split(countryCode)[1] === href;
  return (
    <Link
      href={href}
      className={clx(styles.navLink, {
        [styles.navLinkActive]: active,
      })}
      data-testid={dataTestId}
    >
      {children}
    </Link>
  );
};

export default AccountNav;
