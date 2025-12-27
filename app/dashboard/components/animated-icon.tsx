"use client";

import { Icon } from "@iconify/react";
import { motion, Variants } from "framer-motion";
import { cn } from "@/lib/utils";
import { useState } from "react";

interface AnimatedIconProps {
  icon: string;
  className?: string;
  size?: number;
}

const iconVariants: Variants = {
  initial: { scale: 1, rotate: 0 },
  hover: { 
    scale: 1.2, 
    rotate: [0, -10, 10, -5, 5, 0],
    transition: { duration: 0.5, ease: "easeInOut" }
  },
  tap: { scale: 0.9 }
};

const pulseVariants: Variants = {
  initial: { scale: 1 },
  hover: {
    scale: [1, 1.1, 1],
    transition: { repeat: Infinity, duration: 1 }
  }
};

const shakeVariants: Variants = {
  initial: { x: 0 },
  hover: {
    x: [0, -2, 2, -1, 1, 0],
    transition: { duration: 0.4 }
  }
};

export const AnimatedIcon = ({ icon, className, size = 24 }: AnimatedIconProps) => {
  return (
    <motion.div
      variants={iconVariants}
      initial="initial"
      whileHover="hover"
      whileTap="tap"
      className="flex items-center justify-center"
    >
      <Icon icon={icon} width={size} height={size} className={className} />
    </motion.div>
  );
};
