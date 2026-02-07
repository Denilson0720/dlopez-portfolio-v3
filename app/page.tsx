"use client";

import HeroSection from "./components/Hero/HeroSection";
import PortfolioSection from "./components/Portfolio/PortfolioSection";

export default function Home() {
  return (
    <main className="relative">
      <HeroSection />
      <PortfolioSection />
    </main>
  );
}
