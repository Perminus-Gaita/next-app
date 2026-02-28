"use client";

import { useState, useEffect, useRef } from "react";
import Link from "next/link";
import MainNavbar from "@/components/navigation/main-navbar/index";
import LeftSideBar from "@/components/navigation/LeftSideBar";
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
      <MainNavbar openLeftSidebar={openLeftSidebar} onToggleSidebar={toggleSidebar} />

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
          <LeftSideBar
            openLeftSidebar={openLeftSidebar}
            onClose={() => setOpenLeftSidebar(false)}
          />
        </aside>

        <div className={`
          flex-1 transition-all duration-300
          ${getSidebarStyles().content}
        `}>
          <div className="max-w-4xl mx-auto px-4 pt-14 pb-12">
            {children}
          </div>

          <footer className="border-t border-gray-200 dark:border-gray-800 mt-8">
            <div className="max-w-4xl mx-auto px-4 py-12">
              <div className="grid grid-cols-2 md:grid-cols-4 gap-8 mb-8">
                <div>
                  <h3 className="text-sm font-semibold text-gray-900 dark:text-white mb-3">Guides</h3>
                  <nav className="flex flex-col gap-2">
                    <Link href="/i" className="text-sm text-gray-500 dark:text-gray-400 hover:text-gray-900 dark:hover:text-white transition-colors">All Articles</Link>
                  </nav>
                </div>
                <div>
                  <h3 className="text-sm font-semibold text-gray-900 dark:text-white mb-3">Resources</h3>
                  <nav className="flex flex-col gap-2">
                    <Link href="/support" className="text-sm text-gray-500 dark:text-gray-400 hover:text-gray-900 dark:hover:text-white transition-colors">Support</Link>
                  </nav>
                </div>
              </div>

              <div className="border-t border-gray-200 dark:border-gray-800 pt-6 text-center">
                <Link href="/" className="text-sm font-medium text-gray-900 dark:text-white hover:text-blue-600 dark:hover:text-blue-400 transition-colors">
                  Zeqqat
                </Link>
                <p className="text-sm text-gray-500 dark:text-gray-400 mt-1">
                  Test your jackpot picks risk free.
                </p>
                <p className="text-xs text-gray-600 dark:text-gray-500 mt-3">
                  &copy; {new Date().getFullYear()} Zeqqat. All rights reserved.
                </p>
              </div>
            </div>
          </footer>
        </div>
      </div>
    </div>
  );
}
