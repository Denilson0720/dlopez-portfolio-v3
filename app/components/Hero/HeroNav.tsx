"use client";

import Link from "next/link";
import ThemeToggle from "../UI/ThemeToggle";

export default function HeroNav() {
  const scrollToSection = (sectionId: string) => {
    const element = document.getElementById(sectionId);
    if (element) {
      element.scrollIntoView({ behavior: "smooth", block: "start" });
    }
  };

  return (
    <nav className="absolute top-8 left-8 right-8 flex justify-between items-center z-20">
      <div className="flex gap-8 text-white">
        <button
          onClick={() => scrollToSection("projects")}
          className="hover:text-gray-300 dark:hover:text-gray-300 transition-colors"
        >
          Projects
        </button>
        <button
          onClick={() => scrollToSection("contact")}
          className="hover:text-gray-300 dark:hover:text-gray-300 transition-colors"
        >
          Contact
        </button>
        <Link
          href="/blog"
          className="hover:text-gray-300 dark:hover:text-gray-300 transition-colors"
        >
          Blog
        </Link>
      </div>
      <div className="absolute right-8">
        <ThemeToggle />
      </div>
    </nav>
  );
}

