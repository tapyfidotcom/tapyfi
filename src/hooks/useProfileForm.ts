import { useState, useEffect, useCallback } from "react";
import { LinktreeProfile } from "@/interfaces/linktree";
import { BackgroundSettings, ProfileFormData, ensureIridescenceColor } from "@/types/profile";

// /**
//  * Custom hook to manage profile form state and background settings.
//  * @param profile - The initial profile data from backend.
//  * @returns profile form state and setters with proper background settings handling.
//  */
export function useProfileForm(profile: LinktreeProfile | null) {
  const [profileForm, setProfileForm] = useState<ProfileFormData>({
    username: "",
    display_name: "",
    bio: "",
    profile_picture: "",
    company_logo: "",
    theme_color: "#10b981",
    background_color: "#ffffff",
    text_color: "#1f2937",
  });

  const [backgroundSettings, setBackgroundSettings] = useState<BackgroundSettings>({
    type: "solid",
    color: "#ffffff", 
    speed: 1,
    intensity: 1,
    mouseInteraction: false,
  });

  // Enhanced background settings update function that syncs with form data
  const updateBackgroundSettings = useCallback((newSettings: Partial<BackgroundSettings>) => {
    const updatedSettings = {
      ...backgroundSettings,
      ...newSettings
    };
    
    setBackgroundSettings(updatedSettings);
    
    // Sync with profile form for saving
    setProfileForm(prev => ({
      ...prev,
      background_settings: JSON.stringify(updatedSettings)
    }));
  }, [backgroundSettings]);

  useEffect(() => {
    if (profile) {
      setProfileForm({
        username: profile.username || "",
        display_name: profile.display_name || "",
        bio: profile.bio || "",
        profile_picture: profile.profile_picture || "",
        company_logo: profile.company_logo || "",
        theme_color: profile.theme_color || "#10b981",
        background_color: profile.background_color || "#ffffff",
        text_color: profile.text_color || "#1f2937",
        background_settings: profile.background_settings || "",
      });

      // Parse background settings with comprehensive property support
      if (profile.background_settings) {
        try {
          const parsedSettings = JSON.parse(profile.background_settings);
          setBackgroundSettings({
            type: parsedSettings.type || "solid",
            color: parsedSettings.color || profile.background_color || "#ffffff",
            speed: parsedSettings.speed || 1,
            intensity: parsedSettings.intensity || 1,

            // Hyperspeed specific props
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

            // Silk specific props
            scale: parsedSettings.scale,
            noiseIntensity: parsedSettings.noiseIntensity,
            rotation: parsedSettings.rotation,

            // Squares specific props
            direction: parsedSettings.direction,
            borderColor: parsedSettings.borderColor,
            squareSize: parsedSettings.squareSize,
            hoverFillColor: parsedSettings.hoverFillColor,

            // Iridescence specific props - FIXED: Use proper tuple type
            iridescenceColor: ensureIridescenceColor(parsedSettings.iridescenceColor),
            amplitude: parsedSettings.amplitude,
            mouseReact: parsedSettings.mouseReact,
            brightness: parsedSettings.brightness,
            saturation: parsedSettings.saturation,
            reflection: parsedSettings.reflection,

            // Solid gradient props
            gradientDirection: parsedSettings.gradientDirection,
            gradientType: parsedSettings.gradientType,

            mouseInteraction: parsedSettings.mouseInteraction || false,
          });
        } catch (error) {
          console.error("Error parsing background settings:", error);
          // Fallback to default settings
          setBackgroundSettings({
            type: "solid",
            color: profile.background_color || "#ffffff",
            speed: 1,
            intensity: 1,
            mouseInteraction: false,
          });
        }
      }
    }
  }, [profile]);

  return {
    profileForm,
    setProfileForm,
    backgroundSettings,
    setBackgroundSettings,
    updateBackgroundSettings, // Enhanced function for better state management
  };
}
