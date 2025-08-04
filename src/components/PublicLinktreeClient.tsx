"use client";

import React, { useState } from "react";
import BackgroundWrapper from "@/components/ui/background-wrapper";
import EnhancedProfilePicture from "@/components/ui/enhanced-profile-picture";
import { LinktreeProfile, LinktreeLink } from "@/interfaces/linktree";
import { BackgroundSettings } from "@/types/profile";
import { platformConfigs } from "@/lib/platform-configs";
import { ExternalLink, Eye, Globe, Loader2 } from "lucide-react";
import { incrementLinkClick } from "@/actions/linktree";
import Image from "next/image";

interface PublicLinktreeClientProps {
  profile: LinktreeProfile;
  backgroundSettings: BackgroundSettings;
  links: LinktreeLink[];
  contrastTextColor: string;
}

export default function PublicLinktreeClient({
  profile,
  backgroundSettings,
  links,
  contrastTextColor,
}: PublicLinktreeClientProps) {
  const [loadingLinkId, setLoadingLinkId] = useState<number | null>(null);

  const handleLinkClick = async (
    link: LinktreeLink,
    event: React.MouseEvent
  ) => {
    // Prevent default behavior
    event.preventDefault();

    setLoadingLinkId(link.id);

    // Open link immediately to ensure mobile browsers don't block it
    const newWindow = window.open(link.url, "_blank", "noopener,noreferrer");

    // Track the click asynchronously without blocking the link opening
    try {
      // Use setTimeout to ensure link opens first
      setTimeout(async () => {
        try {
          await incrementLinkClick(link.id);
        } catch (error) {
          console.error("Error tracking link click:", error);
        }
      }, 0);
    } catch (error) {
      console.error("Error in link click handler:", error);
    }

    // Reset loading state
    setTimeout(() => {
      setLoadingLinkId(null);
    }, 500);

    // Fallback for cases where window.open might fail
    if (!newWindow) {
      // If popup was blocked, try location.href as fallback
      try {
        window.location.href = link.url;
      } catch (error) {
        console.error("Failed to open link:", error);
        // Reset loading state if all fails
        setLoadingLinkId(null);
      }
    }
  };

  // Function to render icon (image or emoji)
  const renderIcon = (icon: string, size: number = 32) => {
    if (typeof icon === 'string' && icon.startsWith('/assets/')) {
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
    return <span className="text-2xl">{icon}</span>;
  };

  return (
    <div className="min-h-screen relative">
      {/* Background Layer */}
      <div className="absolute inset-0">
        <BackgroundWrapper settings={backgroundSettings} />
      </div>

      {/* Enhanced Readability Overlay - only for animated backgrounds */}
      {backgroundSettings.type !== "solid" && (
        <div className="absolute inset-0 bg-black/20 pointer-events-none" />
      )}

      {/* Content Layer */}
      <div className="relative z-10 min-h-screen flex flex-col">
        <div className="flex-grow flex items-center justify-center p-6">
          <div className="w-full max-w-md mx-auto">
            <div className="text-center space-y-8">
              {/* Profile Section with Enhanced Readability */}
              <div className="space-y-6">
                <div className="flex justify-center">
                  <div className="relative">
                    <EnhancedProfilePicture
                      profilePicture={profile.profile_picture}
                      companyLogo={profile.company_logo}
                      size="xl"
                    />
                    {/* Enhanced border for better visibility - WHITE RING REMOVED */}
                  </div>
                </div>

                {/* Enhanced Text Readability */}
                <div className="space-y-3">
                  <h1
                    className="text-3xl font-bold px-4 py-2 rounded-lg backdrop-blur-sm bg-black/20"
                    style={{
                      color: contrastTextColor,
                      textShadow:
                        "2px 2px 4px rgba(0,0,0,0.8), 0 0 8px rgba(0,0,0,0.3)",
                    }}
                  >
                    {profile.display_name || profile.username}
                  </h1>
                  {profile.bio && (
                    <p
                      className="text-lg leading-relaxed px-4 py-2 rounded-lg backdrop-blur-sm bg-black/20 max-w-sm mx-auto"
                      style={{
                        color: contrastTextColor,
                        textShadow:
                          "1px 1px 2px rgba(0,0,0,0.8), 0 0 4px rgba(0,0,0,0.3)",
                      }}
                    >
                      {profile.bio}
                    </p>
                  )}
                </div>
              </div>

              {/* Enhanced Links Section with Pill Shape and Loading States */}
              <div className="space-y-4 w-full">
                {links.length > 0 ? (
                  links
                    .sort(
                      (a: LinktreeLink, b: LinktreeLink) =>
                        a.display_order - b.display_order
                    )
                    .map((link: LinktreeLink) => {
                      const config = platformConfigs[link.platform];
                      const isLoading = loadingLinkId === link.id;

                      return (
                        <button
                          key={link.id}
                          onClick={(event) => handleLinkClick(link, event)}
                          disabled={isLoading}
                          className={`w-full group relative overflow-hidden rounded-full p-5 transition-all duration-300 cursor-pointer shadow-xl backdrop-blur-md border border-white/20 ${
                            isLoading
                              ? "opacity-70 cursor-not-allowed"
                              : "hover:scale-[1.03] active:scale-[0.98] hover:shadow-2xl"
                          }`}
                          style={{
                            backgroundColor: `${profile.theme_color}E6`,
                            boxShadow:
                              "0 8px 32px rgba(0, 0, 0, 0.3), inset 0 1px 0 rgba(255, 255, 255, 0.2)",
                          }}
                          type="button"
                        >
                          {/* Hover effect overlay */}
                          <div
                            className={`absolute inset-0 bg-gradient-to-r from-white/10 to-transparent opacity-0 transition-opacity duration-300 ${
                              !isLoading && "group-hover:opacity-100"
                            }`}
                          />

                          <div className="relative flex items-center justify-between gap-4">
                            <div className="flex items-center gap-4 min-w-0 flex-1">
                              <span className="flex-shrink-0">
                                {renderIcon(config?.icon || "🔗", 32)}
                              </span>
                              <span
                                className="font-semibold text-white truncate text-lg"
                                style={{
                                  textShadow: "1px 1px 2px rgba(0,0,0,0.5)",
                                }}
                              >
                                {link.title}
                              </span>
                            </div>

                            {/* Loading spinner or external link icon */}
                            {isLoading ? (
                              <Loader2
                                size={20}
                                className="text-white animate-spin flex-shrink-0"
                              />
                            ) : (
                              <ExternalLink
                                size={20}
                                className="text-white/80 group-hover:text-white group-hover:translate-x-1 transition-all duration-300 flex-shrink-0"
                              />
                            )}
                          </div>
                        </button>
                      );
                    })
                ) : (
                  <div className="text-center py-12">
                    <div className="text-6xl mb-4 opacity-50">🔗</div>
                    <p
                      className="text-lg opacity-70 px-4 py-2 rounded-lg backdrop-blur-sm bg-black/20"
                      style={{
                        color: contrastTextColor,
                        textShadow: "1px 1px 2px rgba(0,0,0,0.8)",
                      }}
                    >
                      No links available
                    </p>
                  </div>
                )}
              </div>
            </div>
          </div>
        </div>

        {/* Enhanced Footer with Call-to-Action */}
        <footer className="relative z-10 text-center py-8 mt-8">
          <div className="space-y-4">
            {/* View Count */}
            <div
              className="flex items-center justify-center gap-2 text-sm opacity-80 px-4 py-2 rounded-lg backdrop-blur-sm bg-black/20 w-fit mx-auto"
              style={{
                color: contrastTextColor,
                textShadow: "1px 1px 2px rgba(0,0,0,0.8)",
              }}
            >
              <Eye size={14} />
              <span>{profile.view_count || 0} views</span>
            </div>

            {/* Powered by TapyFi */}
            <p
              className="text-sm opacity-60 px-4 py-2 rounded-lg backdrop-blur-sm bg-black/20 w-fit mx-auto"
              style={{
                color: contrastTextColor,
                textShadow: "1px 1px 2px rgba(0,0,0,0.8)",
              }}
            >
              Powered by TapyFi
            </p>

            {/* Create Your Own Call-to-Action */}
            <div className="pt-2">
              <a
                href="https://tapyfi.com"
                target="_blank"
                rel="noopener noreferrer"
                className="inline-flex items-center gap-2 px-6 py-3 bg-gradient-to-r from-emerald-500 to-blue-600 hover:from-emerald-600 hover:to-blue-700 text-white font-semibold rounded-full shadow-lg hover:shadow-xl transition-all duration-300 hover:scale-105 active:scale-95 backdrop-blur-sm border border-white/20"
                style={{ textShadow: "1px 1px 2px rgba(0,0,0,0.3)" }}
              >
                <Globe size={18} />
                Create Your Own on TapyFi
              </a>
            </div>
          </div>
        </footer>
      </div>
    </div>
  );
}
