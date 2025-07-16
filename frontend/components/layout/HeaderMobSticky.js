import Link from "next/link";
import CartShow from "../elements/CartShow";

export default function HeaderMobSticky({
  scroll,
  isMobileMenu,
  handleMobileMenu,
}) {
  return (
    <>
      <div
        id="header-mob-sticky"
        className={`tp-md-lg-header d-md-none pt-10 pb-10 ${
          scroll ? "header-sticky" : ""
        }`}
      >
        <div className="container">
          <div className="row align-items-center">
            <div className="col-3 d-flex align-items-center">
              <div className="header-canvas flex-auto">
                <button className="tp-menu-toggle" onClick={handleMobileMenu}>
                  <i className="far fa-bars" />
                </button>
              </div>
            </div>
            <div className="col-6">
              <div className="logo text-center">
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
            <div className="col-3">
              <div className="header-meta-info d-flex align-items-center justify-content-end ml-25">
                <div className="header-meta m-0 d-flex align-items-center">
                  <div className="header-meta__social d-flex align-items-center">
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
    </>
  );
}
