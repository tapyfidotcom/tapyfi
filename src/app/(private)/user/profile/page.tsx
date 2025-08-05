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
import AnalyticsTab from "@/components/profile/AnalyticsTab";
import PreviewSidebar from "@/components/profile/PreviewSidebar";
import MobilePreview from "@/components/profile/MobilePreview";
import BottomNavigation from "@/components/ui/bottom-navigation";
import MobileSheet from "@/components/ui/mobile-sheet";
import ResponsiveLayout from "@/components/ui/responsive-layout";
import PlatformSelector from "@/components/linktree/platform-selector";
import MobilePlatformSelector from "@/components/linktree/MobilePlatformSelector";
import MobileLinkForm from "@/components/linktree/MobileLinkForm";
import LinkForm from "@/components/linktree/link-form";
import { useProfileForm } from "@/hooks/useProfileForm";
import { getPrimaryBackgroundColor } from "@/types/profile";
import {
  getUserLinktreeProfile,
  createLinktreeProfile,
  updateLinktreeProfile,
  addLinktreeLink,
  updateLinktreeLink,
  deleteLinktreeLink,
  checkUsernameAvailability,
} from "@/actions/linktree";
import {
  LinktreeProfile,
  LinktreeLink,
  CreateLinktreeLink,
} from "@/interfaces/linktree";
import toast from "react-hot-toast";
import {
  Loader2,
  User,
  Palette,
  Link as LinkIcon,
  BarChart3,
} from "lucide-react";

export default function ProfilePage() {
  const router = useRouter();
  const [profile, setProfile] = useState<LinktreeProfile | null>(null);
  const [links, setLinks] = useState<LinktreeLink[]>([]);
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);

  // Existing modal states for desktop
  const [showPlatformSelector, setShowPlatformSelector] = useState(false);
  const [showLinkForm, setShowLinkForm] = useState(false);

  const [selectedPlatform, setSelectedPlatform] = useState("");
  const [editingLink, setEditingLink] = useState<LinktreeLink | null>(null);
  const [activeTab, setActiveTab] = useState("profile");
  const [usernameChecking, setUsernameChecking] = useState(false);
  const [usernameAvailable, setUsernameAvailable] = useState<boolean | null>(
    null
  );

  // Mobile sheet states
  const [mobileSheetOpen, setMobileSheetOpen] = useState(false);
  const [mobileSheetContent, setMobileSheetContent] = useState<
    "tabs" | "platform-selector" | "link-form"
  >("tabs");

  const {
    profileForm,
    setProfileForm,
    backgroundSettings,
    setBackgroundSettings,
  } = useProfileForm(profile);

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

  // ... existing functions (checkUsername, handleProfileSave, etc.)

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
    setProfileForm((prev) => ({ ...prev, username }));

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
        background_color: getPrimaryBackgroundColor(backgroundSettings.color),
        background_settings: JSON.stringify(backgroundSettings),
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

  // Modified to work with mobile sheet
  const handleShowPlatformSelector = () => {
    // Check if mobile view using window width or CSS media query
    const isMobile = window.innerWidth < 1024; // lg breakpoint

    if (isMobile) {
      setMobileSheetContent("platform-selector");
      setMobileSheetOpen(true);
    } else {
      setShowPlatformSelector(true);
    }
  };

  const handleAddLink = (platform: string) => {
    setSelectedPlatform(platform);

    const isMobile = window.innerWidth < 1024;

    if (isMobile) {
      setMobileSheetContent("link-form");
      setEditingLink(null);
    } else {
      setShowPlatformSelector(false);
      setShowLinkForm(true);
    }
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
      // Close mobile sheet if on mobile
      const isMobile = window.innerWidth < 1024;
      if (isMobile) {
        setMobileSheetContent("tabs");
        setMobileSheetOpen(false);
      } else {
        setShowLinkForm(false);
      }
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

    const isMobile = window.innerWidth < 1024;

    if (isMobile) {
      setMobileSheetContent("link-form");
      setMobileSheetOpen(true);
    } else {
      setShowLinkForm(true);
    }
  };

  const handleTabSelect = (tab: string) => {
    setActiveTab(tab);
    setMobileSheetContent("tabs");
    setMobileSheetOpen(true);
  };

  const handleCloseMobileSheet = () => {
    setMobileSheetOpen(false);
    setMobileSheetContent("tabs");
    setEditingLink(null);
    setSelectedPlatform("");
  };

  if (loading) {
    return (
      <div className="flex items-center justify-center min-h-[50vh]">
        <Loader2 className="h-8 w-8 animate-spin" />
      </div>
    );
  }

  return (
    <ResponsiveLayout>
      {/* Mobile Layout */}
      <div className="lg:hidden">
        <div className="space-y-3 pb-20 px-2">
          {/* Conditionally hide ProfileHeader and PublicUrlCard when sheet is open */}
          {!mobileSheetOpen && (
            <>
              <ProfileHeader profile={profile} router={router} />
              <ProfileURLCard profile={profile} />
            </>
          )}

          {/* Mobile Preview - Always visible */}
          <MobilePreview
            profile={profile}
            profileForm={profileForm}
            backgroundSettings={backgroundSettings}
            links={links}
          />
        </div>

        {/* Bottom Navigation for Mobile */}
        <BottomNavigation activeTab={activeTab} onTabSelect={handleTabSelect} />

        {/* Mobile Sheet with Dynamic Content */}
        <MobileSheet
          open={mobileSheetOpen}
          onOpenChange={setMobileSheetOpen}
          activeTab={activeTab}
          onTabChange={setActiveTab}
        >
          {mobileSheetContent === "tabs" && (
            <div className="space-y-3">
              <Tabs
                value={activeTab}
                onValueChange={setActiveTab}
                className="w-full"
              >
                <TabsContent value="profile" className="mt-0 space-y-3">
                  <ProfileTab
                    profileForm={profileForm}
                    setProfileForm={setProfileForm}
                    usernameChecking={usernameChecking}
                    usernameAvailable={usernameAvailable}
                    handleProfileSave={handleProfileSave}
                    saving={saving}
                    profile={profile}
                    handleUsernameChange={handleUsernameChange}
                  />
                </TabsContent>

                <TabsContent value="design" className="mt-0 space-y-3">
                  <DesignTab
                    backgroundSettings={backgroundSettings}
                    setBackgroundSettings={setBackgroundSettings}
                    profileForm={profileForm}
                    setProfileForm={setProfileForm}
                    links={links}
                    profile={profile}
                    onSaveBackground={handleProfileSave}
                  />
                </TabsContent>

                <TabsContent value="links" className="mt-0 space-y-3">
                  <LinksTab
                    profile={profile}
                    links={links}
                    setShowPlatformSelector={handleShowPlatformSelector}
                    handleEditLink={handleEditLink}
                    handleDeleteLink={handleDeleteLink}
                  />
                </TabsContent>

                <TabsContent value="analytics" className="mt-0 space-y-3">
                  <AnalyticsTab profile={profile} links={links} />
                </TabsContent>
              </Tabs>
            </div>
          )}

          {/* Platform Selector inside Mobile Sheet */}
          {mobileSheetContent === "platform-selector" && (
            <div className="h-full">
              <MobilePlatformSelector
                onSelect={handleAddLink}
                onClose={handleCloseMobileSheet}
              />
            </div>
          )}

          {/* Link Form inside Mobile Sheet */}
          {mobileSheetContent === "link-form" && (
            <div className="h-full">
              <MobileLinkForm
                platform={selectedPlatform}
                initialData={editingLink || undefined}
                onSave={handleSaveLink}
                onCancel={handleCloseMobileSheet}
                isEditing={!!editingLink}
              />
            </div>
          )}
        </MobileSheet>
      </div>

      {/* Desktop Layout (unchanged) - Keep existing modals */}
      <div className="hidden lg:block">
        <div className="w-full max-w-none mx-auto px-2 sm:px-4 lg:px-6 xl:px-8 2xl:px-12 space-y-4 lg:space-y-6">
          <ProfileHeader profile={profile} router={router} />
          <ProfileURLCard profile={profile} />

          <div className="grid grid-cols-1 lg:grid-cols-12 gap-4 lg:gap-6">
            <div className="lg:col-span-8 space-y-4 lg:space-y-6">
              <Tabs
                value={activeTab}
                onValueChange={setActiveTab}
                className="w-full"
              >
                <TabsList className="grid w-full grid-cols-4 mb-4 lg:mb-6">
                  <TabsTrigger
                    value="profile"
                    className="flex items-center gap-1 lg:gap-2 text-xs sm:text-sm"
                  >
                    <User size={14} className="lg:w-4 lg:h-4" />
                    <span className="hidden sm:inline">Profile</span>
                  </TabsTrigger>
                  <TabsTrigger
                    value="design"
                    className="flex items-center gap-1 lg:gap-2 text-xs sm:text-sm"
                  >
                    <Palette size={14} className="lg:w-4 lg:h-4" />
                    <span className="hidden sm:inline">Design</span>
                  </TabsTrigger>
                  <TabsTrigger
                    value="links"
                    className="flex items-center gap-1 lg:gap-2 text-xs sm:text-sm"
                  >
                    <LinkIcon size={14} className="lg:w-4 lg:h-4" />
                    <span className="hidden sm:inline">Links</span>
                  </TabsTrigger>
                  <TabsTrigger
                    value="analytics"
                    className="flex items-center gap-1 lg:gap-2 text-xs sm:text-sm"
                  >
                    <BarChart3 size={14} className="lg:w-4 lg:h-4" />
                    <span className="hidden sm:inline">Analytics</span>
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
                  handleUsernameChange={handleUsernameChange}
                />

                <DesignTab
                  backgroundSettings={backgroundSettings}
                  setBackgroundSettings={setBackgroundSettings}
                  profileForm={profileForm}
                  setProfileForm={setProfileForm}
                  links={links}
                  profile={profile}
                  onSaveBackground={handleProfileSave}
                />

                <LinksTab
                  profile={profile}
                  links={links}
                  setShowPlatformSelector={handleShowPlatformSelector}
                  handleEditLink={handleEditLink}
                  handleDeleteLink={handleDeleteLink}
                />

                <AnalyticsTab profile={profile} links={links} />
              </Tabs>
            </div>

            <div className="lg:col-span-4">
              <PreviewSidebar
                profile={profile}
                profileForm={profileForm}
                backgroundSettings={backgroundSettings}
                links={links}
              />
            </div>
          </div>
        </div>
      </div>

      {/* Desktop Modals (only show on desktop) */}
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
    </ResponsiveLayout>
  );
}
