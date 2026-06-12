import React, { useEffect, useState, useRef } from "react";
import { useNavigate } from "react-router-dom";
import { useSearchStore } from "../store/useSearchStore";
import { Search, FileText, Code, Cpu, Award, Zap, HelpCircle } from "lucide-react";

interface SearchItem {
  id: string;
  title: string;
  category: "pages" | "projects" | "blogs" | "skills" | "commands";
  path: string;
  icon: React.ReactNode;
  subtitle?: string;
}

export const CommandPalette: React.FC = () => {
  const { isOpen, setIsOpen, searchQuery, setSearchQuery } = useSearchStore();
  const [filteredItems, setFilteredItems] = useState<SearchItem[]>([]);
  const [selectedIndex, setSelectedIndex] = useState(0);
  const navigate = useNavigate();
  const inputRef = useRef<HTMLInputElement>(null);
  const containerRef = useRef<HTMLDivElement>(null);

  // Static searchable database
  const searchItems: SearchItem[] = [
    { id: "home", title: "Home", category: "pages", path: "/", icon: <Zap className="w-4 h-4" /> },
    { id: "about", title: "About", category: "pages", path: "/about", icon: <FileText className="w-4 h-4" /> },
    { id: "projects", title: "Projects", category: "pages", path: "/projects", icon: <Code className="w-4 h-4" /> },
    { id: "experience", title: "Experience", category: "pages", path: "/experience", icon: <Award className="w-4 h-4" /> },
    { id: "skills", title: "Skills Map", category: "pages", path: "/skills", icon: <Cpu className="w-4 h-4" /> },
    { id: "labs", title: "Labs & Experiments", category: "pages", path: "/labs", icon: <Zap className="w-4 h-4" /> },
    { id: "github", title: "GitHub Dashboard", category: "pages", path: "/github", icon: <Code className="w-4 h-4" /> },
    { id: "contact", title: "Contact Me", category: "pages", path: "/contact", icon: <HelpCircle className="w-4 h-4" /> },
    
    // Core Projects
    { id: "proj-romeo-runner", title: "Romeo Runner", category: "projects", path: "/projects/romeo-runner", icon: <Code className="w-4 h-4" />, subtitle: "Laboratory automation task runner in Go/Rust" },
    { id: "proj-scraper", title: "Ultimate Mini Web Scraper", category: "projects", path: "/projects/ultimate-mini-web-scraper", icon: <Code className="w-4 h-4" />, subtitle: "Concurrent web crawler in Go & Puppeteer" },
    { id: "proj-snake", title: "Retro Snake Game", category: "projects", path: "/projects/snake", icon: <Code className="w-4 h-4" />, subtitle: "HTML5 canvas snake game with neon accents" },
    { id: "proj-music", title: "Music App", category: "projects", path: "/projects/music-app", icon: <Code className="w-4 h-4" />, subtitle: "Web Audio API personal music player" },

    // Blogs
    { id: "blog-rust", title: "Architecting a High-Throughput HL7/FHIR Data Pipeline in Rust", category: "blogs", path: "/blog/high-throughput-hl7-fhir-pipeline-rust", icon: <FileText className="w-4 h-4" /> },
    { id: "blog-salesforce", title: "Salesforce Apex vs Rust: Performance and Architecture in Systems Design", category: "blogs", path: "/blog/salesforce-apex-vs-rust-performance", icon: <FileText className="w-4 h-4" /> },

    // Skills
    { id: "skill-rust", title: "Rust programming language", category: "skills", path: "/skills", icon: <Cpu className="w-4 h-4" />, subtitle: "Data pipelines, low-latency backends" },
    { id: "skill-salesforce", title: "Salesforce Apex / LWC", category: "skills", path: "/skills", icon: <Cpu className="w-4 h-4" />, subtitle: "Enterprise custom business logic" },
    { id: "skill-react", title: "React & TypeScript", category: "skills", path: "/skills", icon: <Cpu className="w-4 h-4" />, subtitle: "Glassmorphic Web UIs, state stores" },
    { id: "skill-go", title: "Go (Golang)", category: "skills", path: "/skills", icon: <Cpu className="w-4 h-4" />, subtitle: "Distributed systems, orchestration tools" },
    
    // Quick Actions
    { id: "cmd-theme-light", title: "Switch to Light Theme", category: "commands", path: "theme:light", icon: <Zap className="w-4 h-4" /> },
    { id: "cmd-theme-dark", title: "Switch to Dark Theme", category: "commands", path: "theme:dark", icon: <Zap className="w-4 h-4" /> },
    { id: "cmd-theme-aurora", title: "Switch to Aurora Theme", category: "commands", path: "theme:aurora", icon: <Zap className="w-4 h-4" /> },
    { id: "cmd-theme-ocean", title: "Switch to Ocean Theme", category: "commands", path: "theme:ocean", icon: <Zap className="w-4 h-4" /> },
    { id: "cmd-theme-sunset", title: "Switch to Sunset Theme", category: "commands", path: "theme:sunset", icon: <Zap className="w-4 h-4" /> },
  ];

  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if ((e.ctrlKey || e.metaKey) && e.key === "k") {
        e.preventDefault();
        setIsOpen(!isOpen);
      }
      if (e.key === "Escape") {
        setIsOpen(false);
      }
    };
    window.addEventListener("keydown", handleKeyDown);
    return () => window.removeEventListener("keydown", handleKeyDown);
  }, [isOpen, setIsOpen]);

  useEffect(() => {
    if (isOpen) {
      inputRef.current?.focus();
      document.body.style.overflow = "hidden";
    } else {
      document.body.style.overflow = "unset";
    }
  }, [isOpen]);

  useEffect(() => {
    if (!searchQuery) {
      setFilteredItems(searchItems.slice(0, 8)); // default visible
      return;
    }
    const query = searchQuery.toLowerCase();
    const filtered = searchItems.filter(
      (item) =>
        item.title.toLowerCase().includes(query) ||
        item.subtitle?.toLowerCase().includes(query) ||
        item.category.toLowerCase().includes(query)
    );
    setFilteredItems(filtered);
    setSelectedIndex(0);
  }, [searchQuery]);

  const handleSelect = (item: SearchItem) => {
    setIsOpen(false);
    setSearchQuery("");
    if (item.path.startsWith("theme:")) {
      const theme = item.path.split(":")[1];
      const root = document.documentElement;
      root.setAttribute("data-theme", theme);
      if (theme === "dark") root.classList.add("dark");
      else root.classList.remove("dark");
      localStorage.setItem("romeo-theme", theme);
      // Dispatch storage event to update Zustand store if they switch via command
      window.dispatchEvent(new Event("storage"));
      window.location.reload();
    } else {
      navigate(item.path);
    }
  };

  const handleKeyDown = (e: React.KeyboardEvent) => {
    if (e.key === "ArrowDown") {
      e.preventDefault();
      setSelectedIndex((prev) => (prev + 1) % filteredItems.length);
    } else if (e.key === "ArrowUp") {
      e.preventDefault();
      setSelectedIndex((prev) => (prev - 1 + filteredItems.length) % filteredItems.length);
    } else if (e.key === "Enter") {
      e.preventDefault();
      if (filteredItems[selectedIndex]) {
        handleSelect(filteredItems[selectedIndex]);
      }
    }
  };

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-[100] flex items-start justify-center pt-24 px-4 bg-black/60 backdrop-blur-sm">
      <div
        ref={containerRef}
        className="w-full max-w-2xl overflow-hidden rounded-xl border border-outline-variant/30 bg-surface-container-low/95 backdrop-blur-xl shadow-2xl transition-all"
        onKeyDown={handleKeyDown}
      >
        <div className="flex items-center gap-3 px-4 border-b border-outline-variant/20 py-3.5">
          <Search className="w-5 h-5 text-outline" />
          <input
            ref={inputRef}
            type="text"
            className="w-full bg-transparent border-none focus:ring-0 text-on-surface text-base placeholder:text-outline focus:outline-none"
            placeholder="Search pages, projects, skills, or commands..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
          />
          <kbd className="hidden sm:inline-block px-1.5 py-0.5 rounded border border-outline-variant/50 text-outline text-xs bg-surface-container">
            ESC
          </kbd>
        </div>

        <div className="max-h-[360px] overflow-y-auto p-2 hide-scrollbar">
          {filteredItems.length === 0 ? (
            <div className="py-12 text-center text-on-surface-variant">
              No results found for <span className="font-semibold">"{searchQuery}"</span>
            </div>
          ) : (
            <div className="flex flex-col gap-0.5">
              {filteredItems.map((item, idx) => (
                <button
                  key={item.id}
                  onClick={() => handleSelect(item)}
                  className={`w-full flex items-center justify-between px-3 py-2.5 rounded-lg text-left transition-colors ${
                    idx === selectedIndex
                      ? "bg-primary/10 text-primary"
                      : "text-on-surface hover:bg-surface-container-high/50"
                  }`}
                >
                  <div className="flex items-center gap-3">
                    <div
                      className={`p-1.5 rounded-md ${
                        idx === selectedIndex
                          ? "bg-primary/20 text-primary"
                          : "bg-surface-container-high text-on-surface-variant"
                      }`}
                    >
                      {item.icon}
                    </div>
                    <div>
                      <span className="font-medium text-sm block">{item.title}</span>
                      {item.subtitle && (
                        <span className="text-xs text-on-surface-variant block mt-0.5">
                          {item.subtitle}
                        </span>
                      )}
                    </div>
                  </div>
                  <span className="text-[10px] font-mono uppercase tracking-wider text-outline bg-surface-container px-2 py-0.5 rounded border border-outline-variant/20">
                    {item.category}
                  </span>
                </button>
              ))}
            </div>
          )}
        </div>
      </div>
    </div>
  );
};
