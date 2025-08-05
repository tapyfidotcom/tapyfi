"use client";

import React from "react";
import { cn } from "@/lib/utils";
import { User, Palette, Link as LinkIcon, BarChart3 } from "lucide-react";

interface BottomNavigationProps {
  activeTab: string;
  onTabSelect: (tab: string) => void;
}

const navigationItems = [
  {
    id: "profile",
    label: "Profile",
    icon: User,
    color: "text-blue-500",
    activeColor: "text-blue-600",
  },
  {
    id: "design",
    label: "Design",
    icon: Palette,
    color: "text-purple-500",
    activeColor: "text-purple-600",
  },
  {
    id: "links",
    label: "Links",
    icon: LinkIcon,
    color: "text-green-500",
    activeColor: "text-green-600",
  },
  {
    id: "analytics",
    label: "Analytics",
    icon: BarChart3,
    color: "text-orange-500",
    activeColor: "text-orange-600",
  },
];

export default function BottomNavigation({
  activeTab,
  onTabSelect,
}: BottomNavigationProps) {
  return (
    <div className="fixed bottom-0 left-0 right-0 z-50 lg:hidden">
      <div className="bg-white/95 backdrop-blur-lg border-t border-gray-200 dark:bg-gray-900/95 dark:border-gray-700 shadow-2xl">
        <div className="grid grid-cols-4 h-14">
          {navigationItems.map((item) => {
            const Icon = item.icon;
            const isActive = activeTab === item.id;

            return (
              <button
                key={item.id}
                onClick={() => onTabSelect(item.id)}
                className={cn(
                  "flex flex-col items-center justify-center space-y-0.5 transition-all duration-200",
                  "hover:bg-gray-50 dark:hover:bg-gray-800 active:scale-95",
                  isActive && "bg-gray-50 dark:bg-gray-800"
                )}
              >
                <Icon
                  size={18}
                  className={cn(
                    "transition-colors duration-200",
                    isActive ? item.activeColor : "text-gray-400"
                  )}
                />
                <span
                  className={cn(
                    "text-xs font-medium transition-colors duration-200",
                    isActive ? item.activeColor : "text-gray-400"
                  )}
                >
                  {item.label}
                </span>
                {isActive && (
                  <div
                    className={cn(
                      "w-6 h-0.5 rounded-full mt-1",
                      item.activeColor.replace("text-", "bg-")
                    )}
                  />
                )}
              </button>
            );
          })}
        </div>
      </div>

      {/* Safe area for iOS devices */}
      <div className="h-safe-bottom bg-white/95 dark:bg-gray-900/95" />
    </div>
  );
}
