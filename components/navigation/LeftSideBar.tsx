// components/Navigation/LeftSideBar.tsx
"use client";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { useMediaQuery } from "@/hooks/useMediaQuery";
import { cn } from "@/lib/utils";
import { Home, User, Settings, Headset, LucideIcon } from "lucide-react";

interface NavItemType {
  href: string;
  icon: LucideIcon;
  label: string;
}

interface NavItemProps {
  item: NavItemType;
  isActive: boolean;
  openLeftSidebar: boolean;
  onClose: () => void;
}

const NavItem = ({ item, isActive, openLeftSidebar, onClose }: NavItemProps) => {
  const isMobile = useMediaQuery('(max-width: 639px)');
  const isTablet = useMediaQuery('(min-width: 640px) and (max-width: 1023px)');
  const Icon = item.icon;

  const handleClick = () => {
    if ((isMobile || isTablet) && onClose) {
      onClose();
    }
  };

  return (
    <Link
      href={item.href}
      onClick={handleClick}
      className={cn(
        "flex items-center px-3 h-12 text-sm font-medium hover:bg-gray-100 dark:hover:bg-gray-800",
        isActive ? "bg-gray-100 dark:bg-gray-800 text-blue-600" : "text-gray-700 dark:text-gray-300",
        openLeftSidebar ? "justify-start" : "justify-center"
      )}
    >
      <Icon className="h-5 w-5" />
      {openLeftSidebar && <span className="ml-3">{item.label}</span>}
    </Link>
  );
};

interface LeftSideBarProps {
  openLeftSidebar: boolean;
  onClose: () => void;
}

export default function LeftSideBar({ openLeftSidebar, onClose }: LeftSideBarProps) {
  const pathname = usePathname();

  const navItems: NavItemType[] = [
    { href: "/lobby", icon: Home, label: "Lobby" },
    { href: "/profile", icon: User, label: "Profile" },
    { href: "/support", icon: Headset, label: "Support" },
    { href: "/settings", icon: Settings, label: "Settings" },
  ];

  return (
    <aside className="h-full overflow-y-auto">
      <div className="flex flex-col h-full">
        <div className="flex-1 py-4">
          {navItems.map((item, index) => (
            <NavItem
              key={index}
              item={item}
              isActive={pathname === item.href}
              openLeftSidebar={openLeftSidebar}
              onClose={onClose}
            />
          ))}
        </div>
      </div>
    </aside>
  );
}