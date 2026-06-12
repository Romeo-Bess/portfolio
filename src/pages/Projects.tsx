import React, { useEffect, useState, useRef } from "react";
import { Link } from "react-router-dom";
import { Play, Pause, ExternalLink, Github, Tv2 } from "lucide-react";
import { motion } from "framer-motion";

interface ProjectCardData {
  id: string;
  title: string;
  slug: string;
  category: string;
  tags: string[];
  description: string;
  technologies: string[];
  accentColor: string;
  glowColor: string;
  githubUrl: string;
  liveUrl?: string;
}

/* ─── CRT Monitor Frame Component ───────────────────────────────────── */
const CRTScreen: React.FC<{
  children: React.ReactNode;
  glowColor: string;
  label?: string;
  className?: string;
}> = ({ children, glowColor, label, className = "" }) => (
  <div className={`relative flex flex-col items-center ${className}`}>
    {/* Monitor bezel */}
    <div
      className="relative w-full rounded-2xl overflow-hidden"
      style={{
        background: "linear-gradient(145deg, #1e2433 0%, #0d1017 50%, #1a1f2e 100%)",
        boxShadow: `0 0 0 2px rgba(255,255,255,0.06), 0 0 40px ${glowColor}55, 0 20px 60px rgba(0,0,0,0.6)`,
        padding: "10px 10px 6px",
      }}
    >
      {/* Bezel top bar — camera dot + brand */}
      <div className="flex items-center justify-between mb-2 px-1">
        <div className="flex items-center gap-1.5">
          <div className="w-1.5 h-1.5 rounded-full bg-white/10" />
          <span className="font-mono text-[8px] text-white/20 uppercase tracking-widest">ROMEO.DEV</span>
        </div>
        {label && (
          <span className="font-mono text-[8px] uppercase tracking-widest text-white/20">{label}</span>
        )}
        <div className="w-2 h-2 rounded-full" style={{ background: `${glowColor}99`, boxShadow: `0 0 6px ${glowColor}` }} />
      </div>

      {/* Screen area */}
      <div className="relative rounded-lg overflow-hidden" style={{ background: "#030508" }}>
        {children}

        {/* Scanlines overlay */}
        <div
          className="absolute inset-0 pointer-events-none z-10"
          style={{
            background:
              "repeating-linear-gradient(0deg, rgba(0,0,0,0.08) 0px, rgba(0,0,0,0.08) 1px, transparent 1px, transparent 3px)",
          }}
        />

        {/* Glass reflection */}
        <div
          className="absolute inset-0 pointer-events-none z-10"
          style={{
            background:
              "linear-gradient(135deg, rgba(255,255,255,0.04) 0%, transparent 40%, rgba(255,255,255,0.02) 100%)",
          }}
        />

        {/* Screen edge vignette */}
        <div
          className="absolute inset-0 pointer-events-none z-10 rounded-lg"
          style={{
            boxShadow: "inset 0 0 40px rgba(0,0,0,0.5)",
          }}
        />

        {/* Colored screen glow on inner edge */}
        <div
          className="absolute inset-0 pointer-events-none z-[9] rounded-lg"
          style={{
            boxShadow: `inset 0 0 20px ${glowColor}22`,
          }}
        />
      </div>

      {/* Bottom bezel - speaker grille */}
      <div className="flex justify-center gap-0.5 mt-2 px-4">
        {Array.from({ length: 16 }).map((_, i) => (
          <div key={i} className="w-px h-1.5 bg-white/8 rounded-full" />
        ))}
      </div>
    </div>

    {/* Monitor neck */}
    <div
      className="w-10 h-4"
      style={{
        background: "linear-gradient(180deg, #1a1f2e 0%, #141820 100%)",
        clipPath: "polygon(20% 0%, 80% 0%, 100% 100%, 0% 100%)",
      }}
    />
    {/* Monitor stand */}
    <div
      className="h-2 rounded-b-lg"
      style={{
        width: "55%",
        background: "linear-gradient(180deg, #1a2030 0%, #0f1318 100%)",
        boxShadow: `0 4px 12px rgba(0,0,0,0.5), 0 0 20px ${glowColor}22`,
      }}
    />
    {/* Stand base */}
    <div
      className="h-1 mt-px rounded-full"
      style={{
        width: "70%",
        background: "linear-gradient(90deg, transparent, #1a2030, transparent)",
      }}
    />
  </div>
);

/* ─── Tech Badge ─────────────────────────────────────────────────────── */
const TechBadge: React.FC<{ label: string }> = ({ label }) => (
  <span className="px-2 py-0.5 rounded-md bg-surface-container-high text-[10px] font-mono text-on-surface-variant border border-outline-variant/15 font-medium">
    {label}
  </span>
);

export const Projects: React.FC = () => {
  const [searchQuery, setSearchQuery] = useState("");
  const [selectedCategory, setSelectedCategory] = useState("All");

  /* ── Terminal animation (Romeo Runner) ── */
  const [terminalLines, setTerminalLines] = useState<string[]>([]);
  useEffect(() => {
    const lines = [
      "✓ System initialised.",
      "$ romeo-runner run --target pathology_pack",
      "⟳  Loading hardware modules...",
      "✓ Liquid handler online (1.2s)",
      "⟳  Step 1/8: tissue embedding...",
      "✓ Step 1 complete (0.4s)",
      "⟳  Step 2/8: microtomy...",
      "✓ Step 2 complete (0.6s)",
      "⟳  Step 3/8: H&E staining...",
      "✓ All 8 steps passed. Cycle: 4.2s",
    ];
    let i = 0;
    const interval = setInterval(() => {
      setTerminalLines((prev) => {
        const next = [...prev, lines[i % lines.length]];
        return next.slice(-8);
      });
      i++;
    }, 800);
    return () => clearInterval(interval);
  }, []);

  /* ── Music player state ── */
  const [musicBars, setMusicBars] = useState<number[]>(() =>
    Array.from({ length: 18 }, () => 10 + Math.random() * 80)
  );
  const [progress, setProgress] = useState(0);
  const [isPlaying, setIsPlaying] = useState(false);
  const audioCtxRef = useRef<AudioContext | null>(null);
  const gainNodeRef = useRef<GainNode | null>(null);
  const analyserRef = useRef<AnalyserNode | null>(null);
  const sequencerRef = useRef<any>(null);
  const arpeggioScale = [130.81, 146.83, 164.81, 196.0, 220.0, 261.63, 293.66, 329.63];

  const startAudio = () => {
    if (!audioCtxRef.current) {
      const AC = window.AudioContext || (window as any).webkitAudioContext;
      audioCtxRef.current = new AC();
      analyserRef.current = audioCtxRef.current.createAnalyser();
      analyserRef.current.fftSize = 64;
      gainNodeRef.current = audioCtxRef.current.createGain();
      gainNodeRef.current.gain.value = 0.3;
      gainNodeRef.current.connect(analyserRef.current);
      analyserRef.current.connect(audioCtxRef.current.destination);
    }
    if (audioCtxRef.current.state === "suspended") audioCtxRef.current.resume();
    setIsPlaying(true);
    const ctx = audioCtxRef.current;
    const dest = gainNodeRef.current!;
    let step = 0;
    sequencerRef.current = setInterval(() => {
      const time = ctx.currentTime;
      if (step % 4 === 0) {
        const o = ctx.createOscillator();
        const g = ctx.createGain();
        o.connect(g); g.connect(dest);
        o.frequency.setValueAtTime(130, time);
        o.frequency.exponentialRampToValueAtTime(0.01, time + 0.12);
        g.gain.setValueAtTime(1.0, time);
        g.gain.exponentialRampToValueAtTime(0.01, time + 0.12);
        o.start(time); o.stop(time + 0.13);
      }
      const noteFreq = arpeggioScale[step % arpeggioScale.length];
      const o2 = ctx.createOscillator();
      const g2 = ctx.createGain();
      o2.type = "sine"; o2.connect(g2); g2.connect(dest);
      o2.frequency.setValueAtTime(noteFreq, time);
      g2.gain.setValueAtTime(0.2, time);
      g2.gain.exponentialRampToValueAtTime(0.01, time + 0.22);
      o2.start(time); o2.stop(time + 0.24);
      step = (step + 1) % 8;
    }, 250);
  };

  const stopAudio = () => {
    setIsPlaying(false);
    if (sequencerRef.current) { clearInterval(sequencerRef.current); sequencerRef.current = null; }
  };

  const togglePlayback = () => isPlaying ? stopAudio() : startAudio();

  useEffect(() => {
    const interval = setInterval(() => {
      setMusicBars(Array.from({ length: 18 }, () => 8 + Math.random() * 85));
      setProgress((prev) => (prev >= 100 ? 0 : prev + 1));
    }, 280);
    return () => clearInterval(interval);
  }, []);

  useEffect(() => () => { if (sequencerRef.current) clearInterval(sequencerRef.current); }, []);

  /* ── Web Scraper state ── */
  const [scraperUrl, setScraperUrl] = useState("https://news.ycombinator.com");
  const [scraperSelector, setScraperSelector] = useState(".titleline a");
  const [scrapeResults, setScrapeResults] = useState<{ text: string; href?: string }[]>([]);
  const [isScraping, setIsScraping] = useState(false);
  const [scrapeError, setScrapeError] = useState("");

  const handleScrape = async () => {
    if (!scraperUrl.trim() || !scraperSelector.trim()) return;
    setIsScraping(true);
    setScrapeError("");
    setScrapeResults([]);
    try {
      const response = await fetch(`https://api.allorigins.win/get?url=${encodeURIComponent(scraperUrl)}`);
      if (!response.ok) throw new Error("CORS request failed");
      const data = await response.json();
      const doc = new DOMParser().parseFromString(data.contents, "text/html");
      const elements = doc.querySelectorAll(scraperSelector);
      const results: { text: string; href?: string }[] = [];
      elements.forEach((el) => {
        const text = el.textContent?.trim() || "";
        let href = el.getAttribute("href") || undefined;
        if (href?.startsWith("/")) {
          try { href = new URL(scraperUrl).origin + href; } catch (_) {}
        }
        if (text) results.push({ text, href });
      });
      if (results.length === 0) setScrapeError("No elements matched. Try adjusting the CSS selector.");
      else setScrapeResults(results.slice(0, 8));
    } catch {
      setScrapeError("CORS proxy error. Try another domain or selector.");
    } finally {
      setIsScraping(false);
    }
  };

  /* ── Snake canvas ── */
  const snakeCanvasRef = useRef<HTMLCanvasElement>(null);
  useEffect(() => {
    const canvas = snakeCanvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext("2d");
    if (!ctx) return;
    let snake = [{ x: 50, y: 50 }, { x: 40, y: 50 }, { x: 30, y: 50 }];
    let dir = { x: 10, y: 0 };
    let frame = 0;
    let animId: number;
    const draw = () => {
      frame++;
      if (frame % 7 === 0) {
        const head = { x: snake[0].x + dir.x, y: snake[0].y + dir.y };
        if (head.x >= canvas.width) head.x = 0;
        if (head.x < 0) head.x = canvas.width - 10;
        if (head.y >= canvas.height) head.y = 0;
        if (head.y < 0) head.y = canvas.height - 10;
        snake.unshift(head);
        snake.pop();
        if (Math.random() < 0.14) {
          const opts = [{ x: 10, y: 0 }, { x: -10, y: 0 }, { x: 0, y: 10 }, { x: 0, y: -10 }].filter(
            (d) => d.x !== -dir.x || d.y !== -dir.y
          );
          dir = opts[Math.floor(Math.random() * opts.length)];
        }
      }
      ctx.fillStyle = "#03060a";
      ctx.fillRect(0, 0, canvas.width, canvas.height);
      ctx.strokeStyle = "rgba(0,80,203,0.06)";
      ctx.lineWidth = 0.5;
      for (let i = 0; i < canvas.width; i += 10) { ctx.beginPath(); ctx.moveTo(i, 0); ctx.lineTo(i, canvas.height); ctx.stroke(); }
      for (let j = 0; j < canvas.height; j += 10) { ctx.beginPath(); ctx.moveTo(0, j); ctx.lineTo(canvas.width, j); ctx.stroke(); }
      ctx.shadowColor = "#ff4444"; ctx.shadowBlur = 8;
      ctx.fillStyle = "#ff5555";
      ctx.fillRect(80, 40, 8, 8);
      ctx.shadowBlur = 0;
      snake.forEach((part, idx) => {
        ctx.shadowColor = idx === 0 ? "#0066ff" : "#6b38d4";
        ctx.shadowBlur = idx === 0 ? 10 : 4;
        ctx.fillStyle = idx === 0 ? "#0077ff" : `rgba(107,56,212,${0.9 - idx * 0.04})`;
        ctx.fillRect(part.x, part.y, 8, 8);
        ctx.shadowBlur = 0;
      });
      animId = requestAnimationFrame(draw);
    };
    draw();
    return () => cancelAnimationFrame(animId);
  }, []);

  /* ── Project data ── */
  const projects: ProjectCardData[] = [
    {
      id: "ultimate-mini-web-scraper",
      title: "Ultimate Mini Web Scraper",
      slug: "ultimate-mini-web-scraper",
      category: "Data Analytics",
      tags: ["Data Analytics", "Automation"],
      description: "A live, in-browser web crawler that fetches any URL via CORS proxy, parses the HTML with DOMParser, and extracts elements matching your CSS selector — all client-side.",
      technologies: ["TypeScript", "DOMParser API", "CORS Proxy", "Node.js"],
      accentColor: "#0066ff",
      glowColor: "#0066ff",
      githubUrl: "https://github.com/Romeo-Bess/ultimate-mini-web-scraper",
    },
    {
      id: "romeo-runner",
      title: "Romeo Runner",
      slug: "romeo-runner",
      category: "Automation",
      tags: ["Automation"],
      description: "A lab automation task runner that monitors hardware metrics, dispatches routing logic, and executes diagnostic cycles — shown here as a live terminal stream.",
      technologies: ["TypeScript", "Go", "Docker", "Linux"],
      accentColor: "#00d084",
      glowColor: "#00d084",
      githubUrl: "https://github.com/Romeo-Bess/Romeo-Runner",
      liveUrl: "https://romeo-runner.vercel.app/",
    },
    {
      id: "snake",
      title: "Retro Snake",
      slug: "snake",
      category: "Web Applications",
      tags: ["Web Applications"],
      description: "A polished HTML5 Canvas Snake game with smooth frame-rate movement, neon glow rendering, and boundary wrapping — runs live in your browser.",
      technologies: ["HTML5 Canvas", "JavaScript", "CSS3"],
      accentColor: "#a855f7",
      glowColor: "#a855f7",
      githubUrl: "https://github.com/Romeo-Bess/Snake",
    },
    {
      id: "music-app",
      title: "Music App",
      slug: "music-app",
      category: "Web Applications",
      tags: ["Web Applications"],
      description: "An in-browser audio engine built on the Web Audio API. Plays a programmatic pentatonic arpeggio sequencer with kick drums and real-time animated waveform.",
      technologies: ["React", "TypeScript", "Web Audio API", "Tailwind CSS"],
      accentColor: "#f59e0b",
      glowColor: "#f59e0b",
      githubUrl: "https://github.com/Romeo-Bess/Music-App",
    },
  ];

  const filtered = projects.filter((p) => {
    const matchCat = selectedCategory === "All" || p.tags.includes(selectedCategory);
    const matchSearch =
      p.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
      p.description.toLowerCase().includes(searchQuery.toLowerCase()) ||
      p.technologies.some((t) => t.toLowerCase().includes(searchQuery.toLowerCase()));
    return matchCat && matchSearch;
  });

  /* ── Screen content renderers ── */
  const renderScreen = (id: string) => {
    if (id === "ultimate-mini-web-scraper") {
      return (
        <div className="h-72 flex flex-col gap-2.5 p-4 bg-[#060a0f]">
          <div className="flex gap-2">
            <div className="flex-1">
              <label className="font-mono text-[8px] text-blue-400/70 uppercase tracking-widest block mb-1">Target URL</label>
              <input
                type="text"
                className="w-full bg-black/60 border border-blue-500/20 rounded-md px-2.5 py-1.5 text-[11px] text-blue-100 font-mono focus:outline-none focus:border-blue-400/60 placeholder:text-blue-400/30"
                value={scraperUrl}
                onChange={(e) => setScraperUrl(e.target.value)}
                placeholder="https://example.com"
              />
            </div>
            <div className="w-2/5">
              <label className="font-mono text-[8px] text-blue-400/70 uppercase tracking-widest block mb-1">CSS Selector</label>
              <input
                type="text"
                className="w-full bg-black/60 border border-blue-500/20 rounded-md px-2.5 py-1.5 text-[11px] text-blue-100 font-mono focus:outline-none focus:border-blue-400/60"
                value={scraperSelector}
                onChange={(e) => setScraperSelector(e.target.value)}
              />
            </div>
          </div>
          <button
            onClick={handleScrape}
            disabled={isScraping}
            className="w-full bg-blue-600/80 hover:bg-blue-500/90 text-white font-mono text-[10px] uppercase tracking-widest py-2 rounded-md flex items-center justify-center gap-2 transition-all disabled:opacity-50 border border-blue-400/20"
          >
            {isScraping ? (
              <><span className="w-3 h-3 border-2 border-white/50 border-t-white rounded-full animate-spin" />Fetching...</>
            ) : (
              <><span className="text-blue-300">▶</span> Run Scrape</>
            )}
          </button>
          <div className="flex-1 bg-black/70 rounded-md border border-white/5 p-2.5 overflow-y-auto font-mono text-[10px] space-y-1 min-h-0">
            {scrapeError && <div className="text-red-400">{scrapeError}</div>}
            {!scrapeError && scrapeResults.length === 0 && (
              <div className="text-blue-400/30 text-center pt-3 leading-relaxed">
                Awaiting scrape command.<br/>Enter URL → selector → run.
              </div>
            )}
            {!scrapeError && scrapeResults.map((r, i) => (
              <div key={i} className="border-b border-white/5 pb-1">
                <span className="text-blue-400 font-bold mr-1.5">[{i + 1}]</span>
                <span className="text-emerald-300">{r.text}</span>
              </div>
            ))}
          </div>
        </div>
      );
    }
    if (id === "romeo-runner") {
      return (
        <div className="h-72 bg-[#030508] flex flex-col font-mono text-[10px]">
          <div className="flex items-center gap-2 px-3 py-2 border-b border-white/5 bg-black/40">
            <div className="flex gap-1">
              <div className="w-2.5 h-2.5 rounded-full bg-red-500/70" />
              <div className="w-2.5 h-2.5 rounded-full bg-yellow-500/70" />
              <div className="w-2.5 h-2.5 rounded-full bg-green-500/70" />
            </div>
            <span className="text-emerald-400/60 text-[9px] tracking-widest">romeo-runner — bash</span>
          </div>
          <div className="flex-1 p-3 overflow-y-auto space-y-1 leading-relaxed">
            <div><span className="text-emerald-400">romeo@dev</span><span className="text-white/30">:~$</span> <span className="text-white/80">romeo-runner init --env production</span></div>
            {terminalLines.map((line, i) => {
              const isSuccess = line.startsWith("✓");
              const isCmd = line.startsWith("$");
              const isStep = line.startsWith("⟳");
              return (
                <div key={i} className={
                  isSuccess ? "text-emerald-400" :
                  isCmd ? "text-white/80" :
                  isStep ? "text-yellow-400/70" :
                  "text-white/35"
                }>
                  {isCmd && <><span className="text-emerald-400">romeo@dev</span><span className="text-white/30">:~</span> </>}
                  {line}
                </div>
              );
            })}
            <span className="inline-block w-1.5 h-3 bg-emerald-400 animate-pulse" />
          </div>
        </div>
      );
    }
    if (id === "snake") {
      return (
        <div className="h-72 flex items-center justify-center bg-[#03060a] relative">
          <canvas ref={snakeCanvasRef} width={300} height={240} className="w-full h-full object-cover" />
          <div className="absolute top-2 right-2 font-mono text-[8px] text-purple-400/60 uppercase tracking-widest">HTML5 Canvas</div>
        </div>
      );
    }
    if (id === "music-app") {
      return (
        <div className="h-72 bg-[#0a0a12] flex flex-col items-center justify-center gap-4 p-4">
          {/* Album art + controls */}
          <div className="w-full max-w-xs bg-black/50 border border-amber-400/10 rounded-xl p-4 flex flex-col gap-3">
            <div className="flex items-center gap-3">
              {/* Vinyl record */}
              <div className="w-12 h-12 rounded-full bg-gradient-to-br from-slate-800 to-slate-900 border-2 border-amber-400/20 flex items-center justify-center relative shrink-0" style={{ animation: isPlaying ? "spin 3s linear infinite" : "none" }}>
                <div className="w-3 h-3 rounded-full bg-amber-400/30 border border-amber-400/50" />
                <div className="absolute inset-2 rounded-full" style={{ background: "repeating-radial-gradient(circle at center, transparent 0px, transparent 2px, rgba(255,180,0,0.04) 2px, rgba(255,180,0,0.04) 3px)" }} />
              </div>
              <div className="flex-1 min-w-0">
                <div className="font-display font-semibold text-xs text-white truncate">Coding Beats</div>
                <div className="font-mono text-[9px] text-amber-400/50">Romeo Bessenaar</div>
              </div>
              <button
                onClick={togglePlayback}
                className="w-9 h-9 rounded-full flex items-center justify-center transition-all hover:scale-110 active:scale-95"
                style={{ background: "linear-gradient(135deg, #f59e0b, #d97706)", boxShadow: "0 0 20px rgba(245,158,11,0.4)" }}
              >
                {isPlaying ? <Pause className="w-4 h-4 text-black fill-black" /> : <Play className="w-4 h-4 text-black fill-black translate-x-0.5" />}
              </button>
            </div>

            {/* Progress bar */}
            <div className="flex items-center gap-2 font-mono text-[8px] text-white/30">
              <span>0:{Math.floor(progress * 0.6).toString().padStart(2, "0")}</span>
              <div className="flex-1 h-0.5 bg-white/10 rounded-full overflow-hidden">
                <div className="h-full rounded-full transition-all duration-300" style={{ width: `${progress}%`, background: "linear-gradient(90deg, #f59e0b, #d97706)" }} />
              </div>
              <span>1:00</span>
            </div>

            {/* Waveform visualizer */}
            <div className="flex items-end justify-center gap-0.5 h-10">
              {musicBars.map((h, i) => (
                <div
                  key={i}
                  className="rounded-full transition-all duration-200"
                  style={{
                    width: "3px",
                    height: `${isPlaying ? h : 12}%`,
                    background: `rgba(245,158,11,${0.4 + (i / musicBars.length) * 0.5})`,
                    boxShadow: isPlaying ? "0 0 4px rgba(245,158,11,0.4)" : "none",
                  }}
                />
              ))}
            </div>
          </div>

          <div className="font-mono text-[9px] text-amber-400/30 uppercase tracking-widest">Web Audio API · Live Synthesis</div>
        </div>
      );
    }
    return null;
  };

  return (
    <div className="min-h-screen w-full">
      {/* ── PAGE HEADER ─────────────────────────────────── */}
      <div className="max-w-[1280px] mx-auto px-margin-mobile md:px-margin-desktop pt-32 pb-12">
        <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.5 }}>
          <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-primary/10 border border-primary/20 text-xs font-mono text-primary mb-5">
            <Tv2 className="w-3.5 h-3.5" />
            <span>INTERACTIVE DEMOS — LIVE IN BROWSER</span>
          </div>
          <h1 className="font-display text-4xl sm:text-5xl md:text-6xl font-bold tracking-tight text-on-surface leading-[1.1] mb-4">
            Selected<br />
            <span className="text-gradient">Projects</span>
          </h1>
          <p className="font-body text-base text-on-surface-variant max-w-xl leading-relaxed mb-8">
            Every demo below runs live — no screenshots. Interact with the scraper, watch the snake move, hit play on the synth. Each project card is a working product.
          </p>

          {/* Filter bar */}
          <div className="flex flex-wrap gap-2">
            {["All", "Automation", "Data Analytics", "Web Applications"].map((cat) => (
              <button
                key={cat}
                onClick={() => setSelectedCategory(cat)}
                className={`px-4 py-2 rounded-full font-mono text-[10px] uppercase tracking-wider transition-all border ${
                  selectedCategory === cat
                    ? "bg-primary text-on-primary border-primary shadow-lg shadow-primary/20"
                    : "bg-surface-container-low text-on-surface-variant border-outline-variant/20 hover:border-primary/40 hover:text-primary"
                }`}
              >
                {cat}
              </button>
            ))}
            <input
              type="text"
              placeholder="Search…"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="px-4 py-2 rounded-full font-mono text-[10px] bg-surface-container-low border border-outline-variant/20 text-on-surface placeholder:text-outline focus:outline-none focus:border-primary/50 transition-colors"
            />
          </div>
        </motion.div>
      </div>

      {/* ── PROJECTS GRID ───────────────────────────────── */}
      <div className="max-w-[1280px] mx-auto px-margin-mobile md:px-margin-desktop pb-32">
        {filtered.length === 0 ? (
          <div className="py-24 text-center text-on-surface-variant font-body">
            No projects matched. Try adjusting your filters.
          </div>
        ) : (
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-start">

            {/* ── ROW 1: Scraper (wide) + Romeo Runner (narrow) ── */}
            {filtered.find((p) => p.id === "ultimate-mini-web-scraper") && (() => {
              const p = projects.find((x) => x.id === "ultimate-mini-web-scraper")!;
              return (
                <motion.div
                  key={p.id}
                  initial={{ opacity: 0, y: 30 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.1 }}
                  className="lg:col-span-7"
                >
                  <div className="glass-card rounded-2xl overflow-hidden border border-outline-variant/20 hover:border-primary/25 transition-all group">
                    {/* Screen */}
                    <div className="p-6 pb-4" style={{ background: "linear-gradient(135deg, rgba(0,102,255,0.04) 0%, transparent 60%)" }}>
                      <CRTScreen glowColor={p.glowColor} label="SCRAPER-v2.1">
                        {renderScreen(p.id)}
                      </CRTScreen>
                    </div>

                    {/* Info */}
                    <div className="px-7 pb-7 pt-2">
                      <div className="flex items-start justify-between mb-3">
                        <div>
                          <span className="font-mono text-[9px] uppercase tracking-widest text-primary/70 block mb-1">{p.category}</span>
                          <h2 className="font-display text-xl font-bold text-on-surface">{p.title}</h2>
                        </div>
                        <div className="flex items-center gap-2 mt-1">
                          <a href={p.githubUrl} target="_blank" rel="noreferrer" className="p-2 rounded-lg border border-outline-variant/20 text-on-surface-variant hover:text-primary hover:border-primary/30 transition-all">
                            <Github className="w-4 h-4" />
                          </a>
                        </div>
                      </div>
                      <p className="font-body text-sm text-on-surface-variant leading-relaxed mb-4">{p.description}</p>
                      <div className="flex flex-wrap gap-1.5 mb-5">
                        {p.technologies.map((t) => <TechBadge key={t} label={t} />)}
                      </div>
                      <Link to={`/projects/${p.slug}`} className="inline-flex items-center gap-1.5 text-xs font-mono font-bold text-primary hover:text-primary/80 transition-colors group/link">
                        <span>View Case Study</span>
                        <span className="group-hover/link:translate-x-0.5 transition-transform">→</span>
                      </Link>
                    </div>
                  </div>
                </motion.div>
              );
            })()}

            {filtered.find((p) => p.id === "romeo-runner") && (() => {
              const p = projects.find((x) => x.id === "romeo-runner")!;
              return (
                <motion.div
                  key={p.id}
                  initial={{ opacity: 0, y: 30 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.2 }}
                  className="lg:col-span-5"
                >
                  <div className="glass-card rounded-2xl overflow-hidden border border-outline-variant/20 hover:border-emerald-500/25 transition-all group h-full flex flex-col">
                    <div className="p-6 pb-4 flex-shrink-0" style={{ background: "linear-gradient(135deg, rgba(0,208,132,0.04) 0%, transparent 60%)" }}>
                      <CRTScreen glowColor={p.glowColor} label="TERMINAL">
                        {renderScreen(p.id)}
                      </CRTScreen>
                    </div>
                    <div className="px-7 pb-7 pt-2 flex flex-col flex-grow">
                      <span className="font-mono text-[9px] uppercase tracking-widest text-emerald-400/70 block mb-1">{p.category}</span>
                      <h2 className="font-display text-xl font-bold text-on-surface mb-2">{p.title}</h2>
                      <p className="font-body text-sm text-on-surface-variant leading-relaxed mb-4 flex-grow">{p.description}</p>
                      <div className="flex flex-wrap gap-1.5 mb-5">
                        {p.technologies.map((t) => <TechBadge key={t} label={t} />)}
                      </div>
                      <div className="flex gap-3">
                        <a href={p.githubUrl} target="_blank" rel="noreferrer" className="flex items-center gap-1.5 text-xs font-mono text-on-surface-variant hover:text-primary transition-colors border border-outline-variant/20 px-3 py-1.5 rounded-lg hover:border-primary/30">
                          <Github className="w-3.5 h-3.5" />Repository
                        </a>
                        {p.liveUrl && (
                          <a href={p.liveUrl} target="_blank" rel="noreferrer" className="flex items-center gap-1.5 text-xs font-mono text-on-primary px-4 py-1.5 rounded-lg transition-all" style={{ background: "linear-gradient(135deg, #00d084, #00b36e)", boxShadow: "0 4px 15px rgba(0,208,132,0.3)" }}>
                            <ExternalLink className="w-3.5 h-3.5" />Live Demo
                          </a>
                        )}
                      </div>
                    </div>
                  </div>
                </motion.div>
              );
            })()}

            {/* ── ROW 2: Snake + Music (equal halves) ── */}
            {filtered.find((p) => p.id === "snake") && (() => {
              const p = projects.find((x) => x.id === "snake")!;
              return (
                <motion.div
                  key={p.id}
                  initial={{ opacity: 0, y: 30 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.3 }}
                  className="lg:col-span-6"
                >
                  <div className="glass-card rounded-2xl overflow-hidden border border-outline-variant/20 hover:border-purple-500/25 transition-all group">
                    <div className="p-6 pb-4" style={{ background: "linear-gradient(135deg, rgba(168,85,247,0.05) 0%, transparent 60%)" }}>
                      <CRTScreen glowColor={p.glowColor} label="ARCADE-v1">
                        {renderScreen(p.id)}
                      </CRTScreen>
                    </div>
                    <div className="px-7 pb-7 pt-2">
                      <span className="font-mono text-[9px] uppercase tracking-widest text-purple-400/70 block mb-1">{p.category}</span>
                      <h2 className="font-display text-xl font-bold text-on-surface mb-2">{p.title}</h2>
                      <p className="font-body text-sm text-on-surface-variant leading-relaxed mb-4">{p.description}</p>
                      <div className="flex flex-wrap gap-1.5 mb-5">
                        {p.technologies.map((t) => <TechBadge key={t} label={t} />)}
                      </div>
                      <div className="flex items-center justify-between">
                        <a href={p.githubUrl} target="_blank" rel="noreferrer" className="flex items-center gap-1.5 text-xs font-mono text-on-surface-variant hover:text-primary transition-colors border border-outline-variant/20 px-3 py-1.5 rounded-lg hover:border-primary/30">
                          <Github className="w-3.5 h-3.5" />Repository
                        </a>
                        <Link to={`/projects/${p.slug}`} className="text-xs font-mono text-on-surface-variant/50 hover:text-primary transition-colors">
                          Case Study →
                        </Link>
                      </div>
                    </div>
                  </div>
                </motion.div>
              );
            })()}

            {filtered.find((p) => p.id === "music-app") && (() => {
              const p = projects.find((x) => x.id === "music-app")!;
              return (
                <motion.div
                  key={p.id}
                  initial={{ opacity: 0, y: 30 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.4 }}
                  className="lg:col-span-6"
                >
                  <div className="glass-card rounded-2xl overflow-hidden border border-outline-variant/20 hover:border-amber-500/25 transition-all group">
                    <div className="p-6 pb-4" style={{ background: "linear-gradient(135deg, rgba(245,158,11,0.05) 0%, transparent 60%)" }}>
                      <CRTScreen glowColor={p.glowColor} label="PLAYER-v3">
                        {renderScreen(p.id)}
                      </CRTScreen>
                    </div>
                    <div className="px-7 pb-7 pt-2">
                      <span className="font-mono text-[9px] uppercase tracking-widest text-amber-400/70 block mb-1">{p.category}</span>
                      <h2 className="font-display text-xl font-bold text-on-surface mb-2">{p.title}</h2>
                      <p className="font-body text-sm text-on-surface-variant leading-relaxed mb-4">{p.description}</p>
                      <div className="flex flex-wrap gap-1.5 mb-5">
                        {p.technologies.map((t) => <TechBadge key={t} label={t} />)}
                      </div>
                      <div className="flex items-center justify-between">
                        <a href={p.githubUrl} target="_blank" rel="noreferrer" className="flex items-center gap-1.5 text-xs font-mono text-on-surface-variant hover:text-primary transition-colors border border-outline-variant/20 px-3 py-1.5 rounded-lg hover:border-primary/30">
                          <Github className="w-3.5 h-3.5" />Repository
                        </a>
                        <Link to={`/projects/${p.slug}`} className="text-xs font-mono text-on-surface-variant/50 hover:text-primary transition-colors">
                          Case Study →
                        </Link>
                      </div>
                    </div>
                  </div>
                </motion.div>
              );
            })()}
          </div>
        )}
      </div>

      {/* ── BOTTOM CTA ─────────────────────────────────── */}
      <div className="border-t border-outline-variant/15 py-20 text-center px-margin-mobile">
        <p className="font-mono text-xs text-on-surface-variant/40 uppercase tracking-widest mb-3">All projects are open source</p>
        <a
          href="https://github.com/Romeo-Bess"
          target="_blank"
          rel="noreferrer"
          className="inline-flex items-center gap-2 text-sm font-mono font-semibold text-primary hover:text-primary/80 transition-colors"
        >
          <Github className="w-4 h-4" />
          View all repositories on GitHub →
        </a>
      </div>

      {/* Vinyl spin animation */}
      <style>{`@keyframes spin { from { transform: rotate(0deg); } to { transform: rotate(360deg); } }`}</style>
    </div>
  );
};

export default Projects;
