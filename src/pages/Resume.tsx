import React from "react";
import { Download, Printer, Award, BookOpen, Briefcase, Mail, Phone, Globe, MapPin } from "lucide-react";

export const Resume: React.FC = () => {
  const handlePrint = () => {
    window.print();
  };

  const certifications = [
    { name: "Salesforce Certified Administrator", issuer: "Salesforce", date: "2022" },
    { name: "Salesforce Certified Platform App Builder", issuer: "Salesforce", date: "2023" },
    { name: "Good Clinical Laboratory Practice (GCLP)", issuer: "Groote Schuur", date: "2023" },
    { name: "HL7 Integration Foundations", issuer: "Automation Academy", date: "2024" },
  ];

  const education = [
    {
      degree: "Diploma in Biomedical Laboratory Sciences",
      school: "Cape Peninsula University of Technology",
      period: "2018 - 2021",
      desc: "Specialized in Histology, Clinical Pathology, and laboratory information systems.",
    },
  ];

  return (
    <div className="max-w-[900px] w-full mx-auto px-margin-mobile md:px-margin-desktop py-12 flex flex-col gap-8">

      {/* Main Resume Sheet */}
      <div className="print-card bg-surface-container-lowest/80 border border-outline-variant/20 rounded-xl p-8 sm:p-12 shadow-md flex flex-col gap-8 text-left">
        
        {/* Name and Header details */}
        <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4 border-b border-outline-variant/20 pb-8">
          <div>
            <h1 className="font-display text-3xl sm:text-4xl font-extrabold text-on-surface">
              Romeo Bessenaar
            </h1>
            <p className="font-mono text-sm text-primary font-bold mt-1.5 uppercase tracking-wider">
              Laboratory Automation Specialist & Systems Engineer
            </p>
          </div>

          <div className="flex flex-col gap-1.5 font-mono text-xs text-on-surface-variant items-start sm:items-end">
            <span className="flex items-center gap-2">
              <Mail className="w-3.5 h-3.5 text-outline" />
              <span>hello@romeobessenaar.com</span>
            </span>
            <span className="flex items-center gap-2">
              <MapPin className="w-3.5 h-3.5 text-outline" />
              <span>Cape Town, South Africa</span>
            </span>
            <span className="flex items-center gap-2">
              <Globe className="w-3.5 h-3.5 text-outline" />
              <span>romeobessenaar.com</span>
            </span>
          </div>
        </div>

        {/* Summary */}
        <div className="flex flex-col gap-3">
          <h3 className="text-xs font-mono font-bold uppercase tracking-wider text-primary border-b border-outline-variant/15 pb-1">
            Professional Summary
          </h3>
          <p className="font-body text-sm text-on-surface-variant leading-relaxed">
            Analytical and solutions-driven Automation Specialist with a strong foundation in clinical histology and biomedical laboratory systems. Expert in translating complex medical workflows into reliable, scalable software designs. Experienced in developing custom Salesforce LWC portals, robust Apex database modules, and high-performance Rust integrations designed to automate instrument telemetry and HL7/FHIR health standard queues.
          </p>
        </div>

        {/* Core Experience */}
        <div className="flex flex-col gap-4">
          <h3 className="text-xs font-mono font-bold uppercase tracking-wider text-primary border-b border-outline-variant/15 pb-1">
            Experience Log
          </h3>

          <div className="flex flex-col gap-6">
            <div className="flex flex-col gap-1.5">
              <div className="flex justify-between items-baseline flex-wrap gap-1">
                <span className="font-display font-bold text-sm sm:text-base text-on-surface">
                  Laboratory Automation Specialist
                </span>
                <span className="font-mono text-xs text-outline">Jun 2024 - Present</span>
              </div>
              <div className="flex justify-between items-baseline font-mono text-xs font-semibold text-secondary">
                <span>Umane Pathology</span>
                <span>Cape Town, SA</span>
              </div>
              <ul className="list-disc pl-5 font-body text-xs sm:text-sm text-on-surface-variant space-y-1.5 mt-1">
                <li>Configure custom Python liquid handler robotic pipetting logs.</li>
                <li>Architect HL7 v2 telemetry data translation middleware mapping into Postgres.</li>
                <li>Design containerized microservice staging environments running Docker and Kubernetes.</li>
              </ul>
            </div>

            <div className="flex flex-col gap-1.5">
              <div className="flex justify-between items-baseline flex-wrap gap-1">
                <span className="font-display font-bold text-sm sm:text-base text-on-surface">
                  Histology Technician In Training
                </span>
                <span className="font-mono text-xs text-outline">Jan 2023 - May 2024</span>
              </div>
              <div className="flex justify-between items-baseline font-mono text-xs font-semibold text-secondary">
                <span>Groote Schuur Hospital</span>
                <span>Cape Town, SA</span>
              </div>
              <ul className="list-disc pl-5 font-body text-xs sm:text-sm text-on-surface-variant space-y-1.5 mt-1">
                <li>Processed high-throughput clinical tissue biopsy cassettes and microtomy slides.</li>
                <li>Built custom Excel macros that reduced administrative cataloging timelines by 10 hours per week.</li>
              </ul>
            </div>

            <div className="flex flex-col gap-1.5">
              <div className="flex justify-between items-baseline flex-wrap gap-1">
                <span className="font-display font-bold text-sm sm:text-base text-on-surface">
                  Salesforce Engineer
                </span>
                <span className="font-mono text-xs text-outline">Mar 2022 - Dec 2022</span>
              </div>
              <div className="flex justify-between items-baseline font-mono text-xs font-semibold text-secondary">
                <span>MicronetBD</span>
                <span>Remote / USA</span>
              </div>
              <ul className="list-disc pl-5 font-body text-xs sm:text-sm text-on-surface-variant space-y-1.5 mt-1">
                <li>Developed custom corporate web portals utilizing Salesforce Lightning Web Components (LWC).</li>
                <li>Authored batch Apex scripts and database SOQL triggers optimized for platform governor thresholds.</li>
              </ul>
            </div>
          </div>
        </div>

        {/* Education & Certifications Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-8 border-t border-outline-variant/15 pt-8">
          
          {/* Education */}
          <div className="flex flex-col gap-4">
            <h3 className="text-xs font-mono font-bold uppercase tracking-wider text-primary border-b border-outline-variant/15 pb-1">
              Education
            </h3>
            {education.map((edu, idx) => (
              <div key={idx} className="flex flex-col gap-1">
                <div className="flex justify-between items-baseline text-xs font-mono">
                  <span className="font-bold text-on-surface">{edu.degree}</span>
                </div>
                <div className="flex justify-between text-[11px] font-mono text-secondary">
                  <span>{edu.school}</span>
                  <span>{edu.period}</span>
                </div>
                <p className="font-body text-xs text-on-surface-variant mt-1">{edu.desc}</p>
              </div>
            ))}
          </div>

          {/* Certifications */}
          <div className="flex flex-col gap-4">
            <h3 className="text-xs font-mono font-bold uppercase tracking-wider text-primary border-b border-outline-variant/15 pb-1">
              Certifications
            </h3>
            <div className="flex flex-col gap-3 font-mono text-xs">
              {certifications.map((cert, idx) => (
                <div key={idx} className="flex justify-between items-start">
                  <div className="flex gap-2">
                    <Award className="w-4 h-4 text-secondary shrink-0 mt-0.5" />
                    <div>
                      <span className="font-bold text-on-surface block leading-tight">{cert.name}</span>
                      <span className="text-[10px] text-outline block mt-0.5">{cert.issuer}</span>
                    </div>
                  </div>
                  <span className="text-[10px] text-outline">{cert.date}</span>
                </div>
              ))}
            </div>
          </div>

        </div>

        {/* Skills Block */}
        <div className="flex flex-col gap-4 border-t border-outline-variant/15 pt-8">
          <h3 className="text-xs font-mono font-bold uppercase tracking-wider text-primary border-b border-outline-variant/15 pb-1">
            Technical Stack Overview
          </h3>
          <div className="grid grid-cols-2 sm:grid-cols-4 gap-4 text-xs font-mono text-on-surface-variant">
            <div>
              <span className="font-bold text-on-surface block mb-1">Languages:</span>
              <span>JavaScript, TypeScript, Go, Rust, Java, Python, R</span>
            </div>
            <div>
              <span className="font-bold text-on-surface block mb-1">Web:</span>
              <span>React, LWC, HTML, CSS, Tailwind CSS</span>
            </div>
            <div>
              <span className="font-bold text-on-surface block mb-1">Data & DB:</span>
              <span>SQL, PostgreSQL, ClickHouse, SOQL, HL7/FHIR</span>
            </div>
            <div>
              <span className="font-bold text-on-surface block mb-1">DevOps:</span>
              <span>Docker, Kubernetes, Linux, Git & GitHub</span>
            </div>
          </div>
        </div>

      </div>
    </div>
  );
};
export default Resume;
