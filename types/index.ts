export interface WorkExperience {
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
  title: string;
  description: string;
  technologies: string[];
  link?: string;
  github?: string;
}

export type Section = "about" | "work" | "projects" | "contact";

