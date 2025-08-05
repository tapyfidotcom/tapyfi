"use client";

import React from "react";
import { Sheet, SheetContent, SheetTitle } from "@/components/ui/sheet";
import { VisuallyHidden } from "@radix-ui/react-visually-hidden";
import { cn } from "@/lib/utils";

interface MobileSheetProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  activeTab: string;
  onTabChange: (tab: string) => void;
  children: React.ReactNode;
}

const tabTitles = {
  profile: "Profile Settings",
  design: "Design & Appearance",
  links: "Manage Links",
  analytics: "Analytics & Stats",
};

export default function MobileSheet({
  open,
  onOpenChange,
  activeTab,
  onTabChange,
  children,
}: MobileSheetProps) {
  return (
    <Sheet open={open} onOpenChange={onOpenChange}>
      <SheetContent
        side="bottom"
        className={cn(
          "h-[50vh] rounded-t-2xl border-0 p-0 flex flex-col",
          "bg-white/20 backdrop-blur-xl dark:bg-gray-100/20",
          "shadow-2xl"
        )}
      >
        {/* Hidden title for accessibility */}
        <VisuallyHidden>
          <SheetTitle>
            {tabTitles[activeTab as keyof typeof tabTitles]}
          </SheetTitle>
        </VisuallyHidden>

        {/* Drag Handle */}
        <div className="flex justify-center pt-2 pb-1 flex-shrink-0">
          <div className="w-12 h-1 bg-gray-300 dark:bg-gray-600 rounded-full" />
        </div>

        {/* Scrollable Content Container */}
        <div className="flex-1 overflow-hidden">
          <div className="h-full overflow-y-auto scrollbar-thin scrollbar-thumb-gray-300 dark:scrollbar-thumb-gray-600 scrollbar-track-transparent px-3 py-2">
            {children}
          </div>
        </div>

        {/* Bottom Safe Area */}
        <div className="h-safe-bottom flex-shrink-0" />
      </SheetContent>
    </Sheet>
  );
}
