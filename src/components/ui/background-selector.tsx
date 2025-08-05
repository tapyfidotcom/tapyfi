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
import { Badge } from "@/components/ui/badge";
import {
  Palette,
  Settings2,
  MousePointer,
  Sparkles,
  Plus,
  Minus,
  Search,
  Filter,
} from "lucide-react";
import { BackgroundSettings } from "@/types/profile";
import {
  gradientPresets,
  getPresetsByCategory,
  searchPresets,
  convertPresetToBackgroundSettings,
  GradientPreset,
} from "@/lib/gradient-presets";

interface BackgroundSelectorProps {
  currentBackground: BackgroundSettings;
  onBackgroundChange: (background: BackgroundSettings) => void;
  profileId?: string;
  className?: string;
}

const backgroundTypes = [
  { type: "solid", name: "Gradient", category: "Basic", icon: "🎨" },
  { type: "hyperspeed", name: "Hyperspeed", category: "Motion", icon: "🚀" },
  { type: "silk", name: "Silk", category: "Texture", icon: "✨" },
  { type: "squares", name: "Squares", category: "Motion", icon: "⬜" },
  { type: "iridescence", name: "Iridescence", category: "Shader", icon: "🌈" },
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

const categories = [
  "All",
  "Warm",
  "Cool",
  "Nature",
  "Sunset",
  "Ocean",
  "Modern",
  "Classic",
];

export default function BackgroundSelector({
  currentBackground,
  onBackgroundChange,
  profileId,
  className = "",
}: BackgroundSelectorProps) {
  const [selectedCategory, setSelectedCategory] = useState("All");
  const [searchQuery, setSearchQuery] = useState("");
  const [showPresets, setShowPresets] = useState(false);

  const updateBackground = useCallback(
    (updates: Partial<BackgroundSettings>) => {
      onBackgroundChange({
        ...currentBackground,
        ...updates,
      });
    },
    [currentBackground, onBackgroundChange]
  );

  // Filter presets based on category and search
  const filteredPresets = useMemo(() => {
    let presets = gradientPresets;

    if (selectedCategory !== "All") {
      presets = getPresetsByCategory(selectedCategory);
    }

    if (searchQuery) {
      presets = searchPresets(searchQuery);
    }

    return presets;
  }, [selectedCategory, searchQuery]);

  const handlePresetSelect = (preset: GradientPreset) => {
    const newSettings = convertPresetToBackgroundSettings(preset);
    updateBackground(newSettings);
  };

  const handleBackgroundTypeChange = useCallback(
    (type: BackgroundSettings["type"]) => {
      // Set showPresets to true only for solid type
      setShowPresets(type === "solid");

      let defaultColor: string | string[] = "#6366f1";

      switch (type) {
        case "hyperspeed":
          defaultColor = "#000000";
          break;
        case "silk":
          defaultColor = "#ffffff";
          break;
        case "squares":
          defaultColor = "#000000";
          break;
        case "iridescence":
          defaultColor = "#000000";
          break;
        case "solid":
          defaultColor = ["#a6c0fe", "#f68084"]; // Default gradient
          break;
      }

      const newSettings: BackgroundSettings = {
        type,
        color: defaultColor,
        speed: 1.8,
        intensity: 1,
        mouseInteraction: false,
      };

      // Add type-specific defaults
      if (type === "solid") {
        newSettings.gradientDirection = 135;
        newSettings.gradientType = "linear";
      } else if (type === "squares") {
        newSettings.direction = "right";
        newSettings.borderColor = "#ffffff";
        newSettings.squareSize = 50;
        newSettings.hoverFillColor = "#222";
      } else if (type === "hyperspeed") {
        newSettings.preset = "one";
        newSettings.distortion = "turbulentDistortion";
        newSettings.roadWidth = 10;
        newSettings.lanesPerRoad = 3;
        newSettings.speedUp = 2;
        newSettings.totalSideLightSticks = 20;
      } else if (type === "silk") {
        newSettings.scale = 1;
        newSettings.noiseIntensity = 1.5;
        newSettings.rotation = 0;
      } else if (type === "iridescence") {
        newSettings.iridescenceColor = [1.0, 0.2, 0.5] as [
          number,
          number,
          number
        ];
        newSettings.amplitude = 0.1;
        newSettings.mouseReact = false;
        newSettings.brightness = 1;
        newSettings.saturation = 1;
        newSettings.reflection = 1;
      }
      updateBackground(newSettings);
    },
    [updateBackground]
  );

  // Color management functions
  const handleColorChange = (index: number, color: string) => {
    if (!Array.isArray(currentBackground.color)) {
      if (index === 0) {
        updateBackground({ color });
      } else {
        updateBackground({ color: [currentBackground.color, color] });
      }
      return;
    }
    const newColors = [...currentBackground.color];
    newColors[index] = color;
    updateBackground({ color: newColors });
  };

  const addGradientColor = () => {
    if (!Array.isArray(currentBackground.color)) {
      updateBackground({ color: [currentBackground.color, "#ffffff"] });
    } else if (currentBackground.color.length < 5) {
      updateBackground({ color: [...currentBackground.color, "#ffffff"] });
    }
  };

  const removeGradientColor = (index: number) => {
    if (!Array.isArray(currentBackground.color)) return;
    if (currentBackground.color.length <= 1) {
      updateBackground({ color: currentBackground.color[0] });
      return;
    }
    const newColors = [...currentBackground.color];
    newColors.splice(index, 1);
    updateBackground({ color: newColors });
  };

  // Iridescence color management
  const handleIridescenceColorChange = (index: number, value: number) => {
    const currentColors = currentBackground.iridescenceColor || [0.3, 0.2, 0.5];
    const newColors: [number, number, number] = [...currentColors] as [
      number,
      number,
      number
    ];
    newColors[index] = value;
    updateBackground({ iridescenceColor: newColors });
  };

  const renderColorControls = () => {
    if (currentBackground.type === "iridescence") {
      const colors = currentBackground.iridescenceColor || [0.3, 0.2, 0.5];
      return (
        <div className="space-y-3">
          <Label className="text-xs font-medium text-gray-900 dark:text-gray-100">
            Iridescence Colors (RGB 0-1)
          </Label>
          <div className="space-y-2">
            {["Red", "Green", "Blue"].map((channel, idx) => (
              <div key={channel} className="flex items-center gap-2">
                <span className="text-xs w-10 text-gray-700 dark:text-gray-300">{channel}:</span>
                <Input
                  type="range"
                  min="0"
                  max="1"
                  step="0.01"
                  value={colors[idx]}
                  onChange={(e) =>
                    handleIridescenceColorChange(
                      idx,
                      parseFloat(e.target.value)
                    )
                  }
                  className="flex-1 h-2 bg-white/30 dark:bg-gray-100/30 backdrop-blur-sm border border-white/20 dark:border-gray-300/20"
                />
                <span className="text-xs w-12 text-center font-mono bg-white/30 dark:bg-gray-100/30 backdrop-blur-sm px-1 py-0.5 rounded border border-white/20 dark:border-gray-300/20 text-gray-900 dark:text-gray-100">
                  {colors[idx].toFixed(2)}
                </span>
              </div>
            ))}
          </div>
        </div>
      );
    }

    const colors = Array.isArray(currentBackground.color)
      ? currentBackground.color
      : [currentBackground.color];

    return (
      <div className="space-y-3">
        <div className="flex items-center justify-between">
          <Label className="text-xs font-medium text-gray-900 dark:text-gray-100">Colors</Label>
          {currentBackground.type === "solid" && (
            <div className="flex items-center gap-2">
              <span className="text-xs text-gray-700 dark:text-gray-300">
                {colors.length === 1
                  ? "Solid"
                  : `${colors.length} Color Gradient`}
              </span>
              {colors.length < 5 && (
                <Button
                  variant="outline"
                  size="sm"
                  onClick={addGradientColor}
                  className="h-6 w-6 p-0 bg-white/30 dark:bg-gray-100/30 backdrop-blur-sm border border-white/20 dark:border-gray-300/20 hover:bg-white/40 dark:hover:bg-gray-100/40"
                >
                  <Plus size={10} />
                </Button>
              )}
            </div>
          )}
        </div>

        <div className="space-y-2">
          {colors.map((color, idx) => (
            <div key={idx} className="flex items-center gap-2">
              <div className="relative">
                <input
                  type="color"
                  value={color}
                  onChange={(e) => handleColorChange(idx, e.target.value)}
                  className="w-8 h-8 rounded border border-white/30 dark:border-gray-300/30 cursor-pointer bg-white/30 dark:bg-gray-100/30 backdrop-blur-sm"
                />
              </div>
              <Input
                type="text"
                value={color}
                onChange={(e) => handleColorChange(idx, e.target.value)}
                className="text-xs font-mono flex-1 bg-white/30 dark:bg-gray-100/30 backdrop-blur-sm border border-white/30 dark:border-gray-300/30 text-gray-900 dark:text-gray-100 placeholder:text-gray-500 dark:placeholder:text-gray-400"
                placeholder="#000000"
              />
              {currentBackground.type === "solid" && colors.length > 1 && (
                <Button
                  variant="ghost"
                  size="sm"
                  onClick={() => removeGradientColor(idx)}
                  className="h-6 w-6 p-0 text-red-500 hover:text-red-700 hover:bg-red-100/40 dark:hover:bg-red-900/30"
                >
                  <Minus size={10} />
                </Button>
              )}
            </div>
          ))}
        </div>

        {/* Gradient Controls for Solid */}
        {currentBackground.type === "solid" &&
          Array.isArray(currentBackground.color) &&
          currentBackground.color.length > 1 && (
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 pt-2 border-t border-gray-200/50 dark:border-gray-700/50">
              <div>
                <Label className="text-xs font-medium text-gray-900 dark:text-gray-100">Gradient Type</Label>
                <Select
                  value={currentBackground.gradientType || "linear"}
                  onValueChange={(value) =>
                    updateBackground({
                      gradientType: value as "linear" | "radial",
                    })
                  }
                >
                  <SelectTrigger className="mt-1 h-8 bg-white/30 dark:bg-gray-100/30 backdrop-blur-sm border border-white/30 dark:border-gray-300/30">
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="linear">Linear</SelectItem>
                    <SelectItem value="radial">Radial</SelectItem>
                  </SelectContent>
                </Select>
              </div>

              {currentBackground.gradientType !== "radial" && (
                <div>
                  <Label className="text-xs font-medium text-gray-900 dark:text-gray-100">Direction</Label>
                  <div className="flex items-center gap-2 mt-1">
                    <Input
                      type="range"
                      min="0"
                      max="360"
                      step="15"
                      value={currentBackground.gradientDirection || 135}
                      onChange={(e) =>
                        updateBackground({
                          gradientDirection: parseInt(e.target.value),
                        })
                      }
                      className="flex-1 h-2 bg-white/30 dark:bg-gray-100/30 backdrop-blur-sm border border-white/20 dark:border-gray-300/20"
                    />
                    <span className="text-xs w-10 text-center font-mono bg-white/30 dark:bg-gray-100/30 backdrop-blur-sm px-1 py-0.5 rounded border border-white/20 dark:border-gray-300/20 text-gray-900 dark:text-gray-100">
                      {currentBackground.gradientDirection || 135}°
                    </span>
                  </div>
                </div>
              )}
            </div>
          )}
      </div>
    );
  };

  return (
    <div className={`space-y-4 ${className}`}>
      {/* Background Type Selection - Perfect Glass Effect */}
      <div className="space-y-3">
        <Label className="text-xs font-medium flex items-center gap-2 text-gray-900 dark:text-gray-100">
          <Palette size={14} />
          Background Style
        </Label>

        <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-5 gap-2">
          {backgroundTypes.map((bg) => (
            <Button
              key={bg.type}
              variant={
                currentBackground.type === bg.type ? "default" : "outline"
              }
              className="h-auto p-3 flex flex-col items-center gap-1 text-xs hover:scale-105 transition-all duration-200 bg-white/20 dark:bg-gray-100/20 backdrop-blur-sm border border-white/30 dark:border-gray-300/30 hover:bg-white/30 dark:hover:bg-gray-100/30"
              onClick={() =>
                handleBackgroundTypeChange(
                  bg.type as BackgroundSettings["type"]
                )
              }
            >
              <span className="text-base">{bg.icon}</span>
              <span className="font-medium text-center leading-tight text-gray-900 dark:text-gray-100">
                {bg.name}
              </span>
              <span className="text-xs text-gray-700 dark:text-gray-300 text-center">
                {bg.category}
              </span>
            </Button>
          ))}
        </div>
      </div>

      {/* Enhanced Gradient Presets Section - Perfect Glass Effect */}
      {showPresets && currentBackground.type === "solid" && (
        <div className="bg-white/20 dark:bg-gray-100/20 backdrop-blur-xl border border-white/20 dark:border-gray-300/20 rounded-lg p-4 shadow-lg">
          <div className="flex items-center gap-2 mb-3">
            <Sparkles size={16} className="text-primary" />
            <h3 className="text-sm font-semibold text-gray-900 dark:text-gray-100">Gradient Presets</h3>
            <Badge variant="secondary" className="ml-auto text-xs bg-white/30 dark:bg-gray-100/30 backdrop-blur-sm border border-white/20 dark:border-gray-300/20">
              {filteredPresets.length}
            </Badge>
          </div>

          {/* Mobile-Optimized Search and Filter */}
          <div className="flex flex-col gap-3 sm:flex-row mb-4">
            <div className="relative flex-1">
              <Search
                size={14}
                className="absolute left-2 top-1/2 transform -translate-y-1/2 text-gray-600 dark:text-gray-400"
              />
              <Input
                placeholder="Search gradients..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="pl-8 h-8 text-xs bg-white/30 dark:bg-gray-100/30 backdrop-blur-sm border border-white/30 dark:border-gray-300/30 text-gray-900 dark:text-gray-100 placeholder:text-gray-500 dark:placeholder:text-gray-400"
              />
            </div>
            <Select
              value={selectedCategory}
              onValueChange={setSelectedCategory}
            >
              <SelectTrigger className="w-full sm:w-32 h-8 bg-white/30 dark:bg-gray-100/30 backdrop-blur-sm border border-white/30 dark:border-gray-300/30">
                <Filter size={14} className="mr-1" />
                <SelectValue />
              </SelectTrigger>
              <SelectContent>
                {categories.map((category) => (
                  <SelectItem key={category} value={category}>
                    {category}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>

          {/* Mobile-Optimized Gradient Grid */}
          <div className="p-3 bg-white/30 dark:bg-gray-100/30 backdrop-blur-sm rounded-lg border border-white/20 dark:border-gray-300/20">
            <div className="grid grid-cols-6 sm:grid-cols-8 md:grid-cols-10 lg:grid-cols-12 gap-2 max-h-48 overflow-y-auto custom-scrollbar">
              {filteredPresets.map((preset) => {
                const gradientStyle =
                  preset.gradientType === "radial"
                    ? `radial-gradient(circle, ${preset.colors.join(", ")})`
                    : `linear-gradient(${
                        preset.gradientDirection || 135
                      }deg, ${preset.colors.join(", ")})`;

                return (
                  <button
                    key={preset.id}
                    onClick={() => handlePresetSelect(preset)}
                    className="w-8 h-8 sm:w-10 sm:h-10 rounded-lg shadow hover:shadow-lg hover:scale-110 transition-all duration-300 border border-white/40 dark:border-gray-300/40 hover:border-primary/60 cursor-pointer group"
                    style={{ background: gradientStyle }}
                    title={preset.name}
                  >
                    <div className="w-1 h-1 bg-white/80 rounded-full opacity-0 group-hover:opacity-100 transition-opacity duration-300 mx-auto mt-1" />
                  </button>
                );
              })}
            </div>
          </div>

          {filteredPresets.length === 0 && (
            <div className="text-center py-8">
              <Sparkles className="mx-auto h-8 w-8 text-gray-600 dark:text-gray-400 mb-2" />
              <p className="text-xs text-gray-700 dark:text-gray-300 font-medium">
                No presets found
              </p>
              <p className="text-xs text-gray-600 dark:text-gray-400 mt-1">
                Try adjusting your search or filter
              </p>
            </div>
          )}
        </div>
      )}

      {/* Mobile-Optimized Settings Card - Perfect Glass Effect */}
      <div className="bg-white/20 dark:bg-gray-100/20 backdrop-blur-xl border border-white/20 dark:border-gray-300/20 rounded-lg p-4 shadow-lg">
        <div className="flex items-center gap-2 mb-4">
          <Settings2 size={16} className="text-primary" />
          <h3 className="text-sm font-semibold text-gray-900 dark:text-gray-100">Background Settings</h3>
          <span className="text-xs font-normal text-gray-700 dark:text-gray-300 ml-auto">
            {
              backgroundTypes.find((bg) => bg.type === currentBackground.type)
                ?.name
            }
          </span>
        </div>

        <div className="space-y-4">
          {/* Color Controls */}
          {renderColorControls()}

          {/* Common Animation Controls - Perfect Glass Effect */}
          {currentBackground.type !== "solid" && (
            <>
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 pt-3 border-t border-gray-200/50 dark:border-gray-700/50">
                <div>
                  <Label className="text-xs font-medium text-gray-900 dark:text-gray-100">Animation Speed</Label>
                  <div className="flex items-center gap-2 mt-1">
                    <Input
                      type="range"
                      min="0.1"
                      max="10"
                      step="0.1"
                      value={currentBackground.speed || 1}
                      onChange={(e) =>
                        updateBackground({ speed: parseFloat(e.target.value) })
                      }
                      className="flex-1 h-2 bg-white/30 dark:bg-gray-100/30 backdrop-blur-sm border border-white/20 dark:border-gray-300/20"
                    />
                    <span className="text-xs w-12 text-center font-mono bg-white/30 dark:bg-gray-100/30 backdrop-blur-sm px-1 py-0.5 rounded border border-white/20 dark:border-gray-300/20 text-gray-900 dark:text-gray-100">
                      {(currentBackground.speed || 1).toFixed(1)}x
                    </span>
                  </div>
                </div>

                <div>
                  <Label className="text-xs font-medium text-gray-900 dark:text-gray-100">Intensity</Label>
                  <div className="flex items-center gap-2 mt-1">
                    <Input
                      type="range"
                      min="0"
                      max="3"
                      step="0.1"
                      value={currentBackground.intensity || 1}
                      onChange={(e) =>
                        updateBackground({
                          intensity: parseFloat(e.target.value),
                        })
                      }
                      className="flex-1 h-2 bg-white/30 dark:bg-gray-100/30 backdrop-blur-sm border border-white/20 dark:border-gray-300/20"
                    />
                    <span className="text-xs w-12 text-center font-mono bg-white/30 dark:bg-gray-100/30 backdrop-blur-sm px-1 py-0.5 rounded border border-white/20 dark:border-gray-300/20 text-gray-900 dark:text-gray-100">
                      {(currentBackground.intensity || 1).toFixed(1)}
                    </span>
                  </div>
                </div>
              </div>

              <div className="flex items-center gap-2 pt-1">
                <MousePointer size={12} className="text-gray-600 dark:text-gray-400" />
                <Label className="text-xs font-medium text-gray-900 dark:text-gray-100">Mouse Interaction</Label>
                <Switch
                  checked={currentBackground.mouseInteraction || false}
                  onCheckedChange={(checked) =>
                    updateBackground({ mouseInteraction: checked })
                  }
                />
              </div>
            </>
          )}

          {/* Type-Specific Advanced Controls - Perfect Glass Effect */}
          {currentBackground.type === "iridescence" && (
            <div className="space-y-3 pt-3 border-t border-gray-200/50 dark:border-gray-700/50">
              <Label className="text-xs font-medium text-primary">
                Iridescence Settings
              </Label>
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                <div>
                  <Label className="text-xs font-medium text-gray-900 dark:text-gray-100">Amplitude</Label>
                  <div className="flex items-center gap-2 mt-1">
                    <Input
                      type="range"
                      min="0"
                      max="1"
                      step="0.01"
                      value={currentBackground.amplitude || 0.1}
                      onChange={(e) =>
                        updateBackground({
                          amplitude: parseFloat(e.target.value),
                        })
                      }
                      className="flex-1 h-2 bg-white/30 dark:bg-gray-100/30 backdrop-blur-sm border border-white/20 dark:border-gray-300/20"
                    />
                    <span className="text-xs w-10 text-center font-mono bg-white/30 dark:bg-gray-100/30 backdrop-blur-sm px-1 py-0.5 rounded border border-white/20 dark:border-gray-300/20 text-gray-900 dark:text-gray-100">
                      {(currentBackground.amplitude || 0.1).toFixed(2)}
                    </span>
                  </div>
                </div>

                <div className="flex items-center gap-2">
                  <MousePointer size={12} className="text-gray-600 dark:text-gray-400" />
                  <Label className="text-xs font-medium text-gray-900 dark:text-gray-100">Mouse React</Label>
                  <Switch
                    checked={currentBackground.mouseReact || false}
                    onCheckedChange={(checked) =>
                      updateBackground({ mouseReact: checked })
                    }
                  />
                </div>

                <div>
                  <Label className="text-xs font-medium text-gray-900 dark:text-gray-100">Brightness</Label>
                  <div className="flex items-center gap-2 mt-1">
                    <Input
                      type="range"
                      min="0"
                      max="2"
                      step="0.05"
                      value={currentBackground.brightness || 1}
                      onChange={(e) =>
                        updateBackground({
                          brightness: parseFloat(e.target.value),
                        })
                      }
                      className="flex-1 h-2 bg-white/30 dark:bg-gray-100/30 backdrop-blur-sm border border-white/20 dark:border-gray-300/20"
                    />
                    <span className="text-xs w-10 text-center font-mono bg-white/30 dark:bg-gray-100/30 backdrop-blur-sm px-1 py-0.5 rounded border border-white/20 dark:border-gray-300/20 text-gray-900 dark:text-gray-100">
                      {(currentBackground.brightness || 1).toFixed(2)}
                    </span>
                  </div>
                </div>

                <div>
                  <Label className="text-xs font-medium text-gray-900 dark:text-gray-100">Saturation</Label>
                  <div className="flex items-center gap-2 mt-1">
                    <Input
                      type="range"
                      min="0"
                      max="2"
                      step="0.05"
                      value={currentBackground.saturation || 1}
                      onChange={(e) =>
                        updateBackground({
                          saturation: parseFloat(e.target.value),
                        })
                      }
                      className="flex-1 h-2 bg-white/30 dark:bg-gray-100/30 backdrop-blur-sm border border-white/20 dark:border-gray-300/20"
                    />
                    <span className="text-xs w-10 text-center font-mono bg-white/30 dark:bg-gray-100/30 backdrop-blur-sm px-1 py-0.5 rounded border border-white/20 dark:border-gray-300/20 text-gray-900 dark:text-gray-100">
                      {(currentBackground.saturation || 1).toFixed(2)}
                    </span>
                  </div>
                </div>

                <div className="sm:col-span-2">
                  <Label className="text-xs font-medium text-gray-900 dark:text-gray-100">Reflection</Label>
                  <div className="flex items-center gap-2 mt-1">
                    <Input
                      type="range"
                      min="0"
                      max="2"
                      step="0.05"
                      value={currentBackground.reflection || 1}
                      onChange={(e) =>
                        updateBackground({
                          reflection: parseFloat(e.target.value),
                        })
                      }
                      className="flex-1 h-2 bg-white/30 dark:bg-gray-100/30 backdrop-blur-sm border border-white/20 dark:border-gray-300/20"
                    />
                    <span className="text-xs w-10 text-center font-mono bg-white/30 dark:bg-gray-100/30 backdrop-blur-sm px-1 py-0.5 rounded border border-white/20 dark:border-gray-300/20 text-gray-900 dark:text-gray-100">
                      {(currentBackground.reflection || 1).toFixed(2)}
                    </span>
                  </div>
                </div>
              </div>
            </div>
          )}

          {currentBackground.type === "hyperspeed" && (
            <div className="space-y-3 pt-3 border-t border-gray-200/50 dark:border-gray-700/50">
              <Label className="text-xs font-medium text-primary">
                Hyperspeed Settings
              </Label>
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                <div>
                  <Label className="text-xs font-medium text-gray-900 dark:text-gray-100">Preset Style</Label>
                  <Select
                    value={currentBackground.preset || "one"}
                    onValueChange={(value) =>
                      updateBackground({ preset: value as any })
                    }
                  >
                    <SelectTrigger className="mt-1 h-8 bg-white/30 dark:bg-gray-100/30 backdrop-blur-sm border border-white/30 dark:border-gray-300/30">
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
                  <Label className="text-xs font-medium text-gray-900 dark:text-gray-100">Distortion Type</Label>
                  <Select
                    value={
                      currentBackground.distortion || "turbulentDistortion"
                    }
                    onValueChange={(value) =>
                      updateBackground({ distortion: value })
                    }
                  >
                    <SelectTrigger className="mt-1 h-8 bg-white/30 dark:bg-gray-100/30 backdrop-blur-sm border border-white/30 dark:border-gray-300/30">
                      <SelectValue />
                    </SelectTrigger>
                    <SelectContent>
                      {distortionTypes.map((distortion) => (
                        <SelectItem
                          key={distortion.value}
                          value={distortion.value}
                        >
                          {distortion.label}
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                </div>

                <div>
                  <Label className="text-xs font-medium text-gray-900 dark:text-gray-100">Road Width</Label>
                  <div className="flex items-center gap-2 mt-1">
                    <Input
                      type="range"
                      min="5"
                      max="20"
                      step="1"
                      value={currentBackground.roadWidth || 10}
                      onChange={(e) =>
                        updateBackground({
                          roadWidth: parseFloat(e.target.value),
                        })
                      }
                      className="flex-1 h-2 bg-white/30 dark:bg-gray-100/30 backdrop-blur-sm border border-white/20 dark:border-gray-300/20"
                    />
                    <span className="text-xs w-10 text-center font-mono bg-white/30 dark:bg-gray-100/30 backdrop-blur-sm px-1 py-0.5 rounded border border-white/20 dark:border-gray-300/20 text-gray-900 dark:text-gray-100">
                      {currentBackground.roadWidth || 10}
                    </span>
                  </div>
                </div>

                <div>
                  <Label className="text-xs font-medium text-gray-900 dark:text-gray-100">Lanes Per Road</Label>
                  <div className="flex items-center gap-2 mt-1">
                    <Input
                      type="range"
                      min="1"
                      max="6"
                      step="1"
                      value={currentBackground.lanesPerRoad || 3}
                      onChange={(e) =>
                        updateBackground({
                          lanesPerRoad: parseInt(e.target.value),
                        })
                      }
                      className="flex-1 h-2 bg-white/30 dark:bg-gray-100/30 backdrop-blur-sm border border-white/20 dark:border-gray-300/20"
                    />
                    <span className="text-xs w-10 text-center font-mono bg-white/30 dark:bg-gray-100/30 backdrop-blur-sm px-1 py-0.5 rounded border border-white/20 dark:border-gray-300/20 text-gray-900 dark:text-gray-100">
                      {currentBackground.lanesPerRoad || 3}
                    </span>
                  </div>
                </div>
              </div>
            </div>
          )}

          {currentBackground.type === "silk" && (
            <div className="space-y-3 pt-3 border-t border-gray-200/50 dark:border-gray-700/50">
              <Label className="text-xs font-medium text-primary">
                Silk Settings
              </Label>
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                <div>
                  <Label className="text-xs font-medium text-gray-900 dark:text-gray-100">Scale</Label>
                  <div className="flex items-center gap-2 mt-1">
                    <Input
                      type="range"
                      min="0.1"
                      max="3"
                      step="0.1"
                      value={currentBackground.scale || 1}
                      onChange={(e) =>
                        updateBackground({ scale: parseFloat(e.target.value) })
                      }
                      className="flex-1 h-2 bg-white/30 dark:bg-gray-100/30 backdrop-blur-sm border border-white/20 dark:border-gray-300/20"
                    />
                    <span className="text-xs w-10 text-center font-mono bg-white/30 dark:bg-gray-100/30 backdrop-blur-sm px-1 py-0.5 rounded border border-white/20 dark:border-gray-300/20 text-gray-900 dark:text-gray-100">
                      {(currentBackground.scale || 1).toFixed(1)}
                    </span>
                  </div>
                </div>

                <div>
                  <Label className="text-xs font-medium text-gray-900 dark:text-gray-100">Noise Intensity</Label>
                  <div className="flex items-center gap-2 mt-1">
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
                      className="flex-1 h-2 bg-white/30 dark:bg-gray-100/30 backdrop-blur-sm border border-white/20 dark:border-gray-300/20"
                    />
                    <span className="text-xs w-10 text-center font-mono bg-white/30 dark:bg-gray-100/30 backdrop-blur-sm px-1 py-0.5 rounded border border-white/20 dark:border-gray-300/20 text-gray-900 dark:text-gray-100">
                      {(currentBackground.noiseIntensity || 1.5).toFixed(1)}
                    </span>
                  </div>
                </div>

                <div className="sm:col-span-2">
                  <Label className="text-xs font-medium text-gray-900 dark:text-gray-100">
                    Rotation (radians)
                  </Label>
                  <div className="flex items-center gap-2 mt-1">
                    <Input
                      type="range"
                      min="0"
                      max="6.28"
                      step="0.1"
                      value={currentBackground.rotation || 0}
                      onChange={(e) =>
                        updateBackground({
                          rotation: parseFloat(e.target.value),
                        })
                      }
                      className="flex-1 h-2 bg-white/30 dark:bg-gray-100/30 backdrop-blur-sm border border-white/20 dark:border-gray-300/20"
                    />
                    <span className="text-xs w-10 text-center font-mono bg-white/30 dark:bg-gray-100/30 backdrop-blur-sm px-1 py-0.5 rounded border border-white/20 dark:border-gray-300/20 text-gray-900 dark:text-gray-100">
                      {(currentBackground.rotation || 0).toFixed(1)}
                    </span>
                  </div>
                </div>
              </div>
            </div>
          )}

          {currentBackground.type === "squares" && (
            <div className="space-y-3 pt-3 border-t border-gray-200/50 dark:border-gray-700/50">
              <Label className="text-xs font-medium text-primary">
                Squares Settings
              </Label>
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                <div>
                  <Label className="text-xs font-medium text-gray-900 dark:text-gray-100">Direction</Label>
                  <Select
                    value={currentBackground.direction || "right"}
                    onValueChange={(value) =>
                      updateBackground({ direction: value as any })
                    }
                  >
                    <SelectTrigger className="mt-1 h-8 bg-white/30 dark:bg-gray-100/30 backdrop-blur-sm border border-white/30 dark:border-gray-300/30">
                      <SelectValue />
                    </SelectTrigger>
                    <SelectContent>
                      {squareDirections.map((direction) => (
                        <SelectItem
                          key={direction.value}
                          value={direction.value}
                        >
                          {direction.label}
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                </div>

                <div>
                  <Label className="text-xs font-medium text-gray-900 dark:text-gray-100">Square Size</Label>
                  <div className="flex items-center gap-2 mt-1">
                    <Input
                      type="range"
                      min="20"
                      max="80"
                      step="5"
                      value={currentBackground.squareSize || 40}
                      onChange={(e) =>
                        updateBackground({
                          squareSize: parseInt(e.target.value),
                        })
                      }
                      className="flex-1 h-2 bg-white/30 dark:bg-gray-100/30 backdrop-blur-sm border border-white/20 dark:border-gray-300/20"
                    />
                    <span className="text-xs w-10 text-center font-mono bg-white/30 dark:bg-gray-100/30 backdrop-blur-sm px-1 py-0.5 rounded border border-white/20 dark:border-gray-300/20 text-gray-900 dark:text-gray-100">
                      {currentBackground.squareSize || 40}px
                    </span>
                  </div>
                </div>

                <div>
                  <Label className="text-xs font-medium text-gray-900 dark:text-gray-100">Border Color</Label>
                  <div className="flex items-center gap-2 mt-1">
                    <input
                      type="color"
                      value={currentBackground.borderColor || "#999"}
                      onChange={(e) =>
                        updateBackground({ borderColor: e.target.value })
                      }
                      className="w-8 h-6 rounded border border-white/30 dark:border-gray-300/30 cursor-pointer bg-white/30 dark:bg-gray-100/30 backdrop-blur-sm"
                    />
                    <Input
                      type="text"
                      value={currentBackground.borderColor || "#999"}
                      onChange={(e) =>
                        updateBackground({ borderColor: e.target.value })
                      }
                      className="text-xs font-mono flex-1 bg-white/30 dark:bg-gray-100/30 backdrop-blur-sm border border-white/30 dark:border-gray-300/30 text-gray-900 dark:text-gray-100"
                      placeholder="#999"
                    />
                  </div>
                </div>

                <div>
                  <Label className="text-xs font-medium text-gray-900 dark:text-gray-100">
                    Hover Fill Color
                  </Label>
                  <div className="flex items-center gap-2 mt-1">
                    <input
                      type="color"
                      value={currentBackground.hoverFillColor || "#222"}
                      onChange={(e) =>
                        updateBackground({ hoverFillColor: e.target.value })
                      }
                      className="w-8 h-6 rounded border border-white/30 dark:border-gray-300/30 cursor-pointer bg-white/30 dark:bg-gray-100/30 backdrop-blur-sm"
                    />
                    <Input
                      type="text"
                      value={currentBackground.hoverFillColor || "#222"}
                      onChange={(e) =>
                        updateBackground({ hoverFillColor: e.target.value })
                      }
                      className="text-xs font-mono flex-1 bg-white/30 dark:bg-gray-100/30 backdrop-blur-sm border border-white/30 dark:border-gray-300/30 text-gray-900 dark:text-gray-100"
                      placeholder="#222"
                    />
                  </div>
                </div>
              </div>
            </div>
          )}
        </div>
      </div>

      {/* Custom Scrollbar Styles */}
      <style jsx>{`
        .custom-scrollbar::-webkit-scrollbar {
          width: 4px;
        }
        .custom-scrollbar::-webkit-scrollbar-track {
          background: transparent;
        }
        .custom-scrollbar::-webkit-scrollbar-thumb {
          background: rgba(156, 163, 175, 0.4);
          border-radius: 2px;
        }
        .custom-scrollbar::-webkit-scrollbar-thumb:hover {
          background: rgba(156, 163, 175, 0.6);
        }
        .dark .custom-scrollbar::-webkit-scrollbar-thumb {
          background: rgba(75, 85, 99, 0.4);
        }
        .dark .custom-scrollbar::-webkit-scrollbar-thumb:hover {
          background: rgba(75, 85, 99, 0.6);
        }
      `}</style>
    </div>
  );
}
