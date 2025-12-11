import { createClient } from '@sanity/client';
import imageUrlBuilder from '@sanity/image-url';

// Sanity client configuration
export const sanityClient = createClient({
    projectId: 'ylk0tk34',
    dataset: 'production',
    useCdn: true, // Enable CDN for faster reads (cached data)
    apiVersion: '2024-01-01', // Use a date-based API version
});

// Image URL builder
const builder = imageUrlBuilder(sanityClient);

// Sanity image reference type
export interface SanityImage {
    _type: 'image';
    asset: {
        _ref: string;
        _type: 'reference';
    };
    hotspot?: {
        x: number;
        y: number;
        height: number;
        width: number;
    };
}

// Helper function to get image URL from Sanity image reference
export function urlFor(source: SanityImage | null | undefined) {
    if (!source) return null;
    return builder.image(source);
}

// Helper function to fetch data from Sanity
export async function fetchSanityData<T>(query: string, params?: Record<string, unknown>): Promise<T> {
    return sanityClient.fetch<T>(query, params || {});
}
