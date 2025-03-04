"use client";

import { useState, useRef } from "react";
import { motion } from "framer-motion";
import { ChevronLeft, ChevronRight } from "lucide-react";
import { Button } from "@/components/ui/button";
import Link from "next/link";

const bubbles = [
  { id: 1, image: "/images/logo-black.png", title: "Respect" },
  { id: 2, image: "/images/logo-black.png", title: "Solidarité" },
  { id: 3, image: "/images/logo-black.png", title: "Excellence" },
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
    <div className="relative flex flex-row justify-center items-center w-full overflow-hidden mt-10">
      <div className="relative flex flex-col justify-center w-full p-16 space-y-6">
        <div className="flex flex-col space-y-1">
          <h2 className="text-3xl font-semibold">Bienvenue chez</h2>
          <h1 className="text-7xl font-bold">Whitefox</h1>
        </div>
        <p>
          Lorem ipsum dolor sit amet consectetur adipisicing elit. Voluptatem, impedit deleniti in ipsa blanditiis asperiores consequuntur dicta debitis a odio veritatis molestiae perspiciatis minus, voluptates quod commodi cum ducimus labore?
        </p>
        <Link href={'/register'} className="w-full sm:w-auto">
          <motion.div
            initial={{ opacity: 0, y: 50 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5, ease: "easeOut", delay: 0.4 }}
          >
            <Button className="text-lg font-semibold" variant={"default"} size={"lg"}>
              S'inscrire au club
            </Button>
          </motion.div>
        </Link>
      </div>
      <div
        className="relative flex justify-center items-center h-full w-full overflow-hidden"
        onTouchStart={handleTouchStart}
        onTouchMove={handleTouchMove}
        onTouchEnd={handleTouchEnd}
      >
        <button onClick={prevBubble} className="absolute left-20 p-2 rounded-full z-10">
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
                  <h2 className="text-white text-center mt-2 uppercase">{bubble.title}</h2>
                </div>
              </motion.div>
            );
          })}
        </div>
        <button onClick={nextBubble} className="absolute right-20 p-2 rounded-full z-10">
          <ChevronRight size={32} />
        </button>
      </div>
    </div>
  );
}