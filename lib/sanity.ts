import { createClient } from "next-sanity";
//import createImageUrlBuilder from "@sanity/image-url";
import { createImageUrlBuilder } from "@sanity/image-url";
export const sanityClient = createClient({
  projectId: process.env.NEXT_PUBLIC_SANITY_PROJECT_ID || "demo",
  dataset: process.env.NEXT_PUBLIC_SANITY_DATASET || "production",
  apiVersion: "2024-01-01",
  useCdn: process.env.NODE_ENV === "production",
});

const builder = createImageUrlBuilder(sanityClient);

// eslint-disable-next-line @typescript-eslint/no-explicit-any
export function urlFor(source: any) {
  return builder.image(source);
}

export async function getPosts() {
  if (!process.env.NEXT_PUBLIC_SANITY_PROJECT_ID) {
    console.warn("Sanity Project ID is missing. Returning empty posts array.");
    return [];
  }

  const query = `
    *[_type == "post"] | order(publishedAt desc)[0...3] {
      title,
      "slug": slug.current,
      excerpt,
      mainImage,
      author,
      publishedAt
    }
  `;
  try {
    return await sanityClient.fetch(query);
  } catch (error) {
    console.error("Sanity fetch failed:", error);
    return [];
  }
}
