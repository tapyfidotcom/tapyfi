"use client";

import { useState, useEffect } from "react";
import { LinktreeProfile } from "@/interfaces/linktree";
import { BackgroundSettings } from "@/interfaces/linktree";

export const useProfileForm = (profile: LinktreeProfile | null) => {
  const [profileForm, setProfileForm] = useState({
    username: '',
    display_name: '',
    bio: '',
    profile_picture: '',
    company_logo: '',
    theme_color: '#10b981',
    background_color: '#ffffff',
    text_color: '#000000'
  });

  const [backgroundSettings, setBackgroundSettings] = useState<BackgroundSettings>({
    type: 'solid',
    color: '#ffffff',
    speed: 1,
    intensity: 1
  });

  useEffect(() => {
    if (profile) {
      setProfileForm({
        username: profile.username,
        display_name: profile.display_name || '',
        bio: profile.bio || '',
        profile_picture: profile.profile_picture || '',
        company_logo: profile.company_logo || '',
        theme_color: profile.theme_color,
        background_color: profile.background_color,
        text_color: profile.text_color
      });

      // Parse background settings
      if (profile.background_settings) {
        try {
          const parsedSettings = JSON.parse(profile.background_settings);
          setBackgroundSettings({
            type: parsedSettings.type || 'solid',
            color: parsedSettings.color || profile.background_color,
            speed: parsedSettings.speed || 1,
            intensity: parsedSettings.intensity || 1,
            preset: parsedSettings.preset,
            scale: parsedSettings.scale,
            direction: parsedSettings.direction
          });
        } catch (error) {
          console.error('Error parsing background settings:', error);
        }
      }
    }
  }, [profile]);

  return {
    profileForm,
    setProfileForm,
    backgroundSettings,
    setBackgroundSettings
  };
};
