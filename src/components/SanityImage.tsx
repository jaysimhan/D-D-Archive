import { urlFor } from '../lib/sanity';
import type { SanityImage as SanityImageType } from '../types/dnd-types';

interface SanityImageProps {
    /** The image asset object from Sanity (must include asset with metadata) */
    imageAsset: SanityImageType | null | undefined;
    /** Alt text for accessibility */
    alt: string;
    /** Optional width constraint (for hotspot to work, both width and height must be set) */
    width?: number;
    /** Optional height constraint (for hotspot to work, both width and height must be set) */
    height?: number;
    /** Optional CSS class name for the container */
    className?: string;
    /** Optional inline styles for the image */
    style?: React.CSSProperties;
    /** Image quality (1-100), defaults to 80 */
    quality?: number;
    /** Whether to show the LQIP placeholder, defaults to true */
    showPlaceholder?: boolean;
    /** Object fit style for the image */
    objectFit?: 'cover' | 'contain' | 'fill' | 'none' | 'scale-down';
    /** Object position for the image (e.g., 'center', 'top', 'bottom') */
    objectPosition?: string;
}

/**
 * Optimized image component for Sanity images.
 * Provides lazy loading, blur-up LQIP placeholders, responsive srcset, and WebP auto-format.
 */
const SanityImage = ({
    imageAsset,
    alt,
    width = 800,
    height,
    className = '',
    style = {},
    quality = 80,
    showPlaceholder = true,
    objectFit = 'cover',
    objectPosition = 'center',
}: SanityImageProps) => {
    // Guard clause: If no image exists, return nothing
    if (!imageAsset?.asset) return null;

    // Extract the Low Quality Image Placeholder
    const placeholder = showPlaceholder ? imageAsset.asset.metadata?.lqip : undefined;

    // Build base image URL with the image builder
    const baseBuilder = urlFor(imageAsset);
    if (!baseBuilder) return null;

    // Build the main src URL
    let mainBuilder = baseBuilder.width(width).auto('format').quality(quality);
    if (height) {
        mainBuilder = mainBuilder.height(height);
    }
    const mainSrc = mainBuilder.url();

    // Build responsive srcset URLs
    const sizes = [400, 800, 1200];
    const srcSet = sizes
        .map((w) => {
            let builder = baseBuilder.width(w).auto('format').quality(quality);
            if (height) {
                // Maintain aspect ratio based on the provided width/height
                const scaledHeight = Math.round((height / width) * w);
                builder = builder.height(scaledHeight);
            }
            return `${builder.url()} ${w}w`;
        })
        .join(', ');

    // Responsive sizes attribute
    const sizesAttr = '(max-width: 600px) 400px, (max-width: 1200px) 800px, 1200px';

    return (
        <img
            src={mainSrc}
            srcSet={srcSet}
            sizes={sizesAttr}
            alt={alt}
            loading="lazy"
            decoding="async"
            className={className}
            style={{
                display: 'block',
                width: '100%',
                height: 'auto',
                objectFit,
                objectPosition,
                // LQIP blur-up placeholder as background
                backgroundImage: placeholder ? `url(${placeholder})` : 'none',
                backgroundSize: 'cover',
                backgroundPosition: 'center',
                backgroundRepeat: 'no-repeat',
                ...style,
            }}
        />
    );
};

export default SanityImage;
