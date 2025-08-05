"use client";

import React, { useState } from "react";
import { TabsContent } from "@/components/ui/tabs";
import { Button } from "@/components/ui/button";
import { LinktreeProfile, LinktreeLink } from "@/interfaces/linktree";
import { platformConfigs } from "@/lib/platform-configs";
import {
  Link as LinkIcon,
  Plus,
  Edit3,
  Trash2,
  Loader2,
  BarChart3,
  ExternalLink,
  GripVertical,
  Eye,
} from "lucide-react";
import Image from "next/image";

interface LinksTabProps {
  profile: LinktreeProfile | null;
  links: LinktreeLink[];
  setShowPlatformSelector: (show: boolean) => void;
  handleEditLink: (link: LinktreeLink) => void;
  handleDeleteLink: (linkId: number) => void;
}

export default function LinksTab({
  profile,
  links,
  setShowPlatformSelector,
  handleEditLink,
  handleDeleteLink,
}: LinksTabProps) {
  const [loadingLinkId, setLoadingLinkId] = useState<number | null>(null);

  const handleDeleteWithLoading = async (linkId: number) => {
    setLoadingLinkId(linkId);
    try {
      await handleDeleteLink(linkId);
    } finally {
      setLoadingLinkId(null);
    }
  };

  // Function to render icon (image or emoji)
  const renderIcon = (icon: string, size: number = 24) => {
    if (typeof icon === "string" && icon.startsWith("/assets/")) {
      return (
        <Image
          src={icon}
          alt="Platform icon"
          width={size}
          height={size}
          className="object-contain"
        />
      );
    }
    return <span className={`text-${size === 32 ? "2xl" : "xl"}`}>{icon}</span>;
  };

  const totalClicks = links.reduce((sum, link) => sum + link.click_count, 0);

  return (
    <TabsContent value="links" className="space-y-4">
      {profile && (
        <div className="space-y-4">
          {/* Header with title and add button - Same as Mobile Sheet style */}
          <div className="flex items-center justify-between pb-4 border-b border-gray-200/50 dark:border-gray-700/50">
            <div className="flex items-center gap-2">
              <LinkIcon size={18} className="text-primary" />
              <h2 className="text-lg font-semibold text-gray-900 dark:text-gray-100">Manage Links</h2>
              <span className="text-xs font-normal text-gray-700 dark:text-gray-300 bg-white/30 dark:bg-gray-100/30 backdrop-blur-sm px-2 py-1 rounded-full border border-white/20 dark:border-gray-300/20">
                {links.length}
              </span>
            </div>
            <Button
              onClick={() => setShowPlatformSelector(true)}
              size="sm"
              className="h-8 px-3 text-xs rounded-full bg-gradient-to-r from-blue-600 to-purple-600 hover:from-blue-700 hover:to-purple-700 shadow-md hover:shadow-lg transition-all duration-200 text-white font-medium"
            >
              <Plus size={12} className="mr-1" />
              <span className="hidden xs:inline sm:inline">Add Link</span>
              <span className="xs:hidden sm:hidden">Add</span>
            </Button>
          </div>

          {/* Stats Cards - Matching Mobile Sheet Glass Effect */}
          {links.length > 0 && (
            <div className="grid grid-cols-2 sm:grid-cols-3 gap-3 mb-4">
              <div className="bg-white/80 dark:bg-gray-800 backdrop-blur-xl border border-blue-200/40 dark:border-blue-300/40 rounded-lg p-3 shadow-lg">
                <div className="flex items-center gap-2">
                  <div className="p-1.5 bg-blue-500 rounded-lg shadow-sm">
                    <LinkIcon size={14} className="text-white" />
                  </div>
                  <div>
                    <p className="text-lg font-bold text-gray-900 dark:text-gray-100">
                      {links.length}
                    </p>
                    <p className="text-xs text-gray-700 dark:text-gray-300 font-medium">
                      Total Links
                    </p>
                  </div>
                </div>
              </div>

              <div className="bg-white/80 dark:bg-gray-800 backdrop-blur-xl border border-green-200/40 dark:border-green-300/40 rounded-lg p-3 shadow-lg">
                <div className="flex items-center gap-2">
                  <div className="p-1.5 bg-green-500 rounded-lg shadow-sm">
                    <BarChart3 size={14} className="text-white" />
                  </div>
                  <div>
                    <p className="text-lg font-bold text-gray-900 dark:text-gray-100">
                      {totalClicks}
                    </p>
                    <p className="text-xs text-gray-700 dark:text-gray-300 font-medium">
                      Total Clicks
                    </p>
                  </div>
                </div>
              </div>

              <div className="bg-white/80 dark:bg-gray-800 backdrop-blur-xl border border-purple-200/40 dark:border-purple-300/40 rounded-lg p-3 shadow-lg col-span-2 sm:col-span-1">
                <div className="flex items-center gap-2">
                  <div className="p-1.5 bg-purple-500 rounded-lg shadow-sm">
                    <Eye size={14} className="text-white" />
                  </div>
                  <div>
                    <p className="text-lg font-bold text-gray-900 dark:text-gray-100">
                      {links.length > 0
                        ? Math.round(totalClicks / links.length)
                        : 0}
                    </p>
                    <p className="text-xs text-gray-700 dark:text-gray-300 font-medium">
                      Avg per Link
                    </p>
                  </div>
                </div>
              </div>
            </div>
          )}

          {/* Links Content */}
          <div className="flex-1 overflow-y-auto">
            {links.length === 0 ? (
              <div className="text-center py-12">
                <div className="mx-auto w-16 h-16 bg-white/80 dark:bg-gray-800 backdrop-blur-xl rounded-full flex items-center justify-center mb-4 border border-white/20 dark:border-gray-300/20 shadow-lg">
                  <LinkIcon className="h-8 w-8 text-blue-600 dark:text-blue-400" />
                </div>
                <h3 className="text-lg font-semibold mb-2 text-gray-900 dark:text-gray-100">No links added yet</h3>
                <p className="text-sm text-gray-700 dark:text-gray-300 mb-4 font-medium">
                  Start building your link collection and share all your important content in one place
                </p>
                <Button
                  onClick={() => setShowPlatformSelector(true)}
                  className="w-full sm:w-auto rounded-full bg-gradient-to-r from-blue-600 to-purple-600 hover:from-blue-700 hover:to-purple-700 shadow-lg hover:shadow-xl transition-all duration-200 text-white font-medium"
                >
                  <Plus size={16} className="mr-2" />
                  Add Your First Link
                </Button>
              </div>
            ) : (
              <div className="space-y-2">
                {links
                  .sort((a, b) => a.display_order - b.display_order)
                  .map((link, index) => {
                    const config = platformConfigs[link.platform];
                    const isLoading = loadingLinkId === link.id;

                    return (
                      <div
                        key={link.id}
                        className="group relative overflow-hidden rounded-lg border border-white/20 dark:border-gray-300/20 bg-white/80 dark:bg-gray-800 backdrop-blur-xl hover:bg-white/30 dark:hover:bg-gray-100/30 transition-all duration-200 hover:shadow-lg hover:border-primary/40 shadow-md"
                      >
                        {/* Drag Handle - Hidden on mobile */}
                        <div className="hidden sm:flex absolute left-2 top-1/2 transform -translate-y-1/2 opacity-0 group-hover:opacity-100 transition-opacity">
                          <GripVertical
                            size={14}
                            className="text-gray-600 dark:text-gray-400 cursor-grab"
                          />
                        </div>

                        <div className="flex items-center gap-3 lg:gap-4 p-3 lg:p-4 sm:pl-6 lg:pl-8">
                          {/* Platform Icon */}
                          <div className="flex-shrink-0 relative">
                            <div className="w-10 h-10 lg:w-12 lg:h-12 rounded-lg lg:rounded-xl bg-white/30 dark:bg-gray-100/30 backdrop-blur-sm flex items-center justify-center shadow-sm border border-white/20 dark:border-gray-300/20">
                              {renderIcon(config?.icon || "🔗", 24)}
                            </div>
                            {/* Order Badge */}
                            <div className="absolute -top-1 -right-1 lg:-top-2 lg:-right-2 w-5 h-5 lg:w-6 lg:h-6 bg-primary text-primary-foreground text-xs rounded-full flex items-center justify-center font-medium shadow-sm">
                              {index + 1}
                            </div>
                          </div>

                          {/* Link Content */}
                          <div className="flex-1 min-w-0">
                            <div className="flex items-start justify-between gap-2">
                              <div className="min-w-0 flex-1">
                                <h3 className="font-semibold text-gray-900 dark:text-gray-100 truncate text-sm lg:text-base">
                                  {link.title}
                                </h3>
                                <p className="text-xs lg:text-sm text-gray-700 dark:text-gray-300 truncate mt-0.5 lg:mt-1">
                                  {link.url}
                                </p>
                              </div>
                              <a
                                href={link.url}
                                target="_blank"
                                rel="noopener noreferrer"
                                className="flex-shrink-0 p-1 lg:p-1.5 text-gray-800 dark:text-gray-800 hover:text-primary transition-colors rounded-lg hover:bg-white/30 dark:hover:bg-gray-100/30 backdrop-blur-sm"
                              >
                                <ExternalLink size={14} className="lg:w-4 lg:h-4" />
                              </a>
                            </div>

                            {/* Stats and Actions */}
                            <div className="flex items-center justify-between mt-2 lg:mt-3">
                              <div className="flex items-center gap-3 lg:gap-4">
                                <div className="flex items-center gap-1 text-xs text-gray-800 dark:text-gray-800 bg-white/20 dark:bg-gray-100/30 backdrop-blur-sm px-2 py-0.5 lg:py-1 rounded-full border border-white/20 dark:border-gray-300/20 font-medium">
                                  <BarChart3 size={10} className="lg:w-3 lg:h-3" />
                                  <span className="font-medium">
                                    {link.click_count}
                                  </span>
                                  <span>clicks</span>
                                </div>
                                <div className="text-xs text-gray-800 dark:text-gray-800 font-medium">
                                  #{link.display_order}
                                </div>
                              </div>

                              {/* Action Buttons */}
                              <div className="flex items-center gap-1">
                                <Button
                                  variant="ghost"
                                  size="sm"
                                  onClick={() => handleEditLink(link)}
                                  className="h-7 w-7 lg:h-8 lg:w-8 p-0 rounded-lg hover:bg-blue-100/60 dark:hover:bg-blue-200/60 hover:text-blue-700 dark:hover:text-blue-800 transition-colors backdrop-blur-sm text-gray-800 dark:text-gray-800"
                                  disabled={isLoading}
                                >
                                  <Edit3 size={12} className="lg:w-3.5 lg:h-3.5" />
                                </Button>
                                <Button
                                  variant="ghost"
                                  size="sm"
                                  onClick={() =>
                                    handleDeleteWithLoading(link.id)
                                  }
                                  className="h-7 w-7 lg:h-8 lg:w-8 p-0 rounded-lg hover:bg-red-100/60 dark:hover:bg-red-200/60 hover:text-red-700 dark:hover:text-red-800 transition-colors backdrop-blur-sm text-gray-800 dark:text-gray-800"
                                  disabled={isLoading}
                                >
                                  {isLoading ? (
                                    <Loader2
                                      size={12}
                                      className="lg:w-3.5 lg:h-3.5 animate-spin"
                                    />
                                  ) : (
                                    <Trash2 size={12} className="lg:w-3.5 lg:h-3.5" />
                                  )}
                                </Button>
                              </div>
                            </div>
                          </div>
                        </div>
                      </div>
                    );
                  })}
              </div>
            )}
          </div>
        </div>
      )}
    </TabsContent>
  );
}
