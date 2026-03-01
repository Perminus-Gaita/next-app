"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { Home, User, Menu } from "lucide-react";
import { useAuth } from "@/lib/auth/client";

interface BottomNavigationProps {
  openLeftSidebar: boolean;
  onToggleSidebar: () => void;
}

export default function BottomNavigation({
  openLeftSidebar,
  onToggleSidebar,
}: BottomNavigationProps) {
  const pathname = usePathname();
  const { user } = useAuth();

  const profileHref = user?.username ? `/${user.username}` : "/";
  const isProfileActive = user?.username
    ? pathname === `/${user.username}`
    : false;

  const isNyumbaniActive = pathname === "/nyumbani" || pathname.startsWith("/j/");

  return (
    <div className="fixed bottom-0 left-0 right-0 h-16 bg-white dark:bg-gray-900 border-t border-gray-200 dark:border-gray-800 flex items-center justify-around md:hidden z-10">
      <Link
        href="/nyumbani"
        className={`flex flex-col items-center justify-center w-1/3 ${
          isNyumbaniActive
            ? "text-blue-600"
            : "text-gray-600 dark:text-gray-400"
        }`}
      >
        <Home className="h-5 w-5" />
        <span className="text-xs mt-1">Nyumbani</span>
      </Link>

      <Link
        href={profileHref}
        className={`flex flex-col items-center justify-center w-1/3 ${
          isProfileActive
            ? "text-blue-600"
            : "text-gray-600 dark:text-gray-400"
        }`}
      >
        <User className="h-5 w-5" />
        <span className="text-xs mt-1">Profile</span>
      </Link>

      <button
        onClick={onToggleSidebar}
        className={`flex flex-col items-center justify-center w-1/3 ${
          openLeftSidebar
            ? "text-blue-600"
            : "text-gray-600 dark:text-gray-400"
        }`}
      >
        <Menu className="h-5 w-5" />
        <span className="text-xs mt-1">More</span>
      </button>
    </div>
  );
}
