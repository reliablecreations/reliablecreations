"use client";
import Layout from "@/components/layout/Layout";
// @ts-ignore
import Link from "next/link";
import { useEffect, useMemo, useState } from "react";
import { Autoplay, Navigation, Pagination } from "swiper/modules";
import { Swiper, SwiperSlide } from "swiper/react";
import { HttpTypes } from "@medusajs/types";
import ProductDescription from "../../components/product-desc";
import OptionSelect from "../../components/product-actions/option-select";
import Divider from "@/components/store-front/divider";
import { isEqual } from "lodash";
import ProductPrice from "../../components/product-price";
import { addToCart } from "@/lib/data/cart";

const country_code = "in";

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

interface ProductTemplateProps {
  data: HttpTypes.StoreProduct;
}

const optionsAsKeymap = (
  variantOptions: HttpTypes.StoreProductVariant["options"]
) => {
  return variantOptions?.reduce((acc: Record<string, string>, varopt: any) => {
    acc[varopt.option_id] = varopt.value;
    return acc;
  }, {});
};

const ProductTemplate = ({ data }: ProductTemplateProps) => {
  const [activeIndex, setActiveIndex] = useState(2);
  const handleOnClick = (index) => {
    setActiveIndex(index);
  };

  const [quantity, setQuantity] = useState(1);
  const [activeImage, setActiveImage] = useState(0);
  const [options, setOptions] = useState<Record<string, string | undefined>>(
    {}
  );
  const [isAdding, setIsAdding] = useState(false);

  const setOptionValue = (optionId: string, value: string) => {
    setOptions((prev) => ({
      ...prev,
      [optionId]: value,
    }));
  };

  //check if the selected options produce a valid variant
  const isValidVariant = useMemo(() => {
    return data.variants?.some((v) => {
      const variantOptions = optionsAsKeymap(v.options);
      return isEqual(variantOptions, options);
    });
  }, [data.variants, options]);

  const selectedVariant = useMemo(() => {
    if (!data.variants || data.variants.length === 0) {
      return;
    }
    const fVariant = data.variants.find((v) => {
      const variantOptions = optionsAsKeymap(v.options);
      return isEqual(variantOptions, options);
    });
    return fVariant;
  }, [data.variants, options]);

  // Product images - in a real app, these would be actual product images
  const productImages = data?.images ? data?.images?.map((img) => img.url) : [];

  //console.log(product, "product...............")
  const incrementQuantity = () => {
    // max quantity is 10
    if (quantity < 100) {
      setQuantity(quantity + 1);
    }
  };
  const decrementQuantity = () => setQuantity(quantity > 1 ? quantity - 1 : 1);

  const inStock = useMemo(() => {
    // If we don't manage inventory, we can always add to cart
    if (selectedVariant && !selectedVariant.manage_inventory) {
      return true;
    }
    if (selectedVariant?.allow_backorder) {
      return true;
    }
    if (
      selectedVariant?.inventory_quantity &&
      (selectedVariant?.inventory_quantity || 0) > 0
    ) {
      return true;
    }

    // If there is inventory available, we can add to cart
    if (
      // @ts-ignore
      selectedVariant?.inventory &&
      // @ts-ignore
      (selectedVariant?.inventory_items.length || 0) > 0
    ) {
      return true;
    }

    // Otherwise, we can't add to cart
    return false;
  }, [selectedVariant]);

  const handleAddToCart = async () => {
    if (!selectedVariant?.id) return null;
    if (quantity > 100) {
      alert("Maximum Quantity 100");
      return;
    }
    setIsAdding(true);
    await addToCart({
      variantId: selectedVariant.id,
      quantity,
      countryCode: country_code,
    });
    // toast.success("Item added to cart");
    alert("Item added to cart");
    setIsAdding(false);
  };

  useEffect(() => {
    if (data.variants?.length === 1) {
      const variantOptions = data.variants[0].options?.at(0);
      if (variantOptions !== null) {
        setOptionValue(variantOptions?.option_id, variantOptions?.value);
      }
    }
  }, [data.variants]);

  return (
    <>
      <section className="product-area pt-80 pb-50">
        <div className="container">
          <div className="row">
            <div className="col-lg-5 col-md-12">
              <div className="tpproduct-details__list-img">
                {productImages.map((image, index) => (
                  <div className="tpproduct-details__list-img-item" key={index}>
                    <img src={`${image}`} alt="" />
                  </div>
                ))}
              </div>
            </div>
            <div className="col-lg-5 col-md-7">
              <div className="tpproduct-details__content tpproduct-details__sticky">
                <div className="tpproduct-details__tag-area d-flex align-items-center mb-5">
                  <span className="tpproduct-details__tag">Wooden</span>
                  {/* <div className="tpproduct-details__rating">
                      <Link href="#">
                        <i className="fas fa-star" />
                      </Link>
                      <Link href="#">
                        <i className="fas fa-star" />
                      </Link>
                      <Link href="#">
                        <i className="fas fa-star" />
                      </Link>
                    </div>
                    <a className="tpproduct-details__reviewers">10 Reviews</a> */}
                </div>
                <div className="tpproduct-details__title-area d-flex align-items-center flex-wrap mb-5">
                  <h3 className="tpproduct-details__title">
                    {data?.title
                      ? data?.title?.charAt(0)?.toUpperCase() +
                        data?.title?.slice(1)
                      : ""}
                  </h3>
                  <span className="tpproduct-details__stock">In Stock</span>
                </div>
                <div className="tpproduct-details__pera">
                  <p>{data?.subtitle}</p>
                </div>

                <ProductPrice product={data} variant={selectedVariant} />

                <div className="tpproduct-details__count d-flex align-items-center flex-wrap mb-25">
                  <div className="product-quantity">
                    <div className="item-quantity">
                      <input
                        type="number"
                        className="qty"
                        name="qty"
                        defaultValue={1}
                        min={1}
                        onChange={(event) => {
                          if (!isNaN(parseInt(event.target.value))) {
                            setQuantity(parseInt(event.target.value));
                          }
                        }}
                      />
                    </div>
                  </div>
                  <div className="tpproduct-details__cart ml-20">
                    <button
                      onClick={handleAddToCart}
                      disabled={
                        !inStock ||
                        !selectedVariant ||
                        isAdding ||
                        !isValidVariant
                      }
                    >
                      <i className="fal fa-shopping-cart" />{" "}
                      {!selectedVariant && !options
                        ? "Select variant"
                        : !inStock || !isValidVariant
                        ? "Out of stock"
                        : "Add to cart"}
                    </button>
                  </div>
                </div>

                {/* Variant Selection */}
                {(data?.variants?.length ?? 0) > 1 && (
                  <div className="space-y-3 pt-2">
                    <h3 className="font-medium">Select Variant</h3>
                    {(data?.variants?.length ?? 0) > 1 && (
                      <div className="flex flex-col gap-y-4">
                        {(data?.options || []).map((option) => {
                          return (
                            <div key={option.id}>
                              <OptionSelect
                                option={option}
                                current={options[option.id]}
                                updateOption={setOptionValue}
                                title={option.title ?? ""}
                                data-testid="product-options"
                                disabled={isAdding}
                              />
                            </div>
                          );
                        })}
                        <Divider />
                      </div>
                    )}
                  </div>
                )}

                <div className="tpproduct-details__information tpproduct-details__code">
                  <p>SKU:</p>
                  <span>{selectedVariant?.sku}</span>
                </div>
                <div className="tpproduct-details__information tpproduct-details__categories">
                  <p>Categories:</p>
                  <span>
                    <Link href="#">T-Shirts,</Link>
                  </span>
                  <span>
                    <Link href="#">Tops,</Link>
                  </span>
                  <span>
                    <Link href="#">Womens</Link>
                  </span>
                </div>
                <div className="tpproduct-details__information tpproduct-details__tags">
                  <p>Tags:</p>

                  {data?.tags?.map((tag) => {
                    return (
                      <span>
                        <Link href="#">{tag.value}</Link>
                      </span>
                    );
                  })}
                </div>
                {/* <div className="tpproduct-details__information tpproduct-details__social">
                  <p>Share:</p>
                  <Link href="#">
                    <i className="fab fa-facebook-f" />
                  </Link>
                  <Link href="#">
                    <i className="fab fa-twitter" />
                  </Link>
                  <Link href="#">
                    <i className="fab fa-behance" />
                  </Link>
                  <Link href="#">
                    <i className="fab fa-youtube" />
                  </Link>
                  <Link href="#">
                    <i className="fab fa-linkedin" />
                  </Link>
                </div> */}
              </div>
            </div>
            <div className="col-lg-2 col-md-5">
              <div className="tpproduct-details__condation">
                <ul>
                  <li>
                    <div className="tpproduct-details__condation-item d-flex align-items-center">
                      <div className="tpproduct-details__condation-thumb">
                        <img
                          src="/assets/img/icon/product-det-1.png"
                          alt=""
                          className="tpproduct-details__img-hover"
                        />
                      </div>
                      <div className="tpproduct-details__condation-text">
                        <p>
                          Free Shipping not available
                          <br />
                          at this time
                        </p>
                      </div>
                    </div>
                  </li>
                  <li>
                    <div className="tpproduct-details__condation-item d-flex align-items-center">
                      <div className="tpproduct-details__condation-thumb">
                        <img
                          src="/assets/img/icon/product-det-2.png"
                          alt=""
                          className="tpproduct-details__img-hover"
                        />
                      </div>
                      <div className="tpproduct-details__condation-text">
                        <p>
                          Guaranteed 100% Authentic
                          <br />
                          from verified sources
                        </p>
                      </div>
                    </div>
                  </li>
                  <li>
                    <div className="tpproduct-details__condation-item d-flex align-items-center">
                      <div className="tpproduct-details__condation-thumb">
                        <img
                          src="/assets/img/icon/product-det-3.png"
                          alt=""
                          className="tpproduct-details__img-hover"
                        />
                      </div>
                      <div className="tpproduct-details__condation-text">
                        <p>
                          Fast Delivery with ShipRocket
                          <br />
                          within 5-7 business days
                        </p>
                      </div>
                    </div>
                  </li>
                </ul>
              </div>
            </div>
          </div>
        </div>
      </section>
      <div className="product-setails-area">
        <div className="container">
          <div className="row">
            <div className="col-lg-12">
              <div className="tpproduct-details__navtab mb-60">
                <div className="tpproduct-details__nav mb-30">
                  <ul
                    className="nav nav-tabs pro-details-nav-btn"
                    id="myTabs"
                    role="tablist"
                  >
                    <li className="nav-item" onClick={() => handleOnClick(1)}>
                      <button
                        className={
                          activeIndex == 1 ? "nav-links active" : "nav-links"
                        }
                      >
                        Description
                      </button>
                    </li>
                    <li className="nav-item" onClick={() => handleOnClick(2)}>
                      <button
                        className={
                          activeIndex == 2 ? "nav-links active" : "nav-links"
                        }
                      >
                        Additional information
                      </button>
                    </li>
                  </ul>
                </div>
                <div className="tab-content tp-content-tab" id="myTabContent-2">
                  <div
                    className={
                      activeIndex == 1
                        ? "tab-para tab-pane fade show active"
                        : "tab-para tab-pane fade"
                    }
                  >
                    <ProductDescription product={data} />
                  </div>
                  <div
                    className={
                      activeIndex == 2
                        ? "tab-pane fade show active"
                        : "tab-pane fade"
                    }
                  >
                    <div className="product__details-info table-responsive">
                      <table className="table table-striped">
                        <tbody>
                          <tr>
                            <td className="add-info">Weight</td>
                            <td className="add-info-list">
                              {selectedVariant?.weight || "10"} lbs
                            </td>
                          </tr>
                          <tr>
                            <td className="add-info">Dimensions</td>
                            <td className="add-info-list">
                              {data.length} ×{data.width} ×{data.height} in
                            </td>
                          </tr>
                          <tr>
                            <td className="add-info">Country of Origin</td>
                            <td className="add-info-list">
                              {data.origin_country ?? "N/A  "}
                            </td>
                          </tr>
                          <tr>
                            <td className="add-info">MID Code</td>
                            <td className="add-info-list">
                              {data.mid_code ?? "N/A"}
                            </td>
                          </tr>
                          <tr>
                            <td className="add-info">HS Code</td>
                            <td className="add-info-list">
                              {data.hs_code ?? "N/A"}
                            </td>
                          </tr>
                        </tbody>
                      </table>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </>
  );
};

export default ProductTemplate;
