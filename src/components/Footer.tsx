import React from "react";
import { Link } from "react-router-dom";
import { Mail, ArrowUpRight } from "lucide-react";
import { GithubIcon, LinkedinIcon } from "./Icons";

export const Footer: React.FC = () => {
  return (
    <footer className="w-full py-12 border-t border-outline-variant/20 bg-surface/40 mt-auto transition-colors duration-300">
      <div className="max-w-[1280px] mx-auto px-margin-mobile md:px-margin-desktop grid grid-cols-1 md:grid-cols-4 gap-8">
        
        {/* Bio */}
        <div className="col-span-1 md:col-span-2">
          <div className="font-display text-xl font-bold text-on-surface mb-3">
            Romeo Bessenaar
          </div>
          <p className="font-body text-sm text-on-surface-variant max-w-sm mb-4 leading-relaxed">
            Specializing in the intersection of health diagnostics, robotic clinical labs, and high-throughput software pipelines.
          </p>
          <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-tertiary/10 border border-tertiary/20 text-xs text-tertiary font-mono">
            <span className="w-1.5 h-1.5 rounded-full bg-tertiary animate-pulse"></span>
            AVAILABLE FOR PROJECTS
          </div>
        </div>

        {/* Navigation */}
        <div>
          <h4 className="font-display font-semibold text-xs uppercase text-on-surface tracking-wider mb-4">
            Navigation
          </h4>
          <ul className="space-y-2.5 text-sm font-body">
            <li>
              <Link to="/" className="text-on-surface-variant hover:text-primary transition-colors">
                Home
              </Link>
            </li>
            <li>
              <Link to="/about" className="text-on-surface-variant hover:text-primary transition-colors">
                About Journey
              </Link>
            </li>
            <li>
              <Link to="/projects" className="text-on-surface-variant hover:text-primary transition-colors">
                Projects CMS
              </Link>
            </li>
            <li>
              <Link to="/labs" className="text-on-surface-variant hover:text-primary transition-colors">
                Labs Hub
              </Link>
            </li>
          </ul>
        </div>

        {/* Network & Code */}
        <div>
          <h4 className="font-display font-semibold text-xs uppercase text-on-surface tracking-wider mb-4">
            Social Channels
          </h4>
          <ul className="space-y-3 font-mono text-xs">
            <li>
              <a
                href="https://linkedin.com/in/romeobessenaar"
                target="_blank"
                rel="noreferrer"
                className="flex items-center gap-2 text-on-surface-variant hover:text-primary transition-colors group"
              >
                <LinkedinIcon className="w-4 h-4" />
                <span>LinkedIn</span>
                <ArrowUpRight className="w-3.5 h-3.5 opacity-0 group-hover:opacity-100 transition-opacity" />
              </a>
            </li>
            <li>
              <a
                href="https://github.com/romeobessenaar"
                target="_blank"
                rel="noreferrer"
                className="flex items-center gap-2 text-on-surface-variant hover:text-primary transition-colors group"
              >
                <GithubIcon className="w-4 h-4" />
                <span>GitHub</span>
                <ArrowUpRight className="w-3.5 h-3.5 opacity-0 group-hover:opacity-100 transition-opacity" />
              </a>
            </li>
            <li>
              <a
                href="mailto:hello@romeobessenaar.com"
                className="flex items-center gap-2 text-on-surface-variant hover:text-primary transition-colors group"
              >
                <Mail className="w-4 h-4" />
                <span>Email Romeo</span>
                <ArrowUpRight className="w-3 h-3 opacity-0 group-hover:opacity-100 transition-opacity" />
              </a>
            </li>
          </ul>
        </div>

      </div>

      <div className="max-w-[1280px] mx-auto px-margin-mobile md:px-margin-desktop mt-8 pt-8 border-t border-outline-variant/10 flex flex-col sm:flex-row items-center justify-between gap-4">
        <p className="text-xs text-outline font-body">
          © {new Date().getFullYear()} Romeo Bessenaar. All rights reserved. Built as a Personal OS.
        </p>
        <div className="flex gap-4 text-xs font-body text-outline">
          <Link to="/admin" className="hover:text-primary transition-colors font-mono">
            [Admin Panel]
          </Link>
          <a href="#" className="hover:text-primary transition-colors">Privacy Policy</a>
          <a href="#" className="hover:text-primary transition-colors">Terms of Service</a>
        </div>
      </div>
    </footer>
  );
};
