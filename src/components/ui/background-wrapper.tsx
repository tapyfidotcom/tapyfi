"use client";

import React, { Suspense, useCallback, useMemo, useRef, useEffect } from "react";
import { BackgroundSettings } from "@/types/profile";
import { Loader2 } from "lucide-react";
import dynamic from "next/dynamic";

// Dynamic imports with better error handling
const Hyperspeed = dynamic(() => import("@/components/backgrounds/Hyperspeed/Hyperspeed"), {
  ssr: false,
  loading: () => (
    <div className="w-full h-full flex items-center justify-center bg-black">
      <Loader2 className="h-6 w-6 animate-spin text-white" />
    </div>
  )
});

const Silk = dynamic(() => import("@/components/backgrounds/Silk/Silk"), {
  ssr: false,
  loading: () => (
    <div className="w-full h-full flex items-center justify-center bg-gray-500">
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
  const containerRef = useRef<HTMLDivElement>(null);
  const currentTypeRef = useRef<string>(settings.type);
  
  // Track type changes to force remount when needed
  useEffect(() => {
    if (currentTypeRef.current !== settings.type) {
      currentTypeRef.current = settings.type;
    }
  }, [settings.type]);

  // Memoize options to prevent unnecessary re-renders
  const hyperspeedOptions = useMemo(() => {
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

    // Apply preset-specific configurations
    switch (settings.preset) {
      case 'two':
        return {
          ...baseOptions,
          distortion: settings.distortion || "mountainDistortion",
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
      case 'three':
        return {
          ...baseOptions,
          distortion: settings.distortion || "LongRaceDistortion",
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
      case 'four':
        return {
          ...baseOptions,
          distortion: settings.distortion || "xyDistortion",
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
      case 'five':
        return {
          ...baseOptions,
          distortion: settings.distortion || "turbulentDistortion",
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
      case 'six':
        return {
          ...baseOptions,
          distortion: settings.distortion || "deepDistortion",
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
      default:
        return {
          ...baseOptions,
          distortion: settings.distortion || "turbulentDistortion",
        };
    }
  }, [settings]);

  const renderBackground = useCallback(() => {
    const uniqueKey = `${settings.type}-${Date.now()}`;
    
    switch (settings.type) {
      case 'solid':
        return (
          <div 
            key={`solid-${settings.color}`}
            className="w-full h-full transition-colors duration-500"
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
          <BackgroundLoader key={`hyperspeed-${uniqueKey}`}>
            <div className="w-full h-full relative">
              <div 
                className="absolute inset-0 transition-colors duration-500"
                style={{ backgroundColor: settings.color }}
              />
              <div className="absolute inset-0">
                <Hyperspeed
                  key={`hyperspeed-component-${JSON.stringify(hyperspeedOptions)}`}
                  effectOptions={hyperspeedOptions}
                />
              </div>
            </div>
          </BackgroundLoader>
        );
      
      case 'silk':
        return (
          <BackgroundLoader key={`silk-${uniqueKey}`}>
            <div className="w-full h-full relative">
              <div className="w-full h-full">
                <Silk
                  key={`silk-component-${settings.speed}-${settings.scale}-${settings.color}-${settings.noiseIntensity}-${settings.rotation}`}
                  speed={settings.speed || 5}
                  scale={settings.scale || 1}
                  color={settings.color || '#7B7481'}
                  noiseIntensity={settings.noiseIntensity || 1.5}
                  rotation={settings.rotation || 0}
                />
              </div>
            </div>
          </BackgroundLoader>
        );
      
      default:
        return (
          <div 
            key={`default-${settings.color}`}
            className="w-full h-full"
            style={{ backgroundColor: settings.color }}
          />
        );
    }
  }, [settings, hyperspeedOptions]);

  return (
    <div 
      ref={containerRef}
      className={`relative w-full h-full overflow-hidden ${className}`}
      style={{ backgroundColor: settings.color }}
    >
      {renderBackground()}
    </div>
  );
}
