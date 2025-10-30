'use client'

import { useScroll, useTransform, motion, MotionValue } from 'framer-motion';
import Lenis from 'lenis';
import Image from 'next/image';
import { useEffect, useRef } from 'react';
import { StaticImageData } from 'next/image';

import Picture1 from '@/public/images/bg-image.jpg';
import Picture2 from '@/public/images/bg-image.jpg';

export default function Home() {
    const container = useRef<HTMLDivElement>(null);
    const { scrollYProgress } = useScroll({
        target: container,
        offset: ['start end', 'end start'],
    });

    useEffect(() => {
        const lenis = new Lenis();

        function raf(time: number) {
            lenis.raf(time);
            requestAnimationFrame(raf);
        }

        requestAnimationFrame(raf);

        return () => {
            lenis.destroy();
        };
    }, []);

    return (
        <main className="overflow-hidden">
            <div className="h-12 md:h-32" />
            <div ref={container}>
                <Slide src={Picture1} direction="left" left="-40%" progress={scrollYProgress} text="Whitefox Cheer" />
                <Slide src={Picture2} direction="right" left="-25%" progress={scrollYProgress} text="Whitefox Pom's" />
            </div>
        </main>
    );
}

interface SlideProps {
    src: StaticImageData;
    direction: 'left' | 'right';
    left: string;
    progress: MotionValue<number>;
    text: string;
}

const Slide = ({ src, direction, left, progress, text }: SlideProps) => {
    const directionMultiplier = direction === 'left' ? -1 : 1;
    const translateX = useTransform(progress, [0, 1], [150 * directionMultiplier, -150 * directionMultiplier]);

    return (
        <motion.div style={{ x: translateX, left }} className="relative flex whitespace-nowrap">
            <Phrase src={src} text={text} />
            <Phrase src={src} text={text} />
        </motion.div>
    );
};

interface PhraseProps {
    src: StaticImageData;
    text: string;
}

const Phrase = ({ src, text }: PhraseProps) => {
    return (
        <div className="px-5 flex gap-5 items-center">
            <p className="text-[7.5vw]">{text}</p>
            <span className="relative h-[7.5vw] aspect-[4/2] rounded-full overflow-hidden">
                <Image style={{ objectFit: 'cover' }} src={src} alt="image" fill />
            </span>
        </div>
    );
};