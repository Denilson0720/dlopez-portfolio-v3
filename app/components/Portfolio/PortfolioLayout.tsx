"use client";

import { Section } from "@/types";
import Sidebar from "./Sidebar";
import ContentArea from "./ContentArea";

export default function PortfolioLayout() {
  const handleSectionClick = (section: Section) => {
    // Scroll handled in Sidebar component
  };

  return (
    <div className="flex h-screen bg-black text-white overflow-hidden">
      <Sidebar onSectionClick={handleSectionClick} />
      <ContentArea />
    </div>
  );
}

