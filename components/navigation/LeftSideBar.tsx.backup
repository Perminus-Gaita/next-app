"use client";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { useMediaQuery } from "@/hooks/useMediaQuery";
import { cn } from "@/lib/utils";
import { Home, User, Settings, Headset, Target, MessagesSquare, LucideIcon } from "lucide-react";
import { useState } from "react";
import ChatsView from "./chats/ChatsView";

interface NavItemType {
  href?: string;
  icon: LucideIcon;
  label: string;
  onClick?: () => void;
}

interface NavItemProps {
  item: NavItemType;
  isActive: boolean;
  openLeftSidebar: boolean;
  onClose: () => void;
}

const NavItem = ({ item, isActive, openLeftSidebar, onClose }: NavItemProps) => {
  const isMobile = useMediaQuery('(max-width:639px)');
  const isTablet = useMediaQuery('(min-width:640px) and (max-width:1023px)');
  const Icon = item.icon;

  const handleClick = () => {
    if (item.onClick) {
      item.onClick();
    }
    if ((isMobile || isTablet) && onClose) {
      onClose();
    }
  };

  const content = (
    <>
      <Icon className="h-5 w-5 shrink-0" />
      <span 
        className={cn(
          "whitespace-nowrap transition-all duration-300 ease-in-out",
          openLeftSidebar 
            ? "opacity-100 ml-3 max-w-xs" 
            : "opacity-0 ml-0 max-w-0"
        )}
      >
        {item.label}
      </span>
    </>
  );

  const className = cn(
    "flex items-center justify-start h-12 text-sm font-medium hover:bg-gray-100 dark:hover:bg-gray-800 overflow-hidden transition-all duration-300 ease-in-out",
    isActive
      ? "bg-gray-100 dark:bg-gray-800 text-blue-600"
      : "text-gray-700 dark:text-gray-300",
    openLeftSidebar ? "px-3" : "pl-[1.375rem]"
  );

  if (item.href) {
    return (
      <Link href={item.href} onClick={handleClick} className={className}>
        {content}
      </Link>
    );
  }

  return (
    <button onClick={handleClick} className={cn(className, "w-full")}>
      {content}
    </button>
  );
};

interface LeftSideBarProps {
  openLeftSidebar: boolean;
  onClose: () => void;
}

export default function LeftSideBar({ openLeftSidebar, onClose }: LeftSideBarProps) {
  const pathname = usePathname();
  const [showChats, setShowChats] = useState(false);

  const topNavItems: NavItemType[] = [
    { href: "/nyumbani", icon: Home, label: "Nyumbani" },
    { 
      icon: MessagesSquare, 
      label: "Chats",
      onClick: () => setShowChats(true)
    },
    { href: "/profile", icon: User, label: "Profile" },
    { href: "/strategies", icon: Target, label: "Strategies" },
  ];

  const bottomNavItems: NavItemType[] = [
    { href: "/support", icon: Headset, label: "Support" },
    { href: "/settings", icon: Settings, label: "Settings" },
  ];

  if (showChats) {
    return (
      <ChatsView 
        openLeftSidebar={openLeftSidebar} 
        onClose={() => setShowChats(false)} 
      />
    );
  }

  return (
    <aside className="h-full overflow-y-auto overflow-x-hidden">
      <div className="flex flex-col h-full">
        <div className="flex-1 py-4">
          {topNavItems.map((item, index) => (
            <NavItem
              key={index}
              item={item}
              isActive={item.href ? pathname === item.href : false}
              openLeftSidebar={openLeftSidebar}
              onClose={onClose}
            />
          ))}
        </div>

        <div className="py-4 border-t border-gray-200 dark:border-gray-800">
          {bottomNavItems.map((item, index) => (
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
