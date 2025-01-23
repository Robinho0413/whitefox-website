import { metadata } from './metadata';
export { metadata };
import HeroSection from "@/components/sections/HeroSection";
import Marquee from '@/components/sections/Marquee';
import CardsParallax from '@/components/sections/CardsParallax';

export default function Home() {
  return (
    <div>
      <HeroSection />
      <Marquee />
      <CardsParallax />
    </div>
  );
}
