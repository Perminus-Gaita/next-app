// components/layouts/AppLayout.tsx
"use client";
import { useRef, useState, useEffect, ReactNode } from "react";
import { useMediaQuery } from "@/hooks/useMediaQuery";
import LeftSideBar from "@/components/navigation/LeftSideBar";
import MainNavbar from "@/components/navigation/MainNavbar";
import BottomNavigation from "@/components/navigation/BottomNavigation";

interface SidebarStyles {
  sidebar: string;
  content: string;
}

interface DeviceWidths {
  open: SidebarStyles;
  closed: SidebarStyles;
}

interface SidebarWidths {
  desktop: DeviceWidths;
  tablet: DeviceWidths;
  mobile: DeviceWidths;
}

const SIDEBAR_WIDTHS: SidebarWidths = {
  desktop: {
    open: { sidebar: "w-60", content: "ml-60" },
    closed: { sidebar: "w-16", content: "ml-16" },
  },
  tablet: {
    open: { sidebar: "w-72", content: "ml-0" },
    closed: { sidebar: "w-0", content: "ml-0" },
  },
  mobile: {
    open: { sidebar: "w-[65%]", content: "ml-0" },
    closed: { sidebar: "w-0", content: "ml-0" },
  },
};

interface AppLayoutProps {
  children: ReactNode;
}

export default function AppLayout({ children }: AppLayoutProps) {
  const isMobile = useMediaQuery('(max-width: 639px)');
  const isTablet = useMediaQuery('(min-width: 640px) and (max-width: 1023px)');
  
  const [openLeftSidebar, setOpenLeftSidebar] = useState<boolean>(true);
  const sidebarRef = useRef<HTMLElement>(null);

  // Dark mode
  useEffect(() => {
    const isDarkMode = localStorage.getItem("theme") === "dark" ||
      (!("theme" in localStorage) && window.matchMedia("(prefers-color-scheme: dark)").matches);
    document.documentElement.classList.toggle("dark", isDarkMode);
  }, []);

  // Close sidebar on click outside (mobile/tablet)
  useEffect(() => {
    if (!isMobile && !isTablet) return;

    const handleClickOutside = (event: MouseEvent) => {
      if (sidebarRef.current && !sidebarRef.current.contains(event.target as Node)) {
        setOpenLeftSidebar(false);
      }
    };

    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, [isMobile, isTablet]);

  const getSidebarStyles = (): SidebarStyles => {
    const deviceType: keyof SidebarWidths = isMobile ? "mobile" : isTablet ? "tablet" : "desktop";
    const state: keyof DeviceWidths = openLeftSidebar ? "open" : "closed";
    return SIDEBAR_WIDTHS[deviceType][state];
  };

  return (
    <div className="min-h-screen bg-white dark:bg-gray-900">
      <MainNavbar
        openLeftSidebar={openLeftSidebar}
        onToggleSidebar={() => setOpenLeftSidebar(!openLeftSidebar)}
      />

      <div className="flex relative">
        {/* Overlay */}
        {openLeftSidebar && (isMobile || isTablet) && (
          <div
            className="fixed inset-0 bg-black/50 z-20"
            onClick={() => setOpenLeftSidebar(false)}
          />
        )}

        {/* Sidebar */}
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

        {/* Main Content */}
        <main className={`
          flex-1 pt-20 px-4 pb-20 md:pb-4 min-h-screen
          transition-all duration-300
          ${getSidebarStyles().content}
        `}>
          {children}
        </main>
      </div>

      <BottomNavigation
        openLeftSidebar={openLeftSidebar}
        onToggleSidebar={() => setOpenLeftSidebar(!openLeftSidebar)}
      />
    </div>
  );
}