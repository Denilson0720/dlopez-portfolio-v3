import { WorkExperience, SkillCategory, Project } from "@/types";

export const workExperience: WorkExperience[] = [
  {
    id: "tech-innovations",
    title: "Senior Software Engineer",
    company: "Tech Innovations Inc.",
    dateRange: "2022 - Present",
    description:
      "Leading development of scalable web applications using React and Node.js. Mentoring junior developers and implementing best practices.",
  },
  {
    id: "digital-solutions",
    title: "Full Stack Developer",
    company: "Digital Solutions LLC",
    dateRange: "2020 - 2022",
    description:
      "Developed and maintained multiple client projects, working with modern frameworks and cloud technologies.",
  },
  {
    id: "startupxyz",
    title: "Frontend Developer",
    company: "StartupXYZ",
    dateRange: "2018 - 2020",
    description:
      "Built responsive user interfaces and collaborated with design teams to create engaging user experiences.",
  },
];

export const skills: SkillCategory[] = [
  {
    title: "Languages",
    skills: ["TypeScript", "JavaScript", "Java", "Python", "SQL", "NoSQL"],
  },
  {
    title: "Frameworks & Libraries",
    skills: ["Node.js", "Express.js", "React", "Next.js", "TailwindCSS", "Bootstrap", "Sequelize", "Jest", "Mocha", "Playwright"],
  },
  {
    title: "Backend & Cloud",
    skills: ["REST", "AWS SNS", "Serverless Architecture", "Stripe API", "PostgreSQL", "MongoDB", "MySQL"],
  },
  {
    title: "Tools",
    skills: ["Git", "GitHub", "VS Code", "Vercel", "Netlify", "Figma", "Postman"],
  },
];

export const aboutText = [
  "Hello! I'm a passionate developer with a love for creating beautiful and functional web experiences. I specialize in modern web technologies and enjoy turning complex problems into simple, elegant solutions.",
  "With years of experience in software development, I've worked on various projects ranging from small startups to large-scale enterprise applications. My expertise includes frontend and backend development, UI/UX design, and cloud infrastructure.",
  "When I'm not coding, you can find me exploring new technologies, contributing to open-source projects, or sharing knowledge with the developer community. I believe in continuous learning and staying up-to-date with the latest industry trends.",
];

export const projects: Project[] = [
  {
    id: "project-1",
    title: "E-Commerce Platform",
    description: "A full-stack e-commerce platform built with React and Node.js, featuring user authentication, payment processing, and inventory management.",
    technologies: ["React", "Node.js", "PostgreSQL", "Stripe API", "Express.js"],
    link: "https://example.com",
    github: "https://github.com/example",
  },
  {
    id: "project-2",
    title: "Task Management App",
    description: "A collaborative task management application with real-time updates, built using Next.js and WebSockets.",
    technologies: ["Next.js", "TypeScript", "WebSockets", "MongoDB", "TailwindCSS"],
    link: "https://example.com",
    github: "https://github.com/example",
  },
  {
    id: "project-3",
    title: "Weather Dashboard",
    description: "A responsive weather dashboard that displays current conditions and forecasts using external APIs.",
    technologies: ["React", "JavaScript", "REST APIs", "CSS"],
    link: "https://example.com",
    github: "https://github.com/example",
  },
];

