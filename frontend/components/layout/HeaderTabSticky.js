import Link from "next/link";
import CartShow from "../elements/CartShow";
import Search from "../store-front/search";
export default function HeaderTabSticky({
  scroll,
  isMobileMenu,
  handleMobileMenu,
}) {
  return (
    <>
      <div
        id="header-tab-sticky"
        className={`tp-md-lg-header d-none d-md-block d-xl-none pt-30 pb-30 ${
          scroll ? "header-sticky" : ""
        }`}
      >
        <div className="container">
          <div className="row align-items-center">
            <div className="col-lg-3 col-md-4 d-flex align-items-center">
              <div className="header-canvas flex-auto">
                <button className="tp-menu-toggle" onClick={handleMobileMenu}>
                  <i className="far fa-bars" />
                </button>
              </div>
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
            <div className="col-lg-9 col-md-8">
              <div className="header-meta-info d-flex align-items-center justify-content-between">
                <Search />
                <div className="header-meta__social d-flex align-items-center ml-25">
                  <Link
                    className="header-cart p-relative tp-cart-toggle"
                    href="/mycart"
                  >
                    <i className="fal fa-shopping-cart" />
                    <CartShow />
                  </Link>
                  <Link href="/login">
                    <i className="fal fa-user" />
                  </Link>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </>
  );
}
