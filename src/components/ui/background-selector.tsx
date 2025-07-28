"use client";

import React, { useState } from "react";
import { Label } from "@/components/ui/label";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Palette, Eye, EyeOff } from "lucide-react";
import DarkVeil from "@/components/backgrounds/DarkVeil/DarkVeil";
import Silk from "@/components/backgrounds/Silk/Silk";

interface BackgroundSelectorProps {
  currentBackground: {
    type: 'solid' | 'darkveil' | 'silk';
    color: string;
    speed: number;  // Changed from optional to required
    intensity: number;  // Changed from optional to required
  };
  onBackgroundChange: (background: {
    type: 'solid' | 'darkveil' | 'silk';
    color: string;
    speed: number;  // Changed from optional to required
    intensity: number;  // Changed from optional to required
  }) => void;
  className?: string;
}

export default function BackgroundSelector({
  currentBackground,
  onBackgroundChange,
  className = ""
}: BackgroundSelectorProps) {
  const [showPreview, setShowPreview] = useState(false);

  const backgroundTypes = [
    { type: 'solid', name: 'Solid Color' },
    { type: 'darkveil', name: 'Dark Veil' },
    { type: 'silk', name: 'Silk' },
  ] as const;

  const renderBackgroundPreview = () => {
    switch (currentBackground.type) {
      case 'darkveil':
        return (
          <DarkVeil
            hueShift={0}
            noiseIntensity={currentBackground.intensity}
            speed={currentBackground.speed}
          />
        );
      case 'silk':
        return (
          <Silk
            color={currentBackground.color}
            speed={currentBackground.speed}
            noiseIntensity={currentBackground.intensity}
          />
        );
      default:
        return null;
    }
  };

  return (
    <div className={`space-y-4 ${className}`}>
      <Label className="text-sm font-medium">Background Style</Label>
      
      {/* Background Type Selection */}
      <div className="grid grid-cols-3 gap-2">
        {backgroundTypes.map((bg) => (
          <Button
            key={bg.type}
            variant={currentBackground.type === bg.type ? "default" : "outline"}
            size="sm"
            onClick={() => onBackgroundChange({
              ...currentBackground,
              type: bg.type
            })}
            className="text-xs"
          >
            {bg.name}
          </Button>
        ))}
      </div>

      {/* Color Selection */}
      <div className="flex items-center gap-2">
        <Label htmlFor="bg-color" className="text-sm">Color</Label>
        <Input
          id="bg-color"
          type="color"
          value={currentBackground.color}
          onChange={(e) => onBackgroundChange({
            ...currentBackground,
            color: e.target.value
          })}
          className="w-12 h-8 p-0 border-0"
        />
        <Input
          type="text"
          value={currentBackground.color}
          onChange={(e) => onBackgroundChange({
            ...currentBackground,
            color: e.target.value
          })}
          className="text-xs font-mono"
          placeholder="#000000"
        />
      </div>

      {/* Animation Controls */}
      {currentBackground.type !== 'solid' && (
        <div className="space-y-2">
          <div className="flex items-center gap-2">
            <Label className="text-xs">Speed</Label>
            <Input
              type="range"
              min="0.1"
              max="10"
              step="0.1"
              value={currentBackground.speed}
              onChange={(e) => onBackgroundChange({
                ...currentBackground,
                speed: parseFloat(e.target.value)
              })}
              className="flex-1 h-2"
            />
            <span className="text-xs w-8">{currentBackground.speed.toFixed(1)}</span>
          </div>
          
          <div className="flex items-center gap-2">
            <Label className="text-xs">Intensity</Label>
            <Input
              type="range"
              min="0"
              max="3"
              step="0.1"
              value={currentBackground.intensity}
              onChange={(e) => onBackgroundChange({
                ...currentBackground,
                intensity: parseFloat(e.target.value)
              })}
              className="flex-1 h-2"
            />
            <span className="text-xs w-8">{currentBackground.intensity.toFixed(1)}</span>
          </div>
        </div>
      )}

      {/* Preview Toggle */}
      <Button
        variant="outline"
        size="sm"
        onClick={() => setShowPreview(!showPreview)}
        className="w-full flex items-center gap-2"
      >
        {showPreview ? <EyeOff size={14} /> : <Eye size={14} />}
        {showPreview ? 'Hide Preview' : 'Show Preview'}
      </Button>

      {/* Preview */}
      {showPreview && (
        <div className="relative w-full h-32 rounded-lg overflow-hidden border">
          {currentBackground.type === 'solid' ? (
            <div 
              className="w-full h-full"
              style={{ backgroundColor: currentBackground.color }}
            />
          ) : (
            renderBackgroundPreview()
          )}
        </div>
      )}
    </div>
  );
}
