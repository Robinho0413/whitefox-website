"use client"

import * as React from "react"
import Image from "next/image"
import { motion } from "framer-motion"

import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card"
import SeeMoreButton from "@/components/ui/seeMoreButton";

export function SponsorsCard({ title, adresse, image, date, url, btn }: { title: string, adresse: string, image: string, date: string, url: string, btn: string }) {
  const [isHovered, setIsHovered] = React.useState(false)

  return (
    <motion.div
      className="h-full w-full"
      style={{ perspective: "1200px" }}
      onMouseEnter={() => setIsHovered(true)}
      onMouseLeave={() => setIsHovered(false)}
      onFocus={() => setIsHovered(true)}
      onBlur={() => setIsHovered(false)}
      animate={{ scale: isHovered ? 1.01 : 1 }}
      transition={{ duration: 0.3, ease: "easeOut" }}
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
          <CardHeader className="flex flex-row">
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
              <p className="text-sm text-muted-foreground">Partenaire depuis {date}</p>
              <p className="text-sm">Merci pour votre soutien 🤍</p>
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
