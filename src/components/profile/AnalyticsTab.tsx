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
  Calendar,
  ExternalLink,
  Loader2,
  Users,
  Globe
} from "lucide-react";

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
        return { 
          title, 
          platform, 
          clicks: Number(clicks)
        };
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

  if (!profile) {
    return (
      <TabsContent value="analytics" className="space-y-6">
        <Card>
          <CardContent className="p-8 text-center">
            <BarChart3 className="mx-auto h-12 w-12 text-muted-foreground mb-4" />
            <h3 className="text-lg font-medium text-muted-foreground mb-2">No Profile Found</h3>
            <p className="text-sm text-muted-foreground">Create a profile to view analytics</p>
          </CardContent>
        </Card>
      </TabsContent>
    );
  }

  return (
    <TabsContent value="analytics" className="space-y-6">
      {/* Header */}
      <Card>
        <CardHeader>
          <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
            <CardTitle className="flex items-center gap-2">
              <BarChart3 size={20} />
              Analytics Dashboard
            </CardTitle>
            <div className="flex items-center gap-2">
              {(['7d', '30d', '90d'] as const).map((range) => (
                <Button
                  key={range}
                  variant={timeRange === range ? "default" : "outline"}
                  size="sm"
                  onClick={() => setTimeRange(range)}
                  className="rounded-full"
                >
                  {range === '7d' ? '7 Days' : range === '30d' ? '30 Days' : '90 Days'}
                </Button>
              ))}
            </div>
          </div>
          <p className="text-sm text-muted-foreground">
            Showing data for {getTimeRangeLabel()}
          </p>
        </CardHeader>
      </Card>

      {loading ? (
        <Card>
          <CardContent className="p-8 text-center">
            <Loader2 className="mx-auto h-8 w-8 animate-spin text-primary mb-4" />
            <p className="text-muted-foreground">Loading analytics...</p>
          </CardContent>
        </Card>
      ) : (
        <>
          {/* Overview Stats */}
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
            <Card className="hover:shadow-md transition-shadow">
              <CardContent className="p-6">
                <div className="flex items-center justify-between">
                  <div>
                    <p className="text-sm font-medium text-muted-foreground">Profile Views</p>
                    <p className="text-2xl font-bold text-primary">
                      {analytics?.totalViews || profile.view_count || 0}
                    </p>
                  </div>
                  <div className="p-2 bg-blue-100 dark:bg-blue-900 rounded-lg">
                    <Eye className="h-5 w-5 text-blue-600 dark:text-blue-400" />
                  </div>
                </div>
              </CardContent>
            </Card>

            <Card className="hover:shadow-md transition-shadow">
              <CardContent className="p-6">
                <div className="flex items-center justify-between">
                  <div>
                    <p className="text-sm font-medium text-muted-foreground">Link Clicks</p>
                    <p className="text-2xl font-bold text-primary">
                      {analytics?.totalClicks || links.reduce((sum, link) => sum + link.click_count, 0)}
                    </p>
                  </div>
                  <div className="p-2 bg-green-100 dark:bg-green-900 rounded-lg">
                    <MousePointer className="h-5 w-5 text-green-600 dark:text-green-400" />
                  </div>
                </div>
              </CardContent>
            </Card>

            <Card className="hover:shadow-md transition-shadow">
              <CardContent className="p-6">
                <div className="flex items-center justify-between">
                  <div>
                    <p className="text-sm font-medium text-muted-foreground">Active Links</p>
                    <p className="text-2xl font-bold text-primary">{links.length}</p>
                  </div>
                  <div className="p-2 bg-purple-100 dark:bg-purple-900 rounded-lg">
                    <ExternalLink className="h-5 w-5 text-purple-600 dark:text-purple-400" />
                  </div>
                </div>
              </CardContent>
            </Card>

            <Card className="hover:shadow-md transition-shadow">
              <CardContent className="p-6">
                <div className="flex items-center justify-between">
                  <div>
                    <p className="text-sm font-medium text-muted-foreground">Unique Visitors</p>
                    <p className="text-2xl font-bold text-primary">
                      {analytics?.uniqueVisitors || Math.floor((profile.view_count || 0) * 0.7)}
                    </p>
                  </div>
                  <div className="p-2 bg-orange-100 dark:bg-orange-900 rounded-lg">
                    <Users className="h-5 w-5 text-orange-600 dark:text-orange-400" />
                  </div>
                </div>
              </CardContent>
            </Card>
          </div>

          {/* Top Performing Links */}
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <TrendingUp size={18} />
                Top Performing Links
              </CardTitle>
            </CardHeader>
            <CardContent>
              {links.length === 0 ? (
                <div className="text-center py-8">
                  <ExternalLink className="mx-auto h-12 w-12 text-muted-foreground mb-4" />
                  <p className="text-muted-foreground">No links to analyze yet</p>
                </div>
              ) : (
                <div className="space-y-3">
                  {links
                    .sort((a, b) => b.click_count - a.click_count)
                    .slice(0, 5)
                    .map((link, index) => {
                      const config = platformConfigs[link.platform];
                      const clickRate = profile.view_count > 0 
                        ? ((link.click_count / profile.view_count) * 100).toFixed(1)
                        : '0.0';
                      
                      return (
                        <div key={link.id} className="flex items-center gap-4 p-4 border rounded-xl">
                          <div className="flex items-center gap-3 flex-1">
                            <Badge variant="secondary" className="w-8 h-8 rounded-full p-0 flex items-center justify-center">
                              #{index + 1}
                            </Badge>
                            <div className="text-xl">{config?.icon || '🔗'}</div>
                            <div className="flex-1 min-w-0">
                              <h4 className="font-medium truncate">{link.title}</h4>
                              <p className="text-sm text-muted-foreground truncate">{link.url}</p>
                            </div>
                          </div>
                          <div className="text-right">
                            <p className="font-semibold">{link.click_count} clicks</p>
                            <p className="text-xs text-muted-foreground">{clickRate}% CTR</p>
                          </div>
                        </div>
                      );
                    })}
                </div>
              )}
            </CardContent>
          </Card>

          {/* Profile Information */}
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Globe size={18} />
                Profile Status
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
                <div className="space-y-4">
                  <div className="flex items-center justify-between">
                    <span className="text-sm font-medium">Profile Status</span>
                    <Badge variant={profile.is_active ? "default" : "secondary"}>
                      {profile.is_active ? 'Active' : 'Inactive'}
                    </Badge>
                  </div>
                  <div className="flex items-center justify-between">
                    <span className="text-sm font-medium">Username</span>
                    <span className="text-sm text-muted-foreground">@{profile.username}</span>
                  </div>
                  <div className="flex items-center justify-between">
                    <span className="text-sm font-medium">Created</span>
                    <span className="text-sm text-muted-foreground">
                      {new Date(profile.created_at).toLocaleDateString()}
                    </span>
                  </div>
                </div>
                
                <div className="space-y-4">
                  <div className="flex items-center justify-between">
                    <span className="text-sm font-medium">Total Views</span>
                    <span className="text-sm font-semibold">{profile.view_count}</span>
                  </div>
                  <div className="flex items-center justify-between">
                    <span className="text-sm font-medium">Total Links</span>
                    <span className="text-sm font-semibold">{links.length}</span>
                  </div>
                  <div className="flex items-center justify-between">
                    <span className="text-sm font-medium">Total Clicks</span>
                    <span className="text-sm font-semibold">
                      {links.reduce((sum, link) => sum + link.click_count, 0)}
                    </span>
                  </div>
                </div>
              </div>
            </CardContent>
          </Card>
        </>
      )}
    </TabsContent>
  );
}
