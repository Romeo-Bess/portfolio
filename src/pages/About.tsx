import React, { useEffect, useRef, useState } from "react";
import { Link } from "react-router-dom";
import { motion, useScroll, useTransform } from "framer-motion";

const runeVariants = {
  hidden: { opacity: 0, y: 30 },
  visible: (i: number) => ({
    opacity: 1,
    y: 0,
    transition: { duration: 0.6, delay: i * 0.12, ease: [0.22, 1, 0.36, 1] },
  }),
};

/* ─── Small floating rune decoration ─── */
const RuneDot = ({ className }: { className?: string }) => (
  <svg viewBox="0 0 24 24" fill="none" className={`w-4 h-4 opacity-30 ${className}`}>
    <path d="M12 2L14.5 9.5H22L16 14L18.5 21.5L12 17L5.5 21.5L8 14L2 9.5H9.5L12 2Z" fill="currentColor" />
  </svg>
);

/* ─── Animated counter ─── */
const Counter = ({ target, suffix = "" }: { target: number; suffix?: string }) => {
  const [count, setCount] = useState(0);
  const ref = useRef<HTMLSpanElement>(null);
  const started = useRef(false);

  useEffect(() => {
    const observer = new IntersectionObserver(([entry]) => {
      if (entry.isIntersecting && !started.current) {
        started.current = true;
        let start = 0;
        const step = target / 60;
        const timer = setInterval(() => {
          start += step;
          if (start >= target) { setCount(target); clearInterval(timer); }
          else setCount(Math.floor(start));
        }, 16);
      }
    });
    if (ref.current) observer.observe(ref.current);
    return () => observer.disconnect();
  }, [target]);

  return <span ref={ref}>{count}{suffix}</span>;
};

export const About: React.FC = () => {
  const heroRef = useRef<HTMLDivElement>(null);
  const { scrollYProgress } = useScroll({ target: heroRef, offset: ["start start", "end start"] });
  const imgY = useTransform(scrollYProgress, [0, 1], ["0%", "12%"]);
  const imgScale = useTransform(scrollYProgress, [0, 1], [1, 1.04]);

  const stats = [
    { label: "Years Experience", value: 3, suffix: "+" },
    { label: "Endpoints Managed", value: 200, suffix: "+" },
    { label: "Systems Automated", value: 12, suffix: "" },
    { label: "Certs in Progress", value: 2, suffix: "" },
  ];

  const principles = [
    {
      title: "Precision",
      desc: "Every configuration matters. Every packet has intent. I engineer systems where accuracy is non-negotiable.",
      icon: "my_location",
      rune: "◈",
      gradient: "from-cyan-500/20 to-cyan-500/5",
      border: "border-cyan-500/20",
      glowColor: "rgba(6,182,212,0.15)",
    },
    {
      title: "Automation",
      desc: "Manual is a liability. I build pipelines that remove human bottlenecks from diagnostic and infrastructure workflows.",
      icon: "terminal",
      rune: "◆",
      gradient: "from-emerald-500/20 to-emerald-500/5",
      border: "border-emerald-500/20",
      glowColor: "rgba(16,185,129,0.15)",
    },
    {
      title: "Empathy",
      desc: "Systems serve humans. Every interface, every automation, every alert — designed to reduce cognitive load on the people using it.",
      icon: "favorite",
      rune: "◉",
      gradient: "from-rose-500/20 to-rose-500/5",
      border: "border-rose-500/20",
      glowColor: "rgba(244,63,94,0.15)",
    },
  ];

  const journey = [
    {
      era: "Origin",
      role: "Medical Lab Assistant",
      company: "Umane Pathology",
      period: "2020 – 2022",
      desc: "Started at the clinical frontline — processing samples, running diagnostic protocols, and witnessing firsthand the friction between medical staff and legacy software systems. This embedded a permanent understanding of healthcare stakes.",
      tags: ["Histopathology", "Clinical QA", "HL7 Context"],
      color: "#0066ff",
      icon: "biotech",
    },
    {
      era: "Ascension",
      role: "Salesforce Engineer",
      company: "MicronetBD",
      period: "2022 – 2023",
      desc: "Transitioned into pure software — building CRM automation, Lightning Web Components, and Apex triggers for US-based healthcare clients. Bridged the gap between clinical workflows and enterprise SaaS architecture.",
      tags: ["Salesforce LWC", "Apex", "CRM Automation"],
      color: "#00d084",
      icon: "cloud",
    },
    {
      era: "Current",
      role: "Automation & Network Specialist",
      company: "Groote Schuur Hospital",
      period: "2023 – Present",
      desc: "Architecting enterprise network infrastructure for 200+ endpoints, orchestrating robotic pathology automation pipelines, and building internal tooling that eliminates manual intervention across the diagnostic cycle.",
      tags: ["CCNA Aligned", "Network Infra", "Python / Bash", "Docker"],
      color: "#f59e0b",
      icon: "hub",
    },
  ];

  return (
    <div className="w-full overflow-x-hidden">

      {/* ══════════════════════════════════════════════════════
          HERO — Full bleed with floating portrait
      ══════════════════════════════════════════════════════ */}
      <section ref={heroRef} className="relative min-h-[100vh] w-full flex items-end overflow-hidden">
        {/* Dark gradient background — no box, no border */}
        <div className="absolute inset-0 bg-gradient-to-br from-slate-950 via-slate-900 to-slate-800" />

        {/* Fable-style ambient light shafts */}
        <div
          className="absolute top-0 right-1/4 w-[600px] h-[800px] pointer-events-none"
          style={{
            background: "radial-gradient(ellipse at 60% 0%, rgba(245,158,11,0.12) 0%, transparent 70%)",
            transform: "rotate(-15deg)",
          }}
        />
        <div
          className="absolute bottom-0 left-0 w-[500px] h-[500px] pointer-events-none"
          style={{ background: "radial-gradient(ellipse at 0% 100%, rgba(6,182,212,0.08) 0%, transparent 70%)" }}
        />

        {/* Floating rune particles */}
        <div className="absolute inset-0 pointer-events-none overflow-hidden">
          {[
            { top: "15%", left: "8%", color: "text-amber-400", size: "w-5 h-5", delay: "0s" },
            { top: "28%", left: "3%", color: "text-cyan-400", size: "w-3 h-3", delay: "0.5s" },
            { top: "60%", left: "6%", color: "text-amber-300", size: "w-4 h-4", delay: "1s" },
            { top: "10%", right: "42%", color: "text-cyan-500", size: "w-3 h-3", delay: "0.3s" },
            { top: "45%", right: "44%", color: "text-amber-500", size: "w-5 h-5", delay: "0.8s" },
          ].map((r, i) => (
            <div
              key={i}
              className={`absolute ${r.color} ${r.size} animate-pulse`}
              style={{ top: r.top, left: (r as any).left, right: (r as any).right, animationDelay: r.delay, opacity: 0.25 }}
            >
              <RuneDot />
            </div>
          ))}
        </div>

        {/* Portrait — bleeds right, no container box */}
        <motion.div
          style={{ y: imgY, scale: imgScale }}
          className="absolute bottom-0 right-0 md:right-[5%] lg:right-[8%] w-[340px] sm:w-[420px] md:w-[500px] lg:w-[580px] xl:w-[640px] pointer-events-none select-none z-10"
        >
          <img
            src="/assets/logo.png"
            alt="Romeo Bessenaar"
            className="w-full h-auto object-contain object-bottom drop-shadow-2xl"
            style={{
              filter: "drop-shadow(0 0 60px rgba(245,158,11,0.18)) drop-shadow(0 40px 80px rgba(0,0,0,0.6))",
              maskImage: "linear-gradient(to top, transparent 0%, black 15%, black 90%, transparent 100%)",
              WebkitMaskImage: "linear-gradient(to top, transparent 0%, black 15%, black 90%, transparent 100%)",
            }}
          />
          {/* Amber floor glow under feet */}
          <div
            className="absolute bottom-0 left-1/2 -translate-x-1/2 w-64 h-12 rounded-full pointer-events-none"
            style={{ background: "radial-gradient(ellipse, rgba(245,158,11,0.25) 0%, transparent 70%)", filter: "blur(12px)" }}
          />
        </motion.div>

        {/* Left text content */}
        <div className="relative z-20 w-full max-w-[1280px] mx-auto px-margin-mobile md:px-margin-desktop pb-20 pt-36 grid grid-cols-1 md:grid-cols-12 gap-8">
          <div className="md:col-span-6 lg:col-span-5 flex flex-col gap-6">

            {/* Badge */}
            <motion.div
              initial={{ opacity: 0, x: -20 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ duration: 0.5 }}
              className="inline-flex items-center gap-2 px-3 py-1.5 rounded-full border text-[10px] font-mono w-fit"
              style={{ borderColor: "rgba(245,158,11,0.3)", background: "rgba(245,158,11,0.08)", color: "#f59e0b" }}
            >
              <RuneDot className="text-amber-400 w-3 h-3" />
              <span>HERO PROFILE · LEVEL 3 SPECIALIST</span>
            </motion.div>

            {/* Name */}
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6, delay: 0.1 }}
            >
              <h1 className="font-display text-5xl sm:text-6xl md:text-7xl font-bold tracking-tight leading-[1.0] text-white">
                Romeo<br />
                <span style={{
                  background: "linear-gradient(135deg, #f59e0b 0%, #fcd34d 40%, #f59e0b 80%)",
                  WebkitBackgroundClip: "text",
                  WebkitTextFillColor: "transparent",
                  backgroundClip: "text",
                }}>
                  Bessenaar
                </span>
              </h1>
              <p className="font-mono text-sm mt-3" style={{ color: "rgba(245,158,11,0.6)" }}>
                Automation · Networks · Web Engineering
              </p>
            </motion.div>

            {/* Bio */}
            <motion.p
              initial={{ opacity: 0, y: 15 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6, delay: 0.2 }}
              className="font-body text-base leading-relaxed max-w-md"
              style={{ color: "rgba(255,255,255,0.6)" }}
            >
              From clinical lab benches to enterprise network racks — I build systems where the stakes are real. Healthcare infrastructure, robotic automation, and production web platforms are my domain.
            </motion.p>

            {/* CTA buttons */}
            <motion.div
              initial={{ opacity: 0, y: 15 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6, delay: 0.3 }}
              className="flex flex-wrap gap-3"
            >
              <Link
                to="/contact"
                className="inline-flex items-center gap-2 px-6 py-3 rounded-full text-sm font-mono font-semibold transition-all hover:-translate-y-0.5"
                style={{ background: "linear-gradient(135deg, #f59e0b, #d97706)", color: "#000", boxShadow: "0 8px 24px rgba(245,158,11,0.3)" }}
              >
                <span className="material-symbols-outlined text-[16px]">send</span>
                Begin Quest
              </Link>
              <Link
                to="/projects"
                className="inline-flex items-center gap-2 px-6 py-3 rounded-full text-sm font-mono border transition-all hover:-translate-y-0.5"
                style={{ borderColor: "rgba(255,255,255,0.15)", color: "rgba(255,255,255,0.7)", background: "rgba(255,255,255,0.05)" }}
              >
                <span className="material-symbols-outlined text-[16px]">inventory_2</span>
                View Arsenal
              </Link>
            </motion.div>
          </div>

          {/* Character Stat Scroll — overlapping hero bottom */}
          <motion.div
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.7, delay: 0.4 }}
            className="md:col-span-6 lg:col-span-7 flex items-end justify-start md:justify-end"
          >
            <div
              className="relative p-5 rounded-2xl border w-full max-w-sm"
              style={{
                background: "rgba(10, 12, 18, 0.75)",
                backdropFilter: "blur(24px)",
                borderColor: "rgba(245,158,11,0.2)",
                boxShadow: "0 0 60px rgba(245,158,11,0.06), inset 0 1px 0 rgba(245,158,11,0.1)",
              }}
            >
              {/* Top rune bar */}
              <div className="flex items-center justify-between mb-4">
                <div className="flex items-center gap-2">
                  <RuneDot className="text-amber-400 w-3.5 h-3.5" />
                  <span className="font-mono text-[10px] uppercase tracking-widest" style={{ color: "rgba(245,158,11,0.6)" }}>
                    Character Stats
                  </span>
                </div>
                <div className="flex gap-1">
                  {["◈", "◆", "◉"].map((r, i) => (
                    <span key={i} className="text-[10px]" style={{ color: "rgba(245,158,11,0.3)" }}>{r}</span>
                  ))}
                </div>
              </div>

              {/* Stat bars */}
              {[
                { label: "Network Mastery", val: 92, color: "#06b6d4" },
                { label: "Automation Craft", val: 88, color: "#10b981" },
                { label: "Web Engineering", val: 81, color: "#a855f7" },
                { label: "Clinical Insight", val: 95, color: "#f59e0b" },
              ].map((stat, i) => (
                <div key={i} className="mb-3">
                  <div className="flex justify-between items-center mb-1">
                    <span className="font-mono text-[10px]" style={{ color: "rgba(255,255,255,0.5)" }}>{stat.label}</span>
                    <span className="font-mono text-[10px] font-bold" style={{ color: stat.color }}>{stat.val}</span>
                  </div>
                  <div className="w-full h-1 rounded-full" style={{ background: "rgba(255,255,255,0.06)" }}>
                    <motion.div
                      initial={{ width: 0 }}
                      animate={{ width: `${stat.val}%` }}
                      transition={{ duration: 1.2, delay: 0.6 + i * 0.1, ease: [0.22, 1, 0.36, 1] }}
                      className="h-full rounded-full"
                      style={{ background: `linear-gradient(90deg, ${stat.color}88, ${stat.color})`, boxShadow: `0 0 8px ${stat.color}44` }}
                    />
                  </div>
                </div>
              ))}

              {/* Bottom counters */}
              <div className="grid grid-cols-4 gap-2 mt-5 pt-4" style={{ borderTop: "1px solid rgba(245,158,11,0.1)" }}>
                {stats.map((s, i) => (
                  <div key={i} className="text-center">
                    <div className="font-display font-bold text-lg text-white">
                      <Counter target={s.value} suffix={s.suffix} />
                    </div>
                    <div className="font-mono text-[8px] leading-tight mt-0.5" style={{ color: "rgba(255,255,255,0.3)" }}>
                      {s.label}
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </motion.div>
        </div>

        {/* Bottom fade into page */}
        <div className="absolute bottom-0 left-0 right-0 h-32 pointer-events-none z-30"
          style={{ background: "linear-gradient(to bottom, transparent, var(--color-bg, #0f1117))" }}
        />
      </section>

      {/* ══════════════════════════════════════════════════════
          CORE PRINCIPLES — Rune Cards
      ══════════════════════════════════════════════════════ */}
      <section className="max-w-[1280px] w-full mx-auto px-margin-mobile md:px-margin-desktop py-28 relative">
        {/* Section label */}
        <div className="flex flex-col items-center mb-16 text-center">
          <div className="flex items-center gap-3 mb-4">
            <div className="h-px w-16 bg-gradient-to-r from-transparent to-amber-500/40" />
            <span className="font-mono text-[10px] uppercase tracking-[0.3em] text-amber-500/60">Chapter I</span>
            <div className="h-px w-16 bg-gradient-to-l from-transparent to-amber-500/40" />
          </div>
          <h2 className="font-display text-3xl md:text-4xl font-bold text-on-surface">The Three Tenets</h2>
          <p className="font-body text-sm text-on-surface-variant mt-3 max-w-md">
            Three guiding principles that shape how I approach every system, interface, and workflow.
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          {principles.map((pr, i) => (
            <motion.div
              key={i}
              custom={i}
              initial="hidden"
              whileInView="visible"
              viewport={{ once: true, margin: "-60px" }}
              variants={runeVariants}
              className={`relative rounded-2xl p-8 border flex flex-col gap-5 overflow-hidden group cursor-default transition-all duration-300 hover:-translate-y-1`}
              style={{
                background: `linear-gradient(145deg, ${pr.glowColor} 0%, transparent 60%)`,
                borderColor: pr.border.replace("border-", "").replace("/20", ""),
                boxShadow: `0 0 0 1px rgba(255,255,255,0.03), 0 4px 24px rgba(0,0,0,0.2)`,
              }}
            >
              {/* Background rune watermark */}
              <div
                className="absolute right-4 bottom-4 font-display font-black text-[80px] leading-none select-none pointer-events-none transition-opacity duration-500"
                style={{ color: pr.glowColor.replace("0.15)", "0.08)"), opacity: 0.4 }}
              >
                {pr.rune}
              </div>

              {/* Icon */}
              <div
                className="w-12 h-12 rounded-xl flex items-center justify-center"
                style={{ background: pr.glowColor.replace("0.15", "0.15"), border: `1px solid ${pr.border.replace("border-", "").replace("/20", "")}` }}
              >
                <span className="material-symbols-outlined text-[22px]" style={{ color: pr.glowColor.replace("rgba(", "").split(",")[0].trim() === "6" ? "#06b6d4" : pr.glowColor.includes("185") ? "#10b981" : "#f43f5e" }}>
                  {pr.icon}
                </span>
              </div>

              <div>
                <h3 className="font-display text-xl font-bold text-on-surface mb-2">{pr.title}</h3>
                <p className="font-body text-sm text-on-surface-variant leading-relaxed">{pr.desc}</p>
              </div>
            </motion.div>
          ))}
        </div>
      </section>

      {/* ══════════════════════════════════════════════════════
          JOURNEY — Quest Log Timeline
      ══════════════════════════════════════════════════════ */}
      <section className="w-full border-t border-outline-variant/10 py-28 relative overflow-hidden">
        {/* Ambient glow */}
        <div className="absolute top-0 left-1/2 -translate-x-1/2 w-[800px] h-[400px] pointer-events-none"
          style={{ background: "radial-gradient(ellipse at center top, rgba(245,158,11,0.04) 0%, transparent 70%)" }}
        />

        <div className="max-w-[1280px] mx-auto px-margin-mobile md:px-margin-desktop">
          <div className="flex flex-col items-center mb-16 text-center">
            <div className="flex items-center gap-3 mb-4">
              <div className="h-px w-16 bg-gradient-to-r from-transparent to-amber-500/40" />
              <span className="font-mono text-[10px] uppercase tracking-[0.3em] text-amber-500/60">Quest Log</span>
              <div className="h-px w-16 bg-gradient-to-l from-transparent to-amber-500/40" />
            </div>
            <h2 className="font-display text-3xl md:text-4xl font-bold text-on-surface">The Journey</h2>
            <p className="font-body text-sm text-on-surface-variant mt-3 max-w-md">
              Three chapters. Each one built on the last. The path from clinical labs to enterprise infrastructure.
            </p>
          </div>

          {/* Timeline cards */}
          <div className="relative">
            {/* Connecting line (desktop) */}
            <div className="hidden md:block absolute top-10 left-0 right-0 h-px"
              style={{ background: "linear-gradient(90deg, transparent, rgba(245,158,11,0.15) 20%, rgba(245,158,11,0.15) 80%, transparent)" }}
            />

            <div className="grid grid-cols-1 md:grid-cols-3 gap-6 md:gap-8">
              {journey.map((ev, i) => (
                <motion.div
                  key={i}
                  custom={i}
                  initial="hidden"
                  whileInView="visible"
                  viewport={{ once: true, margin: "-60px" }}
                  variants={runeVariants}
                  className="relative flex flex-col"
                  style={{ marginTop: i === 1 ? "32px" : i === 2 ? "64px" : "0px" }}
                >
                  {/* Era dot */}
                  <div className="flex items-center gap-3 mb-6">
                    <div
                      className="w-8 h-8 rounded-full border-2 flex items-center justify-center shrink-0 z-10"
                      style={{ borderColor: ev.color, background: `${ev.color}18`, boxShadow: `0 0 16px ${ev.color}40` }}
                    >
                      <span className="material-symbols-outlined text-[14px]" style={{ color: ev.color }}>{ev.icon}</span>
                    </div>
                    <div>
                      <span className="font-mono text-[9px] uppercase tracking-widest" style={{ color: `${ev.color}99` }}>{ev.era}</span>
                      <p className="font-mono text-[10px] text-outline">{ev.period}</p>
                    </div>
                  </div>

                  {/* Card */}
                  <div
                    className="flex-1 rounded-2xl p-6 border relative overflow-hidden"
                    style={{
                      background: "rgba(255,255,255,0.02)",
                      borderColor: `${ev.color}20`,
                      boxShadow: `0 0 40px ${ev.color}08`,
                    }}
                  >
                    {/* Big number watermark */}
                    <div
                      className="absolute right-4 top-4 font-display font-black text-[80px] leading-none pointer-events-none select-none"
                      style={{ color: `${ev.color}06` }}
                    >
                      0{i + 1}
                    </div>

                    <h3 className="font-display text-lg font-bold text-on-surface mb-1">{ev.role}</h3>
                    <p className="font-mono text-xs font-semibold mb-4" style={{ color: ev.color }}>{ev.company}</p>
                    <p className="font-body text-sm text-on-surface-variant leading-relaxed mb-5">{ev.desc}</p>

                    <div className="flex flex-wrap gap-1.5">
                      {ev.tags.map((tag) => (
                        <span
                          key={tag}
                          className="px-2 py-0.5 rounded font-mono text-[9px]"
                          style={{ background: `${ev.color}10`, border: `1px solid ${ev.color}20`, color: `${ev.color}cc` }}
                        >
                          {tag}
                        </span>
                      ))}
                    </div>
                  </div>
                </motion.div>
              ))}
            </div>
          </div>
        </div>
      </section>

      {/* ══════════════════════════════════════════════════════
          PORTRAIT FOCUS — Large centered portrait block
      ══════════════════════════════════════════════════════ */}
      <section className="w-full py-24 relative overflow-hidden">
        <div className="absolute inset-0" style={{ background: "radial-gradient(ellipse at center, rgba(245,158,11,0.04) 0%, transparent 70%)" }} />

        <div className="max-w-[1280px] mx-auto px-margin-mobile md:px-margin-desktop">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-12 items-center">

            {/* Large portrait — standalone on dark bg */}
            <motion.div
              initial={{ opacity: 0, x: -30 }}
              whileInView={{ opacity: 1, x: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.7 }}
              className="relative flex items-end justify-center"
            >
              {/* Background circle halo */}
              <div
                className="absolute inset-0 rounded-full pointer-events-none"
                style={{
                  background: "radial-gradient(ellipse at center 80%, rgba(245,158,11,0.12) 0%, transparent 65%)",
                  filter: "blur(20px)",
                }}
              />
              <img
                src="/assets/logo.png"
                alt="Romeo Bessenaar"
                className="relative w-full max-w-md object-contain z-10"
                style={{
                  filter: "drop-shadow(0 20px 60px rgba(245,158,11,0.2)) drop-shadow(0 0 40px rgba(0,0,0,0.5))",
                  maskImage: "linear-gradient(to top, transparent 0%, black 8%, black 100%)",
                  WebkitMaskImage: "linear-gradient(to top, transparent 0%, black 8%, black 100%)",
                }}
              />
              {/* Floor glow */}
              <div
                className="absolute bottom-4 left-1/2 -translate-x-1/2 w-56 h-8 rounded-full"
                style={{ background: "radial-gradient(ellipse, rgba(245,158,11,0.3) 0%, transparent 70%)", filter: "blur(16px)" }}
              />
            </motion.div>

            {/* Right text block */}
            <motion.div
              initial={{ opacity: 0, x: 30 }}
              whileInView={{ opacity: 1, x: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.7, delay: 0.1 }}
              className="flex flex-col gap-8"
            >
              <div>
                <div className="flex items-center gap-3 mb-4">
                  <div className="h-px w-8 bg-amber-500/40" />
                  <span className="font-mono text-[10px] uppercase tracking-[0.3em] text-amber-500/60">Chapter II</span>
                </div>
                <h2 className="font-display text-3xl md:text-4xl font-bold text-on-surface mb-4">
                  Beyond the Keyboard
                </h2>
                <p className="font-body text-base text-on-surface-variant leading-relaxed">
                  When I'm not deep in network configs or building automation pipelines, I'm gaming (Fable, obviously), studying for CCNA certifications, or iterating on side projects that scratch my own engineering itch.
                </p>
              </div>

              <div className="flex flex-col gap-4">
                {[
                  { label: "Currently studying", value: "CCNA Routing & Switching", icon: "school" },
                  { label: "Current obsession", value: "Fable 5 aesthetics → portfolio UX", icon: "auto_awesome" },
                  { label: "Side project", value: "Artisane Gallery — luxury art marketplace", icon: "palette" },
                  { label: "Based in", value: "Cape Town, South Africa", icon: "location_on" },
                ].map((item, i) => (
                  <div key={i} className="flex items-start gap-4 p-4 rounded-xl border border-outline-variant/10 bg-surface-container-low/30">
                    <div className="w-8 h-8 rounded-lg bg-amber-500/10 border border-amber-500/20 flex items-center justify-center shrink-0">
                      <span className="material-symbols-outlined text-[16px] text-amber-400">{item.icon}</span>
                    </div>
                    <div>
                      <p className="font-mono text-[10px] uppercase tracking-widest text-outline mb-0.5">{item.label}</p>
                      <p className="font-body text-sm text-on-surface font-medium">{item.value}</p>
                    </div>
                  </div>
                ))}
              </div>
            </motion.div>
          </div>
        </div>
      </section>

      {/* ══════════════════════════════════════════════════════
          CTA — End of scroll
      ══════════════════════════════════════════════════════ */}
      <section
        className="w-full py-28 text-center relative overflow-hidden border-t border-outline-variant/10"
        style={{ background: "linear-gradient(135deg, rgba(245,158,11,0.04) 0%, transparent 50%, rgba(6,182,212,0.04) 100%)" }}
      >
        <div className="max-w-[600px] mx-auto px-margin-mobile flex flex-col items-center gap-6">
          <div className="flex items-center gap-3">
            <RuneDot className="text-amber-400" />
            <span className="font-mono text-[10px] uppercase tracking-[0.3em] text-amber-500/60">Ready to collaborate?</span>
            <RuneDot className="text-amber-400" />
          </div>
          <h2 className="font-display text-3xl sm:text-4xl font-bold text-on-surface">
            Start a New Quest
          </h2>
          <p className="font-body text-sm text-on-surface-variant leading-relaxed">
            Whether it's network architecture, clinical automation, or a full-stack web build — I'm open to interesting problems worth solving.
          </p>
          <div className="flex flex-wrap justify-center gap-4 mt-2">
            <Link
              to="/contact"
              className="inline-flex items-center gap-2 px-8 py-3 rounded-full text-sm font-mono font-semibold transition-all hover:-translate-y-0.5"
              style={{ background: "linear-gradient(135deg, #f59e0b, #d97706)", color: "#000", boxShadow: "0 8px 24px rgba(245,158,11,0.25)" }}
            >
              <span className="material-symbols-outlined text-[16px]">send</span>
              Get In Touch
            </Link>
            <Link
              to="/resume"
              className="inline-flex items-center gap-2 px-8 py-3 rounded-full text-sm font-mono border border-outline-variant/30 hover:border-amber-500/30 transition-all hover:-translate-y-0.5 text-on-surface"
            >
              <span className="material-symbols-outlined text-[16px]">description</span>
              View Resume
            </Link>
          </div>
        </div>
      </section>

    </div>
  );
};

export default About;
