"use client";

import React, { useState, useCallback, useMemo } from "react";
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
import { Palette, Settings2, MousePointer, Zap, Grid3x3 } from "lucide-react";
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
  { type: "squares", name: "Squares", category: "Motion" },
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

const squareDirections = [
  { value: "right", label: "Right" },
  { value: "left", label: "Left" },
  { value: "up", label: "Up" },
  { value: "down", label: "Down" },
  { value: "diagonal", label: "Diagonal" },
];

export default function BackgroundSelector({
  currentBackground,
  onBackgroundChange,
  className = "",
}: BackgroundSelectorProps) {
  const [showAdvanced, setShowAdvanced] = useState(false);

  // Optimized update function with debouncing for color picker
  const updateBackground = useCallback((updates: Partial<BackgroundSettings>) => {
    onBackgroundChange({
      ...currentBackground,
      ...updates,
    });
  }, [currentBackground, onBackgroundChange]);

  // Debounced color update to reduce lag
  const updateColorWithDebounce = useMemo(() => {
    let timeoutId: NodeJS.Timeout;
    return (color: string) => {
      clearTimeout(timeoutId);
      timeoutId = setTimeout(() => {
        updateBackground({ color });
      }, 50); // 50ms debounce
    };
  }, [updateBackground]);

  const getDefaultBackgroundColor = useCallback((type: BackgroundSettings["type"]) => {
    switch (type) {
      case 'hyperspeed':
        return '#000000'; // Black for hyperspeed
      case 'silk':
        return '#ffffff'; // White for silk
      case 'squares':
        return '#000000'; // Black for squares
      default:
        return '#ffffff'; // Default white
    }
  }, []);

  const handleBackgroundTypeChange = useCallback((type: BackgroundSettings["type"]) => {
    const defaultColor = getDefaultBackgroundColor(type);
    const newSettings: BackgroundSettings = {
      type,
      color: defaultColor,
      speed: 1,
      intensity: 1,
      mouseInteraction: false,
    };

    // Add type-specific defaults
    if (type === 'squares') {
      newSettings.direction = 'right';
      newSettings.borderColor = '#999';
      newSettings.squareSize = 40;
      newSettings.hoverFillColor = '#222';
    } else if (type === 'hyperspeed') {
      newSettings.preset = 'one';
      newSettings.distortion = 'turbulentDistortion';
      newSettings.roadWidth = 10;
      newSettings.lanesPerRoad = 3;
      newSettings.speedUp = 2;
      newSettings.totalSideLightSticks = 20;
    } else if (type === 'silk') {
      newSettings.scale = 1;
      newSettings.noiseIntensity = 1.5;
      newSettings.rotation = 0;
    }

    updateBackground(newSettings);
  }, [updateBackground, getDefaultBackgroundColor]);

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

    if (currentBackground.type === "squares") {
      return (
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
          <div>
            <Label className="text-xs font-medium">Direction</Label>
            <Select
              value={currentBackground.direction || "right"}
              onValueChange={(value) =>
                updateBackground({ direction: value as any })
              }
            >
              <SelectTrigger className="mt-2">
                <SelectValue />
              </SelectTrigger>
              <SelectContent>
                {squareDirections.map((direction) => (
                  <SelectItem key={direction.value} value={direction.value}>
                    {direction.label}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>

          <div>
            <Label className="text-xs font-medium">Square Size</Label>
            <div className="flex items-center gap-2 mt-2">
              <Input
                type="range"
                min="20"
                max="80"
                step="5"
                value={currentBackground.squareSize || 40}
                onChange={(e) =>
                  updateBackground({ squareSize: parseInt(e.target.value) })
                }
                className="flex-1"
              />
              <span className="text-xs w-12 text-center font-mono bg-muted px-2 py-1 rounded">
                {currentBackground.squareSize || 40}px
              </span>
            </div>
          </div>

          <div>
            <Label className="text-xs font-medium">Border Color</Label>
            <div className="flex items-center gap-3 mt-2">
              <input
                type="color"
                value={currentBackground.borderColor || '#999'}
                onChange={(e) => updateBackground({ borderColor: e.target.value })}
                className="w-12 h-8 rounded border border-gray-300 cursor-pointer"
              />
              <Input
                type="text"
                value={currentBackground.borderColor || '#999'}
                onChange={(e) => updateBackground({ borderColor: e.target.value })}
                className="text-xs font-mono flex-1"
                placeholder="#999"
              />
            </div>
          </div>

          <div>
            <Label className="text-xs font-medium">Hover Fill Color</Label>
            <div className="flex items-center gap-3 mt-2">
              <input
                type="color"
                value={currentBackground.hoverFillColor || '#222'}
                onChange={(e) => updateBackground({ hoverFillColor: e.target.value })}
                className="w-12 h-8 rounded border border-gray-300 cursor-pointer"
              />
              <Input
                type="text"
                value={currentBackground.hoverFillColor || '#222'}
                onChange={(e) => updateBackground({ hoverFillColor: e.target.value })}
                className="text-xs font-mono flex-1"
                placeholder="#222"
              />
            </div>
          </div>
        </div>
      );
    }

    return null;
  };

  return (
    <div className={`space-y-6 ${className}`}>
      <div className="space-y-4">
        <Label className="text-sm font-medium flex items-center gap-2">
          <Palette size={16} />
          Background Style
        </Label>

        <div className="grid grid-cols-2 sm:grid-cols-4 gap-4">
          {backgroundTypes.map((bg) => (
            <Button
              key={bg.type}
              variant={
                currentBackground.type === bg.type ? "default" : "outline"
              }
              className="h-auto p-4 flex flex-col items-center gap-2 text-sm hover:scale-105 transition-all duration-200 relative overflow-hidden group"
              onClick={() => handleBackgroundTypeChange(bg.type as BackgroundSettings["type"])}
            >
              <div className="absolute inset-0 bg-gradient-to-br from-primary/10 to-transparent opacity-0 group-hover:opacity-100 transition-opacity" />
              {bg.type === 'squares' && <Grid3x3 size={20} className="relative z-10" />}
              <span className="text-xs font-semibold relative z-10">
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
                <input
                  type="color"
                  value={currentBackground.color}
                  onChange={(e) => updateColorWithDebounce(e.target.value)}
                  className="w-16 h-12 rounded-lg border-2 border-gray-200 cursor-pointer hover:border-gray-300 transition-colors"
                />
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
