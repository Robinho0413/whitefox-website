"use client";

import Image from "next/image";
import Link from "next/link";
import { motion, useReducedMotion } from "framer-motion";

type Album = {
  id: string;
  title: string;
  description: string;
  cover_image: string;
  photoCount: number;
};

type AnimatedAlbumsGridProps = {
  albums: Album[];
};

export default function AnimatedAlbumsGrid({ albums }: AnimatedAlbumsGridProps) {
  const shouldReduceMotion = useReducedMotion();

  return (
    <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
      {albums.map((album, index) => (
        <motion.div
          key={album.id}
          initial={shouldReduceMotion ? false : { opacity: 0, y: 24 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true, amount: 0.2 }}
          transition={{
            opacity: { duration: 0.45, ease: "easeOut", delay: shouldReduceMotion ? 0 : index * 0.08 },
            y: { duration: 0.45, ease: [0.22, 1, 0.36, 1], delay: shouldReduceMotion ? 0 : index * 0.08 },
          }}
        >
          <Link
            href={`/gallery/${album.id}`}
            className="block"
            style={{ boxShadow: "0 10px 25px -3px rgba(59, 165, 155, 0.1), 0 4px 6px -2px rgba(59, 165, 155, 0.05)" }}
          >
            <div className="relative aspect-[4/3] overflow-hidden rounded-lg cursor-pointer group shadow-lg hover:shadow-xl transition-shadow duration-300">
              <Image
                src={album.cover_image}
                alt={album.title}
                fill
                style={{ objectFit: "cover" }}
                className="brightness-75 group-hover:brightness-90 transition-brightness duration-300"
              />
              <div className="absolute inset-0 bg-gradient-to-t from-black/70 via-transparent to-transparent"></div>
              <div className="absolute bottom-0 left-0 text-white bg-black/30 backdrop-blur-sm w-full p-2">
                <h3 className="text-xl font-semibold mb-1">{album.title}</h3>
                <p className="text-sm opacity-90">
                  {album.photoCount} {album.photoCount > 1 ? "photos" : "photo"}
                </p>
                <p className="text-sm opacity-75 mt-1 line-clamp-2">{album.description}</p>
              </div>
              <div
                className="absolute inset-0 pointer-events-none rounded-lg"
                style={{ boxShadow: "inset 0 0 0 1px rgba(255, 255, 255, 0.1)" }}
              ></div>
            </div>
          </Link>
        </motion.div>
      ))}
    </div>
  );
}