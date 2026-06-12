import React, { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { Briefcase, Calendar, ChevronDown, ChevronUp, MapPin, CheckCircle } from "lucide-react";

interface Job {
  id: string;
  company: string;
  role: string;
  location: string;
  timeline: string;
  summary: string;
  achievements: string[];
  technologies: string[];
}

export const Experience: React.FC = () => {
  const [expandedId, setExpandedId] = useState<string | null>("umane");

  const jobs: Job[] = [
    {
      id: "umane",
      company: "Umane Pathology",
      role: "Laboratory Automation Specialist",
      location: "Cape Town, SA",
      timeline: "Jun 2024 - Present",
      summary: "Translating critical laboratory pathology and diagnostic workloads into automated software routines and robotic operations.",
      achievements: [
        "Programmed API automation connectors for liquid handler robots, increasing clinical pipetting speeds by 30%.",
        "Orchestrated HL7 v2 and FHIR parser engines mapping clinical data into Supabase Postgres database instances.",
        "Deployed containerized diagnostic simulation stacks on local Linux servers running Docker & Kubernetes.",
        "Created an internal web dashboard displaying live workflow metrics and diagnostic errors for pathologists.",
      ],
      technologies: ["Python", "Rust", "HL7/FHIR", "Docker", "Kubernetes", "Linux", "React", "Supabase"],
    },
    {
      id: "groote-schuur",
      company: "Groote Schuur Hospital",
      role: "Histology Technician In Training",
      location: "Cape Town, SA",
      timeline: "Jan 2023 - May 2024",
      summary: "Performing complex clinical histology preparation routines under ISO 15189 safety and documentation protocols.",
      achievements: [
        "Prepared specimen biopsy cassettes, microtomy slides, and histology staining workflows.",
        "Automated lab specimens log bookkeeping using custom Excel macros, eliminating 10+ administrative hours weekly.",
        "Served as clinical domain consult, translating instrument operations into detailed software specs.",
      ],
      technologies: ["Clinical Histology", "Specimen Bookkeeping", "VBA Excel Macros", "Laboratory Audits"],
    },
    {
      id: "micronetbd",
      company: "MicronetBD",
      role: "Junior Salesforce Developer",
      location: "Remote / USA",
      timeline: "Mar 2022 - Dec 2022",
      summary: "Developed customized customer relationship features and server integrations on the Salesforce CRM platform.",
      achievements: [
        "Built dynamic Lightning Web Components (LWC) for corporate portals, optimizing onboarding layouts.",
        "Authored batch Apex scripts and database SOQL triggers, adhering strictly to platform execution limits.",
        "Integrated third-party REST APIs via OAuth, mapping response data to Salesforce lead tables.",
      ],
      technologies: ["Salesforce", "Apex", "SOQL", "LWC", "REST APIs", "Git", "JavaScript"],
    },
  ];

  const toggleExpand = (id: string) => {
    setExpandedId(expandedId === id ? null : id);
  };

  return (
    <div className="max-w-[1280px] w-full mx-auto px-margin-mobile md:px-margin-desktop py-12 flex flex-col gap-12">
      <div>
        <h1 className="font-display text-4xl sm:text-5xl font-bold text-on-surface">Experience Log</h1>
        <p className="font-body text-sm sm:text-base text-on-surface-variant mt-2 max-w-xl">
          Transforming standard professional tenures into structured case studies. Click on any card to view achievements and technical stacks.
        </p>
      </div>

      <div className="flex flex-col gap-6">
        {jobs.map((job) => {
          const isExpanded = expandedId === job.id;
          return (
            <div
              key={job.id}
              className={`glass-card rounded-xl border transition-all overflow-hidden ${
                isExpanded ? "border-primary/30 shadow-lg" : "border-outline-variant/20"
              }`}
            >
              {/* Header Accordion Button */}
              <button
                onClick={() => toggleExpand(job.id)}
                className="w-full p-6 sm:p-8 flex items-start justify-between gap-4 text-left focus:outline-none"
              >
                <div className="flex gap-4">
                  <div className="p-3 bg-primary/10 text-primary rounded-lg flex items-center justify-center shrink-0 h-12 w-12 mt-1">
                    <Briefcase className="w-6 h-6" />
                  </div>
                  <div>
                    <h3 className="font-display text-lg sm:text-xl font-bold text-on-surface">
                      {job.role}
                    </h3>
                    <p className="font-mono text-xs text-secondary font-semibold mt-1">
                      {job.company}
                    </p>
                    
                    <div className="flex flex-wrap items-center gap-4 text-xs font-mono text-outline mt-3">
                      <span className="flex items-center gap-1">
                        <Calendar className="w-3.5 h-3.5" />
                        {job.timeline}
                      </span>
                      <span className="flex items-center gap-1">
                        <MapPin className="w-3.5 h-3.5" />
                        {job.location}
                      </span>
                    </div>
                  </div>
                </div>

                <div className="text-on-surface-variant p-2 hover:bg-surface-container rounded-full transition-colors self-center shrink-0">
                  {isExpanded ? <ChevronUp className="w-5 h-5" /> : <ChevronDown className="w-5 h-5" />}
                </div>
              </button>

              {/* Expandable Case Details */}
              <AnimatePresence initial={false}>
                {isExpanded && (
                  <motion.div
                    initial={{ height: 0 }}
                    animate={{ height: "auto" }}
                    exit={{ height: 0 }}
                    transition={{ duration: 0.3, ease: [0.23, 1, 0.32, 1] }}
                    className="overflow-hidden"
                  >
                    <div className="px-6 pb-8 sm:px-8 sm:pb-8 border-t border-outline-variant/15 pt-6 flex flex-col gap-6 bg-surface-container/10">
                      
                      {/* Summary */}
                      <div>
                        <h4 className="text-xs font-mono font-bold uppercase tracking-wider text-outline mb-2">
                          Operational Scope
                        </h4>
                        <p className="font-body text-sm text-on-surface leading-relaxed">
                          {job.summary}
                        </p>
                      </div>

                      {/* Achievements */}
                      <div>
                        <h4 className="text-xs font-mono font-bold uppercase tracking-wider text-outline mb-3">
                          Key Achievements & Case Outcomes
                        </h4>
                        <ul className="flex flex-col gap-2.5">
                          {job.achievements.map((ach, idx) => (
                            <li key={idx} className="flex gap-3 items-start text-xs sm:text-sm font-body text-on-surface-variant leading-relaxed">
                              <CheckCircle className="w-4 h-4 text-tertiary shrink-0 mt-0.5" />
                              <span>{ach}</span>
                            </li>
                          ))}
                        </ul>
                      </div>

                      {/* Technologies Used */}
                      <div>
                        <h4 className="text-xs font-mono font-bold uppercase tracking-wider text-outline mb-2.5">
                          Technology Footprint
                        </h4>
                        <div className="flex flex-wrap gap-1.5">
                          {job.technologies.map((tech, idx) => (
                            <span
                              key={idx}
                              className="px-2.5 py-1 bg-surface-container text-xs font-mono text-on-surface-variant border border-outline-variant/20 rounded"
                            >
                              {tech}
                            </span>
                          ))}
                        </div>
                      </div>

                    </div>
                  </motion.div>
                )}
              </AnimatePresence>
            </div>
          );
        })}
      </div>
    </div>
  );
};
export default Experience;
