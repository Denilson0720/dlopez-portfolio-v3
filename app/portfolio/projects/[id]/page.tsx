"use client";

import { projects } from "@/app/data";
import { notFound } from "next/navigation";
import Link from "next/link";

export default function ProjectPage({ params }: { params: { id: string } }) {
  const { id } = params;
  const project = projects.find((proj) => proj.id === id);

  if (!project) {
    notFound();
  }

  return (
    <div className="min-h-screen bg-white dark:bg-black py-20 px-8">
      <div className="max-w-4xl mx-auto">
        <Link
          href="/#projects"
          className="text-accent-blue hover:underline mb-8 inline-block"
        >
          ← Back to Portfolio
        </Link>
        
        <div className="bg-gray-100 dark:bg-gray-900 border border-accent-blue/30 rounded-lg p-8">
          <h1 className="text-4xl font-bold text-black dark:text-white mb-4">
            {project.title}
          </h1>
          
          <div className="prose prose-lg dark:prose-invert max-w-none">
            <p className="text-gray-700 dark:text-gray-300 leading-relaxed text-lg mb-6">
              {project.description}
            </p>
            
            <div className="mb-6">
              <h2 className="text-2xl font-bold text-black dark:text-white mb-4">Technologies</h2>
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

            {(project.link || project.github) && (
              <div className="mb-6">
                <h2 className="text-2xl font-bold text-black dark:text-white mb-4">Links</h2>
                <div className="flex gap-4">
                  {project.link && (
                    <a
                      href={project.link}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="text-accent-blue hover:underline"
                    >
                      Live Demo →
                    </a>
                  )}
                  {project.github && (
                    <a
                      href={project.github}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="text-accent-blue hover:underline"
                    >
                      GitHub →
                    </a>
                  )}
                </div>
              </div>
            )}
            
            {/* Placeholder content for development */}
            <div className="mt-8 pt-8 border-t border-gray-300 dark:border-gray-800">
              <h2 className="text-2xl font-bold text-black dark:text-white mb-4">Project Details</h2>
              <p className="text-gray-600 dark:text-gray-400">
                Additional details about this project will be displayed here.
                This is placeholder content for development purposes.
              </p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

