import React, { useEffect, useState, useRef } from "react";
import { Link } from "react-router-dom";
import { Play, Pause, ExternalLink, GitBranch, ArrowUpRight, ChevronRight } from "lucide-react";
import { motion } from "framer-motion";

/* ─── Tech pill ─────────────────────────────────────────── */
const Tag: React.FC<{ label: string; color: string }> = ({ label, color }) => (
  <span
    className="px-3 py-1 rounded-full text-[10px] font-mono font-semibold border"
    style={{ color, borderColor: `${color}44`, background: `${color}10` }}
  >
    {label}
  </span>
);

/* ─── Section divider ───────────────────────────────────── */
const Divider = () => (
  <div className="w-full h-px bg-gradient-to-r from-transparent via-outline-variant/30 to-transparent" />
);

export const Projects: React.FC = () => {
  /* ── Terminal lines (Romeo Runner) ── */
  const [terminalLines, setTerminalLines] = useState<string[]>([]);
  useEffect(() => {
    const lines = [
      "✓ System initialised.",
      "$ romeo-runner run --target pathology_pack",
      "⟳  Loading hardware modules...",
      "✓ Liquid handler online (1.2s)",
      "⟳  Step 1/8: tissue embedding...",
      "✓ Step 1 complete (0.4s)",
      "⟳  Step 2/8: microtomy sectioning...",
      "✓ Step 2 complete (0.6s)",
      "⟳  Step 3/8: H&E staining protocol...",
      "✓ Step 3 complete (0.9s)",
      "⟳  Step 4/8: coverslipping...",
      "✓ All 8 steps passed. Total: 4.2s",
    ];
    let i = 0;
    const id = setInterval(() => {
      setTerminalLines((p) => [...p, lines[i % lines.length]].slice(-10));
      i++;
    }, 750);
    return () => clearInterval(id);
  }, []);

  /* ── Music player ── */
  const [musicBars, setMusicBars] = useState<number[]>(() =>
    Array.from({ length: 24 }, () => 10 + Math.random() * 80)
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
      gainRef.current.gain.value = 0.25;
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
        o.frequency.setValueAtTime(130, t); o.frequency.exponentialRampToValueAtTime(0.01, t + 0.12);
        g.gain.setValueAtTime(0.9, t); g.gain.exponentialRampToValueAtTime(0.01, t + 0.12);
        o.start(t); o.stop(t + 0.13);
      }
      const o2 = ctx.createOscillator(); const g2 = ctx.createGain();
      o2.type = "sine"; o2.connect(g2); g2.connect(dest);
      o2.frequency.setValueAtTime(arpScale[step % 8], t);
      g2.gain.setValueAtTime(0.15, t); g2.gain.exponentialRampToValueAtTime(0.01, t + 0.22);
      o2.start(t); o2.stop(t + 0.24);
      step = (step + 1) % 8;
    }, 250);
  };
  const togglePlay = () => (isPlaying ? stopAudio() : startAudio());

  useEffect(() => {
    const id = setInterval(() => {
      setMusicBars(Array.from({ length: 24 }, () => 6 + Math.random() * 88));
      setProgress((p) => (p >= 100 ? 0 : p + 1));
    }, 260);
    return () => clearInterval(id);
  }, []);
  useEffect(() => () => { if (seqRef.current) clearInterval(seqRef.current); }, []);

  /* ── Web scraper ── */
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
      const out: { text: string; href?: string }[] = [];
      doc.querySelectorAll(scraperSelector).forEach((el) => {
        const text = el.textContent?.trim() || "";
        let href = el.getAttribute("href") || undefined;
        if (href?.startsWith("/")) { try { href = new URL(scraperUrl).origin + href; } catch (_) {} }
        if (text) out.push({ text, href });
      });
      if (!out.length) setScrapeError("No elements found. Try a different selector.");
      else setScrapeResults(out.slice(0, 10));
    } catch { setScrapeError("Fetch failed. Try another URL."); }
    finally { setIsScraping(false); }
  };

  /* ── Snake ── */
  const snakeRef = useRef<HTMLCanvasElement>(null);
  useEffect(() => {
    const canvas = snakeRef.current; if (!canvas) return;
    const ctx = canvas.getContext("2d"); if (!ctx) return;
    let snake = [{ x: 80, y: 80 }, { x: 70, y: 80 }, { x: 60, y: 80 }];
    let dir = { x: 10, y: 0 }, frame = 0, animId: number;
    const tick = () => {
      frame++;
      if (frame % 6 === 0) {
        const h = { x: snake[0].x + dir.x, y: snake[0].y + dir.y };
        if (h.x >= canvas.width) h.x = 0; if (h.x < 0) h.x = canvas.width - 10;
        if (h.y >= canvas.height) h.y = 0; if (h.y < 0) h.y = canvas.height - 10;
        snake = [h, ...snake.slice(0, -1)];
        if (Math.random() < 0.12) {
          const opts = [{ x: 10, y: 0 }, { x: -10, y: 0 }, { x: 0, y: 10 }, { x: 0, y: -10 }]
            .filter((d) => !(d.x === -dir.x && d.y === -dir.y));
          dir = opts[Math.floor(Math.random() * opts.length)];
        }
      }
      ctx.fillStyle = "#050b14"; ctx.fillRect(0, 0, canvas.width, canvas.height);
      ctx.strokeStyle = "rgba(168,85,247,0.06)"; ctx.lineWidth = 0.5;
      for (let i = 0; i < canvas.width; i += 10) { ctx.beginPath(); ctx.moveTo(i,0); ctx.lineTo(i,canvas.height); ctx.stroke(); }
      for (let j = 0; j < canvas.height; j += 10) { ctx.beginPath(); ctx.moveTo(0,j); ctx.lineTo(canvas.width,j); ctx.stroke(); }
      ctx.shadowColor="#ff4060"; ctx.shadowBlur=14; ctx.fillStyle="#ff4060"; ctx.fillRect(130,70,10,10); ctx.shadowBlur=0;
      snake.forEach((p, i) => {
        const alpha = Math.max(0.15, 1 - i * 0.06);
        ctx.shadowColor = i===0?"#a855f7":"#7c3aed"; ctx.shadowBlur = i===0?16:6;
        ctx.fillStyle = i===0 ? "#a855f7" : `rgba(124,58,237,${alpha})`;
        ctx.fillRect(p.x, p.y, 9, 9); ctx.shadowBlur=0;
      });
      animId = requestAnimationFrame(tick);
    };
    tick();
    return () => cancelAnimationFrame(animId);
  }, []);

  /* ── Row fade-in animation helper ── */
  const rowVariants = {
    hidden: { opacity: 0, y: 40 },
    visible: { opacity: 1, y: 0, transition: { duration: 0.6, ease: [0.22, 1, 0.36, 1] } },
  };

  return (
    <div className="w-full">
      {/* ─── PAGE HERO ───────────────────────────────────── */}
      <div className="max-w-[1280px] mx-auto px-margin-mobile md:px-margin-desktop pt-32 pb-20">
        <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.5 }}>
          <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-primary/10 border border-primary/20 text-xs font-mono text-primary mb-6">
            <span className="w-1.5 h-1.5 rounded-full bg-primary animate-pulse" />
            LIVE INTERACTIVE DEMOS — ALL RUNNING IN BROWSER
          </div>
          <h1 className="font-display text-5xl sm:text-6xl md:text-7xl font-bold tracking-tight text-on-surface leading-[1.05] mb-4">
            Selected<br /><span className="text-gradient">Work</span>
          </h1>
          <p className="font-body text-base text-on-surface-variant max-w-lg leading-relaxed">
            Four real builds — you can interact with every single one right here, right now. No screenshots.
          </p>
        </motion.div>
      </div>

      {/* ════════════════════════════════════════════════════
          PROJECT 01 — WEB SCRAPER
          Layout: Info LEFT · Demo RIGHT
      ════════════════════════════════════════════════════ */}
      <Divider />
      <motion.section
        initial="hidden" whileInView="visible" viewport={{ once: true, margin: "-80px" }}
        variants={rowVariants}
        className="w-full py-0 relative overflow-hidden"
        style={{ background: "linear-gradient(135deg, rgba(0,102,255,0.04) 0%, transparent 50%)" }}
      >
        {/* Big number watermark */}
        <div className="absolute top-1/2 -translate-y-1/2 left-6 font-display font-black text-[180px] leading-none text-primary/[0.04] select-none pointer-events-none">
          01
        </div>

        <div className="max-w-[1280px] mx-auto px-margin-mobile md:px-margin-desktop grid grid-cols-1 lg:grid-cols-2 gap-0 items-stretch min-h-[560px]">
          {/* Info panel */}
          <div className="flex flex-col justify-center py-20 pr-0 lg:pr-16 relative z-10">
            <span className="font-mono text-[10px] uppercase tracking-[0.25em] text-primary/70 mb-4 flex items-center gap-2">
              <span className="w-8 h-px bg-primary/40" />Data Analytics · Automation
            </span>
            <h2 className="font-display text-3xl sm:text-4xl md:text-5xl font-bold text-on-surface leading-[1.1] mb-5">
              Ultimate Mini<br />Web Scraper
            </h2>
            <p className="font-body text-sm sm:text-base text-on-surface-variant leading-relaxed mb-8 max-w-md">
              Enter any URL and a CSS selector. It fetches through a CORS proxy, parses the raw HTML client-side using the browser's own DOMParser, and extracts every matching element — no backend required.
            </p>
            <div className="flex flex-wrap gap-2 mb-8">
              {["TypeScript", "DOMParser API", "CORS Proxy", "Node.js"].map((t) => (
                <Tag key={t} label={t} color="#0066ff" />
              ))}
            </div>
            <div className="flex items-center gap-4">
              <a href="https://github.com/Romeo-Bess/ultimate-mini-web-scraper" target="_blank" rel="noreferrer"
                className="inline-flex items-center gap-2 px-5 py-2.5 rounded-full border border-outline-variant/30 text-xs font-mono text-on-surface-variant hover:border-primary/40 hover:text-primary transition-all">
                <GitBranch className="w-3.5 h-3.5" />Repository
              </a>
              <Link to="/projects/ultimate-mini-web-scraper"
                className="inline-flex items-center gap-1 text-xs font-mono text-primary hover:gap-2 transition-all">
                Case Study <ChevronRight className="w-3.5 h-3.5" />
              </Link>
            </div>
          </div>

          {/* Demo panel */}
          <div className="flex items-center justify-center py-12 lg:py-16 relative">
            {/* Glow blob behind demo */}
            <div className="absolute inset-0 flex items-center justify-center pointer-events-none">
              <div className="w-96 h-96 rounded-full blur-[100px]" style={{ background: "rgba(0,102,255,0.1)" }} />
            </div>
            {/* Browser chrome mockup */}
            <div className="relative w-full max-w-lg rounded-xl overflow-hidden border border-white/8 shadow-2xl z-10"
              style={{ background: "#0a0e1a", boxShadow: "0 0 60px rgba(0,102,255,0.15), 0 32px 64px rgba(0,0,0,0.5)" }}>
              {/* Browser bar */}
              <div className="flex items-center gap-3 px-4 py-3 border-b border-white/6" style={{ background: "#0d1120" }}>
                <div className="flex gap-1.5">
                  <div className="w-3 h-3 rounded-full bg-red-500/70" />
                  <div className="w-3 h-3 rounded-full bg-yellow-500/70" />
                  <div className="w-3 h-3 rounded-full bg-green-500/70" />
                </div>
                <div className="flex-1 bg-white/5 rounded-md px-3 py-1 font-mono text-[10px] text-white/30 flex items-center gap-2">
                  <span className="text-blue-400/50">🔒</span> romeo.dev/scraper
                </div>
              </div>
              {/* App content */}
              <div className="p-5 flex flex-col gap-3">
                <div className="flex gap-2">
                  <div className="flex-1">
                    <label className="font-mono text-[9px] text-blue-400/50 uppercase tracking-widest block mb-1">Target URL</label>
                    <input type="text" value={scraperUrl} onChange={(e) => setScraperUrl(e.target.value)}
                      className="w-full bg-white/5 border border-blue-500/15 rounded-lg px-3 py-2 text-[11px] text-blue-100 font-mono focus:outline-none focus:border-blue-400/40"
                      placeholder="https://example.com" />
                  </div>
                  <div className="w-36">
                    <label className="font-mono text-[9px] text-blue-400/50 uppercase tracking-widest block mb-1">CSS Selector</label>
                    <input type="text" value={scraperSelector} onChange={(e) => setScraperSelector(e.target.value)}
                      className="w-full bg-white/5 border border-blue-500/15 rounded-lg px-3 py-2 text-[11px] text-blue-100 font-mono focus:outline-none focus:border-blue-400/40" />
                  </div>
                </div>
                <button onClick={handleScrape} disabled={isScraping}
                  className="w-full py-2.5 rounded-lg font-mono text-[11px] font-semibold uppercase tracking-widest flex items-center justify-center gap-2 transition-all disabled:opacity-50"
                  style={{ background: "linear-gradient(135deg,#0066ff,#0044cc)", boxShadow: "0 4px 20px rgba(0,102,255,0.3)" }}>
                  {isScraping
                    ? <><span className="w-3.5 h-3.5 border-2 border-white/40 border-t-white rounded-full animate-spin" />Fetching live data…</>
                    : <>▶ &nbsp;Run Scrape</>}
                </button>
                <div className="bg-black/40 rounded-lg border border-white/5 p-3 h-52 overflow-y-auto font-mono text-[10px] space-y-1">
                  {scrapeError && <div className="text-red-400">{scrapeError}</div>}
                  {!scrapeError && !scrapeResults.length && (
                    <div className="text-blue-400/25 text-center pt-8 leading-relaxed">
                      Ready to scrape.<br />Enter a URL and selector then hit Run.
                    </div>
                  )}
                  {!scrapeError && scrapeResults.map((r, i) => (
                    <div key={i} className="border-b border-white/5 pb-1 flex gap-2">
                      <span className="text-blue-500 font-bold shrink-0">[{String(i + 1).padStart(2, "0")}]</span>
                      <span className="text-emerald-300 truncate">{r.text}</span>
                    </div>
                  ))}
                </div>
              </div>
            </div>
          </div>
        </div>
      </motion.section>

      {/* ════════════════════════════════════════════════════
          PROJECT 02 — ROMEO RUNNER
          Layout: Demo LEFT · Info RIGHT
      ════════════════════════════════════════════════════ */}
      <Divider />
      <motion.section
        initial="hidden" whileInView="visible" viewport={{ once: true, margin: "-80px" }}
        variants={rowVariants}
        className="w-full relative overflow-hidden"
        style={{ background: "linear-gradient(225deg, rgba(0,208,132,0.05) 0%, transparent 55%)" }}
      >
        <div className="absolute top-1/2 -translate-y-1/2 right-6 font-display font-black text-[180px] leading-none text-emerald-500/[0.04] select-none pointer-events-none">
          02
        </div>

        <div className="max-w-[1280px] mx-auto px-margin-mobile md:px-margin-desktop grid grid-cols-1 lg:grid-cols-2 gap-0 items-stretch min-h-[560px]">
          {/* Demo LEFT */}
          <div className="flex items-center justify-center py-12 lg:py-16 relative order-2 lg:order-1">
            <div className="absolute inset-0 flex items-center justify-center pointer-events-none">
              <div className="w-96 h-96 rounded-full blur-[100px]" style={{ background: "rgba(0,208,132,0.08)" }} />
            </div>
            {/* Terminal window */}
            <div className="relative w-full max-w-lg rounded-xl overflow-hidden z-10"
              style={{ background: "#04080f", border: "1px solid rgba(0,208,132,0.12)", boxShadow: "0 0 60px rgba(0,208,132,0.12), 0 32px 64px rgba(0,0,0,0.55)" }}>
              {/* Title bar */}
              <div className="flex items-center gap-3 px-4 py-3 border-b" style={{ borderColor: "rgba(0,208,132,0.1)", background: "#060d10" }}>
                <div className="flex gap-1.5">
                  <div className="w-3 h-3 rounded-full bg-red-500/60" />
                  <div className="w-3 h-3 rounded-full bg-yellow-500/60" />
                  <div className="w-3 h-3 rounded-full" style={{ background: "rgba(0,208,132,0.7)" }} />
                </div>
                <span className="font-mono text-[10px] tracking-widest" style={{ color: "rgba(0,208,132,0.5)" }}>
                  romeo-runner — bash — 80×24
                </span>
                <div className="ml-auto flex items-center gap-1">
                  <span className="w-1.5 h-1.5 rounded-full animate-pulse" style={{ background: "#00d084" }} />
                  <span className="font-mono text-[9px]" style={{ color: "rgba(0,208,132,0.4)" }}>LIVE</span>
                </div>
              </div>
              {/* Terminal body */}
              <div className="p-5 font-mono text-[11px] leading-6 h-72 overflow-y-auto">
                <div className="mb-1">
                  <span style={{ color: "#00d084" }}>romeo@dev</span>
                  <span className="text-white/25">:~$ </span>
                  <span className="text-white/80">romeo-runner init --env production</span>
                </div>
                {terminalLines.map((line, i) => (
                  <div key={i} style={{
                    color: line.startsWith("✓") ? "#00d084"
                      : line.startsWith("$") ? "rgba(255,255,255,0.75)"
                      : line.startsWith("⟳") ? "#fbbf24"
                      : "rgba(255,255,255,0.28)"
                  }}>
                    {line.startsWith("$") && (
                      <><span style={{ color: "#00d084" }}>romeo@dev</span><span className="text-white/25">:~</span>{" "}</>
                    )}
                    {line}
                  </div>
                ))}
                <span className="inline-block w-2 h-4 animate-pulse ml-0.5 rounded-sm" style={{ background: "#00d084" }} />
              </div>
            </div>
          </div>

          {/* Info RIGHT */}
          <div className="flex flex-col justify-center py-20 pl-0 lg:pl-16 order-1 lg:order-2 relative z-10">
            <span className="font-mono text-[10px] uppercase tracking-[0.25em] mb-4 flex items-center gap-2" style={{ color: "rgba(0,208,132,0.7)" }}>
              <span className="w-8 h-px" style={{ background: "rgba(0,208,132,0.4)" }} />Automation · Systems
            </span>
            <h2 className="font-display text-3xl sm:text-4xl md:text-5xl font-bold text-on-surface leading-[1.1] mb-5">
              Romeo<br />Runner
            </h2>
            <p className="font-body text-sm sm:text-base text-on-surface-variant leading-relaxed mb-8 max-w-md">
              A lab automation task runner built to orchestrate hardware controllers, dispatch pathology workflows, and log diagnostic cycles in real time. Watch the terminal stream live above.
            </p>
            <div className="flex flex-wrap gap-2 mb-8">
              {["TypeScript", "Go", "Docker", "Linux"].map((t) => (
                <Tag key={t} label={t} color="#00d084" />
              ))}
            </div>
            <div className="flex items-center gap-4">
              <a href="https://github.com/Romeo-Bess/Romeo-Runner" target="_blank" rel="noreferrer"
                className="inline-flex items-center gap-2 px-5 py-2.5 rounded-full border text-xs font-mono transition-all"
                style={{ borderColor: "rgba(0,208,132,0.25)", color: "rgba(0,208,132,0.8)" }}>
                <GitBranch className="w-3.5 h-3.5" />Repository
              </a>
              <a href="https://romeo-runner.vercel.app/" target="_blank" rel="noreferrer"
                className="inline-flex items-center gap-1.5 text-xs font-mono font-semibold px-5 py-2.5 rounded-full transition-all"
                style={{ background: "linear-gradient(135deg,#00d084,#00b36e)", color: "#000", boxShadow: "0 4px 18px rgba(0,208,132,0.3)" }}>
                <ExternalLink className="w-3.5 h-3.5" />Live App
              </a>
            </div>
          </div>
        </div>
      </motion.section>

      {/* ════════════════════════════════════════════════════
          PROJECT 03 — RETRO SNAKE
          Layout: Info LEFT · Demo RIGHT
      ════════════════════════════════════════════════════ */}
      <Divider />
      <motion.section
        initial="hidden" whileInView="visible" viewport={{ once: true, margin: "-80px" }}
        variants={rowVariants}
        className="w-full relative overflow-hidden"
        style={{ background: "linear-gradient(135deg, rgba(168,85,247,0.05) 0%, transparent 55%)" }}
      >
        <div className="absolute top-1/2 -translate-y-1/2 left-6 font-display font-black text-[180px] leading-none select-none pointer-events-none" style={{ color: "rgba(168,85,247,0.04)" }}>
          03
        </div>

        <div className="max-w-[1280px] mx-auto px-margin-mobile md:px-margin-desktop grid grid-cols-1 lg:grid-cols-2 gap-0 items-stretch min-h-[560px]">
          {/* Info LEFT */}
          <div className="flex flex-col justify-center py-20 pr-0 lg:pr-16 relative z-10">
            <span className="font-mono text-[10px] uppercase tracking-[0.25em] mb-4 flex items-center gap-2" style={{ color: "rgba(168,85,247,0.7)" }}>
              <span className="w-8 h-px" style={{ background: "rgba(168,85,247,0.4)" }} />Web Application · Canvas
            </span>
            <h2 className="font-display text-3xl sm:text-4xl md:text-5xl font-bold text-on-surface leading-[1.1] mb-5">
              Retro<br />Snake
            </h2>
            <p className="font-body text-sm sm:text-base text-on-surface-variant leading-relaxed mb-8 max-w-md">
              A fully interactive HTML5 Canvas Snake game running a live animation loop right now in the panel beside you. Neon glow per segment, boundary wrapping, smooth 60fps. Built from scratch — no game engine.
            </p>
            <div className="flex flex-wrap gap-2 mb-8">
              {["HTML5 Canvas", "JavaScript", "RequestAnimationFrame", "CSS3"].map((t) => (
                <Tag key={t} label={t} color="#a855f7" />
              ))}
            </div>
            <div className="flex items-center gap-4">
              <a href="https://github.com/Romeo-Bess/Snake" target="_blank" rel="noreferrer"
                className="inline-flex items-center gap-2 px-5 py-2.5 rounded-full border text-xs font-mono transition-all"
                style={{ borderColor: "rgba(168,85,247,0.25)", color: "rgba(168,85,247,0.8)" }}>
                <GitBranch className="w-3.5 h-3.5" />Repository
              </a>
              <Link to="/projects/snake" className="inline-flex items-center gap-1 text-xs font-mono transition-all" style={{ color: "rgba(168,85,247,0.7)" }}>
                Case Study <ChevronRight className="w-3.5 h-3.5" />
              </Link>
            </div>
          </div>

          {/* Demo RIGHT */}
          <div className="flex items-center justify-center py-12 lg:py-16 relative">
            <div className="absolute inset-0 flex items-center justify-center pointer-events-none">
              <div className="w-96 h-96 rounded-full blur-[100px]" style={{ background: "rgba(168,85,247,0.1)" }} />
            </div>
            {/* Game window */}
            <div className="relative w-full max-w-lg rounded-xl overflow-hidden z-10"
              style={{ background: "#050b14", border: "1px solid rgba(168,85,247,0.12)", boxShadow: "0 0 60px rgba(168,85,247,0.15), 0 32px 64px rgba(0,0,0,0.55)" }}>
              <div className="flex items-center justify-between px-4 py-3 border-b" style={{ borderColor: "rgba(168,85,247,0.1)", background: "#070b12" }}>
                <div className="flex gap-1.5">
                  <div className="w-3 h-3 rounded-full bg-red-500/60" />
                  <div className="w-3 h-3 rounded-full bg-yellow-500/60" />
                  <div className="w-3 h-3 rounded-full" style={{ background: "rgba(168,85,247,0.7)" }} />
                </div>
                <span className="font-mono text-[10px]" style={{ color: "rgba(168,85,247,0.4)" }}>SNAKE — HTML5 CANVAS</span>
                <div className="flex items-center gap-2">
                  <span className="font-mono text-[9px]" style={{ color: "rgba(168,85,247,0.4)" }}>AUTO-PILOT DEMO</span>
                  <span className="w-1.5 h-1.5 rounded-full animate-pulse" style={{ background: "#a855f7" }} />
                </div>
              </div>
              <canvas ref={snakeRef} width={500} height={320} className="w-full" style={{ display: "block" }} />
            </div>
          </div>
        </div>
      </motion.section>

      {/* ════════════════════════════════════════════════════
          PROJECT 04 — MUSIC APP
          Layout: Demo LEFT · Info RIGHT
      ════════════════════════════════════════════════════ */}
      <Divider />
      <motion.section
        initial="hidden" whileInView="visible" viewport={{ once: true, margin: "-80px" }}
        variants={rowVariants}
        className="w-full relative overflow-hidden"
        style={{ background: "linear-gradient(225deg, rgba(245,158,11,0.05) 0%, transparent 55%)" }}
      >
        <div className="absolute top-1/2 -translate-y-1/2 right-6 font-display font-black text-[180px] leading-none select-none pointer-events-none" style={{ color: "rgba(245,158,11,0.04)" }}>
          04
        </div>

        <div className="max-w-[1280px] mx-auto px-margin-mobile md:px-margin-desktop grid grid-cols-1 lg:grid-cols-2 gap-0 items-stretch min-h-[560px]">
          {/* Demo LEFT */}
          <div className="flex items-center justify-center py-12 lg:py-16 relative order-2 lg:order-1">
            <div className="absolute inset-0 flex items-center justify-center pointer-events-none">
              <div className="w-96 h-96 rounded-full blur-[100px]" style={{ background: "rgba(245,158,11,0.08)" }} />
            </div>

            {/* Music player window */}
            <div className="relative w-full max-w-lg rounded-xl overflow-hidden z-10"
              style={{ background: "#0c0a04", border: "1px solid rgba(245,158,11,0.12)", boxShadow: "0 0 60px rgba(245,158,11,0.12), 0 32px 64px rgba(0,0,0,0.55)" }}>
              <div className="flex items-center gap-3 px-4 py-3 border-b" style={{ borderColor: "rgba(245,158,11,0.1)", background: "#0e0b04" }}>
                <div className="flex gap-1.5">
                  <div className="w-3 h-3 rounded-full bg-red-500/60" />
                  <div className="w-3 h-3 rounded-full bg-yellow-500/60" />
                  <div className="w-3 h-3 rounded-full" style={{ background: "rgba(245,158,11,0.7)" }} />
                </div>
                <span className="font-mono text-[10px]" style={{ color: "rgba(245,158,11,0.45)" }}>Music App — Web Audio Sequencer</span>
              </div>

              <div className="p-6 flex flex-col gap-5">
                {/* Now playing */}
                <div className="flex items-center gap-4 p-4 rounded-xl" style={{ background: "rgba(245,158,11,0.06)", border: "1px solid rgba(245,158,11,0.1)" }}>
                  {/* Vinyl */}
                  <div className="w-16 h-16 rounded-full flex items-center justify-center relative shrink-0"
                    style={{
                      background: "radial-gradient(circle,#1c1400 30%,#0a0700 100%)",
                      border: "2px solid rgba(245,158,11,0.2)",
                      animation: isPlaying ? "vinylSpin 3s linear infinite" : "none",
                    }}>
                    <div className="absolute inset-0 rounded-full" style={{ background: "repeating-radial-gradient(circle at center,transparent 0,transparent 3px,rgba(245,158,11,0.04) 3px,rgba(245,158,11,0.04) 4px)" }} />
                    <div className="w-4 h-4 rounded-full relative z-10" style={{ background: "#f59e0b44", border: "1px solid #f59e0b80" }} />
                  </div>
                  <div className="flex-1 min-w-0">
                    <div className="font-display font-bold text-sm text-white mb-0.5">Coding Beats</div>
                    <div className="font-mono text-[10px] mb-3" style={{ color: "rgba(245,158,11,0.5)" }}>Romeo Bessenaar — Web Audio API</div>
                    {/* Progress */}
                    <div className="flex items-center gap-2 font-mono text-[9px]" style={{ color: "rgba(255,255,255,0.2)" }}>
                      <span>0:{Math.floor(progress * 0.6).toString().padStart(2,"0")}</span>
                      <div className="flex-1 h-0.5 rounded-full overflow-hidden" style={{ background: "rgba(255,255,255,0.08)" }}>
                        <div className="h-full rounded-full transition-all duration-300" style={{ width:`${progress}%`, background:"linear-gradient(90deg,#f59e0b,#d97706)" }} />
                      </div>
                      <span>1:00</span>
                    </div>
                  </div>
                  <button onClick={togglePlay}
                    className="w-12 h-12 rounded-full flex items-center justify-center shrink-0 hover:scale-110 active:scale-95 transition-transform"
                    style={{ background:"linear-gradient(135deg,#f59e0b,#b45309)", boxShadow:"0 0 28px rgba(245,158,11,0.45)" }}>
                    {isPlaying
                      ? <Pause className="w-5 h-5 fill-black text-black" />
                      : <Play className="w-5 h-5 fill-black text-black translate-x-0.5" />}
                  </button>
                </div>

                {/* Waveform visualizer */}
                <div>
                  <div className="font-mono text-[9px] uppercase tracking-widest mb-2" style={{ color:"rgba(245,158,11,0.35)" }}>
                    Live Frequency Output
                  </div>
                  <div className="flex items-end gap-0.5 h-16 bg-black/30 rounded-lg px-3 py-2">
                    {musicBars.map((h, i) => (
                      <div key={i} className="flex-1 rounded-sm transition-all duration-200" style={{
                        height: `${isPlaying ? h : 8}%`,
                        background: `rgba(245,158,11,${0.3+(i/musicBars.length)*0.6})`,
                        boxShadow: isPlaying ? `0 0 6px rgba(245,158,11,0.3)` : "none",
                      }} />
                    ))}
                  </div>
                </div>

                {/* Track list */}
                {[
                  { title:"Coding Beats", dur:"1:00", active:true },
                  { title:"Debug Mode", dur:"0:48", active:false },
                  { title:"Deploy Day", dur:"1:12", active:false },
                ].map((track) => (
                  <div key={track.title} className="flex items-center justify-between px-3 py-2 rounded-lg transition-all"
                    style={{ background: track.active ? "rgba(245,158,11,0.08)" : "transparent", border: track.active ? "1px solid rgba(245,158,11,0.12)" : "1px solid transparent" }}>
                    <div className="flex items-center gap-2.5">
                      <div className="w-6 h-6 rounded flex items-center justify-center" style={{ background: track.active ? "#f59e0b20" : "transparent" }}>
                        {track.active
                          ? <span className="w-1.5 h-1.5 rounded-full animate-pulse" style={{ background:"#f59e0b" }} />
                          : <span className="font-mono text-[9px] text-white/20">▶</span>}
                      </div>
                      <span className={`font-mono text-xs ${track.active ? "text-white" : "text-white/35"}`}>{track.title}</span>
                    </div>
                    <span className="font-mono text-[10px] text-white/20">{track.dur}</span>
                  </div>
                ))}
              </div>
            </div>
          </div>

          {/* Info RIGHT */}
          <div className="flex flex-col justify-center py-20 pl-0 lg:pl-16 order-1 lg:order-2 relative z-10">
            <span className="font-mono text-[10px] uppercase tracking-[0.25em] mb-4 flex items-center gap-2" style={{ color: "rgba(245,158,11,0.7)" }}>
              <span className="w-8 h-px" style={{ background: "rgba(245,158,11,0.4)" }} />Web Application · Audio
            </span>
            <h2 className="font-display text-3xl sm:text-4xl md:text-5xl font-bold text-on-surface leading-[1.1] mb-5">
              Music<br />App
            </h2>
            <p className="font-body text-sm sm:text-base text-on-surface-variant leading-relaxed mb-8 max-w-md">
              An in-browser audio engine powered entirely by the Web Audio API. Hit play — it programmatically synthesises a pentatonic arpeggio with kick drums. No audio files. Just math and oscillators.
            </p>
            <div className="flex flex-wrap gap-2 mb-8">
              {["React", "TypeScript", "Web Audio API", "Tailwind CSS"].map((t) => (
                <Tag key={t} label={t} color="#f59e0b" />
              ))}
            </div>
            <div className="flex items-center gap-4">
              <a href="https://github.com/Romeo-Bess/Music-App" target="_blank" rel="noreferrer"
                className="inline-flex items-center gap-2 px-5 py-2.5 rounded-full border text-xs font-mono transition-all"
                style={{ borderColor: "rgba(245,158,11,0.25)", color: "rgba(245,158,11,0.8)" }}>
                <GitBranch className="w-3.5 h-3.5" />Repository
              </a>
              <Link to="/projects/music-app" className="inline-flex items-center gap-1 text-xs font-mono transition-all" style={{ color: "rgba(245,158,11,0.7)" }}>
                Case Study <ChevronRight className="w-3.5 h-3.5" />
              </Link>
            </div>
          </div>
        </div>
      </motion.section>

      <Divider />

      {/* ─── Footer CTA ─────────────────────────────────── */}
      <div className="py-20 text-center px-margin-mobile">
        <p className="font-mono text-xs text-on-surface-variant/30 uppercase tracking-widest mb-4">All projects are open source</p>
        <a href="https://github.com/Romeo-Bess" target="_blank" rel="noreferrer"
          className="inline-flex items-center gap-2 px-6 py-3 rounded-full border border-outline-variant/20 text-sm font-mono font-semibold text-primary hover:bg-primary/5 hover:border-primary/30 transition-all">
          <GitBranch className="w-4 h-4" />
          View all repos on GitHub
          <ArrowUpRight className="w-3.5 h-3.5" />
        </a>
      </div>

      <style>{`@keyframes vinylSpin{from{transform:rotate(0deg)}to{transform:rotate(360deg)}}`}</style>
    </div>
  );
};

export default Projects;
