"use client";

import { Swiper, SwiperSlide } from "swiper/react";

import { Autoplay, Navigation, Pagination } from "swiper/modules";
import Link from "next/link";

const swiperOptions = {
  modules: [Autoplay, Pagination, Navigation],
  slidesPerView: 5,
  spaceBetween: 25,
  autoplay: {
    delay: 3500,
  },
  breakpoints: {
    1400: {
      slidesPerView: 5,
    },
    1200: {
      slidesPerView: 5,
    },
    992: {
      slidesPerView: 4,
    },
    768: {
      slidesPerView: 2,
    },
    576: {
      slidesPerView: 2,
    },
    0: {
      slidesPerView: 1,
    },
  },
  navigation: {
    nextEl: ".tprelated__nxt",
    prevEl: ".tprelated__prv",
  },
};

const RelatedProductsSlider = () => {
  return (
    <div>
      <div className="related-product-area pt-65 pb-50 related-product-border">
        <div className="container">
          <div className="row align-items-center">
            <div className="col-sm-6">
              <div className="tpsection mb-40">
                <h4 className="tpsection__title">Related Products</h4>
              </div>
            </div>
            <div className="col-sm-6">
              <div className="tprelated__arrow d-flex align-items-center justify-content-end mb-40">
                <div className="tprelated__prv">
                  <i className="far fa-long-arrow-left" />
                </div>
                <div className="tprelated__nxt">
                  <i className="far fa-long-arrow-right" />
                </div>
              </div>
            </div>
          </div>
          <div className="swiper-container related-product-active">
            <Swiper {...swiperOptions}>
              <SwiperSlide>
                <div className="tpproduct pb-15 mb-30">
                  <div className="tpproduct__thumb p-relative">
                    <Link href="/shop-details-2">
                      <img
                        src="/assets/img/product/product-1.jpg"
                        alt="product-thumb"
                      />
                      <img
                        className="product-thumb-secondary"
                        src="/assets/img/product/product-2.jpg"
                        alt=""
                      />
                    </Link>
                    <div className="tpproduct__thumb-action">
                      <Link className="comphare" href="#">
                        <i className="fal fa-exchange" />
                      </Link>
                      <Link className="quckview" href="#">
                        <i className="fal fa-eye" />
                      </Link>
                      <Link className="wishlist" href="/wishlist">
                        <i className="fal fa-heart" />
                      </Link>
                    </div>
                  </div>
                  <div className="tpproduct__content">
                    <h3 className="tpproduct__title">
                      <Link href="/shop-details">
                        Miko Wooden Bluetooth Speaker
                      </Link>
                    </h3>
                    <div className="tpproduct__priceinfo p-relative">
                      <div className="tpproduct__priceinfo-list">
                        <span>$31.00</span>
                      </div>
                      <div className="tpproduct__cart">
                        <Link href="/cart">
                          <i className="fal fa-shopping-cart" />
                          Add To Cart
                        </Link>
                      </div>
                    </div>
                  </div>
                </div>
              </SwiperSlide>
              <SwiperSlide>
                <div className="tpproduct pb-15 mb-30">
                  <div className="tpproduct__thumb p-relative">
                    <Link href="/shop-details">
                      <img
                        src="/assets/img/product/product-3.jpg"
                        alt="product-thumb"
                      />
                      <img
                        className="product-thumb-secondary"
                        src="/assets/img/product/product-4.jpg"
                        alt=""
                      />
                    </Link>
                    <div className="tpproduct__thumb-action">
                      <Link className="comphare" href="#">
                        <i className="fal fa-exchange" />
                      </Link>
                      <Link className="quckview" href="#">
                        <i className="fal fa-eye" />
                      </Link>
                      <Link className="wishlist" href="/wishlist">
                        <i className="fal fa-heart" />
                      </Link>
                    </div>
                  </div>
                  <div className="tpproduct__content">
                    <h3 className="tpproduct__title">
                      <Link href="/shop-details-2">Gorgeous Wooden Gloves</Link>
                    </h3>
                    <div className="tpproduct__priceinfo p-relative">
                      <div className="tpproduct__priceinfo-list">
                        <span>$31.00</span>
                      </div>
                      <div className="tpproduct__cart">
                        <Link href="/cart">
                          <i className="fal fa-shopping-cart" />
                          Add To Cart
                        </Link>
                      </div>
                    </div>
                  </div>
                </div>
              </SwiperSlide>
              <SwiperSlide>
                <div className="tpproduct pb-15 mb-30">
                  <div className="tpproduct__thumb p-relative">
                    <Link href="/shop-details-2">
                      <img
                        src="/assets/img/product/product-5.jpg"
                        alt="product-thumb"
                      />
                      <img
                        className="product-thumb-secondary"
                        src="/assets/img/product/product-6.jpg"
                        alt=""
                      />
                    </Link>
                    <div className="tpproduct__thumb-action">
                      <Link className="comphare" href="#">
                        <i className="fal fa-exchange" />
                      </Link>
                      <Link className="quckview" href="#">
                        <i className="fal fa-eye" />
                      </Link>
                      <Link className="wishlist" href="/wishlist">
                        <i className="fal fa-heart" />
                      </Link>
                    </div>
                  </div>
                  <div className="tpproduct__content">
                    <h3 className="tpproduct__title">
                      <Link href="/shop-details">
                        Pinkol Enormous Granite Bottle
                      </Link>
                    </h3>
                    <div className="tpproduct__priceinfo p-relative">
                      <div className="tpproduct__priceinfo-list">
                        <span>$31.00</span>
                      </div>
                      <div className="tpproduct__cart">
                        <Link href="/cart">
                          <i className="fal fa-shopping-cart" />
                          Add To Cart
                        </Link>
                      </div>
                    </div>
                  </div>
                </div>
              </SwiperSlide>
              <SwiperSlide>
                <div className="tpproduct pb-15 mb-30">
                  <div className="tpproduct__thumb p-relative">
                    <span className="tpproduct__thumb-topsall">On Sale</span>
                    <Link href="/shop-details-2">
                      <img
                        src="/assets/img/product/product-7.jpg"
                        alt="product-thumb"
                      />
                      <img
                        className="product-thumb-secondary"
                        src="/assets/img/product/product-8.jpg"
                        alt=""
                      />
                    </Link>
                    <div className="tpproduct__thumb-action">
                      <Link className="comphare" href="#">
                        <i className="fal fa-exchange" />
                      </Link>
                      <Link className="quckview" href="#">
                        <i className="fal fa-eye" />
                      </Link>
                      <Link className="wishlist" href="/wishlist">
                        <i className="fal fa-heart" />
                      </Link>
                    </div>
                  </div>
                  <div className="tpproduct__content">
                    <h3 className="tpproduct__title">
                      <Link href="/shop-details-2">
                        Gorgeous Aluminum Table
                      </Link>
                    </h3>
                    <div className="tpproduct__priceinfo p-relative">
                      <div className="tpproduct__priceinfo-list">
                        <span>$31.00</span>
                      </div>
                      <div className="tpproduct__cart">
                        <Link href="/cart">
                          <i className="fal fa-shopping-cart" />
                          Add To Cart
                        </Link>
                      </div>
                    </div>
                  </div>
                </div>
              </SwiperSlide>
              <SwiperSlide>
                <div className="tpproduct pb-15 mb-30">
                  <div className="tpproduct__thumb p-relative">
                    <Link href="/shop-details-2">
                      <img
                        src="/assets/img/product/product-9.jpg"
                        alt="product-thumb"
                      />
                      <img
                        className="product-thumb-secondary"
                        src="/assets/img/product/product-10.jpg"
                        alt=""
                      />
                    </Link>
                    <div className="tpproduct__thumb-action">
                      <Link className="comphare" href="#">
                        <i className="fal fa-exchange" />
                      </Link>
                      <Link className="quckview" href="#">
                        <i className="fal fa-eye" />
                      </Link>
                      <Link className="wishlist" href="/wishlist">
                        <i className="fal fa-heart" />
                      </Link>
                    </div>
                  </div>
                  <div className="tpproduct__content">
                    <h3 className="tpproduct__title">
                      <Link href="/shop-details">
                        Evo Lightweight Granite Shirt
                      </Link>
                    </h3>
                    <div className="tpproduct__priceinfo p-relative">
                      <div className="tpproduct__priceinfo-list">
                        <span>$31.00</span>
                        <span className="tpproduct__priceinfo-list-oldprice">
                          $39.00
                        </span>
                      </div>
                      <div className="tpproduct__cart">
                        <Link href="/cart">
                          <i className="fal fa-shopping-cart" />
                          Add To Cart
                        </Link>
                      </div>
                    </div>
                  </div>
                </div>
              </SwiperSlide>
              <SwiperSlide>
                <div className="tpproduct pb-15 mb-30">
                  <div className="tpproduct__thumb p-relative">
                    <span className="tpproduct__thumb-volt">
                      <i className="fas fa-bolt" />
                    </span>
                    <Link href="/shop-details-2">
                      <img
                        src="/assets/img/product/product-11.jpg"
                        alt="product-thumb"
                      />
                      <img
                        className="product-thumb-secondary"
                        src="/assets/img/product/product-12.jpg"
                        alt=""
                      />
                    </Link>
                    <div className="tpproduct__thumb-action">
                      <Link className="comphare" href="#">
                        <i className="fal fa-exchange" />
                      </Link>
                      <Link className="quckview" href="#">
                        <i className="fal fa-eye" />
                      </Link>
                      <Link className="wishlist" href="/wishlist">
                        <i className="fal fa-heart" />
                      </Link>
                    </div>
                  </div>
                  <div className="tpproduct__content">
                    <h3 className="tpproduct__title">
                      <Link href="#">CLCo. Incredible Paper Car</Link>
                    </h3>
                    <div className="tpproduct__priceinfo p-relative">
                      <div className="tpproduct__priceinfo-list">
                        <span>$31.00</span>
                      </div>
                      <div className="tpproduct__cart">
                        <Link href="/cart">
                          <i className="fal fa-shopping-cart" />
                          Add To Cart
                        </Link>
                      </div>
                    </div>
                  </div>
                </div>
              </SwiperSlide>
            </Swiper>
          </div>
        </div>
      </div>
    </div>
  );
};

export default RelatedProductsSlider;
