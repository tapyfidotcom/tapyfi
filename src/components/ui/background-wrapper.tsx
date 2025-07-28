"use client";

import React, { Suspense } from "react";
import { BackgroundSettings } from "@/types/profile";
import { Loader2 } from "lucide-react";
import dynamic from "next/dynamic";

// Dynamic import for Hyperspeed to avoid SSR issues
const Hyperspeed = dynamic(() => import("@/components/backgrounds/Hyperspeed/Hyperspeed"), {
  ssr: false,
  loading: () => (
    <div className="w-full h-full flex items-center justify-center bg-black">
      <Loader2 className="h-6 w-6 animate-spin text-white" />
    </div>
  )
});

interface BackgroundWrapperProps {
  settings: BackgroundSettings;
  className?: string;
}

const BackgroundLoader = ({ children }: { children: React.ReactNode }) => (
  <Suspense fallback={
    <div className="w-full h-full flex items-center justify-center bg-muted animate-pulse">
      <Loader2 className="h-6 w-6 animate-spin text-muted-foreground" />
    </div>
  }>
    {children}
  </Suspense>
);

export default function BackgroundWrapper({ settings, className = "" }: BackgroundWrapperProps) {
  const safeIntensity = settings.intensity ?? 1;
  const safeSpeed = settings.speed ?? 1;

  // Map presets to distortion types and colors based on the original code
  const getHyperspeedOptions = () => {
    const baseOptions = {
      speedUp: settings.speedUp || 2,
      fov: settings.fov || 90,
      fovSpeedUp: settings.fovSpeedUp || 150,
      roadWidth: settings.roadWidth || 10,
      islandWidth: settings.islandWidth || 2,
      lanesPerRoad: settings.lanesPerRoad || 3,
      carLightsFade: settings.carLightsFade || 0.4,
      totalSideLightSticks: settings.totalSideLightSticks || 20,
      lightPairsPerRoadWay: settings.lightPairsPerRoadWay || 40,
      colors: {
        roadColor: 0x080808,
        islandColor: 0x0a0a0a,
        background: parseInt(settings.color.replace('#', ''), 16) || 0x000000,
        shoulderLines: 0x131318,
        brokenLines: 0x131318,
        leftCars: [0xd856bf, 0x6750a2, 0xc247ac],
        rightCars: [0x03b3c3, 0x0e5ea5, 0x324555],
        sticks: 0x03b3c3,
      }
    };

    // Apply preset-specific configurations with proper distortion override
    switch (settings.preset) {
      case 'two': // Mountain
        return {
          ...baseOptions,
          distortion: settings.distortion || "mountainDistortion", // Use user selection or default
          roadWidth: 12,
          lanesPerRoad: 4,
          colors: {
            ...baseOptions.colors,
            roadColor: 0x1a1a1a,
            islandColor: 0x2a2a2a,
            background: parseInt(settings.color.replace('#', ''), 16) || 0x0f0f0f,
            shoulderLines: 0x4a4a4a,
            brokenLines: 0x6a6a6a,
            leftCars: [0xff6b6b, 0xff8e8e, 0xffa8a8],
            rightCars: [0x4ecdc4, 0x45b7b8, 0x26de81],
            sticks: 0x45b7b8,
          }
        };
      case 'three': // Racing
        return {
          ...baseOptions,
          distortion: settings.distortion || "LongRaceDistortion", // Use user selection or default
          roadWidth: 15,
          lanesPerRoad: 4,
          speedUp: 3,
          colors: {
            ...baseOptions.colors,
            roadColor: 0x0a0a0a,
            islandColor: 0x151515,
            background: parseInt(settings.color.replace('#', ''), 16) || 0x000000,
            shoulderLines: 0xffffff,
            brokenLines: 0xffff00,
            leftCars: [0xff0000, 0xff3333, 0xff6666],
            rightCars: [0x0000ff, 0x3333ff, 0x6666ff],
            sticks: 0xffffff,
          }
        };
      case 'four': // Highway
        return {
          ...baseOptions,
          distortion: settings.distortion || "xyDistortion", // Use user selection or default
          roadWidth: 20,
          lanesPerRoad: 5,
          colors: {
            ...baseOptions.colors,
            roadColor: 0x2c2c2c,
            islandColor: 0x3c3c3c,
            background: parseInt(settings.color.replace('#', ''), 16) || 0x1a1a1a,
            shoulderLines: 0xffffff,
            brokenLines: 0xffffff,
            leftCars: [0xffa500, 0xffb347, 0xffc266],
            rightCars: [0x8a2be2, 0x9932cc, 0xba55d3],
            sticks: 0xffa500,
          }
        };
      case 'five': // Neon
        return {
          ...baseOptions,
          distortion: settings.distortion || "turbulentDistortion", // Use user selection or default
          roadWidth: 8,
          lanesPerRoad: 2,
          colors: {
            ...baseOptions.colors,
            roadColor: 0x001122,
            islandColor: 0x002244,
            background: parseInt(settings.color.replace('#', ''), 16) || 0x000011,
            shoulderLines: 0x00ffff,
            brokenLines: 0xff00ff,
            leftCars: [0x00ff00, 0x33ff33, 0x66ff66],
            rightCars: [0xff1493, 0xff69b4, 0xffc0cb],
            sticks: 0x00ffff,
          }
        };
      case 'six': // Deep
        return {
          ...baseOptions,
          distortion: settings.distortion || "deepDistortion", // Use user selection or default
          roadWidth: 14,
          lanesPerRoad: 3,
          colors: {
            ...baseOptions.colors,
            roadColor: 0x0d1b2a,
            islandColor: 0x1b263b,
            background: parseInt(settings.color.replace('#', ''), 16) || 0x0a0f1c,
            shoulderLines: 0x415a77,
            brokenLines: 0x778da9,
            leftCars: [0xe63946, 0xf77f00, 0xfcbf49],
            rightCars: [0x277da1, 0x4d908e, 0x90e0ef],
            sticks: 0x277da1,
          }
        };
      default: // 'one' - Cyberpunk (default)
        return {
          ...baseOptions,
          distortion: settings.distortion || "turbulentDistortion", // Always use user selection or default
        };
    }
  };

  const renderBackground = () => {
    switch (settings.type) {
      case 'solid':
        return (
          <div 
            className="w-full h-full"
            style={{ 
              backgroundColor: settings.color,
              ...(settings.color === '#ffffff' || settings.color === '#fff' ? {
                backgroundImage: 'radial-gradient(circle at 50% 50%, rgba(0,0,0,0.02) 0%, transparent 50%)'
              } : {})
            }}
          />
        );
      
      case 'hyperspeed':
        return (
          <BackgroundLoader>
            <div className="w-full h-full relative">
              {/* Background color layer */}
              <div 
                className="absolute inset-0"
                style={{ backgroundColor: settings.color }}
              />
              
              {/* Hyperspeed animation layer */}
              <div className="absolute inset-0">
                <Hyperspeed
                  effectOptions={getHyperspeedOptions()}
                />
              </div>
            </div>
          </BackgroundLoader>
        );
      
      default:
        return (
          <div 
            className="w-full h-full"
            style={{ backgroundColor: settings.color }}
          />
        );
    }
  };

  return (
    <div className={`relative w-full h-full overflow-hidden ${className}`}>
      {renderBackground()}
    </div>
  );
}
