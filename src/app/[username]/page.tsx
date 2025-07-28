import React from "react";
import { notFound } from "next/navigation";
import { getPublicLinktreeProfile } from "@/actions/linktree";
import PublicLinktree from "@/components/linktree/public-linktree";

interface PublicPageProps {
  params: Promise<{
    username: string;
  }>;
}

export default async function PublicLinktreePage({ params }: PublicPageProps) {
  // Await the params in Next.js 15
  const { username } = await params;
  
  const response = await getPublicLinktreeProfile(username);
  
  if (!response.success || !response.data) {
    notFound();
  }

  return <PublicLinktree profile={response.data} />;
}

export async function generateMetadata({ params }: PublicPageProps) {
  // Await the params in generateMetadata as well
  const { username } = await params;
  const response = await getPublicLinktreeProfile(username);
  
  if (!response.success || !response.data) {
    return {
      title: 'Profile Not Found - TapyFi',
    };
  }

  const profile = response.data;
  
  return {
    title: `${profile.display_name || profile.username} - TapyFi`,
    description: profile.bio || `${profile.display_name || profile.username}'s links`,
    openGraph: {
      title: `${profile.display_name || profile.username} - TapyFi`,
      description: profile.bio || `${profile.display_name || profile.username}'s links`,
      images: profile.profile_picture ? [profile.profile_picture] : [],
    },
  };
}
