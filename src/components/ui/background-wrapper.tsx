"use client";

import React, { Suspense, useCallback, useMemo, useRef, useEffect, useState } from "react";
import { BackgroundSettings, getPrimaryColor, ensureIridescenceColor } from "@/types/profile";
import { Loader2 } from "lucide-react";
import dynamic from "next/dynamic";
import { hyperspeedPresets } from "@/components/backgrounds/Hyperspeed/HyperSpeedPresets";

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

// Error Boundary for Hyperspeed
class HyperspeedErrorBoundary extends React.Component<
  { children: React.ReactNode; fallback: React.ReactNode },
  { hasError: boolean }
> {
  constructor(props: { children: React.ReactNode; fallback: React.ReactNode }) {
    super(props);
    this.state = { hasError: false };
  }

  static getDerivedStateFromError(_: Error) {
    return { hasError: true };
  }

  componentDidCatch(error: Error, errorInfo: React.ErrorInfo) {
    console.error('Hyperspeed Error:', error, errorInfo);
  }

  render() {
    if (this.state.hasError) {
      return this.props.fallback;
    }
    return this.props.children;
  }
}

// CSS-based Hyperspeed Fallback (only used when Three.js fails)
const HyperspeedFallback = ({ color, preset }: { color: string; preset?: string }) => {
  const getPresetColors = () => {
    switch (preset) {
      case 'one': return { primary: '#03b3c3', secondary: '#d856bf' };
      case 'two': return { primary: '#dadafa', secondary: '#ff102a' };
      case 'three': return { primary: '#f1eece', secondary: '#7d0d1b' };
      case 'four': return { primary: '#a4e3e6', secondary: '#ff5f73' };
      case 'five': return { primary: '#c5e8eb', secondary: '#dc5b20' };
      case 'six': return { primary: '#fdfdf0', secondary: '#ff322f' };
      default: return { primary: '#03b3c3', secondary: '#d856bf' };
    }
  };

  const colors = getPresetColors();

  return (
    <div 
      className="w-full h-full relative overflow-hidden"
      style={{ backgroundColor: color }}
    >
      <div className="absolute inset-0 flex justify-center">
        <div className="w-1/3 h-full bg-gray-900 relative opacity-80">
          {[...Array(12)].map((_, i) => (
            <div
              key={i}
              className="absolute w-1 bg-white opacity-40"
              style={{
                height: '30px',
                left: '50%',
                transform: 'translateX(-50%)',
                top: `${i * 60}px`,
                animation: `roadLine 1.5s linear infinite`,
                animationDelay: `${i * 0.12}s`,
              }}
            />
          ))}
        </div>
      </div>

      {[...Array(6)].map((_, i) => (
        <React.Fragment key={i}>
          <div
            className="absolute w-3 h-16 rounded-full opacity-70"
            style={{
              backgroundColor: colors.primary,
              left: '35%',
              top: `${20 + i * 100}px`,
              animation: `carLight 2.5s ease-in-out infinite`,
              animationDelay: `${i * 0.4}s`,
              boxShadow: `0 0 15px ${colors.primary}`,
            }}
          />
          <div
            className="absolute w-3 h-16 rounded-full opacity-70"
            style={{
              backgroundColor: colors.secondary,
              left: '62%',
              top: `${50 + i * 100}px`,
              animation: `carLight 2.5s ease-in-out infinite reverse`,
              animationDelay: `${i * 0.3}s`,
              boxShadow: `0 0 15px ${colors.secondary}`,
            }}
          />
        </React.Fragment>
      ))}

      <style jsx>{`
        @keyframes roadLine {
          0% { transform: translateX(-50%) translateY(100vh); opacity: 0; }
          50% { opacity: 0.8; }
          100% { transform: translateX(-50%) translateY(-50px); opacity: 0; }
        }
        
        @keyframes carLight {
          0% { transform: translateY(100vh) scaleY(0.3); opacity: 0; }
          10% { opacity: 0.9; }
          90% { opacity: 0.9; }
          100% { transform: translateY(-80px) scaleY(2.5); opacity: 0; }
        }
      `}</style>
    </div>
  );
};

export default function BackgroundWrapper({ settings, className = "" }: BackgroundWrapperProps) {
  const containerRef = useRef<HTMLDivElement>(null);
  const [isClient, setIsClient] = useState(false);
  const [retryCount, setRetryCount] = useState(0);
  
  // Create a stable key that doesn't change constantly
  const stableKey = useMemo(() => {
    return `${settings.type}-${settings.preset || 'default'}-${JSON.stringify(settings.color)}`;
  }, [settings.type, settings.preset, settings.color]);

  useEffect(() => {
    setIsClient(true);
  }, []);

  // FIXED: Use proper hyperspeed options with correct typing
  const hyperspeedOptions = useMemo(() => {
    if (settings.type !== 'hyperspeed') return null;
    
    try {
      const baseColor = getPrimaryColor(settings.color);
      const presetKey = settings.preset || "one";
      
      console.log('Creating hyperspeed options for preset:', presetKey);
      
      const presetConfig = hyperspeedPresets[presetKey as keyof typeof hyperspeedPresets];
      
      if (!presetConfig) {
        console.warn('Preset not found:', presetKey, 'available:', Object.keys(hyperspeedPresets));
        return null;
      }
      
      // Create clean config with proper background color
      const cleanConfig = {
        ...presetConfig,
        colors: {
          ...presetConfig.colors,
          background: parseInt(baseColor.replace('#', ''), 16) || 0x000000,
        }
      };
      
      console.log('Hyperspeed options created successfully:', cleanConfig);
      return cleanConfig;
    } catch (error) {
      console.error('Error creating hyperspeed options:', error);
      return null;
    }
  }, [settings.preset, settings.color, settings.type]);

  const renderBackground = useCallback(() => {
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
            key={`solid-${stableKey}`}
            className="w-full h-full transition-all duration-500"
            style={{ background: backgroundStyle }}
          />
        );
      
      case 'hyperspeed':
        // ALWAYS try to render the real Three.js Hyperspeed first
        if (!isClient) {
          return (
            <div 
              key={`hyperspeed-loading-${stableKey}`}
              className="w-full h-full flex items-center justify-center bg-black"
            >
              <Loader2 className="h-6 w-6 animate-spin text-white" />
            </div>
          );
        }

        if (!hyperspeedOptions) {
          console.error('No hyperspeed options available, using fallback');
          return (
            <HyperspeedFallback 
              key={`hyperspeed-fallback-${stableKey}`}
              color={getPrimaryColor(settings.color)} 
              preset={settings.preset || 'one'}
            />
          );
        }

        // Render the REAL Three.js Hyperspeed component
        return (
          <HyperspeedErrorBoundary 
            key={`hyperspeed-boundary-${stableKey}`}
            fallback={
              <HyperspeedFallback 
                color={getPrimaryColor(settings.color)} 
                preset={settings.preset || 'one'}
              />
            }
          >
            <BackgroundLoader>
              <div className="w-full h-full relative">
                <div 
                  className="absolute inset-0 transition-colors duration-500"
                  style={{ backgroundColor: getPrimaryColor(settings.color) }}
                />
                <div className="absolute inset-0 overflow-hidden">
                  <Hyperspeed
                    key={`hyperspeed-three-${stableKey}-${retryCount}`}
                    effectOptions={hyperspeedOptions}
                  />
                </div>
              </div>
            </BackgroundLoader>
          </HyperspeedErrorBoundary>
        );
      
      case 'silk':
        return (
          <BackgroundLoader key={`silk-${stableKey}`}>
            <div className="w-full h-full relative">
              <div className="w-full h-full">
                <Silk
                  key={`silk-component-${stableKey}`}
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
          <BackgroundLoader key={`squares-${stableKey}`}>
            <div className="w-full h-full relative">
              <div 
                className="absolute inset-0"
                style={{ backgroundColor: getPrimaryColor(settings.color) }}
              />
              <div className="absolute inset-0">
                <Squares
                  key={`squares-component-${stableKey}`}
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
        const iridescenceColor = ensureIridescenceColor(settings.iridescenceColor);
        
        return (
          <BackgroundLoader key={`iridescence-${stableKey}`}>
            <div className="w-full h-full relative">
              <div className="w-full h-full">
                <Iridescence
                  key={`iridescence-component-${stableKey}`}
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
            key={`default-${stableKey}`}
            className="w-full h-full"
            style={{ backgroundColor: getPrimaryColor(settings.color) }}
          />
        );
    }
  }, [settings, stableKey, isClient, hyperspeedOptions, retryCount]);

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
