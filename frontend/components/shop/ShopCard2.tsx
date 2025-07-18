import Link from "next/link";
import PreviewPrice from "./price";
import { HttpTypes } from "@medusajs/types";
import AddToCartButton from "./AddToCartBtn";
import { getProductPrice } from "@/lib/util/get-product-price";
import ProductImage from "./ProductImage";
import { getProductImageAlt } from "@/lib/util/image-utils";
import styles from "@/styles/product-card.module.css";

export default function ProductCard({
  product,
  isFeatured,
  countryCode = "in",
  region,
}: {
  product: HttpTypes.StoreProduct;
  countryCode: string;
  isFeatured?: boolean;
  region?: HttpTypes.StoreRegion;
}) {
  const { cheapestPrice } = getProductPrice({
    product,
  });

  return (
    <div className="col">
      <div className="tpproduct tpproductitem mb-15 p-relative">
        <div className="tpproduct__thumb">
          <div className="tpproduct__thumbitem p-relative">
            <Link href={`/product/${product.handle}`}>
              <ProductImage
                thumbnail={product.thumbnail}
                images={product.images}
                size="medium"
                isFeatured={isFeatured}
                className={styles["product-card-thumbnail"]}
                priority={isFeatured}
                alt={getProductImageAlt(product)}
              />
            </Link>
          </div>
        </div>
        <div className="tpproduct__content-area">
          <h3 className="tpproduct__title mb-5">
            <Link href={`/product/${product.handle}`}>{product.title}</Link>
          </h3>
          <div className="tpproduct__priceinfo p-relative">
            <div className="tpproduct__ammount">
              {cheapestPrice && <PreviewPrice price={cheapestPrice} />}
            </div>
          </div>
        </div>
        <div className="tpproduct__ratingarea">
          <div className="d-flex align-items-center justify-content-between">
            <AddToCartButton product={product} countryCode={countryCode} />
          </div>
        </div>
      </div>
    </div>
  );
}
