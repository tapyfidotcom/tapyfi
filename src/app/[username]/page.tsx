import React from "react";
import { notFound } from "next/navigation";
import { getPublicLinktreeProfile, incrementProfileView } from "@/actions/linktree";
import PublicLinktreeClient from "@/components/PublicLinktreeClient";
import { BackgroundSettings, getPrimaryColor, ensureIridescenceColor } from "@/types/profile";

interface PublicPageProps {
  params: Promise<{
    username: string;
  }>;
}

export default async function PublicLinktreePage({ params }: PublicPageProps) {
  const { username } = await params;
  const response = await getPublicLinktreeProfile(username);

  if (!response.success || !response.data) {
    notFound();
  }

  const profile = response.data;
  const links = profile.linktree_links || [];

  // Parse background settings
  let backgroundSettings: BackgroundSettings = {
    type: "solid",
    color: "#ffffff",
    speed: 1,
    intensity: 1,
    mouseInteraction: false,
  };

  if (profile.background_settings) {
    try {
      const parsedSettings = JSON.parse(profile.background_settings);
      backgroundSettings = {
        type: parsedSettings.type || "solid",
        color: parsedSettings.color || profile.background_color || "#ffffff",
        speed: parsedSettings.speed || 1,
        intensity: parsedSettings.intensity || 1,
        preset: parsedSettings.preset,
        distortion: parsedSettings.distortion,
        roadWidth: parsedSettings.roadWidth,
        islandWidth: parsedSettings.islandWidth,
        lanesPerRoad: parsedSettings.lanesPerRoad,
        fov: parsedSettings.fov,
        fovSpeedUp: parsedSettings.fovSpeedUp,
        speedUp: parsedSettings.speedUp,
        carLightsFade: parsedSettings.carLightsFade,
        totalSideLightSticks: parsedSettings.totalSideLightSticks,
        lightPairsPerRoadWay: parsedSettings.lightPairsPerRoadWay,
        scale: parsedSettings.scale,
        noiseIntensity: parsedSettings.noiseIntensity,
        rotation: parsedSettings.rotation,
        direction: parsedSettings.direction,
        borderColor: parsedSettings.borderColor,
        squareSize: parsedSettings.squareSize,
        hoverFillColor: parsedSettings.hoverFillColor,
        iridescenceColor: ensureIridescenceColor(parsedSettings.iridescenceColor),
        amplitude: parsedSettings.amplitude,
        mouseReact: parsedSettings.mouseReact,
        brightness: parsedSettings.brightness,
        saturation: parsedSettings.saturation,
        reflection: parsedSettings.reflection,
        gradientDirection: parsedSettings.gradientDirection,
        gradientType: parsedSettings.gradientType,
        mouseInteraction: parsedSettings.mouseInteraction || false,
      };
    } catch (error) {
      console.error("Error parsing background settings:", error);
    }
  }

  // Enhanced contrast calculation for text readability
  const getContrastColor = (bgColor: string | string[], textColor: string): string => {
    const primaryColor = getPrimaryColor(bgColor);
    
    // For solid backgrounds, calculate contrast
    if (backgroundSettings.type === "solid") {
      const hex = primaryColor.replace("#", "");
      const r = parseInt(hex.substr(0, 2), 16);
      const g = parseInt(hex.substr(2, 2), 16);
      const b = parseInt(hex.substr(4, 2), 16);
      const brightness = (r * 299 + g * 587 + b * 114) / 1000;

      if (brightness > 128) {
        return textColor === "#000000" ? "#1a1a1a" : textColor;
      }
    }
    
    // For animated backgrounds, always use white for better visibility
    return "#ffffff";
  };

  const contrastTextColor = getContrastColor(
    backgroundSettings.color,
    profile.text_color || "#ffffff"
  );

  // Increment profile view
  await incrementProfileView(username);

  return (
    <PublicLinktreeClient
      profile={profile}
      backgroundSettings={backgroundSettings}
      links={links}
      contrastTextColor={contrastTextColor}
    />
  );
}

export async function generateMetadata({ params }: PublicPageProps) {
  const { username } = await params;
  
  try {
    const response = await getPublicLinktreeProfile(username);

    if (!response.success || !response.data) {
      return {
        title: "Profile Not Found - TapyFi",
        description: "The requested profile could not be found.",
      };
    }

    const profile = response.data;

    return {
      title: `${profile.display_name || profile.username} - TapyFi`,
      description: profile.bio || `Check out ${profile.display_name || profile.username}'s links on TapyFi`,
      openGraph: {
        title: `${profile.display_name || profile.username} - TapyFi`,
        description: profile.bio || `Check out ${profile.display_name || profile.username}'s links on TapyFi`,
        images: profile.profile_picture ? [
          {
            url: profile.profile_picture,
            width: 1200,
            height: 630,
            alt: `${profile.display_name || profile.username}'s profile picture`,
          }
        ] : [],
        type: 'website',
      },
      twitter: {
        card: 'summary_large_image',
        title: `${profile.display_name || profile.username} - TapyFi`,
        description: profile.bio || `Check out ${profile.display_name || profile.username}'s links on TapyFi`,
        images: profile.profile_picture ? [profile.profile_picture] : [],
      },
    };
  } catch (error) {
    console.error('Error generating metadata:', error);
    return {
      title: "Profile Not Found - TapyFi",
      description: "The requested profile could not be found.",
    };
  }
}
