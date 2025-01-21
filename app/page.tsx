import Image from "next/image";
import { Button } from "@/components/ui/button"
import Link from 'next/link';
import { metadata } from './metadata';
export { metadata };
import HeroSection from "@/components/sections/HeroSection";
import Carousel from '@/components/sections/Carousel';

export default function Home() {
  return (
    <div>
      <HeroSection />
      <div className="bg-background relative z-10 p-4 py-16">
        <Carousel />
      </div>
      <div className="bg-background relative z-10 p-4 py-16">
        <Carousel />
      </div>
    </div>
  );
}
