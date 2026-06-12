import React, { useEffect, useState } from "react";
import { Helmet } from "react-helmet-async";
import { motion } from "framer-motion";
import {
  GitBranch,
  Star,
  Eye,
  BookOpen,
  Calendar,
  Layers,
  ExternalLink,
  Code,
  AlertCircle,
  RefreshCw,
  Clock
} from "lucide-react";
import { ResponsiveContainer, PieChart, Pie, Cell, Tooltip, Legend } from "recharts";

interface GithubProfile {
  login: string;
  avatar_url: string;
  name: string;
  company: string;
  blog: string;
  location: string;
  bio: string;
  public_repos: number;
  followers: number;
  following: number;
  created_at: string;
}

interface GithubRepo {
  id: number;
  name: string;
  description: string;
  html_url: string;
  stargazers_count: number;
  forks_count: number;
  watchers_count: number;
  language: string;
  languages_url: string;
  updated_at: string;
  size: number;
}

interface CommitActivity {
  repoName: string;
  message: string;
  date: string;
  sha: string;
}

const CACHE_KEY_PROFILE = "github_profile_cache";
const CACHE_KEY_REPOS = "github_repos_cache";
const CACHE_KEY_COMMITS = "github_commits_cache";
const CACHE_TIME_KEY = "github_cache_time";
const CACHE_DURATION = 5 * 60 * 1000; // 5 minutes in ms

export const Github: React.FC = () => {
  const [profile, setProfile] = useState<GithubProfile | null>(null);
  const [repos, setRepos] = useState<GithubRepo[]>([]);
  const [commits, setCommits] = useState<CommitActivity[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [languageData, setLanguageData] = useState<{ name: string; value: number }[]>([]);
  const [selectedRepo, setSelectedRepo] = useState<GithubRepo | null>(null);

  const username = import.meta.env.VITE_GITHUB_USERNAME || "romeobessenaar";

  const fetchGithubData = async (forceRefresh = false) => {
    setLoading(true);
    setError(null);
    try {
      const cachedTime = localStorage.getItem(CACHE_TIME_KEY);
      const isCacheValid = cachedTime && Date.now() - parseInt(cachedTime) < CACHE_DURATION;

      if (!forceRefresh && isCacheValid) {
        const cachedProfile = localStorage.getItem(CACHE_KEY_PROFILE);
        const cachedRepos = localStorage.getItem(CACHE_KEY_REPOS);
        const cachedCommits = localStorage.getItem(CACHE_KEY_COMMITS);

        if (cachedProfile && cachedRepos && cachedCommits) {
          setProfile(JSON.parse(cachedProfile));
          setRepos(JSON.parse(cachedRepos));
          const parsedCommits = JSON.parse(cachedCommits);
          setCommits(parsedCommits);
          calculateLanguages(JSON.parse(cachedRepos));
          setLoading(false);
          return;
        }
      }

      // Fetch from API
      // Optional Token can be provided in vite env if desired
      const headers: HeadersInit = {};
      const token = import.meta.env.VITE_GITHUB_TOKEN;
      if (token) {
        headers["Authorization"] = `token ${token}`;
      }

      // 1. Profile Info
      const profileRes = await fetch(`https://api.github.com/users/${username}`, { headers });
      if (!profileRes.ok) throw new Error(`Failed to fetch profile: ${profileRes.statusText}`);
      const profileData = await profileRes.json();

      // 2. Repos
      const reposRes = await fetch(`https://api.github.com/users/${username}/repos?sort=updated&per_page=30`, { headers });
      if (!reposRes.ok) throw new Error(`Failed to fetch repos: ${reposRes.statusText}`);
      const reposData: GithubRepo[] = await reposRes.json();

      // Sort repos by stars + size for featured/pinned-like list
      const sortedRepos = [...reposData].sort((a, b) => b.stargazers_count - a.stargazers_count);

      // 3. Commits (Fetch from top 3 active repos to construct aggregate commit feed)
      const commitPromises = sortedRepos.slice(0, 3).map(async (repo) => {
        try {
          const commitRes = await fetch(`https://api.github.com/repos/${username}/${repo.name}/commits?per_page=5`, { headers });
          if (commitRes.ok) {
            const data = await commitRes.json();
            return data.map((c: any) => ({
              repoName: repo.name,
              message: c.commit.message,
              date: c.commit.author.date,
              sha: c.sha.substring(0, 7)
            }));
          }
        } catch (e) {
          console.warn("Failed to fetch commits for ", repo.name);
        }
        return [];
      });

      const commitResults = await Promise.all(commitPromises);
      const combinedCommits: CommitActivity[] = commitResults
        .flat()
        .sort((a, b) => new Date(b.date).getTime() - new Date(a.date).getTime())
        .slice(0, 10);

      // Save to states
      setProfile(profileData);
      setRepos(sortedRepos);
      setCommits(combinedCommits);
      calculateLanguages(sortedRepos);

      // Save to cache
      localStorage.setItem(CACHE_KEY_PROFILE, JSON.stringify(profileData));
      localStorage.setItem(CACHE_KEY_REPOS, JSON.stringify(sortedRepos));
      localStorage.setItem(CACHE_KEY_COMMITS, JSON.stringify(combinedCommits));
      localStorage.setItem(CACHE_TIME_KEY, Date.now().toString());

    } catch (err: any) {
      console.error(err);
      setError(err.message || "An unexpected error occurred while fetching GitHub details.");
    } finally {
      setLoading(false);
    }
  };

  const calculateLanguages = (repoList: GithubRepo[]) => {
    const langMap: { [key: string]: number } = {};
    repoList.forEach((repo) => {
      if (repo.language) {
        langMap[repo.language] = (langMap[repo.language] || 0) + 1;
      }
    });

    const formatted = Object.keys(langMap).map((key) => ({
      name: key,
      value: langMap[key]
    })).sort((a, b) => b.value - a.value);

    setLanguageData(formatted);
  };

  useEffect(() => {
    fetchGithubData();
  }, []);

  const COLORS = ["#0066ff", "#8455ef", "#008075", "#4ade80", "#2dd4bf", "#f43f5e", "#f97316"];

  return (
    <div className="max-w-[1280px] w-full mx-auto px-margin-mobile md:px-margin-desktop py-12 flex flex-col gap-12">
      <Helmet>
        <title>GitHub Dashboard | Romeo Bessenaar</title>
        <meta name="description" content="Live integration with GitHub REST API displaying code metrics, repository breakdowns, and dynamic language stats." />
      </Helmet>

      {/* Header */}
      <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4 border-b border-outline-variant/15 pb-6">
        <div>
          <h1 className="font-display text-4xl sm:text-5xl font-bold text-on-surface">GitHub Hub</h1>
          <p className="font-body text-sm sm:text-base text-on-surface-variant mt-2 max-w-xl">
            Live telemetry of active repositories, code language distributions, and commit feeds.
          </p>
        </div>
        <button
          onClick={() => fetchGithubData(true)}
          className="flex items-center gap-2 px-4 py-2 border border-outline-variant/35 rounded-lg bg-surface hover:bg-surface-container font-mono text-xs text-on-surface-variant active:scale-95 transition-all"
        >
          <RefreshCw className="w-3.5 h-3.5" />
          <span>Refresh Data</span>
        </button>
      </div>

      {error && (
        <div className="bg-error-container/10 border border-error/30 text-on-surface rounded-xl p-6 flex items-start gap-4">
          <AlertCircle className="w-6 h-6 text-error flex-shrink-0 mt-0.5" />
          <div>
            <h3 className="font-display font-bold text-sm">Data Loading Error</h3>
            <p className="font-body text-xs text-on-surface-variant mt-1">{error}</p>
            <button
              onClick={() => fetchGithubData(true)}
              className="mt-3 font-mono text-[10px] text-primary hover:underline"
            >
              Try Again
            </button>
          </div>
        </div>
      )}

      {loading ? (
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8">
          {/* Skeleton Profile */}
          <div className="lg:col-span-4 h-96 bg-surface-container animate-pulse rounded-xl border border-outline-variant/20"></div>
          {/* Skeleton Data */}
          <div className="lg:col-span-8 flex flex-col gap-6">
            <div className="h-64 bg-surface-container animate-pulse rounded-xl border border-outline-variant/20"></div>
            <div className="h-96 bg-surface-container animate-pulse rounded-xl border border-outline-variant/20"></div>
          </div>
        </div>
      ) : (
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-start">
          {/* Left Column: Profile Card */}
          {profile && (
            <motion.div
              initial={{ opacity: 0, y: 15 }}
              animate={{ opacity: 1, y: 0 }}
              className="lg:col-span-4 glass-panel border border-outline-variant/25 rounded-2xl p-6 flex flex-col gap-6"
            >
              <div className="flex items-center gap-4">
                <img
                  src={profile.avatar_url}
                  alt={profile.name}
                  className="w-16 h-16 rounded-full border-2 border-primary/30"
                />
                <div>
                  <h2 className="font-display font-extrabold text-lg text-on-surface">{profile.name}</h2>
                  <span className="font-mono text-xs text-outline">@{profile.login}</span>
                </div>
              </div>

              <p className="font-body text-xs text-on-surface-variant leading-relaxed">
                {profile.bio || "Systems developer and laboratory automation enthusiast."}
              </p>

              <div className="grid grid-cols-3 gap-3 border-y border-outline-variant/15 py-4 text-center font-mono">
                <div>
                  <span className="block text-lg font-bold text-primary">{profile.public_repos}</span>
                  <span className="text-[9px] text-outline uppercase">Repos</span>
                </div>
                <div>
                  <span className="block text-lg font-bold text-primary">{profile.followers}</span>
                  <span className="text-[9px] text-outline uppercase">Followers</span>
                </div>
                <div>
                  <span className="block text-lg font-bold text-primary">{profile.following}</span>
                  <span className="text-[9px] text-outline uppercase">Following</span>
                </div>
              </div>

              <div className="flex flex-col gap-2.5 font-body text-xs text-on-surface-variant">
                {profile.company && (
                  <div className="flex justify-between">
                    <span className="text-outline font-semibold">Company:</span>
                    <span>{profile.company}</span>
                  </div>
                )}
                {profile.location && (
                  <div className="flex justify-between">
                    <span className="text-outline font-semibold">Location:</span>
                    <span>{profile.location}</span>
                  </div>
                )}
                <div className="flex justify-between">
                  <span className="text-outline font-semibold">Joined:</span>
                  <span>{new Date(profile.created_at).toLocaleDateString(undefined, { year: 'numeric', month: 'long' })}</span>
                </div>
              </div>

              <a
                href={`https://github.com/${profile.login}`}
                target="_blank"
                rel="noreferrer"
                className="w-full text-center bg-primary text-on-primary py-3 rounded-lg font-mono text-xs hover:opacity-95 flex items-center justify-center gap-1.5 transition-opacity"
              >
                <span>View Full GitHub Profile</span>
                <ExternalLink className="w-3.5 h-3.5" />
              </a>
            </motion.div>
          )}

          {/* Right Column: Dashboard Data */}
          <div className="lg:col-span-8 flex flex-col gap-8">
            {/* Top Grid: Languages and Commits */}
            <div className="grid grid-cols-1 md:grid-cols-12 gap-8">
              {/* Language Breakdown */}
              <motion.div
                initial={{ opacity: 0, y: 15 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.1 }}
                className="md:col-span-6 glass-panel border border-outline-variant/25 rounded-2xl p-6 flex flex-col h-[340px]"
              >
                <div className="flex items-center gap-2 mb-4">
                  <Layers className="w-4 h-4 text-primary" />
                  <h3 className="font-display font-semibold text-sm text-on-surface">Language Distribution</h3>
                </div>
                {languageData.length === 0 ? (
                  <div className="flex-grow flex items-center justify-center text-xs text-on-surface-variant">
                    No languages detected.
                  </div>
                ) : (
                  <div className="flex-grow flex items-center justify-center">
                    <div className="w-full h-full max-h-[220px]">
                      <ResponsiveContainer width="100%" height="100%">
                        <PieChart>
                          <Pie
                            data={languageData}
                            cx="50%"
                            cy="50%"
                            innerRadius={50}
                            outerRadius={75}
                            paddingAngle={3}
                            dataKey="value"
                          >
                            {languageData.map((_, index) => (
                              <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
                            ))}
                          </Pie>
                          <Tooltip
                            contentStyle={{
                              background: "rgba(10, 15, 25, 0.9)",
                              border: "1px solid rgba(255,255,255,0.15)",
                              borderRadius: "8px",
                              fontSize: "10px",
                              color: "#fff"
                            }}
                          />
                          <Legend
                            verticalAlign="bottom"
                            height={36}
                            iconType="circle"
                            iconSize={7}
                            formatter={(value) => <span className="text-[10px] font-mono text-on-surface-variant">{value}</span>}
                          />
                        </PieChart>
                      </ResponsiveContainer>
                    </div>
                  </div>
                )}
              </motion.div>

              {/* Commit Feed */}
              <motion.div
                initial={{ opacity: 0, y: 15 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.15 }}
                className="md:col-span-6 glass-panel border border-outline-variant/25 rounded-2xl p-6 flex flex-col h-[340px] overflow-hidden"
              >
                <div className="flex items-center justify-between mb-4">
                  <div className="flex items-center gap-2">
                    <Clock className="w-4 h-4 text-primary" />
                    <h3 className="font-display font-semibold text-sm text-on-surface">Aggregate Commit Activity</h3>
                  </div>
                  <span className="text-[8px] font-mono text-outline uppercase bg-surface-container px-2 py-0.5 rounded">
                    Recent
                  </span>
                </div>
                <div className="flex-grow overflow-y-auto pr-1 flex flex-col gap-3 font-body text-xs">
                  {commits.length === 0 ? (
                    <div className="h-full flex items-center justify-center text-on-surface-variant text-center">
                      No recent commit data.
                    </div>
                  ) : (
                    commits.map((commit, idx) => (
                      <div key={idx} className="border-b border-outline-variant/10 pb-2.5 last:border-0">
                        <div className="flex justify-between items-start gap-2">
                          <span className="font-mono text-[10px] text-secondary font-bold uppercase truncate max-w-[120px]">
                            {commit.repoName}
                          </span>
                          <span className="text-[9px] font-mono text-outline">
                            {commit.sha}
                          </span>
                        </div>
                        <p className="text-on-surface mt-1 leading-normal font-sans text-xs line-clamp-1">
                          {commit.message}
                        </p>
                        <span className="text-[8px] font-mono text-outline block mt-1.5">
                          {new Date(commit.date).toLocaleString()}
                        </span>
                      </div>
                    ))
                  )}
                </div>
              </motion.div>
            </div>

            {/* Repositories List */}
            <motion.div
              initial={{ opacity: 0, y: 15 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.2 }}
              className="glass-panel border border-outline-variant/25 rounded-2xl p-6"
            >
              <div className="flex items-center gap-2 mb-6">
                <BookOpen className="w-4.5 h-4.5 text-primary" />
                <h3 className="font-display font-bold text-base text-on-surface">Active Repositories</h3>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                {repos.map((repo) => (
                  <div
                    key={repo.id}
                    onClick={() => setSelectedRepo(repo)}
                    className="border border-outline-variant/20 hover:border-primary/35 bg-surface/20 rounded-xl p-5 hover:bg-surface-container-low/40 transition-all cursor-pointer flex flex-col justify-between"
                  >
                    <div>
                      <div className="flex justify-between items-center mb-2">
                        <h4 className="font-display font-bold text-sm text-on-surface hover:text-primary truncate">
                          {repo.name}
                        </h4>
                        {repo.language && (
                          <span className="px-2 py-0.5 rounded bg-primary/10 text-primary border border-primary/20 text-[9px] font-mono font-bold">
                            {repo.language}
                          </span>
                        )}
                      </div>
                      <p className="font-body text-xs text-on-surface-variant leading-relaxed line-clamp-2 mb-4">
                        {repo.description || "No description provided."}
                      </p>
                    </div>

                    <div className="flex items-center justify-between text-[10px] font-mono text-outline pt-2 border-t border-outline-variant/10">
                      <div className="flex gap-3">
                        <span className="flex items-center gap-1">
                          <Star className="w-3.5 h-3.5 fill-amber-400 stroke-amber-400" />
                          <span>{repo.stargazers_count}</span>
                        </span>
                        <span className="flex items-center gap-1">
                          <GitBranch className="w-3.5 h-3.5 text-outline" />
                          <span>{repo.forks_count}</span>
                        </span>
                      </div>
                      <span className="text-[9px]">
                        Updated: {new Date(repo.updated_at).toLocaleDateString()}
                      </span>
                    </div>
                  </div>
                ))}
              </div>
            </motion.div>
          </div>
        </div>
      )}

      {/* Repository Detail Modal */}
      {selectedRepo && (
        <div className="fixed inset-0 z-[100] flex items-center justify-center p-4 bg-black/70 backdrop-blur-sm">
          <motion.div
            initial={{ scale: 0.95, opacity: 0 }}
            animate={{ scale: 1, opacity: 1 }}
            className="w-full max-w-lg rounded-xl border border-outline-variant/30 bg-surface-container p-6 shadow-2xl flex flex-col gap-5 text-left"
          >
            <div className="flex justify-between items-start">
              <div>
                <span className="text-[9px] font-mono font-bold uppercase text-secondary">Repository Details</span>
                <h3 className="font-display font-bold text-xl text-on-surface mt-1">{selectedRepo.name}</h3>
              </div>
              <button
                onClick={() => setSelectedRepo(null)}
                className="p-1 rounded-md hover:bg-surface-container-high border border-outline-variant/20 text-outline hover:text-on-surface transition-all font-bold text-xs"
              >
                Close
              </button>
            </div>

            <div className="font-body text-xs text-on-surface-variant leading-relaxed flex flex-col gap-4">
              <div>
                <span className="text-outline font-semibold block mb-1">Description:</span>
                <p className="bg-surface/30 p-3 rounded border border-outline-variant/10 text-on-surface">
                  {selectedRepo.description || "No description provided for this repository."}
                </p>
              </div>

              <div className="grid grid-cols-2 gap-4 font-mono text-[10px]">
                <div className="p-3 bg-surface/20 rounded border border-outline-variant/10 flex flex-col gap-1">
                  <span className="text-outline uppercase">Size</span>
                  <span className="text-on-surface font-bold">{(selectedRepo.size / 1024).toFixed(2)} MB</span>
                </div>
                <div className="p-3 bg-surface/20 rounded border border-outline-variant/10 flex flex-col gap-1">
                  <span className="text-outline uppercase">Stars</span>
                  <span className="text-on-surface font-bold">{selectedRepo.stargazers_count} stars</span>
                </div>
                <div className="p-3 bg-surface/20 rounded border border-outline-variant/10 flex flex-col gap-1">
                  <span className="text-outline uppercase">Primary Language</span>
                  <span className="text-on-surface font-bold">{selectedRepo.language || "N/A"}</span>
                </div>
                <div className="p-3 bg-surface/20 rounded border border-outline-variant/10 flex flex-col gap-1">
                  <span className="text-outline uppercase">Watchers</span>
                  <span className="text-on-surface font-bold">{selectedRepo.watchers_count} watchers</span>
                </div>
              </div>
            </div>

            <div className="flex justify-end gap-3 pt-3 border-t border-outline-variant/15 font-mono text-xs">
              <button
                onClick={() => setSelectedRepo(null)}
                className="px-4 py-2 border border-outline-variant/40 hover:bg-surface-container-high text-on-surface-variant rounded-lg"
              >
                Close
              </button>
              <a
                href={selectedRepo.html_url}
                target="_blank"
                rel="noreferrer"
                className="px-4 py-2 bg-primary text-on-primary rounded-lg flex items-center gap-1.5 hover:opacity-95"
              >
                <span>View on GitHub</span>
                <ExternalLink className="w-3.5 h-3.5" />
              </a>
            </div>
          </motion.div>
        </div>
      )}
    </div>
  );
};
export default Github;
