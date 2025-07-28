"use client";

import React from "react";
import { TabsContent } from "@/components/ui/tabs";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { LinktreeProfile, LinktreeLink } from "@/interfaces/linktree";
import { Settings } from "lucide-react";

interface SettingsTabProps {
  profile: LinktreeProfile | null;
  links: LinktreeLink[];
}

export default function SettingsTab({ profile, links }: SettingsTabProps) {
  return (
    <TabsContent value="settings" className="space-y-6">
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Settings size={20} />
            Advanced Settings
          </CardTitle>
        </CardHeader>
        <CardContent className="space-y-6">
          <div className="space-y-4">
            <div>
              <h3 className="text-lg font-medium mb-2">Profile Status</h3>
              <p className="text-sm text-muted-foreground mb-4">
                Your profile is currently {profile?.is_active ? 'active' : 'inactive'}
              </p>
            </div>
            
            {profile && (
              <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 p-4 bg-muted/50 rounded-lg">
                <div className="text-center">
                  <div className="text-2xl font-bold text-primary">{profile.view_count}</div>
                  <div className="text-sm text-muted-foreground">Profile Views</div>
                </div>
                <div className="text-center">
                  <div className="text-2xl font-bold text-primary">{links.length}</div>
                  <div className="text-sm text-muted-foreground">Total Links</div>
                </div>
                <div className="text-center">
                  <div className="text-2xl font-bold text-primary">
                    {links.reduce((sum, link) => sum + link.click_count, 0)}
                  </div>
                  <div className="text-sm text-muted-foreground">Total Clicks</div>
                </div>
              </div>
            )}
          </div>
        </CardContent>
      </Card>
    </TabsContent>
  );
}
