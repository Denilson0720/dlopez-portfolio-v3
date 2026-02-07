"use client";

import { Section } from "@/types";
import { useActiveSection } from "@/lib/hooks/useActiveSection";
import AnimatedName from "./AnimatedName";

interface SidebarProps {
  onSectionClick: (section: Section) => void;
}

const sections: { id: Section; label: string }[] = [
  { id: "about", label: "About" },
  { id: "work", label: "Work Exp." },
  { id: "projects", label: "Projects" },
  { id: "contact", label: "Contact" },
];

export default function Sidebar({ onSectionClick }: SidebarProps) {
  const activeSection = useActiveSection();

  const handleClick = (section: Section) => {
    onSectionClick(section);
    const element = document.getElementById(section);
    if (element) {
      element.scrollIntoView({ behavior: "smooth", block: "start" });
    }
  };

  return (
    <>
      {/* Desktop Sidebar */}
      <div className="hidden md:flex w-64 border-r border-gray-300 dark:border-gray-800 p-8 flex-col h-screen fixed left-0 top-0 bg-white/95 dark:bg-black/95 backdrop-blur-sm z-10">
        <AnimatedName />
        <nav className="flex flex-col gap-6">
          {sections.map((section) => (
            <button
              key={section.id}
              onClick={() => handleClick(section.id)}
              className={`text-left transition-all duration-300 ${
                activeSection === section.id
                  ? "text-black dark:text-white text-2xl font-bold"
                  : "text-gray-600 dark:text-gray-500 text-lg hover:text-gray-800 dark:hover:text-gray-300"
              }`}
            >
              {section.label}
            </button>
          ))}
        </nav>
        <div className="mt-auto mb-4">
          <div className="w-8 h-8 rounded-full bg-gray-200 dark:bg-gray-800 flex items-center justify-center border border-gray-300 dark:border-gray-700">
            <span className="text-gray-600 dark:text-gray-400 text-xs font-bold">N</span>
          </div>
        </div>
      </div>

      {/* Mobile Navigation */}
      <div className="md:hidden fixed top-0 left-0 right-0 bg-white/95 dark:bg-black/95 backdrop-blur-sm z-20 border-b border-gray-300 dark:border-gray-800 p-4">
        <div className="flex justify-between items-center">
          <h1 className="text-xl font-bold text-black dark:text-white">Denilson Lopez</h1>
          <nav className="flex gap-4">
            {sections.map((section) => (
              <button
                key={section.id}
                onClick={() => handleClick(section.id)}
                className={`text-sm transition-all ${
                  activeSection === section.id
                    ? "text-black dark:text-white font-bold"
                    : "text-gray-600 dark:text-gray-500"
                }`}
              >
                {section.label}
              </button>
            ))}
          </nav>
        </div>
      </div>
    </>
  );
}

