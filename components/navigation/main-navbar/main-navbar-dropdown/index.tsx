"use client";
import React, { useEffect, useRef } from 'react';
import { Moon, Sun, LogOut } from 'lucide-react';
import { Switch } from "@/components/ui/switch";

interface MainNavbarDropdownProps {
  isOpen: boolean;
  onClose: () => void;
  user: any;
  theme: 'light' | 'dark';
  onThemeChange: () => void;
  onSignOut: () => void;
}

export default function MainNavbarDropdown({
  isOpen,
  onClose,
  user,
  theme,
  onThemeChange,
  onSignOut
}: MainNavbarDropdownProps) {
  const dropdownRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (!isOpen) return;

    const handleClickOutside = (event: MouseEvent) => {
      if (dropdownRef.current && dropdownRef.current.contains(event.target as Node)) {
        return;
      }

      const triggerButton = document.querySelector('[data-dropdown-trigger]');
      if (triggerButton && triggerButton.contains(event.target as Node)) {
        return;
      }

      onClose();
    };

    const timer = setTimeout(() => {
      document.addEventListener('mousedown', handleClickOutside);
    }, 100);

    return () => {
      clearTimeout(timer);
      document.removeEventListener('mousedown', handleClickOutside);
    };
  }, [isOpen, onClose]);

  if (!isOpen) return null;

  const mode = theme;

  return (
    <div
      ref={dropdownRef}
      className={`fixed top-16 right-4 w-80 ${
        mode === 'dark' ? 'bg-gray-900 border-gray-700' : 'bg-white border-gray-200'
      } rounded-2xl shadow-2xl border z-50`}
    >
      <div className="h-full flex flex-col">
        {/* Profile Section */}
        <div className={`p-4 ${mode === 'dark' ? 'border-gray-700' : 'border-gray-200'} border-b`}>
          <div className="flex items-center justify-between">
            <div className="flex items-center space-x-3">
              <div className="w-10 h-10 rounded-full overflow-hidden bg-gradient-to-r from-pink-500 to-orange-500 flex items-center justify-center">
                {user?.image ? (
                  <img 
                    src={user.image} 
                    alt={user.name} 
                    className="w-full h-full object-cover"
                  />
                ) : (
                  <span className="text-white text-sm font-bold">
                    {user?.name?.charAt(0) || '?'}
                  </span>
                )}
              </div>
              <div>
                <div className={`${mode === 'dark' ? 'text-white' : 'text-gray-900'} font-semibold text-sm`}>
                  {user?.name || 'User'}
                </div>
                <div className={`${mode === 'dark' ? 'text-gray-500' : 'text-gray-600'} text-xs`}>
                  {user?.username ? `@${user.username}` : ''}
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Theme Toggle Section */}
        <div className={`p-3 ${mode === 'dark' ? 'border-gray-700' : 'border-gray-200'} border-b`}>
          <div className="flex items-center justify-between p-2 rounded-lg">
            <div className="flex items-center space-x-3">
              {mode === "light" ? (
                <Sun className={`w-4 h-4 ${mode === 'light' ? 'text-gray-500' : 'text-gray-600'}`} />
              ) : (
                <Moon className={`w-4 h-4 ${mode === 'dark' ? 'text-gray-500' : 'text-gray-600'}`} />
              )}
              <span className={`${mode === 'dark' ? 'text-white' : 'text-gray-900'} text-sm`}>
                Theme
              </span>
            </div>
            <Switch 
              checked={mode === "dark"} 
              onCheckedChange={onThemeChange} 
            />
          </div>
        </div>

        {/* Sign Out Section */}
        <button
          onClick={onSignOut}
          className={`w-full p-3 flex items-center space-x-3 transition-colors ${
            mode === 'dark' ? 'hover:bg-gray-800' : 'hover:bg-red-50'
          }`}
        >
          <div className="p-1 flex items-center space-x-3">
            <LogOut className={`w-4 h-4 ${mode === 'dark' ? 'text-red-400' : 'text-red-600'}`} />
            <span className={`${mode === 'dark' ? 'text-red-400' : 'text-red-600'} text-sm`}>
              Log out
            </span>
          </div>
        </button>
      </div>
    </div>
  );
}
