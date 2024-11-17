import Image from "next/image";

import { metadata } from './metadata';

export { metadata };

export default function Home() {
  return (
    <div className="relative w-full h-screen">
      <Image
        src="/images/bg-image.jpg"
        alt="Background Image"
        layout="fill"
        objectFit="cover"
        quality={100}
        className="z-0 opacity-50"
      />
      <div className="absolute inset-0 bg-primary-500 opacity-50 z-10"></div>
      <div className="absolute inset-0 flex items-center justify-center z-20">
        <h1 className="flex flex-col gap-2 items-center justify-center text-5xl font-bold text-white bg-black bg-opacity-50 p-16 rounded">
          <span className="text-3xl">Bienvenue chez</span>Whitefox Cheer
        </h1>
      </div>
    </div>
  );
}
