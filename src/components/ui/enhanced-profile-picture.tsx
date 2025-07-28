"use client";

import React from "react";
import { User } from "lucide-react";

interface EnhancedProfilePictureProps {
  profilePicture?: string;
  companyLogo?: string;
  size?: 'sm' | 'md' | 'lg' | 'xl';
  className?: string;
}

export default function EnhancedProfilePicture({
  profilePicture,
  companyLogo,
  size = 'lg',
  className = ""
}: EnhancedProfilePictureProps) {
  const sizeClasses = {
    sm: 'w-16 h-16',
    md: 'w-24 h-24',
    lg: 'w-32 h-32',
    xl: 'w-40 h-40'
  };

  const logoSizeClasses = {
    sm: 'w-6 h-6',
    md: 'w-8 h-8',
    lg: 'w-12 h-12',
    xl: 'w-16 h-16'
  };

  return (
    <div className={`relative ${sizeClasses[size]} ${className}`}>
      {/* Main Profile Picture Circle */}
      <div className="w-full h-full rounded-full overflow-hidden border-4 border-white shadow-lg bg-gradient-to-br from-primary/20 to-primary/5">
        {profilePicture ? (
          <img 
            src={profilePicture} 
            alt="Profile"
            className="w-full h-full object-cover"
          />
        ) : (
          <div className="w-full h-full flex items-center justify-center bg-muted">
            <User size={size === 'xl' ? 48 : size === 'lg' ? 32 : size === 'md' ? 24 : 16} className="text-muted-foreground" />
          </div>
        )}
      </div>

      {/* Company Logo - Bottom Right Corner */}
      {companyLogo && (
        <div className={`absolute -bottom-1 -right-1 ${logoSizeClasses[size]} rounded-full overflow-hidden border-3 border-white shadow-md bg-white`}>
          <img 
            src={companyLogo} 
            alt="Company"
            className="w-full h-full object-cover"
          />
        </div>
      )}
    </div>
  );
}
