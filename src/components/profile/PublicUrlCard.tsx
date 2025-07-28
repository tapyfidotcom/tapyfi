"use client";

import React from "react";
import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { LinktreeProfile } from "@/interfaces/linktree";
import { Link as LinkIcon, Copy } from "lucide-react";
import toast from "react-hot-toast";

interface ProfileURLCardProps {
  profile: LinktreeProfile | null;
}

export default function ProfileURLCard({ profile }: ProfileURLCardProps) {
  const copyToClipboard = async (text: string) => {
    try {
      await navigator.clipboard.writeText(text);
      toast.success("Copied to clipboard!");
    } catch (error) {
      toast.error("Failed to copy");
    }
  };

  const publicUrl = profile ? `${window.location.origin}/${profile.username}` : '';

  if (!profile) return null;

  return (
    <Card className="border-primary/20 bg-gradient-to-r from-primary/5 to-primary/10">
      <CardContent className="p-4">
        <div className="flex flex-col sm:flex-row items-start sm:items-center gap-3">
          <div className="flex items-center gap-2 text-sm font-medium">
            <LinkIcon size={16} className="text-primary" />
            <span>Your public URL:</span>
          </div>
          <div className="flex items-center gap-2 flex-1 min-w-0 w-full sm:w-auto">
            <code className="bg-background px-3 py-1.5 rounded-md text-primary font-mono text-sm border flex-1 min-w-0 truncate">
              {publicUrl}
            </code>
            <Button
              variant="ghost"
              size="sm"
              onClick={() => copyToClipboard(publicUrl)}
            >
              <Copy size={14} />
            </Button>
          </div>
        </div>
      </CardContent>
    </Card>
  );
}
