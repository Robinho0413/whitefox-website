"use client";

import { motion, useReducedMotion, type Variants } from "framer-motion";

import { CategoryCard } from "@/components/card/CategoryCard";

const categories = [
  {
    title: "Chouchou",
    ageRange: "5-8 ans",
    horaires: "Entraînements de 11h00 à 13h00",
  },
  {
    title: "Minigaill",
    ageRange: "9-16 ans",
    horaires: "Entraînements de 11h00 à 13h00",
  },
  {
    title: "Gaillard",
    ageRange: "16 ans et +",
    horaires: "Entraînements de 9h00 à 11h00",
  },
];

export default function AnimatedCategoryCards() {
  const shouldReduceMotion = useReducedMotion();

  const containerVariants: Variants = {
    hidden: { opacity: 0 },
    visible: {
      opacity: 1,
      transition: {
        delayChildren: 0.1,
        staggerChildren: 0.12,
      },
    },
  };

  const cardVariants: Variants = {
    hidden: {
      opacity: 0,
      y: shouldReduceMotion ? 0 : 24,
      scale: shouldReduceMotion ? 1 : 0.98,
    },
    visible: {
      opacity: 1,
      y: 0,
      scale: 1,
      transition: {
        duration: 0.55,
        ease: [0.22, 1, 0.36, 1] as [number, number, number, number],
      },
    },
  };

  return (
    <motion.div
      className="flex gap-8 mb-16 justify-center flex-wrap"
      variants={containerVariants}
      initial="hidden"
      whileInView="visible"
      viewport={{ once: true, amount: 0.2 }}
    >
      {categories.map((category) => (
        <motion.div key={category.title} variants={cardVariants}>
          <CategoryCard
            title={category.title}
            ageRange={category.ageRange}
            horaires={category.horaires}
          />
        </motion.div>
      ))}
    </motion.div>
  );
}