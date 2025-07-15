import { HttpTypes } from "@medusajs/types";

/**
 * Get the best available image for a product
 * Priority: thumbnail > first image > fallback
 */
export function getProductImage(
    product: HttpTypes.StoreProduct,
    fallbackUrl?: string
): string | null {
    return product.thumbnail || product.images?.[0]?.url || fallbackUrl || null;
}

/**
 * Get all product images including thumbnail
 */
export function getAllProductImages(
    product: HttpTypes.StoreProduct
): string[] {
    const images: string[] = [];

    if (product.thumbnail) {
        images.push(product.thumbnail);
    }

    if (product.images) {
        product.images.forEach((image) => {
            if (image.url && !images.includes(image.url)) {
                images.push(image.url);
            }
        });
    }

    return images;
}

/**
 * Generate responsive image sizes for Next.js Image component
 */
export function getImageSizes(size: "small" | "medium" | "large" | "full" = "medium"): string {
    switch (size) {
        case "small":
            return "(max-width: 576px) 180px, (max-width: 768px) 200px, 180px";
        case "medium":
            return "(max-width: 576px) 280px, (max-width: 768px) 360px, (max-width: 992px) 480px, 800px";
        case "large":
            return "(max-width: 576px) 320px, (max-width: 768px) 440px, (max-width: 992px) 600px, 800px";
        case "full":
            return "100vw";
        default:
            return "(max-width: 576px) 280px, (max-width: 768px) 360px, (max-width: 992px) 480px, 800px";
    }
}

/**
 * Generate optimized image URL with query parameters
 * Useful for CDN optimization
 */
export function getOptimizedImageUrl(
    imageUrl: string,
    width?: number,
    height?: number,
    quality: number = 80
): string {
    if (!imageUrl) return imageUrl;

    try {
        const url = new URL(imageUrl);

        // Add optimization parameters
        if (width) url.searchParams.set("w", width.toString());
        if (height) url.searchParams.set("h", height.toString());
        url.searchParams.set("q", quality.toString());
        url.searchParams.set("fit", "cover");

        return url.toString();
    } catch {
        // If URL parsing fails, return original
        return imageUrl;
    }
}

/**
 * Check if image URL is valid
 */
export function isValidImageUrl(url: string): boolean {
    if (!url) return false;

    try {
        new URL(url);
        return true;
    } catch {
        return false;
    }
}

/**
 * Get image dimensions based on size
 */
export function getImageDimensions(size: "small" | "medium" | "large" | "full" = "medium"): {
    width: number;
    height: number;
} {
    switch (size) {
        case "small":
            return { width: 180, height: 180 };
        case "medium":
            return { width: 290, height: 290 };
        case "large":
            return { width: 440, height: 440 };
        case "full":
            return { width: 800, height: 600 };
        default:
            return { width: 290, height: 290 };
    }
}

/**
 * Generate alt text for product images
 */
export function getProductImageAlt(
    product: HttpTypes.StoreProduct,
    imageIndex: number = 0
): string {
    const baseAlt = product.title || "Product";

    if (imageIndex === 0) {
        return `${baseAlt} - Main image`;
    }

    return `${baseAlt} - Image ${imageIndex + 1}`;
}

/**
 * Check if image should be loaded with priority
 */
export function shouldLoadImageWithPriority(
    isFeatured: boolean = false,
    isAboveFold: boolean = false
): boolean {
    return isFeatured || isAboveFold;
} 