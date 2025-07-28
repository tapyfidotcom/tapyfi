"use client";

import React from "react";
import { Button } from "@/components/ui/button";
import { LinktreeProfile } from "@/interfaces/linktree";
import { Copy, ExternalLink } from "lucide-react";
import toast from "react-hot-toast";

interface ProfileHeaderProps {
  profile: LinktreeProfile | null;
  router: any;
}

export default function ProfileHeader({ profile, router }: ProfileHeaderProps) {
  const copyToClipboard = async (text: string) => {
    try {
      await navigator.clipboard.writeText(text);
      toast.success("Copied to clipboard!");
    } catch (error) {
      toast.error("Failed to copy");
    }
  };

  const publicUrl = profile ? `${window.location.origin}/${profile.username}` : '';

  return (
    <div className="flex flex-col lg:flex-row items-start lg:items-center justify-between gap-4 bg-card rounded-xl p-6 shadow-sm border">
      <div className="space-y-1">
        <h1 className="text-2xl lg:text-3xl font-bold bg-gradient-to-r from-primary to-primary/60 bg-clip-text text-transparent">
          Profile Management
        </h1>
        <p className="text-muted-foreground">Create and manage your personalized link-in-bio page</p>
      </div>
      
      {profile && (
        <div className="flex flex-wrap gap-2">
          <Button 
            variant="outline" 
            size="sm"
            onClick={() => copyToClipboard(publicUrl)}
            className="flex items-center gap-2"
          >
            <Copy size={14} />
            <span className="hidden sm:inline">Copy Link</span>
          </Button>
          <Button 
            onClick={() => router.push(`/${profile.username}`)}
            size="sm"
            className="flex items-center gap-2"
          >
            <ExternalLink size={14} />
            <span className="hidden sm:inline">View Live</span>
          </Button>
        </div>
      )}
    </div>
  );
}
