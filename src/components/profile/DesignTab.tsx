"use client";

import React, { useState } from "react";
import { TabsContent } from "@/components/ui/tabs";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Button } from "@/components/ui/button";
import { Separator } from "@/components/ui/separator";
import BackgroundSelector from "@/components/ui/background-selector";
import BackgroundWrapper from "@/components/ui/background-wrapper";
import { LinktreeLink } from "@/interfaces/linktree";
import { ProfileFormData, BackgroundSettings } from "@/types/profile";
import { Palette, Save, Check, Loader2, Sparkles, Eye } from "lucide-react";
import toast from "react-hot-toast";

interface DesignTabProps {
  backgroundSettings: BackgroundSettings;
  setBackgroundSettings: (settings: BackgroundSettings) => void;
  profileForm: ProfileFormData;
  setProfileForm: (
    form: ProfileFormData | ((prev: ProfileFormData) => ProfileFormData)
  ) => void;
  links: LinktreeLink[];
  onSaveBackground?: () => Promise<void>;
}

export default function DesignTab({
  backgroundSettings,
  setBackgroundSettings,
  profileForm,
  setProfileForm,
  links,
  onSaveBackground,
}: DesignTabProps) {
  const [savingBackground, setSavingBackground] = useState(false);
  const [backgroundSaved, setBackgroundSaved] = useState(false);

  const handleSaveBackground = async () => {
    if (onSaveBackground) {
      setSavingBackground(true);
      try {
        // Update background_color to match the background settings color
        setProfileForm((prev: ProfileFormData) => ({
          ...prev,
          background_color: backgroundSettings.color,
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
    { name: "Midnight", bg: "#0f172a", text: "#f8fafc", theme: "#3b82f6" },
    { name: "Ocean", bg: "#0c4a6e", text: "#f0f9ff", theme: "#0ea5e9" },
    { name: "Forest", bg: "#14532d", text: "#f0fdf4", theme: "#22c55e" },
    { name: "Sunset", bg: "#ea580c", text: "#fff7ed", theme: "#f97316" },
    { name: "Purple", bg: "#581c87", text: "#faf5ff", theme: "#a855f7" },
    { name: "Rose", bg: "#881337", text: "#fff1f2", theme: "#f43f5e" },
    { name: "Clean", bg: "#ffffff", text: "#1f2937", theme: "#6366f1" },
    { name: "Dark", bg: "#000000", text: "#f8fafc", theme: "#10b981" },
  ];

  const backgroundTypes = [
    { type: "solid", name: "Solid Color", category: "Basic" },
    { type: "hyperspeed", name: "Hyperspeed", category: "Motion" },
  ] as const;

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
          box-shadow: 0 10px 15px -3px rgba(0, 0, 0, 0.1),
            0 4px 6px -2px rgba(0, 0, 0, 0.05);
        }

        .circular-color-picker::-moz-color-swatch {
          border-radius: 50%;
          border: 2px solid #e5e7eb;
          box-shadow: 0 10px 15px -3px rgba(0, 0, 0, 0.1),
            0 4px 6px -2px rgba(0, 0, 0, 0.05);
        }

        .circular-color-picker:hover::-webkit-color-swatch {
          border-color: #d1d5db;
          box-shadow: 0 20px 25px -5px rgba(0, 0, 0, 0.1),
            0 10px 10px -5px rgba(0, 0, 0, 0.04);
        }

        .circular-color-picker:hover::-moz-color-swatch {
          border-color: #d1d5db;
          box-shadow: 0 20px 25px -5px rgba(0, 0, 0, 0.1),
            0 10px 10px -5px rgba(0, 0, 0, 0.04);
        }

        .circular-color-picker-ring:hover {
          opacity: 1 !important;
        }
      `}</style>

      <Card className="overflow-hidden bg-gradient-to-br from-card to-card/50">
        <CardHeader className="bg-gradient-to-r from-primary/5 to-primary/10 border-b">
          <div className="flex items-center justify-between">
            <CardTitle className="flex items-center gap-2">
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
              {savingBackground
                ? "Saving..."
                : backgroundSaved
                ? "Saved!"
                : "Save Background"}
            </Button>
          </div>
        </CardHeader>
        <CardContent className="p-6 space-y-8">
          <div className="grid grid-cols-1 xl:grid-cols-2 gap-8">
            {/* Background Settings */}
            <div className="space-y-6">
              <BackgroundSelector
                currentBackground={backgroundSettings}
                onBackgroundChange={setBackgroundSettings}
              />

              <Separator />

              {/* Color Scheme */}
              <div className="space-y-4">
                <Label className="text-sm font-medium flex items-center gap-2">
                  <Sparkles size={16} />
                  Color Scheme
                </Label>

                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  <div>
                    <Label
                      htmlFor="theme_color"
                      className="text-xs font-medium"
                    >
                      Button Color
                    </Label>
                    <div className="flex items-center gap-3 mt-2">
                      <div className="relative">
                        <input
                          id="theme_color"
                          type="color"
                          value={profileForm.theme_color}
                          onChange={(e) =>
                            setProfileForm((prev: ProfileFormData) => ({
                              ...prev,
                              theme_color: e.target.value,
                            }))
                          }
                          className="circular-color-picker transition-all duration-200"
                        />
                        <div className="absolute inset-0 rounded-full ring-2 ring-primary/20 pointer-events-none opacity-0 circular-color-picker-ring transition-opacity" />
                      </div>
                      <Input
                        type="text"
                        value={profileForm.theme_color}
                        onChange={(e) =>
                          setProfileForm((prev: ProfileFormData) => ({
                            ...prev,
                            theme_color: e.target.value,
                          }))
                        }
                        className="text-xs font-mono flex-1"
                      />
                    </div>
                  </div>

                  <div>
                    <Label htmlFor="text_color" className="text-xs font-medium">
                      Text Color
                    </Label>
                    <div className="flex items-center gap-3 mt-2">
                      <div className="relative">
                        <input
                          id="text_color"
                          type="color"
                          value={profileForm.text_color}
                          onChange={(e) =>
                            setProfileForm((prev: ProfileFormData) => ({
                              ...prev,
                              text_color: e.target.value,
                            }))
                          }
                          className="circular-color-picker transition-all duration-200"
                        />
                        <div className="absolute inset-0 rounded-full ring-2 ring-primary/20 pointer-events-none opacity-0 circular-color-picker-ring transition-opacity" />
                      </div>
                      <Input
                        type="text"
                        value={profileForm.text_color}
                        onChange={(e) =>
                          setProfileForm((prev: ProfileFormData) => ({
                            ...prev,
                            text_color: e.target.value,
                          }))
                        }
                        className="text-xs font-mono flex-1"
                      />
                    </div>
                  </div>
                </div>

                {/* Color Presets */}
                <div>
                  <Label className="text-xs mb-3 block font-medium">
                    Quick Presets
                  </Label>
                  <div className="grid grid-cols-2 sm:grid-cols-4 gap-2">
                    {colorPresets.map((preset) => (
                      <Button
                        key={preset.name}
                        variant="outline"
                        size="sm"
                        className="h-auto p-3 flex flex-col gap-2 hover:scale-105 transition-all duration-200"
                        onClick={() => {
                          setBackgroundSettings({
                            ...backgroundSettings,
                            color: preset.bg,
                            type: "solid",
                          });
                          setProfileForm((prev: ProfileFormData) => ({
                            ...prev,
                            text_color: preset.text,
                            theme_color: preset.theme,
                            background_color: preset.bg,
                          }));
                        }}
                      >
                        <div
                          className="w-8 h-8 rounded-full border-2 border-white shadow-sm"
                          style={{ backgroundColor: preset.bg }}
                        />
                        <span className="text-xs font-medium">
                          {preset.name}
                        </span>
                      </Button>
                    ))}
                  </div>
                </div>
              </div>
            </div>

            {/* Background Preview - Much Larger */}
            <div className="space-y-4">
              <Label className="text-sm font-medium flex items-center gap-2">
                <Eye size={16} />
                Background Preview
              </Label>
              <div className="sticky top-6">
                <div className="bg-gradient-to-br from-muted/50 to-muted/20 p-6 rounded-xl border shadow-lg">
                  <div className="aspect-[16/9] w-full relative rounded-lg overflow-hidden shadow-xl border-2 border-white/20 min-h-[400px]">
                    {/* Background Animation */}
                    <div className="absolute inset-0">
                      <BackgroundWrapper settings={backgroundSettings} />
                    </div>

                    {/* Overlay Info */}
                    <div className="absolute bottom-4 right-4 text-sm text-white/90 bg-black/50 backdrop-blur-sm px-4 py-2 rounded-lg border border-white/20">
                      {
                        backgroundTypes.find(
                          (bg) => bg.type === backgroundSettings.type
                        )?.name
                      }
                    </div>

                    {/* Window Controls */}
                    <div className="absolute top-4 left-4 flex gap-2">
                      <div className="w-4 h-4 bg-red-500 rounded-full opacity-70" />
                      <div className="w-4 h-4 bg-yellow-500 rounded-full opacity-70" />
                      <div className="w-4 h-4 bg-green-500 rounded-full opacity-70" />
                    </div>

                    {/* Center Demo Text */}
                    <div className="absolute inset-0 flex items-center justify-center">
                      <div className="text-center">
                        <div
                          className="text-2xl font-bold drop-shadow-lg mb-3"
                          style={{
                            color:
                              backgroundSettings.type === "solid" &&
                              backgroundSettings.color === "#ffffff"
                                ? "#1f2937"
                                : "#ffffff",
                            textShadow:
                              backgroundSettings.type !== "solid"
                                ? "2px 2px 6px rgba(0,0,0,0.8)"
                                : "none",
                          }}
                        >
                          Your Background
                        </div>
                        <div
                          className="text-base opacity-80 drop-shadow-sm"
                          style={{
                            color:
                              backgroundSettings.type === "solid" &&
                              backgroundSettings.color === "#ffffff"
                                ? "#6b7280"
                                : "#e5e7eb",
                            textShadow:
                              backgroundSettings.type !== "solid"
                                ? "1px 1px 3px rgba(0,0,0,0.6)"
                                : "none",
                          }}
                        >
                          {backgroundSettings.type === "hyperspeed"
                            ? `Preset: ${
                                backgroundSettings.preset || "one"
                              } | Speed: ${backgroundSettings.speed.toFixed(
                                1
                              )}x | Distortion: ${
                                backgroundSettings.distortion ||
                                "turbulentDistortion"
                              }`
                            : "Solid Color Background"}
                        </div>
                      </div>
                    </div>
                  </div>

                  {/* Preview Info */}
                  <div className="text-center mt-4">
                    <p className="text-sm text-muted-foreground">
                      Real-time background preview • Full profile preview
                      available in sidebar
                    </p>
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
