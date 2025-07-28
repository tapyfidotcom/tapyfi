"use client";

import React from "react";
import { LinktreeProfile, LinktreeLink } from "@/interfaces/linktree";
import { platformConfigs } from "@/lib/platform-configs";
import { ExternalLink, Eye } from "lucide-react";
import DarkVeil from "@/components/backgrounds/DarkVeil/DarkVeil";
import Silk from "@/components/backgrounds/Silk/Silk";
import EnhancedProfilePicture from "@/components/ui/enhanced-profile-picture";

interface PublicLinktreeProps {
  profile: LinktreeProfile & { linktree_links: LinktreeLink[] };
}

export default function PublicLinktree({ profile }: PublicLinktreeProps) {
  const handleLinkClick = async (link: LinktreeLink) => {
    // Track click analytics here if needed
    window.open(link.url, '_blank', 'noopener,noreferrer');
  };

  const renderBackground = () => {
    // You can extend this to support different background types from profile settings
    return (
      <div 
        className="absolute inset-0"
        style={{ backgroundColor: profile.background_color }}
      />
    );
  };

  return (
    <div className="min-h-screen w-full flex flex-col items-center justify-center p-4 relative overflow-hidden">
      {/* Background */}
      {renderBackground()}
      
      {/* Content */}
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
              className="text-2xl font-bold mb-2"
              style={{ color: profile.text_color }}
            >
              {profile.display_name || `@${profile.username}`}
            </h1>
            {profile.bio && (
              <p 
                className="text-opacity-80 leading-relaxed"
                style={{ color: profile.text_color }}
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
                  className="w-full p-4 rounded-xl font-medium transition-all duration-200 hover:scale-[1.02] hover:shadow-lg flex items-center justify-between group"
                  style={{ 
                    backgroundColor: profile.theme_color,
                    color: '#ffffff'
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
            style={{ color: profile.text_color }}
          >
            <Eye size={14} />
            <span>{profile.view_count} views</span>
          </div>
          <p 
            className="text-xs opacity-40 mt-2"
            style={{ color: profile.text_color }}
          >
            Powered by TapyFi
          </p>
        </div>
      </div>
    </div>
  );
}
