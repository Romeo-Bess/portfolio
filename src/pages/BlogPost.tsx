import React, { useEffect, useState } from "react";
import { useParams, Link, useNavigate } from "react-router-dom";
import { supabase } from "../supabase/client";
import { ArrowLeft, Calendar, Clock, Share2, Link as LinkIcon } from "lucide-react";
import { LinkedinIcon } from "../components/Icons";

interface BlogPostData {
  id: string;
  title: string;
  slug: string;
  excerpt: string;
  content: string;
  published_at: string;
  reading_time: number;
  category: string;
  tags: string[];
}

interface TocItem {
  text: string;
  id: string;
  level: number;
}


export const BlogPost: React.FC = () => {
  const { slug } = useParams<{ slug: string }>();
  const [post, setPost] = useState<BlogPostData | null>(null);
  const [loading, setLoading] = useState(true);
  const [toc, setToc] = useState<TocItem[]>([]);
  const navigate = useNavigate();

  useEffect(() => {
    const fetchPost = async () => {
      setLoading(true);
      try {
        const { data, error } = await supabase
          .from("blog_posts")
          .select("*")
          .eq("slug", slug)
          .single();

        if (error || !data) {
          console.error("Post not found:", error);
          setPost(null);
        } else {
          setPost(data);
          generateToc(data.content);
        }
      } catch (err) {
        console.error("Error loading blog post:", err);
      } finally {
        setLoading(false);
      }
    };
    fetchPost();
  }, [slug]);

  // Generate Table of Contents from headers
  const generateToc = (content: string) => {
    if (!content) return;
    const lines = content.split("\n");
    const items: TocItem[] = [];

    lines.forEach((line) => {
      if (line.startsWith("## ") || line.startsWith("### ")) {
        const level = line.startsWith("## ") ? 2 : 3;
        const text = line.replace(/^#{2,3}\s+/, "").trim();
        const id = text.toLowerCase().replace(/[^a-z0-9]+/g, "-").replace(/(^-|-$)/g, "");
        items.push({ text, id, level });
      }
    });
    setToc(items);
  };

  const handleCopyLink = () => {
    navigator.clipboard.writeText(window.location.href);
    alert("Article link copied to clipboard!");
  };

  const renderMarkdown = (text: string) => {
    if (!text) return null;
    const lines = text.split("\n");
    let inList = false;
    let listItems: string[] = [];
    const elements: React.ReactNode[] = [];

    const flushList = (key: number) => {
      if (listItems.length > 0) {
        elements.push(
          <ul key={`list-${key}`} className="list-disc pl-6 space-y-2 my-3 text-sm sm:text-base text-on-surface-variant font-body">
            {listItems.map((item, idx) => (
              <li key={idx}>{item}</li>
            ))}
          </ul>
        );
        listItems = [];
      }
    };

    let lineIdx = 0;
    while (lineIdx < lines.length) {
      const line = lines[lineIdx];

      // Code Block
      if (line.startsWith("```")) {
        flushList(lineIdx);
        const codeLines: string[] = [];
        const lang = line.slice(3).trim();
        lineIdx++;
        while (lineIdx < lines.length && !lines[lineIdx].startsWith("```")) {
          codeLines.push(lines[lineIdx]);
          lineIdx++;
        }
        elements.push(
          <div key={`code-${lineIdx}`} className="my-6 rounded-lg overflow-hidden border border-outline-variant/35 bg-[#0b0f19] text-[12px] leading-relaxed font-mono p-4 text-slate-200">
            {lang && <div className="text-[10px] uppercase text-outline mb-2 select-none">{lang}</div>}
            <pre className="overflow-x-auto">{codeLines.join("\n")}</pre>
          </div>
        );
        lineIdx++;
        continue;
      }

      // Headers with dynamic IDs for Table of Contents anchors
      if (line.startsWith("# ")) {
        flushList(lineIdx);
        const headingText = line.slice(2).trim();
        const id = headingText.toLowerCase().replace(/[^a-z0-9]+/g, "-").replace(/(^-|-$)/g, "");
        elements.push(
          <h1 key={lineIdx} id={id} className="font-display text-2xl sm:text-3xl font-extrabold text-on-surface mt-8 mb-4 border-b border-outline-variant/20 pb-2 scroll-mt-24">
            {headingText}
          </h1>
        );
      } else if (line.startsWith("## ")) {
        flushList(lineIdx);
        const headingText = line.slice(3).trim();
        const id = headingText.toLowerCase().replace(/[^a-z0-9]+/g, "-").replace(/(^-|-$)/g, "");
        elements.push(
          <h2 key={lineIdx} id={id} className="font-display text-xl sm:text-2xl font-bold text-on-surface mt-6 mb-3 scroll-mt-24">
            {headingText}
          </h2>
        );
      } else if (line.startsWith("### ")) {
        flushList(lineIdx);
        const headingText = line.slice(4).trim();
        const id = headingText.toLowerCase().replace(/[^a-z0-9]+/g, "-").replace(/(^-|-$)/g, "");
        elements.push(
          <h3 key={lineIdx} id={id} className="font-display text-base sm:text-lg font-semibold text-on-surface mt-4 mb-2 scroll-mt-24">
            {headingText}
          </h3>
        );
      }
      // Table
      else if (line.startsWith("|")) {
        flushList(lineIdx);
        const rows: string[][] = [];
        while (lineIdx < lines.length && lines[lineIdx].startsWith("|")) {
          // ignore dividing line
          if (!lines[lineIdx].includes("---")) {
            const cells = lines[lineIdx].split("|").map(c => c.trim()).filter((_, i, arr) => i > 0 && i < arr.length - 1);
            rows.push(cells);
          }
          lineIdx++;
        }
        elements.push(
          <div key={`table-${lineIdx}`} className="my-6 overflow-x-auto rounded-lg border border-outline-variant/25">
            <table className="w-full text-xs sm:text-sm font-body text-left border-collapse">
              <thead>
                <tr className="bg-surface-container border-b border-outline-variant/30 text-on-surface font-semibold font-display">
                  {rows[0]?.map((cell, cIdx) => (
                    <th key={cIdx} className="px-4 py-3">{cell}</th>
                  ))}
                </tr>
              </thead>
              <tbody>
                {rows.slice(1).map((row, rIdx) => (
                  <tr key={rIdx} className="border-b border-outline-variant/10 hover:bg-surface-container-low/40 last:border-none">
                    {row.map((cell, cIdx) => (
                      <td key={cIdx} className="px-4 py-3 text-on-surface-variant font-mono">{cell}</td>
                    ))}
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        );
        continue;
      }
      // Bullet lists
      else if (line.startsWith("- ") || line.startsWith("* ")) {
        inList = true;
        listItems.push(line.slice(2));
      }
      // Blank lines
      else if (line.trim() === "") {
        flushList(lineIdx);
        inList = false;
      }
      // Plain text paragraphs
      else {
        flushList(lineIdx);
        inList = false;
        let content: React.ReactNode = line;
        if (line.includes("**")) {
          const parts = line.split("**");
          content = parts.map((part, pIdx) => pIdx % 2 === 1 ? <strong key={pIdx} className="font-bold text-on-surface">{part}</strong> : part);
        }
        elements.push(
          <p key={lineIdx} className="font-body text-sm sm:text-base text-on-surface-variant leading-relaxed my-3">
            {content}
          </p>
        );
      }

      lineIdx++;
    }
    flushList(lineIdx);
    return elements;
  };

  if (loading) {
    return (
      <div className="max-w-[800px] w-full mx-auto px-margin-mobile py-24 flex flex-col gap-6">
        <div className="h-6 w-1/4 bg-surface-container animate-pulse rounded"></div>
        <div className="h-12 w-3/4 bg-surface-container animate-pulse rounded"></div>
        <div className="h-64 w-full bg-surface-container animate-pulse rounded"></div>
        <div className="h-4 w-full bg-surface-container animate-pulse rounded"></div>
        <div className="h-4 w-full bg-surface-container animate-pulse rounded"></div>
      </div>
    );
  }

  if (!post) {
    return (
      <div className="max-w-[600px] w-full mx-auto px-margin-mobile py-24 text-center flex flex-col items-center gap-4">
        <h2 className="font-display text-2xl font-bold text-on-surface">Article Not Found</h2>
        <p className="font-body text-sm text-on-surface-variant">
          The requested article could not be loaded from our database.
        </p>
        <button
          onClick={() => navigate("/blog")}
          className="bg-primary text-on-primary font-mono text-xs py-2.5 px-6 rounded-lg animate-float-1"
        >
          Back to Blog
        </button>
      </div>
    );
  }

  return (
    <div className="max-w-[1200px] w-full mx-auto px-margin-mobile md:px-margin-desktop py-12 grid grid-cols-1 lg:grid-cols-12 gap-12 items-start">
      
      {/* Left Sidebar: Nav & Metadata */}
      <aside className="lg:col-span-3 flex flex-col gap-6 border-b lg:border-b-0 lg:border-r border-outline-variant/15 pb-6 lg:pb-0 lg:pr-6 lg:sticky lg:top-24">
        <Link
          to="/blog"
          className="inline-flex items-center gap-2 text-xs font-mono text-outline hover:text-primary transition-colors"
        >
          <ArrowLeft className="w-3.5 h-3.5" />
          <span>Back to Blog</span>
        </Link>
        
        <div className="flex flex-col gap-3 font-mono text-xs text-on-surface-variant border-t border-outline-variant/15 pt-6 mt-2">
          <div className="flex items-center gap-2">
            <Calendar className="w-4 h-4 text-outline" />
            <span>{new Date(post.published_at).toLocaleDateString(undefined, { year: "numeric", month: "long", day: "numeric" })}</span>
          </div>
          <div className="flex items-center gap-2 mt-1">
            <Clock className="w-4 h-4 text-outline" />
            <span>{post.reading_time} Min Read</span>
          </div>
        </div>

        <div className="flex flex-col gap-2">
          <span className="text-[10px] font-mono font-bold uppercase text-outline">Category</span>
          <span className="text-xs font-display font-semibold text-secondary">{post.category}</span>
        </div>

        <div className="flex flex-col gap-2.5">
          <span className="text-[10px] font-mono font-bold uppercase text-outline">Tags</span>
          <div className="flex flex-wrap gap-1">
            {post.tags.map((tag) => (
              <span key={tag} className="px-2 py-0.5 rounded bg-surface-container text-[10px] font-mono text-on-surface-variant">
                #{tag}
              </span>
            ))}
          </div>
        </div>

        {/* Social Share */}
        <div className="flex flex-col gap-3 border-t border-outline-variant/15 pt-6">
          <span className="text-[10px] font-mono font-bold uppercase text-outline">Share Article</span>
          <div className="flex gap-2">
            <button
              onClick={handleCopyLink}
              className="p-2 bg-surface-container hover:bg-surface-container-high rounded-full border border-outline-variant/20 text-on-surface transition-colors"
              title="Copy Link"
            >
              <LinkIcon className="w-4 h-4" />
            </button>
            <a
              href={`https://www.linkedin.com/sharing/share-offsite/?url=${encodeURIComponent(window.location.href)}`}
              target="_blank"
              rel="noreferrer"
              className="p-2 bg-surface-container hover:bg-surface-container-high rounded-full border border-outline-variant/20 text-on-surface transition-colors flex items-center justify-center"
              title="Share on LinkedIn"
            >
              <LinkedinIcon className="w-4 h-4" />
            </a>
          </div>
        </div>
      </aside>

      {/* Center Main Column: Article Content */}
      <article className="lg:col-span-6 flex flex-col gap-6">
        <header className="flex flex-col gap-2">
          <h1 className="font-display text-3xl sm:text-4xl font-extrabold text-on-surface leading-tight">
            {post.title}
          </h1>
          <p className="font-body text-base text-on-surface-variant italic leading-relaxed mt-2 border-l-4 border-primary/30 pl-4 bg-primary/5 py-2.5 rounded-r">
            {post.excerpt}
          </p>
        </header>

        <section className="flex flex-col gap-1.5 mt-4">
          {renderMarkdown(post.content)}
        </section>
      </article>

      {/* Right Sidebar: Table of Contents */}
      <aside className="lg:col-span-3 hidden lg:block sticky top-24 border-l border-outline-variant/15 pl-6">
        <h4 className="font-display font-semibold text-xs uppercase text-on-surface tracking-wider mb-4 flex items-center gap-2">
          <Share2 className="w-3.5 h-3.5 text-primary" />
          Table of Contents
        </h4>
        
        {toc.length === 0 ? (
          <p className="text-xs font-body text-outline">No headers in this article.</p>
        ) : (
          <nav className="flex flex-col gap-2.5 text-xs font-body">
            {toc.map((item, idx) => (
              <a
                key={idx}
                href={`#${item.id}`}
                className={`text-on-surface-variant hover:text-primary transition-colors leading-relaxed block ${
                  item.level === 3 ? "pl-4 text-[11px] opacity-80" : "font-medium"
                }`}
              >
                {item.text}
              </a>
            ))}
          </nav>
        )}
      </aside>

    </div>
  );
};
export default BlogPost;
