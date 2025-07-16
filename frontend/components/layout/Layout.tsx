"use client";
import { useEffect, useState } from "react";
import BackToTop from "../elements/BackToTop";
import DataBg from "../elements/DataBg";
import Breadcrumb from "./Breadcrumb";
import Footer1 from "./footer/Footer1";
import Header1 from "./header/Header1";

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
      />
      <main>
        {breadcrumbTitle && <Breadcrumb breadcrumbTitle={breadcrumbTitle} />}
        {children}
      </main>
      <Footer1 />
      <BackToTop />
    </>
  );
}
