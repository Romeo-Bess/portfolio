import React, { useState } from "react";
import { Link, useLocation } from "react-router-dom";
import { useThemeStore } from "../store/useThemeStore";
import type { Theme } from "../store/useThemeStore";
import { useSearchStore } from "../store/useSearchStore";
import { Search, Sun, Moon, Sparkles, Compass, Sunset, Menu, X, ArrowRight } from "lucide-react";

export const Navbar: React.FC = () => {
  const { theme, setTheme } = useThemeStore();
  const { toggleOpen } = useSearchStore();
  const [menuOpen, setMenuOpen] = useState(false);
  const [dropdownOpen, setDropdownOpen] = useState(false);
  const location = useLocation();

  const navLinks = [
    { name: "Home", path: "/" },
    { name: "About", path: "/about" },
    { name: "Projects", path: "/projects" },
    { name: "Contact", path: "/contact" },
  ];

  const themes: { id: Theme; name: string; icon: React.ReactNode; color: string }[] = [
    { id: "light", name: "Luminous", icon: <Sun className="w-3.5 h-3.5" />, color: "bg-amber-400" },
    { id: "dark", name: "Obsidian", icon: <Moon className="w-3.5 h-3.5" />, color: "bg-slate-700" },
    { id: "aurora", name: "Aurora", icon: <Sparkles className="w-3.5 h-3.5" />, color: "bg-emerald-400" },
    { id: "ocean", name: "Ocean", icon: <Compass className="w-3.5 h-3.5" />, color: "bg-cyan-400" },
    { id: "sunset", name: "Sunset", icon: <Sunset className="w-3.5 h-3.5" />, color: "bg-rose-400" },
  ];

  const handleThemeChange = (newTheme: Theme) => {
    setTheme(newTheme);
    setDropdownOpen(false);
  };

  return (
    <nav className="fixed top-0 w-full z-50 bg-surface/75 backdrop-blur-xl border-b border-outline-variant/20 shadow-sm transition-all duration-300">
      <div className="max-w-[1280px] mx-auto px-margin-mobile md:px-margin-desktop flex items-center justify-between h-20">
        
        {/* Brand */}
        <Link 
          to="/" 
          className="flex items-center gap-3 font-display text-lg sm:text-xl md:text-2xl font-bold tracking-tighter text-on-surface hover:opacity-90 active:scale-98 transition-all"
        >
          <img src="/assets/logo.png" alt="Romeo Bessenaar Logo" className="w-12 h-12 rounded-full object-cover border-2 border-primary/50 shadow-md transition-transform duration-300 hover:scale-105" />
          <span>Romeo Bessenaar</span>
        </Link>

        {/* Desktop Links */}
        <div className="hidden lg:flex items-center gap-1 font-body text-sm font-medium">
          {navLinks.map((link) => {
            const isActive = location.pathname === link.path;
            return (
              <Link
                key={link.path}
                to={link.path}
                className={`px-3 py-1.5 rounded-lg transition-all duration-200 ${
                  isActive
                    ? "text-primary bg-primary/10 font-semibold"
                    : "text-on-surface-variant hover:text-primary hover:bg-surface-container/50"
                }`}
              >
                {link.name}
              </Link>
            );
          })}
        </div>

        {/* Actions */}
        <div className="flex items-center gap-2 sm:gap-3">
          
          {/* Search Button */}
          <button
            onClick={toggleOpen}
            className="flex items-center gap-2 px-3 py-2 rounded-full bg-surface-container/50 border border-outline-variant/30 text-on-surface-variant hover:bg-surface-container transition-colors text-xs"
            title="Search (Ctrl + K)"
          >
            <Search className="w-4 h-4 text-on-surface-variant" />
            <span className="hidden sm:inline font-mono font-medium text-[11px] opacity-70">Search</span>
            <kbd className="hidden md:inline-block font-mono bg-surface px-1 py-0.5 rounded border border-outline-variant/40 text-[9px]">
              ⌘K
            </kbd>
          </button>

          {/* Theme Dropdown Trigger */}
          <div className="relative">
            <button
              onClick={() => setDropdownOpen(!dropdownOpen)}
              className="p-2.5 rounded-full hover:bg-surface-container border border-outline-variant/20 text-on-surface flex items-center justify-center transition-all"
              title="Change Theme"
            >
              {theme === "light" && <Sun className="w-4.5 h-4.5" />}
              {theme === "dark" && <Moon className="w-4.5 h-4.5" />}
              {theme === "aurora" && <Sparkles className="w-4.5 h-4.5" />}
              {theme === "ocean" && <Compass className="w-4.5 h-4.5" />}
              {theme === "sunset" && <Sunset className="w-4.5 h-4.5" />}
            </button>

            {dropdownOpen && (
              <div className="absolute right-0 mt-2 w-48 rounded-xl border border-outline-variant/30 bg-surface-container-low/95 backdrop-blur-xl shadow-xl p-1.5 flex flex-col gap-0.5">
                {themes.map((t) => (
                  <button
                    key={t.id}
                    onClick={() => handleThemeChange(t.id)}
                    className={`flex items-center justify-between w-full px-3 py-2 text-left rounded-lg text-xs font-body transition-colors ${
                      theme === t.id
                        ? "bg-primary/10 text-primary font-semibold"
                        : "text-on-surface hover:bg-surface-container-high/50"
                    }`}
                  >
                    <div className="flex items-center gap-2.5">
                      <div className={`w-2 h-2 rounded-full ${t.color}`}></div>
                      <span>{t.name}</span>
                    </div>
                    {t.icon}
                  </button>
                ))}
              </div>
            )}
          </div>



          {/* Hamburger Menu Toggle (Mobile) */}
          <button
            onClick={() => setMenuOpen(!menuOpen)}
            className="lg:hidden p-2 text-on-surface hover:bg-surface-container rounded-lg"
          >
            {menuOpen ? <X className="w-6 h-6" /> : <Menu className="w-6 h-6" />}
          </button>
        </div>
      </div>

      {/* Mobile Drawer */}
      {menuOpen && (
        <div className="lg:hidden absolute top-20 w-full left-0 border-b border-outline-variant/30 bg-surface-container/95 backdrop-blur-xl shadow-md p-4 flex flex-col gap-2 animate-in fade-in slide-in-from-top-4 duration-200">
          {navLinks.map((link) => {
            const isActive = location.pathname === link.path;
            return (
              <Link
                key={link.path}
                to={link.path}
                onClick={() => setMenuOpen(false)}
                className={`w-full px-4 py-2.5 rounded-lg text-sm transition-colors ${
                  isActive
                    ? "bg-primary/15 text-primary font-semibold"
                    : "text-on-surface-variant hover:text-primary hover:bg-surface-container-high/50"
                }`}
              >
                {link.name}
              </Link>
            );
          })}

        </div>
      )}
    </nav>
  );
};
