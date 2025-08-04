"use client";

import React, { useState, useRef, useEffect } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import BackgroundWrapper from "@/components/ui/background-wrapper";
import EnhancedProfilePicture from "@/components/ui/enhanced-profile-picture";
import { LinktreeProfile, LinktreeLink } from "@/interfaces/linktree";
import {
  ProfileFormData,
  BackgroundSettings,
  getPrimaryColor,
} from "@/types/profile";
import { platformConfigs } from "@/lib/platform-configs";
import {
  Eye,
  ExternalLink,
  BarChart3,
  User,
  RefreshCw,
  Maximize2,
  Minimize2,
  Sparkles,
  TrendingUp,
  X,
  Loader2,
} from "lucide-react";
import Image from "next/image";

interface PreviewSidebarProps {
  profile: LinktreeProfile | null;
  profileForm: ProfileFormData;
  backgroundSettings: BackgroundSettings;
  links: LinktreeLink[];
}

export default function PreviewSidebar({
  profile,
  profileForm,
  backgroundSettings,
  links,
}: PreviewSidebarProps) {
  const [refreshKey, setRefreshKey] = useState(0);
  const [isFullscreen, setIsFullscreen] = useState(false);
  const [loadingLinkId, setLoadingLinkId] = useState<number | null>(null);
  const previewRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    setRefreshKey((prev) => prev + 1);
  }, [backgroundSettings]);

  const handleRefresh = () => {
    setRefreshKey((prev) => prev + 1);

    if (previewRef.current) {
      previewRef.current.style.opacity = "0.7";
      setTimeout(() => {
        if (previewRef.current) {
          previewRef.current.style.opacity = "1";
        }
      }, 200);
    }
  };

  const handleLinkClick = async (link: LinktreeLink) => {
    setLoadingLinkId(link.id);
    try {
      await new Promise((resolve) => setTimeout(resolve, 300)); // Reduced delay
      window.open(link.url, "_blank", "noopener,noreferrer");
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
    return (
      <span className={isFullscreen ? "text-2xl" : "text-xl lg:text-2xl"}>
        {icon}
      </span>
    );
  };

  const getContrastColor = (
    bgColor: string | string[],
    textColor: string = "#ffffff"
  ): string => {
    try {
      const primaryColor = getPrimaryColor(bgColor);

      if (backgroundSettings.type === "solid") {
        const hex = primaryColor.replace("#", "");
        const r = parseInt(hex.substr(0, 2), 16);
        const g = parseInt(hex.substr(2, 2), 16);
        const b = parseInt(hex.substr(4, 2), 16);
        const brightness = (r * 299 + g * 587 + b * 114) / 1000;

        if (brightness > 128) {
          return textColor === "#000000" ? "#1a1a1a" : textColor;
        }
      }
      return textColor;
    } catch {
      return "#ffffff";
    }
  };

  const getThemeColor = (): string => {
    return profileForm?.theme_color || profile?.theme_color || "#10b981";
  };

  const contrastTextColor = getContrastColor(
    backgroundSettings.color,
    profileForm?.text_color || "#ffffff"
  );

  const getBackgroundDisplayName = () => {
    switch (backgroundSettings.type) {
      case "solid":
        return "Solid Color";
      case "hyperspeed":
        return "Hyperspeed";
      case "silk":
        return "Silk";
      case "squares":
        return "Animated Squares";
      case "iridescence":
        return "Iridescence";
      default:
        return "Unknown";
    }
  };

  const getBackgroundIcon = () => {
    switch (backgroundSettings.type) {
      case "hyperspeed":
        return "🚀";
      case "silk":
        return "✨";
      case "squares":
        return "⬜";
      case "iridescence":
        return "🌈";
      default:
        return "🎨";
    }
  };

  if (!profile && !profileForm?.username) {
    return (
      <div className="w-full">
        <div className="sticky top-4 lg:top-6">
          <Card className="overflow-hidden border-2 border-dashed border-gray-200 dark:border-gray-700 bg-gradient-to-br from-gray-50 to-gray-100 dark:from-gray-800 dark:to-gray-900">
            <CardContent className="p-6 lg:p-8 text-center">
              <div className="animate-pulse">
                <User className="mx-auto h-12 w-12 lg:h-16 lg:w-16 text-gray-300 dark:text-gray-600 mb-4 lg:mb-6" />
                <div className="space-y-3">
                  <div className="h-4 bg-gray-200 dark:bg-gray-700 rounded w-3/4 mx-auto"></div>
                  <div className="h-3 bg-gray-200 dark:bg-gray-700 rounded w-1/2 mx-auto"></div>
                </div>
              </div>
              <p className="text-muted-foreground text-sm dark:text-gray-400 mt-4">
                Create your profile to see the live preview
              </p>
            </CardContent>
          </Card>
        </div>
      </div>
    );
  }

  return (
    <div className="w-full">
      <div className="sticky top-4 lg:top-6">
        <Card className="overflow-hidden shadow-xl border-0 bg-white/90 dark:bg-gray-900/90 backdrop-blur-sm">
          {/* Compact Header */}
          <CardHeader className="pb-2 lg:pb-3 border-b border-gray-100 dark:border-gray-800 bg-gradient-to-r from-indigo-50 to-purple-50 dark:from-gray-800 dark:to-gray-900">
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-2 lg:gap-3">
                <div className="relative">
                  <Eye
                    size={16}
                    className="lg:w-5 lg:h-5 text-indigo-600 dark:text-indigo-400"
                  />
                  <Sparkles
                    size={8}
                    className="lg:w-3 lg:h-3 absolute -top-1 -right-1 text-purple-500 animate-pulse"
                  />
                </div>
                <div>
                  <CardTitle className="text-base lg:text-lg font-bold bg-gradient-to-r from-indigo-600 to-purple-600 bg-clip-text text-transparent">
                    Live Preview
                  </CardTitle>
                  <p className="text-xs text-muted-foreground">
                    Real-time updates
                  </p>
                </div>
              </div>
              <div className="flex items-center gap-1">
                <Button
                  variant="ghost"
                  size="sm"
                  className="p-1.5 lg:p-2 h-7 w-7 lg:h-8 lg:w-8 hover:bg-indigo-100 dark:hover:bg-gray-700 transition-colors"
                  onClick={() => setIsFullscreen(!isFullscreen)}
                  title={
                    isFullscreen ? "Exit Fullscreen" : "Fullscreen Preview"
                  }
                >
                  {isFullscreen ? (
                    <Minimize2 size={12} className="lg:w-4 lg:h-4" />
                  ) : (
                    <Maximize2 size={12} className="lg:w-4 lg:h-4" />
                  )}
                </Button>
                <Button
                  variant="ghost"
                  size="sm"
                  className="p-1.5 lg:p-2 h-7 w-7 lg:h-8 lg:w-8 hover:bg-indigo-100 dark:hover:bg-gray-700 transition-colors"
                  onClick={handleRefresh}
                  title="Refresh Preview"
                >
                  <RefreshCw
                    size={12}
                    className={`lg:w-4 lg:h-4 ${
                      refreshKey > 0 ? "animate-spin" : ""
                    }`}
                  />
                </Button>
              </div>
            </div>
          </CardHeader>

          <CardContent className="p-0">
            {/* OPTIMIZED: Larger preview container with better aspect ratio */}
            <div
              ref={previewRef}
              key={`${refreshKey}-${JSON.stringify(backgroundSettings)}`}
              className={`relative transition-all duration-500 ease-in-out ${
                isFullscreen
                  ? "fixed inset-0 z-50"
                  : "aspect-[9/16] h-[500px] sm:h-[600px] lg:h-[750px] xl:h-[800px]" // INCREASED SIZE
              }`}
            >
              {/* Background Layer */}
              <div className="absolute inset-0 overflow-hidden">
                <BackgroundWrapper settings={backgroundSettings} />
              </div>

              {/* Enhanced Readability Overlay */}
              {backgroundSettings.type !== "solid" && (
                <div className="absolute inset-0 bg-black/20 pointer-events-none" />
              )}

              {/* Content Layer */}
              <div className="relative z-10 h-full">
                <div
                  className={`h-full flex flex-col ${
                    isFullscreen ? "max-w-sm mx-auto p-8" : "p-5 lg:p-6" // INCREASED PADDING
                  }`}
                >
                  {/* Fullscreen Close Button */}
                  {isFullscreen && (
                    <Button
                      variant="ghost"
                      size="sm"
                      className="absolute top-4 right-4 z-30 bg-black/20 hover:bg-black/40 text-white border border-white/20 rounded-full p-2 backdrop-blur-sm"
                      onClick={() => setIsFullscreen(false)}
                    >
                      <X size={16} />
                    </Button>
                  )}

                  {/* Profile Section - Optimized spacing */}
                  <div
                    className={`text-center flex-shrink-0 ${
                      isFullscreen ? "pt-8 pb-6" : "pt-4 lg:pt-6 pb-4 lg:pb-5" // BETTER SPACING
                    }`}
                  >
                    <div className="flex justify-center mb-4 lg:mb-5">
                      <div className="relative">
                        <EnhancedProfilePicture
                          profilePicture={profileForm?.profile_picture || ""}
                          companyLogo={profileForm?.company_logo || ""}
                          size={isFullscreen ? "xl" : "lg"}
                        />
                        {/* Ring removed */}
                      </div>
                    </div>

                    <div className="space-y-3 lg:space-y-4">
                      <h3
                        className={`font-bold px-4 py-2 rounded-lg backdrop-blur-sm bg-black/20 ${
                          isFullscreen ? "text-2xl" : "text-lg lg:text-xl" // LARGER TEXT
                        }`}
                        style={{
                          color: contrastTextColor,
                          textShadow:
                            "2px 2px 4px rgba(0,0,0,0.8), 0 0 8px rgba(0,0,0,0.3)",
                        }}
                      >
                        {profileForm?.display_name ||
                          profileForm?.username ||
                          "Your Name"}
                      </h3>
                      {profileForm?.bio && (
                        <p
                          className={`leading-relaxed max-w-sm mx-auto px-4 py-2 rounded-lg backdrop-blur-sm bg-black/20 ${
                            isFullscreen ? "text-sm" : "text-sm lg:text-base" // LARGER BIO TEXT
                          }`}
                          style={{
                            color: contrastTextColor,
                            textShadow:
                              "1px 1px 2px rgba(0,0,0,0.8), 0 0 4px rgba(0,0,0,0.3)",
                          }}
                        >
                          {profileForm.bio}
                        </p>
                      )}
                    </div>
                  </div>

                  {/* OPTIMIZED LINKS SECTION - Reduced hover effects */}
                  <div className="flex-1 min-h-0 overflow-y-auto scrollbar-hide">
                    <div className="space-y-3 lg:space-y-4 pb-4 lg:pb-5">
                      {" "}
                      {/* INCREASED SPACING */}
                      {links.length > 0 ? (
                        <>
                          {links
                            .slice(0, isFullscreen ? 12 : 8)
                            .map((link, index) => {
                              // SHOW MORE LINKS
                              const config = platformConfigs[link.platform];
                              const isLoading = loadingLinkId === link.id;

                              return (
                                <button
                                  key={link.id}
                                  onClick={() =>
                                    !isLoading && handleLinkClick(link)
                                  }
                                  disabled={isLoading}
                                  className={`w-full group relative overflow-hidden rounded-full transition-all duration-200 cursor-pointer shadow-lg backdrop-blur-md border border-white/20 ${
                                    isLoading
                                      ? "opacity-70 cursor-not-allowed"
                                      : "hover:scale-[1.01] active:scale-[0.99] hover:shadow-xl" // REDUCED ZOOM EFFECTS
                                  } ${isFullscreen ? "p-5" : "p-4 lg:p-5"}`} // BETTER PADDING
                                  style={{
                                    backgroundColor: `${getThemeColor()}E6`,
                                    boxShadow:
                                      "0 6px 24px rgba(0, 0, 0, 0.25), inset 0 1px 0 rgba(255, 255, 255, 0.2)", // REDUCED SHADOW
                                    animationDelay: `${index * 50}ms`, // FASTER ANIMATION
                                  }}
                                >
                                  {/* Subtle hover effect */}
                                  <div
                                    className={`absolute inset-0 bg-gradient-to-r from-white/5 to-transparent opacity-0 transition-opacity duration-200 ${
                                      !isLoading && "group-hover:opacity-100"
                                    }`}
                                  />

                                  <div className="relative flex items-center justify-between gap-4">
                                    <div className="flex items-center gap-4 min-w-0 flex-1">
                                      <span className="flex-shrink-0">
                                        {renderIcon(
                                          config?.icon || "🔗",
                                          isFullscreen ? 32 : 28
                                        )}
                                      </span>
                                      <span
                                        className={`font-semibold text-white truncate ${
                                          isFullscreen
                                            ? "text-lg"
                                            : "text-base lg:text-lg" // LARGER TEXT
                                        }`}
                                        style={{
                                          textShadow:
                                            "1px 1px 2px rgba(0,0,0,0.5)",
                                        }}
                                      >
                                        {link.title}
                                      </span>
                                    </div>

                                    {/* Loading spinner or external link icon */}
                                    {isLoading ? (
                                      <Loader2
                                        size={isFullscreen ? 20 : 18}
                                        className="text-white animate-spin flex-shrink-0"
                                      />
                                    ) : (
                                      <ExternalLink
                                        size={isFullscreen ? 20 : 18}
                                        className="text-white/80 group-hover:text-white group-hover:translate-x-0.5 transition-all duration-200 flex-shrink-0" // REDUCED TRANSLATION
                                      />
                                    )}
                                  </div>
                                </button>
                              );
                            })}
                          {links.length > (isFullscreen ? 12 : 8) && (
                            <div className="text-center py-2">
                              <Badge
                                variant="secondary"
                                className="bg-black/20 text-white border-0 backdrop-blur-sm rounded-full"
                              >
                                +{links.length - (isFullscreen ? 12 : 8)} more
                                links
                              </Badge>
                            </div>
                          )}
                        </>
                      ) : (
                        <div className="text-center py-8 lg:py-12">
                          <div
                            className={`mb-3 opacity-50 ${
                              isFullscreen ? "text-5xl" : "text-4xl lg:text-5xl"
                            }`}
                          >
                            🔗
                          </div>
                          <p
                            className={`opacity-70 px-4 py-2 rounded-lg backdrop-blur-sm bg-black/20 ${
                              isFullscreen ? "text-sm" : "text-sm lg:text-base"
                            }`}
                            style={{
                              color: contrastTextColor,
                              textShadow: "1px 1px 2px rgba(0,0,0,0.8)",
                            }}
                          >
                            Add your first link to see it here
                          </p>
                        </div>
                      )}
                    </div>
                  </div>

                  {/* Footer - Better spacing */}
                  <div
                    className={`text-center flex-shrink-0 space-y-2 ${
                      isFullscreen ? "pt-4" : "pt-3 lg:pt-4"
                    }`}
                  >
                    <div
                      className={`flex items-center justify-center gap-2 opacity-70 px-4 py-2 rounded-lg backdrop-blur-sm bg-black/20 w-fit mx-auto ${
                        isFullscreen ? "text-xs" : "text-xs lg:text-sm"
                      }`}
                      style={{
                        color: contrastTextColor,
                        textShadow: "1px 1px 2px rgba(0,0,0,0.8)",
                      }}
                    >
                      <Eye size={12} />
                      <span>{profile?.view_count || 0} views</span>
                    </div>
                    <p
                      className={`opacity-50 px-4 py-2 rounded-lg backdrop-blur-sm bg-black/20 w-fit mx-auto ${
                        isFullscreen ? "text-xs" : "text-xs lg:text-sm"
                      }`}
                      style={{
                        color: contrastTextColor,
                        textShadow: "1px 1px 2px rgba(0,0,0,0.8)",
                      }}
                    >
                      Powered by TapyFi
                    </p>
                  </div>
                </div>
              </div>
            </div>

            {/* Compact Stats Section */}
            {!isFullscreen && (
              <div className="p-3 lg:p-4 space-y-3 bg-gradient-to-br from-gray-50 to-indigo-50 dark:from-gray-800 dark:to-gray-900 border-t border-gray-100 dark:border-gray-800">
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-2">
                    <TrendingUp
                      size={12}
                      className="lg:w-4 lg:h-4 text-indigo-600"
                    />
                    <span className="text-xs lg:text-sm font-semibold text-gray-700 dark:text-gray-300">
                      Analytics
                    </span>
                  </div>
                  <Button
                    variant="ghost"
                    size="sm"
                    className="h-6 lg:h-7 px-2 lg:px-3 text-xs hover:bg-indigo-100 dark:hover:bg-gray-700 rounded-full"
                  >
                    <BarChart3 size={10} className="lg:w-3 lg:h-3" />
                    <span className="ml-1 hidden sm:inline">View All</span>
                  </Button>
                </div>

                <div className="grid grid-cols-2 gap-2 lg:gap-3">
                  <div className="bg-white dark:bg-gray-800 rounded-lg lg:rounded-xl p-2 lg:p-3 shadow-sm border border-gray-100 dark:border-gray-700 hover:shadow-md transition-shadow">
                    <div className="flex items-center justify-between mb-1">
                      <div className="text-xl lg:text-2xl font-bold text-indigo-600">
                        {links.length}
                      </div>
                      <div className="p-1 lg:p-1.5 bg-indigo-100 dark:bg-indigo-900 rounded-md lg:rounded-lg">
                        <ExternalLink
                          size={10}
                          className="lg:w-3 lg:h-3 text-indigo-600 dark:text-indigo-400"
                        />
                      </div>
                    </div>
                    <div className="text-xs text-gray-600 dark:text-gray-400 font-medium">
                      Active Links
                    </div>
                  </div>

                  <div className="bg-white dark:bg-gray-800 rounded-lg lg:rounded-xl p-2 lg:p-3 shadow-sm border border-gray-100 dark:border-gray-700 hover:shadow-md transition-shadow">
                    <div className="flex items-center justify-between mb-1">
                      <div className="text-xl lg:text-2xl font-bold text-purple-600">
                        {links.reduce((sum, link) => sum + link.click_count, 0)}
                      </div>
                      <div className="p-1 lg:p-1.5 bg-purple-100 dark:bg-purple-900 rounded-md lg:rounded-lg">
                        <TrendingUp
                          size={10}
                          className="lg:w-3 lg:h-3 text-purple-600 dark:text-purple-400"
                        />
                      </div>
                    </div>
                    <div className="text-xs text-gray-600 dark:text-gray-400 font-medium">
                      Total Clicks
                    </div>
                  </div>
                </div>

                {/* Background Type Indicator */}
                <div className="flex justify-center pt-1 lg:pt-2">
                  <div className="bg-black/60 backdrop-blur-md px-2 lg:px-3 py-1 lg:py-1.5 rounded-full border border-white/20">
                    <div className="flex items-center gap-1 lg:gap-2 text-white text-xs">
                      <span>{getBackgroundIcon()}</span>
                      <span className="font-medium">
                        {getBackgroundDisplayName()}
                      </span>
                    </div>
                  </div>
                </div>
              </div>
            )}
          </CardContent>
        </Card>
      </div>

      {/* Custom Scrollbar Styles */}
      <style jsx>{`
        .scrollbar-hide {
          -ms-overflow-style: none;
          scrollbar-width: none;
        }
        .scrollbar-hide::-webkit-scrollbar {
          display: none;
        }
      `}</style>
    </div>
  );
}
