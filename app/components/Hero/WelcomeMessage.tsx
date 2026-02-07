"use client";

import { motion } from "framer-motion";

export default function WelcomeMessage() {
  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.8, delay: 0.3 }}
      className="absolute bottom-20 left-12 z-20"
    >
      <h2 className="text-4xl font-bold text-white">
        Welcome <span className="inline-block animate-bounce">👋</span>
      </h2>
    </motion.div>
  );
}

