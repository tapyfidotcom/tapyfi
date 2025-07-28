export interface PlatformConfig {
  name: string;
  category: string;
  icon: string;
  placeholder: string;
  inputType: 'text' | 'phone' | 'email' | 'url';
  prefix?: string;
  urlGenerator: (input: string) => string;
  validation?: (input: string) => boolean;
}

export const platformConfigs: Record<string, PlatformConfig> = {
  // Contact & Communication
  whatsapp: {
    name: 'WhatsApp',
    category: 'Contact & Communication',
    icon: '📱',
    placeholder: '+1234567890',
    inputType: 'phone',
    urlGenerator: (phone: string) => `https://wa.me/${phone.replace(/[^0-9]/g, '')}`,
    validation: (phone: string) => /^\+?[1-9]\d{1,14}$/.test(phone.replace(/[^0-9+]/g, ''))
  },
  whatsapp_business: {
    name: 'WhatsApp Business',
    category: 'Contact & Communication',
    icon: '💼',
    placeholder: '+1234567890',
    inputType: 'phone',
    urlGenerator: (phone: string) => `https://wa.me/${phone.replace(/[^0-9]/g, '')}`,
    validation: (phone: string) => /^\+?[1-9]\d{1,14}$/.test(phone.replace(/[^0-9+]/g, ''))
  },
  email: {
    name: 'Email',
    category: 'Contact & Communication',
    icon: '📧',
    placeholder: 'your.email@example.com',
    inputType: 'email',
    urlGenerator: (email: string) => `mailto:${email}`,
    validation: (email: string) => /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email)
  },
  phone: {
    name: 'Phone Call',
    category: 'Contact & Communication',
    icon: '📞',
    placeholder: '+1234567890',
    inputType: 'phone',
    urlGenerator: (phone: string) => `tel:${phone.replace(/[^0-9+]/g, '')}`,
    validation: (phone: string) => /^\+?[1-9]\d{1,14}$/.test(phone.replace(/[^0-9+]/g, ''))
  },
  facetime: {
    name: 'FaceTime',
    category: 'Contact & Communication',
    icon: '📹',
    placeholder: 'your.email@example.com or +1234567890',
    inputType: 'text',
    urlGenerator: (contact: string) => `facetime:${contact}`,
    validation: (contact: string) => /^([^\s@]+@[^\s@]+\.[^\s@]+|\+?[1-9]\d{1,14})$/.test(contact)
  },
  skype: {
    name: 'Skype',
    category: 'Contact & Communication',
    icon: '💬',
    placeholder: 'skype_username',
    inputType: 'text',
    urlGenerator: (username: string) => `skype:${username}?chat`
  },
  telegram: {
    name: 'Telegram',
    category: 'Contact & Communication',
    icon: '✈️',
    placeholder: 'username',
    inputType: 'text',
    urlGenerator: (username: string) => `https://t.me/${username.replace('@', '')}`
  },

  // Social Media
  instagram: {
    name: 'Instagram',
    category: 'Social Media',
    icon: '📸',
    placeholder: 'username',
    inputType: 'text',
    urlGenerator: (username: string) => `https://instagram.com/${username.replace('@', '')}`
  },
  tiktok: {
    name: 'TikTok',
    category: 'Social Media',
    icon: '🎵',
    placeholder: 'username',
    inputType: 'text',
    urlGenerator: (username: string) => `https://tiktok.com/@${username.replace('@', '')}`
  },
  twitter: {
    name: 'Twitter/X',
    category: 'Social Media',
    icon: '🐦',
    placeholder: 'username',
    inputType: 'text',
    urlGenerator: (username: string) => `https://twitter.com/${username.replace('@', '')}`
  },
  facebook: {
    name: 'Facebook',
    category: 'Social Media',
    icon: '👥',
    placeholder: 'username or page',
    inputType: 'text',
    urlGenerator: (username: string) => `https://facebook.com/${username}`
  },
  linkedin: {
    name: 'LinkedIn',
    category: 'Social Media',
    icon: '💼',
    placeholder: 'username',
    inputType: 'text',
    urlGenerator: (username: string) => `https://linkedin.com/in/${username}`
  },
  youtube: {
    name: 'YouTube',
    category: 'Social Media',
    icon: '📺',
    placeholder: 'channel_name or @handle',
    inputType: 'text',
    urlGenerator: (channel: string) => channel.startsWith('@') 
      ? `https://youtube.com/${channel}` 
      : `https://youtube.com/c/${channel}`
  },
  snapchat: {
    name: 'Snapchat',
    category: 'Social Media',
    icon: '👻',
    placeholder: 'username',
    inputType: 'text',
    urlGenerator: (username: string) => `https://snapchat.com/add/${username}`
  },
  pinterest: {
    name: 'Pinterest',
    category: 'Social Media',
    icon: '📌',
    placeholder: 'username',
    inputType: 'text',
    urlGenerator: (username: string) => `https://pinterest.com/${username}`
  },
  twitch: {
    name: 'Twitch',
    category: 'Social Media',
    icon: '🎮',
    placeholder: 'username',
    inputType: 'text',
    urlGenerator: (username: string) => `https://twitch.tv/${username}`
  },

  // Business Integration
  website: {
    name: 'Website',
    category: 'Business Integration',
    icon: '🌐',
    placeholder: 'https://yourwebsite.com',
    inputType: 'url',
    urlGenerator: (url: string) => url.startsWith('http') ? url : `https://${url}`,
    validation: (url: string) => /^(https?:\/\/)?([\da-z\.-]+)\.([a-z\.]{2,6})([\/\w \.-]*)*\/?$/.test(url)
  },
  calendly: {
    name: 'Calendly',
    category: 'Business Integration',
    icon: '📅',
    placeholder: 'your_calendly_username',
    inputType: 'text',
    urlGenerator: (username: string) => `https://calendly.com/${username}`
  },
  location: {
    name: 'Location',
    category: 'Business Integration',
    icon: '📍',
    placeholder: 'Google Maps URL or address',
    inputType: 'text',
    urlGenerator: (location: string) => location.startsWith('http') 
      ? location 
      : `https://maps.google.com/?q=${encodeURIComponent(location)}`
  },

  // Reviews
  google_reviews: {
    name: 'Google Reviews',
    category: 'Reviews',
    icon: '⭐',
    placeholder: 'Place ID or review URL',
    inputType: 'text',
    urlGenerator: (id: string) => id.startsWith('http') 
      ? id 
      : `https://search.google.com/local/writereview?placeid=${id}`
  },
  trustpilot: {
    name: 'Trustpilot',
    category: 'Reviews',
    icon: '🌟',
    placeholder: 'company-name',
    inputType: 'text',
    urlGenerator: (company: string) => `https://trustpilot.com/review/${company}`
  },
  tripadvisor: {
    name: 'TripAdvisor',
    category: 'Reviews',
    icon: '🧳',
    placeholder: 'business_id',
    inputType: 'text',
    urlGenerator: (id: string) => `https://tripadvisor.com/Restaurant_Review-${id}`
  },

  // Food Delivery
  zomato: {
    name: 'Zomato',
    category: 'Food Delivery',
    icon: '🍽️',
    placeholder: 'restaurant_id',
    inputType: 'text',
    urlGenerator: (id: string) => `https://zomato.com/restaurant/${id}`
  },
  swiggy: {
    name: 'Swiggy',
    category: 'Food Delivery',
    icon: '🚀',
    placeholder: 'restaurant_id',
    inputType: 'text',
    urlGenerator: (id: string) => `https://swiggy.com/restaurants/${id}`
  },
  uber_eats: {
    name: 'Uber Eats',
    category: 'Food Delivery',
    icon: '🚗',
    placeholder: 'store_id',
    inputType: 'text',
    urlGenerator: (id: string) => `https://ubereats.com/store/${id}`
  },

  // Shopping
  amazon: {
    name: 'Amazon Store',
    category: 'Shopping',
    icon: '📦',
    placeholder: 'storefront_id',
    inputType: 'text',
    urlGenerator: (id: string) => `https://amazon.com/stores/${id}`
  },
  flipkart: {
    name: 'Flipkart Store',
    category: 'Shopping',
    icon: '🛒',
    placeholder: 'store_name',
    inputType: 'text',
    urlGenerator: (store: string) => `https://flipkart.com/seller/${store}`
  },

  // Payments
  paypal: {
    name: 'PayPal',
    category: 'Payments',
    icon: '💳',
    placeholder: 'paypal.me/username',
    inputType: 'text',
    urlGenerator: (username: string) => username.startsWith('http') 
      ? username 
      : `https://paypal.me/${username}`
  },
  stripe: {
    name: 'Stripe Payment',
    category: 'Payments',
    icon: '💰',
    placeholder: 'Payment link URL',
    inputType: 'url',
    urlGenerator: (url: string) => url
  },

  // Professional
  behance: {
    name: 'Behance',
    category: 'Professional',
    icon: '🎨',
    placeholder: 'username',
    inputType: 'text',
    urlGenerator: (username: string) => `https://behance.net/${username}`
  },
  medium: {
    name: 'Medium',
    category: 'Professional',
    icon: '✍️',
    placeholder: '@username',
    inputType: 'text',
    urlGenerator: (username: string) => `https://medium.com/${username.startsWith('@') ? username : '@' + username}`
  },

  // Music
  spotify: {
    name: 'Spotify',
    category: 'Music',
    icon: '🎶',
    placeholder: 'artist/user URL',
    inputType: 'text',
    urlGenerator: (url: string) => url.startsWith('http') 
      ? url 
      : `https://open.spotify.com/user/${url}`
  },

  // Custom
  custom: {
    name: 'Custom Link',
    category: 'Custom',
    icon: '🔗',
    placeholder: 'https://yourlink.com',
    inputType: 'url',
    urlGenerator: (url: string) => url.startsWith('http') ? url : `https://${url}`
  }
};

export const platformCategories = Array.from(
  new Set(Object.values(platformConfigs).map(p => p.category))
).sort();
