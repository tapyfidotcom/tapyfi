"use client";

import React, { useState } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Eye, Smartphone, RefreshCw } from "lucide-react";
import BackgroundWrapper from "@/components/ui/background-wrapper";
import EnhancedProfilePicture from "@/components/ui/enhanced-profile-picture";
import { LinktreeProfile, LinktreeLink } from "@/interfaces/linktree";
import {
  ProfileFormData,
  BackgroundSettings,
  getPrimaryColor,
} from "@/types/profile";
import { platformConfigs } from "@/lib/platform-configs";
import Image from "next/image";

interface MobilePreviewProps {
  profile: LinktreeProfile | null;
  profileForm: ProfileFormData;
  backgroundSettings: BackgroundSettings;
  links: LinktreeLink[];
  onRefresh?: () => void;
}

export default function MobilePreview({
  profile,
  profileForm,
  backgroundSettings,
  links,
  onRefresh,
}: MobilePreviewProps) {
  const [isRefreshing, setIsRefreshing] = useState(false);

  const handleRefresh = async () => {
    setIsRefreshing(true);
    try {
      if (onRefresh) {
        await onRefresh();
      }
      // Add a small delay for visual feedback
      await new Promise(resolve => setTimeout(resolve, 500));
    } finally {
      setIsRefreshing(false);
    }
  };

  const renderIcon = (icon: string, size: number = 24) => {
    if (typeof icon === "string" && icon.startsWith("/assets")) {
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
    return <span className="text-lg">{icon}</span>;
  };

  const getContrastColor = (bgColor: string | string[], textColor: string = "#ffffff") => {
    try {
      const primaryColor = getPrimaryColor(bgColor);
      if (backgroundSettings.type === "solid") {
        const hex = primaryColor.replace("#", "");
        const r = parseInt(hex.substr(0, 2), 16);
        const g = parseInt(hex.substr(2, 2), 16);
        const b = parseInt(hex.substr(4, 2), 16);
        const brightness = (r * 299 + g * 587 + b * 114) / 1000;

        if (brightness > 128) {
          return textColor === "#ffffff" ? "#1a1a1a" : textColor;
        }
      }
      return textColor;
    } catch {
      return "#ffffff";
    }
  };

  const getThemeColor = () => {
    const formThemeColor = Array.isArray(profileForm.theme_color)
      ? profileForm.theme_color[0]
      : profileForm.theme_color;

    const profileThemeColor = Array.isArray(profile?.theme_color)
      ? profile.theme_color[0]
      : profile?.theme_color;

    return formThemeColor || profileThemeColor || "#10b981";
  };

  const textColorValue = Array.isArray(profileForm.text_color)
    ? profileForm.text_color[0]
    : profileForm.text_color;

  const contrastTextColor = getContrastColor(
    backgroundSettings.color,
    textColorValue || "#ffffff"
  );

  if (!profile && !profileForm.username) {
    return (
      <Card className="overflow-hidden border-2 border-dashed border-gray-200 dark:border-gray-700">
        <CardHeader className="pb-2">
          <div className="flex items-center justify-between">
            <CardTitle className="text-sm font-medium flex items-center gap-2">
              <Smartphone size={16} className="text-blue-500" />
              Mobile Preview
            </CardTitle>
            <div className="flex items-center gap-2">
              <Button
                variant="ghost"
                size="sm"
                onClick={handleRefresh}
                disabled={isRefreshing}
                className="h-8 w-8 p-0"
              >
                <RefreshCw 
                  size={14} 
                  className={`${isRefreshing ? 'animate-spin' : ''} text-gray-500`} 
                />
              </Button>
              <Badge variant="secondary" className="text-xs">
                Live
              </Badge>
            </div>
          </div>
        </CardHeader>
        <CardContent className="p-3 text-center">
          <div className="animate-pulse">
            <div className="w-16 h-16 bg-gray-200 dark:bg-gray-700 rounded-full mx-auto mb-4" />
            <div className="space-y-3">
              <div className="h-4 bg-gray-200 dark:bg-gray-700 rounded w-3/4 mx-auto" />
              <div className="h-3 bg-gray-200 dark:bg-gray-700 rounded w-1/2 mx-auto" />
            </div>
          </div>
          <p className="text-muted-foreground text-sm mt-4">
            Create your profile to see the live preview
          </p>
        </CardContent>
      </Card>
    );
  }

  return (
    <Card className="overflow-hidden shadow-lg border-0">
      <CardHeader className="pb-4 bg-gradient-to-r from-blue-50 to-purple-50 dark:from-gray-800 dark:to-gray-900">
        <div className="flex items-center justify-between">
          <CardTitle className="text-sm font-medium flex items-center gap-2">
            <Smartphone size={16} className="text-blue-500" />
            Mobile Preview
          </CardTitle>
          <div className="flex items-center gap-2">
            <Button
              variant="ghost"
              size="sm"
              onClick={handleRefresh}
              disabled={isRefreshing}
              className="h-8 w-8 p-0 hover:bg-blue-100 dark:hover:bg-gray-700"
              title="Refresh preview"
            >
              <RefreshCw 
                size={14} 
                className={`${isRefreshing ? 'animate-spin' : ''} text-blue-500`} 
              />
            </Button>
            <Badge variant="outline" className="text-xs">
              <Eye size={10} className="mr-1" />
              {profile?.view_count || 0}
            </Badge>
            <Badge className="text-xs bg-green-500">Live</Badge>
          </div>
        </div>
      </CardHeader>

      <CardContent className="p-0">
        <div className="relative aspect-[9/16] w-full max-w-sm mx-auto bg-black rounded-b-lg overflow-hidden">
          {/* Background Layer */}
          <div className="absolute inset-0">
            <BackgroundWrapper 
              settings={backgroundSettings}
              key={`mobile-bg-${backgroundSettings.type}-${JSON.stringify(backgroundSettings.color)}-${isRefreshing ? Date.now() : ''}`}
            />
          </div>

          {/* Enhanced Readability Overlay for non-solid backgrounds */}
          {backgroundSettings.type !== "solid" && (
            <div className="absolute inset-0 bg-black/20 pointer-events-none" />
          )}

          {/* Content Layer */}
          <div className="relative z-10 h-full flex flex-col p-4">
            {/* Profile Section */}
            <div className="text-center flex-shrink-0 pt-6 pb-4">
              <div className="flex justify-center mb-3">
                <EnhancedProfilePicture
                  profilePicture={profileForm.profile_picture}
                  companyLogo={profileForm.company_logo}
                  size="lg"
                />
              </div>

              <div className="space-y-2">
                <h3
                  className="font-bold px-3 py-1.5 rounded-lg backdrop-blur-sm bg-black/20 text-base max-w-xs mx-auto"
                  style={{
                    color: contrastTextColor,
                    textShadow: "2px 2px 4px rgba(0,0,0,0.8)",
                  }}
                >
                  {profileForm.display_name ||
                    profileForm.username ||
                    "Your Name"}
                </h3>

                {profileForm.bio && (
                  <p
                    className="leading-relaxed max-w-xs mx-auto px-3 py-1.5 rounded-lg backdrop-blur-sm bg-black/20 text-sm"
                    style={{
                      color: contrastTextColor,
                      textShadow: "1px 1px 2px rgba(0,0,0,0.8)",
                    }}
                  >
                    {profileForm.bio}
                  </p>
                )}
              </div>
            </div>

            {/* Links Section */}
            <div className="flex-1 min-h-0 overflow-y-auto scrollbar-hide">
              <div className="space-y-2 pb-4">
                {links.length > 0 ? (
                  links.slice(0, 6).map((link, index) => {
                    const config = platformConfigs[link.platform];

                    return (
                      <button
                        key={`${link.id}-${isRefreshing ? Date.now() : ''}`}
                        className="w-full group relative overflow-hidden rounded-full transition-all duration-200 shadow-lg backdrop-blur-md border border-white/20 hover:scale-[1.02] p-3"
                        style={{
                          backgroundColor: `${getThemeColor()}E6`,
                          boxShadow: "0 6px 24px rgba(0, 0, 0, 0.25)",
                        }}
                      >
                        <div className="flex items-center justify-between gap-3">
                          <div className="flex items-center gap-3 min-w-0 flex-1">
                            <span className="flex-shrink-0">
                              {renderIcon(config?.icon || "🔗", 20)}
                            </span>
                            <span
                              className="font-semibold text-white truncate text-sm"
                              style={{
                                textShadow: "1px 1px 2px rgba(0,0,0,0.5)",
                              }}
                            >
                              {link.title}
                            </span>
                          </div>
                        </div>
                      </button>
                    );
                  })
                ) : (
                  <div className="text-center py-8">
                    <div className="text-3xl mb-2 opacity-50">🔗</div>
                    <p
                      className="opacity-70 px-3 py-1.5 rounded-lg backdrop-blur-sm bg-black/20 text-sm max-w-xs mx-auto"
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

            {/* Footer */}
            <div className="text-center flex-shrink-0 space-y-1">
              <div
                className="flex items-center justify-center gap-1 opacity-70 px-3 py-1 rounded-lg backdrop-blur-sm bg-black/20 w-fit mx-auto text-xs"
                style={{
                  color: contrastTextColor,
                  textShadow: "1px 1px 2px rgba(0,0,0,0.8)",
                }}
              >
                <Eye size={8} />
                <span>{profile?.view_count || 0} views</span>
              </div>
              <p
                className="opacity-50 px-3 py-1 rounded-lg backdrop-blur-sm bg-black/20 w-fit mx-auto text-xs"
                style={{
                  color: contrastTextColor,
                  textShadow: "1px 1px 2px rgba(0,0,0,0.8)",
                }}
              >
                Powered by TapyFi
              </p>
            </div>
          </div>

          {/* Refresh overlay when refreshing */}
          {isRefreshing && (
            <div className="absolute inset-0 bg-black/10 backdrop-blur-[1px] flex items-center justify-center z-20">
              <div className="bg-white/90 dark:bg-gray-800/90 rounded-full p-3 shadow-lg">
                <RefreshCw size={24} className="animate-spin text-blue-500" />
              </div>
            </div>
          )}
        </div>
      </CardContent>
    </Card>
  );
}
