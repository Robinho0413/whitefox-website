import Image from "next/image";
import Link from "next/link";
import { albums } from "@/lib/albums-data";

export default function Page() {
    return (
        <div className="mt-10 px-4 py-12 md:p-16">
            <h1 className="text-3xl font-semibold mb-8 relative inline-block">
                Galerie
                <span className="absolute left-0 bottom-0 w-0 h-0.5 bg-primary-500 animate-underline"></span>
            </h1>
            
            {/* Liste des albums */}
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
                                src={album.cover}
                                alt={album.title}
                                fill
                                style={{ objectFit: "cover" }}
                                className="brightness-75 group-hover:brightness-90 transition-brightness duration-300"
                            />
                            <div className="absolute inset-0 bg-gradient-to-t from-black/70 via-transparent to-transparent"></div>
                            <div className="absolute bottom-0 left-4 text-white bg-black/30 backdrop-blur-sm w-full p-2">
                                <h3 className="text-xl font-semibold mb-1">{album.title}</h3>
                                <p className="text-sm opacity-90">{album.images.length} photos</p>
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
        </div>
    );
}