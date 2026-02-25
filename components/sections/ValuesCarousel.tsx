'use client';

import { useState } from 'react';
import { AnimatePresence, motion } from 'framer-motion';

interface CarouselProps {
  data: string[];
}

const ValuesCarousel: React.FC<CarouselProps> = ({ data }) => {
  const [flowDirection, setFlowDirection] = useState(true);
  const [centerId, setCenterId] = useState(0);
  const [leftId, setLeftId] = useState(data.length - 1);
  const [rightId, setRightId] = useState(1);

  const nextBtn = () => {
    setLeftId((prev) => (prev === data.length - 1 ? 0 : prev + 1));
    setCenterId((prev) => (prev === data.length - 1 ? 0 : prev + 1));
    setRightId((prev) => (prev === data.length - 1 ? 0 : prev + 1));
    setFlowDirection(true);
  };

  const prevBtn = () => {
    setFlowDirection(false);
    setLeftId((prev) => (prev === 0 ? data.length - 1 : prev - 1));
    setCenterId((prev) => (prev === 0 ? data.length - 1 : prev - 1));
    setRightId((prev) => (prev === 0 ? data.length - 1 : prev - 1));
  };

  const variants = {
    center: {
      x: '0rem',
      opacity: 1,
      scale: 1.1,
      zIndex: 5,
      filter: 'brightness(100%)',
      backgroundImage: `url(${data[centerId]})`,
      boxShadow: '0px 0px 30px rgba(0,0,0,0.3)',
      transition: { type: 'spring' as const, duration: 1 },
    },
    left: {
      x: '-6rem',
      opacity: 1,
      filter: 'brightness(40%)',
      scale: 1,
      backgroundImage: `url(${data[leftId]})`,
      zIndex: 4,
      transition: { type: 'spring' as const, duration: 1 },
    },
    right: {
      x: '6rem',
      opacity: 1,
      filter: 'brightness(40%)',
      scale: 1,
      backgroundImage: `url(${data[rightId]})`,
      zIndex: 3,
      transition: { type: 'spring' as const, duration: 1 },
    },
  };

  return (
    <div className="relative flex flex-col items-center justify-center w-full h-[300px] overflow-hidden">
      <div className="relative flex justify-center items-center w-full h-full">
        <AnimatePresence initial={false}>
          <motion.div
            key={leftId}
            variants={variants}
            initial={flowDirection ? 'center' : 'left'}
            animate="left"
            className="absolute w-48 h-48 bg-cover bg-center rounded-lg"
          />
          <motion.div
            key={centerId}
            variants={variants}
            initial={flowDirection ? 'right' : 'left'}
            animate="center"
            className="absolute w-64 h-64 bg-cover bg-center rounded-lg"
          />
          <motion.div
            key={rightId}
            variants={variants}
            initial={flowDirection ? 'right' : 'center'}
            animate="right"
            className="absolute w-48 h-48 bg-cover bg-center rounded-lg"
          />
        </AnimatePresence>
      </div>
      <div className="mt-4 flex gap-4">
        <button onClick={prevBtn} className="px-4 py-2 bg-gray-700 text-white rounded-lg">Back</button>
        <button onClick={nextBtn} className="px-4 py-2 bg-gray-700 text-white rounded-lg">Next</button>
      </div>
    </div>
  );
};

export default ValuesCarousel;
