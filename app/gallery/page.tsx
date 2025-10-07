"use client";

import { Button } from "@/components/ui/button";
import Image from "next/image";
import { useState } from "react";

export default function Page() {
    const [selectedImage, setSelectedImage] = useState<string | null>(null);
    
    const images = [
        "/images/bg-image.jpg",
        "/images/bg-image.jpg",
        "/images/bg-image.jpg",
        "/images/bg-image.jpg",
        "/images/bg-image.jpg",
        "/images/bg-image.jpg",
        "/images/bg-image.jpg",
        "/images/bg-image.jpg",
        "/images/bg-image.jpg",
        "/images/bg-image.jpg",
        "/images/bg-image.jpg",
        "/images/bg-image.jpg",
        "/images/bg-image.jpg",
    ];

    const openModal = (imageSrc: string) => {
        setSelectedImage(imageSrc);
    };

    const closeModal = () => {
        setSelectedImage(null);
    };

    const downloadImage = (imageSrc: string) => {
        const link = document.createElement('a');
        link.href = imageSrc;
        link.download = `image-${Date.now()}.jpg`; // Nom du fichier avec timestamp
        document.body.appendChild(link);
        link.click();
        document.body.removeChild(link);
    };

    return (
        <div className="mt-10 px-4 py-12 md:p-16">
            <h1 className="text-3xl font-semibold mb-8 relative inline-block">
                Galerie
                <span className="absolute left-0 bottom-0 w-0 h-0.5 bg-primary-500 animate-underline"></span>
            </h1>
            
            <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4">
                {images.map((imageSrc, index) => (
                    <div 
                        key={index}
                        className="relative aspect-[4/3] overflow-hidden rounded-lg cursor-pointer group"
                        onClick={() => openModal(imageSrc)}
                    >
                        <Image
                            src={imageSrc}
                            alt={`Image de galerie ${index + 1}`}
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
                            className="absolute bottom-2 right-2 opacity-0 group-hover:opacity-100 transition-opacity duration-200 bg-black bg-opacity-60 hover:bg-opacity-80 rounded-md w-8 h-8 flex items-center justify-center z-10"
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