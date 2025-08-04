"use client";

import React, { useState } from "react";
import { platformConfigs, platformCategories } from "@/lib/platform-configs";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Search, X } from "lucide-react";
import Image from "next/image";

interface PlatformSelectorProps {
  onSelect: (platform: string) => void;
  onClose: () => void;
}

export default function PlatformSelector({ onSelect, onClose }: PlatformSelectorProps) {
  const [searchQuery, setSearchQuery] = useState("");
  const [selectedCategory, setSelectedCategory] = useState<string | null>(null);

  const filteredPlatforms = Object.entries(platformConfigs).filter(([key, config]) => {
    const matchesSearch = config.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
                         config.category.toLowerCase().includes(searchQuery.toLowerCase());
    const matchesCategory = !selectedCategory || config.category === selectedCategory;
    return matchesSearch && matchesCategory;
  });

  const groupedPlatforms = platformCategories.reduce((acc, category) => {
    acc[category] = filteredPlatforms.filter(([, config]) => config.category === category);
    return acc;
  }, {} as Record<string, Array<[string, any]>>);

  // Function to render icon (image or emoji)
  const renderIcon = (icon: string) => {
    if (typeof icon === 'string' && icon.startsWith('/assets/')) {
      return (
        <Image
          src={icon}
          alt="Platform icon"
          width={32}
          height={32}
          className="object-contain"
        />
      );
    }
    return <span className="text-2xl">{icon}</span>;
  };

  return (
    <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4">
      <div className="bg-card rounded-xl shadow-xl w-full max-w-4xl max-h-[90vh] overflow-hidden">
        {/* Header */}
        <div className="flex items-center justify-between p-6 border-b border-border">
          <h2 className="text-xl font-semibold">Add Platform Link</h2>
          <Button variant="ghost" size="sm" onClick={onClose}>
            <X size={20} />
          </Button>
        </div>

        {/* Search and Categories */}
        <div className="p-6 space-y-4">
          <div className="relative">
            <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-muted-foreground" size={16} />
            <Input
              placeholder="Search platforms..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="pl-10"
            />
          </div>

          <div className="flex flex-wrap gap-2">
            <Button
              variant={selectedCategory === null ? "default" : "outline"}
              size="sm"
              onClick={() => setSelectedCategory(null)}
            >
              All Categories
            </Button>
            {platformCategories.map((category) => (
              <Button
                key={category}
                variant={selectedCategory === category ? "default" : "outline"}
                size="sm"
                onClick={() => setSelectedCategory(category)}
              >
                {category}
              </Button>
            ))}
          </div>
        </div>

        {/* Platforms Grid */}
        <div className="overflow-y-auto max-h-96 px-6 pb-6">
          {Object.entries(groupedPlatforms).map(([category, platforms]) => {
            if (platforms.length === 0) return null;
            
            return (
              <div key={category} className="mb-6">
                <h3 className="text-sm font-semibold text-muted-foreground mb-3">{category}</h3>
                <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 gap-3">
                  {platforms.map(([key, config]) => (
                    <Button
                      key={key}
                      variant="outline"
                      className="h-auto p-4 flex flex-col items-center gap-2 hover:bg-accent"
                      onClick={() => onSelect(key)}
                    >
                      {renderIcon(config.icon)}
                      <span className="text-sm font-medium text-center">{config.name}</span>
                    </Button>
                  ))}
                </div>
              </div>
            );
          })}
        </div>
      </div>
    </div>
  );
}
