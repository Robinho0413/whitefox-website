import Image from "next/image";
import { Button } from "@/components/ui/button"
import { metadata } from './metadata';
export { metadata };
import Carousel from '@/components/sections/Carousel';

export default function Home() {
  return (
    <div>
      <div className="relative w-full h-screen">
        <Image
          src="/images/bg-image.jpg"
          alt="Background Image"
          fill
          style={{ objectFit: 'cover' }}
          quality={100}
          className="z-0 opacity-90"
        />
        <div className="absolute inset-0 bg-black opacity-50 z-10"></div>
        <div className="absolute inset-0 flex flex-col justify-end items-start space-y-12 z-20 p-16">
          <h1 className="flex flex-col gap-1 text-8xl font-bold text-white">
            <span className="text-5xl">Bienvenue chez</span>WHITEFOX Cheer
          </h1>
          <Button className="text-lg font-semibold" variant={"outline"} size={"lg"}>En savoir plus sur notre club</Button>
        </div>
      </div>
      <div className="p-4 py-16">
        <Carousel />
      </div>
    </div>
  );
}
