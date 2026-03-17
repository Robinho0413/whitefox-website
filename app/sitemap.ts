import type { MetadataRoute } from "next";
import { siteUrl } from "./metadata";
import { createClient } from "@/lib/supabase/server";

export default async function sitemap(): Promise<MetadataRoute.Sitemap> {
  const now = new Date();

  const staticRoutes: MetadataRoute.Sitemap = [
    {
      url: siteUrl,
      lastModified: now,
      changeFrequency: "weekly",
      priority: 1,
    },
    {
      url: `${siteUrl}/club`,
      lastModified: now,
      changeFrequency: "monthly",
      priority: 0.9,
    },
    {
      url: `${siteUrl}/inscription`,
      lastModified: now,
      changeFrequency: "weekly",
      priority: 0.9,
    },
    {
      url: `${siteUrl}/gallery`,
      lastModified: now,
      changeFrequency: "weekly",
      priority: 0.9,
    },
    {
      url: `${siteUrl}/sponsors`,
      lastModified: now,
      changeFrequency: "monthly",
      priority: 0.7,
    },
    {
      url: `${siteUrl}/contact`,
      lastModified: now,
      changeFrequency: "monthly",
      priority: 0.8,
    },
    {
      url: `${siteUrl}/mentions-legales`,
      lastModified: now,
      changeFrequency: "yearly",
      priority: 0.3,
    },
    {
      url: `${siteUrl}/plan-du-site`,
      lastModified: now,
      changeFrequency: "monthly",
      priority: 0.5,
    },
  ];

  try {
    const supabase = await createClient();
    const { data: albums } = await supabase
      .from("albums")
      .select("id, created_at")
      .order("created_at", { ascending: false });

    const albumRoutes: MetadataRoute.Sitemap = (albums ?? []).map((album) => ({
      url: `${siteUrl}/gallery/${encodeURIComponent(String(album.id))}`,
      lastModified: album.created_at ? new Date(album.created_at) : now,
      changeFrequency: "monthly",
      priority: 0.8,
    }));

    return [...staticRoutes, ...albumRoutes];
  } catch {
    return staticRoutes;
  }
}