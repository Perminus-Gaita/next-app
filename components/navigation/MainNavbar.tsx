// components/Navigation/MainNavbar.tsx
"use client";
import Link from "next/link";
import Image from "next/image";
import { useMediaQuery } from "@/hooks/useMediaQuery";
import { Menu, X, Sun, Moon } from "lucide-react";
import { Button } from "@/components/ui/button";
import { useState, useEffect } from "react";

interface MainNavbarProps {
  openLeftSidebar: boolean;
  onToggleSidebar: () => void;
}

type Theme = "light" | "dark";

export default function MainNavbar({ openLeftSidebar, onToggleSidebar }: MainNavbarProps) {
  const isMobile = useMediaQuery('(max-width: 639px)');
  const [theme, setTheme] = useState<Theme>("light");

  useEffect(() => {
    const savedTheme = (localStorage.getItem("theme") as Theme) || "light";
    setTheme(savedTheme);
  }, []);

  const toggleTheme = () => {
    const newTheme: Theme = theme === "light" ? "dark" : "light";
    setTheme(newTheme);
    localStorage.setItem("theme", newTheme);
    document.documentElement.classList.toggle("dark", newTheme === "dark");
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

      <Button variant="ghost" size="icon" onClick={toggleTheme} className="h-8 w-8">
        {theme === "light" ? <Moon className="h-4 w-4" /> : <Sun className="h-4 w-4" />}
      </Button>
    </header>
  );
}