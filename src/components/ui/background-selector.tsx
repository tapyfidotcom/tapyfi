"use client";

import React, { useState, useCallback } from "react";
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
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
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
  GradientPreset 
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

const categories = ["All", "Warm", "Cool", "Nature", "Sunset", "Ocean", "Modern", "Classic"];

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
  const filteredPresets = React.useMemo(() => {
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
          defaultColor = ["#6366f1", "#8b5cf6"]; // Default gradient
          break;
      }

      const newSettings: BackgroundSettings = {
        type,
        color: defaultColor,
        speed: 1,
        intensity: 1,
        mouseInteraction: false,
      };

      // Add type-specific defaults
      if (type === "solid") {
        newSettings.gradientDirection = 135;
        newSettings.gradientType = "linear";
      } else if (type === "squares") {
        newSettings.direction = "right";
        newSettings.borderColor = "#999";
        newSettings.squareSize = 40;
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
        newSettings.iridescenceColor = [0.3, 0.2, 0.5] as [number, number, number];
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
        <div className="space-y-4">
          <Label className="text-sm font-medium">
            Iridescence Colors (RGB 0-1)
          </Label>
          <div className="space-y-3">
            {["Red", "Green", "Blue"].map((channel, idx) => (
              <div key={channel} className="flex items-center gap-3">
                <span className="text-sm w-12">{channel}:</span>
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
                  className="flex-1"
                />
                <span className="text-xs w-16 text-center font-mono bg-muted px-2 py-1 rounded">
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
      <div className="space-y-4">
        <div className="flex items-center justify-between">
          <Label className="text-sm font-medium">Colors</Label>
          {currentBackground.type === "solid" && (
            <div className="flex items-center gap-2">
              <span className="text-xs text-muted-foreground">
                {colors.length === 1
                  ? "Solid"
                  : `${colors.length} Color Gradient`}
              </span>
              {colors.length < 5 && (
                <Button
                  variant="outline"
                  size="sm"
                  onClick={addGradientColor}
                  className="h-7 w-7 p-0"
                >
                  <Plus size={12} />
                </Button>
              )}
            </div>
          )}
        </div>

        <div className="space-y-3">
          {colors.map((color, idx) => (
            <div key={idx} className="flex items-center gap-3">
              <div className="relative">
                <input
                  type="color"
                  value={color}
                  onChange={(e) => handleColorChange(idx, e.target.value)}
                  className="w-12 h-10 rounded-lg border-2 border-gray-200 dark:border-gray-700 cursor-pointer transition-all hover:border-gray-300 dark:hover:border-gray-600"
                />
                <div className="absolute inset-0 rounded-lg ring-2 ring-primary/20 opacity-0 hover:opacity-100 transition-opacity pointer-events-none" />
              </div>
              <Input
                type="text"
                value={color}
                onChange={(e) => handleColorChange(idx, e.target.value)}
                className="text-xs font-mono flex-1"
                placeholder="#000000"
              />
              {currentBackground.type === "solid" && colors.length > 1 && (
                <Button
                  variant="ghost"
                  size="sm"
                  onClick={() => removeGradientColor(idx)}
                  className="h-7 w-7 p-0 text-red-500 hover:text-red-700 hover:bg-red-50 dark:hover:bg-red-950"
                >
                  <Minus size={12} />
                </Button>
              )}
            </div>
          ))}
        </div>

        {/* Gradient Controls for Solid */}
        {currentBackground.type === "solid" &&
          Array.isArray(currentBackground.color) &&
          currentBackground.color.length > 1 && (
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 pt-4 border-t dark:border-gray-700">
              <div>
                <Label className="text-xs font-medium">Gradient Type</Label>
                <Select
                  value={currentBackground.gradientType || "linear"}
                  onValueChange={(value) =>
                    updateBackground({
                      gradientType: value as "linear" | "radial",
                    })
                  }
                >
                  <SelectTrigger className="mt-2">
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
                  <Label className="text-xs font-medium">Direction</Label>
                  <div className="flex items-center gap-2 mt-2">
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
                      className="flex-1"
                    />
                    <span className="text-xs w-12 text-center font-mono bg-muted px-2 py-1 rounded">
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
    <div className={`space-y-6 ${className}`}>
      {/* Background Type Selection */}
      <div className="space-y-4">
        <Label className="text-sm font-medium flex items-center gap-2">
          <Palette size={16} />
          Background Style
        </Label>

        <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-5 gap-3">
          {backgroundTypes.map((bg) => (
            <Button
              key={bg.type}
              variant={
                currentBackground.type === bg.type ? "default" : "outline"
              }
              className="h-auto p-4 flex flex-col items-center gap-2 text-xs hover:scale-105 transition-all duration-200 relative overflow-hidden group"
              onClick={() =>
                handleBackgroundTypeChange(
                  bg.type as BackgroundSettings["type"]
                )
              }
            >
              <div className="absolute inset-0 bg-gradient-to-br from-primary/10 to-transparent opacity-0 group-hover:opacity-100 transition-opacity" />
              <span className="text-xl relative z-10">{bg.icon}</span>
              <span className="font-medium relative z-10 text-center leading-tight">{bg.name}</span>
              <span className="text-xs text-muted-foreground relative z-10 text-center">
                {bg.category}
              </span>
            </Button>
          ))}
        </div>
      </div>

      {/* Enhanced Gradient Presets Section */}
      {showPresets && currentBackground.type === "solid" && (
        <Card className="shadow-lg border-primary/20 dark:border-primary/30">
          <CardHeader className="pb-4">
            <CardTitle className="text-lg flex items-center gap-3">
              <Sparkles size={18} />
              Gradient Presets
              <Badge variant="secondary" className="ml-auto">
                {filteredPresets.length} presets
              </Badge>
            </CardTitle>
          </CardHeader>
          <CardContent className="space-y-6">
            {/* Enhanced Search and Filter Controls */}
            <div className="flex flex-col gap-4 sm:flex-row">
              <div className="relative flex-1">
                <Search size={16} className="absolute left-3 top-1/2 transform -translate-y-1/2 text-muted-foreground" />
                <Input
                  placeholder="Search gradients..."
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  className="pl-10 h-10 text-sm"
                />
              </div>
              <Select value={selectedCategory} onValueChange={setSelectedCategory}>
                <SelectTrigger className="w-full sm:w-40 h-10">
                  <Filter size={16} className="mr-2" />
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

            {/* Enhanced Larger Gradient Cubes with Responsive Grid */}
            <div className="p-4 bg-gray-50/80 dark:bg-gray-900/50 rounded-xl border dark:border-gray-800">
              <div className="grid grid-cols-4  sm:grid-cols-8 md:grid-cols-10 lg:grid-cols-12 xl:grid-cols-14 2xl:grid-cols-16 gap-3 max-h-80 overflow-y-auto custom-scrollbar">
                {filteredPresets.map((preset) => {
                  const gradientStyle = preset.gradientType === 'radial' 
                    ? `radial-gradient(circle, ${preset.colors.join(', ')})`
                    : `linear-gradient(${preset.gradientDirection || 135}deg, ${preset.colors.join(', ')})`;

                  return (
                    <button
                      key={preset.id}
                      onClick={() => handlePresetSelect(preset)}
                      className="w-10 h-10 sm:w-12 sm:h-12 rounded-full shadow-md hover:shadow-xl hover:scale-110 transition-all duration-300 border-1 border-gray-200/60 dark:border-gray-700/60 hover:border-primary/60 dark:hover:border-primary/60 cursor-pointer group relative overflow-hidden"
                      style={{ background: gradientStyle }}
                      title={preset.name}
                    >
                      {/* Enhanced Hover Overlay */}
                      <div className="absolute inset-0 bg-black/0 group-hover:bg-black/10 transition-all duration-300 rounded-lg flex items-center justify-center">
                        <div className="w-2 h-2 bg-white/80 rounded-full opacity-0 group-hover:opacity-100 transition-opacity duration-300" />
                      </div>
                      {/* Ring Effect on Hover */}
                      <div className="absolute -inset-1 bg-gradient-to-r from-primary/50 to-primary/30 rounded-lg opacity-0 group-hover:opacity-100 transition-opacity duration-300 -z-10" />
                    </button>
                  );
                })}
              </div>
            </div>

            {filteredPresets.length === 0 && (
              <div className="text-center py-12">
                <Sparkles className="mx-auto h-12 w-12 text-muted-foreground mb-4" />
                <p className="text-sm text-muted-foreground font-medium">
                  No presets found
                </p>
                <p className="text-xs text-muted-foreground mt-1">
                  Try adjusting your search or filter
                </p>
              </div>
            )}
          </CardContent>
        </Card>
      )}

      {/* Enhanced Settings Card */}
      <Card className="shadow-lg dark:shadow-xl">
        <CardHeader className="pb-4">
          <CardTitle className="text-lg flex items-center gap-2">
            <Settings2 size={18} />
            Background Settings
            <span className="text-sm font-normal text-muted-foreground ml-auto">
              {backgroundTypes.find((bg) => bg.type === currentBackground.type)?.name}
            </span>
          </CardTitle>
        </CardHeader>
        <CardContent className="space-y-6">
          {/* Color Controls */}
          {renderColorControls()}

          {/* Common Animation Controls */}
          {currentBackground.type !== "solid" && (
            <>
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 pt-4 border-t dark:border-gray-700">
                <div>
                  <Label className="text-sm font-medium">Animation Speed</Label>
                  <div className="flex items-center gap-2 mt-2">
                    <Input
                      type="range"
                      min="0.1"
                      max="10"
                      step="0.1"
                      value={currentBackground.speed || 1}
                      onChange={(e) =>
                        updateBackground({ speed: parseFloat(e.target.value) })
                      }
                      className="flex-1"
                    />
                    <span className="text-xs w-16 text-center font-mono bg-muted px-2 py-1 rounded">
                      {(currentBackground.speed || 1).toFixed(1)}x
                    </span>
                  </div>
                </div>

                <div>
                  <Label className="text-sm font-medium">Intensity</Label>
                  <div className="flex items-center gap-2 mt-2">
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
                      className="flex-1"
                    />
                    <span className="text-xs w-16 text-center font-mono bg-muted px-2 py-1 rounded">
                      {(currentBackground.intensity || 1).toFixed(1)}
                    </span>
                  </div>
                </div>
              </div>

              <div className="flex items-center gap-3 pt-2">
                <MousePointer size={14} className="text-muted-foreground" />
                <Label className="text-sm font-medium">Mouse Interaction</Label>
                <Switch
                  checked={currentBackground.mouseInteraction || false}
                  onCheckedChange={(checked) =>
                    updateBackground({ mouseInteraction: checked })
                  }
                />
              </div>
            </>
          )}

          {/* Type-Specific Advanced Controls */}
          {currentBackground.type === "iridescence" && (
            <div className="space-y-4 pt-4 border-t dark:border-gray-700">
              <Label className="text-sm font-medium text-primary">
                Iridescence Settings
              </Label>
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div>
                  <Label className="text-xs font-medium">Amplitude</Label>
                  <div className="flex items-center gap-2 mt-2">
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
                      className="flex-1"
                    />
                    <span className="text-xs w-12 text-center font-mono bg-muted px-2 py-1 rounded">
                      {(currentBackground.amplitude || 0.1).toFixed(2)}
                    </span>
                  </div>
                </div>

                <div className="flex items-center gap-3">
                  <MousePointer size={14} className="text-muted-foreground" />
                  <Label className="text-sm font-medium">Mouse React</Label>
                  <Switch
                    checked={currentBackground.mouseReact || false}
                    onCheckedChange={(checked) =>
                      updateBackground({ mouseReact: checked })
                    }
                  />
                </div>

                <div>
                  <Label className="text-xs font-medium">Brightness</Label>
                  <div className="flex items-center gap-2 mt-2">
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
                      className="flex-1"
                    />
                    <span className="text-xs w-12 text-center font-mono bg-muted px-2 py-1 rounded">
                      {(currentBackground.brightness || 1).toFixed(2)}
                    </span>
                  </div>
                </div>

                <div>
                  <Label className="text-xs font-medium">Saturation</Label>
                  <div className="flex items-center gap-2 mt-2">
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
                      className="flex-1"
                    />
                    <span className="text-xs w-12 text-center font-mono bg-muted px-2 py-1 rounded">
                      {(currentBackground.saturation || 1).toFixed(2)}
                    </span>
                  </div>
                </div>

                <div className="sm:col-span-2">
                  <Label className="text-xs font-medium">Reflection</Label>
                  <div className="flex items-center gap-2 mt-2">
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
                      className="flex-1"
                    />
                    <span className="text-xs w-12 text-center font-mono bg-muted px-2 py-1 rounded">
                      {(currentBackground.reflection || 1).toFixed(2)}
                    </span>
                  </div>
                </div>
              </div>
            </div>
          )}

          {currentBackground.type === "hyperspeed" && (
            <div className="space-y-4 pt-4 border-t dark:border-gray-700">
              <Label className="text-sm font-medium text-primary">
                Hyperspeed Settings
              </Label>
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
                    onValueChange={(value) =>
                      updateBackground({ distortion: value })
                    }
                  >
                    <SelectTrigger className="mt-2">
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
                  <Label className="text-xs font-medium">Road Width</Label>
                  <div className="flex items-center gap-2 mt-2">
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
                        updateBackground({
                          lanesPerRoad: parseInt(e.target.value),
                        })
                      }
                      className="flex-1"
                    />
                    <span className="text-xs w-12 text-center font-mono bg-muted px-2 py-1 rounded">
                      {currentBackground.lanesPerRoad || 3}
                    </span>
                  </div>
                </div>
              </div>
            </div>
          )}

          {currentBackground.type === "silk" && (
            <div className="space-y-4 pt-4 border-t dark:border-gray-700">
              <Label className="text-sm font-medium text-primary">
                Silk Settings
              </Label>
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

                <div className="sm:col-span-2">
                  <Label className="text-xs font-medium">Rotation (radians)</Label>
                  <div className="flex items-center gap-2 mt-2">
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
                      className="flex-1"
                    />
                    <span className="text-xs w-12 text-center font-mono bg-muted px-2 py-1 rounded">
                      {(currentBackground.rotation || 0).toFixed(1)}
                    </span>
                  </div>
                </div>
              </div>
            </div>
          )}

          {currentBackground.type === "squares" && (
            <div className="space-y-4 pt-4 border-t dark:border-gray-700">
              <Label className="text-sm font-medium text-primary">
                Squares Settings
              </Label>
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
                  <Label className="text-xs font-medium">Square Size</Label>
                  <div className="flex items-center gap-2 mt-2">
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
                      value={currentBackground.borderColor || "#999"}
                      onChange={(e) =>
                        updateBackground({ borderColor: e.target.value })
                      }
                      className="w-12 h-8 rounded border border-gray-300 dark:border-gray-600 cursor-pointer"
                    />
                    <Input
                      type="text"
                      value={currentBackground.borderColor || "#999"}
                      onChange={(e) =>
                        updateBackground({ borderColor: e.target.value })
                      }
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
                      value={currentBackground.hoverFillColor || "#222"}
                      onChange={(e) =>
                        updateBackground({ hoverFillColor: e.target.value })
                      }
                      className="w-12 h-8 rounded border border-gray-300 dark:border-gray-600 cursor-pointer"
                    />
                    <Input
                      type="text"
                      value={currentBackground.hoverFillColor || "#222"}
                      onChange={(e) =>
                        updateBackground({ hoverFillColor: e.target.value })
                      }
                      className="text-xs font-mono flex-1"
                      placeholder="#222"
                    />
                  </div>
                </div>
              </div>
            </div>
          )}
        </CardContent>
      </Card>

      {/* Custom Scrollbar Styles */}
      <style jsx>{`
        .custom-scrollbar::-webkit-scrollbar {
          width: 6px;
        }
        .custom-scrollbar::-webkit-scrollbar-track {
          background: transparent;
        }
        .custom-scrollbar::-webkit-scrollbar-thumb {
          background: rgba(156, 163, 175, 0.4);
          border-radius: 3px;
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
