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
  Grid3X3, 
  List,
  Star
} from "lucide-react";
import Image from "next/image";

interface PlatformSelectorProps {
  onSelect: (platform: string) => void;
  onClose: () => void;
}

export default function PlatformSelector({ onSelect, onClose }: PlatformSelectorProps) {
  const [searchQuery, setSearchQuery] = useState("");
  const [selectedCategory, setSelectedCategory] = useState<string>("all");
  const [viewMode, setViewMode] = useState<"grid" | "list">("grid");

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

  // Get popular platforms (you can customize this based on your data)
  const popularPlatforms = ["instagram", "twitter", "youtube", "linkedin", "tiktok", "facebook"];
  const popularFiltered = filteredPlatforms.filter(([key]) => popularPlatforms.includes(key));

  // Function to render icon (image or emoji)
  const renderIcon = (icon: string, size: number = 32) => {
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
    return <span className={`${size === 24 ? 'text-xl' : 'text-2xl'}`}>{icon}</span>;
  };

  const totalPlatforms = Object.keys(platformConfigs).length;
  const filteredCount = filteredPlatforms.length;

  return (
    <div className="fixed inset-0 bg-black/60 backdrop-blur-sm flex items-center justify-center z-50 p-4">
      <div className="bg-card rounded-2xl shadow-2xl w-full max-w-5xl max-h-[90vh] overflow-hidden border border-border">
        {/* Enhanced Header */}
        <div className="relative p-6 border-b border-border bg-gradient-to-r from-blue-50 to-purple-50 dark:from-blue-950/50 dark:to-purple-950/50">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-4">
              <div className="p-3 bg-gradient-to-br from-blue-600 to-purple-600 rounded-xl shadow-lg">
                <Sparkles size={24} className="text-white" />
              </div>
              <div>
                <h2 className="text-2xl font-bold text-foreground">Add Platform Link</h2>
                <p className="text-sm text-muted-foreground mt-1">
                  Choose from {totalPlatforms}+ popular platforms
                </p>
              </div>
            </div>
            <Button 
              variant="ghost" 
              size="sm" 
              onClick={onClose}
              className="rounded-full h-10 w-10 p-0 hover:bg-white/20 dark:hover:bg-black/20"
            >
              <X size={20} />
            </Button>
          </div>
        </div>

        {/* Enhanced Search and Filters */}
        <div className="p-6 space-y-6 border-b border-border bg-muted/20">
          {/* Search Bar */}
          <div className="relative">
            <Search className="absolute left-4 top-1/2 transform -translate-y-1/2 text-muted-foreground" size={18} />
            <Input
              placeholder="Search platforms..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="pl-12 h-12 text-base rounded-xl border-2 focus:border-primary transition-all duration-200"
            />
            {searchQuery && (
              <Button
                variant="ghost"
                size="sm"
                onClick={() => setSearchQuery("")}
                className="absolute right-2 top-1/2 transform -translate-y-1/2 h-8 w-8 p-0 rounded-full"
              >
                <X size={16} />
              </Button>
            )}
          </div>

          {/* Filters and View Controls */}
          <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
            <div className="flex items-center gap-4">
              {/* Category Dropdown Filter */}
              <div className="flex items-center gap-2">
                <Filter size={16} className="text-muted-foreground" />
                <Select value={selectedCategory} onValueChange={setSelectedCategory}>
                  <SelectTrigger className="w-48 h-10 rounded-xl">
                    <SelectValue placeholder="Select category" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="all">
                      <div className="flex items-center gap-2">
                        <span>All Categories</span>
                        <Badge variant="secondary" className="text-xs">
                          {totalPlatforms}
                        </Badge>
                      </div>
                    </SelectItem>
                    {platformCategories.map((category) => {
                      const count = Object.values(platformConfigs).filter(
                        config => config.category === category
                      ).length;
                      return (
                        <SelectItem key={category} value={category}>
                          <div className="flex items-center gap-2">
                            <span>{category}</span>
                            <Badge variant="secondary" className="text-xs">
                              {count}
                            </Badge>
                          </div>
                        </SelectItem>
                      );
                    })}
                  </SelectContent>
                </Select>
              </div>

              {/* Results Count */}
              <Badge variant="outline" className="flex items-center gap-1">
                <span>{filteredCount} results</span>
              </Badge>
            </div>

            {/* View Mode Toggle */}
            <div className="flex items-center gap-1 bg-muted rounded-lg p-1">
              <Button
                variant={viewMode === "grid" ? "default" : "ghost"}
                size="sm"
                onClick={() => setViewMode("grid")}
                className="h-8 px-3 rounded-md"
              >
                <Grid3X3 size={16} />
              </Button>
              <Button
                variant={viewMode === "list" ? "default" : "ghost"}
                size="sm"
                onClick={() => setViewMode("list")}
                className="h-8 px-3 rounded-md"
              >
                <List size={16} />
              </Button>
            </div>
          </div>
        </div>

        {/* Enhanced Platforms Display */}
        <div className="overflow-y-auto max-h-[55vh] p-6">
          {/* Popular Platforms Section (only show if no search/filter) */}
          {searchQuery === "" && selectedCategory === "all" && popularFiltered.length > 0 && (
            <div className="mb-8">
              <div className="flex items-center gap-3 mb-4">
                <Star className="text-yellow-500" size={20} />
                <h3 className="text-lg font-semibold text-foreground">Popular Platforms</h3>
                <div className="h-px bg-border flex-1" />
              </div>
              <div className={viewMode === "grid" 
                ? "grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-6 gap-3"
                : "space-y-2"
              }>
                {popularFiltered.map(([key, config]) => (
                  <PlatformButton
                    key={key}
                    platformKey={key}
                    config={config}
                    onSelect={onSelect}
                    renderIcon={renderIcon}
                    viewMode={viewMode}
                    isPopular
                  />
                ))}
              </div>
            </div>
          )}

          {/* All Platforms by Category */}
          {Object.entries(groupedPlatforms).map(([category, platforms]) => {
            if (platforms.length === 0) return null;
            
            return (
              <div key={category} className="mb-8 last:mb-0">
                <div className="flex items-center gap-3 mb-4">
                  <h3 className="text-lg font-semibold text-foreground">{category}</h3>
                  <div className="h-px bg-border flex-1" />
                  <Badge variant="secondary" className="text-xs">
                    {platforms.length}
                  </Badge>
                </div>
                <div className={viewMode === "grid" 
                  ? "grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 gap-3"
                  : "space-y-2"
                }>
                  {platforms.map(([key, config]) => (
                    <PlatformButton
                      key={key}
                      platformKey={key}
                      config={config}
                      onSelect={onSelect}
                      renderIcon={renderIcon}
                      viewMode={viewMode}
                    />
                  ))}
                </div>
              </div>
            );
          })}

          {/* Empty State */}
          {filteredPlatforms.length === 0 && (
            <div className="text-center py-16">
              <div className="mb-6">
                <div className="mx-auto w-20 h-20 bg-gradient-to-br from-gray-100 to-gray-200 dark:from-gray-800 dark:to-gray-700 rounded-full flex items-center justify-center mb-4">
                  <Search className="h-10 w-10 text-muted-foreground" />
                </div>
              </div>
              <h3 className="text-xl font-semibold text-foreground mb-2">No platforms found</h3>
              <p className="text-muted-foreground mb-6 max-w-sm mx-auto">
                Try adjusting your search terms or browse all categories
              </p>
              <Button 
                onClick={() => {
                  setSearchQuery("");
                  setSelectedCategory("all");
                }}
                variant="outline"
                className="rounded-full"
              >
                Clear Filters
              </Button>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}

// Separate component for platform buttons to keep code clean
interface PlatformButtonProps {
  platformKey: string;
  config: any;
  onSelect: (platform: string) => void;
  renderIcon: (icon: string, size?: number) => React.ReactNode;
  viewMode: "grid" | "list";
  isPopular?: boolean;
}

function PlatformButton({ 
  platformKey, 
  config, 
  onSelect, 
  renderIcon, 
  viewMode, 
  isPopular = false 
}: PlatformButtonProps) {
  if (viewMode === "list") {
    return (
      <Button
        variant="outline"
        className="w-full h-auto p-4 flex items-center gap-4 hover:bg-accent hover:border-primary/50 transition-all duration-200 rounded-xl group justify-start"
        onClick={() => onSelect(platformKey)}
      >
        <div className="w-10 h-10 rounded-lg bg-gradient-to-br from-gray-100 to-gray-200 dark:from-gray-800 dark:to-gray-700 flex items-center justify-center shadow-sm group-hover:shadow-md transition-shadow flex-shrink-0">
          {renderIcon(config.icon, 24)}
        </div>
        <div className="flex-1 text-left">
          <div className="flex items-center gap-2">
            <span className="font-medium group-hover:text-primary transition-colors">
              {config.name}
            </span>
            {isPopular && (
              <Star size={14} className="text-yellow-500 fill-current" />
            )}
          </div>
          <p className="text-xs text-muted-foreground">{config.category}</p>
        </div>
      </Button>
    );
  }

  return (
    <Button
      variant="outline"
      className="h-auto p-4 flex flex-col items-center gap-3 hover:bg-accent hover:border-primary/50 transition-all duration-200 hover:scale-105 hover:shadow-lg rounded-xl group relative"
      onClick={() => onSelect(platformKey)}
    >
      {isPopular && (
        <div className="absolute -top-2 -right-2 w-6 h-6 bg-yellow-500 rounded-full flex items-center justify-center">
          <Star size={12} className="text-white fill-current" />
        </div>
      )}
      <div className="w-12 h-12 rounded-xl bg-gradient-to-br from-gray-100 to-gray-200 dark:from-gray-800 dark:to-gray-700 flex items-center justify-center shadow-sm group-hover:shadow-md transition-shadow">
        {renderIcon(config.icon)}
      </div>
      <span className="text-sm font-medium text-center leading-tight group-hover:text-primary transition-colors">
        {config.name}
      </span>
    </Button>
  );
}
