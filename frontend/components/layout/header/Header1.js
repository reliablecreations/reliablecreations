"use client";
import Link from "next/link";
import HeaderSticky from "../HeaderSticky";
import HeaderMobSticky from "../HeaderMobSticky";
import HeaderTabSticky from "../HeaderTabSticky";
import Search from "@/components/store-front/search";
import CartShow from "@/components/elements/CartShow";

export default function Header1({ scroll, isMobileMenu, handleMobileMenu }) {
  // const [isToggled, setToggled] = useState(false);
  // const handleToggle = () => setToggled(!isToggled);
  return (
    <>
      <header>
        {/* <div className="header-top space-bg">
          <div className="container">
            <div className="row">
              <div className="col-12">
                <div className="header-welcome-text text-start ">
                  <span>
                    Welcome to our international shop! Enjoy free shipping on
                    orders $100 up.
                  </span>
                  <Link href="/shop">
                    Shop Now <i className="fal fa-long-arrow-right" />{" "}
                  </Link>
                </div>
              </div>
            </div>
          </div>
        </div> */}
        <div className="logo-area mt-20 d-none d-xl-block">
          <div className="container">
            <div className="row align-items-center">
              <div className="col-xl-2 col-lg-3">
                <div className="logo">
                  <Link href="/">
                    <img
                      src="/assets/img/logo/logo.png"
                      style={{
                        maxWidth: "80px",
                      }}
                      alt="logo"
                    />
                  </Link>
                </div>
              </div>
              <div className="col-xl-10 col-lg-9">
                <div className="header-meta-info d-flex align-items-center justify-content-between">
                  <Search />
                  <div className="header-meta header-brand d-flex align-items-center">
                    <div className="header-meta__social d-flex align-items-center ml-25">
                      <Link
                        className="header-cart p-relative tp-cart-toggle"
                        href="/mycart"
                      >
                        <i className="fal fa-shopping-cart" />
                        <CartShow />
                      </Link>
                      <Link href="/sign-in">
                        <i className="fal fa-user" />
                      </Link>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
        <div className="mt-20" />
      </header>
      <HeaderSticky scroll={scroll} />
      <HeaderTabSticky scroll={scroll} isMobileMenu={isMobileMenu} />
      <HeaderMobSticky scroll={scroll} isMobileMenu={isMobileMenu} />
    </>
  );
}
