import * as React from "react"

import Image from "next/image"
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card"

interface Cat1CardProps {
  title: string;
  ageRange: string;
  horaires: string;
}

export function CategoryCard({ title, ageRange, horaires }: Cat1CardProps) {
  return (
    <Card 
      className="md:w-[350px]" 
      style={{ boxShadow: "0 10px 25px -3px rgba(59, 165, 155, 0.1), 0 4px 6px -2px rgba(59, 165, 155, 0.05)" }}
    >
      <CardHeader>
        <CardTitle>{title}</CardTitle>
        <CardDescription>{ageRange}</CardDescription>
      </CardHeader>
      <CardContent>
        <div className="grid w-full items-center gap-8">
          <div className="flex gap-2 items-baseline">
            <span className="text-5xl font-semibold">110€</span>
            <span>/ Licence</span>
          </div>
          <div className="space-y-2 text-md text-muted-foreground">
            <div className="flex items-center gap-2">
              <svg className="w-5 h-5 text-primary-500" fill="currentColor" viewBox="0 0 20 20">
                <path fillRule="evenodd" d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z" clipRule="evenodd"/>
              </svg>
              <p>Entraînements 1/semaine (samedi)</p>
            </div>
            <div className="flex items-center gap-2">
              <svg className="w-5 h-5 text-primary-500" fill="currentColor" viewBox="0 0 20 20">
                <path fillRule="evenodd" d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z" clipRule="evenodd"/>
              </svg>
              <p>En compétition + animation</p>
            </div>
            <div className="flex items-center gap-2">
              <svg className="w-5 h-5 text-primary-500" fill="currentColor" viewBox="0 0 20 20">
                <path fillRule="evenodd" d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z" clipRule="evenodd"/>
              </svg>
              <p>{horaires}</p>
            </div>
          </div>

          <span className="w-0 h-0.5 bg-primary-500 animate-underline opacity-80"></span>
          <div className="space-y-3">
            <p className="text-sm text-muted-foreground">Optionnel</p>
            <div className="flex gap-1 items-center">
              <svg className="w-6 h-6 text-primary-500" fill="currentColor" viewBox="0 0 20 20">
                <path fillRule="evenodd" d="M10 3a1 1 0 011 1v5h5a1 1 0 110 2h-5v5a1 1 0 11-2 0v-5H4a1 1 0 110-2h5V4a1 1 0 011-1z" clipRule="evenodd"/>
              </svg>
              <div className="flex gap-2 items-baseline">
                <span className="text-4xl font-semibold">25€</span>
                <span>/ Bow aux couleurs du club</span>
              </div>
            </div>
            <div className="relative w-full aspect-video rounded-md overflow-hidden">
              <Image 
                src="/images/bg-image.jpg" 
                alt="Bow aux couleurs du club" 
                fill
                style={{ objectFit: "cover" }}
                className="rounded-md"
              />
            </div>
          </div>
        </div>
      </CardContent>
    </Card>
  )
}
