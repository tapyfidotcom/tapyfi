"use client";

import React, { useEffect } from "react";
import { LinktreeProfile, LinktreeLink } from "@/interfaces/linktree";
import { platformConfigs } from "@/lib/platform-configs";
import { ExternalLink, Eye } from "lucide-react";
import BackgroundWrapper from "@/components/ui/background-wrapper";
import EnhancedProfilePicture from "@/components/ui/enhanced-profile-picture";
import { BackgroundSettings } from "@/types/profile";

interface PublicLinktreeProps {
  profile: LinktreeProfile & { linktree_links: LinktreeLink[] };
}

export default function PublicLinktree({ profile }: PublicLinktreeProps) {
  const handleLinkClick = async (link: LinktreeLink) => {
    window.open(link.url, '_blank', 'noopener,noreferrer');
  };

  const getBackgroundSettings = (): BackgroundSettings => {
    if (profile.background_settings) {
      try {
        const parsed = JSON.parse(profile.background_settings);
        return {
          type: parsed.type || 'solid',
          color: parsed.color || profile.background_color,
          speed: parsed.speed || 1,
          intensity: parsed.intensity || 1,
          
          // Hyperspeed specific
          preset: parsed.preset,
          distortion: parsed.distortion,
          roadWidth: parsed.roadWidth,
          islandWidth: parsed.islandWidth,
          lanesPerRoad: parsed.lanesPerRoad,
          fov: parsed.fov,
          fovSpeedUp: parsed.fovSpeedUp,
          speedUp: parsed.speedUp,
          carLightsFade: parsed.carLightsFade,
          totalSideLightSticks: parsed.totalSideLightSticks,
          lightPairsPerRoadWay: parsed.lightPairsPerRoadWay,
          
          mouseInteraction: parsed.mouseInteraction || false
        };
      } catch (error) {
        console.error('Error parsing background settings:', error);
      }
    }
    
    return {
      type: 'solid',
      color: profile.background_color,
      speed: 1,
      intensity: 1,
      mouseInteraction: false
    };
  };

  const backgroundSettings = getBackgroundSettings();

  const getContrastColor = (bgColor: string, textColor: string): string => {
    if (backgroundSettings.type === 'solid') {
      const hex = bgColor.replace('#', '');
      const r = parseInt(hex.substr(0, 2), 16);
      const g = parseInt(hex.substr(2, 2), 16);
      const b = parseInt(hex.substr(4, 2), 16);
      const brightness = ((r * 299) + (g * 587) + (b * 114)) / 1000;
      
      if (brightness > 128) {
        return textColor === '#000000' ? '#1f2937' : textColor;
      }
    }
    return textColor;
  };

  const contrastTextColor = getContrastColor(backgroundSettings.color, profile.text_color);

  useEffect(() => {
    document.title = `${profile.display_name || profile.username} - TapyFi`;
  }, [profile.display_name, profile.username]);

  return (
    <div className="min-h-screen w-full flex flex-col items-center justify-center p-4 relative overflow-hidden">
      {/* Background Layer */}
      <div className="absolute inset-0">
        <BackgroundWrapper settings={backgroundSettings} />
      </div>
      
      {/* Content Layer */}
      <div className="w-full max-w-md mx-auto space-y-6 relative z-10">
        {/* Profile Header */}
        <div className="text-center space-y-4">
          <div className="flex justify-center">
            <EnhancedProfilePicture
              profilePicture={profile.profile_picture}
              companyLogo={profile.company_logo}
              size="xl"
            />
          </div>

          <div>
            <h1 
              className="text-2xl md:text-3xl font-bold mb-2 drop-shadow-lg"
              style={{ 
                color: contrastTextColor,
                textShadow: backgroundSettings.type !== 'solid' ? '2px 2px 4px rgba(0,0,0,0.8)' : 'none'
              }}
            >
              {profile.display_name || `@${profile.username}`}
            </h1>
            {profile.bio && (
              <p 
                className="opacity-90 leading-relaxed max-w-sm mx-auto drop-shadow-sm"
                style={{ 
                  color: contrastTextColor,
                  textShadow: backgroundSettings.type !== 'solid' ? '1px 1px 2px rgba(0,0,0,0.6)' : 'none'
                }}
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
                  className="w-full p-4 rounded-xl font-medium transition-all duration-200 hover:scale-[1.02] hover:shadow-xl flex items-center justify-between group shadow-lg active:scale-[0.98] backdrop-blur-sm"
                  style={{ 
                    backgroundColor: `${profile.theme_color}${backgroundSettings.type !== 'solid' ? 'E6' : ''}`,
                    color: '#ffffff',
                    border: '2px solid rgba(255,255,255,0.2)',
                    boxShadow: backgroundSettings.type !== 'solid' ? '0 8px 32px rgba(0,0,0,0.4)' : '0 4px 12px rgba(0,0,0,0.1)'
                  }}
                >
                  <div className="flex items-center gap-3">
                    <span className="text-xl">{config?.icon || '🔗'}</span>
                    <span className="text-left">{link.title}</span>
                  </div>
                  <ExternalLink 
                    size={16} 
                    className="opacity-60 group-hover:opacity-100 transition-opacity flex-shrink-0" 
                  />
                </button>
              );
            })}
        </div>

        {/* Footer */}
        <div className="text-center pt-8">
          <div 
            className="flex items-center justify-center gap-2 text-sm opacity-60"
            style={{ 
              color: contrastTextColor,
              textShadow: backgroundSettings.type !== 'solid' ? '1px 1px 2px rgba(0,0,0,0.8)' : 'none'
            }}
          >
            <Eye size={14} />
            <span>{profile.view_count} views</span>
          </div>
          <p 
            className="text-xs opacity-40 mt-2"
            style={{ 
              color: contrastTextColor,
              textShadow: backgroundSettings.type !== 'solid' ? '1px 1px 2px rgba(0,0,0,0.6)' : 'none'
            }}
          >
            Powered by TapyFi
          </p>
        </div>
      </div>
    </div>
  );
}
