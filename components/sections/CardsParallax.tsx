"use client";

import ParallaxCard from "../card/parallaxCard";
import { useScroll } from 'framer-motion';
import { useRef } from 'react';

type NewsItem = {
    id: string;
    title: string | null;
    description: string | null;
    image_url: string | null;
    link_url: string | null;
    button_text: string | null;
};

export default function CardsParallax({ news }: { news: NewsItem[] }) {
    const container = useRef<HTMLDivElement | null>(null);
    const { scrollYProgress } = useScroll({
        target: container,
        offset: ['start start', 'end end']
    })

    return (
        <div className="bg-background relative z-10 p-4 md:py-16" ref={container}>
            <h1 className="absolute top-8 md:top-16 left-1/2 transform -translate-x-1/2 text-3xl md:text-5xl font-bold z-20">Actualités</h1>
            {!news.length && (
                <div className="mt-20 rounded-lg border border-secondary/60 bg-secondary/40 px-4 py-6 text-muted-foreground">
                    Aucune actualité disponible.
                </div>
            )}
            {news.length > 0 &&
                news.map((item, i) => {
                    const targetScale = 1 - ((news.length - i) * 0.05);
                    return (
                        <ParallaxCard
                            key={item.id}
                            i={i}
                            title={item.title ?? "Sans titre"}
                            description={item.description ?? ""}
                            image_url={item.image_url ?? ""}
                            link_url={item.link_url ?? "#"}
                            button_text={item.button_text ?? "En savoir plus"}
                            progress={scrollYProgress}
                            range={[i * .25, 1]}
                            targetScale={targetScale}
                        />
                    )
                })
            }
        </div>
    )
}