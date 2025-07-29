"use client";

import React, { useState, useRef } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import BackgroundWrapper from "@/components/ui/background-wrapper";
import EnhancedProfilePicture from "@/components/ui/enhanced-profile-picture";
import { LinktreeProfile, LinktreeLink } from "@/interfaces/linktree";
import { ProfileFormData, BackgroundSettings } from "@/types/profile";
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
  X
} from "lucide-react";

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
  const [isFullscreen, setIsFullscreen] = useState(false);
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
      case 'squares': return 'Animated Squares';
      default: return 'Unknown';
    }
  };

  const getBackgroundIcon = () => {
    switch (backgroundSettings.type) {
      case 'hyperspeed': return '🚀';
      case 'silk': return '✨';
      case 'squares': return '⬜';
      default: return '🎨';
    }
  };

  if (!profile && !profileForm.username) {
    return (
      <div className="xl:col-span-1">
        <div className="sticky top-6">
          <Card className="overflow-hidden border-2 border-dashed border-gray-200 dark:border-gray-700 bg-gradient-to-br from-gray-50 to-gray-100 dark:from-gray-800 dark:to-gray-900">
            <CardContent className="p-8 text-center">
              <div className="animate-pulse">
                <User className="mx-auto h-16 w-16 text-gray-300 dark:text-gray-600 mb-6" />
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
    <div className="xl:col-span-1">
      <div className="sticky top-6">
        <Card className="overflow-hidden shadow-xl border-0 bg-white/90 dark:bg-gray-900/90 backdrop-blur-sm">
          {/* Enhanced Header */}
          <CardHeader className="pb-3 border-b border-gray-100 dark:border-gray-800 bg-gradient-to-r from-indigo-50 to-purple-50 dark:from-gray-800 dark:to-gray-900">
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-3">
                <div className="relative">
                  <Eye size={18} className="text-indigo-600 dark:text-indigo-400" />
                  <Sparkles size={10} className="absolute -top-1 -right-1 text-purple-500 animate-pulse" />
                </div>
                <div>
                  <CardTitle className="text-lg font-bold bg-gradient-to-r from-indigo-600 to-purple-600 bg-clip-text text-transparent">
                    Live Preview
                  </CardTitle>
                  <p className="text-xs text-muted-foreground">Real-time updates</p>
                </div>
              </div>
              <div className="flex items-center gap-1">
                <Button 
                  variant="ghost" 
                  size="sm" 
                  className="p-2 h-8 w-8 hover:bg-indigo-100 dark:hover:bg-gray-700 transition-colors"
                  onClick={() => setIsFullscreen(!isFullscreen)}
                  title={isFullscreen ? "Exit Fullscreen" : "Fullscreen Preview"}
                >
                  {isFullscreen ? <Minimize2 size={14} /> : <Maximize2 size={14} />}
                </Button>
                <Button 
                  variant="ghost" 
                  size="sm" 
                  className="p-2 h-8 w-8 hover:bg-indigo-100 dark:hover:bg-gray-700 transition-colors"
                  onClick={handleRefresh}
                  title="Refresh Preview"
                >
                  <RefreshCw size={14} className={refreshKey > 0 ? 'animate-spin' : ''} />
                </Button>
              </div>
            </div>
          </CardHeader>

          <CardContent className="p-0">
            {/* Enhanced Preview Container */}
            <div 
              ref={previewRef}
              key={refreshKey}
              className={`relative transition-all duration-500 ease-in-out ${
                isFullscreen 
                  ? 'fixed inset-0 z-50' 
                  : 'aspect-[9/16] max-h-[650px]'
              }`}
            >
              {/* Background Layer */}
              <div className="absolute inset-0 overflow-hidden">
                <BackgroundWrapper settings={backgroundSettings} />
              </div>
              
              {/* Content Layer with better overflow handling */}
              <div className="relative z-10 h-full">
                <div className={`h-full flex flex-col ${
                  isFullscreen ? 'max-w-sm mx-auto p-8' : 'p-4'
                }`}>
                  
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
                  
                  {/* Profile Section - Fixed Height */}
                  <div className={`text-center flex-shrink-0 ${
                    isFullscreen ? 'pt-8 pb-6' : 'pt-6 pb-4'
                  }`}>
                    <div className="flex justify-center mb-4">
                      <EnhancedProfilePicture
                        profilePicture={profileForm.profile_picture}
                        companyLogo={profileForm.company_logo}
                        size={isFullscreen ? "xl" : "lg"}
                      />
                    </div>
                    
                    <div style={{ color: contrastTextColor }} className="space-y-2">
                      <h3 className={`font-bold drop-shadow-lg line-clamp-1 ${
                        isFullscreen ? 'text-2xl' : 'text-lg'
                      }`}>
                        {profileForm.display_name || profileForm.username || 'Your Name'}
                      </h3>
                      {profileForm.bio && (
                        <p className={`opacity-90 line-clamp-2 drop-shadow-sm leading-tight ${
                          isFullscreen ? 'text-sm max-w-xs mx-auto' : 'text-xs'
                        }`}>
                          {profileForm.bio}
                        </p>
                      )}
                    </div>
                  </div>

                  {/* Links Section - Scrollable */}
                  <div className="flex-1 min-h-0 overflow-y-auto scrollbar-hide">
                    <div className="space-y-2.5 pb-4">
                      {links.length > 0 ? (
                        <>
                          {links.slice(0, isFullscreen ? 12 : 6).map((link, index) => {
                            const config = platformConfigs[link.platform];
                            return (
                              <div
                                key={link.id}
                                className={`group relative overflow-hidden rounded-xl transition-all duration-300 hover:scale-[1.02] cursor-pointer shadow-md hover:shadow-lg ${
                                  isFullscreen ? 'p-4' : 'p-3'
                                }`}
                                style={{ 
                                  backgroundColor: `${profileForm.theme_color}${backgroundSettings.type !== 'solid' ? 'E6' : ''}`, 
                                  animationDelay: `${index * 100}ms`
                                }}
                              >
                                {/* Hover effect overlay */}
                                <div className="absolute inset-0 bg-white/10 opacity-0 group-hover:opacity-100 transition-opacity duration-300"></div>
                                
                                <div className="relative flex items-center justify-between gap-3">
                                  <div className="flex items-center gap-3 min-w-0 flex-1">
                                    <div className={`flex-shrink-0 ${
                                      isFullscreen ? 'text-xl' : 'text-lg'
                                    }`}>
                                      {config?.icon || '🔗'}
                                    </div>
                                    <span className={`font-medium text-white truncate ${
                                      isFullscreen ? 'text-base' : 'text-sm'
                                    }`}>
                                      {link.title}
                                    </span>
                                  </div>
                                  <ExternalLink 
                                    size={isFullscreen ? 16 : 14} 
                                    className="text-white/70 group-hover:text-white/100 transition-colors flex-shrink-0" 
                                  />
                                </div>
                              </div>
                            );
                          })}
                          {links.length > (isFullscreen ? 12 : 6) && (
                            <div className="text-center py-2">
                              <Badge 
                                variant="secondary" 
                                className="bg-black/20 text-white border-0 backdrop-blur-sm"
                              >
                                +{links.length - (isFullscreen ? 12 : 6)} more links
                              </Badge>
                            </div>
                          )}
                        </>
                      ) : (
                        <div className="text-center py-8">
                          <div className={`mb-3 opacity-50 ${isFullscreen ? 'text-5xl' : 'text-3xl'}`}>
                            🔗
                          </div>
                          <p className={`opacity-70 ${isFullscreen ? 'text-sm' : 'text-xs'}`} 
                             style={{ color: contrastTextColor }}>
                            Add your first link to see it here
                          </p>
                        </div>
                      )}
                    </div>
                  </div>

                  {/* Footer - Fixed */}
                  <div className={`text-center flex-shrink-0 ${
                    isFullscreen ? 'pt-4' : 'pt-3'
                  }`}>
                    <div className={`flex items-center justify-center gap-2 opacity-70 mb-1 ${
                      isFullscreen ? 'text-xs' : 'text-xs'
                    }`} style={{ color: contrastTextColor }}>
                      <Eye size={12} />
                      <span>{profile?.view_count || 0} views</span>
                    </div>
                    <p className={`opacity-50 drop-shadow-sm ${
                      isFullscreen ? 'text-xs' : 'text-xs'
                    }`} style={{ color: contrastTextColor }}>
                      Powered by TapyFi
                    </p>
                  </div>
                </div>
              </div>
            </div>

            {/* Enhanced Stats Section */}
            {!isFullscreen && (
              <div className="p-4 space-y-4 bg-gradient-to-br from-gray-50 to-indigo-50 dark:from-gray-800 dark:to-gray-900 border-t border-gray-100 dark:border-gray-800">
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-2">
                    <TrendingUp size={14} className="text-indigo-600" />
                    <span className="text-sm font-semibold text-gray-700 dark:text-gray-300">
                      Analytics
                    </span>
                  </div>
                  <Button 
                    variant="ghost" 
                    size="sm" 
                    className="h-7 px-3 text-xs hover:bg-indigo-100 dark:hover:bg-gray-700"
                  >
                    <BarChart3 size={12} />
                    <span className="ml-1">View All</span>
                  </Button>
                </div>
                
                <div className="grid grid-cols-2 gap-3">
                  <div className="bg-white dark:bg-gray-800 rounded-xl p-3 shadow-sm border border-gray-100 dark:border-gray-700 hover:shadow-md transition-shadow">
                    <div className="flex items-center justify-between mb-1">
                      <div className="text-2xl font-bold text-indigo-600">{links.length}</div>
                      <div className="p-1.5 bg-indigo-100 dark:bg-indigo-900 rounded-lg">
                        <ExternalLink size={12} className="text-indigo-600 dark:text-indigo-400" />
                      </div>
                    </div>
                    <div className="text-xs text-gray-600 dark:text-gray-400 font-medium">Active Links</div>
                  </div>
                  
                  <div className="bg-white dark:bg-gray-800 rounded-xl p-3 shadow-sm border border-gray-100 dark:border-gray-700 hover:shadow-md transition-shadow">
                    <div className="flex items-center justify-between mb-1">
                      <div className="text-2xl font-bold text-purple-600">
                        {links.reduce((sum, link) => sum + link.click_count, 0)}
                      </div>
                      <div className="p-1.5 bg-purple-100 dark:bg-purple-900 rounded-lg">
                        <TrendingUp size={12} className="text-purple-600 dark:text-purple-400" />
                      </div>
                    </div>
                    <div className="text-xs text-gray-600 dark:text-gray-400 font-medium">Total Clicks</div>
                  </div>
                </div>

                {/* Enhanced Background Type Indicator */}
                <div className="flex justify-center pt-2">
                  <div className="bg-black/60 backdrop-blur-md px-3 py-1.5 rounded-full border border-white/20">
                    <div className="flex items-center gap-2 text-white text-xs">
                      <span>{getBackgroundIcon()}</span>
                      <span className="font-medium">{getBackgroundDisplayName()}</span>
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
