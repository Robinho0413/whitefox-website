"use client";

import { Button } from "@/components/ui/button";
import Image from "next/image";
import Link from "next/link";
import { useEffect, useState } from "react";
import { toast } from "sonner";
import { AnimatePresence, motion, useReducedMotion } from "framer-motion";
import { ChevronLeft, ChevronRight, X } from "lucide-react";

type AlbumDetailClientProps = {
    albumTitle: string;
    albumDescription: string;
    albumImages: string[];
};

export default function AlbumDetailClient({
    albumTitle,
    albumDescription,
    albumImages,
}: AlbumDetailClientProps) {
    const [selectedImageIndex, setSelectedImageIndex] = useState<number | null>(null);
    const [columnsPerRow, setColumnsPerRow] = useState<2 | 4 | 6>(4);
    const [touchStartX, setTouchStartX] = useState<number | null>(null);
    const [slideDirection, setSlideDirection] = useState<1 | -1>(1);
    const shouldReduceMotion = useReducedMotion();

    const selectedImage = selectedImageIndex !== null ? albumImages[selectedImageIndex] : null;

    const openModal = (imageIndex: number) => {
        setSlideDirection(1);
        setSelectedImageIndex(imageIndex);
    };

    const closeModal = () => {
        setSelectedImageIndex(null);
    };

    const showPreviousImage = () => {
        setSlideDirection(-1);
        setSelectedImageIndex((currentIndex) => {
            if (currentIndex === null || albumImages.length === 0) {
                return currentIndex;
            }

            return currentIndex === 0 ? albumImages.length - 1 : currentIndex - 1;
        });
    };

    const showNextImage = () => {
        setSlideDirection(1);
        setSelectedImageIndex((currentIndex) => {
            if (currentIndex === null || albumImages.length === 0) {
                return currentIndex;
            }

            return currentIndex === albumImages.length - 1 ? 0 : currentIndex + 1;
        });
    };

    const handleCardClick = (
        event: React.MouseEvent<HTMLDivElement>,
        imageIndex: number
    ) => {
        const targetElement = event.target as HTMLElement;
        if (targetElement.closest('[data-download-button="true"]')) {
            return;
        }

        openModal(imageIndex);
    };

    const handleTouchStart = (event: React.TouchEvent<HTMLDivElement>) => {
        setTouchStartX(event.touches[0]?.clientX ?? null);
    };

    const handleTouchEnd = (event: React.TouchEvent<HTMLDivElement>) => {
        if (touchStartX === null) {
            return;
        }

        const touchEndX = event.changedTouches[0]?.clientX;
        if (typeof touchEndX !== "number") {
            setTouchStartX(null);
            return;
        }

        const swipeDistance = touchEndX - touchStartX;
        const swipeThreshold = 50;

        if (swipeDistance > swipeThreshold) {
            showPreviousImage();
        } else if (swipeDistance < -swipeThreshold) {
            showNextImage();
        }

        setTouchStartX(null);
    };

    useEffect(() => {
        if (selectedImageIndex === null) {
            return;
        }

        const handleKeyDown = (event: KeyboardEvent) => {
            if (event.key === "ArrowLeft") {
                event.preventDefault();
                showPreviousImage();
            }

            if (event.key === "ArrowRight") {
                event.preventDefault();
                showNextImage();
            }

            if (event.key === "Escape") {
                event.preventDefault();
                closeModal();
            }
        };

        window.addEventListener("keydown", handleKeyDown);
        return () => {
            window.removeEventListener("keydown", handleKeyDown);
        };
    }, [selectedImageIndex, albumImages.length]);

    useEffect(() => {
        if (selectedImageIndex === null) {
            return;
        }

        const previousBodyOverflow = document.body.style.overflow;
        const previousHtmlOverflow = document.documentElement.style.overflow;

        document.body.style.overflow = "hidden";
        document.documentElement.style.overflow = "hidden";

        return () => {
            document.body.style.overflow = previousBodyOverflow;
            document.documentElement.style.overflow = previousHtmlOverflow;
        };
    }, [selectedImageIndex]);

    const downloadImage = async (imageSrc: string) => {
        const loadingToastId = toast.loading("Téléchargement en cours...", {
            position: "bottom-right",
        });

        try {
            const response = await fetch(imageSrc);
            if (!response.ok) {
                throw new Error("Download failed");
            }

            const blob = await response.blob();
            const objectUrl = URL.createObjectURL(blob);

            let extension = "jpg";
            try {
                const pathname = new URL(imageSrc).pathname;
                const fileName = pathname.split("/").pop() ?? "";
                const dotIndex = fileName.lastIndexOf(".");
                if (dotIndex > -1 && dotIndex < fileName.length - 1) {
                    extension = fileName.slice(dotIndex + 1);
                }
            } catch {
                extension = "jpg";
            }

            const link = document.createElement("a");
            link.href = objectUrl;
            link.download = `${albumTitle}-${Date.now()}.${extension}`;
            document.body.appendChild(link);
            link.click();
            document.body.removeChild(link);
            URL.revokeObjectURL(objectUrl);

            toast.success("Image téléchargée", {
                id: loadingToastId,
                position: "bottom-right",
            });
        } catch {
            toast.error("Téléchargement impossible, ouverture de l'image.", {
                id: loadingToastId,
                position: "bottom-right",
            });
            window.open(imageSrc, "_blank", "noopener,noreferrer");
        }
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
            <div className="flex flex-col gap-4 mb-8">
                <Link href="/gallery" className="mb-4">
                    <Button variant="icon" className="flex items-center gap-2">
                        <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={2} stroke="currentColor" className="w-4 h-4">
                            <path strokeLinecap="round" strokeLinejoin="round" d="M15.75 19.5L8.25 12l7.5-7.5" />
                        </svg>
                        <span className="hidden md:inline">Retour</span>
                    </Button>
                </Link>
                <h1 className="text-3xl font-semibold relative inline-block w-fit">
                    {albumTitle}
                    <span className="absolute left-0 bottom-0 w-0 h-0.5 bg-primary-500 animate-underline"></span>
                </h1>
                <p className="text-muted-foreground">{albumDescription}</p>
            </div>

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

            <motion.div
                layout
                className={getGridClasses()}
                transition={{ layout: { duration: 0.35, ease: [0.22, 1, 0.36, 1] } }}
            >
                {albumImages.map((imageSrc, index) => (
                    <motion.div
                        layout
                        key={index}
                        initial={shouldReduceMotion ? false : { opacity: 0, y: 20, scale: 0.98 }}
                        whileInView={{ opacity: 1, y: 0, scale: 1 }}
                        viewport={{ once: true, amount: 0.15 }}
                        transition={{
                            duration: 0.4,
                            ease: [0.22, 1, 0.36, 1],
                            delay: shouldReduceMotion ? 0 : Math.min(index * 0.04, 0.36),
                        }}
                        className="relative aspect-[4/3] overflow-hidden rounded-lg cursor-pointer group"
                        onClick={(event) => handleCardClick(event, index)}
                        style={{ boxShadow: "0 10px 25px -3px rgba(59, 165, 155, 0.1), 0 4px 6px -2px rgba(59, 165, 155, 0.05)" }}
                    >
                        <Image
                            src={imageSrc}
                            alt={`${albumTitle} - Image ${index + 1}`}
                            fill
                            style={{ objectFit: "cover" }}
                            className="brightness-90 group-hover:brightness-110 transition-brightness duration-100"
                        />

                        <Button
                            variant={"icon"}
                            size={"icon"}
                            type="button"
                            data-download-button="true"
                            onMouseDown={(event) => {
                                event.stopPropagation();
                            }}
                            onTouchStart={(event) => {
                                event.stopPropagation();
                            }}
                            onClick={(event) => {
                                event.stopPropagation();
                                downloadImage(imageSrc);
                            }}
                            className="absolute bottom-2 right-2 opacity-100 md:opacity-0 md:group-hover:opacity-100 transition-opacity duration-200 bg-black/60 hover:bg-black/80 rounded-md w-8 h-8 flex items-center justify-center z-10 text-white"
                            title="Télécharger l'image"
                        >
                            <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={2} stroke="currentColor" className="w-4 h-4">
                                <path strokeLinecap="round" strokeLinejoin="round" d="M3 16.5v2.25A2.25 2.25 0 005.25 21h13.5A2.25 2.25 0 0021 18.75V16.5M16.5 12L12 16.5m0 0L7.5 12m4.5 4.5V3" />
                            </svg>
                        </Button>

                        <div
                            className="absolute inset-0 pointer-events-none rounded-lg"
                            style={{ boxShadow: "inset 0 0 0 1px rgba(255, 255, 255, 0.1)" }}
                        ></div>
                    </motion.div>
                ))}
            </motion.div>

            {albumImages.length === 0 && (
                <p className="text-muted-foreground">Aucune photo dans cet album pour le moment.</p>
            )}

            {selectedImage && (
                <div
                    className="fixed inset-0 bg-black bg-opacity-80 flex items-center justify-center z-50 p-4"
                    onClick={closeModal}
                >
                    <div
                        className="relative max-w-7xl max-h-full w-full h-full flex items-center justify-center"
                        onClick={(event) => event.stopPropagation()}
                        onTouchStart={handleTouchStart}
                        onTouchEnd={handleTouchEnd}
                    >
                        <Button
                            onClick={(event) => {
                                event.stopPropagation();
                                showPreviousImage();
                            }}
                            className="absolute left-4 top-1/2 -translate-y-1/2 text-2xl text-white md:hover:text-gray-300 transition-colors z-10 rounded-full w-12 h-12 flex items-center justify-center"
                            title="Photo précédente"
                            variant={"icon"}
                        >
                            <ChevronLeft className="h-6 w-6" />
                        </Button>

                        <Button
                            onClick={(event) => {
                                event.stopPropagation();
                                showNextImage();
                            }}
                            className="absolute right-4 top-1/2 -translate-y-1/2 text-2xl text-white md:hover:text-gray-300 transition-colors z-10 rounded-full w-12 h-12 flex items-center justify-center"
                            title="Photo suivante"
                            variant={"icon"}
                        >
                            <ChevronRight className="h-6 w-6" />
                        </Button>

                        <Button
                            onClick={closeModal}
                            className="absolute top-4 right-4 text-white text-3xl md:hover:text-gray-300 transition-colors z-10 rounded-full w-12 h-12 flex items-center justify-center"
                            title="Fermer"
                            variant={"icon"}
                        >
                            <X className="h-6 w-6" />
                        </Button>

                        <Button
                            onClick={(event) => {
                                event.stopPropagation();
                                downloadImage(selectedImage);
                            }}
                            className="absolute top-4 right-20 text-white md:hover:text-gray-300 transition-colors z-10 rounded-full w-12 h-12 flex items-center justify-center"
                            title="Télécharger l'image"
                            variant={"icon"}
                        >
                            <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={2} stroke="currentColor" className="w-6 h-6">
                                <path strokeLinecap="round" strokeLinejoin="round" d="M3 16.5v2.25A2.25 2.25 0 005.25 21h13.5A2.25 2.25 0 0021 18.75V16.5M16.5 12L12 16.5m0 0L7.5 12m4.5 4.5V3" />
                            </svg>
                        </Button>

                        <div className="relative w-full h-full max-w-5xl max-h-5xl overflow-hidden">
                            <AnimatePresence initial={false} custom={slideDirection} mode="wait">
                                <motion.div
                                    key={selectedImageIndex}
                                    custom={slideDirection}
                                    variants={{
                                        enter: (direction: number) => ({
                                            x: direction > 0 ? 80 : -80,
                                            opacity: 0,
                                        }),
                                        center: {
                                            x: 0,
                                            opacity: 1,
                                        },
                                        exit: (direction: number) => ({
                                            x: direction > 0 ? -80 : 80,
                                            opacity: 0,
                                        }),
                                    }}
                                    initial="enter"
                                    animate="center"
                                    exit="exit"
                                    transition={{ duration: 0.25, ease: "easeInOut" }}
                                    className="absolute inset-0"
                                >
                                    <Image
                                        src={selectedImage}
                                        alt="Image agrandie"
                                        fill
                                        style={{ objectFit: "contain" }}
                                        className="rounded-lg"
                                    />
                                </motion.div>
                            </AnimatePresence>
                        </div>

                        {selectedImageIndex !== null && (
                            <div className="absolute bottom-4 left-1/2 -translate-x-1/2 text-white text-sm bg-black/50 px-3 py-1 rounded-full">
                                {selectedImageIndex + 1} / {albumImages.length}
                            </div>
                        )}
                    </div>
                </div>
            )}
        </div>
    );
}
