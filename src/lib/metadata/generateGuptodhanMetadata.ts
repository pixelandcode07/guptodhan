import type { Metadata } from "next";

interface GenerateMetadataOptions {
  title: string;
  description: string;
  urlPath?: string; // relative path, e.g., "/home/jobs"
  imageUrl?: string; // optional OG image
}

export function generateGuptodhanMetadata({
  title,
  description,
  urlPath = "/",
  imageUrl = "/og-images/default-og.jpg",
}: GenerateMetadataOptions): Metadata {
  const baseUrl = process.env.NEXTAUTH_URL;
  const fullUrl = `${baseUrl}${urlPath}`;
  const fullImageUrl = imageUrl.startsWith("http") ? imageUrl : `${baseUrl}${imageUrl}`;

  return {
    title,
    description,
    alternates: {
      canonical: fullUrl,
    },
    openGraph: {
      title,
      description,
      url: fullUrl,
      siteName: "Guptodhan",
      type: "website",
      images: [
        {
          url: fullImageUrl,
          width: 1200,
          height: 630,
          alt: title,
        },
      ],
    },
    twitter: {
      card: "summary_large_image",
      title,
      description,
      images: [fullImageUrl],
    },
    other: {
      "og:locale": "en_US",
      "og:type": "website",
      "robots": "index, follow",
      "theme-color": "#0084CB",
    },
  };
}
