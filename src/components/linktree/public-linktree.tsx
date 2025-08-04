"use client";

import React, { useEffect } from "react";
import { LinktreeProfile, LinktreeLink } from "@/interfaces/linktree";
import { platformConfigs } from "@/lib/platform-configs";
import { ExternalLink, Eye } from "lucide-react";
import BackgroundWrapper from "@/components/ui/background-wrapper";
import EnhancedProfilePicture from "@/components/ui/enhanced-profile-picture";
import { BackgroundSettings, getPrimaryColor, ensureIridescenceColor } from "@/types/profile";
import Image from "next/image";

interface PublicLinktreeProps {
  profile: LinktreeProfile & { linktree_links: LinktreeLink[] };
}

export default function PublicLinktree({ profile }: PublicLinktreeProps) {
  const handleLinkClick = async (link: LinktreeLink) => {
    window.open(link.url, '_blank', 'noopener,noreferrer');
  };

  // Function to render icon (image or emoji)
  const renderIcon = (icon: string, size: number = 24) => {
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
          
          // Silk specific
          scale: parsed.scale,
          noiseIntensity: parsed.noiseIntensity,
          rotation: parsed.rotation,
          
          // Squares specific
          direction: parsed.direction,
          borderColor: parsed.borderColor,
          squareSize: parsed.squareSize,
          hoverFillColor: parsed.hoverFillColor,
          
          // Iridescence specific - using helper function for proper tuple type
          iridescenceColor: ensureIridescenceColor(parsed.iridescenceColor),
          amplitude: parsed.amplitude,
          mouseReact: parsed.mouseReact,
          brightness: parsed.brightness,
          saturation: parsed.saturation,
          reflection: parsed.reflection,
          
          // Solid gradient specific
          gradientDirection: parsed.gradientDirection,
          gradientType: parsed.gradientType,
          
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

  // FIXED: Use getPrimaryColor to handle string | string[] type safely
  const getContrastColor = (bgColor: string | string[], textColor: string): string => {
    const primaryColor = getPrimaryColor(bgColor); // This ensures we always get a string
    
    if (backgroundSettings.type === 'solid') {
      const hex = primaryColor.replace('#', '');
      const r = parseInt(hex.substr(0, 2), 16);
      const g = parseInt(hex.substr(2, 2), 16);
      const b = parseInt(hex.substr(4, 2), 16);
      const brightness = ((r * 299) + (g * 587) + (b * 114)) / 1000;
      
      if (brightness > 128) {
        return textColor === '#000000' ? '#1f2937' : textColor;
      }
    }
    
    // For animated backgrounds, return white for better visibility
    return backgroundSettings.type !== 'solid' ? '#ffffff' : textColor;
  };

  // FIXED: Now properly handles both string and string[] color types
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
      
      {/* Enhanced Readability Overlay for animated backgrounds */}
      {backgroundSettings.type !== 'solid' && (
        <div className="absolute inset-0 bg-black/20 pointer-events-none" />
      )}
      
      {/* Content Layer */}
      <div className="w-full max-w-md mx-auto space-y-6 relative z-10">
        {/* Profile Header */}
        <div className="text-center space-y-4">
          <div className="flex justify-center">
            <div className="relative">
              <EnhancedProfilePicture
                profilePicture={profile.profile_picture}
                companyLogo={profile.company_logo}
                size="xl"
              />
            </div>
          </div>

          {/* Enhanced text readability */}
          <div className="space-y-3">
            <h1 
              className="text-2xl md:text-3xl font-bold px-4 py-2 rounded-lg backdrop-blur-sm bg-black/20"
              style={{ 
                color: contrastTextColor,
                textShadow: '2px 2px 4px rgba(0,0,0,0.8), 0 0 8px rgba(0,0,0,0.3)'
              }}
            >
              {profile.display_name || `@${profile.username}`}
            </h1>
            {profile.bio && (
              <p 
                className="leading-relaxed max-w-sm mx-auto px-4 py-2 rounded-lg backdrop-blur-sm bg-black/20"
                style={{ 
                  color: contrastTextColor,
                  textShadow: '1px 1px 2px rgba(0,0,0,0.8), 0 0 4px rgba(0,0,0,0.3)'
                }}
              >
                {profile.bio}
              </p>
            )}
          </div>
        </div>

        {/* Enhanced Links with pill shape */}
        <div className="space-y-3">
          {profile.linktree_links.length > 0 ? (
            profile.linktree_links
              .sort((a, b) => a.display_order - b.display_order)
              .map((link) => {
                const config = platformConfigs[link.platform];
                return (
                  <button
                    key={link.id}
                    onClick={() => handleLinkClick(link)}
                    className="w-full p-5 rounded-full font-semibold transition-all duration-300 hover:scale-[1.03] active:scale-[0.98] hover:shadow-2xl flex items-center justify-between group shadow-xl backdrop-blur-md border border-white/20"
                    style={{ 
                      backgroundColor: `${profile.theme_color}E6`,
                      color: '#ffffff',
                      boxShadow: '0 8px 32px rgba(0, 0, 0, 0.3), inset 0 1px 0 rgba(255, 255, 255, 0.2)',
                      textShadow: '1px 1px 2px rgba(0,0,0,0.5)'
                    }}
                  >
                    <div className="flex items-center gap-4">
                      <span className="flex-shrink-0">
                        {renderIcon(config?.icon || '🔗', 32)}
                      </span>
                      <span className="text-left text-lg">{link.title}</span>
                    </div>
                    <ExternalLink 
                      size={20} 
                      className="text-white/80 group-hover:text-white group-hover:translate-x-1 transition-all duration-300 flex-shrink-0" 
                    />
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
                  textShadow: '1px 1px 2px rgba(0,0,0,0.8)'
                }}
              >
                No links available
              </p>
            </div>
          )}
        </div>

        {/* Enhanced Footer */}
        <div className="text-center pt-8 space-y-4">
          <div 
            className="flex items-center justify-center gap-2 text-sm opacity-80 px-4 py-2 rounded-lg backdrop-blur-sm bg-black/20 w-fit mx-auto"
            style={{ 
              color: contrastTextColor,
              textShadow: '1px 1px 2px rgba(0,0,0,0.8)'
            }}
          >
            <Eye size={14} />
            <span>{profile.view_count || 0} views</span>
          </div>
          
          <p 
            className="text-sm opacity-60 px-4 py-2 rounded-lg backdrop-blur-sm bg-black/20 w-fit mx-auto"
            style={{ 
              color: contrastTextColor,
              textShadow: '1px 1px 2px rgba(0,0,0,0.8)'
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
              style={{ textShadow: '1px 1px 2px rgba(0,0,0,0.3)' }}
            >
              <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 12a9 9 0 01-9 9m9-9a9 9 0 00-9-9m9 9H3m9 9v-9m0 9c0 5-4 9-9 9s-9-4-9-9 4-9 9-9 9 4 9 9z" />
              </svg>
              Create Your Own on TapyFi
            </a>
          </div>
        </div>
      </div>
    </div>
  );
}
