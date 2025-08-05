"use client";

import React, { useState } from "react";
import { platformConfigs, platformCategories } from "@/lib/platform-configs";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Badge } from "@/components/ui/badge";
import { 
  Search, 
  X, 
  Sparkles, 
  Filter, 
  Star,
  ArrowLeft
} from "lucide-react";
import Image from "next/image";

interface MobilePlatformSelectorProps {
  onSelect: (platform: string) => void;
  onClose: () => void;
}

export default function MobilePlatformSelector({ onSelect, onClose }: MobilePlatformSelectorProps) {
  const [searchQuery, setSearchQuery] = useState("");
  const [selectedCategory, setSelectedCategory] = useState<string>("all");

  const filteredPlatforms = Object.entries(platformConfigs).filter(([key, config]) => {
    const matchesSearch = config.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
                         config.category.toLowerCase().includes(searchQuery.toLowerCase());
    const matchesCategory = selectedCategory === "all" || config.category === selectedCategory;
    return matchesSearch && matchesCategory;
  });

  const groupedPlatforms = platformCategories.reduce((acc, category) => {
    acc[category] = filteredPlatforms.filter(([, config]) => config.category === category);
    return acc;
  }, {} as Record<string, Array<[string, any]>>);

  const popularPlatforms = ["instagram", "twitter", "youtube", "linkedin", "tiktok", "facebook"];
  const popularFiltered = filteredPlatforms.filter(([key]) => popularPlatforms.includes(key));

  const renderIcon = (icon: string, size: number = 24) => {
    if (typeof icon === 'string' && icon.startsWith('/assets/')) {
      return (
        <Image
          src={icon}
          alt="Platform icon"
          width={size}
          height={size}
          className="object-contain"
        />
      );
    }
    return <span className="text-lg">{icon}</span>;
  };

  return (
    <div className="h-full flex flex-col">
      {/* Mobile Header */}
      <div className="flex items-center gap-3 pb-4 border-b border-gray-200/50 dark:border-gray-700/50">
        <Button
          variant="ghost"
          size="sm"
          onClick={onClose}
          className="h-8 w-8 p-0 rounded-lg"
        >
          <ArrowLeft size={16} />
        </Button>
        <div className="flex items-center gap-2">
          <Sparkles size={18} className="text-primary" />
          <h2 className="text-lg font-semibold">Add Platform Link</h2>
        </div>
      </div>

      {/* Inline Search, Filter, and Results Badge */}
      <div className="py-3">
        <div className="flex flex-wrap items-center gap-2">
          {/* Search Input - Takes most of the width */}
          <div className="flex-grow min-w-0">
            <div className="relative">
              <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-muted-foreground" size={16} />
              <Input
                placeholder="Search platforms..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="pl-10 h-10 text-sm rounded-lg"
              />
              {searchQuery && (
                <Button
                  variant="ghost"
                  size="sm"
                  onClick={() => setSearchQuery("")}
                  className="absolute right-2 top-1/2 transform -translate-y-1/2 h-6 w-6 p-0"
                >
                  <X size={14} />
                </Button>
              )}
            </div>
          </div>

          {/* Category Filter - Auto width */}
          <div className="w-auto">
            <Select value={selectedCategory} onValueChange={setSelectedCategory}>
              <SelectTrigger className="h-10 w-28">
                <Filter size={14} className="mr-1" />
                <SelectValue />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="all">All</SelectItem>
                {platformCategories.map((category) => (
                  <SelectItem key={category} value={category}>
                    {category}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>

          {/* Results Badge - Auto width */}
          <div className="w-auto">
            <Badge variant="outline" className="text-xs whitespace-nowrap">
              {filteredPlatforms.length} results
            </Badge>
          </div>
        </div>
      </div>

      {/* Mobile Content */}
      <div className="flex-1 overflow-y-auto">
        {/* Popular Platforms */}
        {searchQuery === "" && selectedCategory === "all" && popularFiltered.length > 0 && (
          <div className="mb-6">
            <div className="flex items-center gap-2 mb-3">
              <Star className="text-yellow-500" size={16} />
              <h3 className="text-sm font-semibold">Popular</h3>
            </div>
            <div className="grid grid-cols-3 gap-3">
              {popularFiltered.slice(0, 6).map(([key, config]) => (
                <Button
                  key={key}
                  variant="outline"
                  className="h-auto p-3 flex flex-col items-center gap-2 hover:bg-accent rounded-lg"
                  onClick={() => onSelect(key)}
                >
                  <div className="w-8 h-8 rounded-lg bg-gradient-to-br from-gray-100 to-gray-200 dark:from-gray-800 dark:to-gray-700 flex items-center justify-center">
                    {renderIcon(config.icon)}
                  </div>
                  <span className="text-xs font-medium text-center leading-tight">
                    {config.name}
                  </span>
                </Button>
              ))}
            </div>
          </div>
        )}

        {/* All Platforms by Category */}
        {Object.entries(groupedPlatforms).map(([category, platforms]) => {
          if (platforms.length === 0) return null;
          
          return (
            <div key={category} className="mb-6">
              <div className="flex items-center justify-between mb-3">
                <h3 className="text-sm font-semibold">{category}</h3>
                <Badge variant="secondary" className="text-xs">
                  {platforms.length}
                </Badge>
              </div>
              <div className="space-y-2">
                {platforms.map(([key, config]) => (
                  <Button
                    key={key}
                    variant="outline"
                    className="w-full h-auto p-3 flex items-center gap-3 hover:bg-accent rounded-lg justify-start"
                    onClick={() => onSelect(key)}
                  >
                    <div className="w-8 h-8 rounded-lg bg-gradient-to-br from-gray-100 to-gray-200 dark:from-gray-800 dark:to-gray-700 flex items-center justify-center flex-shrink-0">
                      {renderIcon(config.icon)}
                    </div>
                    <span className="font-medium text-left">
                      {config.name}
                    </span>
                  </Button>
                ))}
              </div>
            </div>
          );
        })}

        {/* Empty State */}
        {filteredPlatforms.length === 0 && (
          <div className="text-center py-12">
            <Search className="mx-auto h-12 w-12 text-muted-foreground mb-4" />
            <h3 className="text-lg font-semibold mb-2">No platforms found</h3>
            <p className="text-sm text-muted-foreground mb-4">
              Try adjusting your search terms
            </p>
            <Button 
              onClick={() => {
                setSearchQuery("");
                setSelectedCategory("all");
              }}
              variant="outline"
              size="sm"
            >
              Clear Filters
            </Button>
          </div>
        )}
      </div>
    </div>
  ); 
}
