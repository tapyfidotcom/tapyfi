"use client";

import React from "react";
import { BackgroundSettings } from "@/types/profile";

interface BackgroundComponentProps {
  settings: BackgroundSettings;
  className?: string;
}

// SOLID BACKGROUND (SimpleDarkVeil)
export const SimpleDarkVeil: React.FC<BackgroundComponentProps> = ({ settings, className = "" }) => {
  const speed = settings.speed ?? 1;
  const intensity = settings.intensity ?? 1;
  const color = typeof settings.color === 'string' ? settings.color : settings.color[0];

  return (
    <div className={`w-full h-full relative overflow-hidden ${className}`}>
      <div 
        className="absolute inset-0"
        style={{
          background: `
            radial-gradient(circle at 20% 20%, ${color}33 0%, transparent 50%),
            radial-gradient(circle at 80% 80%, ${color}44 0%, transparent 50%),
            radial-gradient(circle at 40% 70%, ${color}22 0%, transparent 50%),
            linear-gradient(45deg, #000 0%, #111 50%, #000 100%)
          `,
          animation: `darkVeilFlow ${30 / speed}s ease-in-out infinite`,
          opacity: intensity
        }}
      />
      <div 
        className="absolute inset-0"
        style={{
          background: `repeating-linear-gradient(
            0deg,
            transparent,
            transparent 2px,
            ${color}11 2px,
            ${color}11 4px
          )`,
          animation: `scanlines ${2 / speed}s linear infinite`
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

// HYPERSPEED BACKGROUND
export const SimpleHyperspeed: React.FC<BackgroundComponentProps> = ({ settings, className = "" }) => {
  const speed = settings.speed ?? 1;
  const intensity = settings.intensity ?? 1;
  const color = typeof settings.color === 'string' ? settings.color : settings.color[0];

  return (
    <div className={`w-full h-full relative overflow-hidden bg-black ${className}`}>
      <div 
        className="absolute inset-0"
        style={{
          background: `
            repeating-linear-gradient(90deg, 
              transparent 0px, 
              ${color}22 1px, 
              transparent 2px, 
              transparent 100px
            ),
            repeating-linear-gradient(0deg, 
              transparent 0px, 
              ${color}11 1px, 
              transparent 2px, 
              transparent 100px
            )
          `,
          animation: `hyperspeedFlow ${20 / speed}s linear infinite`,
          opacity: intensity
        }}
      />
      <style jsx>{`
        @keyframes hyperspeedFlow {
          0% { background-position: 0% 0%, 0% 0%; }
          100% { background-position: 100% 0%, 0% 100%; }
        }
      `}</style>
    </div>
  );
};

// SILK BACKGROUND
export const SimpleSilk: React.FC<BackgroundComponentProps> = ({ settings, className = "" }) => {
  const speed = settings.speed ?? 1;
  const intensity = settings.intensity ?? 1;
  const color = typeof settings.color === 'string' ? settings.color : settings.color[0];

  return (
    <div 
      className={`w-full h-full relative overflow-hidden ${className}`}
      style={{ backgroundColor: color }}
    >
      <div 
        className="absolute inset-0"
        style={{
          background: `
            radial-gradient(ellipse at top left, rgba(255,255,255,${intensity * 0.1}) 0%, transparent 50%),
            radial-gradient(ellipse at top right, rgba(255,255,255,${intensity * 0.08}) 0%, transparent 50%),
            radial-gradient(ellipse at bottom left, rgba(255,255,255,${intensity * 0.12}) 0%, transparent 50%),
            linear-gradient(45deg, transparent 25%, rgba(255,255,255,${intensity * 0.05}) 25%, rgba(255,255,255,${intensity * 0.05}) 50%, transparent 50%)
          `,
          backgroundSize: '400px 400px, 350px 350px, 450px 450px, 100px 100px',
          animation: `silkFlow ${25 / speed}s ease-in-out infinite`
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

// SQUARES BACKGROUND
export const SimpleSquares: React.FC<BackgroundComponentProps> = ({ settings, className = "" }) => {
  const speed = settings.speed ?? 1;
  const intensity = settings.intensity ?? 1;
  const color = typeof settings.color === 'string' ? settings.color : settings.color[0];
  const squareSize = settings.squareSize ?? 40;

  return (
    <div 
      className={`w-full h-full relative overflow-hidden ${className}`}
      style={{ backgroundColor: color }}
    >
      <div 
        className="absolute inset-0"
        style={{
          background: `
            repeating-conic-gradient(from 0deg at 50% 50%, 
              transparent 0deg, 
              ${color}44 45deg, 
              transparent 90deg, 
              ${color}22 135deg, 
              transparent 180deg, 
              ${color}44 225deg, 
              transparent 270deg, 
              ${color}22 315deg, 
              transparent 360deg
            )
          `,
          backgroundSize: `${squareSize}px ${squareSize}px`,
          animation: `squaresRotate ${40 / speed}s linear infinite`,
          opacity: intensity
        }}
      />
      <style jsx>{`
        @keyframes squaresRotate {
          0% { transform: rotate(0deg); background-position: 0% 0%; }
          100% { transform: rotate(360deg); background-position: 100% 100%; }
        }
      `}</style>
    </div>
  );
};

// IRIDESCENCE BACKGROUND
export const SimpleIridescence: React.FC<BackgroundComponentProps> = ({ settings, className = "" }) => {
  const speed = settings.speed ?? 1;
  const intensity = settings.intensity ?? 1;
  const color = typeof settings.color === 'string' ? settings.color : settings.color[0];
  const iridescenceColor = settings.iridescenceColor ?? [0.3, 0.2, 0.5];

  return (
    <div 
      className={`w-full h-full relative overflow-hidden ${className}`}
      style={{ backgroundColor: color }}
    >
      <div 
        className="absolute inset-0"
        style={{
          background: `
            radial-gradient(circle at 30% 20%, 
              rgba(${Math.round(iridescenceColor[0] * 255)}, ${Math.round(iridescenceColor[1] * 255)}, ${Math.round(iridescenceColor[2] * 255)}, ${intensity * 0.4}) 0%, 
              transparent 50%
            ),
            radial-gradient(circle at 70% 80%, 
              rgba(${Math.round(iridescenceColor[2] * 255)}, ${Math.round(iridescenceColor[0] * 255)}, ${Math.round(iridescenceColor[1] * 255)}, ${intensity * 0.3}) 0%, 
              transparent 50%
            ),
            linear-gradient(45deg, 
              rgba(${Math.round(iridescenceColor[1] * 255)}, ${Math.round(iridescenceColor[2] * 255)}, ${Math.round(iridescenceColor[0] * 255)}, ${intensity * 0.2}) 0%, 
              transparent 100%
            )
          `,
          animation: `iridescenceShift ${35 / speed}s ease-in-out infinite`
        }}
      />
      <style jsx>{`
        @keyframes iridescenceShift {
          0%, 100% { 
            background-position: 0% 0%, 100% 100%, 0% 100%; 
            filter: hue-rotate(0deg);
          }
          25% { 
            background-position: 25% 25%, 75% 75%, 25% 75%; 
            filter: hue-rotate(90deg);
          }
          50% { 
            background-position: 50% 50%, 50% 50%, 50% 50%; 
            filter: hue-rotate(180deg);
          }
          75% { 
            background-position: 75% 25%, 25% 75%, 75% 25%; 
            filter: hue-rotate(270deg);
          }
        }
      `}</style>
    </div>
  );
};
