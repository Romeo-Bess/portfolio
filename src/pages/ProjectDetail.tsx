import React, { useEffect, useState } from "react";
import { useParams, Link, useNavigate } from "react-router-dom";
import { supabase } from "../supabase/client";
import { ArrowLeft, ExternalLink, Calendar } from "lucide-react";
import { GithubIcon } from "../components/Icons";

interface Project {
  id: string;
  title: string;
  slug: string;
  description: string;
  content: string;
  thumbnail: string | null;
  technologies: string[];
  github_url: string | null;
  demo_url: string | null;
  category: string;
  status: string;
  created_at: string;
}

export const ProjectDetail: React.FC = () => {
  const { slug } = useParams<{ slug: string }>();
  const [project, setProject] = useState<Project | null>(null);
  const [loading, setLoading] = useState(true);
  const navigate = useNavigate();

  useEffect(() => {
    const fetchProject = async () => {
      setLoading(true);
      try {
        const { data, error } = await supabase
          .from("projects")
          .select("*")
          .eq("slug", slug)
          .single();

        if (error || !data) {
          console.error("Project not found:", error);
          setProject(null);
        } else {
          setProject(data);
        }
      } catch (err) {
        console.error("Error loading project:", err);
      } finally {
        setLoading(false);
      }
    };
    fetchProject();
  }, [slug]);

  // Robust inline markdown parser for case study content
  const renderMarkdown = (text: string) => {
    if (!text) return null;
    const lines = text.split("\n");
    let inList = false;
    let listItems: string[] = [];
    const elements: React.ReactNode[] = [];

    const flushList = (key: number) => {
      if (listItems.length > 0) {
        elements.push(
          <ul key={`list-${key}`} className="list-disc pl-6 space-y-2.5 my-4 font-body text-sm sm:text-base text-on-surface-variant">
            {listItems.map((item, idx) => (
              <li key={idx}>{item}</li>
            ))}
          </ul>
        );
        listItems = [];
      }
    };

    let lineIdx = 0;
    while (lineIdx < lines.length) {
      const line = lines[lineIdx];

      // Code Block
      if (line.startsWith("```")) {
        flushList(lineIdx);
        const codeLines: string[] = [];
        const lang = line.slice(3).trim();
        lineIdx++;
        while (lineIdx < lines.length && !lines[lineIdx].startsWith("```")) {
          codeLines.push(lines[lineIdx]);
          lineIdx++;
        }
        elements.push(
          <div key={`code-${lineIdx}`} className="my-6 rounded-lg overflow-hidden border border-outline-variant/35 bg-[#0b0f19] text-[12px] leading-relaxed font-mono p-4 text-slate-200">
            {lang && <div className="text-[10px] uppercase text-outline mb-2 select-none">{lang}</div>}
            <pre className="overflow-x-auto">{codeLines.join("\n")}</pre>
          </div>
        );
        lineIdx++;
        continue;
      }

      // Headers
      if (line.startsWith("# ")) {
        flushList(lineIdx);
        elements.push(
          <h1 key={lineIdx} className="font-display text-2xl sm:text-3xl font-extrabold text-on-surface mt-8 mb-4 border-b border-outline-variant/20 pb-2">
            {line.slice(2)}
          </h1>
        );
      } else if (line.startsWith("## ")) {
        flushList(lineIdx);
        elements.push(
          <h2 key={lineIdx} className="font-display text-xl sm:text-2xl font-bold text-on-surface mt-6 mb-3">
            {line.slice(3)}
          </h2>
        );
      } else if (line.startsWith("### ")) {
        flushList(lineIdx);
        elements.push(
          <h3 key={lineIdx} className="font-display text-base sm:text-lg font-semibold text-on-surface mt-4 mb-2">
            {line.slice(4)}
          </h3>
        );
      }
      // Bullet lists
      else if (line.startsWith("- ") || line.startsWith("* ")) {
        inList = true;
        listItems.push(line.slice(2));
      }
      // Blank lines
      else if (line.trim() === "") {
        flushList(lineIdx);
        inList = false;
      }
      // Plain text paragraphs
      else {
        flushList(lineIdx);
        inList = false;
        // Check for strong formatting
        let content: React.ReactNode = line;
        if (line.includes("**")) {
          const parts = line.split("**");
          content = parts.map((part, pIdx) => pIdx % 2 === 1 ? <strong key={pIdx} className="font-bold text-on-surface">{part}</strong> : part);
        }
        elements.push(
          <p key={lineIdx} className="font-body text-sm sm:text-base text-on-surface-variant leading-relaxed my-3">
            {content}
          </p>
        );
      }

      lineIdx++;
    }
    flushList(lineIdx); // final flush
    return elements;
  };

  if (loading) {
    return (
      <div className="max-w-[800px] w-full mx-auto px-margin-mobile py-24 flex flex-col gap-6">
        <div className="h-6 w-1/4 bg-surface-container animate-pulse rounded"></div>
        <div className="h-12 w-3/4 bg-surface-container animate-pulse rounded"></div>
        <div className="h-64 w-full bg-surface-container animate-pulse rounded-xl"></div>
        <div className="h-4 w-full bg-surface-container animate-pulse rounded"></div>
        <div className="h-4 w-full bg-surface-container animate-pulse rounded"></div>
      </div>
    );
  }

  if (!project) {
    return (
      <div className="max-w-[600px] w-full mx-auto px-margin-mobile py-24 text-center flex flex-col items-center gap-4">
        <h2 className="font-display text-2xl font-bold text-on-surface">Case Study Not Found</h2>
        <p className="font-body text-sm text-on-surface-variant">
          The requested project log could not be retrieved from the database.
        </p>
        <button
          onClick={() => navigate("/projects")}
          className="bg-primary text-on-primary font-mono text-xs py-2.5 px-6 rounded-lg"
        >
          Back to Projects
        </button>
      </div>
    );
  }

  return (
    <article className="max-w-[900px] w-full mx-auto px-margin-mobile md:px-margin-desktop py-12 flex flex-col gap-8">
      {/* Back button */}
      <div>
        <Link
          to="/projects"
          className="inline-flex items-center gap-2 text-xs font-mono text-outline hover:text-primary transition-colors"
        >
          <ArrowLeft className="w-3.5 h-3.5" />
          <span>Back to Projects CMS</span>
        </Link>
      </div>

      {/* Title block */}
      <header className="flex flex-col gap-4">
        <div className="flex flex-wrap items-center gap-3">
          <span className="text-xs font-mono font-bold uppercase tracking-wider text-secondary bg-secondary/10 px-2.5 py-1 rounded">
            {project.category}
          </span>
          <span className="text-xs font-mono text-outline px-2.5 py-1 rounded bg-surface-container border border-outline-variant/15 uppercase">
            {project.status}
          </span>
        </div>

        <h1 className="font-display text-3xl sm:text-4xl md:text-5xl font-extrabold text-on-surface leading-tight mt-2">
          {project.title}
        </h1>

        <p className="font-body text-base sm:text-lg text-on-surface-variant leading-relaxed mt-1">
          {project.description}
        </p>

        {/* Links bar */}
        <div className="flex flex-wrap gap-4 border-y border-outline-variant/15 py-4 mt-2">
          {project.github_url && (
            <a
              href={project.github_url}
              target="_blank"
              rel="noreferrer"
              className="inline-flex items-center gap-2 text-xs font-mono font-bold text-on-surface hover:text-primary transition-colors"
            >
              <GithubIcon className="w-4 h-4" />
              <span>Source Repository</span>
            </a>
          )}
          {project.demo_url && (
            <a
              href={project.demo_url}
              target="_blank"
              rel="noreferrer"
              className="inline-flex items-center gap-2 text-xs font-mono font-bold text-primary hover:text-primary-container transition-colors"
            >
              <ExternalLink className="w-4 h-4" />
              <span>Live Demonstration</span>
            </a>
          )}
          <span className="inline-flex items-center gap-1.5 text-xs font-mono text-outline ml-auto">
            <Calendar className="w-3.5 h-3.5" />
            {new Date(project.created_at).toLocaleDateString(undefined, { year: "numeric", month: "long" })}
          </span>
        </div>
      </header>

      {/* Featured Banner image */}
      {project.thumbnail && (
        <div className="w-full h-80 sm:h-96 rounded-xl overflow-hidden glass-panel border border-outline-variant/20 shadow-md">
          <img src={project.thumbnail} alt={project.title} className="w-full h-full object-cover" />
        </div>
      )}

      {/* Core case study markdown text */}
      <section className="mt-4 flex flex-col gap-1.5 border-b border-outline-variant/15 pb-12">
        {renderMarkdown(project.content)}
      </section>

      {/* Technologies specifications grid */}
      <section className="flex flex-col gap-4 pt-4">
        <h3 className="font-display font-bold text-lg text-on-surface">System Stack Blueprint</h3>
        <div className="flex flex-wrap gap-2">
          {project.technologies.map((tech, idx) => (
            <div
              key={idx}
              className="px-3.5 py-2 rounded-lg bg-surface-container-low border border-outline-variant/35 text-xs font-mono text-on-surface-variant hover:border-primary/45 transition-colors"
            >
              {tech}
            </div>
          ))}
        </div>
      </section>
    </article>
  );
};
export default ProjectDetail;
