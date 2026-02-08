"use client";

import { Project } from "@/types";
import { useRouter } from "next/navigation";

interface ProjectCardProps {
  project: Project;
}

export default function ProjectCard({ project }: ProjectCardProps) {
  const router = useRouter();

  const handleClick = () => {
    router.push(`/portfolio/projects/${project.id}`);
  };

  return (
    <div 
      onClick={handleClick}
      className="bg-gray-100 dark:bg-gray-900 border border-accent-blue/30 rounded-lg p-6 mb-6 hover:border-accent-blue/50 transition-colors cursor-pointer"
    >
      <h3 className="text-xl font-bold text-black dark:text-white mb-2">
        {project.title}
      </h3>
      <p className="text-gray-700 dark:text-gray-300 leading-relaxed mb-4">
        {project.description}
      </p>
      <div className="flex flex-wrap gap-2">
        {project.technologies.map((tech, index) => (
          <span
            key={index}
            className="px-3 py-1 bg-gray-200 dark:bg-gray-800 text-gray-700 dark:text-gray-300 rounded-md text-sm"
          >
            {tech}
          </span>
        ))}
      </div>
    </div>
  );
}

