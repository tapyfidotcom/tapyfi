export interface LinktreeProfile {
  id: number;
  created_at: string;
  updated_at: string;
  user_id: number;
  username: string;
  display_name?: string;
  bio?: string;
  profile_picture?: string;
  company_logo?: string;
  theme_color: string;
  background_color: string;
  text_color: string;
  is_active: boolean;
  view_count: number;
  background_settings?: string; // JSON stringified BackgroundSettings
  linktree_links?: LinktreeLink[];
}

export interface LinktreeLink {
  id: number;
  created_at: string;
  updated_at: string;
  profile_id: number;
  platform: string;
  title: string;
  url: string;
  icon?: string;
  display_order: number;
  is_active: boolean;
  click_count: number;
}

export interface LinktreeAnalytics {
  id: number;
  created_at: string;
  profile_id?: number;
  link_id?: number;
  event_type: 'view' | 'click';
  ip_address?: string;
  user_agent?: string;
  referrer?: string;
  country?: string;
  city?: string;
}

export interface CreateLinktreeProfile {
  username: string;
  display_name?: string;
  bio?: string;
  profile_picture?: string;
  company_logo?: string;
  theme_color?: string;
  background_color?: string;
  text_color?: string;
}

export interface CreateLinktreeLink {
  platform: string;
  title: string;
  url: string;
  icon?: string;
  display_order?: number;
}

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
