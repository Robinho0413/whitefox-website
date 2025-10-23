import React from 'react';
import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";

export function MapCard() {
  return (
    <Card className="w-full mx-auto" style={{ boxShadow: "0 10px 25px -3px rgba(59, 165, 155, 0.1), 0 4px 6px -2px rgba(59, 165, 155, 0.05)" }}>
      <CardHeader>
        <CardTitle>Gymnase Jules Vallès</CardTitle>
        <CardDescription>Lieu d'entrainement de notre club</CardDescription>
      </CardHeader>
      <CardContent>
        <div className="w-full h-80 flex justify-center items-center">
          <iframe className='border-0 w-full h-full rounded-md' src="https://www.google.com/maps/embed?pb=!1m18!1m12!1m3!1d2813.5715454745164!2d1.5043111757834113!3d45.15527495399842!2m3!1f0!2f0!3f0!3m2!1i1024!2i768!4f13.1!3m3!1m2!1s0x47f8bd18c5e78d8b%3A0x11b75d66e9981b6f!2sGymnase%20Jules%20Vall%C3%A8s!5e0!3m2!1sfr!2sfr!4v1759239119149!5m2!1sfr!2sfr" loading="lazy"></iframe>
        </div>
      </CardContent>
    </Card>
  );
}