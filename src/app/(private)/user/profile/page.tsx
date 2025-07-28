"use client";

import React, { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Button } from "@/components/ui/button";
import ProfileHeader from "@/components/profile/ProfileHeader";
import ProfileURLCard from "@/components/profile/PublicUrlCard";
import ProfileTab from "@/components/profile/ProfileTabs";
import DesignTab from "@/components/profile/DesignTab";
import LinksTab from "@/components/profile/LinksTab";
import SettingsTab from "@/components/profile/SettingsTab";
import PreviewSidebar from "@/components/profile/PreviewSidebar";
import PlatformSelector from "@/components/linktree/platform-selector";
import LinkForm from "@/components/linktree/link-form";
import { useProfileForm } from "@/hooks/useProfileForm";
import { 
  getUserLinktreeProfile, 
  createLinktreeProfile, 
  updateLinktreeProfile,
  addLinktreeLink,
  updateLinktreeLink,
  deleteLinktreeLink,
  checkUsernameAvailability
} from "@/actions/linktree";
import { LinktreeProfile, LinktreeLink, CreateLinktreeLink } from "@/interfaces/linktree";
import toast from "react-hot-toast";
import { Loader2, User, Palette, Link as LinkIcon, Settings } from "lucide-react";

export default function ProfilePage() {
  const router = useRouter();
  const [profile, setProfile] = useState<LinktreeProfile | null>(null);
  const [links, setLinks] = useState<LinktreeLink[]>([]);
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [showPlatformSelector, setShowPlatformSelector] = useState(false);
  const [showLinkForm, setShowLinkForm] = useState(false);
  const [selectedPlatform, setSelectedPlatform] = useState("");
  const [editingLink, setEditingLink] = useState<LinktreeLink | null>(null);
  const [activeTab, setActiveTab] = useState("profile");
  const [usernameChecking, setUsernameChecking] = useState(false);
  const [usernameAvailable, setUsernameAvailable] = useState<boolean | null>(null);

  const { profileForm, setProfileForm, backgroundSettings, setBackgroundSettings } = useProfileForm(profile);

  useEffect(() => {
    loadProfile();
  }, []);

  const loadProfile = async () => {
    try {
      setLoading(true);
      const response = await getUserLinktreeProfile();
      
      if (response.success && response.data) {
        setProfile(response.data);
        setLinks(response.data.linktree_links || []);
        setUsernameAvailable(true);
      }
    } catch (error) {
      toast.error("Failed to load profile");
    } finally {
      setLoading(false);
    }
  };

  const checkUsername = async (username: string) => {
    if (!username || username.length < 3) {
      setUsernameAvailable(null);
      return;
    }

    setUsernameChecking(true);
    try {
      const response = await checkUsernameAvailability(username);
      setUsernameAvailable(response.success);
    } catch (error) {
      setUsernameAvailable(null);
    } finally {
      setUsernameChecking(false);
    }
  };

  const handleUsernameChange = (username: string) => {
    setProfileForm(prev => ({ ...prev, username }));
    
    const timeoutId = setTimeout(() => {
      if (profile?.username !== username) {
        checkUsername(username);
      } else {
        setUsernameAvailable(true);
      }
    }, 500);

    return () => clearTimeout(timeoutId);
  };

  const handleProfileSave = async () => {
    try {
      setSaving(true);
      const formDataWithBackground = {
        ...profileForm,
        background_color: backgroundSettings.color,
        background_settings: JSON.stringify(backgroundSettings)
      };

      if (!profile) {
        const response = await createLinktreeProfile(formDataWithBackground);
        if (response.success) {
          toast.success("Profile created successfully!");
          loadProfile();
        } else {
          toast.error(response.message);
        }
      } else {
        const response = await updateLinktreeProfile(formDataWithBackground);
        if (response.success) {
          toast.success("Profile updated successfully!");
          loadProfile();
        } else {
          toast.error(response.message);
        }
      }
    } catch (error) {
      toast.error("Failed to save profile");
    } finally {
      setSaving(false);
    }
  };

  const handleAddLink = (platform: string) => {
    setSelectedPlatform(platform);
    setShowPlatformSelector(false);
    setShowLinkForm(true);
  };

  const handleSaveLink = async (linkData: CreateLinktreeLink) => {
    try {
      if (editingLink) {
        const response = await updateLinktreeLink(editingLink.id, linkData);
        if (response.success) {
          toast.success("Link updated successfully!");
          loadProfile();
        } else {
          toast.error(response.message);
        }
      } else {
        const response = await addLinktreeLink(linkData);
        if (response.success) {
          toast.success("Link added successfully!");
          loadProfile();
        } else {
          toast.error(response.message);
        }
      }
    } catch (error) {
      toast.error("Failed to save link");
    } finally {
      setShowLinkForm(false);
      setEditingLink(null);
      setSelectedPlatform("");
    }
  };

  const handleDeleteLink = async (linkId: number) => {
    if (!confirm("Are you sure you want to delete this link?")) return;
    
    try {
      const response = await deleteLinktreeLink(linkId);
      if (response.success) {
        toast.success("Link deleted successfully!");
        loadProfile();
      } else {
        toast.error(response.message);
      }
    } catch (error) {
      toast.error("Failed to delete link");
    }
  };

  const handleEditLink = (link: LinktreeLink) => {
    setEditingLink(link);
    setSelectedPlatform(link.platform);
    setShowLinkForm(true);
  };

  if (loading) {
    return (
      <div className="flex items-center justify-center min-h-[50vh]">
        <Loader2 className="h-8 w-8 animate-spin" />
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-background via-background to-muted/20">
      <div className="max-w-7xl mx-auto p-4 lg:p-6 space-y-6">
        <ProfileHeader profile={profile} router={router} />
        <ProfileURLCard profile={profile} />

        <div className="grid grid-cols-1 xl:grid-cols-4 gap-6">
          <div className="xl:col-span-3 space-y-6">
            <Tabs value={activeTab} onValueChange={setActiveTab} className="w-full">
              <TabsList className="grid w-full grid-cols-4 mb-6">
                <TabsTrigger value="profile" className="flex items-center gap-2 text-xs sm:text-sm">
                  <User size={16} />
                  <span className="hidden sm:inline">Profile</span>
                </TabsTrigger>
                <TabsTrigger value="design" className="flex items-center gap-2 text-xs sm:text-sm">
                  <Palette size={16} />
                  <span className="hidden sm:inline">Design</span>
                </TabsTrigger>
                <TabsTrigger value="links" className="flex items-center gap-2 text-xs sm:text-sm">
                  <LinkIcon size={16} />
                  <span className="hidden sm:inline">Links</span>
                </TabsTrigger>
                <TabsTrigger value="settings" className="flex items-center gap-2 text-xs sm:text-sm">
                  <Settings size={16} />
                  <span className="hidden sm:inline">Settings</span>
                </TabsTrigger>
              </TabsList>

              <ProfileTab 
                profileForm={profileForm}
                setProfileForm={setProfileForm}
                usernameChecking={usernameChecking}
                usernameAvailable={usernameAvailable}
                handleProfileSave={handleProfileSave}
                saving={saving}
                profile={profile}
                handleUsernameChange={handleUsernameChange} // Added this missing prop
              />

              <DesignTab 
                backgroundSettings={backgroundSettings}
                setBackgroundSettings={setBackgroundSettings}
                profileForm={profileForm}
                setProfileForm={setProfileForm}
                links={links}
                onSaveBackground={handleProfileSave} // Add this line
              />

              <LinksTab 
                profile={profile}
                links={links}
                setShowPlatformSelector={setShowPlatformSelector}
                handleEditLink={handleEditLink}
                handleDeleteLink={handleDeleteLink}
              />

              <SettingsTab profile={profile} links={links} />
            </Tabs>
          </div>

          <PreviewSidebar 
            profile={profile}
            profileForm={profileForm}
            backgroundSettings={backgroundSettings}
            links={links}
          />
        </div>

        {/* Modals */}
        {showPlatformSelector && (
          <PlatformSelector
            onSelect={handleAddLink}
            onClose={() => setShowPlatformSelector(false)}
          />
        )}

        {showLinkForm && (
          <LinkForm
            platform={selectedPlatform}
            initialData={editingLink || undefined}
            onSave={handleSaveLink}
            onCancel={() => {
              setShowLinkForm(false);
              setEditingLink(null);
              setSelectedPlatform("");
            }}
            isEditing={!!editingLink}
          />
        )}
      </div>
    </div>
  );
}
