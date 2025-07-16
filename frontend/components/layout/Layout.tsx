"use client";
import { useEffect, useState } from "react";
import BackToTop from "../elements/BackToTop";
import DataBg from "../elements/DataBg";
import Breadcrumb from "./Breadcrumb";
import HeaderCart from "./HeaderCart";
import Sidebar from "./Sidebar";
import Footer1 from "./footer/Footer1";
import Footer2 from "./footer/Footer2";
import Header1 from "./header/Header1";
import Header2 from "./header/Header2";
import Header3 from "./header/Header3";
import Header4 from "./header/Header4";
import Header5 from "./header/Header5";

interface LayoutProps {
  headerStyle?: number;
  footerStyle?: number;
  headTitle?: string;
  breadcrumbTitle?: string;
  children: React.ReactNode;
}

export default function Layout({
  headerStyle,
  footerStyle,
  headTitle,
  breadcrumbTitle,
  children,
}: LayoutProps) {
  const [scroll, setScroll] = useState(0);
  // Mobile Menu
  const [isMobileMenu, setMobileMenu] = useState(false);
  const handleMobileMenu = () => setMobileMenu(!isMobileMenu);

  // CartSidebar
  const [isCartSidebar, setCartSidebar] = useState(false);
  const handleCartSidebar = () => setCartSidebar(!isCartSidebar);

  useEffect(() => {
    const WOW = require("wowjs");
    // @ts-ignore
    window.wow = new WOW.WOW({
      live: false,
    });
    // @ts-ignore
    window.wow.init();

    document.addEventListener("scroll", () => {
      const scrollCheck = window.scrollY > 100;
      // @ts-ignore
      if (scrollCheck !== scroll) {
        // @ts-ignore
        setScroll(scrollCheck);
      }
    });
  }, []);
  return (
    <>
      <DataBg />
      <Header1
        scroll={scroll}
        isMobileMenu={isMobileMenu}
        handleMobileMenu={handleMobileMenu}
        isCartSidebar={isCartSidebar}
        handleCartSidebar={handleCartSidebar}
      />

      <Sidebar
        isMobileMenu={isMobileMenu}
        handleMobileMenu={handleMobileMenu}
      />
      <HeaderCart
        isCartSidebar={isCartSidebar}
        handleCartSidebar={handleCartSidebar}
      />
      <main>
        {breadcrumbTitle && <Breadcrumb breadcrumbTitle={breadcrumbTitle} />}

        {children}
      </main>

      {!footerStyle && <Footer1 />}
      {footerStyle == 1 ? <Footer1 /> : null}
      {footerStyle == 2 ? <Footer2 /> : null}

      <BackToTop />
    </>
  );
}
