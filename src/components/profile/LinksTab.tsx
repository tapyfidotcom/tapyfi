"use client";

import React from "react";
import { TabsContent } from "@/components/ui/tabs";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { LinktreeProfile, LinktreeLink } from "@/interfaces/linktree";
import { platformConfigs } from "@/lib/platform-configs";
import { Link as LinkIcon, Plus, Edit3, Trash2 } from "lucide-react";

interface LinksTabProps {
  profile: LinktreeProfile | null;
  links: LinktreeLink[];
  setShowPlatformSelector: (show: boolean) => void;
  handleEditLink: (link: LinktreeLink) => void;
  handleDeleteLink: (linkId: number) => void;
}

export default function LinksTab({
  profile,
  links,
  setShowPlatformSelector,
  handleEditLink,
  handleDeleteLink
}: LinksTabProps) {
  return (
    <TabsContent value="links" className="space-y-6">
      {profile && (
        <Card>
          <CardHeader>
            <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
              <CardTitle className="flex items-center gap-2">
                <LinkIcon size={20} />
                Manage Links
              </CardTitle>
              <Button onClick={() => setShowPlatformSelector(true)} size="sm" className="w-full sm:w-auto">
                <Plus size={16} className="mr-2" />
                Add Link
              </Button>
            </div>
          </CardHeader>
          <CardContent>
            {links.length === 0 ? (
              <div className="text-center py-12">
                <LinkIcon className="mx-auto h-12 w-12 text-muted-foreground mb-4" />
                <h3 className="text-lg font-medium text-muted-foreground mb-2">No links added yet</h3>
                <p className="text-sm text-muted-foreground mb-4">Start building your link collection</p>
                <Button onClick={() => setShowPlatformSelector(true)} className="w-full sm:w-auto">
                  <Plus size={16} className="mr-2" />
                  Add Your First Link
                </Button>
              </div>
            ) : (
              <div className="space-y-3">
                {links
                  .sort((a, b) => a.display_order - b.display_order)
                  .map((link) => {
                    const config = platformConfigs[link.platform];
                    return (
                      <div
                        key={link.id}
                        className="flex items-center gap-4 p-4 border rounded-lg hover:bg-accent/50 transition-colors"
                      >
                        <div className="text-2xl flex-shrink-0">{config?.icon || '🔗'}</div>
                        <div className="flex-1 min-w-0">
                          <h3 className="font-medium truncate">{link.title}</h3>
                          <p className="text-sm text-muted-foreground truncate">
                            {link.url}
                          </p>
                          <p className="text-xs text-muted-foreground">
                            {link.click_count} clicks
                          </p>
                        </div>
                        <div className="flex items-center gap-2 flex-shrink-0">
                          <Button
                            variant="ghost"
                            size="sm"
                            onClick={() => handleEditLink(link)}
                          >
                            <Edit3 size={16} />
                          </Button>
                          <Button
                            variant="ghost"
                            size="sm"
                            onClick={() => handleDeleteLink(link.id)}
                            className="text-destructive hover:text-destructive"
                          >
                            <Trash2 size={16} />
                          </Button>
                        </div>
                      </div>
                    );
                  })}
              </div>
            )}
          </CardContent>
        </Card>
      )}
    </TabsContent>
  );
}
