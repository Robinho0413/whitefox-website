'use client';

import { motion } from 'framer-motion';
import ArrowRight from '../icons/ArrowRight';

const SeeMoreButton: React.FC = () => {
  return (
    <motion.button
      className="flex items-center gap-2 text-primary underline-offset-4 underline pr-2 decoration-primary-500 group"
      whileHover="hover"
      initial="rest"
    >
      <span className="text-sm font-medium">En savoir plus</span>
      <motion.span
        className="inline-flex"
        variants={{
          rest: { x: 0 },
          hover: { x: 8 },
        }}
        transition={{ type: 'spring', stiffness: 300 }}
      >
        <ArrowRight className="group-hover:text-primary-500 duration-300" />
      </motion.span>
    </motion.button>
  );
};

export default SeeMoreButton;
