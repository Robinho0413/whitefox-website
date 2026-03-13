"use client"

import * as React from "react"
import Image from "next/image"
import { motion, useReducedMotion } from "framer-motion"

import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card"
import SeeMoreButton from "@/components/ui/seeMoreButton";

export function SponsorsCard({ title, adresse, description, image, url, btn, index = 0 }: { title: string, adresse: string, description: string, image: string, url: string, btn: string, index?: number }) {
  const [isHovered, setIsHovered] = React.useState(false)
  const shouldReduceMotion = useReducedMotion()

  const entryAnimation = shouldReduceMotion
    ? { opacity: 1, y: 0 }
    : { opacity: 1, y: 0 }

  return (
    <motion.div
      className="h-full w-full"
      style={{ perspective: "1200px" }}
      onMouseEnter={() => setIsHovered(true)}
      onMouseLeave={() => setIsHovered(false)}
      onFocus={() => setIsHovered(true)}
      onBlur={() => setIsHovered(false)}
      initial={shouldReduceMotion ? false : { opacity: 0, y: 24 }}
      whileInView={entryAnimation}
      viewport={{ once: true, amount: 0.2 }}
      transition={{
        opacity: { duration: 0.45, ease: "easeOut", delay: shouldReduceMotion ? 0 : index * 0.08 },
        y: { duration: 0.45, ease: [0.22, 1, 0.36, 1], delay: shouldReduceMotion ? 0 : index * 0.08 },
        scale: { duration: 0.3, ease: "easeOut" }
      }}
      animate={{ scale: isHovered ? 1.01 : 1 }}
      tabIndex={0}
    >
      <motion.div
        className="relative h-full w-full"
        style={{ transformStyle: "preserve-3d" }}
        animate={{ rotateY: isHovered ? 180 : 0 }}
        transition={{ duration: 0.7, ease: [0.22, 1, 0.36, 1] }}
      >
        <Card
          className="h-full w-full"
          style={{
            boxShadow: "0 10px 25px -3px rgba(59, 165, 155, 0.1), 0 4px 6px -2px rgba(59, 165, 155, 0.05)",
            backfaceVisibility: "hidden",
          }}
        >
          <CardHeader className="flex flex-row gap-2">
            <div className="flex flex-col w-full justify-center gap-2">
              <CardTitle>{title}</CardTitle>
              <CardDescription>{adresse}</CardDescription>
            </div>
            <div className="relative w-full aspect-square rounded-md overflow-hidden">
              <Image
                src={image}
                alt="Bow aux couleurs du club"
                fill
                style={{ objectFit: "cover" }}
                className="rounded-md"
              />
            </div>
          </CardHeader>
        </Card>

        <Card
          className="absolute inset-0 h-full w-full flex flex-col"
          style={{
            boxShadow: "0 10px 25px -3px rgba(59, 165, 155, 0.1), 0 4px 6px -2px rgba(59, 165, 155, 0.05)",
            transform: "rotateY(180deg)",
            backfaceVisibility: "hidden",
          }}
        >
          <CardHeader>
            <CardTitle>{title}</CardTitle>
            <CardDescription>{adresse}</CardDescription>
          </CardHeader>
          <CardContent className="flex-1 flex flex-col justify-between">
            <div>
              <p className="text-sm text-muted-foreground">Merci pour votre soutien 🤍</p>
              <p className="text-sm">{description}</p>
            </div>
            <div className="flex justify-end">
              <a
                href={url}
                target="_blank"
              >
                <SeeMoreButton btn={btn} />
              </a>
            </div>
          </CardContent>
        </Card>
      </motion.div>
    </motion.div>
  )
}
