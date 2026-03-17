import { createClient } from "@/lib/supabase/server";
import { getGalleryPublicUrl } from "@/lib/supabase/storage";
import { notFound } from "next/navigation";
import AlbumDetailClient from "./AlbumDetailClient";
import type { Metadata } from "next";
import { siteUrl } from "@/app/metadata";

interface AlbumPageProps {
    params: {
        albumId: string;
    };
}

export async function generateMetadata({ params }: AlbumPageProps): Promise<Metadata> {
    const supabase = await createClient();
    const albumId = decodeURIComponent(params.albumId);

    const { data: albumData } = await supabase
        .from("albums")
        .select("id, title, description, cover_image")
        .eq("id", albumId)
        .single<{
            id: string;
            title: string;
            description: string;
            cover_image: string | null;
        }>();

    if (!albumData) {
        return {
            title: "Album introuvable",
            robots: {
                index: false,
                follow: false,
            },
        };
    }

    const canonicalPath = `/gallery/${encodeURIComponent(albumData.id)}`;

    return {
        title: `${albumData.title} | Galerie`,
        description:
            albumData.description || `Album photo ${albumData.title} de l'association Whitefox Cheer.`,
        alternates: {
            canonical: canonicalPath,
        },
        openGraph: {
            title: `${albumData.title} | Whitefox Cheer`,
            description:
                albumData.description || `Album photo ${albumData.title} de l'association Whitefox Cheer.`,
            type: "article",
            url: `${siteUrl}${canonicalPath}`,
            images: albumData.cover_image
                ? [
                    {
                        url: albumData.cover_image,
                        alt: albumData.title,
                    },
                ]
                : undefined,
        },
    };
}

export default async function AlbumPage({ params }: AlbumPageProps) {
    const supabase = await createClient();
    const albumId = decodeURIComponent(params.albumId);

    const { data: albumData } = await supabase
        .from("albums")
        .select("id, title, description")
        .eq("id", albumId)
        .single<{
            id: string;
            title: string;
            description: string;
        }>();

    if (!albumData) {
        notFound();
    }

    const { data: photosData } = await supabase
        .from("album_photos")
        .select("storage_path, sort_order, created_at")
        .eq("album_id", albumId)
        .order("sort_order", { ascending: true })
        .order("created_at", { ascending: true });

    const albumImages = (photosData ?? []).map((photo) =>
        getGalleryPublicUrl(photo.storage_path)
    );

    return (
        <AlbumDetailClient
            albumTitle={albumData.title}
            albumDescription={albumData.description}
            albumImages={albumImages}
        />
    );
}