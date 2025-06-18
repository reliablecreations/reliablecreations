"use client";

import { useState } from "react";
import { useQuery } from "react-query";
import ShopCard2 from "../shop/ShopCard2";
import { filterProducts } from "@/lib/data/products";

const catalogs = [
  {
    label: "All",
    value: "all",
  },
  {
    label: "Popular",
    value: "popular",
  },
  {
    label: "Best Rated",
    value: "best-rated",
  },
  {
    label: "On Sale",
    value: "on-sale",
  },
];

export default function ProductCatalog({ initialProducts = [] }) {
  const countryCode = "in";
  const [category, setCategory] = useState("all");
  const { data, isLoading } = useQuery({
    queryKey: ["products", category],
    queryFn: async () =>
      await filterProducts({
        q: "",
        minPrice: "0",
        maxPrice: "10000",
        category_handle: category,
        pageParam: 1,
      }),
    enabled: category !== "all",
    initialData: initialProducts,
  });

  const handleOnClick = (index) => {
    setCategory(index);
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
                    {catalogs.map((catalog, index) => (
                      <button
                        key={index}
                        className={
                          category == catalog.value
                            ? "nav-link active"
                            : "nav-link"
                        }
                        onClick={() => handleOnClick(catalog.value)}
                      >
                        {catalog.label}
                      </button>
                    ))}
                  </div>
                </nav>
              </div>
            </div>
          </div>
          <div>
            <div>
              <div className="row row-cols-xxl-5 row-cols-xl-4 row-cols-lg-3 row-cols-md-2 row-cols-sm-2 row-cols-1">
                {data.map((item) => (
                  <ShopCard2 product={item} countryCode={countryCode} />
                ))}
              </div>
            </div>
          </div>
        </div>
      </section>
    </>
  );
}
