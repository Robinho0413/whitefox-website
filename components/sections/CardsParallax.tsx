"use client";

import ParallaxCard from "../card/parallaxCard";
import { useScroll } from 'framer-motion';
import { useRef } from 'react';

const projects = [
    {
        title: "Loto du Club - 2025",
        description: "Nous organisons notre grand loto annuel le 15 novembre 2025 ! Plus de 4000€ de lots ! Venez nombreux et soutenez notre club tout en passant un moment agréable en famille ou entre amis.",
        src: "loto-whitefox.jpg",
        url: "https://www.helloasso.com/associations/whitefox/boutiques/loto-15-novembre",
        btn: "Billeterie"
    },
    {
        title: "Loto du Club - 2025",
        description: "Nous organisons notre grand loto annuel le 15 novembre 2025 ! Plus de 4000€ de lots ! Venez nombreux et soutenez notre club tout en passant un moment agréable en famille ou entre amis.",
        src: "loto-whitefox.jpg",
        url: "https://www.helloasso.com/associations/whitefox/boutiques/loto-15-novembre",
        btn: "Billeterie"
    },
    {
        title: "Loto du Club - 2025",
        description: "Nous organisons notre grand loto annuel le 15 novembre 2025 ! Plus de 4000€ de lots ! Venez nombreux et soutenez notre club tout en passant un moment agréable en famille ou entre amis.",
        src: "loto-whitefox.jpg",
        url: "https://www.helloasso.com/associations/whitefox/boutiques/loto-15-novembre",
        btn: "Billeterie"
    },
    {
        title: "Loto du Club - 2025",
        description: "Nous organisons notre grand loto annuel le 15 novembre 2025 ! Plus de 4000€ de lots ! Venez nombreux et soutenez notre club tout en passant un moment agréable en famille ou entre amis.",
        src: "loto-whitefox.jpg",
        url: "https://www.helloasso.com/associations/whitefox/boutiques/loto-15-novembre",
        btn: "Billeterie"
    },
    {
        title: "Carnaval Malemort - 2025",
        description: "Carnaval de Malemort",
        src: "bg-image.jpg",
        url: "/gallery",
        btn: "Voir les photos"
    }
]

export default function CardsParallax() {
    const container = useRef(null);
    const { scrollYProgress } = useScroll({
        target: container,
        offset: ['start start', 'end end']
    })


    return (
        <div className="bg-background relative z-10 p-4 md:py-16">
            <h1 className="absolute top-8 sm:top-32 left-1/2 transform -translate-x-1/2 text-3xl md:text-5xl font-bold z-20">Actualités</h1>
            {
                projects.map((project, i) => {
                    const targetScale = 1 - ((projects.length - i) * 0.05);
                    return <ParallaxCard key={`p_${i}`} i={i} {...project} btn={project.btn} progress={scrollYProgress} range={[i * .25, 1]} targetScale={targetScale} />
                })
            }
        </div>
    )
}