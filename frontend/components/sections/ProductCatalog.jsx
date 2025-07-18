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

  // Check if there are no products
  const hasNoProducts = !data || data.length === 0;

  return (
    <>
      <section className="product-area pt-40 pb-40">
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
              {hasNoProducts ? (
                <div className="no-products-container text-center py-5">
                  <div className="no-products-icon mb-4">
                    <svg
                      width="80"
                      height="80"
                      viewBox="0 0 24 24"
                      fill="none"
                      xmlns="http://www.w3.org/2000/svg"
                      className="mx-auto"
                    >
                      <path
                        d="M9 22H15C20 22 22 20 22 15V9C22 4 20 2 15 2H9C4 2 2 4 2 9V15C2 20 4 22 9 22Z"
                        stroke="#D1D5DB"
                        strokeWidth="1.5"
                        strokeLinecap="round"
                        strokeLinejoin="round"
                      />
                      <path
                        d="M8 12H16"
                        stroke="#D1D5DB"
                        strokeWidth="1.5"
                        strokeLinecap="round"
                        strokeLinejoin="round"
                      />
                      <path
                        d="M12 16V8"
                        stroke="#D1D5DB"
                        strokeWidth="1.5"
                        strokeLinecap="round"
                        strokeLinejoin="round"
                      />
                    </svg>
                  </div>
                  <h3
                    className="no-products-title mb-3"
                    style={{
                      color: "#374151",
                      fontSize: "1.5rem",
                      fontWeight: "600",
                    }}
                  >
                    No Products Found
                  </h3>
                  <p
                    className="no-products-description mb-4"
                    style={{
                      color: "#6B7280",
                      fontSize: "1rem",
                      maxWidth: "400px",
                      margin: "0 auto",
                    }}
                  >
                    We couldn't find any products matching your criteria. Try
                    adjusting your filters or check back later for new arrivals.
                  </p>
                  <button
                    onClick={() => handleOnClick("all")}
                    className="btn btn-primary"
                    style={{
                      backgroundColor: "#d51243",
                      borderColor: "#d51243",
                      color: "white",
                      padding: "12px 24px",
                      borderRadius: "8px",
                      border: "none",
                      cursor: "pointer",
                      transition: "all 0.3s ease",
                    }}
                    onMouseOver={(e) => {
                      e.target.style.backgroundColor = "#b01036";
                      e.target.style.borderColor = "#b01036";
                    }}
                    onMouseOut={(e) => {
                      e.target.style.backgroundColor = "#d51243";
                      e.target.style.borderColor = "#d51243";
                    }}
                  >
                    View All Products
                  </button>
                </div>
              ) : (
                <div className="row row-cols-xxl-5 row-cols-xl-4 row-cols-lg-3 row-cols-md-2 row-cols-sm-2 row-cols-2">
                  {data.map((item) => (
                    <ShopCard2
                      key={item.id}
                      product={item}
                      countryCode={countryCode}
                    />
                  ))}
                </div>
              )}
            </div>
          </div>
        </div>
      </section>
    </>
  );
}
