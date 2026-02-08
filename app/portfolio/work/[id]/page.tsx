"use client";

import { workExperience } from "@/app/data";
import { notFound } from "next/navigation";
import Link from "next/link";

export default function WorkExperiencePage({ params }: { params: { id: string } }) {
  const { id } = params;
  const experience = workExperience.find((exp) => exp.id === id);

  if (!experience) {
    notFound();
  }

  return (
    <div className="min-h-screen bg-white dark:bg-black py-20 px-8">
      <div className="max-w-4xl mx-auto">
        <Link
          href="/"
          className="text-accent-blue hover:underline mb-8 inline-block"
        >
          ← Back to Portfolio
        </Link>
        
        <div className="bg-gray-100 dark:bg-gray-900 border border-accent-blue/30 rounded-lg p-8">
          <div className="flex justify-between items-start mb-6">
            <div>
              <h1 className="text-4xl font-bold text-black dark:text-white mb-2">
                {experience.title}
              </h1>
              <p className="text-2xl text-gray-600 dark:text-gray-400">{experience.company}</p>
            </div>
            <span className="text-gray-500 dark:text-gray-500">{experience.dateRange}</span>
          </div>
          
          <div className="prose prose-lg dark:prose-invert max-w-none">
            <p className="text-gray-700 dark:text-gray-300 leading-relaxed text-lg">
              {experience.description}
            </p>
            
            {/* Placeholder content for development */}
            <div className="mt-8 pt-8 border-t border-gray-300 dark:border-gray-800">
              <h2 className="text-2xl font-bold text-black dark:text-white mb-4">Details</h2>
              <p className="text-gray-600 dark:text-gray-400">
                Additional details about this work experience will be displayed here.
                This is placeholder content for development purposes.
              </p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

