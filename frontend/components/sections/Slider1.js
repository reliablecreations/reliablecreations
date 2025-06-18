"use client";
import Image from "next/image";
import { Swiper, SwiperSlide } from "swiper/react";
import { Autoplay, Navigation, Pagination } from "swiper/modules";

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

const static_carousels = [
  {
    id: "01JW8JS5SB843DGZ2WMD6QJCSA",
    url: "/assets/img/carousel/1.webp",
    url2: "/assets/img/carousel/2.webp",
    created_at: "2025-05-27T09:57:04.427Z",
    updated_at: "2025-05-27T09:57:04.427Z",
    deleted_at: null,
  },
];

export default function Slider1({ carousels }) {
  //   if (!carousels || carousels.length === 0) return null;
  return (
    <section className="slider-area">
      <div className="tp-slider-area p-relative">
        <div className="swiper-container slider-active">
          <Swiper {...swiperOptions}>
            {static_carousels?.map((carousel) => (
              <SwiperSlide key={carousel.id}>
                <div style={{ width: "100%", height: "100%" }}>
                  <div
                    style={{
                      position: "relative",
                      aspectRatio: "16/5",
                    }}
                  >
                    <Image
                      src={carousel.url}
                      alt=""
                      fill
                      priority
                      style={{ objectFit: "cover" }}
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
