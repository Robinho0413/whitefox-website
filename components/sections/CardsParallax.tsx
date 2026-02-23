"use client";

import ParallaxCard from "../card/parallaxCard";
import { useScroll } from 'framer-motion';
import { useRef } from 'react';
import { useNews } from "@/hooks/useNews";

export default function CardsParallax() {
    const container = useRef(null);
    const { scrollYProgress } = useScroll({
        target: container,
        offset: ['start start', 'end end']
    })

    const { news, loading } = useNews();

    if (loading) return <div className="p-4">Chargement des actualités...</div>;
    if (!news.length) return <div className="p-4">Aucune actualité disponible.</div>;

    return (
        <div className="bg-background relative z-10 p-4 md:py-16" ref={container}>
            <h1 className="absolute top-8 md:top-16 left-1/2 transform -translate-x-1/2 text-3xl md:text-5xl font-bold z-20">Actualités</h1>
            {
                news.map((item, i) => {
                    const targetScale = 1 - ((news.length - i) * 0.05);
                    return <ParallaxCard key={`p_${i}`} i={i} {...item} btn={item.btn} progress={scrollYProgress} range={[i * .25, 1]} targetScale={targetScale} />
                })
            }
        </div>
    )
}