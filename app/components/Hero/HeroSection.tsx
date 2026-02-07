"use client";

import { motion } from "framer-motion";
import Link from "next/link";
import HeroNav from "./HeroNav";
import WelcomeMessage from "./WelcomeMessage";

export default function HeroSection() {
  return (
    <div className="relative h-screen w-full overflow-hidden">
      {/* Background Image */}
      <div
        className="absolute inset-0 bg-cover bg-center bg-fixed"
        style={{
          backgroundImage: "url('/images/interim_light_background2.JPG')",
        }}
      >
        <div className="absolute inset-0 bg-black/40" />
      </div>

      {/* Navigation */}
      <HeroNav />

      {/* Centered Name */}
      <motion.div
        initial={{ opacity: 0, y: -20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.8 }}
        className="absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 z-20"
      >
        <h1 className="text-6xl md:text-8xl font-bold text-white text-center">
          Denilson Lopez
        </h1>
      </motion.div>

      {/* Welcome Message */}
      <WelcomeMessage />

      {/* Compass Indicator */}
      <div className="absolute bottom-4 left-4 z-20">
        <div className="w-8 h-8 rounded-full bg-black/50 flex items-center justify-center border border-white/20">
          <span className="text-white text-xs font-bold">N</span>
        </div>
      </div>

      {/* Scroll Down Indicator */}
      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ delay: 1, repeat: Infinity, repeatType: "reverse" }}
        className="absolute bottom-8 right-8 z-20"
      >
        <button
          onClick={() => {
            const portfolioSection = document.getElementById("about");
            if (portfolioSection) {
              portfolioSection.scrollIntoView({ behavior: "smooth", block: "start" });
            }
          }}
          className="flex flex-col items-center text-white hover:text-gray-300 transition-colors cursor-pointer"
        >
          <span className="text-sm mb-2">Explore</span>
          <svg
            xmlns="http://www.w3.org/2000/svg"
            fill="none"
            viewBox="0 0 24 24"
            strokeWidth={2}
            stroke="currentColor"
            className="w-6 h-6 animate-bounce"
          >
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              d="M19.5 13.5L12 21m0 0l-7.5-7.5M12 21V3"
            />
          </svg>
        </button>
      </motion.div>
    </div>
  );
}

