"use client";

import React, { createContext, useContext, useEffect, useState } from 'react';

type Theme = 'light' | 'dark' | 'system';

type ThemeProviderProps = {
  children: React.ReactNode;
  defaultTheme?: Theme;
  storageKey?: string;
};

type ThemeProviderState = {
  theme: Theme;
  setTheme: (theme: Theme) => void;
  isDark: boolean;
  toggleTheme: () => void;
  mounted: boolean;
};

const initialState: ThemeProviderState = {
  theme: 'system',
  setTheme: () => null,
  isDark: false,
  toggleTheme: () => null,
  mounted: false,
};

const ThemeProviderContext = createContext<ThemeProviderState>(initialState);

export function ThemeProvider({
  children,
  defaultTheme = 'system',
  storageKey = 'theme',
  ...props
}: ThemeProviderProps) {
  const [theme, setTheme] = useState<Theme>(defaultTheme);
  const [isDark, setIsDark] = useState(false);
  const [mounted, setMounted] = useState(false);

  const applyTheme = (newTheme: Theme) => {
    const root = document.documentElement;
    
    let shouldBeDark = false;
    if (newTheme === 'system') {
      shouldBeDark = window.matchMedia('(prefers-color-scheme: dark)').matches;
    } else {
      shouldBeDark = newTheme === 'dark';
    }
    
    // Update DOM
    if (shouldBeDark) {
      root.classList.add('dark');
      root.classList.remove('light');
    } else {
      root.classList.remove('dark');
      root.classList.add('light');
    }
    
    // Update state
    setIsDark(shouldBeDark);
    
    console.log('Applied theme:', newTheme, 'isDark:', shouldBeDark);
  };

  useEffect(() => {
    setMounted(true);
    
    // Get theme from localStorage
    const savedTheme = (localStorage.getItem(storageKey) as Theme) || defaultTheme;
    console.log('Initial theme from localStorage:', savedTheme);
    
    setTheme(savedTheme);
    applyTheme(savedTheme);

    // Listen for system theme changes
    const mediaQuery = window.matchMedia('(prefers-color-scheme: dark)');
    const handleChange = () => {
      const currentTheme = localStorage.getItem(storageKey) as Theme;
      if (currentTheme === 'system') {
        applyTheme('system');
      }
    };

    mediaQuery.addEventListener('change', handleChange);
    return () => mediaQuery.removeEventListener('change', handleChange);
  }, [defaultTheme, storageKey]);

  const changeTheme = (newTheme: Theme) => {
    console.log('Changing theme from', theme, 'to', newTheme);
    
    setTheme(newTheme);
    localStorage.setItem(storageKey, newTheme);
    applyTheme(newTheme);
  };

  const toggleTheme = () => {
    console.log('Toggle theme called, current:', theme, 'isDark:', isDark);
    
    // Always toggle between light and dark (not system)
    const newTheme = isDark ? 'light' : 'dark';
    console.log('Toggling to:', newTheme);
    
    changeTheme(newTheme);
  };

  const value = {
    theme,
    setTheme: changeTheme,
    isDark,
    toggleTheme,
    mounted,
  };

  return (
    <ThemeProviderContext.Provider {...props} value={value}>
      {children}
    </ThemeProviderContext.Provider>
  );
}

export const useTheme = () => {
  const context = useContext(ThemeProviderContext);

  if (context === undefined) {
    throw new Error('useTheme must be used within a ThemeProvider');
  }

  return context;
};
