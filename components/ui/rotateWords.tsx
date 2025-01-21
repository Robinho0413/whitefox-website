"use client";

import * as React from "react";
import { AnimatePresence, motion, useScroll, useTransform } from "framer-motion";

interface RotateWordsProps {
    text: string;
    words: string[];
}

export function RotateWords({ text = "Rotate", words = ["Cheer", "Pom's"] }: RotateWordsProps) {
    const [index, setIndex] = React.useState(0);
    const { scrollY } = useScroll();
    const xWhitefox = useTransform(scrollY, [0, 900], [0, 500]);

    React.useEffect(() => {
        const interval = setInterval(() => {
            setIndex((prevIndex) => (prevIndex + 1) % words.length);
        }, 5000);
        return () => clearInterval(interval);
    }, [words.length]);

    return (
        <motion.div style={{ y: xWhitefox }}
            initial={{ opacity: 0, y: -50 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.4, ease: "easeOut" }}
            className="text-5xl sm:text-7xl lg:text-9xl text-center font-bold tracking-tighter md:leading-[4rem] w-fit flex items-center justify-center gap-1.5"
        >
            {text}{' '}
            <AnimatePresence mode="wait">
                <motion.p
                    key={words[index]}
                    initial={{ opacity: 0, y: -40 }}
                    animate={{ opacity: 1, y: 0 }}
                    exit={{ opacity: 0, y: 40 }}
                    transition={{ duration: 0.5 }}
                >
                    {words[index]}
                </motion.p>
            </AnimatePresence>
        </motion.div>
    );
}