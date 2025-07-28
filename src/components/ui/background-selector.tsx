"use client";

import React, { useState } from "react";
import { Label } from "@/components/ui/label";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Palette, Eye, EyeOff, Sparkles, Zap, Stars } from "lucide-react";
import { BackgroundSettings } from "@/interfaces/linktree";
import BackgroundPreview from "./background-preview";

interface BackgroundSelectorProps {
  currentBackground: BackgroundSettings;
  onBackgroundChange: (background: BackgroundSettings) => void;
  className?: string;
}

const backgroundTypes = [
  { type: 'solid', name: 'Solid Color', icon: '🎨', category: 'Basic' },
  { type: 'darkveil', name: 'Dark Veil', icon: '🌑', category: 'Animated' },
  { type: 'silk', name: 'Silk', icon: '🎭', category: 'Animated' },
  { type: 'galaxy', name: 'Galaxy', icon: '🌌', category: 'Space' },
  { type: 'particles', name: 'Particles', icon: '✨', category: 'Effects' },
  { type: 'lightrays', name: 'Light Rays', icon: '☀️', category: 'Light' },
  { type: 'hyperspeed', name: 'Hyperspeed', icon: '⚡', category: 'Motion' },
  { type: 'iridescence', name: 'Iridescence', icon: '🌈', category: 'Color' },
  { type: 'ripplegrid', name: 'Ripple Grid', icon: '〰️', category: 'Grid' },
  { type: 'faultyterminal', name: 'Faulty Terminal', icon: '💻', category: 'Tech' },
] as const;

const hyperspeedPresets = [
  { value: 'default', label: 'Default' },
  { value: 'cyberpunk', label: 'Cyberpunk' },
  { value: 'neon', label: 'Neon' },
  { value: 'retro', label: 'Retro' },
];

export default function BackgroundSelector({
  currentBackground,
  onBackgroundChange,
  className = ""
}: BackgroundSelectorProps) {
  const [showPreview, setShowPreview] = useState(false);
  const [selectedCategory, setSelectedCategory] = useState<string>('all');

  const categories = ['all', ...Array.from(new Set(backgroundTypes.map(bg => bg.category)))];
  
  const filteredBackgrounds = selectedCategory === 'all' 
    ? backgroundTypes 
    : backgroundTypes.filter(bg => bg.category === selectedCategory);

  const updateBackground = (updates: Partial<BackgroundSettings>) => {
    onBackgroundChange({
      ...currentBackground,
      ...updates
    });
  };

  return (
    <div className={`space-y-6 ${className}`}>
      <div className="space-y-4">
        <div className="flex items-center justify-between">
          <Label className="text-sm font-medium flex items-center gap-2">
            <Sparkles size={16} />
            Background Style
          </Label>
          <Button
            variant="outline"
            size="sm"
            onClick={() => setShowPreview(!showPreview)}
            className="flex items-center gap-2"
          >
            {showPreview ? <EyeOff size={14} /> : <Eye size={14} />}
            Preview
          </Button>
        </div>

        {/* Category Filter */}
        <div className="flex flex-wrap gap-2">
          {categories.map((category) => (
            <Button
              key={category}
              variant={selectedCategory === category ? "default" : "outline"}
              size="sm"
              onClick={() => setSelectedCategory(category)}
              className="text-xs capitalize"
            >
              {category}
            </Button>
          ))}
        </div>

        {/* Background Type Grid */}
        <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-5 gap-3">
          {filteredBackgrounds.map((bg) => (
            <Button
              key={bg.type}
              variant={currentBackground.type === bg.type ? "default" : "outline"}
              className="h-auto p-3 flex flex-col items-center gap-2 text-xs"
              onClick={() => updateBackground({ type: bg.type })}
            >
              <span className="text-lg">{bg.icon}</span>
              <span className="text-center leading-tight">{bg.name}</span>
            </Button>
          ))}
        </div>
      </div>

      {/* Settings Panel */}
      <div className="space-y-4 p-4 bg-muted/30 rounded-lg">
        <Label className="text-sm font-medium">Customization</Label>
        
        {/* Color Selection */}
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
          <div>
            <Label className="text-xs">Primary Color</Label>
            <div className="flex items-center gap-2 mt-1">
              <Input
                type="color"
                value={currentBackground.color}
                onChange={(e) => updateBackground({ color: e.target.value })}
                className="w-12 h-8 p-0 border-0 rounded"
              />
              <Input
                type="text"
                value={currentBackground.color}
                onChange={(e) => updateBackground({ color: e.target.value })}
                className="text-xs font-mono"
                placeholder="#000000"
              />
            </div>
          </div>

          {/* Animation Controls - Only show for animated backgrounds */}
          {currentBackground.type !== 'solid' && (
            <div>
              <Label className="text-xs">Animation Speed</Label>
              <div className="flex items-center gap-2 mt-1">
                <Input
                  type="range"
                  min="0.1"
                  max="10"
                  step="0.1"
                  value={currentBackground.speed}
                  onChange={(e) => updateBackground({ speed: parseFloat(e.target.value) })}
                  className="flex-1"
                />
                <span className="text-xs w-12 text-center">{currentBackground.speed.toFixed(1)}</span>
              </div>
            </div>
          )}
        </div>

        {/* Advanced Settings for specific backgrounds */}
        {currentBackground.type !== 'solid' && (
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div>
              <Label className="text-xs">Intensity</Label>
              <div className="flex items-center gap-2 mt-1">
                <Input
                  type="range"
                  min="0"
                  max="3"
                  step="0.1"
                  value={currentBackground.intensity}
                  onChange={(e) => updateBackground({ intensity: parseFloat(e.target.value) })}
                  className="flex-1"
                />
                <span className="text-xs w-12 text-center">{currentBackground.intensity.toFixed(1)}</span>
              </div>
            </div>

            {/* Hyperspeed Preset Selector */}
            {currentBackground.type === 'hyperspeed' && (
              <div>
                <Label className="text-xs">Preset</Label>
                <Select 
                  value={currentBackground.preset || 'default'} 
                  onValueChange={(value) => updateBackground({ preset: value })}
                >
                  <SelectTrigger className="mt-1">
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
            )}

            {/* Scale control for certain backgrounds */}
            {['galaxy', 'particles', 'ripplegrid'].includes(currentBackground.type) && (
              <div>
                <Label className="text-xs">Scale</Label>
                <div className="flex items-center gap-2 mt-1">
                  <Input
                    type="range"
                    min="0.5"
                    max="3"
                    step="0.1"
                    value={currentBackground.scale || 1}
                    onChange={(e) => updateBackground({ scale: parseFloat(e.target.value) })}
                    className="flex-1"
                  />
                  <span className="text-xs w-12 text-center">{(currentBackground.scale || 1).toFixed(1)}</span>
                </div>
              </div>
            )}
          </div>
        )}
      </div>

      {/* Preview */}
      {showPreview && (
        <div className="space-y-2">
          <Label className="text-sm font-medium">Live Preview</Label>
          <div className="relative w-full h-40 rounded-lg overflow-hidden border">
            <BackgroundPreview settings={currentBackground} />
          </div>
        </div>
      )}
    </div>
  );
}
