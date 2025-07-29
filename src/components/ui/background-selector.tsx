"use client";

import React, { useState } from "react";
import { Label } from "@/components/ui/label";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Switch } from "@/components/ui/switch";
import { Card, CardContent } from "@/components/ui/card";
import { Palette, Settings2, MousePointer, Zap } from "lucide-react";
import { BackgroundSettings } from "@/types/profile";

interface BackgroundSelectorProps {
  currentBackground: BackgroundSettings;
  onBackgroundChange: (background: BackgroundSettings) => void;
  className?: string;
}

const backgroundTypes = [
  { type: "solid", name: "Solid Color", category: "Basic" },
  { type: "hyperspeed", name: "Hyperspeed", category: "Motion" },
  { type: "silk", name: "Silk", category: "Texture" },
] as const;

const hyperspeedPresets = [
  { value: "one", label: "Cyberpunk" },
  { value: "two", label: "Mountain" },
  { value: "three", label: "Racing" },
  { value: "four", label: "Highway" },
  { value: "five", label: "Neon" },
  { value: "six", label: "Deep" },
];

const distortionTypes = [
  { value: "turbulentDistortion", label: "Turbulent" },
  { value: "mountainDistortion", label: "Mountain" },
  { value: "xyDistortion", label: "XY Wave" },
  { value: "LongRaceDistortion", label: "Long Race" },
  { value: "deepDistortion", label: "Deep" },
];

export default function BackgroundSelector({
  currentBackground,
  onBackgroundChange,
  className = "",
}: BackgroundSelectorProps) {
  const [showAdvanced, setShowAdvanced] = useState(false);

  const updateBackground = (updates: Partial<BackgroundSettings>) => {
    onBackgroundChange({
      ...currentBackground,
      ...updates,
    });
  };

  const renderAdvancedControls = () => {
    if (currentBackground.type === "hyperspeed") {
      return (
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
          <div>
            <Label className="text-xs font-medium">Preset Style</Label>
            <Select
              value={currentBackground.preset || "one"}
              onValueChange={(value) =>
                updateBackground({ preset: value as any })
              }
            >
              <SelectTrigger className="mt-2">
                <SelectValue />
              </SelectTrigger>
              <SelectContent>
                {hyperspeedPresets.map((preset) => (
                  <SelectItem key={preset.value} value={preset.value}>
                    {preset.label}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>

          <div>
            <Label className="text-xs font-medium">Distortion Type</Label>
            <Select
              value={currentBackground.distortion || "turbulentDistortion"}
              onValueChange={(value) => updateBackground({ distortion: value })}
            >
              <SelectTrigger className="mt-2">
                <SelectValue />
              </SelectTrigger>
              <SelectContent>
                {distortionTypes.map((distortion) => (
                  <SelectItem key={distortion.value} value={distortion.value}>
                    {distortion.label}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>

          <div>
            <Label className="text-xs font-medium">Road Width</Label>
            <div className="flex items-center gap-2 mt-2">
              <Input
                type="range"
                min="5"
                max="20"
                step="1"
                value={currentBackground.roadWidth || 10}
                onChange={(e) =>
                  updateBackground({ roadWidth: parseFloat(e.target.value) })
                }
                className="flex-1"
              />
              <span className="text-xs w-12 text-center font-mono bg-muted px-2 py-1 rounded">
                {currentBackground.roadWidth || 10}
              </span>
            </div>
          </div>

          <div>
            <Label className="text-xs font-medium">Lanes Per Road</Label>
            <div className="flex items-center gap-2 mt-2">
              <Input
                type="range"
                min="1"
                max="6"
                step="1"
                value={currentBackground.lanesPerRoad || 3}
                onChange={(e) =>
                  updateBackground({ lanesPerRoad: parseInt(e.target.value) })
                }
                className="flex-1"
              />
              <span className="text-xs w-12 text-center font-mono bg-muted px-2 py-1 rounded">
                {currentBackground.lanesPerRoad || 3}
              </span>
            </div>
          </div>

          <div>
            <Label className="text-xs font-medium">Speed Multiplier</Label>
            <div className="flex items-center gap-2 mt-2">
              <Input
                type="range"
                min="1"
                max="5"
                step="0.1"
                value={currentBackground.speedUp || 2}
                onChange={(e) =>
                  updateBackground({ speedUp: parseFloat(e.target.value) })
                }
                className="flex-1"
              />
              <span className="text-xs w-12 text-center font-mono bg-muted px-2 py-1 rounded">
                {(currentBackground.speedUp || 2).toFixed(1)}x
              </span>
            </div>
          </div>

          <div>
            <Label className="text-xs font-medium">Light Sticks</Label>
            <div className="flex items-center gap-2 mt-2">
              <Input
                type="range"
                min="10"
                max="100"
                step="5"
                value={currentBackground.totalSideLightSticks || 20}
                onChange={(e) =>
                  updateBackground({
                    totalSideLightSticks: parseInt(e.target.value),
                  })
                }
                className="flex-1"
              />
              <span className="text-xs w-12 text-center font-mono bg-muted px-2 py-1 rounded">
                {currentBackground.totalSideLightSticks || 20}
              </span>
            </div>
          </div>
        </div>
      );
    }

    if (currentBackground.type === "silk") {
      return (
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
          <div>
            <Label className="text-xs font-medium">Scale</Label>
            <div className="flex items-center gap-2 mt-2">
              <Input
                type="range"
                min="0.1"
                max="3"
                step="0.1"
                value={currentBackground.scale || 1}
                onChange={(e) =>
                  updateBackground({ scale: parseFloat(e.target.value) })
                }
                className="flex-1"
              />
              <span className="text-xs w-12 text-center font-mono bg-muted px-2 py-1 rounded">
                {(currentBackground.scale || 1).toFixed(1)}
              </span>
            </div>
          </div>

          <div>
            <Label className="text-xs font-medium">Noise Intensity</Label>
            <div className="flex items-center gap-2 mt-2">
              <Input
                type="range"
                min="0"
                max="3"
                step="0.1"
                value={currentBackground.noiseIntensity || 1.5}
                onChange={(e) =>
                  updateBackground({
                    noiseIntensity: parseFloat(e.target.value),
                  })
                }
                className="flex-1"
              />
              <span className="text-xs w-12 text-center font-mono bg-muted px-2 py-1 rounded">
                {(currentBackground.noiseIntensity || 1.5).toFixed(1)}
              </span>
            </div>
          </div>

          <div>
            <Label className="text-xs font-medium">Rotation (radians)</Label>
            <div className="flex items-center gap-2 mt-2">
              <Input
                type="range"
                min="0"
                max="6.28"
                step="0.1"
                value={currentBackground.rotation || 0}
                onChange={(e) =>
                  updateBackground({ rotation: parseFloat(e.target.value) })
                }
                className="flex-1"
              />
              <span className="text-xs w-12 text-center font-mono bg-muted px-2 py-1 rounded">
                {(currentBackground.rotation || 0).toFixed(1)}
              </span>
            </div>
          </div>
        </div>
      );
    }

    return null;
  };

  return (
    <div className={`space-y-6 ${className}`}>
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
      `}</style>

      <div className="space-y-4">
        <Label className="text-sm font-medium flex items-center gap-2">
          <Palette size={16} />
          Background Style
        </Label>

        <div className="grid grid-cols-3 gap-4">
          {backgroundTypes.map((bg) => (
            <Button
              key={bg.type}
              variant={
                currentBackground.type === bg.type ? "default" : "outline"
              }
              className="h-auto p-6 flex flex-col items-center gap-3 text-sm hover:scale-105 transition-all duration-200 relative overflow-hidden group"
              onClick={() => {
                console.log("Clicking background type:", bg.type); // Add this debug log
                updateBackground({
                  type: bg.type as BackgroundSettings["type"],
                });
              }}
            >
              <div className="absolute inset-0 bg-gradient-to-br from-primary/10 to-transparent opacity-0 group-hover:opacity-100 transition-opacity" />
              <span className="text-lg font-semibold relative z-10">
                {bg.name}
              </span>
              <span className="text-xs text-muted-foreground relative z-10">
                {bg.category}
              </span>
            </Button>
          ))}
        </div>
      </div>

      {/* Basic Settings Panel */}
      <Card>
        <CardContent className="p-6 space-y-6">
          <Label className="text-sm font-medium flex items-center gap-2">
            <Zap size={14} />
            Basic Settings
          </Label>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
            <div>
              <Label className="text-xs font-medium">Background Color</Label>
              <div className="flex items-center gap-3 mt-2">
                <div className="relative">
                  <input
                    type="color"
                    value={currentBackground.color}
                    onChange={(e) =>
                      updateBackground({ color: e.target.value })
                    }
                    className="circular-color-picker transition-all duration-200"
                  />
                  <div className="absolute inset-0 rounded-full ring-2 ring-primary/20 pointer-events-none opacity-0 hover:opacity-100 transition-opacity" />
                </div>
                <Input
                  type="text"
                  value={currentBackground.color}
                  onChange={(e) => updateBackground({ color: e.target.value })}
                  className="text-xs font-mono flex-1"
                  placeholder="#000000"
                />
              </div>
            </div>

            {currentBackground.type !== "solid" && (
              <div>
                <Label className="text-xs font-medium">Animation Speed</Label>
                <div className="flex items-center gap-2 mt-2">
                  <Input
                    type="range"
                    min="0.1"
                    max="10"
                    step="0.1"
                    value={currentBackground.speed}
                    onChange={(e) =>
                      updateBackground({ speed: parseFloat(e.target.value) })
                    }
                    className="flex-1 cursor-pointer"
                  />
                  <span className="text-xs w-16 text-center font-mono bg-muted px-2 py-1 rounded">
                    {currentBackground.speed.toFixed(1)}x
                  </span>
                </div>
              </div>
            )}
          </div>

          {currentBackground.type !== "solid" && (
            <>
              <div>
                <Label className="text-xs font-medium">Overall Intensity</Label>
                <div className="flex items-center gap-2 mt-2">
                  <Input
                    type="range"
                    min="0"
                    max="3"
                    step="0.1"
                    value={currentBackground.intensity}
                    onChange={(e) =>
                      updateBackground({
                        intensity: parseFloat(e.target.value),
                      })
                    }
                    className="flex-1 cursor-pointer"
                  />
                  <span className="text-xs w-16 text-center font-mono bg-muted px-2 py-1 rounded">
                    {currentBackground.intensity.toFixed(1)}
                  </span>
                </div>
              </div>

              <div className="flex items-center gap-3">
                <MousePointer size={14} className="text-muted-foreground" />
                <Label className="text-xs font-medium">Mouse Interaction</Label>
                <Switch
                  checked={currentBackground.mouseInteraction || false}
                  onCheckedChange={(checked) =>
                    updateBackground({ mouseInteraction: checked })
                  }
                />
              </div>
            </>
          )}
        </CardContent>
      </Card>

      {/* Advanced Settings */}
      {currentBackground.type !== "solid" && (
        <div className="flex justify-center">
          <Button
            variant="outline"
            size="sm"
            onClick={() => setShowAdvanced(!showAdvanced)}
            className="flex items-center gap-2"
          >
            <Settings2 size={14} />
            {showAdvanced ? "Hide Advanced" : "Show Advanced"}
          </Button>
        </div>
      )}

      {showAdvanced && currentBackground.type !== "solid" && (
        <Card>
          <CardContent className="p-6 space-y-4">
            <Label className="text-sm font-medium flex items-center gap-2">
              <Settings2 size={14} />
              Advanced Controls
            </Label>
            {renderAdvancedControls()}
          </CardContent>
        </Card>
      )}
    </div>
  );
}
