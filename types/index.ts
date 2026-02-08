export interface WorkExperience {
  id: string;
  title: string;
  company: string;
  dateRange: string;
  description: string;
}

export interface SkillCategory {
  title: string;
  skills: string[];
}

export interface Project {
  id: string;
  title: string;
  description: string;
  technologies: string[];
  link?: string;
  github?: string;
}

export type Section = "about" | "skills" | "work" | "projects" | "contact";

