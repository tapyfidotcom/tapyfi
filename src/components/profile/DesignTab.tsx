"use client";

import React, { useState } from "react";
import { TabsContent } from "@/components/ui/tabs";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Button } from "@/components/ui/button";
import { Separator } from "@/components/ui/separator";
import BackgroundSelector from "@/components/ui/background-selector";
import { LinktreeLink, LinktreeProfile } from "@/interfaces/linktree";
import { ProfileFormData, BackgroundSettings, getPrimaryBackgroundColor } from "@/types/profile";
import { 
  Palette, 
  Save, 
  Check, 
  Loader2, 
  Sparkles
} from "lucide-react";
import toast from "react-hot-toast";

interface DesignTabProps {
  backgroundSettings: BackgroundSettings;
  setBackgroundSettings: (settings: BackgroundSettings) => void;
  profileForm: ProfileFormData;
  setProfileForm: (form: ProfileFormData | ((prev: ProfileFormData) => ProfileFormData)) => void;
  links: LinktreeLink[];
  profile: LinktreeProfile | null;
  onSaveBackground?: () => Promise<void>;
}

export default function DesignTab({
  backgroundSettings,
  setBackgroundSettings,
  profileForm,
  setProfileForm,
  links,
  profile,
  onSaveBackground
}: DesignTabProps) {
  const [savingBackground, setSavingBackground] = useState(false);
  const [backgroundSaved, setBackgroundSaved] = useState(false);

  const handleSaveBackground = async () => {
    if (onSaveBackground) {
      setSavingBackground(true);
      try {
        setProfileForm((prev: ProfileFormData) => ({
          ...prev,
          background_color: getPrimaryBackgroundColor(backgroundSettings.color),
          background_settings: JSON.stringify(backgroundSettings)
        }));
        
        await onSaveBackground();
        setBackgroundSaved(true);
        toast.success("Background settings saved successfully!");
        setTimeout(() => setBackgroundSaved(false), 3000);
      } catch (error) {
        toast.error("Failed to save background settings");
      } finally {
        setSavingBackground(false);
      }
    }
  };

  const colorPresets = [
    { name: 'Midnight', bg: '#0f172a', text: '#f8fafc', theme: '#3b82f6' },
    { name: 'Ocean', bg: '#0c4a6e', text: '#f0f9ff', theme: '#0ea5e9' },
    { name: 'Forest', bg: '#14532d', text: '#f0fdf4', theme: '#22c55e' },
    { name: 'Sunset', bg: '#ea580c', text: '#fff7ed', theme: '#f97316' },
    { name: 'Purple', bg: '#581c87', text: '#faf5ff', theme: '#a855f7' },
    { name: 'Rose', bg: '#881337', text: '#fff1f2', theme: '#f43f5e' },
    { name: 'Clean', bg: '#ffffff', text: '#1f2937', theme: '#6366f1' },
    { name: 'Dark', bg: '#000000', text: '#f8fafc', theme: '#10b981' },
  ];

  return (
    <TabsContent value="design" className="space-y-6">
      <style jsx>{`
        .circular-color-picker {
          -webkit-appearance: none;
          -moz-appearance: none;
          appearance: none;
          width: 64px;
          height: 64px;
          background-color: transparent;
          border: none;
          cursor: pointer;
          padding: 0;
          outline: none;
        }
        
        .circular-color-picker::-webkit-color-swatch {
          border-radius: 50%;
          border: 2px solid #e5e7eb;
          box-shadow: 0 10px 15px -3px rgba(0, 0, 0, 0.1), 0 4px 6px -2px rgba(0, 0, 0, 0.05);
        }
        
        .circular-color-picker::-moz-color-swatch {
          border-radius: 50%;
          border: 2px solid #e5e7eb;
          box-shadow: 0 10px 15px -3px rgba(0, 0, 0, 0.1), 0 4px 6px -2px rgba(0, 0, 0, 0.05);
        }
        
        .circular-color-picker:hover::-webkit-color-swatch {
          border-color: #d1d5db;
          box-shadow: 0 20px 25px -5px rgba(0, 0, 0, 0.1), 0 10px 10px -5px rgba(0, 0, 0, 0.04);
        }
        
        .circular-color-picker:hover::-moz-color-swatch {
          border-color: #d1d5db;
          box-shadow: 0 20px 25px -5px rgba(0, 0, 0, 0.1), 0 10px 10px -5px rgba(0, 0, 0, 0.04);
        }
      `}</style>

      {/* Design Settings Card */}
      <Card className="overflow-hidden bg-gradient-to-br from-card to-card/50 dark:from-gray-800 dark:to-gray-900 shadow-xl">
        <CardHeader className="bg-gradient-to-r from-primary/5 to-primary/10 border-b dark:border-gray-700">
          <div className="flex items-center justify-between">
            <CardTitle className="flex items-center gap-2 dark:text-white">
              <Palette size={20} />
              Design & Appearance
            </CardTitle>
            <Button 
              onClick={handleSaveBackground}
              disabled={savingBackground}
              className="flex items-center gap-2 shadow-sm"
              size="sm"
            >
              {savingBackground ? (
                <Loader2 size={14} className="animate-spin" />
              ) : backgroundSaved ? (
                <Check size={14} />
              ) : (
                <Save size={14} />
              )}
              {savingBackground ? 'Saving...' : backgroundSaved ? 'Saved!' : 'Save Design'}
            </Button>
          </div>
        </CardHeader>
        <CardContent className="p-8 space-y-8">
          {/* Background Settings */}
          <div className="space-y-6">
            <BackgroundSelector
              currentBackground={backgroundSettings}
              onBackgroundChange={setBackgroundSettings}
            />
            
            <Separator className="dark:border-gray-700" />

            {/* Color Scheme */}
            <div className="space-y-6">
              <Label className="text-sm font-medium flex items-center gap-2 dark:text-white">
                <Sparkles size={16} />
                Color Scheme
              </Label>
              
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
                <div>
                  <Label htmlFor="theme_color" className="text-xs font-medium dark:text-gray-300">Button Color</Label>
                  <div className="flex items-center gap-3 mt-2">
                    <div className="relative">
                      <input
                        id="theme_color"
                        type="color"
                        value={profileForm.theme_color}
                        onChange={(e) => setProfileForm((prev: ProfileFormData) => ({ ...prev, theme_color: e.target.value }))}
                        className="circular-color-picker transition-all duration-200"
                      />
                      <div className="absolute inset-0 rounded-full ring-2 ring-primary/20 pointer-events-none opacity-0 hover:opacity-100 transition-opacity" />
                    </div>
                    <Input
                      type="text"
                      value={profileForm.theme_color}
                      onChange={(e) => setProfileForm((prev: ProfileFormData) => ({ ...prev, theme_color: e.target.value }))}
                      className="text-xs font-mono flex-1 dark:bg-gray-800 dark:border-gray-600"
                    />
                  </div>
                </div>
                
                <div>
                  <Label htmlFor="text_color" className="text-xs font-medium dark:text-gray-300">Text Color</Label>
                  <div className="flex items-center gap-3 mt-2">
                    <div className="relative">
                      <input
                        id="text_color"
                        type="color"
                        value={profileForm.text_color}
                        onChange={(e) => setProfileForm((prev: ProfileFormData) => ({ ...prev, text_color: e.target.value }))}
                        className="circular-color-picker transition-all duration-200"
                      />
                      <div className="absolute inset-0 rounded-full ring-2 ring-primary/20 pointer-events-none opacity-0 hover:opacity-100 transition-opacity" />
                    </div>
                    <Input
                      type="text"
                      value={profileForm.text_color}
                      onChange={(e) => setProfileForm((prev: ProfileFormData) => ({ ...prev, text_color: e.target.value }))}
                      className="text-xs font-mono flex-1 dark:bg-gray-800 dark:border-gray-600"
                    />
                  </div>
                </div>
              </div>

              {/* Color Presets */}
              <div>
                <Label className="text-xs mb-4 block font-medium dark:text-gray-300">Quick Presets</Label>
                <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
                  {colorPresets.map((preset) => (
                    <Button
                      key={preset.name}
                      variant="outline"
                      size="sm"
                      className="h-auto p-4 flex flex-col gap-3 hover:scale-105 transition-all duration-200 dark:border-gray-600 dark:hover:bg-gray-800"
                      onClick={() => {
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
                        className="w-10 h-10 rounded-full border-2 border-white shadow-sm"
                        style={{ backgroundColor: preset.bg }}
                      />
                      <span className="text-xs font-medium dark:text-gray-300">{preset.name}</span>
                    </Button>
                  ))}
                </div>
              </div>
            </div>
          </div>
        </CardContent>
      </Card>
    </TabsContent>
  );
}
