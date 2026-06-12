import React, { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import { supabase } from "../supabase/client";
import { motion } from "framer-motion";

interface Project {
  id: string;
  title: string;
  slug: string;
  description: string;
  technologies: string[];
  thumbnail: string | null;
  category: string;
}

interface BlogPost {
  id: string;
  title: string;
  slug: string;
  excerpt: string;
  published_at: string;
  reading_time: number;
}

export const Home: React.FC = () => {
  const [featuredProjects, setFeaturedProjects] = useState<Project[]>([]);
  const [latestBlogs, setLatestBlogs] = useState<BlogPost[]>([]);
  const [loading, setLoading] = useState(true);

  // GitHub Overview States
  const [gitProfile, setGitProfile] = useState<any | null>(null);
  const [gitRepos, setGitRepos] = useState<any[]>([]);

  // Mini Chart state for floating Panel 2
  const [chartBars, setChartBars] = useState<number[]>([]);

  // Video reference for autoplay logic
  const videoRef = React.useRef<HTMLVideoElement>(null);

  useEffect(() => {
    if (videoRef.current) {
      videoRef.current.muted = true;
      videoRef.current.playsInline = true;
      videoRef.current.play().catch((err) => {
        console.warn("Video autoplay failed or was blocked:", err);
      });
    }
  }, []);

  useEffect(() => {
    // Generate initial bars for the mini throughput chart
    const initialBars = Array.from({ length: 15 }, () => 20 + Math.random() * 70);
    setChartBars(initialBars);

    // Update one random bar every 300ms to simulate data activity
    const interval = setInterval(() => {
      setChartBars((prev) => {
        const next = [...prev];
        const idx = Math.floor(Math.random() * next.length);
        next[idx] = 20 + Math.random() * 75;
        return next;
      });
    }, 300);

    return () => clearInterval(interval);
  }, []);

  useEffect(() => {
    const fetchData = async () => {
      try {
        const { data: projData } = await supabase
          .from("projects")
          .select("id, title, slug, description, technologies, thumbnail, category")
          .eq("featured", true)
          .limit(3);

        const { data: blogData } = await supabase
          .from("blog_posts")
          .select("id, title, slug, excerpt, published_at, reading_time")
          .order("published_at", { ascending: false })
          .limit(2);

        if (projData) setFeaturedProjects(projData);
        if (blogData) setLatestBlogs(blogData);
      } catch (err) {
        console.error("Error fetching homepage data:", err);
      } finally {
        setLoading(false);
      }
    };
    fetchData();
  }, []);

  useEffect(() => {
    const fetchGithubOverview = async () => {
      try {
        const username = import.meta.env.VITE_GITHUB_USERNAME || "romeobessenaar";
        const cachedTime = localStorage.getItem("github_cache_time");
        const cachedProfile = localStorage.getItem("github_profile_cache");
        const cachedRepos = localStorage.getItem("github_repos_cache");
        
        if (cachedTime && cachedProfile && cachedRepos && (Date.now() - parseInt(cachedTime) < 300000)) {
          setGitProfile(JSON.parse(cachedProfile));
          setGitRepos(JSON.parse(cachedRepos).slice(0, 3));
          return;
        }

        const headers: HeadersInit = {};
        const token = import.meta.env.VITE_GITHUB_TOKEN;
        if (token) {
          headers["Authorization"] = `token ${token}`;
        }

        const pRes = await fetch(`https://api.github.com/users/${username}`, { headers });
        const rRes = await fetch(`https://api.github.com/users/${username}/repos?sort=updated&per_page=10`, { headers });
        
        if (pRes.ok && rRes.ok) {
          const profileData = await pRes.json();
          const reposData = await rRes.json();
          const sorted = [...reposData].sort((a, b) => b.stargazers_count - a.stargazers_count);
          setGitProfile(profileData);
          setGitRepos(sorted.slice(0, 3));
        }
      } catch (err) {
        console.warn("Failed to fetch Github overview on Home page", err);
      }
    };
    fetchGithubOverview();
  }, []);

  const stats = [
    { value: "200+", label: "Endpoints Supported", desc: "Groote Schuur Hospital" },
    { value: "CCNA", label: "Aligned Training", desc: "Routing, switching & security" },
    { value: "3+", label: "Years Field Experience", desc: "Networks & systems" },
    { value: "99.9%", label: "System Uptime", desc: "Lab & network automation" },
  ];

  const techStack = [
    { name: "VLAN / DHCP", category: "Networking" },
    { name: "Routing & Switching", category: "Networking" },
    { name: "Network Security", category: "Networking" },
    { name: "Linux / Windows Server", category: "Systems" },
    { name: "Salesforce LWC/Apex", category: "CRM" },
    { name: "React / TypeScript", category: "Frontend" },
    { name: "Docker / K8s", category: "DevOps" },
    { name: "SQL / PostgreSQL", category: "Data" },
    { name: "Git / GitHub", category: "DevOps" },
  ];

  return (
    <div className="w-full flex flex-col items-center">
      {/* Hero Section */}
      <section className="relative min-h-[95vh] w-full flex items-center justify-center pt-20 overflow-hidden px-margin-mobile md:px-margin-desktop">
        {/* Background Video with fallbacks */}
        <div className="absolute inset-0 z-0 bg-gradient-to-br from-surface-container-low via-surface to-surface-container-high dark:from-slate-950 dark:via-slate-900 dark:to-slate-800 transition-colors duration-300">
          <video
            ref={videoRef}
            src="/assets/This_is_me_Make_a_cool_GTA_V.mp4"
            autoPlay
            muted
            loop
            playsInline
            className="w-full h-full object-cover opacity-60 dark:opacity-40 pointer-events-none"
            onError={(e) => {
              console.warn("Video failed to load, falling back to gradient.", e);
            }}
          />
        </div>

        {/* Ambient Blobs */}
        <div className="blob-bg w-[600px] h-[600px] bg-primary/10 dark:bg-primary/5 top-[-100px] left-[-200px] absolute pointer-events-none filter blur-[100px] rounded-full z-0"></div>
        <div className="blob-bg w-[500px] h-[500px] bg-secondary/10 dark:bg-secondary/5 bottom-[-100px] right-[-100px] absolute pointer-events-none filter blur-[100px] rounded-full z-0"></div>

        <div className="max-w-[1280px] w-full mx-auto relative z-20 flex flex-col items-center text-center">
          <motion.div
            initial={{ opacity: 0, y: -10 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5 }}
            className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-primary/10 border border-primary/20 text-xs font-mono text-primary mb-6"
          >
            <span className="w-2 h-2 rounded-full bg-primary animate-pulse"></span>
            <span>NETWORK & SYSTEMS ENGINEER</span>
          </motion.div>

          <motion.h1
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, delay: 0.1 }}
            className="font-display text-4xl sm:text-5xl md:text-6xl font-bold tracking-tight text-on-surface leading-[1.1] max-w-[950px] mb-8"
          >
            Engineering Resilient Infrastructure for <br />
            <span className="text-gradient">Networks, Automation and Systems</span>
          </motion.h1>

          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, delay: 0.2 }}
            className="flex flex-col sm:flex-row gap-4 z-20"
          >
            <Link
              to="/projects"
              className="bg-primary text-on-primary font-mono text-sm py-4 px-8 rounded-full hover:opacity-95 shadow-lg shadow-primary/20 hover:-translate-y-0.5 active:scale-95 transition-all flex items-center justify-center gap-2"
            >
              <span>Explore Projects</span>
              <span className="material-symbols-outlined text-[18px]">explore</span>
            </Link>
            <Link
              to="/github"
              className="border border-outline-variant bg-surface/60 backdrop-blur-md text-on-surface font-mono text-sm py-4 px-8 rounded-full hover:-translate-y-0.5 active:scale-95 transition-all flex items-center justify-center gap-2"
            >
              <span>View GitHub</span>
              <span className="material-symbols-outlined text-[18px]">code</span>
            </Link>
          </motion.div>
        </div>
      </section>

      {/* Statistics Section */}
      <section className="w-full border-y border-outline-variant/20 bg-surface-container-low/30 py-16 px-margin-mobile md:px-margin-desktop">
        <div className="max-w-[1280px] mx-auto grid grid-cols-2 lg:grid-cols-4 gap-8">
          {stats.map((stat, idx) => (
            <div key={idx} className="flex flex-col items-center lg:items-start text-center lg:text-left gap-1">
              <span className="font-display text-4xl sm:text-5xl font-extrabold text-primary tracking-tight">
                {stat.value}
              </span>
              <span className="font-display font-semibold text-sm text-on-surface">
                {stat.label}
              </span>
              <span className="font-body text-xs text-on-surface-variant">
                {stat.desc}
              </span>
            </div>
          ))}
        </div>
      </section>

      {/* Featured Projects Section */}
      <section className="max-w-[1280px] w-full py-24 px-margin-mobile md:px-margin-desktop">
        <div className="flex flex-col md:flex-row md:items-end justify-between mb-12 gap-4">
          <div>
            <h2 className="font-display text-3xl font-bold text-on-surface">Featured Projects</h2>
            <p className="font-body text-sm text-on-surface-variant mt-2 max-w-xl">
              A collection of custom-built software systems and diagnostics interfaces. Complete with full architectural logs and telemetry metrics.
            </p>
          </div>
          <Link
            to="/projects"
            className="inline-flex items-center gap-1.5 text-primary hover:text-primary-container font-mono text-sm group"
          >
            <span>View All Projects</span>
            <span className="material-symbols-outlined text-[16px] group-hover:translate-x-1 transition-transform">arrow_forward</span>
          </Link>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {loading
            ? Array(3)
                .fill(0)
                .map((_, i) => (
                  <div key={i} className="h-96 rounded-xl bg-surface-container animate-pulse border border-outline-variant/25"></div>
                ))
            : featuredProjects.map((project) => (
                <article
                  key={project.id}
                  className="glass-card rounded-xl overflow-hidden flex flex-col h-full border border-outline-variant/20 hover:border-primary/20"
                >
                  {project.thumbnail ? (
                    <div className="h-48 overflow-hidden bg-surface-container-highest relative">
                      <img
                        src={project.thumbnail}
                        alt={project.title}
                        className="w-full h-full object-cover transition-transform duration-500 hover:scale-105"
                      />
                    </div>
                  ) : (
                    <div className="h-48 bg-gradient-to-br from-primary/10 to-secondary/15 flex items-center justify-center border-b border-outline-variant/10">
                      <span className="material-symbols-outlined text-4xl text-primary/45">code</span>
                    </div>
                  )}
                  <div className="p-6 flex flex-col flex-grow text-left">
                    <span className="text-[10px] font-mono uppercase tracking-widest text-secondary mb-2 block font-bold">
                      {project.category}
                    </span>
                    <h3 className="font-display text-lg font-bold text-on-surface mb-2">
                      {project.title}
                    </h3>
                    <p className="font-body text-sm text-on-surface-variant mb-6 flex-grow leading-relaxed line-clamp-3">
                      {project.description}
                    </p>
                    <div className="flex flex-wrap gap-1.5 mb-6">
                      {project.technologies.slice(0, 3).map((tech, idx) => (
                        <span
                          key={idx}
                          className="px-2 py-0.5 rounded bg-surface-container-high text-[10px] font-mono text-on-surface-variant border border-outline-variant/10 font-medium"
                        >
                          {tech}
                        </span>
                      ))}
                    </div>
                    <Link
                      to={`/projects/${project.slug}`}
                      className="inline-flex items-center gap-1.5 text-xs font-mono font-bold text-primary group mt-auto hover:text-primary-container"
                    >
                      <span>Read Case Study</span>
                      <span className="material-symbols-outlined text-[14px] group-hover:translate-x-0.5 transition-transform">arrow_forward</span>
                    </Link>
                  </div>
                </article>
              ))}
        </div>
      </section>

      {/* GitHub Overview Section */}
      <section className="w-full border-t border-outline-variant/20 bg-surface-container-low/20 py-24 px-margin-mobile md:px-margin-desktop">
        <div className="max-w-[1280px] mx-auto flex flex-col gap-12">
          <div className="flex flex-col md:flex-row md:items-end justify-between gap-4">
            <div className="text-left">
              <h2 className="font-display text-3xl font-bold text-on-surface">Open Source Activity</h2>
              <p className="font-body text-sm text-on-surface-variant mt-2 max-w-xl">
                Real-time tracking of active public codebases, repositories, and technical contributions.
              </p>
            </div>
            <Link
              to="/github"
              className="inline-flex items-center gap-1.5 text-primary hover:text-primary-container font-mono text-sm font-semibold group"
            >
              <span>View GitHub Dashboard</span>
              <span className="material-symbols-outlined text-[16px] group-hover:translate-x-1 transition-transform">arrow_forward</span>
            </Link>
          </div>

          <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-stretch">
            {/* Left side: Quick Profile info */}
            {gitProfile && (
              <div className="lg:col-span-4 glass-panel border border-outline-variant/20 rounded-xl p-6 flex flex-col justify-between text-left">
                <div className="flex flex-col gap-4">
                  <div className="flex items-center gap-3">
                    <img
                      src={gitProfile.avatar_url}
                      alt={gitProfile.name}
                      className="w-12 h-12 rounded-full border border-primary/20"
                    />
                    <div>
                      <h3 className="font-display font-bold text-sm text-on-surface">{gitProfile.name}</h3>
                      <span className="font-mono text-[10px] text-outline">@{gitProfile.login}</span>
                    </div>
                  </div>
                  <p className="font-body text-xs text-on-surface-variant leading-relaxed">
                    {gitProfile.bio || "Systems developer specializing in healthcare data channels."}
                  </p>
                </div>

                <div className="grid grid-cols-2 gap-4 border-t border-outline-variant/10 pt-4 mt-4 font-mono text-[10px] text-on-surface-variant">
                  <div>
                    <span className="text-outline uppercase block">Public Repos</span>
                    <span className="text-lg font-bold text-primary">{gitProfile.public_repos}</span>
                  </div>
                  <div>
                    <span className="text-outline uppercase block">Followers</span>
                    <span className="text-lg font-bold text-primary">{gitProfile.followers}</span>
                  </div>
                </div>
              </div>
            )}

            {/* Right side: Top Repos list */}
            <div className={`grid grid-cols-1 md:grid-cols-3 gap-6 ${gitProfile ? 'lg:col-span-8' : 'lg:col-span-12'}`}>
              {gitRepos.length === 0 ? (
                Array(3)
                  .fill(0)
                  .map((_, i) => (
                    <div key={i} className="h-48 rounded-xl bg-surface-container animate-pulse border border-outline-variant/20"></div>
                  ))
              ) : (
                gitRepos.map((repo) => (
                  <div
                    key={repo.id}
                    className="glass-panel border border-outline-variant/25 rounded-xl p-5 hover:border-primary/30 hover:bg-surface-container-low/35 transition-all flex flex-col justify-between text-left"
                  >
                    <div>
                      <div className="flex items-center gap-1.5 mb-3">
                        <span className="material-symbols-outlined text-[16px] text-on-surface">code</span>
                        <h4 className="font-display font-semibold text-xs text-on-surface truncate max-w-[130px]">
                          {repo.name}
                        </h4>
                      </div>
                      <p className="font-body text-[11px] text-on-surface-variant leading-relaxed line-clamp-3 mb-4">
                        {repo.description || "No description provided."}
                      </p>
                    </div>

                    <div className="flex justify-between items-center text-[9px] font-mono text-outline pt-2 border-t border-outline-variant/10">
                      <div className="flex gap-2">
                        <span className="flex items-center gap-0.5">
                          <span className="material-symbols-outlined text-[11px] text-amber-500" style={{ fontVariationSettings: "'FILL' 1" }}>star</span>
                          <span>{repo.stargazers_count}</span>
                        </span>
                        <span className="flex items-center gap-0.5">
                          <span className="material-symbols-outlined text-[11px] text-outline">fork_right</span>
                          <span>{repo.forks_count}</span>
                        </span>
                      </div>
                      {repo.language && (
                        <span className="text-primary font-bold">{repo.language}</span>
                      )}
                    </div>
                  </div>
                ))
              )}
            </div>
          </div>
        </div>
      </section>

      {/* Technology Stack Mapping */}
      <section className="w-full border-t border-outline-variant/20 bg-surface-container-low/10 py-24 px-margin-mobile md:px-margin-desktop">
        <div className="max-w-[1280px] mx-auto grid grid-cols-1 lg:grid-cols-12 gap-12 items-center">
          <div className="lg:col-span-4 flex flex-col gap-4 text-left">
            <h2 className="font-display text-3xl font-bold text-on-surface">Technical Breadth</h2>
            <p className="font-body text-sm text-on-surface-variant leading-relaxed">
              Highly specialized across core systems engineering, database columnar layers, and modern Salesforce LWC structures. 
            </p>
            <Link
              to="/skills"
              className="inline-flex items-center gap-1 text-primary hover:text-primary-container font-mono text-xs font-bold mt-2"
            >
              <span>View Interactive Skills Map</span>
              <span className="material-symbols-outlined text-[14px]">arrow_forward</span>
            </Link>
          </div>

          <div className="lg:col-span-8 flex flex-wrap gap-3">
            {techStack.map((tech, idx) => (
              <div
                key={idx}
                className="px-4 py-3 rounded-lg bg-surface-container-low border border-outline-variant/35 shadow-sm hover:border-primary/45 transition-colors flex items-center gap-3"
              >
                <div className="w-1.5 h-1.5 rounded-full bg-primary" />
                <div className="flex flex-col text-left">
                  <span className="font-display font-semibold text-xs text-on-surface">
                    {tech.name}
                  </span>
                  <span className="text-[9px] font-mono text-outline uppercase">
                    {tech.category}
                  </span>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Latest Blog Articles */}
      <section className="max-w-[1280px] w-full py-24 px-margin-mobile md:px-margin-desktop">
        <div className="flex justify-between items-end mb-12">
          <div className="text-left">
            <h2 className="font-display text-3xl font-bold text-on-surface">Technical Writing</h2>
            <p className="font-body text-sm text-on-surface-variant mt-2">
              Deep dives on clinical data architectures, API design parameters, and tooling performance.
            </p>
          </div>
          <Link
            to="/blog"
            className="inline-flex items-center gap-1.5 text-primary hover:text-primary-container font-mono text-sm font-semibold"
          >
            <span>All Articles</span>
            <span className="material-symbols-outlined text-[16px]">arrow_forward</span>
          </Link>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
          {loading
            ? Array(2)
                .fill(0)
                .map((_, i) => (
                  <div key={i} className="h-56 rounded-xl bg-surface-container animate-pulse border border-outline-variant/25"></div>
                ))
            : latestBlogs.map((post) => (
                <article
                  key={post.id}
                  className="glass-card rounded-xl p-8 border border-outline-variant/20 flex flex-col justify-between hover:border-primary/20 text-left font-sans"
                >
                  <div>
                    <div className="flex items-center justify-between text-xs font-mono text-on-surface-variant mb-4">
                      <span>{new Date(post.published_at).toLocaleDateString()}</span>
                      <span>{post.reading_time} MIN READ</span>
                    </div>
                    <h3 className="font-display text-xl font-bold text-on-surface mb-3 hover:text-primary transition-colors">
                      <Link to={`/blog/${post.slug}`}>{post.title}</Link>
                    </h3>
                    <p className="font-body text-sm text-on-surface-variant mb-6 leading-relaxed line-clamp-2">
                      {post.excerpt}
                    </p>
                  </div>
                  <Link
                    to={`/blog/${post.slug}`}
                    className="inline-flex items-center gap-1.5 text-xs font-mono font-bold text-primary hover:text-primary-container mt-auto"
                  >
                    <span>Read Article</span>
                    <span className="material-symbols-outlined text-[14px]">arrow_forward</span>
                  </Link>
                </article>
              ))}
        </div>
      </section>

      {/* Call to Action */}
      <section className="w-full bg-gradient-to-tr from-primary/10 via-surface-container/20 to-secondary/10 border-t border-outline-variant/25 py-24 px-margin-mobile md:px-margin-desktop text-center">
        <div className="max-w-[700px] mx-auto flex flex-col items-center gap-6">
          <h2 className="font-display text-3xl sm:text-4xl font-bold text-on-surface">
            Need a Network & Systems Engineer?
          </h2>
          <p className="font-body text-sm sm:text-base text-on-surface-variant leading-relaxed">
            I design resilient network infrastructure, automate IT operations, and build modern web applications on top of solid systems foundations. Let's talk about what we can build together.
          </p>
          <div className="flex flex-wrap justify-center gap-4 mt-2">
            <Link
              to="/contact"
              className="bg-primary text-on-primary font-mono text-sm py-3 px-8 rounded-full hover:opacity-95 shadow-md shadow-primary/25"
            >
              Get In Touch
            </Link>
            <Link
              to="/projects"
              className="border border-outline-variant bg-surface hover:bg-surface-container font-mono text-sm py-3 px-8 rounded-full"
            >
              Explore Projects
            </Link>
          </div>
        </div>
      </section>
    </div>
  );
};
export default Home;
