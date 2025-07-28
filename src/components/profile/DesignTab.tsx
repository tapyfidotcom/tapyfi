"use client";

import React, { useState } from "react";
import { TabsContent } from "@/components/ui/tabs";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Button } from "@/components/ui/button";
import BackgroundSelector from "@/components/ui/background-selector";
import BackgroundPreview from "@/components/ui/background-preview";
import EnhancedProfilePicture from "@/components/ui/enhanced-profile-picture";
import { platformConfigs } from "@/lib/platform-configs";
import { LinktreeLink } from "@/interfaces/linktree";
import { ProfileFormData, BackgroundSettings } from "@/types/profile";
import { Palette, Save, Check, Loader2 } from "lucide-react";
import toast from "react-hot-toast";

interface DesignTabProps {
  backgroundSettings: BackgroundSettings;
  setBackgroundSettings: (settings: BackgroundSettings) => void;
  profileForm: ProfileFormData;
  setProfileForm: (form: ProfileFormData | ((prev: ProfileFormData) => ProfileFormData)) => void;
  links: LinktreeLink[];
  onSaveBackground?: () => Promise<void>;
}

export default function DesignTab({
  backgroundSettings,
  setBackgroundSettings,
  profileForm,
  setProfileForm,
  links,
  onSaveBackground
}: DesignTabProps) {
  const [savingBackground, setSavingBackground] = useState(false);
  const [backgroundSaved, setBackgroundSaved] = useState(false);

  const handleSaveBackground = async () => {
    if (onSaveBackground) {
      setSavingBackground(true);
      try {
        await onSaveBackground();
        setBackgroundSaved(true);
        toast.success("Background settings saved!");
        setTimeout(() => setBackgroundSaved(false), 2000);
      } catch (error) {
        toast.error("Failed to save background settings");
      } finally {
        setSavingBackground(false);
      }
    }
  };

  // Function to get text contrast for preview
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

  return (
    <TabsContent value="design" className="space-y-6">
      <Card>
        <CardHeader>
          <div className="flex items-center justify-between">
            <CardTitle className="flex items-center gap-2">
              <Palette size={20} />
              Design & Appearance
            </CardTitle>
            <Button 
              onClick={handleSaveBackground}
              disabled={savingBackground}
              className="flex items-center gap-2"
              size="sm"
            >
              {savingBackground ? (
                <Loader2 size={14} className="animate-spin" />
              ) : backgroundSaved ? (
                <Check size={14} />
              ) : (
                <Save size={14} />
              )}
              {savingBackground ? 'Saving...' : backgroundSaved ? 'Saved!' : 'Save Background'}
            </Button>
          </div>
        </CardHeader>
        <CardContent className="space-y-6">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
            <div className="space-y-6">
              <BackgroundSelector
                currentBackground={backgroundSettings}
                onBackgroundChange={setBackgroundSettings}
              />
              
              <Card className="p-4 bg-muted/30">
                <div className="space-y-4">
                  <Label className="text-sm font-medium">Color Scheme</Label>
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                    <div>
                      <Label htmlFor="theme_color" className="text-xs">Button Color</Label>
                      <div className="flex items-center gap-2 mt-1">
                        <Input
                          id="theme_color"
                          type="color"
                          value={profileForm.theme_color}
                          onChange={(e) => setProfileForm((prev: ProfileFormData) => ({ ...prev, theme_color: e.target.value }))}
                          className="w-12 h-10 p-0 border-0 rounded"
                        />
                        <Input
                          type="text"
                          value={profileForm.theme_color}
                          onChange={(e) => setProfileForm((prev: ProfileFormData) => ({ ...prev, theme_color: e.target.value }))}
                          className="text-xs font-mono flex-1"
                        />
                      </div>
                    </div>
                    
                    <div>
                      <Label htmlFor="text_color" className="text-xs">Text Color</Label>
                      <div className="flex items-center gap-2 mt-1">
                        <Input
                          id="text_color"
                          type="color"
                          value={profileForm.text_color}
                          onChange={(e) => setProfileForm((prev: ProfileFormData) => ({ ...prev, text_color: e.target.value }))}
                          className="w-12 h-10 p-0 border-0 rounded"
                        />
                        <Input
                          type="text"
                          value={profileForm.text_color}
                          onChange={(e) => setProfileForm((prev: ProfileFormData) => ({ ...prev, text_color: e.target.value }))}
                          className="text-xs font-mono flex-1"
                        />
                      </div>
                    </div>
                  </div>

                  {/* Quick Color Presets */}
                  <div>
                    <Label className="text-xs mb-2 block">Quick Presets</Label>
                    <div className="flex gap-2 flex-wrap">
                      {[
                        { name: 'Dark Mode', bg: '#000000', text: '#ffffff', theme: '#10b981' },
                        { name: 'Light Mode', bg: '#ffffff', text: '#1a1a1a', theme: '#3b82f6' },
                        { name: 'Ocean', bg: '#0369a1', text: '#ffffff', theme: '#06b6d4' },
                        { name: 'Sunset', bg: '#ea580c', text: '#ffffff', theme: '#f59e0b' },
                        { name: 'Forest', bg: '#16a34a', text: '#ffffff', theme: '#22c55e' },
                      ].map((preset) => (
                        <Button
                          key={preset.name}
                          variant="outline"
                          size="sm"
                          className="text-xs px-2 py-1 h-auto"
                          onClick={() => {
                            // Fix: Properly type the callback functions
                            setBackgroundSettings({
                              ...backgroundSettings,
                              color: preset.bg,
                              type: 'solid'
                            });
                            setProfileForm((prev: ProfileFormData) => ({ 
                              ...prev, 
                              text_color: preset.text, 
                              theme_color: preset.theme,
                              background_color: preset.bg
                            }));
                          }}
                        >
                          <div 
                            className="w-3 h-3 rounded-full mr-1 border"
                            style={{ backgroundColor: preset.bg }}
                          />
                          {preset.name}
                        </Button>
                      ))}
                    </div>
                  </div>
                </div>
              </Card>
            </div>

            <div className="space-y-4">
              <Label className="text-sm font-medium">Live Preview</Label>
              <div className="border rounded-lg overflow-hidden shadow-lg">
                <div 
                  className="aspect-[9/16] max-w-[280px] mx-auto relative"
                >
                  {/* Background */}
                  <div className="absolute inset-0">
                    <BackgroundPreview settings={backgroundSettings} />
                  </div>
                  
                  {/* Content */}
                  <div className="relative z-10 p-6 space-y-4 h-full flex flex-col">
                    <div className="text-center flex-shrink-0">
                      <div className="flex justify-center mb-4">
                        <EnhancedProfilePicture
                          profilePicture={profileForm.profile_picture}
                          companyLogo={profileForm.company_logo}
                          size="md"
                        />
                      </div>
                      
                      <div style={{ color: contrastTextColor }}>
                        <h3 className="font-bold text-lg drop-shadow-sm">
                          {profileForm.display_name || profileForm.username || 'Your Name'}
                        </h3>
                        {profileForm.bio && (
                          <p className="text-sm opacity-90 mt-1 line-clamp-2 drop-shadow-sm">
                            {profileForm.bio}
                          </p>
                        )}
                      </div>
                    </div>

                    <div className="space-y-2 flex-grow flex flex-col justify-center">
                      {links.length > 0 ? (
                        links.slice(0, 3).map((link) => {
                          const config = platformConfigs[link.platform];
                          return (
                            <div
                              key={link.id}
                              className="text-sm p-3 rounded-lg flex items-center justify-center gap-2 font-medium shadow-md"
                              style={{ 
                                backgroundColor: profileForm.theme_color, 
                                color: '#ffffff',
                                border: '1px solid rgba(255,255,255,0.1)'
                              }}
                            >
                              <span>{config?.icon || '🔗'}</span>
                              <span className="truncate">{link.title}</span>
                            </div>
                          );
                        })
                      ) : (
                        <div className="text-center py-6">
                          <div className="text-3xl mb-2 opacity-50">🔗</div>
                          <p className="text-xs opacity-70" style={{ color: contrastTextColor }}>
                            Your links will appear here
                          </p>
                        </div>
                      )}
                      {links.length > 3 && (
                        <div className="text-xs text-center opacity-60" style={{ color: contrastTextColor }}>
                          +{links.length - 3} more links
                        </div>
                      )}
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </CardContent>
      </Card>
    </TabsContent>
  );
}
