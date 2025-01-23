'use client'

import Image from 'next/image';
import { useTransform, motion, useScroll } from 'framer-motion';
import { useRef } from 'react';

interface ParallaxCardProps {
  i: number;
  title: string;
  description: string;
  src: string;
  url: string;
  color: string;
  progress: any;
  range: any;
  targetScale: number;
}

const ParallaxCard: React.FC<ParallaxCardProps> = ({ i, title, description, src, url, color, progress, range, targetScale }) => {

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
              <a className='text-[12px] underline cursor-pointer' href={url} target="_blank">See more</a>
              <svg width="22" height="12" viewBox="0 0 22 12" fill="none" xmlns="http://www.w3.org/2000/svg">
                <path d="M21.5303 6.53033C21.8232 6.23744 21.8232 5.76256 21.5303 5.46967L16.7574 0.696699C16.4645 0.403806 15.9896 0.403806 15.6967 0.696699C15.4038 0.989592 15.4038 1.46447 15.6967 1.75736L19.9393 6L15.6967 10.2426C15.4038 10.5355 15.4038 11.0104 15.6967 11.3033C15.9896 11.5962 16.4645 11.5962 16.7574 11.3033L21.5303 6.53033ZM0 6.75L21 6.75V5.25L0 5.25L0 6.75Z" fill="black" />
              </svg>
            </span>
          </div>
        </div>
      </motion.div>
    </div>
  )
}

export default ParallaxCard