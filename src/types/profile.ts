export interface BackgroundSettings {
  type: 'solid' | 'hyperspeed' | 'silk' | 'squares' | 'iridescence';
  color: string | string[]; // Support both single color and gradient arrays
  speed?: number;
  intensity?: number;
  
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
  
  // Silk specific props
  scale?: number;
  noiseIntensity?: number;
  rotation?: number;
  
  // Squares specific props
  direction?: 'diagonal' | 'up' | 'right' | 'down' | 'left';
  borderColor?: string;
  squareSize?: number;
  hoverFillColor?: string;
  
  // Iridescence specific props - FIXED TO USE TUPLE
  iridescenceColor?: [number, number, number]; // Exactly 3 RGB values between 0-1
  amplitude?: number;
  mouseReact?: boolean;
  brightness?: number;
  saturation?: number;
  reflection?: number;
  
  // Solid background gradient props
  gradientDirection?: number; // Angle in degrees
  gradientType?: 'linear' | 'radial';
  
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
  background_color: string; // Keep as string only
  text_color: string;
  background_settings?: string; // Store complex background data here as JSON
}

// Helper function to safely convert background color
export const getPrimaryBackgroundColor = (color: string | string[]): string => {
  return Array.isArray(color) ? color[0] : color;
};

// Helper function to get default background settings
export const getDefaultBackgroundSettings = (type: BackgroundSettings['type']): BackgroundSettings => {
  const baseSettings = {
    type,
    speed: 1,
    intensity: 1,
    mouseInteraction: false,
  };

  switch (type) {
    case 'hyperspeed':
      return {
        ...baseSettings,
        color: '#000000',
        preset: 'one',
        distortion: 'turbulentDistortion',
        roadWidth: 10,
        islandWidth: 2,
        lanesPerRoad: 3,
        fov: 90,
        fovSpeedUp: 150,
        speedUp: 2,
        carLightsFade: 0.4,
        totalSideLightSticks: 20,
        lightPairsPerRoadWay: 40,
      };
    
    case 'silk':
      return {
        ...baseSettings,
        color: '#ffffff',
        scale: 1,
        noiseIntensity: 1.5,
        rotation: 0,
      };
    
    case 'squares':
      return {
        ...baseSettings,
        color: '#000000',
        direction: 'right',
        borderColor: '#999',
        squareSize: 40,
        hoverFillColor: '#222',
      };
    
    case 'iridescence':
      return {
        ...baseSettings,
        color: '#000000',
        iridescenceColor: [0.3, 0.2, 0.5], // FIXED: Now a tuple
        amplitude: 0.1,
        mouseReact: false,
        brightness: 1,
        saturation: 1,
        reflection: 1,
      };
    
    default: // 'solid'
      return {
        ...baseSettings,
        color: '#6366f1',
        gradientDirection: 135,
        gradientType: 'linear',
      };
  }
};

// Helper function to get primary color from color prop
export const getPrimaryColor = (color: string | string[]): string => {
  return Array.isArray(color) ? color[0] : color;
};

// Helper function to ensure iridescence color is a valid tuple
export const ensureIridescenceColor = (color?: number[] | [number, number, number]): [number, number, number] => {
  if (!color || !Array.isArray(color)) {
    return [0.3, 0.2, 0.5];
  }
  
  // Ensure exactly 3 elements
  const [r = 0.3, g = 0.2, b = 0.5] = color;
  
  // Clamp values between 0 and 1
  const clamp = (val: number) => Math.max(0, Math.min(1, val));
  
  return [clamp(r), clamp(g), clamp(b)];
};
