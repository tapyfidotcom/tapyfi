"use client";

import React, { useState, useRef } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import BackgroundWrapper from "@/components/ui/background-wrapper";
import EnhancedProfilePicture from "@/components/ui/enhanced-profile-picture";
import { LinktreeProfile, LinktreeLink } from "@/interfaces/linktree";
import { ProfileFormData, BackgroundSettings } from "@/types/profile";
import { platformConfigs } from "@/lib/platform-configs";
import { Smartphone, Eye, ExternalLink, BarChart3, User, RefreshCw } from "lucide-react";

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
  links
}: PreviewSidebarProps) {
  const [refreshKey, setRefreshKey] = useState(0);
  const previewRef = useRef<HTMLDivElement>(null);

  const handleRefresh = () => {
    setRefreshKey(prev => prev + 1);
    
    if (previewRef.current) {
      previewRef.current.style.opacity = '0.7';
      setTimeout(() => {
        if (previewRef.current) {
          previewRef.current.style.opacity = '1';
        }
      }, 200);
    }
  };

  const getContrastColor = (bgColor: string, textColor: string): string => {
    if (backgroundSettings.type === 'solid') {
      const hex = bgColor.replace('#', '');
      const r = parseInt(hex.substr(0, 2), 16);
      const g = parseInt(hex.substr(2, 2), 16);
      const b = parseInt(hex.substr(4, 2), 16);
      const brightness = ((r * 299) + (g * 587) + (b * 114)) / 1000;
      
      if (brightness > 128) {
        return textColor === '#000000' ? '#1a1a1a' : textColor;
      }
    }
    return textColor;
  };

  const contrastTextColor = getContrastColor(backgroundSettings.color, profileForm.text_color);

  const getBackgroundDisplayName = () => {
    switch (backgroundSettings.type) {
      case 'solid': return 'Solid Color';
      case 'hyperspeed': return 'Hyperspeed';
      case 'silk': return 'Silk';
      default: return 'Unknown';
    }
  };

  if (!profile && !profileForm.username) {
    return (
      <div className="xl:col-span-1">
        <div className="sticky top-6">
          <Card className="overflow-hidden dark:bg-gray-800 dark:border-gray-700">
            <CardContent className="p-8 text-center">
              <User className="mx-auto h-12 w-12 text-muted-foreground mb-4" />
              <p className="text-muted-foreground text-sm dark:text-gray-400">
                Create your profile to see the live preview
              </p>
            </CardContent>
          </Card>
        </div>
      </div>
    );
  }

  return (
    <div className="xl:col-span-1">
      <div className="sticky top-6">
        <Card className="overflow-hidden dark:bg-gray-800 dark:border-gray-700">
          <CardHeader className="pb-4 border-b dark:border-gray-700">
            <div className="flex items-center justify-between">
              <CardTitle className="text-lg flex items-center gap-2 dark:text-white">
                <Smartphone size={16} />
                Live Preview
              </CardTitle>
              <Button 
                variant="ghost" 
                size="sm" 
                className="p-2 h-8 w-8 dark:hover:bg-gray-700"
                onClick={handleRefresh}
                title="Refresh Preview"
              >
                <RefreshCw size={14} />
              </Button>
            </div>
          </CardHeader>
          <CardContent className="p-0">
            {/* Mobile Phone Frame */}
            <div className="mx-auto bg-gradient-to-br from-gray-800 to-gray-900 rounded-2xl p-4 m-6 shadow-2xl">
              {/* Phone Screen */}
              <div 
                ref={previewRef}
                key={refreshKey}
                className="aspect-[9/16] max-w-[280px] mx-auto relative rounded-2xl overflow-hidden shadow-2xl border-4 border-gray-700 bg-white transition-opacity duration-200"
              >
                {/* Notch */}
                <div className="absolute top-0 left-1/2 transform -translate-x-1/2 w-32 h-6 bg-black rounded-b-2xl z-20"></div>
                
                {/* Background Layer */}
                <div className="absolute inset-0">
                  <BackgroundWrapper settings={backgroundSettings} />
                </div>
                
                {/* Content Layer */}
                <div className="relative z-10 h-full overflow-y-auto">
                  <div className="p-6 space-y-6 min-h-full flex flex-col pt-10">
                    
                    {/* Profile Section */}
                    <div className="text-center space-y-4 flex-shrink-0">
                      <div className="flex justify-center">
                        <EnhancedProfilePicture
                          profilePicture={profileForm.profile_picture}
                          companyLogo={profileForm.company_logo}
                          size="lg"
                        />
                      </div>
                      
                      <div style={{ color: contrastTextColor }}>
                        <h3 className="text-xl font-bold drop-shadow-lg">
                          {profileForm.display_name || profileForm.username || 'Your Name'}
                        </h3>
                        {profileForm.bio && (
                          <p className="text-sm opacity-90 mt-2 line-clamp-3 drop-shadow-sm">
                            {profileForm.bio}
                          </p>
                        )}
                      </div>
                    </div>

                    {/* Links Section */}
                    <div className="space-y-3 w-full flex-grow flex flex-col justify-center">
                      {links.length > 0 ? (
                        <>
                          {links.slice(0, 5).map((link) => {
                            const config = platformConfigs[link.platform];
                            return (
                              <div
                                key={link.id}
                                className="text-sm p-3 rounded-xl flex items-center justify-between gap-3 font-medium transition-all duration-200 hover:scale-[1.02] cursor-pointer shadow-lg hover:shadow-xl backdrop-blur-sm"
                                style={{ 
                                  backgroundColor: `${profileForm.theme_color}${backgroundSettings.type !== 'solid' ? 'E6' : ''}`, 
                                  color: '#ffffff',
                                  border: '1px solid rgba(255,255,255,0.2)'
                                }}
                              >
                                <div className="flex items-center gap-3">
                                  <span className="text-lg">
                                    {config?.icon || '🔗'}
                                  </span>
                                  <span className="truncate font-medium">{link.title}</span>
                                </div>
                                <ExternalLink size={14} className="opacity-70 flex-shrink-0" />
                              </div>
                            );
                          })}
                          {links.length > 5 && (
                            <div className="text-center text-xs opacity-70 mt-2" style={{ color: contrastTextColor }}>
                              +{links.length - 5} more links
                            </div>
                          )}
                        </>
                      ) : (
                        <div className="text-center py-8">
                          <div className="text-4xl mb-3 opacity-50">🔗</div>
                          <p className="text-sm opacity-70" style={{ color: contrastTextColor }}>
                            Add your first link to see it here
                          </p>
                        </div>
                      )}
                    </div>

                    {/* Footer */}
                    <div className="text-center pt-4 flex-shrink-0">
                      <div className="flex items-center justify-center gap-2 text-xs opacity-60" style={{ color: contrastTextColor }}>
                        <Eye size={12} />
                        <span>{profile?.view_count || 0} views</span>
                      </div>
                      <p className="text-xs opacity-40 mt-1 drop-shadow-sm" style={{ color: contrastTextColor }}>
                        Powered by TapyFi
                      </p>
                    </div>
                  </div>
                </div>

                {/* Background Type Indicator */}
                <div className="absolute bottom-3 right-3 text-xs text-white/90 bg-black/50 backdrop-blur-sm px-2 py-1 rounded-full border border-white/20">
                  {getBackgroundDisplayName()}
                </div>
              </div>
            </div>

            {/* Stats Section */}
            <div className="p-6 space-y-4 bg-muted/30 rounded-b-lg dark:bg-gray-900/50">
              <div className="flex items-center justify-between text-sm">
                <span className="text-muted-foreground font-medium dark:text-gray-400">Quick Stats</span>
                <Button variant="ghost" size="sm" className="h-6 px-2 text-xs dark:hover:bg-gray-700">
                  <BarChart3 size={12} />
                  <span className="ml-1 hidden sm:inline">Analytics</span>
                </Button>
              </div>
              <div className="grid grid-cols-2 gap-3 text-center">
                <div className="p-3 bg-background rounded-lg border shadow-sm dark:bg-gray-800 dark:border-gray-600">
                  <div className="text-lg font-bold text-primary">{links.length}</div>
                  <div className="text-xs text-muted-foreground dark:text-gray-400">Active Links</div>
                </div>
                <div className="p-3 bg-background rounded-lg border shadow-sm dark:bg-gray-800 dark:border-gray-600">
                  <div className="text-lg font-bold text-primary">
                    {links.reduce((sum, link) => sum + link.click_count, 0)}
                  </div>
                  <div className="text-xs text-muted-foreground dark:text-gray-400">Total Clicks</div>
                </div>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}
