"use client";

import AboutSection from "../Sections/AboutSection";
import WorkExperienceSection from "../Sections/WorkExperienceSection";
import ProjectsSection from "../Sections/ProjectsSection";
import ContactSection from "../Sections/ContactSection";

export default function ContentArea() {
  return (
    <>
      {/* Desktop Content Area */}
      <div 
        data-content-area
        className="flex-1 ml-64 overflow-y-auto hidden md:block"
      >
        <div className="max-w-6xl mx-auto">
          <AboutSection />
          <WorkExperienceSection />
          <ProjectsSection />
          <ContactSection />
        </div>
      </div>

      {/* Mobile Content Area */}
      <div className="md:hidden mt-16 overflow-y-auto">
        <div className="max-w-6xl mx-auto px-4">
          <AboutSection />
          <WorkExperienceSection />
          <ProjectsSection />
          <ContactSection />
        </div>
      </div>
    </>
  );
}

