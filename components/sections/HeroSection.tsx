"use client";

import Image from "next/image";
import { Button } from "@/components/ui/button";
import Link from "next/link";
import { motion, useScroll, useTransform } from "framer-motion";
import { RotateWords } from "../ui/rotateWords";

export default function HeroSection() {
    const { scrollY } = useScroll();
    const y = useTransform(scrollY, [0, 700], [0, 250]);
    const scale = useTransform(scrollY, [0, 700], [1, 1.05]);
    const buttonY = useTransform(scrollY, [0, 300], [0, 120]);

    return (
        <div className="relative w-full h-screen overflow-hidden">
            <motion.div style={{ y, scale }} className="absolute w-full h-full z-0">
                <Image
                    src="/images/bg-image.jpg"
                    alt="Background Image"
                    fill
                    style={{ objectFit: "cover" }}
                    quality={100}
                    className="z-0 opacity-90"
                />
            </motion.div>
            <div className="absolute inset-0 bg-black opacity-50 z-10"></div>
            <div className="absolute inset-0 flex flex-col justify-end items-start space-y-24 z-20 p-4 sm:p-16">
                <h1 className="flex flex-col gap-1 font-bold text-white">
                    <RotateWords text="Whitefox" words={["Cheer", "Pom's"]} />
                </h1>
                <Link href={'/club'} className="w-full sm:w-auto">
                    <motion.div
                        initial={{ opacity: 0, y: 50 }}
                        animate={{ opacity: 1, y: 0 }}
                        style={{ y: buttonY }}
                        transition={{ duration: 0.8, ease: "easeOut", delay: 0.5 }}
                    >
                        <Button className="w-full text-lg font-semibold" variant={"outline"} size={"lg"}>
                            En savoir plus sur notre club
                        </Button>
                    </motion.div>
                </Link>
            </div>
        </div>
    );
}
