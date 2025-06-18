"use client";

import { sdk } from "@/lib/config";
import { useState } from "react";
import styles from "./page.module.css";
import { getRegion } from "@/lib/data/regions";
import { useInfiniteQuery } from "react-query";
import ShopCard2 from "@/components/shop/ShopCard2";
import InfiniteScroll from "react-infinite-scroll-component";
import { useParams, useRouter, useSearchParams } from "next/navigation";

const fetchProducts = async ({
  q,
  minPrice,
  maxPrice,
  category_handle,
  pageParam = 1,
}: {
  q: string;
  minPrice: string;
  maxPrice: string;
  category_handle: string;
  pageParam: number;
}) => {
  const region = await getRegion("in");
  const response = await sdk.client.fetch<any>(
    `/store/search?region_id=${
      region?.id
    }&currency_code=inr&q=${q}&price_min=${minPrice}&price_max=${maxPrice}&category_handle=${category_handle}&offset=${
      (pageParam - 1) * 20
    }`,
    {
      cache: "no-cache",
    }
  );
  return response?.result?.products as any;
};

export default function SearchFilterComponent({}) {
  const searchParams = useSearchParams();
  const router = useRouter();
  const { countryCode } = useParams();
  const q = searchParams.get("q") || "";
  const minPrice = searchParams.get("minPrice") || "0";
  const maxPrice = searchParams.get("maxPrice") || "5000";

  const [priceRange, setPriceRange] = useState([
    minPrice ? Number(minPrice) : 0,
    maxPrice ? Number(maxPrice) : 5000,
  ]) as any;
  const [openSections, setOpenSections] = useState({
    availability: true,
    price: true,
    productType: true,
    rating: false,
    categories: true,
  });

  const toggleSection = (section: keyof typeof openSections) => {
    setOpenSections((prev) => ({
      ...prev,
      [section]: !prev[section],
    }));
  };
  const { data, fetchNextPage, hasNextPage, isFetchingNextPage, isLoading } =
    useInfiniteQuery(
      ["productData", q, minPrice, maxPrice],
      ({ pageParam = 1 }) =>
        fetchProducts({
          q,
          minPrice,
          maxPrice,
          category_handle: "",
          pageParam,
        }),
      {
        getNextPageParam: (lastPage, allPages) =>
          lastPage.length ? allPages.length + 1 : undefined,
      }
    );

  const products = data?.pages.flat() || [];

  const updateQueryParams = (
    key: string,
    value: string | number | boolean | string[]
  ) => {
    const params = new URLSearchParams(searchParams.toString());
    if (Array.isArray(value)) {
      params.set(key, value.join(","));
    } else {
      params.set(key, String(value));
    }
    router.push(`?${params.toString()}`, { scroll: false });
  };

  return (
    <div className={styles.container}>
      <div className={styles.resultsText}>Showing {products?.length || 0} </div>

      {/* Product Grid */}
      <div className={styles.productGrid}>
        <div className={styles.productGrid}>
          {isLoading ? (
            <div className={styles.loadingContainer}></div>
          ) : (
            <>
              <InfiniteScroll
                dataLength={products.length}
                next={fetchNextPage}
                hasMore={!!hasNextPage}
                loader={<div className={styles.infiniteScrollLoader}></div>}
              >
                {products && products.length > 0 ? (
                  <>
                    <div className={styles.productRow}>
                      {products.map((item) => (
                        <ShopCard2 product={item} countryCode={"in"} />
                      ))}
                    </div>
                  </>
                ) : (
                  <div className={styles.noResults}>
                    <h2>No results found</h2>
                  </div>
                )}
              </InfiniteScroll>
            </>
          )}
        </div>
      </div>
    </div>
  );
}
