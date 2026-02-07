"use client";

import { motion, useScroll, useTransform } from "framer-motion";
import { useEffect, useRef, useState } from "react";

export default function AnimatedName() {
  const [scrollProgress, setScrollProgress] = useState(0);
  const contentAreaRef = useRef<HTMLElement | null>(null);

  useEffect(() => {
    // Find the content area element
    const contentArea = document.querySelector('[data-content-area]') as HTMLElement;
    if (contentArea) {
      contentAreaRef.current = contentArea;

      const handleScroll = () => {
        if (contentArea) {
          const scrollTop = contentArea.scrollTop;
          const maxScroll = contentArea.scrollHeight - contentArea.clientHeight;
          const progress = Math.min(scrollTop / 500, 1); // Normalize to 0-1 over first 500px
          setScrollProgress(progress);
        }
      };

      contentArea.addEventListener('scroll', handleScroll);
      return () => contentArea.removeEventListener('scroll', handleScroll);
    }
  }, []);

  const x = scrollProgress * -100; // Move left as scroll increases
  const scale = 1 - scrollProgress * 0.1; // Slight scale down
  const opacity = 1 - scrollProgress * 0.1; // Slight fade

  return (
    <motion.div
      style={{
        x,
        scale,
        opacity,
        transition: 'transform 0.1s ease-out, opacity 0.1s ease-out, scale 0.1s ease-out'
      }}
      className="mb-12"
    >
      <h1 className="text-3xl font-bold text-white">Denilson Lopez</h1>
    </motion.div>
  );
}

