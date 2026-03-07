import { WorkExperience, SkillCategory, Project } from "@/types";

export const workExperience: WorkExperience[] = [
  {
    id: "trust-and-will",
    title: "Software Engineer – Full Stack (Professionals Expansion)",
    company: "Trust & Will (Remote)",
    dateRange: "Jun 2025 – Present",
    description:
      "Driving the Professionals Direct-to-Attorney (D2A) MVP delivery alongside engineering leadership, leading technical implementation of the attorney dashboard and client lifecycle management. Engineered a multi-tier SaaS subscription system (Essentials, Premium, Enterprise) with Stripe-based billing and real-time feature gating. Architected a GDPR-compliant donor data unanonymization system with tiered privacy access controls across 15+ database tables. Resolved critical N+1 query bottlenecks for high-profile partners, reducing page load times from 8s to under 1s. Managed phased rollouts via LaunchDarkly across 12 frontend routes and built an end-to-end donation notification platform using REST APIs and AWS SNS.",
  },
  {
    id: "codepath",
    title: "Tech Fellow",
    company: "CodePath (Remote)",
    dateRange: "Jun 2024 – Present",
    description:
      "Mentoring national cohorts of 300+ university students in data structures and algorithms. Leading live coding sessions and conducting mock technical interviews to prepare candidates for high-growth tech roles.",
  },
  {
    id: "hack-diversity",
    title: "Software Engineer Fellow",
    company: "Hack.Diversity (NYC)",
    dateRange: "Jan 2025 – Aug 2025",
    description:
      "Partnered with industry mentors to refine architectural decision-making, focusing on high-availability patterns, scalable system design, and modern TypeScript implementation within enterprise production contexts.",
  },
  {
    id: "njcu-research",
    title: "Deep Learning Research Intern",
    company: "New Jersey City University (Jersey City, NJ)",
    dateRange: "May 2022 – Jul 2022",
    description:
      "Trained and deployed Reinforcement Learning models on AWS DeepRacer, utilizing AWS SageMaker for cloud-based distributed training and simulation environments. Improved lap times by 30% through advanced hyperparameter optimization and custom Python reward functions tailored to autonomous track challenges.",
  },
];

export const skills: SkillCategory[] = [
  {
    title: "Languages",
    skills: ["TypeScript", "JavaScript", "Python", "Java", "SQL (PostgreSQL, MySQL)", "NoSQL (MongoDB)"],
  },
  {
    title: "Frameworks & Libraries",
    skills: ["React", "Next.js", "Node.js", "Express", "React Query", "TailwindCSS", "Zod"],
  },
  {
    title: "Cloud & DevOps",
    skills: ["AWS (SNS, SageMaker, CodePipeline)", "Redis", "Docker", "CI/CD", "Git"],
  },
  {
    title: "Testing & Tooling",
    skills: ["Jest", "Mocha", "Playwright", "Stripe API", "LaunchDarkly", "DataDog", "FullStory", "REST APIs"],
  },
];

export const aboutText = [
  "Hi, I'm Denilson — a full stack software engineer based in the NYC area. I build scalable web applications with a focus on clean architecture, performance, and developer experience. I currently work at Trust & Will, where I ship features across complex SaaS and nonprofit platforms.",
  "I studied Computer Science at New Jersey City University (B.S., 2023, GPA 3.7) and have since worked across the full stack — from architecting GDPR-compliant data systems and Stripe billing infrastructure to resolving critical N+1 query bottlenecks in production. I care deeply about writing code that works well at scale.",
  "Outside of my day-to-day engineering work, I mentor 300+ university students at CodePath in data structures, algorithms, and technical interview preparation. I'm always learning, always building.",
];

export const projects: Project[] = [
  {
    id: "kloth",
    title: "Kloth",
    description:
      "A type-safe e-commerce engine built with Next.js and PostgreSQL. Implemented dynamic server-side routing and Zod schema validation to ensure data integrity across client-server boundaries. Architected robust API routes for variant-specific product fetching with strict TypeScript interface definitions.",
    technologies: ["Next.js", "TypeScript", "PostgreSQL", "TailwindCSS", "Zod"],
    github: "https://github.com/Denilson0720",
  },
];

