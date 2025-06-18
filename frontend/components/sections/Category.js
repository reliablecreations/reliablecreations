import Link from "next/link";

export default function Category({ categories }) {
  return (
    <>
      <section className="category-area pt-70">
        <div className="container">
          <div className="row">
            <div className="col-md-12">
              <div className="tpsection mb-40">
                <h4 className="tpsection__title">
                  Top{" "}
                  <span>
                    {" "}
                    Categories{" "}
                    <img src="/assets/img/icon/title-shape-01.jpg" alt="" />
                  </span>
                </h4>
              </div>
            </div>
          </div>
          <div className="custom-row category-border pb-45 justify-content-xl-between">
            <div className="tpcategory mb-40">
              <div className="tpcategory__icon p-relative">
                <img
                  src="/assets/img/svg/cat01.svg"
                  alt=""
                  className="fn__svg"
                />
                <span>20</span>
              </div>
              <div className="tpcategory__content">
                <h5 className="tpcategory__title">
                  <Link href="/shop">
                    Driftwood <br /> Table Decor
                  </Link>
                </h5>
              </div>
            </div>

            <div className="tpcategory mb-40">
              <div className="tpcategory__icon">
                <img
                  src="/assets/img/svg/cat02.svg"
                  alt=""
                  className="fn__svg"
                />
                <span>12</span>
              </div>
              <div className="tpcategory__content">
                <h5 className="tpcategory__title">
                  <Link href="/shop">
                    Floor Driftwood <br /> Sculpture
                  </Link>
                </h5>
              </div>
            </div>
            <div className="tpcategory mb-40">
              <div className="tpcategory__icon">
                <img
                  src="/assets/img/svg/cat03.svg"
                  alt=""
                  className="fn__svg"
                />
                <span>03</span>
              </div>
              <div className="tpcategory__content">
                <h5 className="tpcategory__title">
                  <Link href="/shop">
                    Driftwood <br /> Christmas Tree{" "}
                  </Link>
                </h5>
              </div>
            </div>
            <div className="tpcategory mb-40">
              <div className="tpcategory__icon">
                <img
                  src="/assets/img/svg/cat04.svg"
                  alt=""
                  className="fn__svg"
                />
                <span>09</span>
              </div>
              <div className="tpcategory__content">
                <h5 className="tpcategory__title">
                  <Link href="/shop">
                    {" "}
                    Wooden <br /> Bluetooth Speaker{" "}
                  </Link>
                </h5>
              </div>
            </div>
            <div className="tpcategory mb-40">
              <div className="tpcategory__icon">
                <img
                  src="/assets/img/svg/cat05.svg"
                  alt=""
                  className="fn__svg"
                />
                <span>10</span>
              </div>
              <div className="tpcategory__content">
                <h5 className="tpcategory__title">
                  <Link href="/shop">
                    Receivers <br /> Amplifiers
                  </Link>
                </h5>
              </div>
            </div>
            <div className="tpcategory mb-40">
              <div className="tpcategory__icon">
                <img
                  src="/assets/img/svg/cat06.svg"
                  alt=""
                  className="fn__svg"
                />
                <span>05</span>
              </div>
              <div className="tpcategory__content">
                <h5 className="tpcategory__title">
                  <Link href="/shop">
                    Appetizer <br /> Plate Set{" "}
                  </Link>
                </h5>
              </div>
            </div>
          </div>
        </div>
      </section>
      <section className="services-area pt-70">
        <div className="container">
          <div className="row services-gx-item">
            <div className="col-lg-3 col-sm-6">
              <div className="tpservicesitem d-flex align-items-center mb-30">
                <div className="tpservicesitem__icon mr-20">
                  <img
                    src="/assets/img/svg/services01.svg"
                    alt=""
                    className="fn__svg"
                  />
                </div>
                <div className="tpservicesitem__content">
                  <h4 className="tpservicesitem__title">Free shipping</h4>
                  <p>Free shipping on orders over.</p>
                </div>
              </div>
            </div>
            <div className="col-lg-3 col-sm-6">
              <div className="tpservicesitem d-flex align-items-center mb-30">
                <div className="tpservicesitem__icon mr-20">
                  <img
                    src="/assets/img/svg/services02.svg"
                    alt=""
                    className="fn__svg"
                  />
                </div>
                <div className="tpservicesitem__content">
                  <h4 className="tpservicesitem__title">Free Returns</h4>
                  <p>30-days free return policy</p>
                </div>
              </div>
            </div>
            <div className="col-lg-3 col-sm-6">
              <div className="tpservicesitem d-flex align-items-center mb-30">
                <div className="tpservicesitem__icon mr-20">
                  <img
                    src="/assets/img/svg/services03.svg"
                    alt=""
                    className="fn__svg"
                  />
                </div>
                <div className="tpservicesitem__content">
                  <h4 className="tpservicesitem__title">Secured Payments</h4>
                  <p>We accept all major credit cards</p>
                </div>
              </div>
            </div>
            <div className="col-lg-3 col-sm-6">
              <div className="tpservicesitem d-flex align-items-center mb-30">
                <div className="tpservicesitem__icon mr-20">
                  <img
                    src="/assets/img/svg/services04.svg"
                    alt=""
                    className="fn__svg"
                  />
                </div>
                <div className="tpservicesitem__content">
                  <h4 className="tpservicesitem__title">Customer Service</h4>
                  <p>Top notch customer setvice</p>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>
    </>
  );
}
