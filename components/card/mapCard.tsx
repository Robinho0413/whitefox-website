import React from 'react';
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";

export function MapCard() {
  return (
    <Card className="w-full mx-auto">
      <CardHeader>
        <CardTitle>Localisation</CardTitle>
        <CardDescription>Adresse du lieu d&apos;entrainement de notre club</CardDescription>
      </CardHeader>
      <CardContent>
        <div className="w-full h-80 bg-gray-300 flex justify-center items-center">
          <p>Carte Google Maps (Simulation)</p>
        </div>
      </CardContent>
    </Card>
  );
}