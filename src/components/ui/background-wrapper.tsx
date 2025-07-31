"use client";

import React, { Suspense, useCallback, useMemo, useRef, useEffect } from "react";
import { BackgroundSettings, getPrimaryColor, ensureIridescenceColor } from "@/types/profile";
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
    <div className="w-full h-full flex items-center justify-center bg-white">
      <Loader2 className="h-6 w-6 animate-spin text-gray-600" />
    </div>
  )
});

const Squares = dynamic(() => import("@/components/backgrounds/Squares/Squares"), {
  ssr: false,
  loading: () => (
    <div className="w-full h-full flex items-center justify-center bg-black">
      <Loader2 className="h-6 w-6 animate-spin text-white" />
    </div>
  )
});

const Iridescence = dynamic(() => import("@/components/backgrounds/Iridescence/Iridescence"), {
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
  const containerRef = useRef<HTMLDivElement>(null);
  const currentTypeRef = useRef<string>(settings.type);
  
  useEffect(() => {
    if (currentTypeRef.current !== settings.type) {
      currentTypeRef.current = settings.type;
    }
  }, [settings.type]);

  // Memoize hyperspeed options
  const hyperspeedOptions = useMemo(() => {
    const baseColor = getPrimaryColor(settings.color);
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
        background: parseInt(baseColor.replace('#', ''), 16) || 0x000000,
        shoulderLines: 0x131318,
        brokenLines: 0x131318,
        leftCars: [0xd856bf, 0x6750a2, 0xc247ac],
        rightCars: [0x03b3c3, 0x0e5ea5, 0x324555],
        sticks: 0x03b3c3,
      }
    };

    // Apply preset configurations
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
            background: parseInt(baseColor.replace('#', ''), 16) || 0x0f0f0f,
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
            background: parseInt(baseColor.replace('#', ''), 16) || 0x000000,
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
            background: parseInt(baseColor.replace('#', ''), 16) || 0x1a1a1a,
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
            background: parseInt(baseColor.replace('#', ''), 16) || 0x000011,
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
            background: parseInt(baseColor.replace('#', ''), 16) || 0x0a0f1c,
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
        const isGradient = Array.isArray(settings.color) && settings.color.length > 1;
        let backgroundStyle: string;
        
        if (isGradient) {
          const direction = settings.gradientDirection || 135;
          const type = settings.gradientType || 'linear';
          const colors = settings.color as string[];
          
          if (type === 'radial') {
            backgroundStyle = `radial-gradient(circle, ${colors.join(', ')})`;
          } else {
            backgroundStyle = `linear-gradient(${direction}deg, ${colors.join(', ')})`;
          }
        } else {
          backgroundStyle = getPrimaryColor(settings.color);
        }
        
        return (
          <div 
            key={`solid-${uniqueKey}`}
            className="w-full h-full transition-all duration-500"
            style={{ background: backgroundStyle }}
          />
        );
      
      case 'hyperspeed':
        return (
          <BackgroundLoader key={`hyperspeed-${uniqueKey}`}>
            <div className="w-full h-full relative">
              <div 
                className="absolute inset-0 transition-colors duration-500"
                style={{ backgroundColor: getPrimaryColor(settings.color) }}
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
                  color={getPrimaryColor(settings.color) || '#ffffff'}
                  noiseIntensity={settings.noiseIntensity || 1.5}
                  rotation={settings.rotation || 0}
                />
              </div>
            </div>
          </BackgroundLoader>
        );
      
      case 'squares':
        return (
          <BackgroundLoader key={`squares-${uniqueKey}`}>
            <div className="w-full h-full relative">
              <div 
                className="absolute inset-0"
                style={{ backgroundColor: getPrimaryColor(settings.color) }}
              />
              <div className="absolute inset-0">
                <Squares
                  key={`squares-component-${settings.direction}-${settings.speed}-${settings.borderColor}-${settings.squareSize}-${settings.hoverFillColor}`}
                  direction={settings.direction || 'right'}
                  speed={settings.speed || 1}
                  borderColor={settings.borderColor || '#999'}
                  squareSize={settings.squareSize || 40}
                  hoverFillColor={settings.hoverFillColor || '#222'}
                />
              </div>
            </div>
          </BackgroundLoader>
        );
      
      case 'iridescence':
        // FIXED: Use the helper function to ensure proper tuple type
        const iridescenceColor = ensureIridescenceColor(settings.iridescenceColor);
        
        return (
          <BackgroundLoader key={`iridescence-${uniqueKey}`}>
            <div className="w-full h-full relative">
              <div className="w-full h-full">
                <Iridescence
                  key={`iridescence-component-${JSON.stringify(iridescenceColor)}-${settings.speed}-${settings.amplitude}-${settings.mouseReact}`}
                  color={iridescenceColor}
                  speed={settings.speed || 1.0}
                  amplitude={settings.amplitude || 0.1}
                  mouseReact={settings.mouseReact || false}
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
            style={{ backgroundColor: getPrimaryColor(settings.color) }}
          />
        );
    }
  }, [settings, hyperspeedOptions]);

  return (
    <div 
      ref={containerRef}
      className={`relative w-full h-full overflow-hidden ${className}`}
      style={{ backgroundColor: getPrimaryColor(settings.color) }}
    >
      {renderBackground()}
    </div>
  );
}
