"use client";

import React, { useState, useEffect } from "react";
import { TabsContent } from "@/components/ui/tabs";
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

  // Function to render icon (image or emoji)
  const renderIcon = (icon: string, size: number = 20) => {
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
    return <span className={`text-${size === 24 ? 'xl' : 'lg'}`}>{icon}</span>;
  };

  // Function to get ranking icon based on position
  const getRankingIcon = (index: number) => {
    switch (index) {
      case 0: return <Trophy className="w-3 h-3 lg:w-4 lg:h-4 text-yellow-900" />;
      case 1: return <Medal className="w-3 h-3 lg:w-4 lg:h-4 text-gray-900" />;
      case 2: return <Award className="w-3 h-3 lg:w-4 lg:h-4 text-amber-900" />;
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
      <TabsContent value="analytics" className="space-y-4">
        <div className="bg-white/80 dark:bg-gray-800 backdrop-blur-xl border border-white/20 dark:border-gray-300/20 rounded-lg p-6 lg:p-12 text-center shadow-lg">
          <div className="w-12 h-12 lg:w-16 lg:h-16 mx-auto mb-4 bg-white/30 dark:bg-gray-100/30 backdrop-blur-sm rounded-full flex items-center justify-center border border-white/20 dark:border-gray-300/20">
            <BarChart3 className="h-6 w-6 lg:h-8 lg:w-8 text-gray-600 dark:text-gray-400" />
          </div>
          <h3 className="text-base lg:text-lg font-semibold mb-2 text-gray-900 dark:text-gray-100">No Profile Found</h3>
          <p className="text-sm text-gray-700 dark:text-gray-300">Create a profile to view analytics</p>
        </div>
      </TabsContent>
    );
  }

  const totalViews = analytics?.totalViews || profile.view_count || 0;
  const totalClicks = analytics?.totalClicks || links.reduce((sum, link) => sum + link.click_count, 0);
  const uniqueVisitors = analytics?.uniqueVisitors || Math.floor(totalViews * 0.7);

  return (
    <TabsContent value="analytics" className="space-y-4">
      <div className="space-y-4">
        {/* Header with Perfect Glass Effect */}
        <div className="flex items-center justify-between pb-4 border-b border-gray-200/50 dark:border-gray-700/50">
          <div className="flex items-center gap-2">
            <Activity size={18} className="text-primary" />
            <h2 className="text-lg font-semibold text-gray-900 dark:text-gray-100">Analytics & Stats</h2>
            <span className="text-xs font-normal text-gray-700 dark:text-gray-300 bg-white/30 dark:bg-gray-100/30 backdrop-blur-sm px-2 py-1 rounded-full border border-white/20 dark:border-gray-300/20">
              {getTimeRangeLabel()}
            </span>
          </div>
          
          {/* Time Range Selector - Mobile Optimized */}
          <div className="flex bg-white/30 dark:bg-gray-100/30 backdrop-blur-sm rounded-lg p-1 border border-white/20 dark:border-gray-300/20">
            {(['7d', '30d', '90d'] as const).map((range) => (
              <Button
                key={range}
                variant={timeRange === range ? "default" : "ghost"}
                size="sm"
                onClick={() => setTimeRange(range)}
                className="h-6 lg:h-8 px-2 lg:px-3 text-xs font-medium rounded-md"
              >
                {range === '7d' ? '7D' : range === '30d' ? '30D' : '90D'}
              </Button>
            ))}
          </div>
        </div>

        {loading ? (
          <div className="bg-white/80 dark:bg-gray-800 backdrop-blur-xl border border-white/20 dark:border-gray-300/20 rounded-lg p-6 lg:p-12 text-center shadow-lg">
            <Loader2 className="mx-auto h-6 w-6 lg:h-8 lg:w-8 animate-spin text-primary mb-4" />
            <p className="text-sm text-gray-700 dark:text-gray-300">Loading analytics...</p>
          </div>
        ) : (
          <>
            {/* Stats Grid - Perfect Glass Effect */}
            <div className="grid grid-cols-2 lg:grid-cols-4 gap-3">
              <div className="bg-white/80 dark:bg-gray-800 backdrop-blur-xl border border-blue-200/40 dark:border-blue-300/40 rounded-lg p-3 shadow-lg">
                <div className="flex items-center gap-2">
                  <div className="w-8 h-8 lg:w-10 lg:h-10 bg-blue-500 rounded-lg flex items-center justify-center shadow-sm">
                    <Eye size={14} className="lg:w-5 lg:h-5 text-white" />
                  </div>
                  <div className="min-w-0 flex-1">
                    <p className="text-xs font-medium text-gray-700 dark:text-gray-300">Views</p>
                    <p className="text-lg lg:text-xl font-bold text-gray-900 dark:text-gray-100">{totalViews}</p>
                  </div>
                </div>
              </div>

              <div className="bg-white/80 dark:bg-gray-800 backdrop-blur-xl border border-green-200/40 dark:border-green-300/40 rounded-lg p-3 shadow-lg">
                <div className="flex items-center gap-2">
                  <div className="w-8 h-8 lg:w-10 lg:h-10 bg-green-500 rounded-lg flex items-center justify-center shadow-sm">
                    <MousePointer size={14} className="lg:w-5 lg:h-5 text-white" />
                  </div>
                  <div className="min-w-0 flex-1">
                    <p className="text-xs font-medium text-gray-700 dark:text-gray-300">Clicks</p>
                    <p className="text-lg lg:text-xl font-bold text-gray-900 dark:text-gray-100">{totalClicks}</p>
                  </div>
                </div>
              </div>

              <div className="bg-white/80 dark:bg-gray-800 backdrop-blur-xl border border-purple-200/40 dark:border-purple-300/40 rounded-lg p-3 shadow-lg">
                <div className="flex items-center gap-2">
                  <div className="w-8 h-8 lg:w-10 lg:h-10 bg-purple-500 rounded-lg flex items-center justify-center shadow-sm">
                    <Users size={14} className="lg:w-5 lg:h-5 text-white" />
                  </div>
                  <div className="min-w-0 flex-1">
                    <p className="text-xs font-medium text-gray-700 dark:text-gray-300">Visitors</p>
                    <p className="text-lg lg:text-xl font-bold text-gray-900 dark:text-gray-100">{uniqueVisitors}</p>
                  </div>
                </div>
              </div>

              <div className="bg-white/80 dark:bg-gray-800 backdrop-blur-xl border border-orange-200/40 dark:border-orange-300/40 rounded-lg p-3 shadow-lg">
                <div className="flex items-center gap-2">
                  <div className="w-8 h-8 lg:w-10 lg:h-10 bg-orange-500 rounded-lg flex items-center justify-center shadow-sm">
                    <ExternalLink size={14} className="lg:w-5 lg:h-5 text-white" />
                  </div>
                  <div className="min-w-0 flex-1">
                    <p className="text-xs font-medium text-gray-700 dark:text-gray-300">Links</p>
                    <p className="text-lg lg:text-xl font-bold text-gray-900 dark:text-gray-100">{links.length}</p>
                  </div>
                </div>
              </div>
            </div>

            {/* Content Grid - Mobile Optimized */}
            <div className="space-y-4 lg:grid lg:grid-cols-3 lg:gap-6 lg:space-y-0">
              {/* Top Links - Perfect Glass Effect */}
              <div className="lg:col-span-2 bg-white/80 dark:bg-gray-800 backdrop-blur-xl border border-white/20 dark:border-gray-300/20 rounded-lg p-4 shadow-lg">
                <div className="flex items-center gap-2 mb-4">
                  <TrendingUp size={16} className="text-primary" />
                  <h3 className="text-base lg:text-lg font-semibold text-gray-900 dark:text-gray-100">Top Performing Links</h3>
                </div>

                {links.length === 0 ? (
                  <div className="text-center py-6 lg:py-8">
                    <div className="w-10 h-10 lg:w-12 lg:h-12 mx-auto mb-3 bg-white/30 dark:bg-gray-100/30 backdrop-blur-sm rounded-full flex items-center justify-center border border-white/20 dark:border-gray-300/20">
                      <ExternalLink className="h-5 w-5 lg:h-6 lg:w-6 text-gray-600 dark:text-gray-400" />
                    </div>
                    <p className="text-sm text-gray-700 dark:text-gray-300">No links to analyze</p>
                  </div>
                ) : (
                  <div className="space-y-3">
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
                            {/* Ranking Badge - Mobile Optimized */}
                            <div className="absolute -left-2 -top-1 z-10">
                              <div className={`
                                w-6 h-6 lg:w-8 lg:h-8 rounded-full flex items-center justify-center text-xs lg:text-sm font-bold shadow-lg
                                ${getRankingColors(index)}
                              `}>
                                {index < 3 ? getRankingIcon(index) : index + 1}
                              </div>
                            </div>

                            {/* Main Link Card - Perfect Glass Effect */}
                            <div className="flex items-center gap-3 p-3 bg-white/30 dark:bg-gray-100/30 backdrop-blur-sm rounded-lg hover:bg-white/40 dark:hover:bg-gray-100/40 transition-colors ml-3 border border-white/20 dark:border-gray-300/20">
                              {/* Platform Icon - Mobile Optimized */}
                              <div className="w-10 h-10 lg:w-12 lg:h-12 bg-white/40 dark:bg-gray-100/40 backdrop-blur-sm rounded-lg flex items-center justify-center shadow-sm border border-white/20 dark:border-gray-300/20 group-hover:shadow-md transition-shadow">
                                {renderIcon(config?.icon || '🔗', 20)}
                              </div>
                              
                              {/* Link Info */}
                              <div className="flex-1 min-w-0">
                                <div className="flex items-start justify-between gap-2">
                                  <div className="min-w-0 flex-1">
                                    <h4 className="text-sm font-semibold truncate text-gray-900 dark:text-gray-100">{link.title}</h4>
                                    <p className="text-xs text-black dark:text-black truncate mt-0.5">
                                      {config?.name || 'Custom'} • {link.url.length > 25 ? link.url.substring(0, 25) + '...' : link.url}
                                    </p>
                                  </div>
                                  
                                  {/* Stats */}
                                  <div className="text-right flex-shrink-0">
                                    <p className="text-sm lg:text-base font-black text-gray-900 dark:text-gray-100">{link.click_count}</p>
                                    <p className="text-xs text-gray-600 dark:text-gray-800">
                                      {clickRate}% CTR
                                    </p>
                                  </div>
                                </div>
                                
                                {/* Progress Bar - Mobile Optimized */}
                                <div className="mt-2">
                                  <div className="w-full bg-white/40 dark:bg-gray-100/40 backdrop-blur-sm rounded-full h-1 lg:h-1.5 border border-white/20 dark:border-gray-300/20">
                                    <div 
                                      className={`h-1 lg:h-1.5 rounded-full transition-all duration-500 ${
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
              </div>

              {/* Profile Info - Perfect Glass Effect */}
              <div className="bg-white/80 dark:bg-gray-800 backdrop-blur-xl border border-white/20 dark:border-gray-300/20 rounded-lg p-4 shadow-lg">
                <div className="flex items-center gap-2 mb-4">
                  <Globe size={16} className="text-primary" />
                  <h3 className="text-base lg:text-lg font-semibold text-gray-900 dark:text-gray-100">Profile</h3>
                </div>

                <div className="space-y-3">
                  <div className="flex items-center justify-between">
                    <span className="text-sm text-gray-700 dark:text-gray-300">Status</span>
                    <Badge 
                      variant={profile.is_active ? "default" : "secondary"} 
                      className="text-xs bg-white/30 dark:bg-gray-100/30 backdrop-blur-sm border border-white/20 dark:border-gray-300/20"
                    >
                      {profile.is_active ? 'Active' : 'Inactive'}
                    </Badge>
                  </div>
                  
                  <div className="flex items-center justify-between">
                    <span className="text-sm text-gray-700 dark:text-gray-300">Username</span>
                    <span className="text-sm font-medium text-gray-900 dark:text-gray-100">@{profile.username}</span>
                  </div>
                  
                  <div className="flex items-center justify-between">
                    <span className="text-sm text-gray-700 dark:text-gray-300">Created</span>
                    <span className="text-sm text-gray-700 dark:text-gray-300">
                      {new Date(profile.created_at).toLocaleDateString('en-US', {
                        month: 'short',
                        day: 'numeric',
                        year: 'numeric'
                      })}
                    </span>
                  </div>

                  <div className="pt-3 border-t border-gray-200/50 dark:border-gray-700/50 space-y-3">
                    <div className="flex items-center justify-between">
                      <span className="text-sm text-gray-700 dark:text-gray-300">Total Views</span>
                      <span className="text-sm font-semibold text-gray-900 dark:text-gray-100">{profile.view_count.toLocaleString()}</span>
                    </div>
                    
                    <div className="flex items-center justify-between">
                      <span className="text-sm text-gray-700 dark:text-gray-300">Total Clicks</span>
                      <span className="text-sm font-semibold text-gray-900 dark:text-gray-100">{totalClicks.toLocaleString()}</span>
                    </div>
                    
                    <div className="flex items-center justify-between">
                      <span className="text-sm text-gray-700 dark:text-gray-300">Click Rate</span>
                      <span className="text-sm font-semibold text-gray-900 dark:text-gray-100">
                        {totalViews > 0 ? ((totalClicks / totalViews) * 100).toFixed(1) : '0'}%
                      </span>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </>
        )}
      </div>
    </TabsContent>
  );
}
