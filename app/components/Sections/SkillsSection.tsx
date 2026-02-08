"use client";

import { skills } from "@/app/data";
import SkillCard from "../UI/SkillCard";
import { useEffect, useState, useRef } from "react";

export default function SkillsSection() {
  const [isVisible, setIsVisible] = useState(false);
  const sectionRef = useRef<HTMLElement>(null);

  useEffect(() => {
    const observer = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          if (entry.isIntersecting) {
            setIsVisible(true);
          }
        });
      },
      {
        threshold: 0.1,
        rootMargin: "0px 0px -100px 0px",
      }
    );

    if (sectionRef.current) {
      observer.observe(sectionRef.current);
    }

    return () => {
      if (sectionRef.current) {
        observer.unobserve(sectionRef.current);
      }
    };
  }, []);

  return (
    <section
      ref={sectionRef}
      id="skills"
      data-section="skills"
      className={`min-h-screen py-20 px-8 scroll-mt-20 transition-opacity duration-1000 ${
        isVisible ? "opacity-100" : "opacity-0"
      }`}
    >
      <h2 className="text-5xl font-bold mb-12 text-black dark:text-white">Skills</h2>
      <div className="grid md:grid-cols-2 gap-6 max-w-4xl">
        {skills.map((skill, index) => (
          <SkillCard key={index} category={skill} />
        ))}
      </div>
    </section>
  );
}

