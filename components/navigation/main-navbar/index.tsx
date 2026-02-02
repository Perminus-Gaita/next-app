"use client";
import Link from "next/link";
import Image from "next/image";
import { useMediaQuery } from "@/hooks/useMediaQuery";
import { Menu, X, Sun, Moon, ScrollText } from "lucide-react";
import { Button } from "@/components/ui/button";
import { useState, useEffect } from "react";
import { useAuthModal } from '@/lib/stores/auth-modal-store';
import { authClient } from '@/lib/auth/client';
import MainNavbarDropdown from './main-navbar-dropdown';
import { usePicksStore } from "@/lib/stores/picks-store";

interface MainNavbarProps {
  openLeftSidebar: boolean;
  onToggleSidebar: () => void;
}

type Theme = "light" | "dark";

export default function MainNavbar({ openLeftSidebar, onToggleSidebar }: MainNavbarProps) {
  const isMobile = useMediaQuery('(max-width: 639px)');
  const [theme, setTheme] = useState<Theme>("light");
  const { openAuthModal } = useAuthModal();
  const [user, setUser] = useState<any>(null);
  const [loading, setLoading] = useState(true);
  const [dropdownOpen, setDropdownOpen] = useState(false);
  
  // Picks store
  const { picks, isDrawerOpen, toggleDrawer } = usePicksStore();
  const picksCount = picks.length;

  useEffect(() => {
    const savedTheme = (localStorage.getItem("theme") as Theme) || "light";
    setTheme(savedTheme);
    document.documentElement.classList.toggle("dark", savedTheme === "dark");
  }, []);

  useEffect(() => {
    authClient.getSession().then(session => {
      setUser(session?.data?.user || null);
      setLoading(false);
    });
  }, []);

  const toggleTheme = () => {
    const newTheme: Theme = theme === "light" ? "dark" : "light";
    setTheme(newTheme);
    localStorage.setItem("theme", newTheme);
    document.documentElement.classList.toggle("dark", newTheme === "dark");
  };

  const handleSignOut = async () => {
    try {
      const result = await authClient.signOut();
      if (result.error) {
        console.error('Sign out error:', result.error.message);
      } else {
        setUser(null);
        setDropdownOpen(false);
        window.location.href = '/';
      }
    } catch (error) {
      console.error('Sign out failed:', error);
    }
  };

  return (
    <header className="fixed top-0 w-full h-12 flex items-center justify-between px-4 bg-white dark:bg-gray-900 border-b border-gray-200 dark:border-gray-800 z-50">
      <div className="flex items-center gap-4">
        <Button
          variant="ghost"
          size="icon"
          onClick={onToggleSidebar}
          className="h-8 w-8"
        >
          {openLeftSidebar ? <X className="h-5 w-5" /> : <Menu className="h-5 w-5" />}
        </Button>

        {!isMobile && (
          <Link href="/">
            <Image src="/logo.png" alt="Logo" width={32} height={32} />
          </Link>
        )}
      </div>

      <h1 className="text-sm font-semibold">My App</h1>

      <div className="flex items-center gap-2">
        {/* Picks Button - Only show on desktop */}
        {!isMobile && (
          <button
            onClick={toggleDrawer}
            disabled={isDrawerOpen}
            className={`flex items-center gap-2 px-3 py-1.5 rounded-lg border border-dashed transition-colors ${
              isDrawerOpen
                ? "bg-gray-100 dark:bg-gray-800 text-gray-400 dark:text-gray-600 border-gray-300 dark:border-gray-700 cursor-not-allowed"
                : "bg-gray-200 dark:bg-gray-800 text-gray-700 dark:text-gray-300 border-gray-400 dark:border-gray-600 hover:bg-gray-300 dark:hover:bg-gray-700"
            }`}
          >
            <ScrollText className="h-4 w-4" />
            <div className="flex items-center">
              <span className="text-sm font-bold">PICKS:</span>
              <span
                className={`text-sm font-bold ml-1 ${
                  picksCount > 0 && !isDrawerOpen ? "text-yellow-500" : ""
                }`}
                style={
                  picksCount > 0 && !isDrawerOpen
                    ? { animation: "customPulse 2s infinite" }
                    : {}
                }
              >
                {picksCount}
              </span>
            </div>
          </button>
        )}

        <Button variant="ghost" size="icon" onClick={toggleTheme} className="h-8 w-8">
          {theme === "light" ? <Moon className="h-4 w-4" /> : <Sun className="h-4 w-4" />}
        </Button>

        {loading ? (
          <div className="w-8 h-8" /> 
        ) : user ? (
          <div className="relative">
            <button
              onClick={() => setDropdownOpen(!dropdownOpen)}
              data-dropdown-trigger
              className="w-8 h-8 rounded-full overflow-hidden bg-linear-to-r from-pink-500 to-orange-500 flex items-center justify-center hover:opacity-80 transition-opacity"
            >
              {user.image ? (
                <img 
                  src={user.image} 
                  alt={user.name || 'User'} 
                  className="w-full h-full object-cover"
                />
              ) : (
                <span className="text-white text-xs font-bold">
                  {user.name?.charAt(0) || '?'}
                </span>
              )}
            </button>

            <MainNavbarDropdown 
              isOpen={dropdownOpen}
              onClose={() => setDropdownOpen(false)}
              user={user}
              theme={theme}
              onThemeChange={toggleTheme}
              onSignOut={handleSignOut}
            />
          </div>
        ) : (
          <Button
            variant="ghost"
            size="sm"
            onClick={() => openAuthModal('login')}
            className="h-8 text-sm"
          >
            Sign In
          </Button>
        )}
      </div>

      <style jsx global>{`
        @keyframes customPulse {
          0%, 100% {
            opacity: 1;
          }
          50% {
            opacity: 0.5;
          }
        }
      `}</style>
    </header>
  );
}
