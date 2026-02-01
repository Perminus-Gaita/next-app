"use client";

import { useState, useEffect, useRef } from 'react';
import MainNavbar from '@/components/navigation/MainNavbar';
import LeftSideBar from '@/components/navigation/LeftSideBar';
import BottomNavigation from '@/components/navigation/BottomNavigation';
import { useMediaQuery } from '@/hooks/useMediaQuery';

interface DeviceWidths {
  mobile: { open: string; closed: string };
  tablet: { open: string; closed: string };
  desktop: { open: string; closed: string };
}

const SIDEBAR_WIDTHS: DeviceWidths = {
  mobile: { open: 'w-64', closed: 'w-0' },
  tablet: { open: 'w-64', closed: 'w-0' },
  desktop: { open: 'w-64', closed: 'w-16' },
};

export default function AppLayout({ children }: { children: React.ReactNode }) {
  const [openLeftSidebar, setOpenLeftSidebar] = useState(false);
  const sidebarRef = useRef<HTMLDivElement>(null);

  const isMobile = useMediaQuery('(max-width:639px)');
  const isTablet = useMediaQuery('(min-width:640px) and (max-width:1023px)');

  useEffect(() => {
    if (!isMobile && !isTablet) {
      setOpenLeftSidebar(true);
    }
  }, [isMobile, isTablet]);

  const toggleSidebar = () => {
    setOpenLeftSidebar(!openLeftSidebar);
  };

  const getSidebarStyles = () => {
    const deviceType = isMobile ? "mobile" : isTablet ? "tablet" : "desktop";
    const state: keyof DeviceWidths[typeof deviceType] = openLeftSidebar ? "open" : "closed";
    
    const sidebarWidth = SIDEBAR_WIDTHS[deviceType][state];
    const marginLeft = deviceType === "desktop" ? (openLeftSidebar ? "ml-64" : "ml-16") : "ml-0";
    
    return {
      sidebar: sidebarWidth,
      content: marginLeft
    };
  };

  return (
    <div className="min-h-screen bg-white dark:bg-gray-900">
      <MainNavbar
        openLeftSidebar={openLeftSidebar}
        onToggleSidebar={toggleSidebar}
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

        {/* Main Content - REMOVED pt-10, pages handle their own padding */}
        <main className={`
          flex-1 px-4 pb-20 md:pb-4 min-h-screen
          transition-all duration-300
          ${getSidebarStyles().content}
        `}>
          {children}
        </main>
      </div>

      <BottomNavigation
        openLeftSidebar={openLeftSidebar}
        onToggleSidebar={toggleSidebar}
      />
    </div>
  );
}
