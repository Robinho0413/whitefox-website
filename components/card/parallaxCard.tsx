'use client'

import Image from 'next/image';
import { useTransform, motion, useScroll } from 'framer-motion';
import { useRef } from 'react';
import SeeMoreButton from '../ui/seeMoreButton';

interface ParallaxCardProps {
  i: number;
  title: string;
  description: string;
  src: string;
  url: string;
  progress: any;
  range: any;
  targetScale: number;
}

const ParallaxCard: React.FC<ParallaxCardProps> = ({ i, title, description, src, url, progress, range, targetScale }) => {

  const container = useRef(null);
  const { scrollYProgress } = useScroll({
    target: container,
    offset: ['start end', 'start start']
  })

  const imageScale = useTransform(scrollYProgress, [0, 1], [2, 1])
  const scale = useTransform(progress, range, [1, targetScale]);

  return (
    <div ref={container} className='h-screen flex items-center justify-center sticky top-0'>
      <motion.div
        style={{ scale, top: `calc(-5vh + ${i * 25}px)` }}
        className='flex flex-col relative top-[-25%] h-[500px] w-[1000px] rounded-lg p-4 md:p-[50px] transform-origin-top bg-card border-2 text-card-foreground shadow-sm'
      >
        <div className='flex flex-col md:flex-row-reverse h-full gap-4 md:gap-[50px]'>
          <div className='relative w-full md:w-[60%] h-52 md:h-full rounded-lg overflow-hidden border border-primary-500'>
            <motion.div
              className='w-full h-full'
              style={{ scale: imageScale }}
            >
              <Image
                fill
                src={`/images/${src}`}
                alt="image"
                objectFit='cover'
              />
            </motion.div>
          </div>

          <div className='md:w-[40%] relative md:top-[10%] flex flex-col gap-4'>
            <h2 className='m-0 text-[28px]'>{title}</h2>
            <p className='text-[16px] line-clamp-5'>{description}</p>
            <span className='flex items-center gap-[5px]'>
            {/* <a
                href={url}
                target="_blank"
                className="flex items-center gap-2 cursor-pointer group"
              >
                <Button className="text-sm" variant="link" size="sm">
                  En savoir plus
                </Button>
                <ArrowRight
                  className="text-current transform transition-transform duration-300 ease-in-out group-hover:translate-x-2"
                />
              </a> */}
              <a
                href={url}
                target="_blank"
              >
                <SeeMoreButton />
              </a>
            </span>
          </div>
        </div>
      </motion.div>
    </div>
  )
}

export default ParallaxCard