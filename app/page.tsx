import { metadata } from './metadata';
export { metadata };
import HeroSection from "@/components/sections/HeroSection";
import Marquee from '@/components/sections/Marquee';
import CardsParallax from '@/components/sections/CardsParallax';
import { createClient } from '@/lib/supabase/server';

type NewsItem = {
  id: string;
  title: string | null;
  description: string | null;
  image_url: string | null;
  link_url: string | null;
  button_text: string | null;
  created_at: string | null;
};

export default async function Home() {
  const supabase = await createClient();

  const { data: newsData } = await supabase
    .from("news")
    .select("id, title, description, image_url, link_url, button_text, created_at")
    .order("created_at", { ascending: false });

  const news: NewsItem[] = (newsData ?? []) as NewsItem[];

  return (
    <div>
      <HeroSection />
      <Marquee />
      <CardsParallax news={news} />
    </div>
  );
}
