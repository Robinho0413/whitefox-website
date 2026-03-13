import { createClient } from "@/lib/supabase/server";
import AnimatedAlbumsGrid from "@/components/gallery/AnimatedAlbumsGrid";

type Album = {
    id: string;
    title: string;
    description: string;
    cover_image: string;
    created_at: string | null;
};

type AlbumWithPhotoCount = Album & {
    photoCount: number;
};

export default async function Page() {
    const supabase = await createClient();

    const { data: albumsData } = await supabase
        .from("albums")
        .select("id, title, description, cover_image, created_at")
        .order("created_at", { ascending: false });

    const typedAlbums = (albumsData ?? []) as Album[];

    const { data: albumPhotos } = await supabase
        .from("album_photos")
        .select("album_id");

    const photoCountByAlbumId = new Map<string, number>();

    for (const row of albumPhotos ?? []) {
        const albumId = String(row.album_id);
        photoCountByAlbumId.set(albumId, (photoCountByAlbumId.get(albumId) ?? 0) + 1);
    }

    const albums: AlbumWithPhotoCount[] = typedAlbums.map((album) => ({
        ...album,
        photoCount: photoCountByAlbumId.get(album.id) ?? 0,
    }));

    return (
        <div className="mt-10 px-4 py-12 md:p-16">
            <h1 className="text-3xl font-semibold mb-8 relative inline-block">
                Galerie
                <span className="absolute left-0 bottom-0 w-0 h-0.5 bg-primary-500 animate-underline"></span>
            </h1>

            {/* Liste des albums */}
            {albums.length === 0 ? (
                <div className="rounded-lg border border-secondary/60 bg-secondary/40 px-4 py-6 text-muted-foreground">
                    Aucun album disponible.
                </div>
            ) : (
                <AnimatedAlbumsGrid albums={albums} />
            )}
        </div>
    );
}