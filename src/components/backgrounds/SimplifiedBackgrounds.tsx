"use client";

import React from "react";
import { BackgroundSettings } from "@/types/profile";

interface BackgroundComponentProps {
  settings: BackgroundSettings;
  className?: string;
}

export const SimpleDarkVeil: React.FC<BackgroundComponentProps> = ({ settings, className = "" }) => {
  return (
    <div className={`w-full h-full relative overflow-hidden ${className}`}>
      <div 
        className="absolute inset-0"
        style={{
          background: `
            radial-gradient(circle at 20% 20%, ${settings.color}33 0%, transparent 50%),
            radial-gradient(circle at 80% 80%, ${settings.color}44 0%, transparent 50%),
            radial-gradient(circle at 40% 70%, ${settings.color}22 0%, transparent 50%),
            linear-gradient(45deg, #000 0%, #111 50%, #000 100%)
          `,
          animation: `darkVeilFlow ${30 / settings.speed}s ease-in-out infinite`,
          opacity: settings.intensity
        }}
      />
      <div 
        className="absolute inset-0"
        style={{
          background: `repeating-linear-gradient(
            0deg,
            transparent,
            transparent 2px,
            ${settings.color}11 2px,
            ${settings.color}11 4px
          )`,
          animation: `scanlines ${2 / settings.speed}s linear infinite`
        }}
      />
      <style jsx>{`
        @keyframes darkVeilFlow {
          0%, 100% { transform: translateX(0) translateY(0) rotate(0deg); }
          25% { transform: translateX(10px) translateY(-5px) rotate(1deg); }
          50% { transform: translateX(-5px) translateY(10px) rotate(-1deg); }
          75% { transform: translateX(5px) translateY(5px) rotate(0.5deg); }
        }
        @keyframes scanlines {
          0% { transform: translateY(0); }
          100% { transform: translateY(4px); }
        }
      `}</style>
    </div>
  );
};

export const SimpleSilk: React.FC<BackgroundComponentProps> = ({ settings, className = "" }) => {
  return (
    <div 
      className={`w-full h-full relative overflow-hidden ${className}`}
      style={{ backgroundColor: settings.color }}
    >
      <div 
        className="absolute inset-0"
        style={{
          background: `
            radial-gradient(ellipse at top left, rgba(255,255,255,${settings.intensity * 0.1}) 0%, transparent 50%),
            radial-gradient(ellipse at top right, rgba(255,255,255,${settings.intensity * 0.08}) 0%, transparent 50%),
            radial-gradient(ellipse at bottom left, rgba(255,255,255,${settings.intensity * 0.12}) 0%, transparent 50%),
            linear-gradient(45deg, transparent 25%, rgba(255,255,255,${settings.intensity * 0.05}) 25%, rgba(255,255,255,${settings.intensity * 0.05}) 50%, transparent 50%)
          `,
          backgroundSize: '400px 400px, 350px 350px, 450px 450px, 100px 100px',
          animation: `silkFlow ${25 / settings.speed}s ease-in-out infinite`
        }}
      />
      <style jsx>{`
        @keyframes silkFlow {
          0%, 100% { transform: translateX(0) translateY(0); background-position: 0% 0%, 100% 0%, 0% 100%, 0% 0%; }
          25% { transform: translateX(2px) translateY(-2px); background-position: 25% 25%, 75% 25%, 25% 75%, 25% 25%; }
          50% { transform: translateX(-1px) translateY(2px); background-position: 50% 50%, 50% 50%, 50% 50%, 50% 50%; }
          75% { transform: translateX(1px) translateY(1px); background-position: 75% 25%, 25% 75%, 75% 25%, 75% 75%; }
        }
      `}</style>
    </div>
  );
};

export const SimpleLightRays: React.FC<BackgroundComponentProps> = ({ settings, className = "" }) => {
  return (
    <div className={`w-full h-full relative overflow-hidden ${className}`}>
      <div 
        className="absolute inset-0"
        style={{
          background: `
            conic-gradient(from 0deg at 50% 0%, 
              transparent 0deg,
              ${settings.color}${Math.round(settings.intensity * 255).toString(16).padStart(2, '0')} 45deg,
              transparent 90deg,
              ${settings.color}${Math.round(settings.intensity * 180).toString(16).padStart(2, '0')} 135deg,
              transparent 180deg,
              ${settings.color}${Math.round(settings.intensity * 255).toString(16).padStart(2, '0')} 225deg,
              transparent 270deg,
              ${settings.color}${Math.round(settings.intensity * 180).toString(16).padStart(2, '0')} 315deg,
              transparent 360deg
            )
          `,
          animation: `lightRaysRotate ${20 / settings.speed}s linear infinite`
        }}
      />
      <style jsx>{`
        @keyframes lightRaysRotate {
          0% { transform: rotate(0deg); }
          100% { transform: rotate(360deg); }
        }
      `}</style>
    </div>
  );
};

export const SimpleGalaxy: React.FC<BackgroundComponentProps> = ({ settings, className = "" }) => {
  return (
    <div className={`w-full h-full relative overflow-hidden bg-black ${className}`}>
      <div 
        className="absolute inset-0"
        style={{
          background: `
            radial-gradient(2px 2px at 20px 30px, ${settings.color}, transparent),
            radial-gradient(2px 2px at 40px 70px, ${settings.color}88, transparent),
            radial-gradient(1px 1px at 90px 40px, ${settings.color}66, transparent),
            radial-gradient(1px 1px at 130px 80px, ${settings.color}, transparent),
            radial-gradient(2px 2px at 160px 30px, ${settings.color}88, transparent),
            radial-gradient(1px 1px at 200px 60px, ${settings.color}44, transparent),
            radial-gradient(2px 2px at 240px 90px, ${settings.color}, transparent),
            radial-gradient(1px 1px at 280px 20px, ${settings.color}77, transparent)
          `,
          backgroundRepeat: 'repeat',
          backgroundSize: '300px 200px',
          animation: `galaxyFloat ${40 / settings.speed}s linear infinite, galaxyTwinkle ${3 / settings.speed}s ease-in-out infinite alternate`
        }}
      />
      <div 
        className="absolute inset-0"
        style={{
          background: `radial-gradient(circle at center, ${settings.color}22 0%, transparent 70%)`,
          animation: `galaxySpin ${60 / settings.speed}s linear infinite`
        }}
      />
      <style jsx>{`
        @keyframes galaxyFloat {
          0% { transform: translateY(0px) translateX(0px); }
          25% { transform: translateY(-10px) translateX(5px); }
          50% { transform: translateY(-20px) translateX(-5px); }
          75% { transform: translateY(-10px) translateX(5px); }
          100% { transform: translateY(0px) translateX(0px); }
        }
        @keyframes galaxySpin {
          0% { transform: rotate(0deg); }
          100% { transform: rotate(360deg); }
        }
        @keyframes galaxyTwinkle {
          0% { opacity: ${settings.intensity * 0.8}; }
          100% { opacity: ${settings.intensity}; }
        }
      `}</style>
    </div>
  );
};

export const SimpleParticles: React.FC<BackgroundComponentProps> = ({ settings, className = "" }) => {
  return (
    <div className={`w-full h-full relative overflow-hidden ${className}`} style={{ backgroundColor: settings.color }}>
      <div 
        className="absolute inset-0"
        style={{
          background: `
            radial-gradient(1px 1px at 10px 20px, white, transparent),
            radial-gradient(1px 1px at 50px 60px, white, transparent),
            radial-gradient(1px 1px at 80px 30px, white, transparent),
            radial-gradient(1px 1px at 120px 80px, white, transparent),
            radial-gradient(1px 1px at 160px 40px, white, transparent),
            radial-gradient(1px 1px at 200px 70px, white, transparent),
            radial-gradient(1px 1px at 240px 25px, white, transparent),
            radial-gradient(1px 1px at 280px 90px, white, transparent)
          `,
          backgroundSize: '300px 100px',
          backgroundRepeat: 'repeat',
          opacity: settings.intensity,
          animation: `particlesFloat ${15 / settings.speed}s linear infinite`
        }}
      />
      <style jsx>{`
        @keyframes particlesFloat {
          0% { transform: translateY(100px); }
          100% { transform: translateY(-100px); }
        }
      `}</style>
    </div>
  );
};
