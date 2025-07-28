"use client";

import React, { Suspense } from "react";
import { BackgroundSettings } from "@/types/profile";
import DarkVeil from "@/components/backgrounds/DarkVeil/DarkVeil";
import Silk from "@/components/backgrounds/Silk/Silk";
import { Loader2 } from "lucide-react";

interface BackgroundPreviewProps {
  settings: BackgroundSettings;
  className?: string;
}

const BackgroundLoader = ({ children }: { children: React.ReactNode }) => (
  <Suspense
    fallback={
      <div className="w-full h-full flex items-center justify-center bg-muted">
        <Loader2 className="h-6 w-6 animate-spin text-muted-foreground" />
      </div>
    }
  >
    {children}
  </Suspense>
);

export default function BackgroundPreview({
  settings,
  className = "",
}: BackgroundPreviewProps) {
  const renderBackground = () => {
    switch (settings.type) {
      case "solid":
        return (
          <div
            className="w-full h-full"
            style={{
              backgroundColor: settings.color,
              backgroundImage:
                settings.color === "#ffffff" || settings.color === "#fff"
                  ? "radial-gradient(circle at 50% 50%, rgba(0,0,0,0.02) 0%, transparent 50%)"
                  : "none",
            }}
          />
        );

      case "darkveil":
        return (
          <BackgroundLoader>
            <DarkVeil
              hueShift={0}
              noiseIntensity={settings.intensity}
              speed={settings.speed}
            />
          </BackgroundLoader>
        );

      case "silk":
        return (
          <BackgroundLoader>
            <Silk
              color={settings.color}
              speed={settings.speed}
              noiseIntensity={settings.intensity}
            />
          </BackgroundLoader>
        );

      // Simplified fallbacks for backgrounds with incompatible props
      case "galaxy":
        return (
          <div
            className="w-full h-full relative"
            style={{
              background: `radial-gradient(circle at center, ${settings.color}33 0%, transparent 70%), 
                          radial-gradient(circle at 20% 20%, ${settings.color}22 0%, transparent 50%),
                          radial-gradient(circle at 80% 80%, ${settings.color}22 0%, transparent 50%),
                          linear-gradient(45deg, #000 0%, #111 100%)`,
              animation: `galaxy-spin ${30 / settings.speed}s linear infinite`,
            }}
          >
            <style jsx>{`
              @keyframes galaxy-spin {
                0% {
                  transform: rotate(0deg);
                }
                100% {
                  transform: rotate(360deg);
                }
              }
            `}</style>
          </div>
        );

      case "particles":
        return (
          <div
            className="w-full h-full relative overflow-hidden"
            style={{ backgroundColor: "#000" }}
          >
            <div
              className="absolute inset-0"
              style={{
                background: `radial-gradient(2px 2px at 20px 30px, ${settings.color}, transparent),
                            radial-gradient(2px 2px at 40px 70px, ${settings.color}88, transparent),
                            radial-gradient(1px 1px at 90px 40px, ${settings.color}66, transparent),
                            radial-gradient(1px 1px at 130px 80px, ${settings.color}, transparent),
                            radial-gradient(2px 2px at 160px 30px, ${settings.color}88, transparent)`,
                backgroundRepeat: "repeat",
                backgroundSize: "200px 100px",
                animation: `particles-float ${
                  20 / settings.speed
                }s linear infinite`,
              }}
            />
            <style jsx>{`
              @keyframes particles-float {
                0% {
                  transform: translateY(0px) translateX(0px);
                }
                25% {
                  transform: translateY(-10px) translateX(5px);
                }
                50% {
                  transform: translateY(-20px) translateX(-5px);
                }
                75% {
                  transform: translateY(-10px) translateX(5px);
                }
                100% {
                  transform: translateY(0px) translateX(0px);
                }
              }
            `}</style>
          </div>
        );

      case "lightrays":
        return (
          <div
            className="w-full h-full relative overflow-hidden"
            style={{
              background: `linear-gradient(45deg, ${settings.color}22 0%, transparent 50%, ${settings.color}11 100%),
                          linear-gradient(-45deg, transparent 0%, ${settings.color}33 50%, transparent 100%),
                          linear-gradient(90deg, ${settings.color}11 0%, transparent 100%)`,
              animation: `light-rays ${
                15 / settings.speed
              }s ease-in-out infinite`,
            }}
          >
            <style jsx>{`
              @keyframes light-rays {
                0%,
                100% {
                  opacity: 0.6;
                  transform: translateX(0);
                }
                50% {
                  opacity: 1;
                  transform: translateX(10px);
                }
              }
            `}</style>
          </div>
        );

      case "hyperspeed":
        return (
          <div className="w-full h-full relative overflow-hidden bg-black">
            <div
              className="absolute inset-0"
              style={{
                background: `linear-gradient(90deg, transparent 0%, #00ffff22 50%, transparent 100%),
                            linear-gradient(90deg, transparent 20%, #ff00ff11 70%, transparent 100%),
                            linear-gradient(90deg, transparent 40%, #ffff0022 90%, transparent 100%)`,
                backgroundSize: "200% 100%",
                animation: `hyperspeed ${5 / settings.speed}s linear infinite`,
              }}
            />
            <style jsx>{`
              @keyframes hyperspeed {
                0% {
                  background-position: -200% 0;
                }
                100% {
                  background-position: 200% 0;
                }
              }
            `}</style>
          </div>
        );

      case "iridescence":
        return (
          <div
            className="w-full h-full"
            style={{
              background: `linear-gradient(45deg, 
                          hsl(0, 100%, 50%) 0%,
                          hsl(60, 100%, 50%) 16.66%,
                          hsl(120, 100%, 50%) 33.33%,
                          hsl(180, 100%, 50%) 50%,
                          hsl(240, 100%, 50%) 66.66%,
                          hsl(300, 100%, 50%) 83.33%,
                          hsl(360, 100%, 50%) 100%)`,
              opacity: settings.intensity * 0.3,
              animation: `iridescence ${10 / settings.speed}s linear infinite`,
            }}
          >
            <style jsx>{`
              @keyframes iridescence {
                0% {
                  filter: hue-rotate(0deg);
                }
                100% {
                  filter: hue-rotate(360deg);
                }
              }
            `}</style>
          </div>
        );

      case "ripplegrid":
        return (
          <div
            className="w-full h-full"
            style={{
              background: `radial-gradient(circle at 25% 25%, ${settings.color}33 0%, transparent 50%),
                          radial-gradient(circle at 75% 75%, ${settings.color}22 0%, transparent 50%),
                          linear-gradient(45deg, ${settings.color}11 25%, transparent 25%, transparent 75%, ${settings.color}11 75%)`,
              backgroundSize: "40px 40px, 40px 40px, 20px 20px",
              animation: `ripple-grid ${
                8 / settings.speed
              }s ease-in-out infinite`,
            }}
          >
            <style jsx>{`
              @keyframes ripple-grid {
                0%,
                100% {
                  transform: scale(1);
                  opacity: 0.6;
                }
                50% {
                  transform: scale(1.1);
                  opacity: 1;
                }
              }
            `}</style>
          </div>
        );

      case "faultyterminal":
        return (
          <div className="w-full h-full bg-black relative overflow-hidden">
            <div
              className="absolute inset-0 opacity-80"
              style={{
                background: `repeating-linear-gradient(
                  0deg,
                  transparent,
                  transparent 2px,
                  #00ff0022 2px,
                  #00ff0022 4px
                )`,
                animation: `terminal-glitch ${
                  3 / settings.speed
                }s steps(10) infinite`,
              }}
            />
            <div
              className="absolute inset-0"
              style={{
                background: "#00ff00",
                opacity: 0.1,
                animation: `terminal-flicker ${
                  0.1 / settings.speed
                }s linear infinite`,
              }}
            />
            <style jsx>{`
              @keyframes terminal-glitch {
                0%,
                90% {
                  transform: translateX(0);
                }
                10% {
                  transform: translateX(-2px);
                }
                20% {
                  transform: translateX(2px);
                }
                30% {
                  transform: translateX(-1px);
                }
              }
              @keyframes terminal-flicker {
                0%,
                100% {
                  opacity: 0.1;
                }
                50% {
                  opacity: 0.2;
                }
              }
            `}</style>
          </div>
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
