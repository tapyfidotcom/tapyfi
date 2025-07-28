"use client";

import React from "react";
import { LinktreeProfile, LinktreeLink } from "@/interfaces/linktree";
import { platformConfigs } from "@/lib/platform-configs";
import { ExternalLink, Eye } from "lucide-react";
import BackgroundPreview from "@/components/ui/background-preview";
import EnhancedProfilePicture from "@/components/ui/enhanced-profile-picture";
import { BackgroundSettings } from "@/types/profile";

interface PublicLinktreeProps {
  profile: LinktreeProfile & { linktree_links: LinktreeLink[] };
}

export default function PublicLinktree({ profile }: PublicLinktreeProps) {
  const handleLinkClick = async (link: LinktreeLink) => {
    // Track click analytics here if needed
    window.open(link.url, '_blank', 'noopener,noreferrer');
  };

  // Parse background settings from the profile
  const getBackgroundSettings = (): BackgroundSettings => {
    if (profile.background_settings) {
      try {
        const parsed = JSON.parse(profile.background_settings);
        return {
          type: parsed.type || 'solid',
          color: parsed.color || profile.background_color,
          speed: parsed.speed || 1,
          intensity: parsed.intensity || 1,
          preset: parsed.preset,
          scale: parsed.scale,
          direction: parsed.direction
        };
      } catch (error) {
        console.error('Error parsing background settings:', error);
      }
    }
    
    // Fallback to solid background
    return {
      type: 'solid',
      color: profile.background_color,
      speed: 1,
      intensity: 1
    };
  };

  const backgroundSettings = getBackgroundSettings();

  // Function to get better text contrast
  const getContrastColor = (bgColor: string, textColor: string): string => {
    if (backgroundSettings.type === 'solid') {
      const hex = bgColor.replace('#', '');
      const r = parseInt(hex.substr(0, 2), 16);
      const g = parseInt(hex.substr(2, 2), 16);
      const b = parseInt(hex.substr(4, 2), 16);
      const brightness = ((r * 299) + (g * 587) + (b * 114)) / 1000;
      
      // If background is light, make text darker for better contrast
      if (brightness > 128) {
        return textColor === '#000000' ? '#1a1a1a' : textColor;
      }
    }
    return textColor;
  };

  const contrastTextColor = getContrastColor(backgroundSettings.color, profile.text_color);

  return (
    <div className="min-h-screen w-full flex flex-col items-center justify-center p-4 relative overflow-hidden">
      {/* Background Layer */}
      <div className="absolute inset-0">
        <BackgroundPreview settings={backgroundSettings} />
      </div>
      
      {/* Content Layer */}
      <div className="w-full max-w-md mx-auto space-y-6 relative z-10">
        {/* Profile Header */}
        <div className="text-center space-y-4">
          {/* Enhanced Profile Picture with Company Logo */}
          <div className="flex justify-center">
            <EnhancedProfilePicture
              profilePicture={profile.profile_picture}
              companyLogo={profile.company_logo}
              size="xl"
            />
          </div>

          {/* Name and Bio */}
          <div>
            <h1 
              className="text-2xl font-bold mb-2 drop-shadow-sm"
              style={{ color: contrastTextColor }}
            >
              {profile.display_name || `@${profile.username}`}
            </h1>
            {profile.bio && (
              <p 
                className="opacity-90 leading-relaxed drop-shadow-sm"
                style={{ color: contrastTextColor }}
              >
                {profile.bio}
              </p>
            )}
          </div>
        </div>

        {/* Links */}
        <div className="space-y-3">
          {profile.linktree_links
            .sort((a, b) => a.display_order - b.display_order)
            .map((link) => {
              const config = platformConfigs[link.platform];
              return (
                <button
                  key={link.id}
                  onClick={() => handleLinkClick(link)}
                  className="w-full p-4 rounded-xl font-medium transition-all duration-200 hover:scale-[1.02] hover:shadow-lg flex items-center justify-between group shadow-md"
                  style={{ 
                    backgroundColor: profile.theme_color,
                    color: '#ffffff',
                    border: '1px solid rgba(255,255,255,0.1)'
                  }}
                >
                  <div className="flex items-center gap-3">
                    <span className="text-xl">{config?.icon || '🔗'}</span>
                    <span>{link.title}</span>
                  </div>
                  <ExternalLink 
                    size={16} 
                    className="opacity-60 group-hover:opacity-100 transition-opacity" 
                  />
                </button>
              );
            })}
        </div>

        {/* Footer */}
        <div className="text-center pt-8">
          <div 
            className="flex items-center justify-center gap-2 text-sm opacity-60"
            style={{ color: contrastTextColor }}
          >
            <Eye size={14} />
            <span>{profile.view_count} views</span>
          </div>
          <p 
            className="text-xs opacity-40 mt-2 drop-shadow-sm"
            style={{ color: contrastTextColor }}
          >
            Powered by TapyFi
          </p>
        </div>
      </div>
    </div>
  );
}
