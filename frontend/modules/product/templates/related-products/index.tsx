import Link from "next/link";
import { HttpTypes } from "@medusajs/types";
import { Swiper, SwiperSlide } from "swiper/react";
import { Autoplay, Navigation, Pagination } from "swiper/modules";
import { listProducts } from "@/lib/data/product";
import RelatedProductsSlider from "./slider";

interface RelatedProductsProps {
  data: HttpTypes.StoreProduct;
}

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

const RelatedProducts = async ({ data }: RelatedProductsProps) => {
  const region = {
    id: process.env.NEXT_PUBLIC_REGION_ID,
  };

  const countryCode = "in";

  if (!region) {
    return null;
  }

  // edit this function to define your related products logic
  const queryParams: HttpTypes.StoreProductParams = {};

  if (region?.id) {
    queryParams.region_id = region.id;
  }
  if (data.collection_id) {
    // @ts-ignore
    queryParams.collection_id = [data.collection_id];
  }
  if (data.tags) {
    // @ts-ignore
    queryParams.tag_id = data.tags.map((t) => t.id).filter(Boolean) as string[];
  }
  // queryParams.is_giftcard = false;

  const products = await listProducts({
    queryParams,
    countryCode,
  }).then(({ response }) => {
    return response.products.filter(
      (responseProduct) => responseProduct.id !== data.id
    );
  });

  if (!products.length) {
    return null;
  }

  return <div>{JSON.stringify(products)}</div>;
};

export default RelatedProducts;
