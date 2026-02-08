"use client";

import { useEffect } from "react";
import HeroSection from "./components/Hero/HeroSection";
import PortfolioSection from "./components/Portfolio/PortfolioSection";

export default function Home() {
  useEffect(() => {
    // Handle hash navigation when coming from detail pages
    const handleHashNavigation = () => {
      const hash = window.location.hash;
      if (hash) {
        // Wait for the page to fully load and sections to be rendered
        const scrollToSection = () => {
          const element = document.querySelector(hash);
          if (element) {
            element.scrollIntoView({ behavior: "smooth", block: "start" });
          } else {
            // If element not found yet, try again after a short delay
            setTimeout(scrollToSection, 100);
          }
        };

        // Initial attempt after a short delay to allow rendering
        setTimeout(scrollToSection, 200);
      }
    };

    // Check on mount
    handleHashNavigation();

    // Also listen for hash changes
    window.addEventListener("hashchange", handleHashNavigation);

    return () => {
      window.removeEventListener("hashchange", handleHashNavigation);
    };
  }, []);

  return (
    <main className="relative">
      <HeroSection />
      <PortfolioSection />
    </main>
  );
}
