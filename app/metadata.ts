// metadata.ts
import type { Metadata } from "next";

export const siteUrl =
  process.env.NEXT_PUBLIC_SITE_URL?.replace(/\/$/, "") || "https://whitefoxcheer.fr";

export const metadata: Metadata = {
  metadataBase: new URL(siteUrl),
  title: {
    default: "Whitefox Cheer",
    template: "%s | Whitefox Cheer",
  },
  description: "Site officiel de l'association Whitefox Cheer à Brive-la-Gaillarde. Découvrez nos entraînements, événements et rejoignez notre équipe de cheerleading et de danse pompom.",
  keywords: [
    "whitefox cheer",
    "cheerleading brive",
    "pompom brive",
    "association sportive brive",
    "cheer et pom's",
  ],
  icons: {
    icon: "/images/logo-black.png",
    apple: "/images/logo-black.png",
  },
  alternates: {
    canonical: "/",
  },
  openGraph: {
    type: "website",
    locale: "fr_FR",
    url: siteUrl,
    siteName: "Whitefox Cheer",
    title: "Whitefox Cheer",
    description:
      "Association de cheerleading et danse pompom a Brive-la-Gaillarde. Entrainements, actualites, galerie et inscriptions.",
    images: [
      {
        url: "/images/logo-black.png",
        width: 1200,
        height: 630,
        alt: "Logo Whitefox Cheer",
      },
    ],
  },
  twitter: {
    card: "summary_large_image",
    title: "Whitefox Cheer",
    description:
      "Association de cheerleading et danse pompom a Brive-la-Gaillarde.",
    images: ["/images/logo-black.png"],
  },
  robots: {
    index: true,
    follow: true,
    googleBot: {
      index: true,
      follow: true,
      "max-image-preview": "large",
      "max-snippet": -1,
      "max-video-preview": -1,
    },
  },
};