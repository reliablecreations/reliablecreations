import Link from "next/link";

export default function Footer1() {
  return (
    <>
      <footer>
        <div className="footer-area theme-bg pt-65">
          <div className="container">
            <div className="main-footer pb-15 mb-30">
              <div className="row">
                <div className="col-lg-3 col-md-4 col-sm-6">
                  <div className="footer-widget footer-col-1 mb-40">
                    <div className="footer-logo mb-30">
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
                    <div className="footer-content">
                      <p>
                        Elegan t pink origami design three <br /> dimensional
                        view and decoration co-exist.
                        <br /> Great for adding a decorative touch to <br /> any
                        room’s decor.
                      </p>
                    </div>
                  </div>
                </div>
                <div className="col-lg-2 col-md-4 col-sm-6">
                  <div className="footer-widget footer-col-2 ml-30 mb-40">
                    <h4 className="footer-widget__title mb-30">Information</h4>
                    <div className="footer-widget__links">
                      <ul>
                        <li>
                          <Link href="#">Custom Service</Link>
                        </li>
                        <li>
                          <Link href="#">FAQs</Link>
                        </li>
                        {/* <li>
                          <Link href="/track">Ordering Tracking</Link>
                        </li> */}
                        <li>
                          <Link href="/contact">Contacts</Link>
                        </li>
                        <li>
                          <Link href="#">Events</Link>
                        </li>
                      </ul>
                    </div>
                  </div>
                </div>
                <div className="col-lg-2 col-md-4 col-sm-6">
                  <div className="footer-widget footer-col-3 mb-40">
                    <h4 className="footer-widget__title mb-30">My Account</h4>
                    <div className="footer-widget__links">
                      <ul>
                        <li>
                          <Link href="#">Delivery Information</Link>
                        </li>
                        <li>
                          <Link href="#">Privacy Policy</Link>
                        </li>
                        <li>
                          <Link href="#">Discount</Link>
                        </li>
                        <li>
                          <Link href="#">Custom Service</Link>
                        </li>
                        <li>
                          <Link href="#">Terms Condition</Link>
                        </li>
                      </ul>
                    </div>
                  </div>
                </div>
                <div className="col-lg-2 col-md-4 col-sm-6">
                  <div className="footer-widget footer-col-4 mb-40">
                    <h4 className="footer-widget__title mb-30">
                      Social Network
                    </h4>
                    <div className="footer-widget__links">
                      <ul>
                        <li>
                          <Link href="#">
                            <i className="fab fa-facebook-f" />
                            Facebook
                          </Link>
                        </li>
                        <li>
                          <Link href="#">
                            <i className="fab fa-dribbble" />
                            Dribbble
                          </Link>
                        </li>
                        <li>
                          <Link href="#">
                            <i className="fab fa-twitter" />
                            Twitter
                          </Link>
                        </li>
                        <li>
                          <Link href="#">
                            <i className="fab fa-behance" />
                            Behance
                          </Link>
                        </li>
                        <li>
                          <Link href="#">
                            <i className="fab fa-youtube" />
                            Youtube
                          </Link>
                        </li>
                      </ul>
                    </div>
                  </div>
                </div>
                <div className="col-lg-3 col-md-4">
                  <div className="footer-widget footer-col-5 mb-40">
                    <h4 className="footer-widget__title mb-30">
                      <i className="fas fa-address-card me-2"></i>
                      Contact Info
                    </h4>
                    <div className="footer-widget__contact">
                      <div className="footer-widget__contact-item d-flex align-items-start mb-3">
                        <div className="contact-icon-wrapper me-3 mt-1">
                          <i className="far fa-map-marker-alt" />
                        </div>
                        <div className="contact-text">
                          <span className="fw-semibold">Address:</span>
                          <br />
                          <span className="text-muted">
                            123 Business Street, New York, NY 10001
                          </span>
                        </div>
                      </div>
                      <div className="footer-widget__contact-item d-flex align-items-start mb-3">
                        <div className="contact-icon-wrapper me-3 mt-1">
                          <i className="far fa-envelope" />
                        </div>
                        <div className="contact-text">
                          <span className="fw-semibold">Email:</span>
                          <br />
                          <Link
                            href="mailto:info@reliablecreations.com"
                            className="text-decoration-none text-primary"
                          >
                            info@reliablecreations.com
                          </Link>
                        </div>
                      </div>
                      <div className="footer-widget__contact-item d-flex align-items-start">
                        <div className="contact-icon-wrapper me-3 mt-1">
                          <i className="far fa-clock" />
                        </div>
                        <div className="contact-text">
                          <span className="fw-semibold">Hours:</span>
                          <br />
                          <span className="text-muted">
                            Mon - Fri: 9:00 AM - 6:00 PM
                          </span>
                        </div>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            </div>
            <div className="footer-cta pb-20">
              <div className="row justify-content-between align-items-center">
                <div className="col-xl-6 col-lg-4 col-md-4 col-sm-6">
                  <div className="footer-cta__contact">
                    <div className="footer-cta__icon">
                      <i className="far fa-phone" />
                    </div>
                    <div className="footer-cta__text">
                      <Link href="/tel:0123456">980. 029. 666. 99</Link>
                      <span>Working 8:00 - 22:00</span>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
          <div className="footer-copyright footer-bg">
            <div className="container">
              <div className="row">
                <div className="col-xl-6 col-lg-7 col-md-5 col-sm-12">
                  <div className="footer-copyright__content">
                    <span>
                      Copyright {new Date().getFullYear()}{" "}
                      <Link href="/">©Reliable Creations</Link>. All rights
                      reserved. Developed by
                      <Link href="https://www.sasahyog.com">
                        {" "}
                        Sasahyog Technologies
                      </Link>
                      .
                    </span>
                  </div>
                </div>
                <div className="col-xl-6 col-lg-5 col-md-7 col-sm-12">
                  <div className="footer-copyright__brand">
                    <img
                      src="/assets/img/footer/f-brand-icon-01.png"
                      alt="footer-brand"
                    />
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </footer>
    </>
  );
}
