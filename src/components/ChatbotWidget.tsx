import React, { useState, useRef, useEffect } from "react";
import { X, Send, Trash2, ChevronDown, Wifi, Code2, Briefcase, FlaskConical, FolderKanban, Phone, Cpu, GraduationCap } from "lucide-react";

interface Message {
  sender: "user" | "bot";
  text: string;
  timestamp: string;
}

const QUICK_ACTIONS = [
  { label: "🌐 Networking", icon: Wifi, query: "Tell me about Romeo's network engineering background and CCNA training" },
  { label: "🎓 Education", icon: GraduationCap, query: "What did Romeo study at CPUT?" },
  { label: "🏥 Groote Schuur", icon: Briefcase, query: "Tell me about Romeo's internship at Groote Schuur Hospital" },
  { label: "💼 Salesforce", icon: Code2, query: "Tell me about Romeo's Salesforce Engineer role at Micronetbd" },
  { label: "🔬 Lab Work", icon: FlaskConical, query: "Tell me about Romeo's lab automation work at Umane Pathology" },
  { label: "🗂️ Projects", icon: FolderKanban, query: "What projects has Romeo built?" },
  { label: "⚡ Tech Stack", icon: Cpu, query: "What is Romeo's full technical stack?" },
  { label: "📞 Contact", icon: Phone, query: "How can I contact Romeo?" },
];

const KB: Record<string, { keywords: string[]; reply: string }> = {
  networking: {
    keywords: ["network", "ccna", "vlan", "dhcp", "router", "switch", "routing", "switching", "cisco", "icmp", "subnet", "tcp", "ip", "firewall", "infrastructure", "wifi", "wireless", "lan", "wan", "cabling", "intern"],
    reply: `Romeo is a qualified **Network & Systems Engineer** with a strong foundation in telecommunications infrastructure.\n\n**Core Networking Skills:**\n• CCNA-aligned routing, switching & network security\n• VLAN configuration, DHCP management & subnetting\n• Network troubleshooting & endpoint support (200+ devices)\n• Structured cabling, hardware installation & maintenance\n• TCP/IP, DNS, firewall configuration & LAN/WAN setup\n\n**Field Experience:**\nDuring his internship at **Groote Schuur Hospital**, Romeo supported IT operations across a complex multi-department network environment, assisting with switch deployments, endpoint configurations, and helpdesk escalations.\n\nHe currently holds a **Diploma in ICT: Communication Networks** from CPUT and continues to advance his practical knowledge in enterprise networking.`,
  },
  education: {
    keywords: ["cput", "cape peninsula", "study", "degree", "diploma", "university", "qualification", "college", "course", "ict"],
    reply: `Romeo studied at the **Cape Peninsula University of Technology (CPUT)** in Cape Town, South Africa.\n\n**Qualification:**\n📜 Diploma in ICT: Communication Networks\n\n**Key Subjects Covered:**\n• Data Communications & Computer Networks\n• Network Infrastructure & Administration\n• Cybersecurity Fundamentals\n• Linux & Windows Server Administration\n• Programming (Java, Python, Web Dev)\n• Database Management Systems\n\nHis academic foundation gave him both the theoretical knowledge and hands-on lab experience needed for enterprise IT environments.`,
  },
  groote_schuur: {
    keywords: ["groote", "schuur", "hospital", "internship", "gsh", "healthcare", "it support", "helpdesk", "medical"],
    reply: `Romeo completed his **ICT Internship at Groote Schuur Hospital** — one of South Africa's largest and most prestigious teaching hospitals.\n\n**Key Responsibilities:**\n• Supported **200+ endpoints** across hospital departments\n• Assisted with VLAN and DHCP configuration on hospital network\n• Deployed and configured network switches across wards\n• Provided hardware/software troubleshooting and IT helpdesk support\n• Configured workstations with Windows operating systems and domain policy\n• Documented network issues and escalation procedures\n\nThis experience gave Romeo real-world exposure to mission-critical IT infrastructure where reliability and accuracy are non-negotiable.`,
  },
  salesforce: {
    keywords: ["salesforce", "apex", "soql", "lwc", "lightning", "crm", "flow", "micronetbd", "force.com", "developer"],
    reply: `Romeo worked as a **Salesforce Engineer at MicronetBD Inc** — a USA-based remote development firm.\n\n**What He Built:**\n• Custom CRM workflows using **Apex** triggers and classes\n• Responsive user interfaces using **Lightning Web Components (LWC)**\n• Automation pipelines with **Salesforce Flow** and Process Builder\n• REST API integrations connecting Salesforce to external systems\n• Custom **SOQL** queries for reporting and data management\n\n**Methodology:**\nWorked in **Agile sprints** with international team members, delivering iterative improvements to client CRM platforms.\n\nThis role sharpened Romeo's ability to build scalable business logic in a cloud-first enterprise environment.`,
  },
  lab: {
    keywords: ["umane", "pathology", "lab", "histology", "microtomy", "staining", "h&e", "ihc", "specimen", "biopsy", "automation", "embedding", "clinical"],
    reply: `Romeo works at **Umane Pathology** as a Histology Technician in Training and Lab Automation Specialist — a unique crossover role combining science and technology.\n\n**Laboratory Skills:**\n• Tissue embedding, sectioning via microtomy\n• H&E and Immunohistochemistry (IHC) staining protocols\n• Specimen accessioning and tracking workflows\n\n**Tech He Built for the Lab:**\n• Lightweight web apps to automate specimen logging and reporting\n• Digital workflow tools that replaced manual paper-based processes\n• Internal lab dashboards for status tracking\n\nThis role reflects Romeo's versatility — he's equally comfortable at a lab bench as he is behind a keyboard engineering solutions.`,
  },
  projects: {
    keywords: ["project", "portfolio", "demo", "runner", "scraper", "music", "snake", "game", "app", "build", "code"],
    reply: `Romeo's portfolio features several interactive projects:\n\n**1. 🎮 Romeo Runner**\nA live dashboard application embedding the actual running app — showcasing real-time UI engineering.\n\n**2. 🕷️ Ultimate Mini Web Scraper**\nA client-side web scraper using a CORS proxy to extract CSS selectors and data from live web pages in-browser.\n\n**3. 🐍 Retro Snake Game**\nA smooth, HTML5 Canvas-based classic Snake game with score tracking and responsive controls.\n\n**4. 🎵 Music App**\nAn in-browser audio player that programmatically synthesizes electronic drum loops using the Web Audio API.\n\nAll demos run **live in the browser** — head to the **Projects** page to play with them!`,
  },
  tech_stack: {
    keywords: ["stack", "skills", "tech", "technologies", "tools", "language", "programming", "software", "hardware"],
    reply: `Romeo's technical stack spans networking, development, and automation:\n\n**🌐 Networking & Infrastructure:**\n• VLAN, DHCP, Subnetting, TCP/IP\n• Routing & Switching (CCNA-aligned)\n• Cisco IOS, Windows Server, Linux\n\n**💻 Software Development:**\n• JavaScript / TypeScript, React, Node.js\n• HTML5 / CSS3, Tailwind CSS\n• Java, Python basics\n\n**☁️ Cloud & CRM:**\n• Salesforce (Apex, SOQL, LWC, Flow)\n• REST API integrations\n\n**🛠️ DevOps & Databases:**\n• Docker, Kubernetes, Git/GitHub\n• SQL, MySQL, PostgreSQL, Tableau\n\n**🔬 Specialised:**\n• Lab automation scripting\n• Histology lab technology`,
  },
  contact: {
    keywords: ["contact", "email", "hire", "linkedin", "phone", "reach", "message", "cv", "resume", "available", "freelance"],
    reply: `You can reach Romeo through multiple channels:\n\n**📧 Email:**\nhello@romeo.com\n\n**💼 LinkedIn:**\nlinkedin.com/in/romeo-bessenaar-b21044209\n\n**📱 Phone:**\n073 057 1940\n\n**📍 Location:**\nCape Town, South Africa\n\nYou can also use the **Contact** page on this site to send a message directly. Romeo is open to networking roles, Salesforce projects, and freelance web development work!`,
  },
  greeting: {
    keywords: ["hello", "hi", "hey", "howzit", "good morning", "good day", "sup", "yo"],
    reply: `Hi there! 👋 I'm Romeo's digital assistant.\n\nI can help you explore his background in:\n🌐 Network Engineering & CCNA training\n🎓 ICT studies at CPUT\n🏥 IT internship at Groote Schuur Hospital\n💼 Salesforce development at Micronetbd\n🔬 Lab automation at Umane Pathology\n🗂️ Portfolio projects & demos\n\nJust ask me anything or tap one of the quick buttons below!`,
  },
};

export const ChatbotWidget: React.FC = () => {
  const [isOpen, setIsOpen] = useState(false);
  const [inputText, setInputText] = useState("");
  const [isTyping, setIsTyping] = useState(false);
  const [messages, setMessages] = useState<Message[]>([]);
  const [isMinimized, setIsMinimized] = useState(false);
  const messagesEndRef = useRef<HTMLDivElement>(null);
  const inputRef = useRef<HTMLInputElement>(null);

  const getTimestamp = () => {
    return new Date().toLocaleTimeString([], { hour: "2-digit", minute: "2-digit" });
  };

  useEffect(() => {
    if (messages.length === 0) {
      setMessages([
        {
          sender: "bot",
          text: "Hey! 👋 I'm Romeo's AI assistant.\n\nAsk me anything about his **Network Engineering** background, **Salesforce** development skills, or his **portfolio projects**. What would you like to know?",
          timestamp: getTimestamp(),
        },
      ]);
    }
  }, []);

  useEffect(() => {
    if (isOpen && !isMinimized) {
      setTimeout(() => inputRef.current?.focus(), 300);
    }
  }, [isOpen, isMinimized]);

  const clearChat = () => {
    setMessages([
      {
        sender: "bot",
        text: "Chat cleared! ✨ Feel free to ask me anything about Romeo's professional background.",
        timestamp: getTimestamp(),
      },
    ]);
  };

  const generateReply = (text: string): string => {
    const lower = text.toLowerCase();
    for (const key of Object.keys(KB)) {
      const entry = KB[key];
      if (entry.keywords.some((kw) => lower.includes(kw))) {
        return entry.reply;
      }
    }
    return `I specialize in Romeo's professional profile. Here's what I can help with:\n\n• 🌐 **Network Engineering** — CCNA, VLANs, DHCP, Groote Schuur\n• 🎓 **Education** — Diploma ICT at CPUT\n• 💼 **Salesforce** — Apex, LWC, Micronetbd Inc\n• 🔬 **Lab Automation** — Umane Pathology\n• 🗂️ **Projects** — Live demos & builds\n• 📞 **Contact** — Email, LinkedIn, phone\n\nTry one of the quick buttons below, or rephrase your question!`;
  };

  const sendMessage = (text: string) => {
    if (!text.trim() || isTyping) return;

    const userMsg: Message = { sender: "user", text: text.trim(), timestamp: getTimestamp() };
    setMessages((prev) => [...prev, userMsg]);
    setInputText("");
    setIsTyping(true);

    const delay = 600 + Math.random() * 600;
    setTimeout(() => {
      const reply = generateReply(text);
      setMessages((prev) => [...prev, { sender: "bot", text: reply, timestamp: getTimestamp() }]);
      setIsTyping(false);
    }, delay);
  };

  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
  }, [messages, isTyping]);

  // Renders bold **text** markers
  const renderText = (text: string) => {
    return text.split("\n").map((line, i) => {
      const parts = line.split(/(\*\*[^*]+\*\*)/g);
      const rendered = parts.map((part, j) => {
        if (part.startsWith("**") && part.endsWith("**")) {
          return <strong key={j} className="font-semibold text-on-surface">{part.slice(2, -2)}</strong>;
        }
        return <span key={j}>{part}</span>;
      });

      if (line.startsWith("• ")) {
        return (
          <div key={i} className="flex gap-2 mt-1 pl-1">
            <span className="text-primary mt-0.5 shrink-0">•</span>
            <span>{rendered}</span>
          </div>
        );
      }
      return (
        <p key={i} className={i > 0 ? "mt-1.5" : ""}>
          {rendered}
        </p>
      );
    });
  };

  return (
    <div className="fixed bottom-6 right-6 z-[90] flex flex-col items-end gap-3">
      {/* ── Chat Window ── */}
      {isOpen && (
        <div
          className={`w-[380px] sm:w-[460px] rounded-2xl border border-outline-variant/30 bg-surface-container-low/97 backdrop-blur-2xl shadow-2xl overflow-hidden flex flex-col transition-all duration-300 ${
            isMinimized ? "h-[64px]" : "h-[600px]"
          }`}
          style={{ boxShadow: "0 32px 80px rgba(0,0,0,0.35), 0 8px 24px rgba(0,0,0,0.2)" }}
        >
          {/* Header */}
          <div className="bg-gradient-to-r from-primary/15 to-secondary/10 border-b border-outline-variant/20 px-4 py-3 flex items-center justify-between shrink-0">
            <div className="flex items-center gap-3">
              <div className="relative shrink-0">
                <img
                  src="/assets/logo.png"
                  alt="Romeo's Assistant"
                  className="w-11 h-11 rounded-full object-cover border-2 border-primary/40 shadow-md"
                />
                <span className="absolute bottom-0.5 right-0.5 w-3 h-3 bg-emerald-500 border-2 border-surface-container-low rounded-full animate-pulse" />
              </div>
              <div className="text-left">
                <h4 className="font-display font-bold text-sm text-on-surface leading-tight">Romeo's AI Assistant</h4>
                <div className="flex items-center gap-1.5 mt-0.5">
                  <span className="w-1.5 h-1.5 rounded-full bg-emerald-400 animate-pulse" />
                  <p className="text-[10px] font-mono text-emerald-400 font-semibold tracking-wider uppercase">Online · Ready</p>
                </div>
              </div>
            </div>
            <div className="flex items-center gap-1">
              <button
                onClick={clearChat}
                title="Clear conversation"
                className="p-2 rounded-full text-on-surface-variant hover:bg-surface-container-high hover:text-red-400 transition-colors"
              >
                <Trash2 className="w-3.5 h-3.5" />
              </button>
              <button
                onClick={() => setIsMinimized(!isMinimized)}
                title={isMinimized ? "Expand" : "Minimise"}
                className="p-2 rounded-full text-on-surface-variant hover:bg-surface-container-high transition-colors"
              >
                <ChevronDown className={`w-4 h-4 transition-transform duration-300 ${isMinimized ? "rotate-180" : ""}`} />
              </button>
              <button
                onClick={() => setIsOpen(false)}
                title="Close assistant"
                className="p-2 rounded-full text-on-surface-variant hover:bg-surface-container-high transition-colors"
              >
                <X className="w-4 h-4" />
              </button>
            </div>
          </div>

          {!isMinimized && (
            <>
              {/* Messages */}
              <div className="flex-1 px-4 py-4 overflow-y-auto flex flex-col gap-3 bg-surface/20 scrollbar-thin scrollbar-thumb-outline-variant/30 scrollbar-track-transparent">
                {messages.map((msg, idx) => (
                  <div
                    key={idx}
                    className={`flex flex-col gap-1 max-w-[88%] ${msg.sender === "bot" ? "self-start" : "self-end items-end"}`}
                  >
                    {msg.sender === "bot" && (
                      <div className="flex items-center gap-1.5 mb-0.5 pl-1">
                        <img src="/assets/logo.png" alt="" className="w-4 h-4 rounded-full object-cover opacity-80" />
                        <span className="text-[9px] font-mono text-outline uppercase tracking-wider">Assistant</span>
                      </div>
                    )}
                    <div
                      className={`px-4 py-3 rounded-2xl text-[12.5px] font-body leading-relaxed ${
                        msg.sender === "bot"
                          ? "bg-surface-container border border-outline-variant/20 text-on-surface rounded-tl-none"
                          : "bg-primary text-on-primary rounded-tr-none"
                      }`}
                    >
                      {msg.sender === "bot" ? renderText(msg.text) : <p>{msg.text}</p>}
                    </div>
                    <span className="text-[9px] font-mono text-outline px-1">{msg.timestamp}</span>
                  </div>
                ))}

                {isTyping && (
                  <div className="self-start flex flex-col gap-1">
                    <div className="flex items-center gap-1.5 mb-0.5 pl-1">
                      <img src="/assets/logo.png" alt="" className="w-4 h-4 rounded-full object-cover opacity-80" />
                      <span className="text-[9px] font-mono text-outline uppercase tracking-wider">Typing…</span>
                    </div>
                    <div className="bg-surface-container border border-outline-variant/20 px-4 py-3 rounded-2xl rounded-tl-none flex items-center gap-1.5">
                      <span className="w-2 h-2 bg-primary/70 rounded-full animate-bounce" style={{ animationDelay: "0ms" }} />
                      <span className="w-2 h-2 bg-primary/70 rounded-full animate-bounce" style={{ animationDelay: "140ms" }} />
                      <span className="w-2 h-2 bg-primary/70 rounded-full animate-bounce" style={{ animationDelay: "280ms" }} />
                    </div>
                  </div>
                )}
                <div ref={messagesEndRef} />
              </div>

              {/* Quick Action Buttons */}
              <div className="px-3 pt-2.5 pb-2 border-t border-outline-variant/15 bg-surface-container-low flex flex-wrap gap-1.5">
                {QUICK_ACTIONS.map((action) => (
                  <button
                    key={action.label}
                    onClick={() => sendMessage(action.query)}
                    disabled={isTyping}
                    className="text-[10px] font-mono bg-surface-container hover:bg-primary/10 hover:border-primary/40 hover:text-primary disabled:opacity-50 text-on-surface-variant px-2.5 py-1.5 rounded-full border border-outline-variant/30 transition-all duration-200"
                  >
                    {action.label}
                  </button>
                ))}
              </div>

              {/* Input */}
              <div className="px-3 pb-3 pt-2 bg-surface-container-low">
                <form
                  onSubmit={(e) => {
                    e.preventDefault();
                    sendMessage(inputText);
                  }}
                  className="flex items-center gap-2"
                >
                  <input
                    ref={inputRef}
                    type="text"
                    placeholder="Ask about networks, Salesforce, projects…"
                    className="flex-1 bg-surface-container border border-outline-variant/30 rounded-full py-2.5 px-4 text-[12px] font-body focus:outline-none focus:border-primary focus:ring-1 focus:ring-primary/40 text-on-surface placeholder:text-outline transition-all"
                    value={inputText}
                    onChange={(e) => setInputText(e.target.value)}
                    disabled={isTyping}
                  />
                  <button
                    type="submit"
                    disabled={!inputText.trim() || isTyping}
                    className="p-2.5 bg-primary text-on-primary rounded-full hover:opacity-90 disabled:opacity-40 transition-all shadow-md shadow-primary/30 shrink-0"
                  >
                    <Send className="w-3.5 h-3.5" />
                  </button>
                </form>
              </div>
            </>
          )}
        </div>
      )}

      {/* ── FAB Button ── */}
      <div className="relative">
        {/* Animated ring */}
        {!isOpen && (
          <span className="absolute inset-0 rounded-full animate-ping bg-primary/30 pointer-events-none" style={{ animationDuration: "2.5s" }} />
        )}
        <button
          onClick={() => {
            setIsOpen(!isOpen);
            setIsMinimized(false);
          }}
          className="relative w-[64px] h-[64px] rounded-full overflow-hidden shadow-2xl shadow-primary/40 border-[3px] border-primary hover:border-primary/80 hover:scale-110 hover:-translate-y-1 active:scale-95 transition-all duration-300 z-[91] bg-surface-container group"
          title="Chat with Romeo's Assistant"
        >
          {isOpen ? (
            <div className="w-full h-full flex items-center justify-center bg-surface-container-high">
              <X className="w-7 h-7 text-on-surface transition-transform group-hover:rotate-90 duration-300" />
            </div>
          ) : (
            <img
              src="/assets/logo.png"
              alt="Open chat assistant"
              className="w-full h-full object-cover transition-transform group-hover:scale-110 duration-300"
            />
          )}
          {/* Online dot */}
          {!isOpen && (
            <span className="absolute bottom-1 right-1 flex h-4 w-4">
              <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-emerald-400 opacity-75" />
              <span className="relative inline-flex rounded-full h-4 w-4 bg-emerald-500 border-2 border-surface-container" />
            </span>
          )}
        </button>
      </div>
    </div>
  );
};

export default ChatbotWidget;
