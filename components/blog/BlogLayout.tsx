"use client";

import { useState, useEffect, useRef } from "react";
import Link from "next/link";
import BlogNavbar from "@/components/blog/BlogNavbar";
import BlogLeftSideBar from "@/components/blog/BlogLeftSideBar";
import { useMediaQuery } from "@/hooks/useMediaQuery";

interface DeviceWidths {
  mobile: { open: string; closed: string };
  tablet: { open: string; closed: string };
  desktop: { open: string; closed: string };
}

const SIDEBAR_WIDTHS: DeviceWidths = {
  mobile: { open: "w-64", closed: "w-0" },
  tablet: { open: "w-64", closed: "w-0" },
  desktop: { open: "w-64", closed: "w-16" },
};

export default function BlogLayout({ children }: { children: React.ReactNode }) {
  const [openLeftSidebar, setOpenLeftSidebar] = useState(false);
  const sidebarRef = useRef<HTMLDivElement>(null);

  const isMobile = useMediaQuery("(max-width:639px)");
  const isTablet = useMediaQuery("(min-width:640px) and (max-width:1023px)");

  useEffect(() => {
    if (!isMobile && !isTablet) {
      setOpenLeftSidebar(true);
    }
  }, [isMobile, isTablet]);

  // Set dark theme as default
  useEffect(() => {
    const savedTheme = localStorage.getItem("theme");
    if (!savedTheme) {
      localStorage.setItem("theme", "dark");
      document.documentElement.classList.add("dark");
    }
  }, []);

  const toggleSidebar = () => {
    setOpenLeftSidebar(!openLeftSidebar);
  };

  const getSidebarStyles = () => {
    const deviceType = isMobile ? "mobile" : isTablet ? "tablet" : "desktop";
    const state: keyof DeviceWidths[typeof deviceType] = openLeftSidebar ? "open" : "closed";
    const sidebarWidth = SIDEBAR_WIDTHS[deviceType][state];
    const marginLeft = deviceType === "desktop" ? (openLeftSidebar ? "ml-64" : "ml-16") : "ml-0";
    return { sidebar: sidebarWidth, content: marginLeft };
  };

  return (
    <div className="min-h-screen flex flex-col">
      <BlogNavbar openLeftSidebar={openLeftSidebar} onToggleSidebar={toggleSidebar} />

      <div className="flex relative flex-1">
        {openLeftSidebar && (isMobile || isTablet) && (
          <div className="fixed inset-0 bg-black/50 z-20" onClick={() => setOpenLeftSidebar(false)} />
        )}

        <aside
          ref={sidebarRef}
          className={`
            fixed top-12 left-0 h-[calc(100vh-3rem)] z-30
            border-r border-gray-200 dark:border-gray-800
            bg-white dark:bg-gray-900
            transition-all duration-300 ease-in-out
            ${!openLeftSidebar && (isMobile || isTablet) ? "-translate-x-full" : "translate-x-0"}
            ${getSidebarStyles().sidebar}
            ${isMobile || isTablet ? "shadow-xl" : ""}
          `}
        >
          <BlogLeftSideBar openLeftSidebar={openLeftSidebar} onClose={() => setOpenLeftSidebar(false)} />
        </aside>

        <div className={`flex-1 flex flex-col min-h-screen transition-all duration-300 ${getSidebarStyles().content}`}>
          <main className="flex-1 px-4 pb-8">
            {children}
          </main>

          <footer className="border-t border-gray-200 dark:border-gray-800">
            <div className="mx-auto max-w-4xl px-4 sm:px-6 lg:px-8 py-10">
              <div className="grid grid-cols-2 sm:grid-cols-4 gap-8 mb-8">
                {/* Strategies */}
                <div>
                  <h3 className="text-sm font-semibold text-gray-900 dark:text-white mb-3">Strategies</h3>
                  <nav className="flex flex-col gap-2">
                    <Link href="/i/ultimate-guide-sportpesa-jackpot" className="text-sm text-gray-500 dark:text-gray-400 hover:text-gray-900 dark:hover:text-white transition-colors">Ultimate Guide</Link>
                    <Link href="/i/how-to-predict-draws" className="text-sm text-gray-500 dark:text-gray-400 hover:text-gray-900 dark:hover:text-white transition-colors">Predict Draws</Link>
                    <Link href="/i/how-to-predict-home-win" className="text-sm text-gray-500 dark:text-gray-400 hover:text-gray-900 dark:hover:text-white transition-colors">Predict Home Wins</Link>
                    <Link href="/i/how-to-predict-away-win" className="text-sm text-gray-500 dark:text-gray-400 hover:text-gray-900 dark:hover:text-white transition-colors">Predict Away Wins</Link>
                    <Link href="/i/increase-chances-winning-sportpesa-jackpot" className="text-sm text-gray-500 dark:text-gray-400 hover:text-gray-900 dark:hover:text-white transition-colors">Improve Your Odds</Link>
                  </nav>
                </div>

                {/* Tools */}
                <div>
                  <h3 className="text-sm font-semibold text-gray-900 dark:text-white mb-3">Tools</h3>
                  <nav className="flex flex-col gap-2">
                    <Link href="/i/jackpot-win-probability" className="text-sm text-gray-500 dark:text-gray-400 hover:text-gray-900 dark:hover:text-white transition-colors">Win Calculator</Link>
                    <Link href="/i/what-is-value-betting" className="text-sm text-gray-500 dark:text-gray-400 hover:text-gray-900 dark:hover:text-white transition-colors">Value Betting</Link>
                  </nav>
                </div>

                {/* Winners */}
                <div>
                  <h3 className="text-sm font-semibold text-gray-900 dark:text-white mb-3">Winners</h3>
                  <nav className="flex flex-col gap-2">
                    <Link href="/i/mega-jackpot-winners-2024" className="text-sm text-gray-500 dark:text-gray-400 hover:text-gray-900 dark:hover:text-white transition-colors">Mega Winners 2024</Link>
                    <Link href="/i/midweek-jackpot-winners-2024" className="text-sm text-gray-500 dark:text-gray-400 hover:text-gray-900 dark:hover:text-white transition-colors">Midweek Winners</Link>
                  </nav>
                </div>

                {/* Site */}
                <div>
                  <h3 className="text-sm font-semibold text-gray-900 dark:text-white mb-3">Site</h3>
                  <nav className="flex flex-col gap-2">
                    <Link href="/" className="text-sm text-gray-500 dark:text-gray-400 hover:text-gray-900 dark:hover:text-white transition-colors">Home</Link>
                    <Link href="/i" className="text-sm text-gray-500 dark:text-gray-400 hover:text-gray-900 dark:hover:text-white transition-colors">All Articles</Link>
                    <Link href="/support" className="text-sm text-gray-500 dark:text-gray-400 hover:text-gray-900 dark:hover:text-white transition-colors">Support</Link>
                  </nav>
                </div>
              </div>
              <div className="border-t border-gray-200 dark:border-gray-800 pt-6 text-center">
                <p className="text-xs text-gray-400 dark:text-gray-500">© 2026 App</p>
              </div>
            </div>
          </footer>
        </div>
      </div>
    </div>
  );
}
