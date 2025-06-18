import { Container, clx } from "@medusajs/ui";
import Image from "next/image";
import React from "react";
import styles from "@/styles/thumbnail.module.css";

type ThumbnailProps = {
  thumbnail?: string | null;
  images?: { url: string }[] | null;
  size?: "small" | "medium" | "large" | "full" | "square";
  isFeatured?: boolean;
  className?: string;
  "data-testid"?: string;
};

const Thumbnail: React.FC<ThumbnailProps> = ({
  thumbnail,
  images,
  size = "small",
  isFeatured,
  className,
  "data-testid": dataTestid,
}) => {
  const initialImage = thumbnail || images?.[0]?.url;

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
      })}
      data-testid={dataTestid || "thumbnail"}
    >
      <ImageOrPlaceholder image={initialImage} />
    </Container>
  );
};

const ImageOrPlaceholder: React.FC<{ image?: string }> = ({ image }) => {
  return image ? (
    <Image
      src={image}
      alt="Thumbnail"
      className={styles.image}
      fill
      sizes="(max-width: 576px) 280px, (max-width: 768px) 360px, (max-width: 992px) 480px, 800px"
      draggable={false}
    />
  ) : (
    <div className={styles.placeholder}>No Image</div>
  );
};

export default Thumbnail;
