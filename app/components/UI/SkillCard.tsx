import { SkillCategory } from "@/types";

interface SkillCardProps {
  category: SkillCategory;
}

export default function SkillCard({ category }: SkillCardProps) {
  return (
    <div className="bg-gray-100 dark:bg-gray-900 border border-gray-300 dark:border-gray-800 rounded-lg p-6">
      <h3 className="text-xl font-semibold mb-4 text-black dark:text-white">{category.title}</h3>
      <div className="flex flex-wrap gap-2">
        {category.skills.map((skill, index) => (
          <span
            key={index}
            className="px-3 py-1 bg-gray-200 dark:bg-gray-800 text-gray-700 dark:text-gray-300 rounded-md text-sm"
          >
            {skill}
          </span>
        ))}
      </div>
    </div>
  );
}

