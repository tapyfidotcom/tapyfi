"use client";

import React, { useState, useRef } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import BackgroundWrapper from "@/components/ui/background-wrapper";
import EnhancedProfilePicture from "@/components/ui/enhanced-profile-picture";
import { LinktreeProfile, LinktreeLink } from "@/interfaces/linktree";
import { ProfileFormData, BackgroundSettings } from "@/types/profile";
import { platformConfigs } from "@/lib/platform-configs";
import { Smartphone, Monitor, Eye, ExternalLink, BarChart3, User, RefreshCw } from "lucide-react";

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
  const [previewMode, setPreviewMode] = useState<'mobile' | 'desktop'>('mobile');
  const [refreshKey, setRefreshKey] = useState(0);
  const previewRef = useRef<HTMLDivElement>(null);

  const handleRefresh = () => {
    setRefreshKey(prev => prev + 1);
    
    // Add a visual refresh effect
    if (previewRef.current) {
      previewRef.current.style.opacity = '0.7';
      setTimeout(() => {
        if (previewRef.current) {
          previewRef.current.style.opacity = '1';
        }
      }, 200);
    }
  };

  // Function to determine if text should be light or dark based on background
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

  if (!profile && !profileForm.username) {
    return (
      <div className="xl:col-span-1">
        <div className="sticky top-6">
          <Card className="overflow-hidden">
            <CardContent className="p-8 text-center">
              <User className="mx-auto h-12 w-12 text-muted-foreground mb-4" />
              <p className="text-muted-foreground text-sm">
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
        <Card className="overflow-hidden">
          <CardHeader className="pb-4">
            <div className="flex items-center justify-between">
              <CardTitle className="text-lg flex items-center gap-2">
                <Smartphone size={16} />
                Live Preview
              </CardTitle>
              <div className="flex items-center gap-1">
                <Button 
                  variant="ghost" 
                  size="sm" 
                  className="p-2 h-8 w-8"
                  onClick={handleRefresh}
                  title="Refresh Preview"
                >
                  <RefreshCw size={14} />
                </Button>
                <Button 
                  variant={previewMode === 'mobile' ? 'default' : 'ghost'} 
                  size="sm" 
                  className="p-1 h-8 w-8"
                  onClick={() => setPreviewMode('mobile')}
                >
                  <Smartphone size={14} />
                </Button>
                <Button 
                  variant={previewMode === 'desktop' ? 'default' : 'ghost'}
                  size="sm" 
                  className="p-1 h-8 w-8"
                  onClick={() => setPreviewMode('desktop')}
                >
                  <Monitor size={14} />
                </Button>
              </div>
            </div>
          </CardHeader>
          <CardContent className="p-0">
            {/* Phone/Desktop Frame */}
            <div className="mx-auto bg-gray-100 dark:bg-gray-800 rounded-lg p-3">
              <div 
                ref={previewRef}
                key={refreshKey}
                className={`relative overflow-hidden rounded-lg border-2 border-gray-300 dark:border-gray-600 ${
                  previewMode === 'mobile' ? 'aspect-[9/16] max-w-[280px]' : 'aspect-[16/10] w-full max-w-[400px]'
                } mx-auto bg-white transition-opacity duration-200`}
              >
                {/* Background Layer */}
                <div className="absolute inset-0">
                  <BackgroundWrapper settings={backgroundSettings} />
                </div>
                
                {/* Content Layer */}
                <div className="relative z-10 h-full overflow-y-auto">
                  <div className={`${previewMode === 'mobile' ? 'p-6' : 'p-8'} space-y-6 ${previewMode === 'desktop' ? 'flex flex-col items-center justify-center h-full' : 'min-h-full flex flex-col'}`}>
                    
                    {/* Profile Section */}
                    <div className="text-center space-y-4 flex-shrink-0">
                      <div className="flex justify-center">
                        <EnhancedProfilePicture
                          profilePicture={profileForm.profile_picture}
                          companyLogo={profileForm.company_logo}
                          size={previewMode === 'mobile' ? 'lg' : 'xl'}
                        />
                      </div>
                      
                      <div style={{ color: contrastTextColor }}>
                        <h3 className={`font-bold ${previewMode === 'mobile' ? 'text-xl' : 'text-2xl'} drop-shadow-lg`}>
                          {profileForm.display_name || profileForm.username || 'Your Name'}
                        </h3>
                        {profileForm.bio && (
                          <p className={`opacity-90 mt-2 ${previewMode === 'mobile' ? 'text-sm' : 'text-base'} ${previewMode === 'mobile' ? 'line-clamp-3' : ''} drop-shadow-sm`}>
                            {profileForm.bio}
                          </p>
                        )}
                      </div>
                    </div>

                    {/* Links Section */}
                    <div className={`space-y-3 w-full ${previewMode === 'desktop' ? 'max-w-md' : ''} flex-grow flex flex-col justify-center`}>
                      {links.length > 0 ? (
                        <>
                          {links.slice(0, previewMode === 'mobile' ? 5 : 6).map((link) => {
                            const config = platformConfigs[link.platform];
                            return (
                              <div
                                key={link.id}
                                className={`${previewMode === 'mobile' ? 'text-sm p-3' : 'text-base p-4'} rounded-xl flex items-center justify-between gap-3 font-medium transition-all duration-200 hover:scale-[1.02] cursor-pointer shadow-lg hover:shadow-xl backdrop-blur-sm`}
                                style={{ 
                                  backgroundColor: `${profileForm.theme_color}${backgroundSettings.type !== 'solid' ? 'E6' : ''}`, 
                                  color: '#ffffff',
                                  border: '1px solid rgba(255,255,255,0.2)'
                                }}
                              >
                                <div className="flex items-center gap-3">
                                  <span className={previewMode === 'mobile' ? 'text-lg' : 'text-xl'}>
                                    {config?.icon || '🔗'}
                                  </span>
                                  <span className="truncate font-medium">{link.title}</span>
                                </div>
                                <ExternalLink size={previewMode === 'mobile' ? 14 : 16} className="opacity-70 flex-shrink-0" />
                              </div>
                            );
                          })}
                          {links.length > (previewMode === 'mobile' ? 5 : 6) && (
                            <div className="text-center text-xs opacity-70 mt-2" style={{ color: contrastTextColor }}>
                              +{links.length - (previewMode === 'mobile' ? 5 : 6)} more links
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
              </div>
            </div>

            {/* Stats Section */}
            <div className="p-4 space-y-3 bg-muted/30 rounded-b-lg">
              <div className="flex items-center justify-between text-sm">
                <span className="text-muted-foreground font-medium">Quick Stats</span>
                <Button variant="ghost" size="sm" className="h-6 px-2 text-xs">
                  <BarChart3 size={12} />
                  <span className="ml-1 hidden sm:inline">Analytics</span>
                </Button>
              </div>
              <div className="grid grid-cols-2 gap-3 text-center">
                <div className="p-3 bg-background rounded-lg border shadow-sm">
                  <div className="text-lg font-bold text-primary">{links.length}</div>
                  <div className="text-xs text-muted-foreground">Active Links</div>
                </div>
                <div className="p-3 bg-background rounded-lg border shadow-sm">
                  <div className="text-lg font-bold text-primary">
                    {links.reduce((sum, link) => sum + link.click_count, 0)}
                  </div>
                  <div className="text-xs text-muted-foreground">Total Clicks</div>
                </div>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}
