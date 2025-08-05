"use client";

import React, { useState } from "react";
import { TabsContent } from "@/components/ui/tabs";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Button } from "@/components/ui/button";
import BackgroundSelector from "@/components/ui/background-selector";
import { LinktreeLink, LinktreeProfile } from "@/interfaces/linktree";
import { ProfileFormData, BackgroundSettings, getPrimaryBackgroundColor } from "@/types/profile";
import { 
  Palette, 
  Save, 
  Check, 
  Loader2
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

  return (
    <TabsContent value="design" className="space-y-4">
      <div className="space-y-4">
        {/* Header - Perfect Glass Effect */}
        <div className="flex items-center justify-between pb-4 border-b border-gray-200/50 dark:border-gray-700/50">
          <div className="flex items-center gap-2">
            <Palette size={18} className="text-primary" />
            <h2 className="text-lg font-semibold text-gray-900 dark:text-gray-100">Design & Appearance</h2>
          </div>
          <Button 
            onClick={handleSaveBackground}
            disabled={savingBackground}
            size="sm"
            className="h-8 px-3 text-xs rounded-full bg-gradient-to-r from-blue-600 to-purple-600 hover:from-blue-700 hover:to-purple-700 shadow-md hover:shadow-lg transition-all duration-200 text-white font-medium"
          >
            {savingBackground ? (
              <>
                <Loader2 size={12} className="mr-1 animate-spin" />
                Saving...
              </>
            ) : backgroundSaved ? (
              <>
                <Check size={12} className="mr-1" />
                Saved!
              </>
            ) : (
              <>
                <Save size={12} className="mr-1" />
                Save
              </>
            )}
          </Button>
        </div>

        {/* Main Content Card - Perfect Glass Effect */}
        <div className="bg-white/80 dark:bg-gray-800 backdrop-blur-xl border border-white/20 dark:border-gray-300/20 rounded-lg p-4 lg:p-6 shadow-lg">
          {/* Background Settings Section */}
          <div className="space-y-4">
            <div className="flex items-center gap-2 mb-4">
              <Palette size={16} className="text-primary" />
              <Label className="text-sm font-semibold text-gray-900 dark:text-gray-100">
                Background Settings
              </Label>
            </div>
            
            <BackgroundSelector
              currentBackground={backgroundSettings}
              onBackgroundChange={setBackgroundSettings}
              profileId={profile?.id?.toString()}
            />
          </div>

          {/* Color Scheme Section - Perfect Glass Effect */}
          <div className="space-y-4 pt-6 border-t border-gray-200/50 dark:border-gray-700/50">
            <Label className="text-sm font-semibold text-gray-900 dark:text-gray-100 flex items-center gap-2">
              <div className="w-3 h-3 bg-gradient-to-r from-blue-500 to-purple-500 rounded-full"></div>
              Color Scheme
            </Label>
            
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              {/* Button Color - Perfect Glass Effect */}
              <div className="space-y-2">
                <Label htmlFor="theme_color" className="text-xs font-medium text-gray-700 dark:text-gray-300">
                  Button Color
                </Label>
                <div className="flex items-center gap-3">
                  <div className="relative">
                    <input
                      id="theme_color"
                      type="color"
                      value={Array.isArray(profileForm.theme_color) ? profileForm.theme_color[0] : profileForm.theme_color}
                      onChange={(e) => setProfileForm((prev: ProfileFormData) => ({ 
                        ...prev, 
                        theme_color: e.target.value 
                      }))}
                      className="w-10 h-8 lg:w-12 lg:h-10 rounded-lg border border-white/30 dark:border-gray-300/30 cursor-pointer bg-white/30 dark:bg-gray-100/30 backdrop-blur-sm hover:border-indigo-400/60 transition-colors shadow-sm"
                    />
                  </div>
                  <Input
                    type="text"
                    value={Array.isArray(profileForm.theme_color) ? profileForm.theme_color[0] : profileForm.theme_color}
                    onChange={(e) => setProfileForm((prev: ProfileFormData) => ({ 
                      ...prev, 
                      theme_color: e.target.value 
                    }))}
                    className="text-xs lg:text-sm font-mono flex-1 bg-white/30 dark:bg-gray-100/30 backdrop-blur-sm border border-white/30 dark:border-gray-300/30 text-gray-900 dark:text-gray-100 placeholder:text-gray-500 dark:placeholder:text-gray-400 hover:border-indigo-400/60 focus:border-indigo-500 focus:ring-1 focus:ring-indigo-500/30 transition-colors"
                    placeholder="#6366f1"
                  />
                </div>
              </div>
              
              {/* Text Color - Perfect Glass Effect */}
              <div className="space-y-2">
                <Label htmlFor="text_color" className="text-xs font-medium text-gray-700 dark:text-gray-300">
                  Text Color
                </Label>
                <div className="flex items-center gap-3">
                  <div className="relative">
                    <input
                      id="text_color"
                      type="color"
                      value={Array.isArray(profileForm.text_color) ? profileForm.text_color[0] : profileForm.text_color}
                      onChange={(e) => setProfileForm((prev: ProfileFormData) => ({ 
                        ...prev, 
                        text_color: e.target.value 
                      }))}
                      className="w-10 h-8 lg:w-12 lg:h-10 rounded-lg border border-white/30 dark:border-gray-300/30 cursor-pointer bg-white/30 dark:bg-gray-100/30 backdrop-blur-sm hover:border-indigo-400/60 transition-colors shadow-sm"
                    />
                  </div>
                  <Input
                    type="text"
                    value={Array.isArray(profileForm.text_color) ? profileForm.text_color[0] : profileForm.text_color}
                    onChange={(e) => setProfileForm((prev: ProfileFormData) => ({ 
                      ...prev, 
                      text_color: e.target.value 
                    }))}
                    className="text-xs lg:text-sm font-mono flex-1 bg-white/30 dark:bg-gray-100/30 backdrop-blur-sm border border-white/30 dark:border-gray-300/30 text-gray-900 dark:text-gray-100 placeholder:text-gray-500 dark:placeholder:text-gray-400 hover:border-indigo-400/60 focus:border-indigo-500 focus:ring-1 focus:ring-indigo-500/30 transition-colors"
                    placeholder="#ffffff"
                  />
                </div>
              </div>
            </div>
          </div>

          {/* Save Button for Mobile - Perfect Glass Effect */}
          <div className="pt-4 border-t border-gray-200/50 dark:border-gray-700/50 lg:hidden">
            <Button 
              onClick={handleSaveBackground}
              disabled={savingBackground}
              className="w-full bg-gradient-to-r from-indigo-500 to-purple-600 hover:from-indigo-600 hover:to-purple-700 text-white font-medium py-2.5 px-6 rounded-lg shadow-md hover:shadow-lg transition-all duration-200 disabled:opacity-50 disabled:cursor-not-allowed text-sm"
            >
              {savingBackground ? (
                <>
                  <Loader2 size={14} className="mr-2 animate-spin" />
                  Saving...
                </>
              ) : backgroundSaved ? (
                <>
                  <Check size={14} className="mr-2" />
                  Saved!
                </>
              ) : (
                <>
                  <Save size={14} className="mr-2" />
                  Save Design
                </>
              )}
            </Button>
          </div>
        </div>
      </div>
    </TabsContent>
  );
}
