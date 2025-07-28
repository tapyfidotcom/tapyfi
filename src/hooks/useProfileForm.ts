import { useState, useEffect } from 'react';
import { LinktreeProfile } from '@/interfaces/linktree';
import { BackgroundSettings, ProfileFormData } from '@/types/profile';

export function useProfileForm(profile: LinktreeProfile | null) {
  const [profileForm, setProfileForm] = useState<ProfileFormData>({
    username: '',
    display_name: '',
    bio: '',
    profile_picture: '',
    company_logo: '',
    theme_color: '#10b981',
    background_color: '#ffffff',
    text_color: '#1f2937'
  });

  const [backgroundSettings, setBackgroundSettings] = useState<BackgroundSettings>({
    type: 'solid',
    color: '#ffffff',
    speed: 1,
    intensity: 1,
    mouseInteraction: false
  });

  useEffect(() => {
    if (profile) {
      setProfileForm({
        username: profile.username || '',
        display_name: profile.display_name || '',
        bio: profile.bio || '',
        profile_picture: profile.profile_picture || '',
        company_logo: profile.company_logo || '',
        theme_color: profile.theme_color || '#10b981',
        background_color: profile.background_color || '#ffffff',
        text_color: profile.text_color || '#1f2937'
      });

      // Parse background settings
      if (profile.background_settings) {
        try {
          const parsedSettings = JSON.parse(profile.background_settings);
          setBackgroundSettings({
            type: parsedSettings.type || 'solid',
            color: parsedSettings.color || profile.background_color || '#ffffff',
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
            
            mouseInteraction: parsedSettings.mouseInteraction || false
          });
        } catch (error) {
          console.error('Error parsing background settings:', error);
          // Fallback to default settings
          setBackgroundSettings({
            type: 'solid',
            color: profile.background_color || '#ffffff',
            speed: 1,
            intensity: 1,
            mouseInteraction: false
          });
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
}
