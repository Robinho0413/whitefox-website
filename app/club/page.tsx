"use client";

import { useState, useRef } from "react";
import { motion } from "framer-motion";
import { ChevronLeft, ChevronRight } from "lucide-react";
import { Button } from "@/components/ui/button";
import Link from "next/link";

const bubbles = [
  { id: 1, image: "/images/solidarite.png", title: "Honnêteté" },
  { id: 2, image: "/images/solidarite.png", title: "Esprit d'équipe" },
  { id: 3, image: "/images/solidarite.png", title: "Respect" },
  { id: 4, image: "/images/solidarite.png", title: "Plaisir" },
];

export default function InfiniteBubbleCarousel() {
  const [index, setIndex] = useState(0);
  const touchStartX = useRef(0);
  const touchEndX = useRef(0);

  const nextBubble = () => {
    setIndex((prev) => (prev + 1) % bubbles.length);
  };

  const prevBubble = () => {
    setIndex((prev) => (prev - 1 + bubbles.length) % bubbles.length);
  };

  const handleTouchStart = (e: React.TouchEvent) => {
    touchStartX.current = e.touches[0].clientX;
  };

  const handleTouchMove = (e: React.TouchEvent) => {
    touchEndX.current = e.touches[0].clientX;
  };

  const handleTouchEnd = () => {
    if (touchStartX.current - touchEndX.current > 50) {
      nextBubble();
    } else if (touchEndX.current - touchStartX.current > 50) {
      prevBubble();
    }
  };

  return (
    <div className="relative flex flex-col lg:flex-row justify-center items-center w-full overflow-hidden mt-10 px-4 py-12 md:p-16 space-y-10">
      <div className="relative flex flex-col justify-center w-full space-y-6">
        <div className="flex flex-col space-y-1">
          <h2 className="text-3xl font-semibold">Bienvenue chez les</h2>
          <h1 className="text-7xl font-bold">Whitefox</h1>
        </div>
        <p>
          Créée en 2024, l'association WHITEFOX réunit des passionnés de cheerleading et de danse pompom à Brive-la-Gaillarde. Notre association sportive est ouverte à tous des l'âge de 4 ans. Tout au long de l'année, nous participons à des compétitions, des démonstrations et des animations, afin de partager notre passion et notre énergie avec le public.
        </p>
        <p>
          Chez les WHITEFOX, nos valeurs sont: honnêteté, esprit d'équipe, respect et plaisir. Nous croyons qu'un bon athlète est avant tout quelqu'un qui agit avec sincérité, soutient ses coéquipiers et s'épanouit en s'amusant. Notre objectif est de créer un environnement où chacun peut progresser, se dépasser et surtout prendre du plaisir.
        </p>
        <p>
          Le cheerleading est un sport complet qui mélange acrobaties, portés, pyramides, danse et esprit d'équipe. Nous mettons un point d'honneur à allier performance et esprit collectif, dans une ambiance toujours motivante et positive.
        </p>
        <p>
          La danse pompom, met l'accent sur la chorégraphie, la synchronisation et l'énergie. Elle se pratique sur des musiques entraînantes avec des pompoms et permet d'exprimer sa créativité tout en développant le sens du rythme et la confiance en soi.
        </p>
        <p>
          Que tu sois débutant ou confirmé, l'association WHITEFOX t'ouvre ses portes ! Rejoins-nous pour vivre une aventure humaine et sportive pleine d'énergie, de sourires et de passion.
        </p>
        <Link href={'/inscription'} className="w-full sm:w-fit">
          <motion.div
            initial={{ opacity: 0, y: 50 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5, ease: "easeOut", delay: 0.4 }}
          >
            <Button className="text-lg font-semibold w-full sm:w-auto" variant={"default"} size={"lg"}>
              Nous rejoindre !
            </Button>
          </motion.div>
        </Link>
      </div>
      <div
        className="relative flex justify-center items-center h-full w-full overflow-hidden sm:hover:scale-105 transition-transform duration-300"
        onTouchStart={handleTouchStart}
        onTouchMove={handleTouchMove}
        onTouchEnd={handleTouchEnd}
      >
        <button onClick={prevBubble} className="absolute left-0 sm:left-20 p-2 rounded-full z-20">
          <ChevronLeft size={32} />
        </button>
        <div className="relative flex justify-center items-center w-64 h-64">
          {bubbles.map((bubble, i) => {
            const isActive = i === index;
            const isLeft = i === (index - 1 + bubbles.length) % bubbles.length;
            const isRight = i === (index + 1) % bubbles.length;

            return (
              <motion.div
                key={bubble.id}
                className="absolute w-40 h-40 rounded-full bg-neutral-800 overflow-hidden flex flex-col items-center justify-center"
                style={{
                  zIndex: isActive ? 10 : isLeft || isRight ? 5 : 0,
                }}
                initial={{ opacity: 0.5, scale: 0.8 }}
                animate={{
                  opacity: isActive ? 1 : 0.3,
                  scale: isActive ? 1.2 : 1,
                  x: isActive ? 0 : isLeft ? -50 : isRight ? 50 : 0,
                }}
                transition={{ duration: 0.5 }}
              >
                <div className="flex flex-col items-center justify-center">
                  <img src={bubble.image} alt="Bubble" className="w-20 h-20 object-cover rounded-full" />
                  <h2 className="text-white text-center mt-2">{bubble.title}</h2>
                </div>
              </motion.div>
            );
          })}
        </div>
        <button onClick={nextBubble} className="absolute right-0 sm:right-20 p-2 rounded-full z-10">
          <ChevronRight size={32} />
        </button>
      </div>
    </div>
  );
}