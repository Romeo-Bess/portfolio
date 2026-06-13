import React, { useEffect, useRef, useState } from "react";
import { Link } from "react-router-dom";
import { motion, useScroll, useTransform, AnimatePresence } from "framer-motion";

/* ── Animated number counter ── */
const Counter = ({ target, suffix = "" }: { target: number; suffix?: string }) => {
  const [count, setCount] = useState(0);
  const ref = useRef<HTMLSpanElement>(null);
  const fired = useRef(false);
  useEffect(() => {
    const obs = new IntersectionObserver(([e]) => {
      if (e.isIntersecting && !fired.current) {
        fired.current = true;
        let n = 0;
        const step = target / 50;
        const t = setInterval(() => {
          n += step;
          if (n >= target) { setCount(target); clearInterval(t); }
          else setCount(Math.floor(n));
        }, 20);
      }
    });
    if (ref.current) obs.observe(ref.current);
    return () => obs.disconnect();
  }, [target]);
  return <span ref={ref}>{count}{suffix}</span>;
};

const fadeUp = (delay = 0) => ({
  initial: { opacity: 0, y: 28 },
  whileInView: { opacity: 1, y: 0 },
  viewport: { once: true, margin: "-60px" },
  transition: { duration: 0.65, delay, ease: [0.22, 1, 0.36, 1] },
});

export const About: React.FC = () => {
  const heroRef = useRef<HTMLDivElement>(null);
  const { scrollYProgress } = useScroll({ target: heroRef, offset: ["start start", "end start"] });
  const portraitY = useTransform(scrollYProgress, [0, 1], [0, 80]);
  const textY = useTransform(scrollYProgress, [0, 1], [0, 40]);

  const [activeTab, setActiveTab] = useState(0);

  const tabs = [
    {
      label: "Infrastructure",
      color: "#38bdf8",
      skills: [
        { name: "VLAN Segmentation", level: 94 },
        { name: "Routing & Switching", level: 91 },
        { name: "Network Security", level: 87 },
        { name: "DHCP / DNS", level: 93 },
        { name: "Cisco IOS", level: 85 },
      ],
    },
    {
      label: "Automation",
      color: "#34d399",
      skills: [
        { name: "Docker & Kubernetes", level: 82 },
        { name: "Bash & Python Scripts", level: 89 },
        { name: "CI/CD Pipelines", level: 78 },
        { name: "HL7 Data Channels", level: 91 },
        { name: "PostgreSQL", level: 84 },
      ],
    },
    {
      label: "Engineering",
      color: "#c084fc",
      skills: [
        { name: "React & TypeScript", level: 88 },
        { name: "Salesforce LWC / Apex", level: 83 },
        { name: "Supabase & REST APIs", level: 86 },
        { name: "Tailwind CSS", level: 92 },
        { name: "Node.js", level: 75 },
      ],
    },
  ];

  const journey = [
    {
      year: "2020",
      role: "Medical Lab Assistant",
      company: "Umane Pathology",
      desc: "Began at the clinical frontline — processing samples, running diagnostic protocols, and experiencing firsthand the friction between healthcare staff and outdated software. Built a foundational understanding of what clinical systems actually need to do.",
      color: "#38bdf8",
    },
    {
      year: "2022",
      role: "Salesforce Engineer",
      company: "MicronetBD",
      desc: "Transitioned into software — building Lightning Web Components, Apex triggers, and CRM automation for US-based healthcare clients. Bridged clinical domain knowledge with enterprise SaaS architecture.",
      color: "#34d399",
    },
    {
      year: "2023",
      role: "Automation & Network Specialist",
      company: "Groote Schuur Hospital",
      desc: "Currently architecting enterprise network infrastructure supporting 200+ endpoints, building lab automation pipelines for robotic pathology systems, and developing internal tooling that eliminates manual workflows across the diagnostic cycle.",
      color: "#c084fc",
    },
  ];

  return (
    <div className="w-full overflow-x-hidden">

      {/* ════════════════════════════════
          HERO — Portrait + Text
      ════════════════════════════════ */}
      <section ref={heroRef} className="relative w-full min-h-[100svh] flex items-center overflow-hidden">

        {/* Subtle dark gradient bg */}
        <div className="absolute inset-0 bg-[#080b12]" />

        {/* Background grid pattern */}
        <div
          className="absolute inset-0 pointer-events-none opacity-[0.025]"
          style={{
            backgroundImage: "linear-gradient(rgba(255,255,255,0.5) 1px, transparent 1px), linear-gradient(90deg, rgba(255,255,255,0.5) 1px, transparent 1px)",
            backgroundSize: "60px 60px",
          }}
        />

        {/* Ambient glows */}
        <div className="absolute top-[-10%] right-[20%] w-[700px] h-[700px] rounded-full pointer-events-none"
          style={{ background: "radial-gradient(circle, rgba(56,189,248,0.06) 0%, transparent 70%)" }} />
        <div className="absolute bottom-0 left-[-5%] w-[500px] h-[500px] rounded-full pointer-events-none"
          style={{ background: "radial-gradient(circle, rgba(192,132,252,0.05) 0%, transparent 70%)" }} />

        {/* Portrait — right side, bleeds to edge */}
        <motion.div
          style={{ y: portraitY }}
          className="absolute right-0 bottom-0 w-[45vw] max-w-[640px] min-w-[320px] pointer-events-none select-none z-10"
        >
          <img
            src="/assets/logo.png"
            alt="Romeo Bessenaar"
            className="w-full h-auto object-contain object-bottom"
            style={{
              filter: "drop-shadow(0 0 80px rgba(56,189,248,0.12)) drop-shadow(0 60px 120px rgba(0,0,0,0.7))",
              maskImage: "linear-gradient(to top, transparent 0%, black 12%, black 88%, transparent 100%), linear-gradient(to left, black 70%, transparent 100%)",
              WebkitMaskImage: "linear-gradient(to top, transparent 0%, black 12%, black 88%, transparent 100%), linear-gradient(to left, black 70%, transparent 100%)",
              maskComposite: "intersect",
              WebkitMaskComposite: "destination-in",
            }}
          />
        </motion.div>

        {/* Text content — left */}
        <motion.div
          style={{ y: textY }}
          className="relative z-20 w-full max-w-[1280px] mx-auto px-margin-mobile md:px-margin-desktop pt-32 pb-24 grid grid-cols-1 md:grid-cols-12"
        >
          <div className="md:col-span-6 lg:col-span-5 flex flex-col gap-7">

            {/* Status chip */}
            <motion.div
              initial={{ opacity: 0, x: -16 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ duration: 0.5 }}
              className="inline-flex items-center gap-2 w-fit px-3 py-1.5 rounded-full border text-[11px] font-mono"
              style={{ borderColor: "rgba(56,189,248,0.25)", background: "rgba(56,189,248,0.06)", color: "#38bdf8" }}
            >
              <span className="w-1.5 h-1.5 rounded-full bg-sky-400 animate-pulse" />
              Available for opportunities · Cape Town
            </motion.div>

            {/* Name */}
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.7, delay: 0.1 }}
            >
              <h1 className="font-display text-[clamp(3rem,7vw,5.5rem)] font-bold tracking-tight leading-[1.0] text-white">
                Romeo<br />
                <span
                  className="bg-clip-text text-transparent"
                  style={{ backgroundImage: "linear-gradient(135deg, #38bdf8 0%, #818cf8 50%, #c084fc 100%)" }}
                >
                  Bessenaar
                </span>
              </h1>
              <p className="font-mono text-sm mt-4 text-white/40 tracking-widest uppercase">
                Network · Automation · Full-Stack
              </p>
            </motion.div>

            {/* Bio */}
            <motion.p
              initial={{ opacity: 0, y: 16 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.7, delay: 0.2 }}
              className="font-body text-[15px] leading-[1.75] text-white/55 max-w-[460px]"
            >
              I build systems where the stakes are real. From enterprise network infrastructure at Groote Schuur Hospital to clinical lab automation pipelines and production web apps — I operate across the full depth of modern tech.
            </motion.p>

            {/* CTA */}
            <motion.div
              initial={{ opacity: 0, y: 16 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.7, delay: 0.3 }}
              className="flex flex-wrap gap-3 pt-2"
            >
              <Link
                to="/contact"
                className="inline-flex items-center gap-2 px-6 py-3 rounded-full text-sm font-mono font-semibold text-white transition-all hover:-translate-y-0.5 hover:shadow-lg"
                style={{ background: "linear-gradient(135deg, #38bdf8, #818cf8)", boxShadow: "0 4px 20px rgba(56,189,248,0.2)" }}
              >
                <span className="material-symbols-outlined text-[16px]">send</span>
                Get In Touch
              </Link>
              <Link
                to="/resume"
                className="inline-flex items-center gap-2 px-6 py-3 rounded-full text-sm font-mono text-white/60 border border-white/10 hover:border-white/20 hover:text-white/80 transition-all hover:-translate-y-0.5"
              >
                <span className="material-symbols-outlined text-[16px]">description</span>
                View Resume
              </Link>
            </motion.div>

            {/* Quick stats row */}
            <motion.div
              initial={{ opacity: 0, y: 16 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.7, delay: 0.4 }}
              className="flex gap-8 pt-4 border-t border-white/5 mt-2"
            >
              {[
                { val: 3, suf: "+", label: "Years experience" },
                { val: 200, suf: "+", label: "Endpoints managed" },
                { val: 5, suf: "", label: "Projects shipped" },
              ].map((s, i) => (
                <div key={i}>
                  <div className="font-display text-2xl font-bold text-white">
                    <Counter target={s.val} suffix={s.suf} />
                  </div>
                  <div className="font-mono text-[10px] text-white/30 uppercase tracking-wider mt-0.5">{s.label}</div>
                </div>
              ))}
            </motion.div>
          </div>
        </motion.div>

        {/* Bottom fade */}
        <div className="absolute bottom-0 inset-x-0 h-32 pointer-events-none z-30"
          style={{ background: "linear-gradient(to bottom, transparent, #080b12)" }} />
      </section>

      {/* ════════════════════════════════
          BENTO GRID — About snapshot
      ════════════════════════════════ */}
      <section className="w-full bg-[#080b12] py-24 px-margin-mobile md:px-margin-desktop">
        <div className="max-w-[1280px] mx-auto">

          <motion.div {...fadeUp(0)} className="mb-14">
            <p className="font-mono text-[10px] uppercase tracking-[0.3em] text-white/30 mb-3">About</p>
            <h2 className="font-display text-3xl md:text-5xl font-bold text-white leading-tight">
              The full picture
            </h2>
          </motion.div>

          {/* Bento grid */}
          <div className="grid grid-cols-1 md:grid-cols-12 gap-4 auto-rows-auto">

            {/* Large portrait card */}
            <motion.div
              {...fadeUp(0)}
              className="md:col-span-5 row-span-2 relative rounded-2xl overflow-hidden min-h-[480px]"
              style={{ background: "linear-gradient(145deg, rgba(56,189,248,0.08) 0%, rgba(13,17,28,0.95) 100%)", border: "1px solid rgba(56,189,248,0.08)" }}
            >
              <img
                src="/assets/logo.png"
                alt="Romeo Bessenaar"
                className="absolute bottom-0 left-1/2 -translate-x-1/2 w-[90%] object-contain object-bottom pointer-events-none select-none"
                style={{
                  filter: "drop-shadow(0 20px 60px rgba(56,189,248,0.15))",
                  maskImage: "linear-gradient(to top, transparent 0%, black 10%, black 100%)",
                  WebkitMaskImage: "linear-gradient(to top, transparent 0%, black 10%, black 100%)",
                }}
              />
              <div className="absolute top-6 left-6 right-6">
                <p className="font-mono text-[9px] uppercase tracking-[0.25em] text-sky-400/60 mb-1">Based in</p>
                <p className="font-display text-xl font-bold text-white">Cape Town, SA</p>
              </div>
              <div className="absolute bottom-6 left-6 right-6 p-4 rounded-xl" style={{ background: "rgba(8,11,18,0.85)", backdropFilter: "blur(12px)", border: "1px solid rgba(255,255,255,0.05)" }}>
                <p className="font-mono text-[9px] uppercase tracking-widest text-white/30 mb-1">Current role</p>
                <p className="font-display text-sm font-semibold text-white">Automation & Network Specialist</p>
                <p className="font-mono text-[11px] text-sky-400/70 mt-0.5">Groote Schuur Hospital</p>
              </div>
            </motion.div>

            {/* Bio card */}
            <motion.div
              {...fadeUp(0.05)}
              className="md:col-span-7 rounded-2xl p-7 flex flex-col justify-between"
              style={{ background: "rgba(255,255,255,0.02)", border: "1px solid rgba(255,255,255,0.05)" }}
            >
              <div>
                <p className="font-mono text-[9px] uppercase tracking-[0.25em] text-white/30 mb-4">Background</p>
                <p className="font-body text-[15px] text-white/60 leading-[1.8]">
                  I started in clinical labs — running histopathology workflows, watching staff fight outdated systems daily. That experience gave me something most engineers don't have: an understanding of what it means when infrastructure fails in a hospital.
                </p>
                <p className="font-body text-[15px] text-white/60 leading-[1.8] mt-4">
                  I transitioned into Salesforce engineering, then network infrastructure, then full-stack web. Today I work at the intersection of all three — building systems that are fast, resilient, and actually solve real operational problems.
                </p>
              </div>
              <div className="flex flex-wrap gap-2 mt-6">
                {["CCNA Aligned", "Salesforce LWC", "Docker/K8s", "React", "HL7 Integrations", "PostgreSQL"].map(tag => (
                  <span key={tag} className="px-3 py-1 rounded-full font-mono text-[10px] text-white/50 border border-white/8" style={{ background: "rgba(255,255,255,0.03)" }}>
                    {tag}
                  </span>
                ))}
              </div>
            </motion.div>

            {/* Currently studying */}
            <motion.div
              {...fadeUp(0.1)}
              className="md:col-span-3 rounded-2xl p-6 flex flex-col gap-3"
              style={{ background: "linear-gradient(145deg, rgba(56,189,248,0.08), rgba(129,140,248,0.05))", border: "1px solid rgba(56,189,248,0.1)" }}
            >
              <div className="w-10 h-10 rounded-xl bg-sky-400/10 border border-sky-400/15 flex items-center justify-center">
                <span className="material-symbols-outlined text-[18px] text-sky-400">school</span>
              </div>
              <div>
                <p className="font-mono text-[9px] uppercase tracking-widest text-white/30 mb-1">Studying</p>
                <p className="font-display text-sm font-semibold text-white">CCNA Routing & Switching</p>
                <p className="font-body text-xs text-white/40 mt-1 leading-relaxed">Enterprise routing, security, switching protocols</p>
              </div>
            </motion.div>

            {/* Side project */}
            <motion.div
              {...fadeUp(0.12)}
              className="md:col-span-4 rounded-2xl p-6 flex flex-col gap-3"
              style={{ background: "linear-gradient(145deg, rgba(192,132,252,0.08), transparent)", border: "1px solid rgba(192,132,252,0.1)" }}
            >
              <div className="w-10 h-10 rounded-xl bg-purple-400/10 border border-purple-400/15 flex items-center justify-center">
                <span className="material-symbols-outlined text-[18px] text-purple-400">palette</span>
              </div>
              <div>
                <p className="font-mono text-[9px] uppercase tracking-widest text-white/30 mb-1">Side project</p>
                <p className="font-display text-sm font-semibold text-white">Artisane Gallery</p>
                <p className="font-body text-xs text-white/40 mt-1 leading-relaxed">Premium art marketplace with live auctions & collector dashboards</p>
              </div>
            </motion.div>
          </div>
        </div>
      </section>

      {/* ════════════════════════════════
          SKILLS — Interactive tab panel
      ════════════════════════════════ */}
      <section className="w-full py-24 px-margin-mobile md:px-margin-desktop" style={{ background: "#060910" }}>
        <div className="max-w-[1280px] mx-auto">

          <motion.div {...fadeUp(0)} className="flex flex-col md:flex-row md:items-end justify-between mb-12 gap-6">
            <div>
              <p className="font-mono text-[10px] uppercase tracking-[0.3em] text-white/30 mb-3">Skills</p>
              <h2 className="font-display text-3xl md:text-4xl font-bold text-white">What I work with</h2>
            </div>
            <Link to="/skills" className="inline-flex items-center gap-1.5 font-mono text-sm text-white/40 hover:text-white/70 transition-colors">
              Full skills map
              <span className="material-symbols-outlined text-[16px]">arrow_forward</span>
            </Link>
          </motion.div>

          <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-start">

            {/* Tab selector */}
            <motion.div {...fadeUp(0.05)} className="lg:col-span-4 flex flex-col gap-2">
              {tabs.map((tab, i) => (
                <button
                  key={i}
                  onClick={() => setActiveTab(i)}
                  className={`text-left px-5 py-4 rounded-xl border transition-all duration-300 flex items-center justify-between group ${
                    activeTab === i ? "border-white/10" : "border-white/4 hover:border-white/8"
                  }`}
                  style={{
                    background: activeTab === i ? `${tab.color}0f` : "rgba(255,255,255,0.01)",
                    borderColor: activeTab === i ? `${tab.color}25` : undefined,
                  }}
                >
                  <div>
                    <p className="font-display text-base font-semibold text-white/80">{tab.label}</p>
                    <p className="font-mono text-[10px] text-white/30 mt-0.5">{tab.skills.length} core skills</p>
                  </div>
                  <div
                    className="w-2 h-2 rounded-full transition-opacity"
                    style={{ background: tab.color, opacity: activeTab === i ? 1 : 0.2 }}
                  />
                </button>
              ))}
            </motion.div>

            {/* Skill bars */}
            <motion.div {...fadeUp(0.1)} className="lg:col-span-8">
              <AnimatePresence mode="wait">
                <motion.div
                  key={activeTab}
                  initial={{ opacity: 0, y: 12 }}
                  animate={{ opacity: 1, y: 0 }}
                  exit={{ opacity: 0, y: -8 }}
                  transition={{ duration: 0.3 }}
                  className="flex flex-col gap-4 p-7 rounded-2xl border"
                  style={{ background: "rgba(255,255,255,0.02)", borderColor: `${tabs[activeTab].color}15` }}
                >
                  {tabs[activeTab].skills.map((skill, i) => (
                    <div key={skill.name}>
                      <div className="flex justify-between items-center mb-2">
                        <span className="font-mono text-[12px] text-white/70">{skill.name}</span>
                        <span className="font-mono text-[11px] font-bold" style={{ color: tabs[activeTab].color }}>{skill.level}%</span>
                      </div>
                      <div className="w-full h-1 rounded-full" style={{ background: "rgba(255,255,255,0.06)" }}>
                        <motion.div
                          initial={{ width: 0 }}
                          animate={{ width: `${skill.level}%` }}
                          transition={{ duration: 0.8, delay: i * 0.07, ease: [0.22, 1, 0.36, 1] }}
                          className="h-full rounded-full"
                          style={{
                            background: `linear-gradient(90deg, ${tabs[activeTab].color}66, ${tabs[activeTab].color})`,
                            boxShadow: `0 0 12px ${tabs[activeTab].color}33`,
                          }}
                        />
                      </div>
                    </div>
                  ))}
                </motion.div>
              </AnimatePresence>
            </motion.div>
          </div>
        </div>
      </section>

      {/* ════════════════════════════════
          JOURNEY — Vertical timeline
      ════════════════════════════════ */}
      <section className="w-full py-24 px-margin-mobile md:px-margin-desktop bg-[#080b12]">
        <div className="max-w-[1280px] mx-auto">

          <motion.div {...fadeUp(0)} className="mb-14">
            <p className="font-mono text-[10px] uppercase tracking-[0.3em] text-white/30 mb-3">Career</p>
            <h2 className="font-display text-3xl md:text-4xl font-bold text-white">The journey so far</h2>
          </motion.div>

          <div className="relative flex flex-col gap-0">
            {/* Timeline line */}
            <div className="absolute left-6 md:left-8 top-0 bottom-0 w-px bg-gradient-to-b from-transparent via-white/10 to-transparent" />

            {journey.map((ev, i) => (
              <motion.div
                key={i}
                {...fadeUp(i * 0.1)}
                className="relative flex gap-8 md:gap-12 pb-12 last:pb-0"
              >
                {/* Dot */}
                <div className="relative flex-shrink-0 flex flex-col items-center" style={{ width: "48px" }}>
                  <div
                    className="w-4 h-4 rounded-full border-2 mt-1 z-10"
                    style={{ borderColor: ev.color, background: `${ev.color}22`, boxShadow: `0 0 16px ${ev.color}40` }}
                  />
                </div>

                {/* Content */}
                <div className="flex-1 pb-2">
                  <div className="flex flex-col sm:flex-row sm:items-center gap-2 mb-4">
                    <span
                      className="font-mono text-[10px] font-bold px-2.5 py-1 rounded-full w-fit"
                      style={{ background: `${ev.color}12`, color: ev.color, border: `1px solid ${ev.color}20` }}
                    >
                      {ev.year}
                    </span>
                    <span className="font-mono text-[11px] text-white/25 hidden sm:block">·</span>
                    <span className="font-mono text-[11px] text-white/30">{ev.company}</span>
                  </div>
                  <h3 className="font-display text-xl font-bold text-white mb-3">{ev.role}</h3>
                  <p className="font-body text-[14px] text-white/50 leading-[1.8] max-w-2xl">{ev.desc}</p>
                </div>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* ════════════════════════════════
          CTA
      ════════════════════════════════ */}
      <section className="w-full py-28 px-margin-mobile text-center relative overflow-hidden" style={{ background: "#060910" }}>
        <div className="absolute inset-0 pointer-events-none" style={{ background: "radial-gradient(ellipse at center, rgba(129,140,248,0.05) 0%, transparent 70%)" }} />
        <div className="max-w-[560px] mx-auto relative z-10 flex flex-col items-center gap-6">
          <motion.div {...fadeUp(0)}>
            <p className="font-mono text-[10px] uppercase tracking-[0.3em] text-white/25 mb-5">Let's work together</p>
            <h2 className="font-display text-4xl md:text-5xl font-bold text-white leading-tight">
              Have a problem worth solving?
            </h2>
            <p className="font-body text-[15px] text-white/45 leading-relaxed mt-5 max-w-md mx-auto">
              Whether it's network architecture, clinical automation, or a full-stack web build — I'm open to interesting challenges.
            </p>
          </motion.div>
          <motion.div {...fadeUp(0.1)} className="flex flex-wrap justify-center gap-4 mt-2">
            <Link
              to="/contact"
              className="inline-flex items-center gap-2 px-8 py-3.5 rounded-full text-sm font-mono font-semibold text-white transition-all hover:-translate-y-0.5 hover:shadow-xl"
              style={{ background: "linear-gradient(135deg, #38bdf8, #818cf8)", boxShadow: "0 4px 24px rgba(56,189,248,0.2)" }}
            >
              <span className="material-symbols-outlined text-[16px]">send</span>
              Start a conversation
            </Link>
            <Link
              to="/projects"
              className="inline-flex items-center gap-2 px-8 py-3.5 rounded-full text-sm font-mono text-white/50 border border-white/10 hover:border-white/20 hover:text-white/70 transition-all hover:-translate-y-0.5"
            >
              <span className="material-symbols-outlined text-[16px]">inventory_2</span>
              See my work
            </Link>
          </motion.div>
        </div>
      </section>

    </div>
  );
};

export default About;
