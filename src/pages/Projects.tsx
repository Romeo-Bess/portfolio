import React, { useEffect, useState, useRef } from "react";
import { Link } from "react-router-dom";
import { Play, Pause, Volume2 } from "lucide-react";

interface ProjectCardData {
  id: string;
  title: string;
  slug: string;
  category: string;
  tags: string[];
  description: string;
  cols: string;
  technologies: string[];
}

export const Projects: React.FC = () => {
  const [searchQuery, setSearchQuery] = useState("");
  const [selectedCategory, setSelectedCategory] = useState("All");

  // 1. Real Web Scraper state
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
      const html = data.contents;
      
      const parser = new DOMParser();
      const doc = parser.parseFromString(html, "text/html");
      const elements = doc.querySelectorAll(scraperSelector);
      
      const results: { text: string; href?: string }[] = [];
      elements.forEach((el) => {
        const text = el.textContent?.trim() || "";
        let href = el.getAttribute("href") || undefined;
        if (href && href.startsWith("/")) {
          try {
            const urlObj = new URL(scraperUrl);
            href = urlObj.origin + href;
          } catch(e) {}
        }
        if (text) {
          results.push({ text, href });
        }
      });

      if (results.length === 0) {
        setScrapeError("No elements matched the selector, or the page dynamically loads contents.");
      } else {
        setScrapeResults(results.slice(0, 8)); // Show top 8 results
      }
    } catch (err: any) {
      setScrapeError("CORS proxy error. Try another domain or check selector.");
      console.error(err);
    } finally {
      setIsScraping(false);
    }
  };

  // 3. Snake canvas game loop
  const snakeCanvasRef = useRef<HTMLCanvasElement>(null);
  useEffect(() => {
    const canvas = snakeCanvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext("2d");
    if (!ctx) return;

    let snake = [
      { x: 50, y: 50 },
      { x: 40, y: 50 },
      { x: 30, y: 50 },
    ];
    let dir = { x: 10, y: 0 };
    let animationId: number;
    let frameCount = 0;

    const draw = () => {
      frameCount++;
      if (frameCount % 8 === 0) { // animate speed
        const head = { x: snake[0].x + dir.x, y: snake[0].y + dir.y };
        
        // boundary wrap
        if (head.x >= canvas.width) head.x = 0;
        if (head.x < 0) head.x = canvas.width - 10;
        if (head.y >= canvas.height) head.y = 0;
        if (head.y < 0) head.y = canvas.height - 10;
        
        snake.unshift(head);
        snake.pop();

        // random movement
        if (Math.random() < 0.15) {
          const possibleDirs = [
            { x: 10, y: 0 },
            { x: -10, y: 0 },
            { x: 0, y: 10 },
            { x: 0, y: -10 }
          ].filter(d => d.x !== -dir.x || d.y !== -dir.y);
          dir = possibleDirs[Math.floor(Math.random() * possibleDirs.length)];
        }
      }

      ctx.fillStyle = "#03060a";
      ctx.fillRect(0, 0, canvas.width, canvas.height);

      // Grid
      ctx.strokeStyle = "rgba(0, 80, 203, 0.05)";
      ctx.lineWidth = 0.5;
      for (let i = 0; i < canvas.width; i += 10) {
        ctx.beginPath();
        ctx.moveTo(i, 0);
        ctx.lineTo(i, canvas.height);
        ctx.stroke();
      }
      for (let j = 0; j < canvas.height; j += 10) {
        ctx.beginPath();
        ctx.moveTo(0, j);
        ctx.lineTo(canvas.width, j);
        ctx.stroke();
      }

      // Food
      ctx.fillStyle = "#ff5555";
      ctx.fillRect(80, 40, 8, 8);

      // Snake body
      snake.forEach((part, idx) => {
        ctx.fillStyle = idx === 0 ? "#0066ff" : "rgba(107, 56, 212, 0.8)";
        ctx.fillRect(part.x, part.y, 8, 8);
      });

      animationId = requestAnimationFrame(draw);
    };

    draw();
    return () => cancelAnimationFrame(animationId);
  }, []);

  // 4. Real Web Audio Sequencer & Visualizer State
  const [isPlaying, setIsPlaying] = useState(false);
  const [isMuted, setIsMuted] = useState(false);
  const [currentStep, setCurrentStep] = useState(0);

  const audioCtxRef = useRef<AudioContext | null>(null);
  const analyserRef = useRef<AnalyserNode | null>(null);
  const sequencerIntervalRef = useRef<any>(null);
  const visualizerCanvasRef = useRef<HTMLCanvasElement>(null);
  const gainNodeRef = useRef<GainNode | null>(null);

  // Notes of a pentatonic arpeggio: C3, D3, E3, G3, A3, C4, D4, E4
  const arpeggioScale = [130.81, 146.83, 164.81, 196.00, 220.00, 261.63, 293.66, 329.63];

  const togglePlayback = () => {
    if (isPlaying) {
      stopAudio();
    } else {
      startAudio();
    }
  };

  const startAudio = () => {
    // Initialize AudioContext and Analyser
    if (!audioCtxRef.current) {
      const AudioContextClass = window.AudioContext || (window as any).webkitAudioContext;
      audioCtxRef.current = new AudioContextClass();
      
      analyserRef.current = audioCtxRef.current.createAnalyser();
      analyserRef.current.fftSize = 64; // Small size for visualizer bars
      
      gainNodeRef.current = audioCtxRef.current.createGain();
      gainNodeRef.current.gain.value = isMuted ? 0 : 0.3; // Default volume
      
      gainNodeRef.current.connect(analyserRef.current);
      analyserRef.current.connect(audioCtxRef.current.destination);
    }

    if (audioCtxRef.current.state === "suspended") {
      audioCtxRef.current.resume();
    }

    setIsPlaying(true);
    const ctx = audioCtxRef.current;
    const dest = gainNodeRef.current!;
    let step = 0;

    // Start 8-step sequencer loop (120 BPM = 250ms per step)
    sequencerIntervalRef.current = setInterval(() => {
      const time = ctx.currentTime;

      // Step 0 & 4: Kick sweep
      if (step % 4 === 0) {
        const osc = ctx.createOscillator();
        const oscGain = ctx.createGain();
        osc.connect(oscGain);
        oscGain.connect(dest);

        osc.frequency.setValueAtTime(130, time);
        osc.frequency.exponentialRampToValueAtTime(0.01, time + 0.12);
        oscGain.gain.setValueAtTime(1.0, time);
        oscGain.gain.exponentialRampToValueAtTime(0.01, time + 0.12);

        osc.start(time);
        osc.stop(time + 0.13);
      }

      // Step 2 & 6: Hi-Hat sweep
      if (step % 4 === 2) {
        const osc = ctx.createOscillator();
        const oscGain = ctx.createGain();
        osc.type = "triangle";
        osc.connect(oscGain);
        oscGain.connect(dest);

        osc.frequency.setValueAtTime(1000, time);
        oscGain.gain.setValueAtTime(0.4, time);
        oscGain.gain.exponentialRampToValueAtTime(0.01, time + 0.07);

        osc.start(time);
        osc.stop(time + 0.08);
      }

      // Every step: Synth arpeggiator note
      const noteFreq = arpeggioScale[step % arpeggioScale.length];
      const osc = ctx.createOscillator();
      const oscGain = ctx.createGain();
      osc.type = "sine";
      osc.connect(oscGain);
      oscGain.connect(dest);

      osc.frequency.setValueAtTime(noteFreq, time);
      oscGain.gain.setValueAtTime(0.2, time);
      oscGain.gain.exponentialRampToValueAtTime(0.01, time + 0.22);

      osc.start(time);
      osc.stop(time + 0.24);

      setCurrentStep(step);
      step = (step + 1) % 8;
    }, 250);
  };

  const stopAudio = () => {
    setIsPlaying(false);
    if (sequencerIntervalRef.current) {
      clearInterval(sequencerIntervalRef.current);
      sequencerIntervalRef.current = null;
    }
  };

  // Toggle Mute
  useEffect(() => {
    if (gainNodeRef.current) {
      gainNodeRef.current.gain.value = isMuted ? 0 : 0.3;
    }
  }, [isMuted]);

  // Clean up on unmount
  useEffect(() => {
    return () => {
      if (sequencerIntervalRef.current) clearInterval(sequencerIntervalRef.current);
    };
  }, []);

  // Web Audio Visualizer Loop
  useEffect(() => {
    let animId: number;
    const canvas = visualizerCanvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext("2d");
    if (!ctx) return;

    const draw = () => {
      ctx.fillStyle = "#060a0f";
      ctx.fillRect(0, 0, canvas.width, canvas.height);

      if (isPlaying && analyserRef.current) {
        const bufferLength = analyserRef.current.frequencyBinCount;
        const dataArray = new Uint8Array(bufferLength);
        analyserRef.current.getByteFrequencyData(dataArray);

        const barWidth = (canvas.width / bufferLength) * 1.6;
        let barHeight;
        let x = 0;

        for (let i = 0; i < bufferLength; i++) {
          barHeight = dataArray[i] / 2.5;

          // double sided bar visualizer
          ctx.fillStyle = `rgba(0, 102, 255, ${barHeight / 100 + 0.35})`;
          ctx.fillRect(x, canvas.height / 2 - barHeight / 2, barWidth - 1.5, barHeight);

          x += barWidth;
        }
      } else {
        // Draw static center line
        ctx.strokeStyle = "rgba(0, 102, 255, 0.15)";
        ctx.lineWidth = 1.5;
        ctx.beginPath();
        ctx.moveTo(0, canvas.height / 2);
        ctx.lineTo(canvas.width, canvas.height / 2);
        ctx.stroke();
      }

      animId = requestAnimationFrame(draw);
    };

    draw();
    return () => cancelAnimationFrame(animId);
  }, [isPlaying]);

  const projectsData: ProjectCardData[] = [
    {
      id: "ultimate-mini-web-scraper",
      title: "Ultimate Mini Web Scraper",
      slug: "ultimate-mini-web-scraper",
      category: "Data Analytics",
      tags: ["Data Analytics", "Automation"],
      description: "A high-performance concurrent web crawler and scraper that parses content from targeted pages, extracts structural elements, and exports datasets.",
      cols: "md:col-span-8",
      technologies: ["Go", "Node.js", "Cheerio", "Puppeteer"]
    },
    {
      id: "romeo-runner",
      title: "Romeo Runner",
      slug: "romeo-runner",
      category: "Automation",
      tags: ["Automation"],
      description: "A laboratory automation orchestrator and task runner designed to monitor hardware metrics, dispatch routing logic, and run diagnostic cycles.",
      cols: "md:col-span-4",
      technologies: ["Rust", "TypeScript", "Go", "Docker"]
    },
    {
      id: "snake",
      title: "Retro Snake Game",
      slug: "snake",
      category: "Web Applications",
      tags: ["Web Applications"],
      description: "A polished, responsive HTML5 canvas-based Retro Snake Game with smooth movement animations, high-score tracking, and speed leveling systems.",
      cols: "md:col-span-6",
      technologies: ["HTML5 Canvas", "JavaScript", "CSS3"]
    },
    {
      id: "music-app",
      title: "Music App",
      slug: "music-app",
      category: "Web Applications",
      tags: ["Web Applications"],
      description: "A full-featured personal music streaming platform featuring track playback, playlist curation, album views, and ambient visualizer panels.",
      cols: "md:col-span-6",
      technologies: ["React", "TypeScript", "Tailwind CSS", "Web Audio API"]
    }
  ];

  const filtered = projectsData.filter((p) => {
    const matchesCategory =
      selectedCategory === "All" || p.tags.includes(selectedCategory);
    const matchesSearch =
      p.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
      p.description.toLowerCase().includes(searchQuery.toLowerCase()) ||
      p.technologies.some((t) => t.toLowerCase().includes(searchQuery.toLowerCase()));
    return matchesCategory && matchesSearch;
  });

  return (
    <div className="max-w-[1280px] w-full mx-auto px-margin-mobile md:px-margin-desktop pt-32 pb-24 flex flex-col gap-16 relative z-10 text-left font-sans">
      {/* Background blobs */}
      <div className="bg-blob blob-1 absolute top-0 left-1/4 w-[500px] h-[500px] bg-primary/10 rounded-full blur-[120px] pointer-events-none -z-10"></div>
      <div className="bg-blob blob-2 absolute bottom-0 right-1/4 w-[400px] h-[400px] bg-tertiary/5 rounded-full blur-[100px] pointer-events-none -z-10"></div>

      {/* Header Section */}
      <header className="max-w-3xl">
        <h1 className="font-display text-4xl sm:text-5xl md:text-6xl font-bold tracking-tight text-on-surface leading-[1.1] mb-6">
          Selected Projects
        </h1>
        <p className="font-body text-base sm:text-lg text-on-surface-variant leading-relaxed">
          A showcase of production-grade systems and interactive architectures. Explore live telemetry, simulated environments, and core operational mechanics of recent builds.
        </p>

        {/* Search & Filter bar */}
        <div className="glass-surface rounded-2xl p-2 mt-8 flex flex-col md:flex-row gap-4 items-center w-full max-w-4xl border border-outline-variant/30 dark:border-outline/20">
          <div className="flex-grow flex items-center bg-white/60 dark:bg-black/30 rounded-xl px-4 py-2.5 border border-transparent transition-all w-full focus-within:bg-white dark:focus-within:bg-black/50 border-outline-variant/10">
            <span className="material-symbols-outlined text-outline dark:text-outline-variant mr-3">search</span>
            <input
              className="bg-transparent border-none focus:ring-0 text-on-surface dark:text-surface-bright w-full font-body text-sm placeholder:text-outline-variant dark:placeholder:text-outline p-0 focus:outline-none"
              placeholder="Search projects, technologies..."
              type="text"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
            />
            <div className="hidden md:flex items-center justify-center bg-surface-container dark:bg-surface-container-highest px-2 py-1 rounded text-[10px] text-outline font-mono border border-outline-variant/30 dark:border-outline/20 ml-2 shadow-sm">
              ⌘ K
            </div>
          </div>
          <div className="flex flex-wrap gap-2 w-full md:w-auto overflow-x-auto pb-2 md:pb-0 px-1 hide-scrollbar">
            {["All", "Automation", "Data Analytics", "Web Applications"].map((cat) => (
              <button
                key={cat}
                onClick={() => setSelectedCategory(cat)}
                className={`px-4 py-2 rounded-full font-mono text-[10px] uppercase tracking-wider transition-colors border ${
                  selectedCategory === cat
                    ? "bg-primary text-on-primary border-primary"
                    : "bg-surface-container text-on-surface-variant border-outline-variant/15 hover:bg-surface-container-high"
                }`}
              >
                {cat}
              </button>
            ))}
          </div>
        </div>
      </header>

      {/* Projects Grid */}
      <section className="grid grid-cols-1 md:grid-cols-12 gap-6 items-stretch">
        {filtered.length === 0 ? (
          <div className="col-span-12 py-16 text-center text-on-surface-variant font-body">
            No projects matched your criteria. Try adjusting filters.
          </div>
        ) : (
          filtered.map((project) => {
            if (project.id === "ultimate-mini-web-scraper") {
              return (
                <article key={project.id} className={`${project.cols} glass-card rounded-2xl flex flex-col overflow-hidden group border border-outline-variant/20 hover:border-primary/20`}>
                  {/* Interactive Scraper Demo */}
                  <div className="h-64 md:h-80 bg-[#060a0f] border-b border-outline-variant/30 flex flex-col overflow-hidden p-4">
                    <div className="flex flex-col gap-3 flex-grow justify-center max-w-lg mx-auto w-full">
                      <div className="flex gap-2">
                        <div className="flex-1 flex flex-col gap-1">
                          <label className="font-mono text-[9px] text-outline uppercase tracking-wider">Target URL</label>
                          <input 
                            type="text" 
                            className="bg-black/45 border border-outline-variant/30 rounded-lg px-3 py-1.5 text-xs text-on-surface font-body w-full focus:outline-none focus:border-primary"
                            value={scraperUrl}
                            onChange={(e) => setScraperUrl(e.target.value)}
                            placeholder="https://example.com"
                          />
                        </div>
                        <div className="flex flex-col gap-1 w-2/5">
                          <label className="font-mono text-[9px] text-outline uppercase tracking-wider">CSS Selector</label>
                          <input 
                            type="text" 
                            className="bg-black/45 border border-outline-variant/30 rounded-lg px-3 py-1.5 text-xs text-on-surface font-body w-full focus:outline-none focus:border-primary"
                            value={scraperSelector}
                            onChange={(e) => setScraperSelector(e.target.value)}
                            placeholder="a"
                          />
                        </div>
                      </div>
                      <button 
                        onClick={handleScrape}
                        disabled={isScraping}
                        className="bg-primary text-on-primary font-mono text-[10px] uppercase py-2 px-4 rounded-lg hover:opacity-90 transition-all font-bold flex items-center justify-center gap-1.5 shadow-md disabled:opacity-50"
                      >
                        {isScraping ? (
                          <>
                            <span className="w-3.5 h-3.5 border-2 border-on-primary border-t-transparent rounded-full animate-spin"></span>
                            SCRAPING...
                          </>
                        ) : (
                          <>
                            <span className="material-symbols-outlined text-xs">network_ping</span>
                            RUN CLIENT SCRAPE
                          </>
                        )}
                      </button>

                      {/* Scrape results list */}
                      <div className="bg-black/60 rounded-xl p-3 border border-white/5 h-28 md:h-36 overflow-y-auto font-mono text-[10px] text-left">
                        {scrapeError && <div className="text-red-400">{scrapeError}</div>}
                        {!scrapeError && scrapeResults.length === 0 && (
                          <div className="text-outline/55 flex flex-col items-center justify-center h-full text-center">
                            <span>Ready to scrape. Click button to fetch live elements.</span>
                          </div>
                        )}
                        {!scrapeError && scrapeResults.map((res, rIdx) => (
                          <div key={rIdx} className="border-b border-white/5 pb-1 mb-1 last:border-b-0 last:pb-0">
                            <span className="text-primary font-bold mr-1">[{rIdx + 1}]</span>
                            <span className="text-on-surface select-all">{res.text}</span>
                            {res.href && (
                              <a 
                                href={res.href} 
                                target="_blank" 
                                rel="noreferrer" 
                                className="text-tertiary block truncate hover:underline text-[9px]"
                              >
                                {res.href}
                              </a>
                            )}
                          </div>
                        ))}
                      </div>
                    </div>
                  </div>

                  <div className="p-8 flex flex-col flex-grow text-left">
                    <div className="flex justify-between items-start mb-4">
                      <h3 className="font-display font-bold text-2xl text-on-surface">{project.title}</h3>
                      <span className="px-2.5 py-0.5 rounded-full bg-secondary-container/10 text-secondary border border-secondary/20 text-[10px] font-mono font-bold">
                        {project.category}
                      </span>
                    </div>
                    <p className="font-body text-sm text-on-surface-variant mb-6 flex-grow leading-relaxed">
                      {project.description}
                    </p>
                    <div className="flex flex-wrap gap-1.5 mb-6">
                      {project.technologies.map((t, idx) => (
                        <span key={idx} className="px-2 py-0.5 rounded bg-surface-container-high text-[10px] font-mono text-on-surface-variant border border-outline-variant/10 font-medium">
                          {t}
                        </span>
                      ))}
                    </div>
                    {/* Metrics Footer */}
                    <div className="grid grid-cols-3 gap-4 border-t border-outline-variant/15 pt-6 mb-6 font-mono text-[10px] text-left">
                      <div>
                        <div className="text-outline uppercase tracking-wider">CORS Proxy</div>
                        <div className="font-semibold text-xs text-on-surface mt-1">allorigins.win</div>
                      </div>
                      <div>
                        <div className="text-outline uppercase tracking-wider">Parser</div>
                        <div className="font-semibold text-xs text-on-surface mt-1">DOMParser API</div>
                      </div>
                      <div>
                        <div className="text-outline uppercase tracking-wider">Mode</div>
                        <div className="font-semibold text-xs text-on-surface mt-1">Asynchronous</div>
                      </div>
                    </div>
                    <div className="flex gap-4">
                      <a href="https://github.com/Romeo-Bess/ultimate-mini-web-scraper" target="_blank" rel="noreferrer" className="bg-primary text-on-primary px-5 py-2.5 rounded-lg font-mono text-xs flex items-center gap-1.5 hover:opacity-95 shadow-[0_0_15px_rgba(0,80,203,0.1)] transition-all">
                        <span className="material-symbols-outlined text-[16px]">open_in_new</span>
                        Repository
                      </a>
                      <Link to={`/projects/${project.slug}`} className="border border-outline-variant text-on-surface px-5 py-2.5 rounded-lg font-mono text-xs flex items-center gap-1.5 hover:border-primary hover:text-primary transition-colors">
                        Case Study
                        <span className="material-symbols-outlined text-[16px]">arrow_forward</span>
                      </Link>
                    </div>
                  </div>
                </article>
              );
            }

            if (project.id === "snake") {
              return (
                <article key={project.id} className={`${project.cols} glass-card rounded-2xl flex flex-col overflow-hidden group border border-outline-variant/20 hover:border-primary/20`}>
                  {/* Canvas Game Area */}
                  <div className="h-48 relative overflow-hidden bg-surface-container-highest flex items-center justify-center">
                    <canvas 
                      ref={snakeCanvasRef} 
                      width={280} 
                      height={180} 
                      className="w-full h-full object-cover border-b border-outline-variant/10 shadow-inner" 
                    />
                    <div className="absolute top-3 right-3 bg-secondary/15 text-secondary text-[9px] font-mono font-bold px-2 py-0.5 rounded border border-secondary/25">
                      HTML5 Canvas
                    </div>
                  </div>
                  <div className="p-6 flex flex-col flex-grow text-left">
                    <h3 className="font-display font-semibold text-lg text-on-surface mb-2">{project.title}</h3>
                    <p className="font-body text-xs sm:text-sm text-on-surface-variant mb-6 flex-grow leading-relaxed">
                      {project.description}
                    </p>
                    <div className="flex flex-wrap gap-1.5 mb-6">
                      {project.technologies.map((t, idx) => (
                        <span key={idx} className="px-2 py-0.5 rounded bg-surface-container-high text-[10px] font-mono text-on-surface-variant border border-outline-variant/10 font-medium">
                          {t}
                        </span>
                      ))}
                    </div>
                    <div className="bg-surface-container-low/40 rounded-xl p-4 border border-outline-variant/10 mb-6 flex justify-between items-center">
                      <span className="font-mono text-[10px] text-outline uppercase">Movement</span>
                      <span className="font-mono text-xs font-bold text-tertiary">Smooth Frame Loop</span>
                    </div>
                    <div className="flex gap-4">
                      <a href="https://github.com/Romeo-Bess/Snake" target="_blank" rel="noreferrer" className="bg-primary text-on-primary px-4 py-2 rounded-lg font-mono text-xs flex items-center gap-1.5 hover:opacity-95 shadow-[0_0_15px_rgba(0,80,203,0.1)] transition-all">
                        <span className="material-symbols-outlined text-[14px]">open_in_new</span>
                        Repository
                      </a>
                      <Link to={`/projects/${project.slug}`} className="inline-flex items-center gap-1 text-xs font-mono font-bold text-outline hover:text-primary pt-2 ml-auto">
                        <span>Read Case Study</span>
                        <span className="material-symbols-outlined text-[14px]">arrow_forward</span>
                      </Link>
                    </div>
                  </div>
                </article>
              );
            }

            if (project.id === "romeo-runner") {
              return (
                <article key={project.id} className={`${project.cols} glass-card rounded-2xl flex flex-col overflow-hidden group border border-outline-variant/20 hover:border-primary/20`}>
                  {/* Live typing terminal area */}
                  <div className="h-48 bg-[#030508] border-b border-outline-variant/30 flex flex-col font-mono text-left">
                    <div className="h-8 bg-surface-container-lowest border-b border-white/5 flex items-center px-4 gap-4">
                      <span className="text-[10px] text-outline font-mono font-bold uppercase">bash</span>
                      <span className="text-[10px] text-tertiary font-mono font-bold border-b border-tertiary pb-1 mt-1">runner.log</span>
                    </div>
                    <div className="flex-grow p-4 text-xs font-mono text-outline leading-relaxed overflow-y-auto">
                      <div><span className="text-primary">$</span> romeo-runner init --env production</div>
                      <div className="text-outline/60">Connecting to hardware controllers (1.2s)</div>
                      <div className="text-tertiary">✓ Liquid handler interface online.</div>
                      <div><span className="text-primary">$</span> romeo-runner run --target pathology_pack</div>
                      <div className="text-outline/60">Executing diagnostic loop...</div>
                      {terminalLines.map((line, lIdx) => {
                        const isSuccess = line && line.startsWith("✓");
                        return (
                          <div key={lIdx} className={isSuccess ? "text-tertiary" : "text-outline/60"}>
                            {line}
                          </div>
                        );
                      })}
                      <span className="inline-block w-1.5 h-3.5 bg-tertiary animate-pulse ml-0.5" />
                    </div>
                  </div>

                  <div className="p-6 flex flex-col flex-grow text-left">
                    <div className="flex justify-between items-start mb-3">
                      <div className="flex items-center gap-2.5">
                        <div className="w-8 h-8 rounded-lg bg-primary/10 flex items-center justify-center text-primary">
                          <span className="material-symbols-outlined text-lg">precision_manufacturing</span>
                        </div>
                        <h3 className="font-display font-semibold text-lg text-on-surface">{project.title}</h3>
                      </div>
                      <a href="https://github.com/Romeo-Bess/Romeo-Runner" target="_blank" rel="noreferrer" className="text-outline hover:text-primary transition-colors">
                        <span className="material-symbols-outlined text-[18px]">open_in_new</span>
                      </a>
                    </div>
                    <p className="font-body text-xs sm:text-sm text-on-surface-variant mb-6 flex-grow leading-relaxed">
                      {project.description}
                    </p>
                    <div className="flex flex-wrap gap-1.5 mb-6">
                      {project.technologies.map((t, idx) => (
                        <span key={idx} className="px-2 py-0.5 rounded bg-surface-container-high text-[10px] font-mono text-on-surface-variant border border-outline-variant/10 font-medium">
                          {t}
                        </span>
                      ))}
                    </div>
                    <div className="flex justify-between items-center border-t border-outline-variant/10 pt-4 mt-auto font-mono text-[10px] text-outline mb-4">
                      <span>Cycle Latency</span>
                      <span className="text-primary font-bold">&lt; 250ms dispatch</span>
                    </div>
                    <div className="flex gap-4">
                      <a href="https://github.com/Romeo-Bess/Romeo-Runner" target="_blank" rel="noreferrer" className="border border-outline-variant text-on-surface px-3 py-1.5 rounded-lg font-mono text-[10px] flex items-center gap-1 hover:border-primary hover:text-primary transition-colors">
                        Repository
                      </a>
                      <a href="https://romeo-runner.vercel.app/" target="_blank" rel="noreferrer" className="bg-primary text-on-primary px-3 py-1.5 rounded-lg font-mono text-[10px] flex items-center gap-1 hover:opacity-95 transition-all ml-auto">
                        <span className="material-symbols-outlined text-[12px]">open_in_new</span>
                        Live Demo
                      </a>
                    </div>
                  </div>
                </article>
              );
            }

            if (project.id === "music-app") {
              return (
                <article key={project.id} className={`${project.cols} glass-card rounded-2xl flex flex-col overflow-hidden group border border-outline-variant/20 hover:border-primary/20`}>
                  {/* Interactive music player sandbox */}
                  <div className="h-48 bg-[#0a0f16] border-b border-outline-variant/30 flex items-center justify-center p-4">
                    <div className="w-full max-w-sm bg-surface-container-highest/60 border border-outline-variant/20 rounded-xl p-4 flex flex-col gap-3">
                      <div className="flex justify-between items-center">
                        <span className="font-mono text-[9px] uppercase tracking-wider text-outline">Player Sandbox</span>
                        <span className="text-[9px] font-mono bg-secondary/15 text-secondary px-2 py-0.5 rounded flex items-center gap-1">
                          <Volume2 className="w-3 h-3" />
                          Web Audio
                        </span>
                      </div>
                      
                      {/* Track display */}
                      <div className="flex items-center gap-3 bg-black/40 p-2.5 rounded-lg border border-white/5">
                        <button 
                          onClick={() => setIsPlaying(!isPlaying)}
                          className="w-9 h-9 rounded-full bg-primary flex items-center justify-center text-on-primary hover:scale-105 active:scale-95 transition-all"
                        >
                          {isPlaying ? <Pause className="w-4 h-4 fill-current" /> : <Play className="w-4 h-4 fill-current translate-x-0.5" />}
                        </button>
                        <div className="flex-1 min-w-0 text-left">
                          <div className="font-display font-semibold text-xs text-on-surface truncate">Coding Beats</div>
                          <div className="font-mono text-[9px] text-outline truncate">Romeo Bessenaar</div>
                        </div>
                        {/* Waveform */}
                        <div className="flex items-end gap-0.5 h-6">
                          {musicBars.map((hVal, mIdx) => (
                            <div 
                              key={mIdx} 
                              className="w-0.5 bg-primary/75 rounded-full transition-all duration-200"
                              style={{ height: `${hVal}%` }}
                            />
                          ))}
                        </div>
                      </div>

                      {/* Slider */}
                      <div className="flex items-center gap-2 text-[9px] font-mono text-outline">
                        <span>0:{Math.floor(progress * 0.1).toString().padStart(2, "0")}</span>
                        <div className="flex-1 h-1 bg-surface-container rounded-full overflow-hidden relative">
                          <div 
                            className="h-full bg-primary transition-all duration-300"
                            style={{ width: `${progress}%` }}
                          />
                        </div>
                        <span>1:00</span>
                      </div>

                    </div>
                  </div>

                  <div className="p-6 flex flex-col flex-grow text-left">
                    <div className="flex justify-between items-start mb-3">
                      <div className="flex items-center gap-2.5">
                        <div className="w-8 h-8 rounded-lg bg-secondary/15 flex items-center justify-center text-secondary">
                          <span className="material-symbols-outlined text-lg">audiotrack</span>
                        </div>
                        <h3 className="font-display font-semibold text-lg text-on-surface">{project.title}</h3>
                      </div>
                      <a href="https://github.com/Romeo-Bess/Music-App" target="_blank" rel="noreferrer" className="text-outline hover:text-secondary transition-colors">
                        <span className="material-symbols-outlined text-[18px]">open_in_new</span>
                      </a>
                    </div>
                    <p className="font-body text-xs sm:text-sm text-on-surface-variant mb-6 flex-grow leading-relaxed">
                      {project.description}
                    </p>
                    <div className="flex flex-wrap gap-1.5 mb-6">
                      {project.technologies.map((t, idx) => (
                        <span key={idx} className="px-2 py-0.5 rounded bg-surface-container-high text-[10px] font-mono text-on-surface-variant border border-outline-variant/10 font-medium">
                          {t}
                        </span>
                      ))}
                    </div>
                    <div className="flex justify-between items-center border-t border-outline-variant/10 pt-4 mt-auto font-mono text-[10px] text-outline">
                      <span>Visualization</span>
                      <span className="text-secondary font-bold">Canvas Audio Node</span>
                    </div>
                  </div>
                </article>
              );
            }

            return null;
          })
        )}
      </section>
    </div>
  );
};
export default Projects;
