import React from "react";
import { motion } from "framer-motion";

interface TimelineEvent {
  role: string;
  company: string;
  type: string;
  tagColorClass: string;
  borderClass: string;
  description: string;
}

export const About: React.FC = () => {
  const principles = [
    {
      title: "Innovation",
      desc: "Pushing boundaries beyond legacy systems to create future-proof solutions.",
      icon: "lightbulb",
      iconColor: "text-primary",
      bgColor: "bg-primary/15"
    },
    {
      title: "Precision",
      desc: "Engineering workflows with absolute accuracy, knowing every data point matters.",
      icon: "my_location",
      iconColor: "text-tertiary",
      bgColor: "bg-tertiary/15"
    },
    {
      title: "Empathy",
      desc: "Designing systems that serve the humans operating them, reducing cognitive load.",
      icon: "favorite",
      iconColor: "text-secondary",
      bgColor: "bg-secondary/15"
    }
  ];

  const journeyEvents: TimelineEvent[] = [
    {
      role: "Medical Lab Assistant",
      company: "Umane Pathology",
      type: "Foundation",
      tagColorClass: "text-primary bg-primary/10 dark:bg-primary/20",
      borderClass: "border-l-primary dark:border-l-inverse-primary",
      description: "Mastering the clinical realities and daily frictions of diagnostic environments."
    },
    {
      role: "Salesforce Engineer",
      company: "MicronetBD",
      type: "Transition",
      tagColorClass: "text-tertiary bg-tertiary/10 dark:bg-tertiary/20",
      borderClass: "border-l-tertiary dark:border-l-tertiary-fixed",
      description: "Building CRM automation, Lightning Web Components and Apex solutions for USA-based clients."
    },
    {
      role: "Automation Specialist",
      company: "Umane Pathology / Hospital Automation",
      type: "Current",
      tagColorClass: "text-secondary bg-secondary/10 dark:bg-secondary/20",
      borderClass: "border-l-secondary dark:border-l-secondary-fixed",
      description: "Architecting large-scale robotic and software ecosystems for modern pathology."
    }
  ];

  return (
    <div className="max-w-[1280px] w-full mx-auto px-margin-mobile md:px-margin-desktop pt-32 pb-24 flex flex-col gap-24 relative z-10 text-left font-sans">
      {/* Background blobs */}
      <div className="bg-blob bg-primary/10 dark:bg-primary/5 w-[600px] h-[600px] top-[-100px] left-[-200px] absolute filter blur-[100px] rounded-full pointer-events-none -z-10"></div>
      <div className="bg-blob bg-tertiary/10 dark:bg-tertiary/5 w-[500px] h-[500px] top-[40%] right-[-150px] absolute filter blur-[100px] rounded-full pointer-events-none -z-10"></div>
      <div className="bg-blob bg-secondary/10 dark:bg-secondary/5 w-[700px] h-[700px] bottom-[-200px] left-[10%] absolute filter blur-[100px] rounded-full pointer-events-none -z-10"></div>

      {/* Hero Section */}
      <section className="grid grid-cols-1 md:grid-cols-12 gap-gutter items-center min-h-[500px]">
        <div className="col-span-1 md:col-span-6 flex flex-col gap-4">
          <motion.h1
            initial={{ opacity: 0, x: -25 }}
            animate={{ opacity: 1, x: 0 }}
            className="font-display text-4xl sm:text-5xl md:text-6xl font-bold tracking-tight text-on-surface leading-[1.1]"
          >
            Bridging the gap between{" "}
            <span className="text-primary dark:text-primary-fixed-dim relative inline-block">
              medicine
              <span className="absolute bottom-1.5 left-0 w-full h-2.5 bg-primary/10 dark:bg-primary/20 -z-10 rounded-full"></span>
            </span>{" "}
            and <span className="text-tertiary">machine</span>.
          </motion.h1>
          <motion.p
            initial={{ opacity: 0, y: 15 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.1 }}
            className="font-body text-base sm:text-lg text-on-surface-variant leading-relaxed max-w-md mt-4"
          >
            I am an Automation Specialist focused on translating complex clinical needs into elegant, highly efficient technical realities.
          </motion.p>
        </div>
        <motion.div
          initial={{ opacity: 0, scale: 0.95 }}
          animate={{ opacity: 1, scale: 1 }}
          transition={{ duration: 0.5, delay: 0.2 }}
          className="col-span-1 md:col-span-6 relative h-[400px] rounded-2xl overflow-hidden glass-panel"
        >
          <img
            src="https://lh3.googleusercontent.com/aida-public/AB6AXuDkxem6f2llabxTO2kVfchf-ou4CaTPXWUaYqqFYmxTMqBvRrGKdEhrS6dDcKKleCT1T2022-WQgEU2fkDFMFZZmrivSQ1xzwUj5o_0M2MkjRW7S68nZf_ztmaYXoHYLEh8sxDiGLKLnYsr_lU8lQxhBgg6tz_N_bqoXGvSkvcrTr_EF8h1cDeQ8MycsXxSmXrITdTcyOcU20eMa6ZKS4pTF3oWR7M2y0qVetwL-CSrdjoFlosioXrbTPTn72R0CGbcn0FIby6wOuYA"
            alt="Futuristic clinical lab rendering"
            className="w-full h-full object-cover opacity-90 dark:opacity-80 mix-blend-multiply dark:mix-blend-normal"
          />
        </motion.div>
      </section>

      {/* Core Principles */}
      <section className="flex flex-col gap-12 pt-8">
        <h2 className="font-display text-3xl font-bold text-on-surface text-center">Core Principles</h2>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-gutter">
          {principles.map((pr, idx) => (
            <motion.div
              key={idx}
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ delay: idx * 0.1 }}
              className="glass-card rounded-xl p-8 flex flex-col gap-4 items-start border border-outline-variant/20 hover:border-primary/30"
            >
              <div className={`w-12 h-12 rounded-full ${pr.bgColor} flex items-center justify-center mb-2`}>
                <span className={`material-symbols-outlined ${pr.iconColor} text-2xl`} style={{ fontVariationSettings: "'FILL' 1" }}>
                  {pr.icon}
                </span>
              </div>
              <h3 className="font-display text-lg font-bold text-on-surface">{pr.title}</h3>
              <p className="font-body text-sm text-on-surface-variant leading-relaxed">{pr.desc}</p>
            </motion.div>
          ))}
        </div>
      </section>

      {/* Journey Timeline Section */}
      <section className="flex flex-col gap-12 pt-8 relative">
        <h2 className="font-display text-3xl font-bold text-on-surface text-left">The Journey</h2>
        <div className="relative pl-8 md:pl-0">
          {/* Vertical central timeline line for mobile */}
          <div className="absolute left-[15px] top-0 bottom-0 w-0.5 bg-outline-variant/30 dark:bg-outline-variant/10 md:hidden"></div>
          
          <div className="flex flex-col md:flex-row gap-6 relative">
            {journeyEvents.map((event, idx) => (
              <motion.div
                key={idx}
                initial={{ opacity: 0, y: 25 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ delay: idx * 0.15 }}
                className={`relative md:flex-1 group md:mt-${idx * 12}`}
                style={{ marginTop: `${idx * 24}px` }}
              >
                {/* Timeline dot for mobile */}
                <div className="absolute -left-10 top-6 w-4 h-4 rounded-full bg-primary border-4 border-surface dark:border-slate-900 md:hidden transition-colors"></div>
                <div className={`glass-card rounded-xl p-6 h-full border-l-4 ${event.borderClass}`}>
                  <div className={`font-mono text-[10px] font-bold mb-2 inline-block px-3 py-1 rounded-full ${event.tagColorClass}`}>
                    {event.type}
                  </div>
                  <h4 className="font-display font-semibold text-lg text-on-surface mb-1">
                    {event.role}
                  </h4>
                  <p className="font-mono text-xs font-semibold text-secondary mb-3">
                    {event.company}
                  </p>
                  <p className="font-body text-xs sm:text-sm text-on-surface-variant leading-relaxed">
                    {event.description}
                  </p>
                </div>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* Beyond the Code Masonry */}
      <section className="flex flex-col gap-8 pt-8">
        <div>
          <h2 className="font-display text-3xl font-bold text-on-surface">Beyond the Code</h2>
          <p className="font-body text-sm text-on-surface-variant mt-2">
            A glimpse into the spaces that inspire my work.
          </p>
        </div>
        <div className="columns-1 md:columns-3 gap-gutter space-y-gutter">
          <div className="break-inside-avoid rounded-xl overflow-hidden glass-card p-0 border-0">
            <img
              alt="Intricate circuit board highlighted by soft glowing blue lights"
              className="w-full h-auto dark:opacity-95 hover:scale-102 transition-transform duration-500"
              src="https://lh3.googleusercontent.com/aida-public/AB6AXuAvQR5xnknrK3Jo8FksvCLdvr0xjlikhPweIqSrpn30EpamVLRAu3uS0GgheqdwjJZ3i2MDLZbYzL1s6onwTTw8CuBeK2yoBk8vV_QGmyifdJMS78yLXDKIYkf7kI7L7J2JbSAKO0wn64UH2qetkbolcn2yFzemPGnagXTP8GsKvCmCnJ3zR1aBmb8PGhkf5hssWeIbP9kS4ewXF3hkX06TyiRVxordybInUMcjXnDhGUP2lzMRV1opLPefrnkl3KXw6uRL84__WpO4"
            />
          </div>
          <div className="break-inside-avoid rounded-xl overflow-hidden glass-card p-0 border-0">
            <img
              alt="Brightly lit, minimalist modern office space"
              className="w-full h-auto dark:opacity-95 hover:scale-102 transition-transform duration-500"
              src="https://lh3.googleusercontent.com/aida-public/AB6AXuBV5lGo88AVLtD4JNc_7pD7ksgQVBeRcMUaXTrwyTr7mKVByKRxPOIv7su3KzDHa-KsFpAgdl2WgwGJO-hCqtIb6D-Nfr4_q9RiE3nTqvSgoJjpGpwE-Ax8GpSG3QKLFUYOArPfzuUCf9NrC0Pb_GQA945C0lFi1GsspbxPGMOtBli8A_ldeJUuoJYoyvyet9-fUDoWaBtPPLAJZbDa3W9aBVwkwSqjPcwrawPvNiKKLEqp7r0yzUuTv08VgUbXAhtiqU9R6nDSiajw"
            />
          </div>
          <div className="break-inside-avoid rounded-xl overflow-hidden glass-card p-0 border-0">
            <img
              alt="Close-up of developer hands typing on a premium mechanical keyboard"
              className="w-full h-auto dark:opacity-95 hover:scale-102 transition-transform duration-500"
              src="https://lh3.googleusercontent.com/aida-public/AB6AXuDOiKpn1JQfbx8YKR1ROoM4kMnBI55OTj3_biKvW0a85fsHPRJpiznH-XdLnQutoiyeXg-5TTzV5DNHpGS7A_LGbD3BSoTKQOQFv45v18zxxjAUXyIKBT8HJgBKL2z5J-8dOAyWF7udv8a9YSCNamnbEuLr1sICOqoacn4qeFuw6_ICP4S86V6a6F8SFuECfCKGybKkpq-0LhHEEtCJtc9Crh-dKJYCN1Y8RabJaVnV8CafDkcOVCBPCzFuuZTyPM3xuPVL-UMiYr_2"
            />
          </div>
        </div>
      </section>
    </div>
  );
};
export default About;
