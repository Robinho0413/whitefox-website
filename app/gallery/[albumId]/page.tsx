import { createClient } from "@/lib/supabase/server";
import { getGalleryPublicUrl } from "@/lib/supabase/storage";
import { notFound } from "next/navigation";
import AlbumDetailClient from "./AlbumDetailClient";

interface AlbumPageProps {
    params: {
        albumId: string;
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