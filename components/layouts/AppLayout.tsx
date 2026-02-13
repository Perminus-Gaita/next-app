"use client";

import { useState, useEffect, useRef } from "react";
import { usePathname } from "next/navigation";
import LeftSideBar from "@/components/navigation/LeftSideBar";
import BlogNavbar from "@/components/blog/BlogNavbar";
import BottomNavigation from "@/components/navigation/BottomNavigation";
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

interface AppLayoutProps {
  children: React.ReactNode;
}

export default function AppLayout({ children }: AppLayoutProps) {
  const pathname = usePathname();
  const [openLeftSidebar, setOpenLeftSidebar] = useState(false);
  const sidebarRef = useRef<HTMLDivElement>(null);

  const isMobile = useMediaQuery("(max-width:639px)");
  const isTablet = useMediaQuery("(min-width:640px) and (max-width:1023px)");

  // Check if current page is a chat page (needs full height, no extra padding)
  const isChatPage = pathname?.startsWith("/chat");

  const toggleSidebar = () => setOpenLeftSidebar(!openLeftSidebar);

  // Set dark theme as default
  useEffect(() => {
    const savedTheme = localStorage.getItem("theme");
    if (!savedTheme) {
      localStorage.setItem("theme", "dark");
      document.documentElement.classList.add("dark");
    } else {
      document.documentElement.classList.toggle("dark", savedTheme === "dark");
    }
  }, []);

  const getSidebarStyles = () => {
    const deviceType = isMobile ? "mobile" : isTablet ? "tablet" : "desktop";
    const state: keyof DeviceWidths[typeof deviceType] = openLeftSidebar ? "open" : "closed";
    const sidebarWidth = SIDEBAR_WIDTHS[deviceType][state];
    const marginLeft = deviceType === "desktop" ? (openLeftSidebar ? "ml-64" : "ml-16") : "ml-0";
    return { sidebar: sidebarWidth, content: marginLeft };
  };

  return (
    <div className="min-h-screen bg-white dark:bg-gray-900">
      <BlogNavbar openLeftSidebar={openLeftSidebar} onToggleSidebar={toggleSidebar} />

      <div className="flex relative">
        {openLeftSidebar && (isMobile || isTablet) && (
          <div
            className="fixed inset-0 bg-black/50 z-20"
            onClick={() => setOpenLeftSidebar(false)}
          />
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

        <main className={`
          flex-1 pt-12 min-h-screen relative
          transition-all duration-300
          ${getSidebarStyles().content}
          ${isChatPage ? "" : "px-4 pb-20 md:pb-4"}
        `}>
          {children}
        </main>
      </div>

      {!isChatPage && (
        <BottomNavigation
          openLeftSidebar={openLeftSidebar}
          onToggleSidebar={toggleSidebar}
        />
      )}
    </div>
  );
}
