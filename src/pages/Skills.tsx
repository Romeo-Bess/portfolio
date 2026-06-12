import React, { useState } from "react";
import { Radar, RadarChart, PolarGrid, PolarAngleAxis, PolarRadiusAxis, ResponsiveContainer } from "recharts";
import { Cpu, Search, Star, Layers, Activity } from "lucide-react";

interface SkillItem {
  name: string;
  level: "Expert" | "Advanced" | "Intermediate";
  category: "Languages" | "Systems & DB" | "Salesforce" | "DevOps & Tools" | "Data & Pathology";
  rating: number; // 1 to 5
}

export const Skills: React.FC = () => {
  const [searchQuery, setSearchQuery] = useState("");
  const [activeCategory, setActiveCategory] = useState<string>("All");

  const radarData = [
    { subject: "Systems Coding", A: 85, fullMark: 100 },
    { subject: "Web Frontend", A: 80, fullMark: 100 },
    { subject: "CRM & Salesforce", A: 90, fullMark: 100 },
    { subject: "Data Analytics", A: 75, fullMark: 100 },
    { subject: "Lab Pathology", A: 80, fullMark: 100 },
    { subject: "Lab Automation", A: 85, fullMark: 100 },
  ];

  const skillList: SkillItem[] = [
    // Languages & Frontend Libraries
    { name: "JavaScript", level: "Expert", category: "Languages", rating: 5 },
    { name: "TypeScript", level: "Advanced", category: "Languages", rating: 4 },
    { name: "React", level: "Advanced", category: "Languages", rating: 4 },
    { name: "Tailwind CSS v4", level: "Expert", category: "Languages", rating: 5 },
    { name: "Framer Motion", level: "Advanced", category: "Languages", rating: 4 },
    { name: "Zustand State Store", level: "Advanced", category: "Languages", rating: 4 },
    { name: "React Hook Form", level: "Advanced", category: "Languages", rating: 4 },
    { name: "HTML5 Canvas API", level: "Advanced", category: "Languages", rating: 4 },
    { name: "Python", level: "Advanced", category: "Languages", rating: 4 },
    { name: "Rust", level: "Intermediate", category: "Languages", rating: 3 },
    { name: "Java", level: "Intermediate", category: "Languages", rating: 3 },
    { name: "R Language", level: "Intermediate", category: "Languages", rating: 3 },
    
    // Systems & DB
    { name: "SQL / SOQL", level: "Expert", category: "Systems & DB", rating: 5 },
    { name: "Supabase integration", level: "Advanced", category: "Systems & DB", rating: 4 },
    { name: "Zod Validation", level: "Expert", category: "Systems & DB", rating: 5 },
    { name: "Web Audio API", level: "Advanced", category: "Systems & DB", rating: 4 },
    { name: "PostgreSQL", level: "Advanced", category: "Systems & DB", rating: 4 },
    { name: "ClickHouse", level: "Advanced", category: "Systems & DB", rating: 4 },
    { name: "MySQL", level: "Advanced", category: "Systems & DB", rating: 4 },
    { name: "REST APIs", level: "Expert", category: "Systems & DB", rating: 5 },
    { name: "gRPC", level: "Intermediate", category: "Systems & DB", rating: 3 },
    
    // Salesforce
    { name: "Salesforce CRM", level: "Expert", category: "Salesforce", rating: 5 },
    { name: "Apex Programming", level: "Expert", category: "Salesforce", rating: 5 },
    { name: "LWC (Lightning Web)", level: "Advanced", category: "Salesforce", rating: 4 },
    
    // DevOps
    { name: "Docker", level: "Advanced", category: "DevOps & Tools", rating: 4 },
    { name: "Kubernetes", level: "Intermediate", category: "DevOps & Tools", rating: 3 },
    { name: "Linux Server", level: "Advanced", category: "DevOps & Tools", rating: 4 },
    { name: "Git & GitHub", level: "Expert", category: "DevOps & Tools", rating: 5 },
    
    // Data & Pathology
    { name: "HL7 Protocol", level: "Expert", category: "Data & Pathology", rating: 5 },
    { name: "FHIR standard", level: "Advanced", category: "Data & Pathology", rating: 4 },
    { name: "Tableau", level: "Intermediate", category: "Data & Pathology", rating: 3 },
    { name: "Clinical Pathology", level: "Advanced", category: "Data & Pathology", rating: 4 },
  ];

  const categories = ["All", "Languages", "Systems & DB", "Salesforce", "DevOps & Tools", "Data & Pathology"];

  const filteredSkills = skillList.filter((skill) => {
    const matchesSearch = skill.name.toLowerCase().includes(searchQuery.toLowerCase());
    const matchesCat = activeCategory === "All" || skill.category === activeCategory;
    return matchesSearch && matchesCat;
  });

  return (
    <div className="max-w-[1280px] w-full mx-auto px-margin-mobile md:px-margin-desktop py-12 flex flex-col gap-12">
      
      {/* Intro */}
      <div>
        <h1 className="font-display text-4xl sm:text-5xl font-bold text-on-surface">Technical Map</h1>
        <p className="font-body text-sm sm:text-base text-on-surface-variant mt-2 max-w-xl">
          Visualizing competence indexes across core software engineering, data integrations, and medical automation domains.
        </p>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-start">
        
        {/* Left: Recharts Radar Chart */}
        <div className="lg:col-span-5 glass-panel rounded-xl p-6 border border-outline-variant/30 flex flex-col items-center">
          <h3 className="font-display font-semibold text-sm text-on-surface self-start mb-6 uppercase tracking-wider flex items-center gap-2">
            <Layers className="w-4 h-4 text-primary" />
            Core Competence Index
          </h3>
          
          <div className="w-full h-[320px] flex items-center justify-center font-mono text-xs text-on-surface-variant">
            <ResponsiveContainer width="100%" height="100%">
              <RadarChart cx="50%" cy="50%" outerRadius="75%" data={radarData}>
                <PolarGrid stroke="rgba(var(--color-outline-variant) / 0.3)" />
                <PolarAngleAxis 
                  dataKey="subject" 
                  stroke="currentColor" 
                  fontSize={10}
                  tick={{ fill: "var(--color-on-surface)" }}
                />
                <PolarRadiusAxis 
                  angle={30} 
                  domain={[0, 100]} 
                  stroke="rgba(var(--color-outline-variant) / 0.5)"
                  tick={{ fill: "var(--color-on-surface-variant)" }}
                  fontSize={8}
                />
                <Radar
                  name="Romeo"
                  dataKey="A"
                  stroke="rgb(var(--color-primary))"
                  fill="rgb(var(--color-primary))"
                  fillOpacity={0.25}
                />
              </RadarChart>
            </ResponsiveContainer>
          </div>
          
          <p className="text-[11px] font-body text-on-surface-variant text-center mt-4 leading-normal">
            Radar representing operational knowledge. Values are backed by active production code deployments and clinical integrations.
          </p>
        </div>

        {/* Right: Interactive Skills Grid */}
        <div className="lg:col-span-7 flex flex-col gap-6">
          
          {/* Controls */}
          <div className="flex flex-col sm:flex-row gap-4 justify-between items-center w-full">
            {/* Search */}
            <div className="flex items-center w-full sm:w-80 bg-surface-container/60 border border-outline-variant/30 rounded-lg px-3.5 py-2 hover:border-primary/45 transition-colors focus-within:bg-surface">
              <Search className="w-4 h-4 text-outline mr-2" />
              <input
                type="text"
                placeholder="Search technologies..."
                className="bg-transparent border-none text-xs font-body focus:ring-0 w-full text-on-surface placeholder:text-outline focus:outline-none"
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
              />
            </div>
            
            {/* Category Select */}
            <div className="flex gap-1 overflow-x-auto w-full sm:w-auto py-1 hide-scrollbar">
              {categories.map((cat) => (
                <button
                  key={cat}
                  onClick={() => setActiveCategory(cat)}
                  className={`px-3 py-1.5 rounded-md text-[10px] font-mono whitespace-nowrap transition-colors border ${
                    activeCategory === cat
                      ? "bg-primary text-on-primary border-primary"
                      : "bg-surface-container text-on-surface-variant border-outline-variant/15 hover:bg-surface-container-high"
                  }`}
                >
                  {cat}
                </button>
              ))}
            </div>
          </div>

          {/* List Grid */}
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            {filteredSkills.map((skill, idx) => (
              <div
                key={idx}
                className="glass-card p-4 rounded-xl border border-outline-variant/15 hover:border-primary/20 flex flex-col gap-2.5"
              >
                <div className="flex justify-between items-start">
                  <div className="flex items-center gap-2">
                    <div className="w-1.5 h-1.5 rounded-full bg-primary" />
                    <span className="font-display font-bold text-sm text-on-surface">{skill.name}</span>
                  </div>
                  
                  <span className={`text-[9px] font-mono font-bold uppercase tracking-wider px-2 py-0.5 rounded ${
                    skill.level === "Expert"
                      ? "bg-tertiary/10 text-tertiary"
                      : skill.level === "Advanced"
                      ? "bg-primary/10 text-primary"
                      : "bg-outline-variant/20 text-on-surface-variant"
                  }`}>
                    {skill.level}
                  </span>
                </div>
                
                <div className="flex items-center justify-between mt-1">
                  <span className="text-[10px] font-mono text-outline uppercase">{skill.category}</span>
                  <div className="flex items-center gap-0.5">
                    {Array(5)
                      .fill(0)
                      .map((_, rIdx) => (
                        <Star
                          key={rIdx}
                          className={`w-3 h-3 ${
                            rIdx < skill.rating ? "text-amber-400 fill-amber-400" : "text-outline-variant"
                          }`}
                        />
                      ))}
                  </div>
                </div>
              </div>
            ))}
          </div>

        </div>

      </div>

    </div>
  );
};
export default Skills;
