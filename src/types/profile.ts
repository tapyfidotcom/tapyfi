export interface BackgroundSettings {
  type: 'solid' | 'hyperspeed';
  color: string;
  speed: number;
  intensity: number;
  
  // Hyperspeed specific props
  preset?: 'one' | 'two' | 'three' | 'four' | 'five' | 'six';
  distortion?: string;
  roadWidth?: number;
  islandWidth?: number;
  lanesPerRoad?: number;
  fov?: number;
  fovSpeedUp?: number;
  speedUp?: number;
  carLightsFade?: number;
  totalSideLightSticks?: number;
  lightPairsPerRoadWay?: number;
  
  // Common properties
  mouseInteraction?: boolean;
}

export interface ProfileFormData {
  username: string;
  display_name: string;
  bio: string;
  profile_picture: string;
  company_logo: string;
  theme_color: string;
  background_color: string;
  text_color: string;
}
