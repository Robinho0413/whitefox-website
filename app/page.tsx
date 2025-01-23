import { metadata } from './metadata';
export { metadata };
import HeroSection from "@/components/sections/HeroSection";
import Carousel from '@/components/sections/Carousel';
import Marquee from '@/components/sections/Marquee';
import CardsParallax from '@/components/sections/CardsParallax';

export default function Home() {
  return (
    <div>
      <HeroSection />
      <Marquee />
      <CardsParallax />
      {/* <div className="bg-background relative z-10 p-4 py-16">
        <Carousel />
      </div> */}
    </div>
  );
}
