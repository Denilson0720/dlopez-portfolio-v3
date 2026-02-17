"use client";

import { motion, useScroll, useTransform } from "framer-motion";
import { useEffect, useState } from "react";

export default function AnimatedName() {
  const [scrollProgress, setScrollProgress] = useState(0);

  useEffect(() => {
    const handleScroll = () => {
      // Calculate scroll progress from hero section
      // Hero is 100vh, start animation when entering portfolio section
      const scrollY = window.scrollY;
      const heroHeight = window.innerHeight;
      const portfolioStart = heroHeight * 0.8;
      const animationRange = 50; // pixels over which to animate
      
      if (scrollY < portfolioStart) {
        setScrollProgress(0);
      } else {
        const progress = Math.min((scrollY - portfolioStart) / animationRange, 1);
        setScrollProgress(progress);
      }
    };

    window.addEventListener("scroll", handleScroll);
    handleScroll(); // Check initial state

    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  const x = -100 + (scrollProgress * 100); // Move from left (-100) to center (0) as scroll increases
  const scale = 0.9 + scrollProgress * 0.1; // Scale up from 0.9 to 1.0
  const opacity = 0.9 + scrollProgress * 0.1; // Fade in from 0.9 to 1.0

  const handleClick = () => {
    window.scrollTo({ top: 0, behavior: "smooth" });
  };

  return (
    <motion.div
      style={{
        x,
        scale,
        opacity,
      }}
      className="mb-12 transition-all duration-300 ease-out"
    >
      <h1 
        onClick={handleClick}
        className="text-3xl font-bold text-black dark:text-white cursor-pointer hover:opacity-80 transition-opacity"
      >
        Denilson Lopez
      </h1>
    </motion.div>
  );
}

