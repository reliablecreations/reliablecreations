"use client";
import { useState } from "react";
import FilterShopBox2 from "../shop/FilterShopBox2";

export default function Product1() {
  const [activeIndex, setActiveIndex] = useState(1);
  const handleOnClick = (index) => {
    setActiveIndex(index);
  };
  return (
    <>
      <section className="product-area pt-95 pb-70">
        <div className="container">
          <div className="row">
            <div className="col-md-6 col-12">
              <div className="tpsection mb-40">
                <h4 className="tpsection__title">
                  Popular{" "}
                  <span>
                    {" "}
                    Products{" "}
                    <img src="/assets/img/icon/title-shape-01.jpg" alt="" />
                  </span>
                </h4>
              </div>
            </div>
            <div className="col-md-6 col-12">
              <div className="tpnavbar">
                <nav>
                  <div className="nav nav-tabs" id="nav-tab" role="tablist">
                    <button
                      className={
                        activeIndex == 1 ? "nav-link active" : "nav-link"
                      }
                      onClick={() => handleOnClick(1)}
                    >
                      All
                    </button>
                    <button
                      className={
                        activeIndex == 2 ? "nav-link active" : "nav-link"
                      }
                      onClick={() => handleOnClick(2)}
                    >
                      Popular
                    </button>
                    <button
                      className={
                        activeIndex == 3 ? "nav-link active" : "nav-link"
                      }
                      onClick={() => handleOnClick(3)}
                    >
                      On Sale
                    </button>
                    <button
                      className={
                        activeIndex == 4 ? "nav-link active" : "nav-link"
                      }
                      onClick={() => handleOnClick(4)}
                    >
                      Best Rated
                    </button>
                  </div>
                </nav>
              </div>
            </div>
          </div>
          <div className="tab-content" id="nav-tabContent">
            <div
              className={
                activeIndex == 1 ? "tab-pane fade show active" : "tab-pane fade"
              }
              id="nav-all"
              role="tabpanel"
              aria-labelledby="nav-all-tab"
            >
              <div className="row row-cols-xxl-5 row-cols-xl-4 row-cols-lg-3 row-cols-md-2 row-cols-sm-2 row-cols-1">
                <FilterShopBox2 itemStart={0} itemEnd={10} />
              </div>
            </div>
            <div
              className={
                activeIndex == 2 ? "tab-pane fade show active" : "tab-pane fade"
              }
              id="nav-popular"
              role="tabpanel"
              aria-labelledby="nav-popular-tab"
            >
              <div className="row row-cols-xxl-5 row-cols-xl-4 row-cols-lg-3 row-cols-md-2 row-cols-sm-2 row-cols-1">
                <FilterShopBox2 itemStart={10} itemEnd={20} />
              </div>
            </div>
            <div
              className={
                activeIndex == 3 ? "tab-pane fade show active" : "tab-pane fade"
              }
              id="nav-sale"
              role="tabpanel"
              aria-labelledby="nav-sale-tab"
            >
              <div className="row row-cols-xxl-5 row-cols-xl-4 row-cols-lg-3 row-cols-md-2 row-cols-sm-2 row-cols-1">
                <FilterShopBox2 itemStart={20} itemEnd={30} />
              </div>
            </div>
            <div
              className={
                activeIndex == 4 ? "tab-pane fade show active" : "tab-pane fade"
              }
              id="nav-rate"
              role="tabpanel"
              aria-labelledby="nav-rate-tab"
            >
              <div className="row row-cols-xxl-5 row-cols-xl-4 row-cols-lg-3 row-cols-md-2 row-cols-sm-2 row-cols-1">
                <FilterShopBox2 itemStart={15} itemEnd={25} />
              </div>
            </div>
          </div>
        </div>
      </section>
    </>
  );
}
