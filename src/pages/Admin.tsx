import React, { useEffect, useState } from "react";
import { supabase } from "../supabase/client";
import { Lock, Shield, Plus, Trash2, Edit2, LogOut, Check, FolderKanban, FileText, FlaskConical, AlertCircle } from "lucide-react";

export const Admin: React.FC = () => {
  const [session, setSession] = useState<any>(null);
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [authError, setAuthError] = useState("");
  const [authLoading, setAuthLoading] = useState(false);
  const [activeTab, setActiveTab] = useState<"projects" | "blogs" | "labs">("projects");

  // Data lists
  const [projects, setProjects] = useState<any[]>([]);
  const [blogs, setBlogs] = useState<any[]>([]);
  const [labs, setLabs] = useState<any[]>([]);

  // Project Form States
  const [pTitle, setPTitle] = useState("");
  const [pSlug, setPSlug] = useState("");
  const [pDesc, setPDesc] = useState("");
  const [pContent, setPContent] = useState("");
  const [pTech, setPTech] = useState("");
  const [pCat, setPCat] = useState("Healthcare");
  const [pFeatured, setPFeatured] = useState(false);

  // Blog Form States
  const [bTitle, setBTitle] = useState("");
  const [bSlug, setBSlug] = useState("");
  const [bExcerpt, setBExcerpt] = useState("");
  const [bContent, setBContent] = useState("");
  const [bTime, setBTime] = useState(5);
  const [bCat, setBCat] = useState("Healthcare");
  const [bTags, setBTags] = useState("");

  // Labs Form States
  const [lTitle, setLTitle] = useState("");
  const [lDesc, setLDesc] = useState("");
  const [lCat, setLCat] = useState("Automation");
  const [lDemo, setLDemo] = useState("");
  const [lGit, setLGit] = useState("");
  const [lIcon, setLIcon] = useState("terminal");

  const [formSuccess, setFormSuccess] = useState("");
  const [formError, setFormError] = useState("");

  useEffect(() => {
    supabase.auth.getSession().then(({ data: { session } }) => {
      setSession(session);
    });

    const { data: { subscription } } = supabase.auth.onAuthStateChange((_event, session) => {
      setSession(session);
    });

    return () => subscription.unsubscribe();
  }, []);

  useEffect(() => {
    if (session) {
      fetchAdminData();
    }
  }, [session, activeTab]);

  const fetchAdminData = async () => {
    try {
      if (activeTab === "projects") {
        const { data } = await supabase.from("projects").select("*").order("created_at", { ascending: false });
        if (data) setProjects(data);
      } else if (activeTab === "blogs") {
        const { data } = await supabase.from("blog_posts").select("*").order("published_at", { ascending: false });
        if (data) setBlogs(data);
      } else if (activeTab === "labs") {
        const { data } = await supabase.from("labs").select("*").order("created_at", { ascending: false });
        if (data) setLabs(data);
      }
    } catch (err) {
      console.error("Error loading admin lists:", err);
    }
  };

  const handleLogin = async (e: React.FormEvent) => {
    e.preventDefault();
    setAuthLoading(true);
    setAuthError("");
    try {
      const { error } = await supabase.auth.signInWithPassword({ email, password });
      if (error) setAuthError(error.message);
    } catch (err: any) {
      setAuthError(err.message || "Authentication failed.");
    } finally {
      setAuthLoading(false);
    }
  };

  const handleLogout = async () => {
    await supabase.auth.signOut();
    setSession(null);
  };

  // Submit Project
  const handleAddProject = async (e: React.FormEvent) => {
    e.preventDefault();
    setFormSuccess("");
    setFormError("");
    try {
      const techArray = pTech.split(",").map((t) => t.trim()).filter(Boolean);
      const { error } = await supabase.from("projects").insert({
        title: pTitle,
        slug: pSlug,
        description: pDesc,
        content: pContent,
        technologies: techArray,
        category: pCat,
        featured: pFeatured,
        status: "Completed",
      });

      if (error) throw error;
      setFormSuccess("Project added successfully!");
      setPTitle("");
      setPSlug("");
      setPDesc("");
      setPContent("");
      setPTech("");
      fetchAdminData();
    } catch (err: any) {
      setFormError(err.message || "Failed to add project.");
    }
  };

  // Submit Blog
  const handleAddBlog = async (e: React.FormEvent) => {
    e.preventDefault();
    setFormSuccess("");
    setFormError("");
    try {
      const tagsArray = bTags.split(",").map((t) => t.trim()).filter(Boolean);
      const { error } = await supabase.from("blog_posts").insert({
        title: bTitle,
        slug: bSlug,
        excerpt: bExcerpt,
        content: bContent,
        reading_time: Number(bTime),
        category: bCat,
        tags: tagsArray,
      });

      if (error) throw error;
      setFormSuccess("Blog post published successfully!");
      setBTitle("");
      setBSlug("");
      setBExcerpt("");
      setBContent("");
      setBTags("");
      fetchAdminData();
    } catch (err: any) {
      setFormError(err.message || "Failed to publish blog post.");
    }
  };

  // Submit Labs
  const handleAddLab = async (e: React.FormEvent) => {
    e.preventDefault();
    setFormSuccess("");
    setFormError("");
    try {
      const { error } = await supabase.from("labs").insert({
        title: lTitle,
        description: lDesc,
        category: lCat,
        demo_url: lDemo,
        github_url: lGit,
        icon: lIcon,
      });

      if (error) throw error;
      setFormSuccess("Labs entry added successfully!");
      setLTitle("");
      setLDesc("");
      setLDemo("");
      setLGit("");
      fetchAdminData();
    } catch (err: any) {
      setFormError(err.message || "Failed to add labs entry.");
    }
  };

  // Delete handler
  const handleDeleteItem = async (table: string, id: string) => {
    if (!window.confirm("Are you sure you want to delete this entry?")) return;
    try {
      const { error } = await supabase.from(table).delete().eq("id", id);
      if (error) throw error;
      fetchAdminData();
    } catch (err: any) {
      alert(`Delete failed: ${err.message}`);
    }
  };

  // Render Login state
  if (!session) {
    return (
      <div className="max-w-[420px] w-full mx-auto px-margin-mobile py-24 flex flex-col justify-center">
        <div className="glass-panel p-8 rounded-2xl border border-outline-variant/25 shadow-lg flex flex-col gap-6 items-center">
          <div className="w-12 h-12 rounded-full bg-primary/10 text-primary flex items-center justify-center shadow-inner">
            <Lock className="w-6 h-6" />
          </div>
          
          <div className="text-center">
            <h2 className="font-display font-bold text-lg text-on-surface">Admin Dashboard Sign-In</h2>
            <p className="font-body text-xs text-on-surface-variant mt-1.5 leading-normal">
              Enter your Supabase credentials to access edit and CRUD tools.
            </p>
          </div>

          <form onSubmit={handleLogin} className="w-full flex flex-col gap-4">
            <div className="flex flex-col gap-1.5 text-left">
              <label className="font-mono text-[10px] text-outline uppercase font-bold">Email address</label>
              <input
                type="email"
                required
                className="w-full bg-surface-container border border-outline-variant/35 rounded-lg py-2.5 px-3.5 text-xs focus:outline-none focus:border-primary text-on-surface"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
              />
            </div>

            <div className="flex flex-col gap-1.5 text-left">
              <label className="font-mono text-[10px] text-outline uppercase font-bold">Password</label>
              <input
                type="password"
                required
                className="w-full bg-surface-container border border-outline-variant/35 rounded-lg py-2.5 px-3.5 text-xs focus:outline-none focus:border-primary text-on-surface"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
              />
            </div>

            {authError && (
              <div className="p-3 bg-error/15 text-error rounded-lg text-xs font-body flex items-center gap-2">
                <AlertCircle className="w-4 h-4 shrink-0" />
                <span>{authError}</span>
              </div>
            )}

            <button
              type="submit"
              disabled={authLoading}
              className="bg-primary text-on-primary font-mono text-xs py-3.5 rounded-lg hover:opacity-95 disabled:opacity-50 mt-2 flex items-center justify-center gap-2"
            >
              <span>ACCESS DASHBOARD</span>
              <Shield className="w-3.5 h-3.5" />
            </button>
          </form>
        </div>
      </div>
    );
  }

  return (
    <div className="max-w-[1280px] w-full mx-auto px-margin-mobile md:px-margin-desktop py-12 flex flex-col gap-8">
      {/* Header bar */}
      <div className="flex justify-between items-center bg-surface-container border border-outline-variant/30 p-5 rounded-xl">
        <div className="flex items-center gap-3">
          <div className="w-8 h-8 rounded-full bg-primary/10 text-primary flex items-center justify-center">
            <Shield className="w-4.5 h-4.5" />
          </div>
          <div>
            <h2 className="font-display font-bold text-base text-on-surface">Systems Console</h2>
            <span className="text-[10px] font-mono text-outline">Logged in as {session.user?.email}</span>
          </div>
        </div>

        <button
          onClick={handleLogout}
          className="flex items-center gap-1 px-4 py-2 border border-error/20 hover:bg-error/5 text-error font-mono text-xs rounded-lg transition-colors"
        >
          <LogOut className="w-3.5 h-3.5" />
          <span>Exit Console</span>
        </button>
      </div>

      {/* Tabs */}
      <div className="flex gap-2 border-b border-outline-variant/20 pb-1.5 font-mono text-xs">
        <button
          onClick={() => {
            setActiveTab("projects");
            setFormSuccess("");
            setFormError("");
          }}
          className={`flex items-center gap-2 px-4 py-2 rounded-lg ${
            activeTab === "projects" ? "bg-primary/10 text-primary font-bold" : "text-on-surface-variant hover:text-on-surface"
          }`}
        >
          <FolderKanban className="w-4 h-4" />
          <span>Projects CMS</span>
        </button>

        <button
          onClick={() => {
            setActiveTab("blogs");
            setFormSuccess("");
            setFormError("");
          }}
          className={`flex items-center gap-2 px-4 py-2 rounded-lg ${
            activeTab === "blogs" ? "bg-primary/10 text-primary font-bold" : "text-on-surface-variant hover:text-on-surface"
          }`}
        >
          <FileText className="w-4 h-4" />
          <span>Blogs</span>
        </button>

        <button
          onClick={() => {
            setActiveTab("labs");
            setFormSuccess("");
            setFormError("");
          }}
          className={`flex items-center gap-2 px-4 py-2 rounded-lg ${
            activeTab === "labs" ? "bg-primary/10 text-primary font-bold" : "text-on-surface-variant hover:text-on-surface"
          }`}
        >
          <FlaskConical className="w-4 h-4" />
          <span>Labs Hub</span>
        </button>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-start">
        
        {/* Left Column: Create Form */}
        <div className="lg:col-span-6 glass-panel p-6 sm:p-8 rounded-xl border border-outline-variant/20 shadow-md">
          <h3 className="font-display font-bold text-base text-on-surface mb-6 uppercase tracking-wider flex items-center gap-2">
            <Plus className="w-4.5 h-4.5 text-primary" />
            Add New {activeTab === "projects" ? "Project" : activeTab === "blogs" ? "Blog Post" : "Labs Entry"}
          </h3>

          {formSuccess && (
            <div className="mb-4 p-3 bg-tertiary/10 border border-tertiary/20 text-tertiary rounded-lg text-xs font-body flex items-center gap-2">
              <Check className="w-4 h-4" />
              <span>{formSuccess}</span>
            </div>
          )}

          {formError && (
            <div className="mb-4 p-3 bg-error/10 border border-error/20 text-error rounded-lg text-xs font-body flex items-center gap-2">
              <AlertCircle className="w-4 h-4" />
              <span>{formError}</span>
            </div>
          )}

          {activeTab === "projects" && (
            <form onSubmit={handleAddProject} className="flex flex-col gap-4">
              <div className="grid grid-cols-2 gap-4">
                <div className="flex flex-col gap-1.5">
                  <label className="font-mono text-[10px] text-outline uppercase">Title</label>
                  <input
                    type="text"
                    required
                    className="w-full bg-surface-container-low border border-outline-variant/30 rounded-lg py-2 px-3 text-xs text-on-surface"
                    value={pTitle}
                    onChange={(e) => setPTitle(e.target.value)}
                  />
                </div>
                <div className="flex flex-col gap-1.5">
                  <label className="font-mono text-[10px] text-outline uppercase">Slug</label>
                  <input
                    type="text"
                    required
                    className="w-full bg-surface-container-low border border-outline-variant/30 rounded-lg py-2 px-3 text-xs text-on-surface"
                    value={pSlug}
                    onChange={(e) => setPSlug(e.target.value)}
                  />
                </div>
              </div>

              <div className="flex flex-col gap-1.5">
                <label className="font-mono text-[10px] text-outline uppercase">Description</label>
                <input
                  type="text"
                  required
                  className="w-full bg-surface-container-low border border-outline-variant/30 rounded-lg py-2 px-3 text-xs text-on-surface"
                  value={pDesc}
                  onChange={(e) => setPDesc(e.target.value)}
                />
              </div>

              <div className="flex flex-col gap-1.5">
                <label className="font-mono text-[10px] text-outline uppercase">Technologies (comma separated)</label>
                <input
                  type="text"
                  placeholder="React, TypeScript, Go"
                  required
                  className="w-full bg-surface-container-low border border-outline-variant/30 rounded-lg py-2 px-3 text-xs text-on-surface"
                  value={pTech}
                  onChange={(e) => setPTech(e.target.value)}
                />
              </div>

              <div className="grid grid-cols-2 gap-4">
                <div className="flex flex-col gap-1.5">
                  <label className="font-mono text-[10px] text-outline uppercase">Category</label>
                  <select
                    className="w-full bg-surface-container-low border border-outline-variant/30 rounded-lg py-2 px-3 text-xs text-on-surface"
                    value={pCat}
                    onChange={(e) => setPCat(e.target.value)}
                  >
                    <option value="Healthcare">Healthcare</option>
                    <option value="Automation">Automation</option>
                    <option value="AI">AI</option>
                    <option value="Data Analytics">Data Analytics</option>
                    <option value="Business Systems">Business Systems</option>
                    <option value="Web Applications">Web Applications</option>
                    <option value="Internal Tools">Internal Tools</option>
                  </select>
                </div>
                <div className="flex items-center gap-2 mt-6">
                  <input
                    type="checkbox"
                    id="featured"
                    checked={pFeatured}
                    onChange={(e) => setPFeatured(e.target.checked)}
                    className="rounded text-primary focus:ring-primary h-4 w-4 bg-surface-container-low border-outline-variant/30"
                  />
                  <label htmlFor="featured" className="font-mono text-[10px] text-on-surface-variant uppercase cursor-pointer">
                    Featured Project
                  </label>
                </div>
              </div>

              <div className="flex flex-col gap-1.5">
                <label className="font-mono text-[10px] text-outline uppercase">Content (Markdown)</label>
                <textarea
                  rows={6}
                  required
                  className="w-full bg-surface-container-low border border-outline-variant/30 rounded-lg py-2 px-3 text-xs text-on-surface font-mono resize-none"
                  value={pContent}
                  onChange={(e) => setPContent(e.target.value)}
                />
              </div>

              <button type="submit" className="bg-primary text-on-primary font-mono text-xs py-3 rounded-lg hover:opacity-95 mt-2">
                PUBLISH PROJECT
              </button>
            </form>
          )}

          {activeTab === "blogs" && (
            <form onSubmit={handleAddBlog} className="flex flex-col gap-4">
              <div className="grid grid-cols-2 gap-4">
                <div className="flex flex-col gap-1.5">
                  <label className="font-mono text-[10px] text-outline uppercase">Title</label>
                  <input
                    type="text"
                    required
                    className="w-full bg-surface-container-low border border-outline-variant/30 rounded-lg py-2 px-3 text-xs text-on-surface"
                    value={bTitle}
                    onChange={(e) => setBTitle(e.target.value)}
                  />
                </div>
                <div className="flex flex-col gap-1.5">
                  <label className="font-mono text-[10px] text-outline uppercase">Slug</label>
                  <input
                    type="text"
                    required
                    className="w-full bg-surface-container-low border border-outline-variant/30 rounded-lg py-2 px-3 text-xs text-on-surface"
                    value={bSlug}
                    onChange={(e) => setBSlug(e.target.value)}
                  />
                </div>
              </div>

              <div className="flex flex-col gap-1.5">
                <label className="font-mono text-[10px] text-outline uppercase">Excerpt</label>
                <input
                  type="text"
                  required
                  className="w-full bg-surface-container-low border border-outline-variant/30 rounded-lg py-2 px-3 text-xs text-on-surface"
                  value={bExcerpt}
                  onChange={(e) => setBExcerpt(e.target.value)}
                />
              </div>

              <div className="grid grid-cols-3 gap-4">
                <div className="flex flex-col gap-1.5 col-span-1">
                  <label className="font-mono text-[10px] text-outline uppercase">Read Time (min)</label>
                  <input
                    type="number"
                    required
                    className="w-full bg-surface-container-low border border-outline-variant/30 rounded-lg py-2 px-3 text-xs text-on-surface"
                    value={bTime}
                    onChange={(e) => setBTime(Number(e.target.value))}
                  />
                </div>
                <div className="flex flex-col gap-1.5 col-span-2">
                  <label className="font-mono text-[10px] text-outline uppercase">Category</label>
                  <select
                    className="w-full bg-surface-container-low border border-outline-variant/30 rounded-lg py-2 px-3 text-xs text-on-surface"
                    value={bCat}
                    onChange={(e) => setBCat(e.target.value)}
                  >
                    <option value="Healthcare">Healthcare</option>
                    <option value="Systems Engineering">Systems Engineering</option>
                    <option value="Business Systems">Business Systems</option>
                    <option value="Automation">Automation</option>
                  </select>
                </div>
              </div>

              <div className="flex flex-col gap-1.5">
                <label className="font-mono text-[10px] text-outline uppercase">Tags (comma separated)</label>
                <input
                  type="text"
                  placeholder="Rust, Architecture, DB"
                  required
                  className="w-full bg-surface-container-low border border-outline-variant/30 rounded-lg py-2 px-3 text-xs text-on-surface"
                  value={bTags}
                  onChange={(e) => setBTags(e.target.value)}
                />
              </div>

              <div className="flex flex-col gap-1.5">
                <label className="font-mono text-[10px] text-outline uppercase">Content (Markdown)</label>
                <textarea
                  rows={6}
                  required
                  className="w-full bg-surface-container-low border border-outline-variant/30 rounded-lg py-2 px-3 text-xs text-on-surface font-mono resize-none"
                  value={bContent}
                  onChange={(e) => setBContent(e.target.value)}
                />
              </div>

              <button type="submit" className="bg-primary text-on-primary font-mono text-xs py-3 rounded-lg hover:opacity-95 mt-2">
                PUBLISH BLOG
              </button>
            </form>
          )}

          {activeTab === "labs" && (
            <form onSubmit={handleAddLab} className="flex flex-col gap-4">
              <div className="flex flex-col gap-1.5">
                <label className="font-mono text-[10px] text-outline uppercase">Title</label>
                <input
                  type="text"
                  required
                  className="w-full bg-surface-container-low border border-outline-variant/30 rounded-lg py-2 px-3 text-xs text-on-surface"
                  value={lTitle}
                  onChange={(e) => setLTitle(e.target.value)}
                />
              </div>

              <div className="flex flex-col gap-1.5">
                <label className="font-mono text-[10px] text-outline uppercase">Description</label>
                <textarea
                  rows={3}
                  required
                  className="w-full bg-surface-container-low border border-outline-variant/30 rounded-lg py-2 px-3 text-xs text-on-surface resize-none"
                  value={lDesc}
                  onChange={(e) => setLDesc(e.target.value)}
                />
              </div>

              <div className="grid grid-cols-2 gap-4">
                <div className="flex flex-col gap-1.5">
                  <label className="font-mono text-[10px] text-outline uppercase">Category</label>
                  <select
                    className="w-full bg-surface-container-low border border-outline-variant/30 rounded-lg py-2 px-3 text-xs text-on-surface"
                    value={lCat}
                    onChange={(e) => setLCat(e.target.value)}
                  >
                    <option value="AI">AI</option>
                    <option value="Automation">Automation</option>
                    <option value="Visuals">Visuals</option>
                    <option value="UI">UI</option>
                  </select>
                </div>
                <div className="flex flex-col gap-1.5">
                  <label className="font-mono text-[10px] text-outline uppercase">Icon Identifier</label>
                  <select
                    className="w-full bg-surface-container-low border border-outline-variant/30 rounded-lg py-2 px-3 text-xs text-on-surface"
                    value={lIcon}
                    onChange={(e) => setLIcon(e.target.value)}
                  >
                    <option value="terminal">terminal</option>
                    <option value="smart_toy">smart_toy</option>
                    <option value="query_stats">query_stats</option>
                  </select>
                </div>
              </div>

              <div className="grid grid-cols-2 gap-4">
                <div className="flex flex-col gap-1.5">
                  <label className="font-mono text-[10px] text-outline uppercase">Demo Local Hash Path</label>
                  <input
                    type="text"
                    placeholder="#/labs/my-demo"
                    required
                    className="w-full bg-surface-container-low border border-outline-variant/30 rounded-lg py-2 px-3 text-xs text-on-surface"
                    value={lDemo}
                    onChange={(e) => setLDemo(e.target.value)}
                  />
                </div>
                <div className="flex flex-col gap-1.5">
                  <label className="font-mono text-[10px] text-outline uppercase">Github Source URL</label>
                  <input
                    type="url"
                    required
                    className="w-full bg-surface-container-low border border-outline-variant/30 rounded-lg py-2 px-3 text-xs text-on-surface"
                    value={lGit}
                    onChange={(e) => setLGit(e.target.value)}
                  />
                </div>
              </div>

              <button type="submit" className="bg-primary text-on-primary font-mono text-xs py-3 rounded-lg hover:opacity-95 mt-2">
                ADD LAB ENTRY
              </button>
            </form>
          )}

        </div>

        {/* Right Column: Existing List */}
        <div className="lg:col-span-6 flex flex-col gap-4">
          <h3 className="font-display font-bold text-base text-on-surface uppercase tracking-wider mb-2">
            Active Database Logs
          </h3>

          <div className="flex flex-col gap-3 max-h-[580px] overflow-y-auto pr-1 hide-scrollbar">
            {activeTab === "projects" &&
              projects.map((p) => (
                <div key={p.id} className="glass-panel p-4 rounded-xl border border-outline-variant/20 flex items-center justify-between gap-4">
                  <div className="text-left">
                    <span className="font-display font-semibold text-xs text-on-surface block leading-tight">{p.title}</span>
                    <span className="text-[10px] font-mono text-outline block mt-1">Slug: {p.slug}</span>
                  </div>
                  <button
                    onClick={() => handleDeleteItem("projects", p.id)}
                    className="p-2 bg-error/10 hover:bg-error/25 text-error rounded-lg transition-colors shrink-0"
                  >
                    <Trash2 className="w-3.5 h-3.5" />
                  </button>
                </div>
              ))}

            {activeTab === "blogs" &&
              blogs.map((b) => (
                <div key={b.id} className="glass-panel p-4 rounded-xl border border-outline-variant/20 flex items-center justify-between gap-4">
                  <div className="text-left">
                    <span className="font-display font-semibold text-xs text-on-surface block leading-tight">{b.title}</span>
                    <span className="text-[10px] font-mono text-outline block mt-1">Slug: {b.slug}</span>
                  </div>
                  <button
                    onClick={() => handleDeleteItem("blog_posts", b.id)}
                    className="p-2 bg-error/10 hover:bg-error/25 text-error rounded-lg transition-colors shrink-0"
                  >
                    <Trash2 className="w-3.5 h-3.5" />
                  </button>
                </div>
              ))}

            {activeTab === "labs" &&
              labs.map((l) => (
                <div key={l.id} className="glass-panel p-4 rounded-xl border border-outline-variant/20 flex items-center justify-between gap-4">
                  <div className="text-left">
                    <span className="font-display font-semibold text-xs text-on-surface block leading-tight">{l.title}</span>
                    <span className="text-[10px] font-mono text-outline block mt-1">Category: {l.category}</span>
                  </div>
                  <button
                    onClick={() => handleDeleteItem("labs", l.id)}
                    className="p-2 bg-error/10 hover:bg-error/25 text-error rounded-lg transition-colors shrink-0"
                  >
                    <Trash2 className="w-3.5 h-3.5" />
                  </button>
                </div>
              ))}
          </div>
        </div>

      </div>

    </div>
  );
};
export default Admin;
