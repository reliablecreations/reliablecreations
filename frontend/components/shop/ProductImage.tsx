import { Container, clx } from "@medusajs/ui";
import Image from "next/image";
import React, { useState } from "react";
import styles from "@/styles/product-image.module.css";

type ProductImageProps = {
  thumbnail?: string | null;
  images?: { url: string }[] | null;
  size?: "small" | "medium" | "large" | "full" | "square";
  isFeatured?: boolean;
  className?: string;
  "data-testid"?: string;
  priority?: boolean;
  alt?: string;
};

const ProductImage: React.FC<ProductImageProps> = ({
  thumbnail,
  images,
  size = "medium",
  isFeatured,
  className,
  "data-testid": dataTestid,
  priority = false,
  alt = "Product image",
}) => {
  const [isLoading, setIsLoading] = useState(true);
  const [hasError, setHasError] = useState(false);

  const initialImage = thumbnail || images?.[0]?.url;

  const handleImageLoad = () => {
    setIsLoading(false);
  };

  const handleImageError = () => {
    setIsLoading(false);
    setHasError(true);
  };

  return (
    <Container
      className={clx(styles.container, className, {
        [styles.featured]: isFeatured,
        [styles.defaultAspect]: !isFeatured && size !== "square",
        [styles.square]: size === "square",
        [styles.sizeSmall]: size === "small",
        [styles.sizeMedium]: size === "medium",
        [styles.sizeLarge]: size === "large",
        [styles.sizeFull]: size === "full",
        [styles.loading]: isLoading,
        [styles.error]: hasError,
      })}
      data-testid={dataTestid || "product-image"}
    >
      {initialImage && !hasError ? (
        <>
          <Image
            src={initialImage}
            alt={alt}
            className={styles.image}
            fill
            sizes="(max-width: 576px) 280px, (max-width: 768px) 360px, (max-width: 992px) 480px, 800px"
            draggable={false}
            priority={priority}
            onLoad={handleImageLoad}
            onError={handleImageError}
          />
          {isLoading && (
            <div className={styles.loadingOverlay}>
              <div className={styles.loadingSpinner}></div>
            </div>
          )}
        </>
      ) : (
        <div className={styles.placeholder}>
          <svg
            className={styles.placeholderIcon}
            fill="currentColor"
            viewBox="0 0 20 20"
            xmlns="http://www.w3.org/2000/svg"
          >
            <path
              fillRule="evenodd"
              d="M4 3a2 2 0 00-2 2v10a2 2 0 002 2h12a2 2 0 002-2V5a2 2 0 00-2-2H4zm12 12H4l4-8 3 6 2-4 3 6z"
              clipRule="evenodd"
            />
          </svg>
          <span>No Image</span>
        </div>
      )}
    </Container>
  );
};

export default ProductImage;
