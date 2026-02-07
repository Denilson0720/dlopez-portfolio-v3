"use client";

import Link from "next/link";
import ThemeToggle from "../UI/ThemeToggle";

export default function HeroNav() {
  return (
    <nav className="absolute top-8 left-8 right-8 flex justify-between items-center z-20">
      <div className="flex gap-8 text-white">
        <Link
          href="/portfolio#projects"
          className="hover:text-gray-300 transition-colors"
        >
          Projects
        </Link>
        <Link
          href="/portfolio#contact"
          className="hover:text-gray-300 transition-colors"
        >
          Contact
        </Link>
        <Link
          href="/blog"
          className="hover:text-gray-300 transition-colors"
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

