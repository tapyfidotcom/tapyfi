import { platformConfigs } from './platform-configs';

export interface GeneratedLink {
  url: string;
  isValid: boolean;
  error?: string;
}

export function generatePlatformLink(platform: string, input: string): GeneratedLink {
  const config = platformConfigs[platform];
  
  if (!config) {
    return {
      url: input,
      isValid: false,
      error: 'Platform not found'
    };
  }

  // Validate input if validation function exists
  if (config.validation && !config.validation(input)) {
    return {
      url: '',
      isValid: false,
      error: `Invalid ${config.name.toLowerCase()} format`
    };
  }

  try {
    const url = config.urlGenerator(input);
    return {
      url,
      isValid: true
    };
  } catch (error) {
    return {
      url: '',
      isValid: false,
      error: 'Failed to generate link'
    };
  }
}

export function validateUsername(username: string): { isValid: boolean; error?: string } {
  if (!username) {
    return { isValid: false, error: 'Username is required' };
  }
  
  if (username.length < 3) {
    return { isValid: false, error: 'Username must be at least 3 characters' };
  }
  
  if (username.length > 30) {
    return { isValid: false, error: 'Username must be less than 30 characters' };
  }
  
  if (!/^[a-zA-Z0-9_-]+$/.test(username)) {
    return { isValid: false, error: 'Username can only contain letters, numbers, hyphens, and underscores' };
  }
  
  // Reserved usernames
  const reserved = ['admin', 'api', 'www', 'app', 'support', 'help', 'about', 'contact'];
  if (reserved.includes(username.toLowerCase())) {
    return { isValid: false, error: 'This username is reserved' };
  }
  
  return { isValid: true };
}
