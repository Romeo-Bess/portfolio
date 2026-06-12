import React, { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import { supabase } from "../supabase/client";
import { Search, Calendar, Clock, BookOpen, ArrowRight } from "lucide-react";

interface BlogPost {
  id: string;
  title: string;
  slug: string;
  excerpt: string;
  published_at: string;
  reading_time: number;
  category: string;
  tags: string[];
}

export const Blog: React.FC = () => {
  const [posts, setPosts] = useState<BlogPost[]>([]);
  const [loading, setLoading] = useState(true);
  const [searchQuery, setSearchQuery] = useState("");
  const [selectedCategory, setSelectedCategory] = useState("All");

  const categories = ["All", "Healthcare", "Systems Engineering", "Business Systems", "Automation"];

  useEffect(() => {
    const fetchPosts = async () => {
      setLoading(true);
      try {
        let query = supabase.from("blog_posts").select("*").order("published_at", { ascending: false });

        if (selectedCategory !== "All") {
          query = query.eq("category", selectedCategory);
        }

        const { data } = await query;
        if (data) setPosts(data);
      } catch (err) {
        console.error("Error loading blog posts:", err);
      } finally {
        setLoading(false);
      }
    };
    fetchPosts();
  }, [selectedCategory]);

  const filteredPosts = posts.filter(
    (post) =>
      post.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
      post.excerpt.toLowerCase().includes(searchQuery.toLowerCase()) ||
      post.tags.some((tag) => tag.toLowerCase().includes(searchQuery.toLowerCase()))
  );

  return (
    <div className="max-w-[1000px] w-full mx-auto px-margin-mobile md:px-margin-desktop py-12 flex flex-col gap-12">
      {/* Header */}
      <div>
        <h1 className="font-display text-4xl sm:text-5xl font-bold text-on-surface">Technical Blog</h1>
        <p className="font-body text-sm sm:text-base text-on-surface-variant mt-2 max-w-xl">
          Deep dives, architectural blueprints, and logs analyzing clinical software integrations and automation metrics.
        </p>
      </div>

      {/* Filters */}
      <div className="flex flex-col sm:flex-row gap-4 justify-between items-center w-full">
        {/* Search */}
        <div className="flex items-center bg-surface-container/60 border border-outline-variant/30 rounded-lg px-3.5 py-2 hover:border-primary/45 transition-colors focus-within:bg-surface w-full sm:w-80">
          <Search className="w-4 h-4 text-outline mr-2" />
          <input
            type="text"
            placeholder="Search articles or tags..."
            className="bg-transparent border-none text-xs font-body focus:ring-0 w-full text-on-surface placeholder:text-outline focus:outline-none"
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
          />
        </div>

        {/* Categories */}
        <div className="flex gap-1 overflow-x-auto w-full sm:w-auto py-1 hide-scrollbar">
          {categories.map((cat) => (
            <button
              key={cat}
              onClick={() => setSelectedCategory(cat)}
              className={`px-3.5 py-1.5 rounded-md text-[10px] font-mono transition-colors border ${
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

      {/* Blog List */}
      <div className="flex flex-col gap-6">
        {loading ? (
          Array(2)
            .fill(0)
            .map((_, i) => (
              <div key={i} className="h-56 rounded-xl bg-surface-container animate-pulse border border-outline-variant/25"></div>
            ))
        ) : filteredPosts.length === 0 ? (
          <div className="py-16 text-center text-on-surface-variant font-body">
            No articles match your search parameters.
          </div>
        ) : (
          filteredPosts.map((post) => (
            <article
              key={post.id}
              className="glass-card rounded-xl p-6 sm:p-8 border border-outline-variant/20 hover:border-primary/25 flex flex-col justify-between group transition-all"
            >
              <div>
                <div className="flex flex-wrap items-center gap-4 text-xs font-mono text-outline mb-4">
                  <span className="flex items-center gap-1">
                    <Calendar className="w-3.5 h-3.5" />
                    {new Date(post.published_at).toLocaleDateString(undefined, { year: "numeric", month: "short", day: "numeric" })}
                  </span>
                  <span className="flex items-center gap-1">
                    <Clock className="w-3.5 h-3.5" />
                    {post.reading_time} MIN READ
                  </span>
                  <span className="text-secondary font-bold uppercase tracking-widest text-[9px] bg-secondary/10 px-2 py-0.5 rounded border border-secondary/15 ml-auto">
                    {post.category}
                  </span>
                </div>

                <h2 className="font-display text-xl sm:text-2xl font-bold text-on-surface mb-3 group-hover:text-primary transition-colors leading-tight">
                  <Link to={`/blog/${post.slug}`}>{post.title}</Link>
                </h2>

                <p className="font-body text-sm text-on-surface-variant mb-6 leading-relaxed">
                  {post.excerpt}
                </p>
              </div>

              <div className="flex flex-wrap items-center justify-between gap-4 pt-4 border-t border-outline-variant/10 mt-2">
                <div className="flex flex-wrap gap-1.5">
                  {post.tags.map((tag, idx) => (
                    <span
                      key={idx}
                      className="px-2 py-0.5 rounded bg-surface-container text-[9px] font-mono text-outline border border-outline-variant/10"
                    >
                      #{tag}
                    </span>
                  ))}
                </div>

                <Link
                  to={`/blog/${post.slug}`}
                  className="inline-flex items-center gap-1.5 text-xs font-mono font-bold text-primary hover:text-primary-container group/link"
                >
                  <span>Read Full Article</span>
                  <ArrowRight className="w-3.5 h-3.5 group-hover/link:translate-x-0.5 transition-transform" />
                </Link>
              </div>
            </article>
          ))
        )}
      </div>
    </div>
  );
};
export default Blog;
