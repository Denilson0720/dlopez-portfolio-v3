import { projects } from "@/app/data";
import ProjectCard from "../UI/ProjectCard";

export default function ProjectsSection() {
  return (
    <section
      id="projects"
      data-section="projects"
      className="min-h-screen py-20 px-8 scroll-mt-20"
    >
      <h2 className="text-5xl font-bold mb-12 text-black dark:text-white">Projects</h2>
      <div className="max-w-4xl">
        {projects.map((project) => (
          <ProjectCard key={project.id} project={project} />
        ))}
      </div>
    </section>
  );
}

