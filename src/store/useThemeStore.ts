import { create } from "zustand";

export type Theme = "light" | "dark" | "aurora" | "ocean" | "sunset";

interface ThemeState {
  theme: Theme;
  setTheme: (theme: Theme) => void;
}

const getInitialTheme = (): Theme => {
  const saved = localStorage.getItem("romeo-theme") as Theme;
  if (saved && ["light", "dark", "aurora", "ocean", "sunset"].includes(saved)) {
    return saved;
  }
  // Check system preference for dark mode
  if (window.matchMedia("(prefers-color-scheme: dark)").matches) {
    return "dark";
  }
  return "light";
};

const applyTheme = (theme: Theme) => {
  const root = document.documentElement;
  // Set data-theme for custom styles
  root.setAttribute("data-theme", theme);
  
  // Tailwind default dark mode support
  if (theme === "dark") {
    root.classList.add("dark");
  } else {
    root.classList.remove("dark");
  }
  
  localStorage.setItem("romeo-theme", theme);
};

// Apply initial theme immediately upon module loading
applyTheme(getInitialTheme());

export const useThemeStore = create<ThemeState>((set) => ({
  theme: getInitialTheme(),
  setTheme: (theme) => {
    applyTheme(theme);
    set({ theme });
  },
}));
