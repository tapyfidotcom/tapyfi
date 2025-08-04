"use client";

import React, { useState, useEffect } from "react";
import { TabsContent } from "@/components/ui/tabs";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { LinktreeProfile, LinktreeLink } from "@/interfaces/linktree";
import { getProfileAnalytics } from "@/actions/linktree";
import { platformConfigs } from "@/lib/platform-configs";
import { 
  BarChart3, 
  Eye, 
  MousePointer, 
  TrendingUp, 
  ExternalLink,
  Loader2,
  Users,
  Globe,
  Calendar,
  Activity,
  Trophy,
  Medal,
  Award
} from "lucide-react";
import Image from "next/image";

interface AnalyticsTabProps {
  profile: LinktreeProfile | null;
  links: LinktreeLink[];
}

interface TopLink {
  title: string;
  platform: string;
  clicks: number;
}

interface DailyStat {
  date: string;
  views: number;
  clicks: number;
}

interface AnalyticsData {
  totalViews: number;
  totalClicks: number;
  uniqueVisitors: number;
  topLinks: TopLink[];
  dailyStats: DailyStat[];
}

interface AnalyticsEvent {
  event_type: string;
  link_id?: number;
  created_at: string;
  ip_address?: string;
}

export default function AnalyticsTab({ profile, links }: AnalyticsTabProps) {
  const [timeRange, setTimeRange] = useState<'7d' | '30d' | '90d'>('30d');
  const [analytics, setAnalytics] = useState<AnalyticsData | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    loadAnalytics();
  }, [timeRange]);

  const loadAnalytics = async () => {
    if (!profile) return;
    
    setLoading(true);
    try {
      const response = await getProfileAnalytics(timeRange);
      if (response.success && response.data) {
        const processedData: AnalyticsData = {
          totalViews: response.data.filter((d: AnalyticsEvent) => d.event_type === 'profile_view').length,
          totalClicks: response.data.filter((d: AnalyticsEvent) => d.event_type === 'link_click').length,
          uniqueVisitors: new Set(response.data.map((d: AnalyticsEvent) => d.ip_address)).size,
          topLinks: getTopLinks(response.data),
          dailyStats: getDailyStats(response.data)
        };
        setAnalytics(processedData);
      }
    } catch (error) {
      console.error('Error loading analytics:', error);
    } finally {
      setLoading(false);
    }
  };

  const getTopLinks = (data: AnalyticsEvent[]): TopLink[] => {
    const linkClicks: Record<string, number> = {};
    
    data
      .filter(d => d.event_type === 'link_click' && d.link_id)
      .forEach(click => {
        const linkId = click.link_id!;
        const link = links.find(l => l.id === linkId);
        if (link) {
          const key = `${link.title}-${link.platform}`;
          linkClicks[key] = (linkClicks[key] || 0) + 1;
        }
      });

    return Object.entries(linkClicks)
      .map(([key, clicks]) => {
        const [title, platform] = key.split('-');
        return { title, platform, clicks: Number(clicks) };
      })
      .sort((a, b) => b.clicks - a.clicks)
      .slice(0, 5);
  };

  const getDailyStats = (data: AnalyticsEvent[]): DailyStat[] => {
    const daily: Record<string, { views: number; clicks: number }> = {};
    
    data.forEach(event => {
      const date = new Date(event.created_at).toISOString().split('T')[0];
      if (!daily[date]) {
        daily[date] = { views: 0, clicks: 0 };
      }
      if (event.event_type === 'profile_view') {
        daily[date].views++;
      } else if (event.event_type === 'link_click') {
        daily[date].clicks++;
      }
    });

    return Object.entries(daily)
      .map(([date, stats]) => ({ 
        date, 
        views: stats.views, 
        clicks: stats.clicks 
      }))
      .sort((a, b) => new Date(a.date).getTime() - new Date(b.date).getTime())
      .slice(-30);
  };

  const getTimeRangeLabel = () => {
    switch (timeRange) {
      case '7d': return 'Last 7 days';
      case '30d': return 'Last 30 days';
      case '90d': return 'Last 90 days';
    }
  };

  // Function to render icon (image or emoji) - Increased size
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
    return <span className="text-2xl">{icon}</span>;
  };

  // Function to get ranking icon based on position
  const getRankingIcon = (index: number) => {
    switch (index) {
      case 0: return <Trophy className="w-5 h-5 text-yellow-500" />;
      case 1: return <Medal className="w-5 h-5 text-gray-400" />;
      case 2: return <Award className="w-5 h-5 text-amber-600" />;
      default: return null;
    }
  };

  // Function to get ranking colors
  const getRankingColors = (index: number) => {
    switch (index) {
      case 0: return "bg-gradient-to-r from-yellow-500 to-yellow-600 text-white";
      case 1: return "bg-gradient-to-r from-gray-400 to-gray-500 text-white";
      case 2: return "bg-gradient-to-r from-amber-600 to-amber-700 text-white";
      default: return "bg-gradient-to-r from-blue-500 to-blue-600 text-white";
    }
  };

  if (!profile) {
    return (
      <TabsContent value="analytics" className="space-y-6">
        <Card className="border-0 shadow-sm">
          <CardContent className="p-12 text-center">
            <div className="w-16 h-16 mx-auto mb-4 bg-muted rounded-full flex items-center justify-center">
              <BarChart3 className="h-8 w-8 text-muted-foreground" />
            </div>
            <h3 className="text-lg font-semibold mb-2">No Profile Found</h3>
            <p className="text-muted-foreground">Create a profile to view analytics</p>
          </CardContent>
        </Card>
      </TabsContent>
    );
  }

  const totalViews = analytics?.totalViews || profile.view_count || 0;
  const totalClicks = analytics?.totalClicks || links.reduce((sum, link) => sum + link.click_count, 0);
  const uniqueVisitors = analytics?.uniqueVisitors || Math.floor(totalViews * 0.7);

  return (
    <TabsContent value="analytics" className="space-y-6">
      {/* Header */}
      <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
        <div>
          <h2 className="text-2xl font-bold flex items-center gap-2">
            <Activity size={24} className="text-primary" />
            Analytics
          </h2>
          <p className="text-sm text-muted-foreground mt-1">
            {getTimeRangeLabel()}
          </p>
        </div>
        
        {/* Time Range Selector */}
        <div className="flex bg-muted rounded-lg p-1">
          {(['7d', '30d', '90d'] as const).map((range) => (
            <Button
              key={range}
              variant={timeRange === range ? "default" : "ghost"}
              size="sm"
              onClick={() => setTimeRange(range)}
              className="h-8 px-3 text-xs font-medium rounded-md"
            >
              {range === '7d' ? '7D' : range === '30d' ? '30D' : '90D'}
            </Button>
          ))}
        </div>
      </div>

      {loading ? (
        <Card className="border-0 shadow-sm">
          <CardContent className="p-12 text-center">
            <Loader2 className="mx-auto h-8 w-8 animate-spin text-primary mb-4" />
            <p className="text-muted-foreground">Loading analytics...</p>
          </CardContent>
        </Card>
      ) : (
        <>
          {/* Stats Grid */}
          <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
            <Card className="border-0 shadow-sm bg-gradient-to-br from-blue-50 to-blue-100 dark:from-blue-950 dark:to-blue-900">
              <CardContent className="p-4">
                <div className="flex items-center gap-3">
                  <div className="w-10 h-10 bg-blue-500 rounded-lg flex items-center justify-center">
                    <Eye size={20} className="text-white" />
                  </div>
                  <div className="min-w-0 flex-1">
                    <p className="text-xs font-medium text-blue-700 dark:text-blue-300">Views</p>
                    <p className="text-xl font-bold text-blue-900 dark:text-blue-100">{totalViews}</p>
                  </div>
                </div>
              </CardContent>
            </Card>

            <Card className="border-0 shadow-sm bg-gradient-to-br from-green-50 to-green-100 dark:from-green-950 dark:to-green-900">
              <CardContent className="p-4">
                <div className="flex items-center gap-3">
                  <div className="w-10 h-10 bg-green-500 rounded-lg flex items-center justify-center">
                    <MousePointer size={20} className="text-white" />
                  </div>
                  <div className="min-w-0 flex-1">
                    <p className="text-xs font-medium text-green-700 dark:text-green-300">Clicks</p>
                    <p className="text-xl font-bold text-green-900 dark:text-green-100">{totalClicks}</p>
                  </div>
                </div>
              </CardContent>
            </Card>

            <Card className="border-0 shadow-sm bg-gradient-to-br from-purple-50 to-purple-100 dark:from-purple-950 dark:to-purple-900">
              <CardContent className="p-4">
                <div className="flex items-center gap-3">
                  <div className="w-10 h-10 bg-purple-500 rounded-lg flex items-center justify-center">
                    <Users size={20} className="text-white" />
                  </div>
                  <div className="min-w-0 flex-1">
                    <p className="text-xs font-medium text-purple-700 dark:text-purple-300">Visitors</p>
                    <p className="text-xl font-bold text-purple-900 dark:text-purple-100">{uniqueVisitors}</p>
                  </div>
                </div>
              </CardContent>
            </Card>

            <Card className="border-0 shadow-sm bg-gradient-to-br from-orange-50 to-orange-100 dark:from-orange-950 dark:to-orange-900">
              <CardContent className="p-4">
                <div className="flex items-center gap-3">
                  <div className="w-10 h-10 bg-orange-500 rounded-lg flex items-center justify-center">
                    <ExternalLink size={20} className="text-white" />
                  </div>
                  <div className="min-w-0 flex-1">
                    <p className="text-xs font-medium text-orange-700 dark:text-orange-300">Links</p>
                    <p className="text-xl font-bold text-orange-900 dark:text-orange-100">{links.length}</p>
                  </div>
                </div>
              </CardContent>
            </Card>
          </div>

          <div className="grid lg:grid-cols-3 gap-6">
            {/* Top Links - Enhanced with larger icons and new ranking system */}
            <Card className="lg:col-span-2 border-0 shadow-sm">
              <CardHeader className="pb-4">
                <CardTitle className="text-lg flex items-center gap-2">
                  <TrendingUp size={18} />
                  Top Performing Links
                </CardTitle>
              </CardHeader>
              <CardContent>
                {links.length === 0 ? (
                  <div className="text-center py-8">
                    <div className="w-12 h-12 mx-auto mb-3 bg-muted rounded-full flex items-center justify-center">
                      <ExternalLink className="h-6 w-6 text-muted-foreground" />
                    </div>
                    <p className="text-sm text-muted-foreground">No links to analyze</p>
                  </div>
                ) : (
                  <div className="space-y-4">
                    {links
                      .sort((a, b) => b.click_count - a.click_count)
                      .slice(0, 5)
                      .map((link, index) => {
                        const config = platformConfigs[link.platform];
                        const clickRate = totalViews > 0 
                          ? ((link.click_count / totalViews) * 100).toFixed(1)
                          : '0.0';
                        
                        return (
                          <div key={link.id} className="relative group">
                            {/* Ranking Badge - Positioned absolutely */}
                            <div className="absolute -left-2 -top-2 z-10">
                              <div className={`
                                w-8 h-8 rounded-full flex items-center justify-center text-sm font-bold shadow-lg
                                ${getRankingColors(index)}
                              `}>
                                {index < 3 ? getRankingIcon(index) : index + 1}
                              </div>
                            </div>

                            {/* Main Link Card */}
                            <div className="flex items-center gap-4 p-4 bg-muted/30 rounded-xl hover:bg-muted/50 transition-colors ml-4">
                              {/* Enhanced Platform Icon */}
                              <div className="w-14 h-14 bg-background rounded-xl flex items-center justify-center shadow-sm border border-border group-hover:shadow-md transition-shadow">
                                {renderIcon(config?.icon || '🔗', 32)}
                              </div>
                              
                              {/* Link Info */}
                              <div className="flex-1 min-w-0">
                                <div className="flex items-start justify-between gap-2">
                                  <div className="min-w-0 flex-1">
                                    <h4 className="text-sm font-semibold truncate text-foreground">{link.title}</h4>
                                    <p className="text-xs text-muted-foreground truncate mt-0.5">
                                      {config?.name || 'Custom'} • {link.url.length > 30 ? link.url.substring(0, 30) + '...' : link.url}
                                    </p>
                                  </div>
                                  
                                  {/* Stats */}
                                  <div className="text-right flex-shrink-0">
                                    <p className="text-lg font-bold text-foreground">{link.click_count}</p>
                                    <p className="text-xs text-muted-foreground">
                                      {clickRate}% CTR
                                    </p>
                                  </div>
                                </div>
                                
                                {/* Progress Bar */}
                                <div className="mt-3">
                                  <div className="w-full bg-muted rounded-full h-1.5">
                                    <div 
                                      className={`h-1.5 rounded-full transition-all duration-500 ${
                                        index === 0 ? 'bg-gradient-to-r from-yellow-400 to-yellow-600' :
                                        index === 1 ? 'bg-gradient-to-r from-gray-400 to-gray-600' :
                                        index === 2 ? 'bg-gradient-to-r from-amber-500 to-amber-700' :
                                        'bg-gradient-to-r from-blue-400 to-blue-600'
                                      }`}
                                      style={{ 
                                        width: `${Math.max(5, Math.min(100, (link.click_count / Math.max(...links.map(l => l.click_count))) * 100))}%` 
                                      }}
                                    />
                                  </div>
                                </div>
                              </div>
                            </div>
                          </div>
                        );
                      })}
                  </div>
                )}
              </CardContent>
            </Card>

            {/* Profile Info */}
            <Card className="border-0 shadow-sm">
              <CardHeader className="pb-4">
                <CardTitle className="text-lg flex items-center gap-2">
                  <Globe size={18} />
                  Profile
                </CardTitle>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  <div className="flex items-center justify-between">
                    <span className="text-sm">Status</span>
                    <Badge variant={profile.is_active ? "default" : "secondary"} className="text-xs">
                      {profile.is_active ? 'Active' : 'Inactive'}
                    </Badge>
                  </div>
                  
                  <div className="flex items-center justify-between">
                    <span className="text-sm">Username</span>
                    <span className="text-sm font-medium">@{profile.username}</span>
                  </div>
                  
                  <div className="flex items-center justify-between">
                    <span className="text-sm">Created</span>
                    <span className="text-sm text-muted-foreground">
                      {new Date(profile.created_at).toLocaleDateString('en-US', {
                        month: 'short',
                        day: 'numeric',
                        year: 'numeric'
                      })}
                    </span>
                  </div>

                  <div className="pt-2 border-t space-y-3">
                    <div className="flex items-center justify-between">
                      <span className="text-sm">Total Views</span>
                      <span className="text-sm font-semibold">{profile.view_count.toLocaleString()}</span>
                    </div>
                    
                    <div className="flex items-center justify-between">
                      <span className="text-sm">Total Clicks</span>
                      <span className="text-sm font-semibold">{totalClicks.toLocaleString()}</span>
                    </div>
                    
                    <div className="flex items-center justify-between">
                      <span className="text-sm">Click Rate</span>
                      <span className="text-sm font-semibold">
                        {totalViews > 0 ? ((totalClicks / totalViews) * 100).toFixed(1) : '0'}%
                      </span>
                    </div>
                  </div>
                </div>
              </CardContent>
            </Card>
          </div>
        </>
      )}
    </TabsContent>
  );
}
