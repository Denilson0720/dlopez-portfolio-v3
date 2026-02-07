"use client";

import AboutSection from "../Sections/AboutSection";
import WorkExperienceSection from "../Sections/WorkExperienceSection";
import ProjectsSection from "../Sections/ProjectsSection";
import ContactSection from "../Sections/ContactSection";

interface ContentAreaProps {
  showSidebar: boolean;
}

export default function ContentArea({ showSidebar }: ContentAreaProps) {
  return (
    <>
      {/* Desktop Content Area */}
      <div 
        data-content-area
        className={`transition-all duration-500 ${
          showSidebar ? "md:ml-64" : "md:ml-0"
        }`}
      >
        <div className="max-w-6xl mx-auto px-8 py-20">
          <AboutSection />
          <WorkExperienceSection />
          <ProjectsSection />
          <ContactSection />
        </div>
      </div>

      {/* Mobile Content Area */}
      <div className="md:hidden mt-16">
        <div className="max-w-6xl mx-auto px-4 py-20">
          <AboutSection />
          <WorkExperienceSection />
          <ProjectsSection />
          <ContactSection />
        </div>
      </div>
    </>
  );
}

