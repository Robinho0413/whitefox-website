"use client";

import { useState, useRef } from "react";
import { motion } from "framer-motion";
import { BadgeCheck, ChevronLeft, ChevronRight, Handshake, Smile, Users } from "lucide-react";
import { Button } from "@/components/ui/button";
import Link from "next/link";

const bubbles = [
  { id: 1, title: "Honnêteté", icon: BadgeCheck },
  { id: 2, title: "Esprit d'équipe", icon: Users },
  { id: 3, title: "Respect", icon: Handshake },
  { id: 4, title: "Plaisir", icon: Smile },
];

export default function InfiniteBubbleCarousel() {
  const [index, setIndex] = useState(0);
  const touchStartX = useRef(0);
  const touchEndX = useRef(0);

  const getRelativePosition = (itemIndex: number) => {
    const total = bubbles.length;
    const rawDiff = (itemIndex - index + total) % total;

    if (rawDiff === 0) return "active";
    if (rawDiff === 1) return "right";
    if (rawDiff === total - 1) return "left";
    if (total % 2 === 0 && rawDiff === total / 2) return "back";

    return "hidden";
  };

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
          <h2 className="text-3xl font-semibold">Bienvenue chez</h2>
          <h1 className="text-4xl sm:text-7xl font-bold">Whitefox cheer & pom&apos;s</h1>
        </div>
        <p>
          Créée en 2024, l&apos;association Whitefox cheer & pom&apos;s réunit des passionnés de cheerleading et de danse pompom à Brive-la-Gaillarde. Notre association sportive est ouverte à tous dès l&apos;âge de 4 ans. Tout au long de l&apos;année, nous participons à des compétitions, des démonstrations et des animations, afin de partager notre passion et notre énergie avec le public.
        </p>
        <p>
          Chez les Whitefox cheer & pom&apos;s, nos valeurs sont: honnêteté, esprit d&apos;équipe, respect et plaisir. Nous croyons qu&apos;un bon athlète est avant tout quelqu&apos;un qui agit avec sincérité, soutient ses coéquipiers et s&apos;épanouit en s&apos;amusant. Notre objectif est de créer un environnement où chacun peut progresser, se dépasser et surtout prendre du plaisir.
        </p>
        <p>
          Le cheerleading est un sport complet qui mélange acrobaties, portés, pyramides, danse et esprit d&apos;équipe. Nous mettons un point d&apos;honneur à allier performance et esprit collectif, dans une ambiance toujours motivante et positive.
        </p>
        <p>
          La danse pompom, met l&apos;accent sur la chorégraphie, la synchronisation et l&apos;énergie. Elle se pratique sur des musiques entraînantes avec des pompoms et permet d&apos;exprimer sa créativité tout en développant le sens du rythme et la confiance en soi.
        </p>
        <p>
          Que tu sois débutant ou confirmé, l&apos;association Whitefox cheer & pom&apos;s t&apos;ouvre ses portes ! Rejoins-nous pour vivre une aventure humaine et sportive pleine d&apos;énergie, de sourires et de passion.
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
        <div className="relative flex justify-center items-center w-64 h-96">
          {bubbles.map((bubble, i) => {
            const position = getRelativePosition(i);
            const isActive = position === "active";
            const isLeft = position === "left";
            const isRight = position === "right";
            const isBack = position === "back";
            const ValueIcon = bubble.icon;

            return (
              <motion.div
                key={bubble.id}
                className="absolute w-40 h-40 rounded-full overflow-hidden flex flex-col items-center justify-center"
                style={{
                  zIndex: isActive ? 10 : isLeft || isRight ? 7 : isBack ? 4 : 0,
                  background: "radial-gradient(circle at center, rgba(47,132,124,0.98) 42%, rgba(47,132,124,0.9) 62%, rgba(47,132,124,0.72) 78%, rgba(47,132,124,0.48) 90%, rgba(47,132,124,0.26) 98%, rgba(47,132,124,0.14) 100%)",
                }}
                initial={{ opacity: 0.5, scale: 0.8 }}
                animate={{
                  opacity: isActive ? 1 : isBack ? 0.28 : 0.55,
                  scale: isActive ? 1.24 : isBack ? 0.72 : 0.92,
                  x: isActive ? 0 : isLeft ? -105 : isRight ? 105 : 0,
                  y: isActive ? 12 : isBack ? -78 : -20,
                  filter: isActive ? "brightness(1)" : isBack ? "brightness(0.6)" : "brightness(0.8)",
                  boxShadow: isActive
                    ? "0 0 24px rgba(59, 165, 155, 0.62), 0 0 72px rgba(59, 165, 155, 0.34)"
                    : isBack
                      ? "0 0 12px rgba(59, 165, 155, 0.28), 0 0 36px rgba(59, 165, 155, 0.14)"
                      : "0 0 18px rgba(59, 165, 155, 0.44), 0 0 54px rgba(59, 165, 155, 0.24)",
                }}
                transition={{ duration: 0.5 }}
              >
                <div className="flex flex-col items-center justify-center">
                  <ValueIcon className="w-14 h-14 text-white" strokeWidth={2.3} />
                  <h2 className="text-white text-center mt-2 text-sm font-semibold">{bubble.title}</h2>
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