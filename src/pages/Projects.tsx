import React, { useEffect, useState, useRef } from "react";
import { Link } from "react-router-dom";
import { Play, Pause, ExternalLink, Github, Monitor } from "lucide-react";
import { motion } from "framer-motion";

/* ────────────────────────────────────────────────────────────
   CRT Monitor Frame
──────────────────────────────────────────────────────────── */
interface CRTProps {
  children: React.ReactNode;
  glowColor: string;
  label?: string;
}

const CRTScreen: React.FC<CRTProps> = ({ children, glowColor, label }) => (
  <div className="relative flex flex-col items-center w-full">
    {/* Outer bezel */}
    <div
      className="relative w-full rounded-2xl overflow-hidden"
      style={{
        background: "linear-gradient(145deg,#1e2433 0%,#0d1017 55%,#1a1f2e 100%)",
        padding: "10px 10px 6px",
        boxShadow: `0 0 0 1.5px rgba(255,255,255,0.05), 0 0 45px ${glowColor}44, 0 24px 64px rgba(0,0,0,0.65)`,
      }}
    >
      {/* Bezel top bar */}
      <div className="flex items-center justify-between mb-2 px-1">
        <div className="flex items-center gap-1.5">
          <div className="w-1.5 h-1.5 rounded-full bg-white/10" />
          <span className="font-mono text-[8px] text-white/15 uppercase tracking-widest">ROMEO.DEV</span>
        </div>
        {label && <span className="font-mono text-[8px] uppercase tracking-widest text-white/15">{label}</span>}
        <div
          className="w-2 h-2 rounded-full"
          style={{ background: `${glowColor}cc`, boxShadow: `0 0 6px ${glowColor}` }}
        />
      </div>

      {/* Screen */}
      <div className="relative rounded-lg overflow-hidden" style={{ background: "#030508" }}>
        {children}

        {/* Scanlines */}
        <div
          className="absolute inset-0 pointer-events-none z-10"
          style={{
            background:
              "repeating-linear-gradient(0deg,rgba(0,0,0,0.09) 0px,rgba(0,0,0,0.09) 1px,transparent 1px,transparent 3px)",
          }}
        />
        {/* Glass sheen */}
        <div
          className="absolute inset-0 pointer-events-none z-10"
          style={{
            background:
              "linear-gradient(135deg,rgba(255,255,255,0.045) 0%,transparent 45%,rgba(255,255,255,0.015) 100%)",
          }}
        />
        {/* Inner vignette */}
        <div
          className="absolute inset-0 pointer-events-none z-10 rounded-lg"
          style={{ boxShadow: "inset 0 0 45px rgba(0,0,0,0.55)" }}
        />
        {/* Colour bleed */}
        <div
          className="absolute inset-0 pointer-events-none z-[9] rounded-lg"
          style={{ boxShadow: `inset 0 0 22px ${glowColor}1a` }}
        />
      </div>

      {/* Speaker dots */}
      <div className="flex justify-center gap-0.5 mt-2">
        {Array.from({ length: 18 }).map((_, i) => (
          <div key={i} className="w-px h-1.5 rounded-full" style={{ background: "rgba(255,255,255,0.07)" }} />
        ))}
      </div>
    </div>

    {/* Neck */}
    <div
      className="w-10 h-4"
      style={{
        background: "linear-gradient(180deg,#1a1f2e,#141820)",
        clipPath: "polygon(20% 0%,80% 0%,100% 100%,0% 100%)",
      }}
    />
    {/* Stand */}
    <div
      className="h-2 rounded-b-lg"
      style={{
        width: "55%",
        background: "linear-gradient(180deg,#1a2030,#0f1318)",
        boxShadow: `0 4px 14px rgba(0,0,0,0.5), 0 0 18px ${glowColor}1a`,
      }}
    />
    {/* Base */}
    <div
      className="h-1 mt-px rounded-full"
      style={{ width: "68%", background: "linear-gradient(90deg,transparent,#1a2030,transparent)" }}
    />
  </div>
);

/* ────────────────────────────────────────────────────────────
   Tech Badge
──────────────────────────────────────────────────────────── */
const TechBadge: React.FC<{ label: string }> = ({ label }) => (
  <span className="px-2 py-0.5 rounded-md bg-surface-container-high text-[10px] font-mono text-on-surface-variant border border-outline-variant/15">
    {label}
  </span>
);

/* ────────────────────────────────────────────────────────────
   Projects Page
──────────────────────────────────────────────────────────── */
export const Projects: React.FC = () => {
  const [searchQuery, setSearchQuery] = useState("");
  const [selectedCategory, setSelectedCategory] = useState("All");

  /* ── Terminal animation ── */
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
    const id = setInterval(() => {
      setTerminalLines((prev) => [...prev, lines[i % lines.length]].slice(-8));
      i++;
    }, 800);
    return () => clearInterval(id);
  }, []);

  /* ── Music player ── */
  const [musicBars, setMusicBars] = useState<number[]>(() =>
    Array.from({ length: 18 }, () => 10 + Math.random() * 80)
  );
  const [progress, setProgress] = useState(0);
  const [isPlaying, setIsPlaying] = useState(false);
  const audioCtxRef = useRef<AudioContext | null>(null);
  const gainRef = useRef<GainNode | null>(null);
  const seqRef = useRef<ReturnType<typeof setInterval> | null>(null);
  const arpScale = [130.81, 146.83, 164.81, 196.0, 220.0, 261.63, 293.66, 329.63];

  const stopAudio = () => {
    setIsPlaying(false);
    if (seqRef.current) { clearInterval(seqRef.current); seqRef.current = null; }
  };

  const startAudio = () => {
    if (!audioCtxRef.current) {
      const AC = (window as any).AudioContext || (window as any).webkitAudioContext;
      audioCtxRef.current = new AC();
      gainRef.current = audioCtxRef.current.createGain();
      gainRef.current.gain.value = 0.28;
      gainRef.current.connect(audioCtxRef.current.destination);
    }
    if (audioCtxRef.current.state === "suspended") audioCtxRef.current.resume();
    setIsPlaying(true);
    const ctx = audioCtxRef.current;
    const dest = gainRef.current!;
    let step = 0;
    seqRef.current = setInterval(() => {
      const t = ctx.currentTime;
      if (step % 4 === 0) {
        const o = ctx.createOscillator(); const g = ctx.createGain();
        o.connect(g); g.connect(dest);
        o.frequency.setValueAtTime(130, t);
        o.frequency.exponentialRampToValueAtTime(0.01, t + 0.12);
        g.gain.setValueAtTime(1.0, t); g.gain.exponentialRampToValueAtTime(0.01, t + 0.12);
        o.start(t); o.stop(t + 0.13);
      }
      const o2 = ctx.createOscillator(); const g2 = ctx.createGain();
      o2.type = "sine"; o2.connect(g2); g2.connect(dest);
      o2.frequency.setValueAtTime(arpScale[step % 8], t);
      g2.gain.setValueAtTime(0.18, t); g2.gain.exponentialRampToValueAtTime(0.01, t + 0.22);
      o2.start(t); o2.stop(t + 0.24);
      step = (step + 1) % 8;
    }, 250);
  };

  const togglePlay = () => (isPlaying ? stopAudio() : startAudio());

  useEffect(() => {
    const id = setInterval(() => {
      setMusicBars(Array.from({ length: 18 }, () => 8 + Math.random() * 85));
      setProgress((p) => (p >= 100 ? 0 : p + 1));
    }, 280);
    return () => clearInterval(id);
  }, []);

  useEffect(() => () => { if (seqRef.current) clearInterval(seqRef.current); }, []);

  /* ── Web Scraper ── */
  const [scraperUrl, setScraperUrl] = useState("https://news.ycombinator.com");
  const [scraperSelector, setScraperSelector] = useState(".titleline a");
  const [scrapeResults, setScrapeResults] = useState<{ text: string; href?: string }[]>([]);
  const [isScraping, setIsScraping] = useState(false);
  const [scrapeError, setScrapeError] = useState("");

  const handleScrape = async () => {
    if (!scraperUrl.trim()) return;
    setIsScraping(true); setScrapeError(""); setScrapeResults([]);
    try {
      const res = await fetch(`https://api.allorigins.win/get?url=${encodeURIComponent(scraperUrl)}`);
      if (!res.ok) throw new Error();
      const { contents } = await res.json();
      const doc = new DOMParser().parseFromString(contents, "text/html");
      const nodes = doc.querySelectorAll(scraperSelector);
      const out: { text: string; href?: string }[] = [];
      nodes.forEach((el) => {
        const text = el.textContent?.trim() || "";
        let href = el.getAttribute("href") || undefined;
        if (href?.startsWith("/")) { try { href = new URL(scraperUrl).origin + href; } catch (_) {} }
        if (text) out.push({ text, href });
      });
      if (!out.length) setScrapeError("No elements matched. Try a different selector.");
      else setScrapeResults(out.slice(0, 8));
    } catch {
      setScrapeError("CORS proxy error. Try another domain.");
    } finally {
      setIsScraping(false);
    }
  };

  /* ── Snake ── */
  const snakeRef = useRef<HTMLCanvasElement>(null);
  useEffect(() => {
    const canvas = snakeRef.current; if (!canvas) return;
    const ctx = canvas.getContext("2d"); if (!ctx) return;
    let snake = [{ x: 50, y: 50 }, { x: 40, y: 50 }, { x: 30, y: 50 }];
    let dir = { x: 10, y: 0 }, frame = 0, animId: number;
    const tick = () => {
      frame++;
      if (frame % 7 === 0) {
        const h = { x: snake[0].x + dir.x, y: snake[0].y + dir.y };
        if (h.x >= canvas.width) h.x = 0; if (h.x < 0) h.x = canvas.width - 10;
        if (h.y >= canvas.height) h.y = 0; if (h.y < 0) h.y = canvas.height - 10;
        snake = [h, ...snake.slice(0, -1)];
        if (Math.random() < 0.14) {
          const opts = [{ x: 10, y: 0 }, { x: -10, y: 0 }, { x: 0, y: 10 }, { x: 0, y: -10 }].filter(
            (d) => !(d.x === -dir.x && d.y === -dir.y)
          );
          dir = opts[Math.floor(Math.random() * opts.length)];
        }
      }
      ctx.fillStyle = "#03060a";
      ctx.fillRect(0, 0, canvas.width, canvas.height);
      ctx.strokeStyle = "rgba(0,80,203,0.06)"; ctx.lineWidth = 0.5;
      for (let i = 0; i < canvas.width; i += 10) { ctx.beginPath(); ctx.moveTo(i,0); ctx.lineTo(i,canvas.height); ctx.stroke(); }
      for (let j = 0; j < canvas.height; j += 10) { ctx.beginPath(); ctx.moveTo(0,j); ctx.lineTo(canvas.width,j); ctx.stroke(); }
      ctx.shadowColor="#ff4444"; ctx.shadowBlur=8; ctx.fillStyle="#ff5555"; ctx.fillRect(80,40,8,8); ctx.shadowBlur=0;
      snake.forEach((p,i) => {
        ctx.shadowColor = i===0 ? "#0066ff":"#6b38d4"; ctx.shadowBlur = i===0?12:5;
        ctx.fillStyle = i===0 ? "#0077ff":`rgba(107,56,212,${Math.max(0.2,0.9-i*0.05)})`;
        ctx.fillRect(p.x,p.y,8,8); ctx.shadowBlur=0;
      });
      animId = requestAnimationFrame(tick);
    };
    tick();
    return () => cancelAnimationFrame(animId);
  }, []);

  /* ── Screen content ── */
  const renderScreen = (id: string) => {
    if (id === "scraper") return (
      <div className="h-72 flex flex-col gap-2.5 p-4 bg-[#060a0f]">
        <div className="flex gap-2">
          <div className="flex-1">
            <label className="font-mono text-[8px] text-blue-400/60 uppercase tracking-widest block mb-1">Target URL</label>
            <input type="text" value={scraperUrl} onChange={(e) => setScraperUrl(e.target.value)}
              className="w-full bg-black/60 border border-blue-500/20 rounded-md px-2.5 py-1.5 text-[11px] text-blue-100 font-mono focus:outline-none focus:border-blue-400/50"
              placeholder="https://example.com" />
          </div>
          <div className="w-2/5">
            <label className="font-mono text-[8px] text-blue-400/60 uppercase tracking-widest block mb-1">CSS Selector</label>
            <input type="text" value={scraperSelector} onChange={(e) => setScraperSelector(e.target.value)}
              className="w-full bg-black/60 border border-blue-500/20 rounded-md px-2.5 py-1.5 text-[11px] text-blue-100 font-mono focus:outline-none focus:border-blue-400/50" />
          </div>
        </div>
        <button onClick={handleScrape} disabled={isScraping}
          className="w-full bg-blue-600/80 hover:bg-blue-500/90 text-white font-mono text-[10px] uppercase tracking-widest py-2 rounded-md flex items-center justify-center gap-2 transition-all disabled:opacity-50 border border-blue-400/15">
          {isScraping
            ? <><span className="w-3 h-3 border-2 border-white/40 border-t-white rounded-full animate-spin" />Fetching…</>
            : <><span className="text-blue-300 text-xs">▶</span> Run Scrape</>}
        </button>
        <div className="flex-1 bg-black/70 rounded-md border border-white/5 p-2.5 overflow-y-auto font-mono text-[10px] space-y-1 min-h-0">
          {scrapeError && <div className="text-red-400">{scrapeError}</div>}
          {!scrapeError && !scrapeResults.length && (
            <div className="text-blue-400/25 text-center pt-3 leading-relaxed">Awaiting command.<br />Enter URL → selector → run.</div>
          )}
          {!scrapeError && scrapeResults.map((r, i) => (
            <div key={i} className="border-b border-white/5 pb-1">
              <span className="text-blue-400 font-bold mr-1">[{i+1}]</span>
              <span className="text-emerald-300">{r.text}</span>
            </div>
          ))}
        </div>
      </div>
    );

    if (id === "runner") return (
      <div className="h-72 bg-[#030508] flex flex-col font-mono text-[10px]">
        <div className="flex items-center gap-2 px-3 py-2 border-b border-white/5 bg-black/40">
          <div className="flex gap-1">
            <div className="w-2 h-2 rounded-full bg-red-500/70" />
            <div className="w-2 h-2 rounded-full bg-yellow-500/70" />
            <div className="w-2 h-2 rounded-full bg-green-500/70" />
          </div>
          <span className="text-emerald-400/50 text-[9px] tracking-widest ml-1">romeo-runner — bash</span>
        </div>
        <div className="flex-1 p-3 overflow-y-auto space-y-0.5 leading-relaxed">
          <div><span className="text-emerald-400">romeo@dev</span><span className="text-white/30">:~$ </span><span className="text-white/75">romeo-runner init --env production</span></div>
          {terminalLines.map((line, i) => (
            <div key={i} className={
              line.startsWith("✓") ? "text-emerald-400" :
              line.startsWith("$") ? "text-white/75" :
              line.startsWith("⟳") ? "text-yellow-400/70" :
              "text-white/30"
            }>
              {line.startsWith("$") && <><span className="text-emerald-400">romeo@dev</span><span className="text-white/30">:~</span>{" "}</>}
              {line}
            </div>
          ))}
          <span className="inline-block w-1.5 h-3 bg-emerald-400 animate-pulse ml-0.5" />
        </div>
      </div>
    );

    if (id === "snake") return (
      <div className="h-72 relative bg-[#03060a]">
        <canvas ref={snakeRef} width={300} height={240} className="w-full h-full object-cover" />
        <div className="absolute top-2 right-2 font-mono text-[8px] text-purple-400/50 uppercase tracking-widest">HTML5 Canvas</div>
      </div>
    );

    if (id === "music") return (
      <div className="h-72 bg-[#0a0a12] flex flex-col items-center justify-center gap-3 p-5">
        <div className="w-full max-w-xs bg-black/50 border border-amber-400/10 rounded-xl p-4 flex flex-col gap-3">
          <div className="flex items-center gap-3">
            {/* Vinyl */}
            <div className="w-12 h-12 rounded-full border-2 border-amber-400/20 flex items-center justify-center relative shrink-0 overflow-hidden"
              style={{
                background: "radial-gradient(circle,#1a1a2e 30%,#0f0f1a 100%)",
                animation: isPlaying ? "vinylSpin 3s linear infinite" : "none",
              }}>
              <div className="absolute inset-0 rounded-full"
                style={{ background:"repeating-radial-gradient(circle at center,transparent 0,transparent 2px,rgba(255,180,0,0.04) 2px,rgba(255,180,0,0.04) 3px)" }} />
              <div className="w-3 h-3 rounded-full bg-amber-400/40 border border-amber-400/60 relative z-10" />
            </div>
            <div className="flex-1 min-w-0">
              <div className="font-display font-semibold text-xs text-white truncate">Coding Beats</div>
              <div className="font-mono text-[9px] text-amber-400/50 mt-0.5">Romeo Bessenaar</div>
            </div>
            <button onClick={togglePlay}
              className="w-9 h-9 rounded-full flex items-center justify-center shrink-0 hover:scale-110 active:scale-95 transition-transform"
              style={{ background:"linear-gradient(135deg,#f59e0b,#d97706)", boxShadow:"0 0 20px rgba(245,158,11,0.4)" }}>
              {isPlaying
                ? <Pause className="w-4 h-4 text-black fill-black" />
                : <Play className="w-4 h-4 text-black fill-black translate-x-0.5" />}
            </button>
          </div>
          {/* Progress */}
          <div className="flex items-center gap-2 font-mono text-[8px] text-white/25">
            <span>0:{Math.floor(progress * 0.6).toString().padStart(2,"0")}</span>
            <div className="flex-1 h-0.5 bg-white/10 rounded-full overflow-hidden">
              <div className="h-full rounded-full transition-all duration-300"
                style={{ width:`${progress}%`, background:"linear-gradient(90deg,#f59e0b,#d97706)" }} />
            </div>
            <span>1:00</span>
          </div>
          {/* Waveform */}
          <div className="flex items-end justify-center gap-0.5 h-10">
            {musicBars.map((h, i) => (
              <div key={i} className="rounded-full transition-all duration-200" style={{
                width:"3px",
                height:`${isPlaying ? h : 10}%`,
                background:`rgba(245,158,11,${0.35+(i/musicBars.length)*0.55})`,
                boxShadow: isPlaying ? "0 0 5px rgba(245,158,11,0.35)":"none",
              }} />
            ))}
          </div>
        </div>
        <p className="font-mono text-[9px] text-amber-400/25 uppercase tracking-widest">Web Audio API · Live Synthesis</p>
      </div>
    );

    return null;
  };

  /* ── Project definitions ── */
  const allProjects = [
    {
      id: "scraper", screenId: "scraper", slug: "ultimate-mini-web-scraper",
      title: "Ultimate Mini Web Scraper", category: "Data Analytics", tags: ["Data Analytics","Automation"],
      description: "A live in-browser web crawler. Enter any URL and a CSS selector — it fetches via CORS proxy, parses the HTML with DOMParser, and extracts matching elements in real time.",
      technologies: ["TypeScript","DOMParser API","CORS Proxy","Node.js"],
      glow: "#0066ff", colSpan: "lg:col-span-7",
      github: "https://github.com/Romeo-Bess/ultimate-mini-web-scraper", live: null,
    },
    {
      id: "runner", screenId: "runner", slug: "romeo-runner",
      title: "Romeo Runner", category: "Automation", tags: ["Automation"],
      description: "A lab automation task runner that dispatches hardware routing logic and executes diagnostic cycles — watch the live terminal output stream in real time.",
      technologies: ["TypeScript","Go","Docker","Linux"],
      glow: "#00d084", colSpan: "lg:col-span-5",
      github: "https://github.com/Romeo-Bess/Romeo-Runner", live: "https://romeo-runner.vercel.app/",
    },
    {
      id: "snake", screenId: "snake", slug: "snake",
      title: "Retro Snake", category: "Web Applications", tags: ["Web Applications"],
      description: "A polished HTML5 Canvas Snake game with neon glow rendering per segment, smooth frame-rate movement, and boundary wrapping — fully interactive.",
      technologies: ["HTML5 Canvas","JavaScript","CSS3"],
      glow: "#a855f7", colSpan: "lg:col-span-6",
      github: "https://github.com/Romeo-Bess/Snake", live: null,
    },
    {
      id: "music", screenId: "music", slug: "music-app",
      title: "Music App", category: "Web Applications", tags: ["Web Applications"],
      description: "An in-browser audio engine built on the Web Audio API. Programmatically synthesises a pentatonic arpeggio with kick drums — hit play and watch the waveform animate.",
      technologies: ["React","TypeScript","Web Audio API","Tailwind CSS"],
      glow: "#f59e0b", colSpan: "lg:col-span-6",
      github: "https://github.com/Romeo-Bess/Music-App", live: null,
    },
  ];

  const filtered = allProjects.filter((p) => {
    const matchCat = selectedCategory === "All" || p.tags.includes(selectedCategory);
    const q = searchQuery.toLowerCase();
    const matchSearch = !q || p.title.toLowerCase().includes(q) || p.description.toLowerCase().includes(q) || p.technologies.some((t) => t.toLowerCase().includes(q));
    return matchCat && matchSearch;
  });

  return (
    <div className="min-h-screen w-full">
      {/* ── Header ── */}
      <div className="max-w-[1280px] mx-auto px-margin-mobile md:px-margin-desktop pt-32 pb-12">
        <motion.div initial={{ opacity:0, y:20 }} animate={{ opacity:1, y:0 }} transition={{ duration:0.5 }}>
          <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-primary/10 border border-primary/20 text-xs font-mono text-primary mb-5">
            <Monitor className="w-3.5 h-3.5" />
            <span>INTERACTIVE DEMOS — LIVE IN BROWSER</span>
          </div>
          <h1 className="font-display text-4xl sm:text-5xl md:text-6xl font-bold tracking-tight text-on-surface leading-[1.1] mb-4">
            Selected<br />
            <span className="text-gradient">Projects</span>
          </h1>
          <p className="font-body text-base text-on-surface-variant max-w-xl leading-relaxed mb-8">
            Every demo below runs live — no screenshots, no fakes. Interact with the scraper, watch the snake move, hit play on the synth. Each card is a working product.
          </p>
          {/* Filters */}
          <div className="flex flex-wrap gap-2">
            {["All","Automation","Data Analytics","Web Applications"].map((cat) => (
              <button key={cat} onClick={() => setSelectedCategory(cat)}
                className={`px-4 py-2 rounded-full font-mono text-[10px] uppercase tracking-wider transition-all border ${
                  selectedCategory === cat
                    ? "bg-primary text-on-primary border-primary shadow-lg shadow-primary/20"
                    : "bg-surface-container-low text-on-surface-variant border-outline-variant/20 hover:border-primary/40 hover:text-primary"
                }`}>
                {cat}
              </button>
            ))}
            <input type="text" placeholder="Search…" value={searchQuery} onChange={(e) => setSearchQuery(e.target.value)}
              className="px-4 py-2 rounded-full font-mono text-[10px] bg-surface-container-low border border-outline-variant/20 text-on-surface placeholder:text-outline focus:outline-none focus:border-primary/50 transition-colors" />
          </div>
        </motion.div>
      </div>

      {/* ── Grid ── */}
      <div className="max-w-[1280px] mx-auto px-margin-mobile md:px-margin-desktop pb-32">
        {filtered.length === 0 ? (
          <div className="py-24 text-center text-on-surface-variant font-body">No projects matched. Try adjusting your filters.</div>
        ) : (
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-start">
            {filtered.map((project, idx) => (
              <motion.div
                key={project.id}
                initial={{ opacity:0, y:30 }}
                animate={{ opacity:1, y:0 }}
                transition={{ delay: idx * 0.1 }}
                className={project.colSpan}
              >
                <div
                  className="glass-card rounded-2xl overflow-hidden border border-outline-variant/20 transition-all group flex flex-col h-full"
                  style={{ "--hover-glow": project.glow } as React.CSSProperties}
                  onMouseEnter={(e) => {
                    (e.currentTarget as HTMLElement).style.borderColor = `${project.glow}44`;
                    (e.currentTarget as HTMLElement).style.boxShadow = `0 0 30px ${project.glow}15`;
                  }}
                  onMouseLeave={(e) => {
                    (e.currentTarget as HTMLElement).style.borderColor = "";
                    (e.currentTarget as HTMLElement).style.boxShadow = "";
                  }}
                >
                  {/* Monitor section */}
                  <div className="p-6 pb-4 flex-shrink-0" style={{ background:`linear-gradient(135deg,${project.glow}08 0%,transparent 60%)` }}>
                    <CRTScreen glowColor={project.glow} label={project.id.toUpperCase()}>
                      {renderScreen(project.screenId)}
                    </CRTScreen>
                  </div>

                  {/* Info section */}
                  <div className="px-7 pb-7 pt-3 flex flex-col flex-grow">
                    <div className="flex items-start justify-between mb-2">
                      <div>
                        <span className="font-mono text-[9px] uppercase tracking-widest block mb-1" style={{ color:`${project.glow}bb` }}>
                          {project.category}
                        </span>
                        <h2 className="font-display text-xl font-bold text-on-surface">{project.title}</h2>
                      </div>
                      <a href={project.github} target="_blank" rel="noreferrer"
                        className="p-2 rounded-lg border border-outline-variant/20 text-on-surface-variant hover:text-primary hover:border-primary/30 transition-all mt-1 shrink-0">
                        <Github className="w-4 h-4" />
                      </a>
                    </div>

                    <p className="font-body text-sm text-on-surface-variant leading-relaxed mb-4 flex-grow">
                      {project.description}
                    </p>

                    <div className="flex flex-wrap gap-1.5 mb-5">
                      {project.technologies.map((t) => <TechBadge key={t} label={t} />)}
                    </div>

                    <div className="flex items-center gap-3 flex-wrap">
                      {project.live && (
                        <a href={project.live} target="_blank" rel="noreferrer"
                          className="flex items-center gap-1.5 text-xs font-mono text-black px-4 py-2 rounded-lg transition-all font-semibold"
                          style={{ background:`linear-gradient(135deg,${project.glow},${project.glow}cc)`, boxShadow:`0 4px 14px ${project.glow}40` }}>
                          <ExternalLink className="w-3.5 h-3.5" />Live Demo
                        </a>
                      )}
                      <Link to={`/projects/${project.slug}`}
                        className="text-xs font-mono font-semibold transition-colors hover:underline"
                        style={{ color:`${project.glow}cc` }}>
                        Case Study →
                      </Link>
                    </div>
                  </div>
                </div>
              </motion.div>
            ))}
          </div>
        )}
      </div>

      {/* ── Footer CTA ── */}
      <div className="border-t border-outline-variant/15 py-20 text-center px-margin-mobile">
        <p className="font-mono text-xs text-on-surface-variant/35 uppercase tracking-widest mb-3">All projects are open source</p>
        <a href="https://github.com/Romeo-Bess" target="_blank" rel="noreferrer"
          className="inline-flex items-center gap-2 text-sm font-mono font-semibold text-primary hover:opacity-80 transition-opacity">
          <Github className="w-4 h-4" />
          View all repositories on GitHub →
        </a>
      </div>

      {/* Vinyl animation */}
      <style>{`@keyframes vinylSpin{from{transform:rotate(0deg)}to{transform:rotate(360deg)}}`}</style>
    </div>
  );
};

export default Projects;
