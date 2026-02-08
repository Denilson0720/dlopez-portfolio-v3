"use client";

import { WorkExperience } from "@/types";
import { useRouter } from "next/navigation";

interface WorkCardProps {
  experience: WorkExperience;
}

export default function WorkCard({ experience }: WorkCardProps) {
  const router = useRouter();

  const handleClick = () => {
    router.push(`/portfolio/work/${experience.id}`);
  };

  return (
    <div 
      onClick={handleClick}
      className="bg-gray-100 dark:bg-gray-900 border border-accent-blue/30 rounded-lg p-6 mb-6 hover:border-accent-blue/50 transition-colors cursor-pointer"
    >
      <div className="flex justify-between items-start mb-3">
        <div>
          <h3 className="text-xl font-bold text-black dark:text-white mb-1">
            {experience.title}
          </h3>
          <p className="text-gray-600 dark:text-gray-400">{experience.company}</p>
        </div>
        <span className="text-gray-500 dark:text-gray-500 text-sm">{experience.dateRange}</span>
      </div>
      <p className="text-gray-700 dark:text-gray-300 leading-relaxed">{experience.description}</p>
    </div>
  );
}

