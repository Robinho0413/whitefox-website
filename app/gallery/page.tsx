import Image from "next/image";
import Link from "next/link";
import { createClient } from "@/lib/supabase/server";

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
                <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
                    {albums.map((album) => (
                        <Link
                            key={album.id}
                            href={`/gallery/${album.id}`}
                            className="block"
                            style={{ boxShadow: "0 10px 25px -3px rgba(59, 165, 155, 0.1), 0 4px 6px -2px rgba(59, 165, 155, 0.05)" }}
                        >
                            <div className="relative aspect-[4/3] overflow-hidden rounded-lg cursor-pointer group shadow-lg hover:shadow-xl transition-shadow duration-300">
                                <Image
                                    src={album.cover_image}
                                    alt={album.title}
                                    fill
                                    style={{ objectFit: "cover" }}
                                    className="brightness-75 group-hover:brightness-90 transition-brightness duration-300"
                                />
                                <div className="absolute inset-0 bg-gradient-to-t from-black/70 via-transparent to-transparent"></div>
                                <div className="absolute bottom-0 left-4 text-white bg-black/30 backdrop-blur-sm w-full p-2">
                                    <h3 className="text-xl font-semibold mb-1">{album.title}</h3>
                                    <p className="text-sm opacity-90">
                                        {album.photoCount} {album.photoCount > 1 ? "photos" : "photo"}
                                    </p>
                                    <p className="text-sm opacity-75 mt-1">{album.description}</p>
                                </div>
                                {/* Bordure overlay */}
                                <div
                                    className="absolute inset-0 pointer-events-none rounded-lg"
                                    style={{ boxShadow: "inset 0 0 0 1px rgba(255, 255, 255, 0.1)" }}
                                ></div>
                            </div>
                        </Link>
                    ))}
                </div>
            )}
        </div>
    );
}