import React, { useEffect, useState } from "react";
import { supabase } from "../supabase/client";
import { motion, AnimatePresence } from "framer-motion";
import { Terminal, Bot, Activity, Search, X, Play, RefreshCw, Layers } from "lucide-react";
import { ResponsiveContainer, AreaChart, Area, XAxis, YAxis, Tooltip } from "recharts";

interface LabEntry {
  id: string;
  title: string;
  description: string;
  category: string;
  demo_url: string;
  github_url: string;
  icon: string;
}

export const Labs: React.FC = () => {
  const [labs, setLabs] = useState<LabEntry[]>([]);
  const [loading, setLoading] = useState(true);
  const [activeCategory, setActiveCategory] = useState("All");
  const [searchQuery, setSearchQuery] = useState("");
  const [activeDemoId, setActiveDemoId] = useState<string | null>(null);

  // Demo States
  const [hl7Input, setHl7Input] = useState(
    "MSH|^~\\&|LAB|HOSP|LIS|PATH|202606121200||ORU^R01|MSG001|P|2.3\nPID|1||PT10023^^^MRN||Bessenaar^Romeo||19920824|M\nOBR|1|ORD124|REQ543|HEM^Hemoglobin|||202606121130||||||||202606121150\nOBX|1|NM|HB^Hemoglobin|1|14.2|g/dL|13.5-17.5|N|||F"
  );
  const [hl7Output, setHl7Output] = useState<any[]>([]);
  const [chatInput, setChatInput] = useState("");
  const [chatLog, setChatLog] = useState<any[]>([
    { role: "assistant", text: "Stain bot ready. You can query about tissue fixations, slides cutting issues, or microtomy parameters." },
  ]);
  const [telemetryData, setTelemetryData] = useState<any[]>([]);

  useEffect(() => {
    const fetchLabs = async () => {
      try {
        const { data } = await supabase.from("labs").select("*");
        if (data) setLabs(data);
      } catch (err) {
        console.error("Error loading labs:", err);
      } finally {
        setLoading(false);
      }
    };
    fetchLabs();
  }, []);

  // Telemetry stream generator
  useEffect(() => {
    if (activeDemoId === "telemetry") {
      const generatePoints = () => {
        const data: any[] = [];
        for (let i = 0; i < 20; i++) {
          data.push({
            time: `${i}s`,
            temp: 37 + Math.random() * 2,
            pressure: 1013 + Math.random() * 20,
          });
        }
        setTelemetryData(data);
      };
      generatePoints();

      const interval = setInterval(() => {
        setTelemetryData((prev) => {
          const next = [...prev.slice(1)];
          const lastTime = parseInt(prev[prev.length - 1].time) + 1;
          next.push({
            time: `${lastTime}s`,
            temp: 37 + Math.random() * 2,
            pressure: 1013 + Math.random() * 20,
          });
          return next;
        });
      }, 1000);

      return () => clearInterval(interval);
    }
  }, [activeDemoId]);

  const categories = ["All", "AI", "Automation", "Visuals", "UI"];

  const filteredLabs = labs.filter((lab) => {
    const matchesSearch =
      lab.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
      lab.description.toLowerCase().includes(searchQuery.toLowerCase());
    const matchesCat = activeCategory === "All" || lab.category === activeCategory;
    return matchesSearch && matchesCat;
  });

  // HL7 Decode Logic
  const handleDecode = () => {
    const lines = hl7Input.split("\n");
    const segments = lines.map((line) => {
      const fields = line.split("|");
      const segmentName = fields[0];
      
      let description = "Unknown segment";
      const fieldData: string[] = [];

      if (segmentName === "MSH") {
        description = "Message Header - Configures details like sender, receiver, date, and validation standard.";
        fieldData.push(`Field separator: ${fields[1]}`);
        fieldData.push(`Sending application: ${fields[2]}`);
        fieldData.push(`Date/time of message: ${fields[6]}`);
        fieldData.push(`Message type: ${fields[8]}`);
        fieldData.push(`HL7 version: ${fields[11]}`);
      } else if (segmentName === "PID") {
        description = "Patient Identification - Core identity markers.";
        fieldData.push(`Patient ID: ${fields[3]}`);
        fieldData.push(`Patient name: ${fields[5]}`);
        fieldData.push(`Date of birth: ${fields[7]}`);
        fieldData.push(`Gender: ${fields[8]}`);
      } else if (segmentName === "OBR") {
        description = "Observation Request - Clinician diagnostics request data.";
        fieldData.push(`Placer order number: ${fields[2]}`);
        fieldData.push(`Universal service identifier: ${fields[4]}`);
        fieldData.push(`Observation date: ${fields[7]}`);
      } else if (segmentName === "OBX") {
        description = "Observation Segment - Specific numerical or text result logs.";
        fieldData.push(`Value type: ${fields[2]}`);
        fieldData.push(`Observation identifier: ${fields[3]}`);
        fieldData.push(`Observation value: ${fields[5]}`);
        fieldData.push(`Units: ${fields[6]}`);
        fieldData.push(`References range: ${fields[7]}`);
        fieldData.push(`Abnormal flags: ${fields[8]}`);
      }

      return { name: segmentName, desc: description, fields: fieldData, raw: line };
    });
    setHl7Output(segments);
  };

  // Pathology Chatbot Logic
  const handleChatSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!chatInput.trim()) return;

    const userMsg = { role: "user", text: chatInput };
    setChatLog((prev) => [...prev, userMsg]);
    setChatInput("");

    setTimeout(() => {
      let reply = "";
      const lower = chatInput.toLowerCase();
      
      if (lower.includes("fixation") || lower.includes("formalin")) {
        reply = "Tissue fixation requires 10% Neutral Buffered Formalin (NBF). Specimen biopsy cassettes must soak for 12-24 hours depending on thickness. Insufficient fixation causes core cell degradation during tissue processing.";
      } else if (lower.includes("microtomy") || lower.includes("cutting") || lower.includes("slice")) {
        reply = "Standard microtomy slicing for paraffin-embedded tissue blocks is calibrated between 3 to 5 microns. Ensure microtome blades are sharp and tissue paraffin blocks are chilled on ice blocks to facilitate ribbon slicing.";
      } else if (lower.includes("stain") || lower.includes("h&e") || lower.includes("eosin")) {
        reply = "H&E (Hematoxylin and Eosin) staining standard protocol: Harris hematoxylin stains nucleic acids deep blue (5-8 mins), followed by acid alcohol differentiation, bluing solution, and Eosin counterstain for cytoplasm pink (2 mins).";
      } else {
        reply = "Protocol log not found. Try querying about 'tissue fixation parameters', 'microtomy blade thickness', or 'H&E staining times'.";
      }

      setChatLog((prev) => [...prev, { role: "assistant", text: reply }]);
    }, 700);
  };

  return (
    <div className="max-w-[1280px] w-full mx-auto px-margin-mobile md:px-margin-desktop py-12 flex flex-col gap-12">
      
      {/* Header */}
      <div>
        <h1 className="font-display text-4xl sm:text-5xl font-bold text-on-surface">Experimental Labs</h1>
        <p className="font-body text-sm sm:text-base text-on-surface-variant mt-2 max-w-xl">
          An interactive laboratory playground hosting diagnostic mockups, automation scripting configurations, and live charts telemetry.
        </p>
      </div>

      {/* Filter controls */}
      <div className="flex flex-col sm:flex-row gap-4 justify-between items-center w-full">
        {/* Search */}
        <div className="flex items-center w-full sm:w-80 bg-surface-container/60 border border-outline-variant/30 rounded-lg px-3.5 py-2 hover:border-primary/45 transition-colors focus-within:bg-surface">
          <Search className="w-4 h-4 text-outline mr-2" />
          <input
            type="text"
            placeholder="Search experiments..."
            className="bg-transparent border-none text-xs font-body focus:ring-0 w-full text-on-surface placeholder:text-outline focus:outline-none"
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
          />
        </div>

        {/* Filter categories */}
        <div className="flex gap-1 overflow-x-auto w-full sm:w-auto py-1 hide-scrollbar">
          {categories.map((cat) => (
            <button
              key={cat}
              onClick={() => setActiveCategory(cat)}
              className={`px-3.5 py-1.5 rounded-md text-[10px] font-mono transition-colors border ${
                activeCategory === cat
                  ? "bg-primary text-on-primary border-primary"
                  : "bg-surface-container text-on-surface-variant border-outline-variant/15 hover:bg-surface-container-high"
              }`}
            >
              {cat}
            </button>
          ))}
        </div>
      </div>

      {/* Labs Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {loading ? (
          Array(3)
            .fill(0)
            .map((_, i) => (
              <div key={i} className="h-56 rounded-xl bg-surface-container animate-pulse border border-outline-variant/25"></div>
            ))
        ) : filteredLabs.length === 0 ? (
          <div className="col-span-full py-16 text-center text-on-surface-variant">
            No experiments found. Try clearing filters.
          </div>
        ) : (
          filteredLabs.map((lab) => {
            const demoId = lab.demo_url.split("/").pop() || "";
            return (
              <article
                key={lab.id}
                className="glass-card rounded-xl p-6 border border-outline-variant/20 flex flex-col justify-between hover:border-primary/20"
              >
                <div>
                  <div className="flex justify-between items-start mb-4">
                    <div className="p-2.5 bg-primary/10 text-primary rounded-lg">
                      {lab.icon === "terminal" && <Terminal className="w-5 h-5" />}
                      {lab.icon === "smart_toy" && <Bot className="w-5 h-5" />}
                      {lab.icon === "query_stats" && <Activity className="w-5 h-5" />}
                    </div>
                    <span className="text-[9px] font-mono font-bold uppercase tracking-wider text-outline px-2 py-0.5 rounded bg-surface-container border border-outline-variant/15">
                      {lab.category}
                    </span>
                  </div>

                  <h3 className="font-display font-bold text-base text-on-surface mb-2">{lab.title}</h3>
                  <p className="font-body text-xs text-on-surface-variant leading-relaxed line-clamp-3 mb-6">
                    {lab.description}
                  </p>
                </div>

                <div className="flex gap-4 items-center">
                  <button
                    onClick={() => setActiveDemoId(demoId)}
                    className="inline-flex items-center gap-1.5 text-xs font-mono font-bold text-primary hover:text-primary-container"
                  >
                    <Play className="w-3.5 h-3.5 fill-primary hover:fill-primary-container" />
                    <span>Launch Sandbox</span>
                  </button>
                  <a
                    href={lab.github_url}
                    target="_blank"
                    rel="noreferrer"
                    className="inline-flex items-center gap-1.5 text-xs font-mono font-bold text-on-surface-variant hover:text-on-surface"
                  >
                    <span>Source</span>
                  </a>
                </div>
              </article>
            );
          })
        )}
      </div>

      {/* Sandbox Overlay Modal */}
      <AnimatePresence>
        {activeDemoId && (
          <div className="fixed inset-0 z-[120] flex items-center justify-center p-4 bg-black/60 backdrop-blur-sm">
            <motion.div
              initial={{ scale: 0.95, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              exit={{ scale: 0.95, opacity: 0 }}
              className="w-full max-w-4xl rounded-2xl border border-outline-variant/30 bg-surface-container-low shadow-2xl overflow-hidden flex flex-col max-h-[85vh]"
            >
              {/* Header */}
              <div className="p-5 border-b border-outline-variant/20 flex justify-between items-center bg-surface-container-high/40">
                <div className="flex items-center gap-3">
                  <div className="w-8 h-8 rounded-lg bg-primary/15 text-primary flex items-center justify-center">
                    <Layers className="w-4.5 h-4.5" />
                  </div>
                  <div>
                    <h3 className="font-display font-bold text-base text-on-surface">
                      {activeDemoId === "hl7-decoder" && "HL7 V2 message Decoder"}
                      {activeDemoId === "pathology-chat" && "AI clinical Pathology Consultant"}
                      {activeDemoId === "telemetry" && "Real-time Telemetry Sensor feeds"}
                    </h3>
                    <p className="text-[10px] font-mono text-outline">SANDBOX SANDBOX ENVIRONMENT</p>
                  </div>
                </div>

                <button
                  onClick={() => {
                    setActiveDemoId(null);
                    setHl7Output([]);
                  }}
                  className="p-1.5 hover:bg-surface-container-high rounded-full text-on-surface-variant transition-colors"
                >
                  <X className="w-5 h-5" />
                </button>
              </div>

              {/* Demo Content */}
              <div className="flex-grow overflow-y-auto p-6 bg-surface/30">
                {/* 1. HL7 Decoder */}
                {activeDemoId === "hl7-decoder" && (
                  <div className="flex flex-col md:flex-row gap-6 h-[480px] items-stretch">
                    {/* Left: Input */}
                    <div className="w-full md:w-1/2 flex flex-col gap-3">
                      <label className="text-xs font-mono font-bold text-outline">HL7 TEXT</label>
                      <textarea
                        className="flex-grow p-4 bg-[#0a0f18] text-green-400 font-mono text-xs border border-outline-variant/30 rounded-lg resize-none outline-none focus:border-primary"
                        value={hl7Input}
                        onChange={(e) => setHl7Input(e.target.value)}
                      />
                      <button
                        onClick={handleDecode}
                        className="bg-primary text-on-primary font-mono text-xs py-3 rounded-lg hover:opacity-95 flex items-center justify-center gap-2"
                      >
                        <RefreshCw className="w-4 h-4" />
                        <span>DECODE HL7 SEGMENTS</span>
                      </button>
                    </div>

                    {/* Right: Output */}
                    <div className="w-full md:w-1/2 flex flex-col gap-3 border-l border-outline-variant/15 pl-0 md:pl-6">
                      <label className="text-xs font-mono font-bold text-outline">DECODED STRUCTURE</label>
                      <div className="flex-grow overflow-y-auto bg-surface-container p-4 rounded-lg flex flex-col gap-4 border border-outline-variant/10 text-xs">
                        {hl7Output.length === 0 ? (
                          <div className="h-full flex items-center justify-center text-on-surface-variant font-body">
                            Click 'Decode' to parse message segments.
                          </div>
                        ) : (
                          hl7Output.map((seg, sIdx) => (
                            <div key={sIdx} className="border-b border-outline-variant/15 pb-3 last:border-0">
                              <div className="flex items-center gap-2">
                                <span className="bg-primary/20 text-primary font-mono font-bold px-1.5 py-0.5 rounded text-[10px]">
                                  {seg.name}
                                </span>
                                <span className="font-display font-semibold text-on-surface">{seg.name} Segment</span>
                              </div>
                              <p className="text-[10px] text-on-surface-variant font-body mt-1 leading-normal">
                                {seg.desc}
                              </p>
                              <div className="flex flex-col gap-1 mt-2.5 pl-3 border-l-2 border-primary/25 font-mono text-[10px] text-on-surface">
                                {seg.fields.map((f: string, fIdx: number) => (
                                  <div key={fIdx}>{f}</div>
                                ))}
                              </div>
                            </div>
                          ))
                        )}
                      </div>
                    </div>
                  </div>
                )}

                {/* 2. Pathology Chat */}
                {activeDemoId === "pathology-chat" && (
                  <div className="flex flex-col h-[480px] rounded-xl border border-outline-variant/20 bg-surface-container overflow-hidden">
                    <div className="flex-grow overflow-y-auto p-4 flex flex-col gap-3 bg-surface/20">
                      {chatLog.map((chat, idx) => (
                        <div
                          key={idx}
                          className={`max-w-[80%] p-3 rounded-lg text-xs leading-relaxed ${
                            chat.role === "assistant"
                              ? "bg-surface-container-high text-on-surface rounded-tl-none self-start"
                              : "bg-primary text-on-primary rounded-tr-none self-end"
                          }`}
                        >
                          {chat.text}
                        </div>
                      ))}
                    </div>
                    <form onSubmit={handleChatSubmit} className="p-3 border-t border-outline-variant/20 bg-surface-container-low flex gap-2">
                      <input
                        type="text"
                        placeholder="Query fixation ratios, cutting thickness, H&E times..."
                        className="w-full bg-surface-container border border-outline-variant/35 rounded-lg py-2 px-4 text-xs font-body focus:outline-none focus:border-primary text-on-surface placeholder:text-outline"
                        value={chatInput}
                        onChange={(e) => setChatInput(e.target.value)}
                      />
                      <button type="submit" className="bg-primary text-on-primary font-mono text-xs px-5 rounded-lg hover:opacity-95">
                        Ask
                      </button>
                    </form>
                  </div>
                )}

                {/* 3. Telemetry feeds */}
                {activeDemoId === "telemetry" && (
                  <div className="flex flex-col gap-6 h-[480px]">
                    <div className="grid grid-cols-2 gap-4">
                      <div className="glass-panel p-4 rounded-xl border border-outline-variant/20 flex flex-col items-center">
                        <span className="text-[10px] font-mono text-outline uppercase">Incubator temperature</span>
                        <span className="text-3xl font-display font-extrabold text-primary mt-1">
                          {telemetryData.length > 0 ? telemetryData[telemetryData.length - 1].temp.toFixed(2) : "0.00"} °C
                        </span>
                      </div>
                      <div className="glass-panel p-4 rounded-xl border border-outline-variant/20 flex flex-col items-center">
                        <span className="text-[10px] font-mono text-outline uppercase">Liquid vacuum pressure</span>
                        <span className="text-3xl font-display font-extrabold text-secondary mt-1">
                          {telemetryData.length > 0 ? telemetryData[telemetryData.length - 1].pressure.toFixed(0) : "0"} hPa
                        </span>
                      </div>
                    </div>

                    <div className="flex-grow w-full bg-[#0a0f18]/40 border border-outline-variant/20 rounded-xl p-4 flex items-center justify-center font-mono text-xs">
                      <ResponsiveContainer width="100%" height="100%">
                        <AreaChart data={telemetryData}>
                          <defs>
                            <linearGradient id="colorTemp" x1="0" y1="0" x2="0" y2="1">
                              <stop offset="5%" stopColor="rgb(var(--color-primary))" stopOpacity={0.2} />
                              <stop offset="95%" stopColor="rgb(var(--color-primary))" stopOpacity={0} />
                            </linearGradient>
                          </defs>
                          <XAxis dataKey="time" stroke="rgba(var(--color-outline-variant) / 0.5)" fontSize={9} />
                          <YAxis domain={[35, 41]} stroke="rgba(var(--color-outline-variant) / 0.5)" fontSize={9} />
                          <Tooltip contentStyle={{ background: "#111b27", border: "1px solid rgba(255,255,255,0.1)", fontSize: 10 }} />
                          <Area type="monotone" dataKey="temp" stroke="rgb(var(--color-primary))" fillOpacity={1} fill="url(#colorTemp)" />
                        </AreaChart>
                      </ResponsiveContainer>
                    </div>
                  </div>
                )}
              </div>

            </motion.div>
          </div>
        )}
      </AnimatePresence>

    </div>
  );
};
export default Labs;
