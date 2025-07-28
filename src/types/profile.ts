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

export interface BackgroundSettings {
  type: 'solid' | 'darkveil' | 'faultyterminal' | 'galaxy' | 'hyperspeed' | 'iridescence' | 'lightrays' | 'particles' | 'ripplegrid' | 'silk';
  color: string;
  speed: number;
  intensity: number;
  preset?: string;
  scale?: number;
  direction?: number;
}
