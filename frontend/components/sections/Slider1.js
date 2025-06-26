"use client";
import Image from "next/image";
import { Swiper, SwiperSlide } from "swiper/react";
import { Autoplay, Navigation, Pagination } from "swiper/modules";

import "swiper/css";
import "swiper/css/navigation";
import "swiper/css/pagination";

import styles from "./Slider1.module.css";

const swiperOptions = {
  modules: [Autoplay, Pagination, Navigation],
  slidesPerView: 1,
  spaceBetween: 0,
  autoplay: {
    delay: 2500,
  },
  navigation: {
    nextEl: ".h1n",
    prevEl: ".h1p",
  },
  pagination: {
    el: ".slider-pagination",
    clickable: true,
  },
};

export default function Slider1({ carousels }) {
  return (
    <section className="slider-area">
      <div className="tp-slider-area p-relative">
        <div className="swiper-container slider-active">
          <Swiper {...swiperOptions}>
            {carousels?.map((carousel) => (
              <SwiperSlide key={carousel.id}>
                <div style={{ width: "100%", height: "100%" }}>
                  <div
                    style={{
                      position: "relative",
                      aspectRatio: "16/5",
                    }}
                  >
                    {/* Desktop Image */}
                    <Image
                      src={carousel.url}
                      alt=""
                      fill
                      priority
                      className={`${styles.image} ${styles.desktopImage}`}
                    />
                    {/* Mobile Image */}
                    <Image
                      src={carousel.url2}
                      alt=""
                      fill
                      priority
                      style={{
                        border: "2px solid red",
                      }}
                      className={`${styles.image} ${styles.mobileImage}`}
                    />
                  </div>
                </div>
              </SwiperSlide>
            ))}
          </Swiper>
        </div>
        <div className="slider-pagination" />
      </div>
    </section>
  );
}
