"use client";

import React from "react";
import { LinktreeProfile, LinktreeLink } from "@/interfaces/linktree";
import { platformConfigs } from "@/lib/platform-configs";
import { ExternalLink, Eye } from "lucide-react";

interface PublicLinktreeProps {
  profile: LinktreeProfile & { linktree_links: LinktreeLink[] };
}

export default function PublicLinktree({ profile }: PublicLinktreeProps) {
  const handleLinkClick = async (link: LinktreeLink) => {
    // Track click analytics here if needed
    window.open(link.url, '_blank', 'noopener,noreferrer');
  };

  const styles = {
    backgroundColor: profile.background_color,
    color: profile.text_color,
  };

  const buttonStyle = {
    backgroundColor: profile.theme_color,
    color: '#ffffff',
  };

  return (
    <div 
      className="min-h-screen w-full flex flex-col items-center justify-center p-4"
      style={styles}
    >
      <div className="w-full max-w-md mx-auto space-y-6">
        {/* Profile Header */}
        <div className="text-center space-y-4">
          {/* Profile Picture */}
          {profile.profile_picture && (
            <div className="w-24 h-24 mx-auto rounded-full overflow-hidden border-4 border-white/20 shadow-lg">
              <img 
                src={profile.profile_picture} 
                alt={profile.display_name || profile.username}
                className="w-full h-full object-cover"
              />
            </div>
          )}
          
          {/* Company Logo */}
          {profile.company_logo && (
            <div className="w-16 h-16 mx-auto">
              <img 
                src={profile.company_logo} 
                alt="Logo"
                className="w-full h-full object-contain"
              />
            </div>
          )}

          {/* Name and Bio */}
          <div>
            <h1 className="text-2xl font-bold mb-2">
              {profile.display_name || `@${profile.username}`}
            </h1>
            {profile.bio && (
              <p className="text-opacity-80 leading-relaxed">
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
                  style={buttonStyle}
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
          <div className="flex items-center justify-center gap-2 text-sm opacity-60">
            <Eye size={14} />
            <span>{profile.view_count} views</span>
          </div>
          <p className="text-xs opacity-40 mt-2">
            Powered by TapyFi
          </p>
        </div>
      </div>
    </div>
  );
}
