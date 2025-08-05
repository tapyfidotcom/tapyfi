"use client";

import React, { useState } from "react";
import { TabsContent } from "@/components/ui/tabs";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
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
    <TabsContent value="links" className="space-y-6">
      {profile && (
        <>
          {/* Main Links Card */}
          <Card className="shadow-lg">
            <CardHeader className="pb-4">
              <div className="flex flex-row items-center justify-between gap-2 sm:gap-4">
                <CardTitle className="flex items-center gap-2">
                  <LinkIcon size={20} />
                  <span>Manage Links</span>
                  <span className="text-sm font-normal text-muted-foreground bg-muted px-2 py-1 rounded-full">
                    {links.length}
                  </span>
                </CardTitle>
                <Button
                  onClick={() => setShowPlatformSelector(true)}
                  size="sm"
                  className="w-auto text-xs px-2 py-1 sm:text-sm sm:px-4 sm:py-2 rounded-full bg-gradient-to-r from-blue-600 to-purple-600 hover:from-blue-700 hover:to-purple-700 shadow-lg hover:shadow-xl transition-all duration-200"
                >
                  <Plus size={12} className="mr-1 sm:mr-2 sm:w-4 sm:h-4" />
                  <span className="hidden xs:inline sm:inline">Add Link</span>
                  <span className="xs:hidden sm:hidden">Add</span>
                </Button>
              </div>

              {/* Stats Card */}
              {links.length > 0 && (
                <div className="grid grid-cols-2 sm:grid-cols-3 gap-4 mt-6">
                  <Card className="bg-gradient-to-br from-blue-50 to-blue-100 dark:from-blue-950 dark:to-blue-900 border-blue-200 dark:border-blue-800">
                    <CardContent className="p-4">
                      <div className="flex items-center gap-3">
                        <div className="p-2 bg-blue-500 rounded-lg">
                          <LinkIcon size={20} className="text-white" />
                        </div>
                        <div>
                          <p className="text-2xl font-bold text-blue-900 dark:text-blue-100">
                            {links.length}
                          </p>
                          <p className="text-sm text-blue-700 dark:text-blue-300">
                            Total Links
                          </p>
                        </div>
                      </div>
                    </CardContent>
                  </Card>

                  <Card className="bg-gradient-to-br from-green-50 to-green-100 dark:from-green-950 dark:to-green-900 border-green-200 dark:border-green-800">
                    <CardContent className="p-4">
                      <div className="flex items-center gap-3">
                        <div className="p-2 bg-green-500 rounded-lg">
                          <BarChart3 size={20} className="text-white" />
                        </div>
                        <div>
                          <p className="text-2xl font-bold text-green-900 dark:text-green-100">
                            {totalClicks}
                          </p>
                          <p className="text-sm text-green-700 dark:text-green-300">
                            Total Clicks
                          </p>
                        </div>
                      </div>
                    </CardContent>
                  </Card>

                  <Card className="bg-gradient-to-br from-purple-50 to-purple-100 dark:from-purple-950 dark:to-purple-900 border-purple-200 dark:border-purple-800 col-span-2 sm:col-span-1">
                    <CardContent className="p-4">
                      <div className="flex items-center gap-3">
                        <div className="p-2 bg-purple-500 rounded-lg">
                          <Eye size={20} className="text-white" />
                        </div>
                        <div>
                          <p className="text-2xl font-bold text-purple-900 dark:text-purple-100">
                            {links.length > 0
                              ? Math.round(totalClicks / links.length)
                              : 0}
                          </p>
                          <p className="text-sm text-purple-700 dark:text-purple-300">
                            Avg per Link
                          </p>
                        </div>
                      </div>
                    </CardContent>
                  </Card>
                </div>
              )}
            </CardHeader>

            <CardContent>
              {links.length === 0 ? (
                <div className="text-center py-16">
                  <div className="mb-6">
                    <div className="mx-auto w-20 h-20 bg-gradient-to-br from-blue-100 to-purple-100 dark:from-blue-900 dark:to-purple-900 rounded-full flex items-center justify-center mb-4">
                      <LinkIcon className="h-10 w-10 text-blue-600 dark:text-blue-400" />
                    </div>
                  </div>
                  <h3 className="text-xl font-semibold text-foreground mb-2">
                    No links added yet
                  </h3>
                  <p className="text-muted-foreground mb-6 max-w-sm mx-auto">
                    Start building your link collection and share all your
                    important content in one place
                  </p>
                  <Button
                    onClick={() => setShowPlatformSelector(true)}
                    className="w-full sm:w-auto rounded-full bg-gradient-to-r from-blue-600 to-purple-600 hover:from-blue-700 hover:to-purple-700 shadow-lg hover:shadow-xl transition-all duration-200"
                  >
                    <Plus size={16} className="mr-2" />
                    Add Your First Link
                  </Button>
                </div>
              ) : (
                <div className="space-y-3">
                  {links
                    .sort((a, b) => a.display_order - b.display_order)
                    .map((link, index) => {
                      const config = platformConfigs[link.platform];
                      const isLoading = loadingLinkId === link.id;

                      return (
                        <div
                          key={link.id}
                          className="group relative overflow-hidden rounded-xl border border-border bg-card hover:bg-accent/50 transition-all duration-200 hover:shadow-lg hover:border-primary/20"
                        >
                          {/* Drag Handle - Hidden on mobile */}
                          <div className="hidden sm:flex absolute left-2 top-1/2 transform -translate-y-1/2 opacity-0 group-hover:opacity-100 transition-opacity">
                            <GripVertical
                              size={16}
                              className="text-muted-foreground cursor-grab"
                            />
                          </div>

                          <div className="flex items-center gap-4 p-4 sm:pl-8">
                            {/* Platform Icon */}
                            <div className="flex-shrink-0 relative">
                              <div className="w-12 h-12 rounded-xl bg-gradient-to-br from-gray-100 to-gray-200 dark:from-gray-800 dark:to-gray-700 flex items-center justify-center shadow-sm">
                                {renderIcon(config?.icon || "🔗", 32)}
                              </div>
                              {/* Order Badge */}
                              <div className="absolute -top-2 -right-2 w-6 h-6 bg-primary text-primary-foreground text-xs rounded-full flex items-center justify-center font-medium">
                                {index + 1}
                              </div>
                            </div>

                            {/* Link Content */}
                            <div className="flex-1 min-w-0">
                              <div className="flex items-start justify-between gap-2">
                                <div className="min-w-0 flex-1">
                                  <h3 className="font-semibold text-foreground truncate text-base">
                                    {link.title}
                                  </h3>
                                  <p className="text-sm text-muted-foreground truncate mt-1">
                                    {link.url}
                                  </p>
                                </div>
                                <a
                                  href={link.url}
                                  target="_blank"
                                  rel="noopener noreferrer"
                                  className="flex-shrink-0 p-1.5 text-muted-foreground hover:text-primary transition-colors rounded-lg hover:bg-accent"
                                >
                                  <ExternalLink size={16} />
                                </a>
                              </div>

                              {/* Stats and Actions */}
                              <div className="flex items-center justify-between mt-3">
                                <div className="flex items-center gap-4">
                                  <div className="flex items-center gap-1.5 text-xs text-muted-foreground bg-muted px-2 py-1 rounded-full">
                                    <BarChart3 size={12} />
                                    <span className="font-medium">
                                      {link.click_count}
                                    </span>
                                    <span>clicks</span>
                                  </div>
                                  <div className="text-xs text-muted-foreground">
                                    #{link.display_order}
                                  </div>
                                </div>

                                {/* Action Buttons */}
                                <div className="flex items-center gap-1">
                                  <Button
                                    variant="ghost"
                                    size="sm"
                                    onClick={() => handleEditLink(link)}
                                    className="h-8 w-8 p-0 rounded-lg hover:bg-blue-100 dark:hover:bg-blue-900 hover:text-blue-600 dark:hover:text-blue-400 transition-colors"
                                    disabled={isLoading}
                                  >
                                    <Edit3 size={14} />
                                  </Button>
                                  <Button
                                    variant="ghost"
                                    size="sm"
                                    onClick={() =>
                                      handleDeleteWithLoading(link.id)
                                    }
                                    className="h-8 w-8 p-0 rounded-lg hover:bg-red-100 dark:hover:bg-red-900 hover:text-red-600 dark:hover:text-red-400 transition-colors"
                                    disabled={isLoading}
                                  >
                                    {isLoading ? (
                                      <Loader2
                                        size={14}
                                        className="animate-spin"
                                      />
                                    ) : (
                                      <Trash2 size={14} />
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
            </CardContent>
          </Card>
        </>
      )}
    </TabsContent>
  );
}
