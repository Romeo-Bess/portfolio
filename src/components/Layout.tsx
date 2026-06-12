import React from "react";
import { Outlet, useLocation } from "react-router-dom";
import { Navbar } from "./Navbar";
import { Footer } from "./Footer";
import { CommandPalette } from "./CommandPalette";
import { ChatbotWidget } from "./ChatbotWidget";
import { motion, AnimatePresence } from "framer-motion";

export const Layout: React.FC = () => {
  const location = useLocation();

  // Scroll to top on route change
  React.useEffect(() => {
    window.scrollTo(0, 0);
  }, [location.pathname]);

  return (
    <div className="flex flex-col min-h-screen relative overflow-hidden bg-background text-on-background">
      {/* Background Ambience Radial Blobs */}
      <div className="blob-bg w-[40vw] h-[40vw] max-w-[500px] bg-primary/15 top-[-10%] left-[-10%] rounded-full blur-[100px]" />
      <div className="blob-bg w-[35vw] h-[35vw] max-w-[450px] bg-secondary/10 bottom-[-5%] right-[-5%] rounded-full blur-[90px]" />
      <div className="blob-bg w-[30vw] h-[30vw] max-w-[400px] bg-tertiary/8 top-[35%] left-[60%] rounded-full blur-[120px]" />

      {/* Sticky Header */}
      <Navbar />

      {/* Content Main Wrapper */}
      <main className="flex-grow pt-24 pb-12 w-full flex flex-col">
        <AnimatePresence mode="wait">
          <motion.div
            key={location.pathname}
            initial={{ opacity: 0, y: 15 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -15 }}
            transition={{ duration: 0.35, ease: [0.23, 1, 0.32, 1] }}
            className="flex-grow flex flex-col"
          >
            <Outlet />
          </motion.div>
        </AnimatePresence>
      </main>

      {/* Global Widgets */}
      <CommandPalette />
      <ChatbotWidget />

      {/* Footer */}
      <Footer />
    </div>
  );
};
export default Layout;
