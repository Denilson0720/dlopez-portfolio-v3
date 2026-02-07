"use client";

import { useEffect, useState } from "react";
import { Section } from "@/types";
import Sidebar from "./Sidebar";
import ContentArea from "./ContentArea";

export default function PortfolioSection() {
  const [showSidebar, setShowSidebar] = useState(false);

  useEffect(() => {
    const handleScroll = () => {
      // Show sidebar when scrolled past hero section (100vh)
      const scrollY = window.scrollY;
      const heroHeight = window.innerHeight;
      setShowSidebar(scrollY > heroHeight * 0.8);
    };

    window.addEventListener("scroll", handleScroll);
    handleScroll(); // Check initial state

    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  const handleSectionClick = (section: Section) => {
    // Scroll handled in Sidebar component
  };

  return (
    <div className="relative min-h-screen bg-black text-white">
      {/* Sidebar - appears when scrolling past hero */}
      <div
        className={`transition-opacity duration-500 ${
          showSidebar ? "opacity-100" : "opacity-0 pointer-events-none"
        }`}
      >
        <Sidebar onSectionClick={handleSectionClick} />
      </div>
      
      {/* Content Area */}
      <ContentArea showSidebar={showSidebar} />
    </div>
  );
}

