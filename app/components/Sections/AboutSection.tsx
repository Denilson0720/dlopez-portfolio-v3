import { aboutText, skills } from "@/app/data";
import SkillCard from "../UI/SkillCard";

export default function AboutSection() {
  return (
    <section
      id="about"
      data-section="about"
      className="min-h-screen py-20 px-8 scroll-mt-20"
    >
      <h2 className="text-5xl font-bold mb-12 text-black dark:text-white">About Me</h2>
      <div className="max-w-4xl space-y-6 mb-12">
        {aboutText.map((paragraph, index) => (
          <p key={index} className="text-gray-700 dark:text-gray-300 text-lg leading-relaxed">
            {paragraph}
          </p>
        ))}
      </div>
      <div className="grid md:grid-cols-2 gap-6 max-w-4xl">
        {skills.map((skill, index) => (
          <SkillCard key={index} category={skill} />
        ))}
      </div>
    </section>
  );
}

