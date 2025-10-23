export interface Album {
    id: string;
    title: string;
    description: string;
    cover: string;
    images: string[];
}

export const albums: Album[] = [
    {
        id: "competitions-2024",
        title: "Compétitions 2024",
        description: "Nos meilleures performances de l'année",
        cover: "/images/bg-image.jpg",
        images: [
            "/images/bg-image.jpg",
            "/images/bg-image.jpg",
            "/images/bg-image.jpg",
            "/images/bg-image.jpg",
            "/images/bg-image.jpg",
        ]
    },
    {
        id: "entrainements",
        title: "Entraînements",
        description: "Moments de préparation et d'apprentissage",
        cover: "/images/bg-image.jpg",
        images: [
            "/images/bg-image.jpg",
            "/images/bg-image.jpg",
            "/images/bg-image.jpg",
            "/images/bg-image.jpg",
        ]
    },
    {
        id: "evenements",
        title: "Événements",
        description: "Spectacles et événements spéciaux",
        cover: "/images/bg-image.jpg",
        images: [
            "/images/bg-image.jpg",
            "/images/bg-image.jpg",
            "/images/bg-image.jpg",
            "/images/bg-image.jpg",
        ]
    }
];

export function getAlbumById(id: string): Album | undefined {
    return albums.find(album => album.id === id);
}

export function getAllAlbumIds(): string[] {
    return albums.map(album => album.id);
}