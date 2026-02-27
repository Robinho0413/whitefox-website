"use client";

import { Button } from "@/components/ui/button";
import Image from "next/image";
import { useState } from "react";
import Link from "next/link";
import { getAlbumById } from "@/lib/albums-data";
import { notFound } from "next/navigation";

interface AlbumPageProps {
    params: {
        albumId: string;
    };
}

export default function AlbumPage({ params }: AlbumPageProps) {
    const [selectedImage, setSelectedImage] = useState<string | null>(null);
    const [columnsPerRow, setColumnsPerRow] = useState<2 | 4 | 6>(4);
    const album = getAlbumById(params.albumId);

    if (!album) {
        notFound();
    }

    const openModal = (imageSrc: string) => {
        setSelectedImage(imageSrc);
    };

    const closeModal = () => {
        setSelectedImage(null);
    };

    const downloadImage = (imageSrc: string) => {
        const link = document.createElement('a');
        link.href = imageSrc;
        link.download = `${album.title}-${Date.now()}.jpg`;
        document.body.appendChild(link);
        link.click();
        document.body.removeChild(link);
    };

    const getGridClasses = () => {
        switch (columnsPerRow) {
            case 2:
                return "grid grid-cols-1 sm:grid-cols-2 gap-4";
            case 4:
                return "grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 gap-3 sm:gap-4";
            case 6:
                return "grid grid-cols-3 sm:grid-cols-4 md:grid-cols-5 lg:grid-cols-6 gap-2 sm:gap-3 md:gap-4";
            default:
                return "grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 gap-3 sm:gap-4";
        }
    };

    return (
        <div className="mt-10 px-4 py-12 md:p-16">
            <div className="flex items-center justify-between gap-4 mb-8">
                <h1 className="text-3xl font-semibold relative inline-block">
                    {album.title}
                    <span className="absolute left-0 bottom-0 w-0 h-0.5 bg-primary-500 animate-underline"></span>
                </h1>
                <Link href="/gallery">
                    <Button
                        variant="icon"
                        className="flex items-center gap-2"
                    >
                        <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={2} stroke="currentColor" className="w-4 h-4">
                            <path strokeLinecap="round" strokeLinejoin="round" d="M15.75 19.5L8.25 12l7.5-7.5" />
                        </svg>
                        <span className="hidden md:inline">Retour à la galerie</span>
                    </Button>
                </Link>
            </div>

            <p className="text-muted-foreground mb-8">{album.description}</p>
            
            {/* Sélecteur de colonnes */}
            <div className="flex items-center justify-end gap-2 sm:gap-4 mb-6">
                <div className="flex gap-1 sm:gap-2">
                    <Button
                        variant={columnsPerRow === 2 ? "outline" : "icon"}
                        size="sm"
                        onClick={() => setColumnsPerRow(2)}
                        className="px-2 sm:px-3 py-1 text-xs sm:text-sm min-w-[32px] sm:min-w-[40px] flex items-center justify-center"
                        title="Grille large (1-2 colonnes)"
                    >
                        <div className="flex gap-0.5">
                            <div className="w-1.5 h-1.5 bg-current rounded-sm"></div>
                            <div className="w-1.5 h-1.5 bg-current rounded-sm"></div>
                        </div>
                    </Button>
                    <Button
                        variant={columnsPerRow === 4 ? "outline" : "icon"}
                        size="sm"
                        onClick={() => setColumnsPerRow(4)}
                        className="px-2 sm:px-3 py-1 text-xs sm:text-sm min-w-[32px] sm:min-w-[40px] flex items-center justify-center"
                        title="Grille moyenne (2-4 colonnes)"
                    >
                        <div className="grid grid-cols-2 gap-0.5">
                            <div className="w-1 h-1 bg-current rounded-sm"></div>
                            <div className="w-1 h-1 bg-current rounded-sm"></div>
                            <div className="w-1 h-1 bg-current rounded-sm"></div>
                            <div className="w-1 h-1 bg-current rounded-sm"></div>
                        </div>
                    </Button>
                    <Button
                        variant={columnsPerRow === 6 ? "outline" : "icon"}
                        size="sm"
                        onClick={() => setColumnsPerRow(6)}
                        className="px-2 sm:px-3 py-1 text-xs sm:text-sm min-w-[32px] sm:min-w-[40px] flex items-center justify-center"
                        title="Grille compacte (3-6 colonnes)"
                    >
                        <div className="grid grid-cols-3 gap-0.5">
                            <div className="w-0.5 h-0.5 bg-current rounded-sm"></div>
                            <div className="w-0.5 h-0.5 bg-current rounded-sm"></div>
                            <div className="w-0.5 h-0.5 bg-current rounded-sm"></div>
                            <div className="w-0.5 h-0.5 bg-current rounded-sm"></div>
                            <div className="w-0.5 h-0.5 bg-current rounded-sm"></div>
                            <div className="w-0.5 h-0.5 bg-current rounded-sm"></div>
                        </div>
                    </Button>
                </div>
            </div>
            
            {/* Grille d'images */}
            <div className={getGridClasses()}>
                {album.images.map((imageSrc, index) => (
                    <div 
                        key={index}
                        className="relative aspect-[4/3] overflow-hidden rounded-lg cursor-pointer group"
                        onClick={() => openModal(imageSrc)}
                        style={{ boxShadow: "0 10px 25px -3px rgba(59, 165, 155, 0.1), 0 4px 6px -2px rgba(59, 165, 155, 0.05)" }}
                    >
                        <Image
                            src={imageSrc}
                            alt={`${album.title} - Image ${index + 1}`}
                            fill
                            style={{ objectFit: "cover" }}
                            className="brightness-90 group-hover:brightness-110 transition-brightness duration-100"
                        />
                        
                        {/* Bouton télécharger au survol */}
                        <Button
                            variant={"icon"}
                            size={"icon"}
                            onClick={(e) => {
                                e.stopPropagation();
                                downloadImage(imageSrc);
                            }}
                            className="absolute bottom-2 right-2 opacity-0 group-hover:opacity-100 transition-opacity duration-200 bg-black/60 hover:bg-black/80 rounded-md w-8 h-8 flex items-center justify-center z-10 text-white"
                            title="Télécharger l'image"
                        >
                            <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={2} stroke="currentColor" className="w-4 h-4">
                                <path strokeLinecap="round" strokeLinejoin="round" d="M3 16.5v2.25A2.25 2.25 0 005.25 21h13.5A2.25 2.25 0 0021 18.75V16.5M16.5 12L12 16.5m0 0L7.5 12m4.5 4.5V3" />
                            </svg>
                        </Button>
                        
                        {/* Bordure overlay */}
                        <div 
                            className="absolute inset-0 pointer-events-none rounded-lg"
                            style={{ boxShadow: "inset 0 0 0 1px rgba(255, 255, 255, 0.1)" }}
                        ></div>
                    </div>
                ))}
            </div>

            {/* Modal */}
            {selectedImage && (
                <div 
                    className="fixed inset-0 bg-black bg-opacity-80 flex items-center justify-center z-50 p-4"
                    onClick={closeModal}
                >
                    <div className="relative max-w-7xl max-h-full w-full h-full flex items-center justify-center">
                        {/* Bouton fermer */}
                        <button
                            onClick={closeModal}
                            className="absolute top-4 right-4 text-white text-3xl hover:text-gray-300 transition-colors z-10 bg-black bg-opacity-50 rounded-full w-12 h-12 flex items-center justify-center"
                        >
                            ×
                        </button>
                        
                        {/* Bouton télécharger */}
                        <button
                            onClick={(e) => {
                                e.stopPropagation();
                                downloadImage(selectedImage);
                            }}
                            className="absolute top-4 right-20 text-white hover:text-gray-300 transition-colors z-10 bg-black bg-opacity-50 rounded-full w-12 h-12 flex items-center justify-center"
                            title="Télécharger l'image"
                        >
                            <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={2} stroke="currentColor" className="w-6 h-6">
                                <path strokeLinecap="round" strokeLinejoin="round" d="M3 16.5v2.25A2.25 2.25 0 005.25 21h13.5A2.25 2.25 0 0021 18.75V16.5M16.5 12L12 16.5m0 0L7.5 12m4.5 4.5V3" />
                            </svg>
                        </button>
                        
                        <div className="relative w-full h-full max-w-5xl max-h-5xl">
                            <Image
                                src={selectedImage}
                                alt="Image agrandie"
                                fill
                                style={{ objectFit: "contain" }}
                                className="rounded-lg"
                            />
                        </div>
                    </div>
                </div>
            )}
        </div>
    );
}