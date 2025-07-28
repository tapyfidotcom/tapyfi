"use client";

import React, { Suspense } from "react";
import { BackgroundSettings } from "@/types/profile";
import { Loader2 } from "lucide-react";
import dynamic from "next/dynamic";

// Dynamically import Hyperspeed to avoid SSR issues
const Hyperspeed = dynamic(() => import("@/components/backgrounds/Hyperspeed/Hyperspeed"), {
  ssr: false,
  loading: () => <div className="w-full h-full flex items-center justify-center bg-black"><Loader2 className="h-6 w-6 animate-spin text-white" /></div>
});

interface BackgroundPreviewProps {
  settings: BackgroundSettings;
  className?: string;
}

const BackgroundLoader = ({ children }: { children: React.ReactNode }) => (
  <Suspense fallback={
    <div className="w-full h-full flex items-center justify-center bg-muted">
      <Loader2 className="h-6 w-6 animate-spin text-muted-foreground" />
    </div>
  }>
    {children}
  </Suspense>
);

export default function BackgroundPreview({ settings, className = "" }: BackgroundPreviewProps) {
  // Ensure intensity is never undefined
  const safeIntensity = settings.intensity ?? 1;
  const safeSpeed = settings.speed ?? 1;

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
            <Hyperspeed
              effectOptions={{
                distortion: settings.distortion || "turbulentDistortion",
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
                  background: 0x000000,
                  shoulderLines: 0x131318,
                  brokenLines: 0x131318,
                  leftCars: [0xd856bf, 0x6750a2, 0xc247ac],
                  rightCars: [0x03b3c3, 0x0e5ea5, 0x324555],
                  sticks: 0x03b3c3,
                }
              }}
            />
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
