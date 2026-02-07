import { workExperience } from "@/app/data";
import WorkCard from "../UI/WorkCard";

export default function WorkExperienceSection() {
  return (
    <section
      id="work"
      data-section="work"
      className="min-h-screen py-20 px-8 scroll-mt-20"
    >
      <h2 className="text-5xl font-bold mb-12 text-white">Work Experience</h2>
      <div className="max-w-4xl">
        {workExperience.map((exp, index) => (
          <WorkCard key={index} experience={exp} />
        ))}
      </div>
    </section>
  );
}

