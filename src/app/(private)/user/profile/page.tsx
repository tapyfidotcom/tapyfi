"use client";

import React, { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import FileUpload from "@/components/ui/file-upload";
import BackgroundSelector from "@/components/ui/background-selector";
import EnhancedProfilePicture from "@/components/ui/enhanced-profile-picture";
import PlatformSelector from "@/components/linktree/platform-selector";
import LinkForm from "@/components/linktree/link-form";
import DarkVeil from "@/components/backgrounds/DarkVeil/DarkVeil";
import Silk from "@/components/backgrounds/Silk/Silk";
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
import { platformConfigs } from "@/lib/platform-configs";
import toast from "react-hot-toast";
import { 
  Eye, 
  Plus, 
  Edit3, 
  Trash2, 
  ExternalLink,
  Check,
  X,
  Loader2,
  Copy,
  Share,
  Smartphone,
  Monitor,
  Settings,
  Palette,
  Link as LinkIcon,
  User,
  BarChart3,
  Globe
} from "lucide-react";

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
  const [previewMode, setPreviewMode] = useState<'mobile' | 'desktop'>('mobile');
  
  // Form states
  const [profileForm, setProfileForm] = useState({
    username: '',
    display_name: '',
    bio: '',
    profile_picture: '',
    company_logo: '',
    theme_color: '#10b981',
    background_color: '#ffffff',
    text_color: '#000000'
  });

  // Background state
  const [backgroundSettings, setBackgroundSettings] = useState({
    type: 'solid' as 'solid' | 'darkveil' | 'silk',
    color: '#ffffff',
    speed: 1,
    intensity: 1
  });

  const [usernameChecking, setUsernameChecking] = useState(false);
  const [usernameAvailable, setUsernameAvailable] = useState<boolean | null>(null);

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
        setProfileForm({
          username: response.data.username,
          display_name: response.data.display_name || '',
          bio: response.data.bio || '',
          profile_picture: response.data.profile_picture || '',
          company_logo: response.data.company_logo || '',
          theme_color: response.data.theme_color,
          background_color: response.data.background_color,
          text_color: response.data.text_color
        });
        setBackgroundSettings({
          type: 'solid',
          color: response.data.background_color,
          speed: 1,
          intensity: 1
        });
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
        background_color: backgroundSettings.color
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

  const copyToClipboard = async (text: string) => {
    try {
      await navigator.clipboard.writeText(text);
      toast.success("Copied to clipboard!");
    } catch (error) {
      toast.error("Failed to copy");
    }
  };

  const publicUrl = profile ? `${window.location.origin}/${profile.username}` : '';

  const renderBackgroundPreview = () => {
    if (backgroundSettings.type === 'solid') {
      return { backgroundColor: backgroundSettings.color };
    }
    return { backgroundColor: backgroundSettings.color };
  };

  const renderLiveBackground = () => {
    switch (backgroundSettings.type) {
      case 'darkveil':
        return (
          <div className="absolute inset-0 overflow-hidden">
            <DarkVeil
              hueShift={0}
              noiseIntensity={backgroundSettings.intensity || 0.1}
              speed={backgroundSettings.speed || 0.5}
            />
          </div>
        );
      case 'silk':
        return (
          <div className="absolute inset-0 overflow-hidden">
            <Silk
              color={backgroundSettings.color}
              speed={backgroundSettings.speed || 5}
              noiseIntensity={backgroundSettings.intensity || 1.5}
            />
          </div>
        );
      default:
        return null;
    }
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
        {/* Header */}
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

        {/* Public URL Display */}
        {profile && (
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
        )}

        <div className="grid grid-cols-1 xl:grid-cols-4 gap-6">
          {/* Main Content */}
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

              {/* Profile Tab */}
              <TabsContent value="profile" className="space-y-6">
                <Card>
                  <CardHeader>
                    <CardTitle className="flex items-center gap-2">
                      <User size={20} />
                      Basic Information
                    </CardTitle>
                  </CardHeader>
                  <CardContent className="space-y-6">
                    <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
                      {/* Left Column */}
                      <div className="space-y-4">
                        <div>
                          <Label htmlFor="username">Username *</Label>
                          <div className="flex items-center gap-2 mt-1">
                            <div className="flex items-center border rounded-lg overflow-hidden flex-1">
                              <span className="px-3 py-2 bg-muted text-muted-foreground text-sm border-r whitespace-nowrap">
                                tapyfi.com/
                              </span>
                              <Input
                                id="username"
                                placeholder="yourusername"
                                value={profileForm.username}
                                onChange={(e) => handleUsernameChange(e.target.value)}
                                className="border-0 focus:ring-0 flex-1"
                                required
                              />
                            </div>
                            <div className="flex items-center gap-1">
                              {usernameChecking && <Loader2 className="h-4 w-4 animate-spin" />}
                              {usernameAvailable === true && <Check className="h-4 w-4 text-green-500" />}
                              {usernameAvailable === false && <X className="h-4 w-4 text-red-500" />}
                            </div>
                          </div>
                          {usernameAvailable === false && (
                            <p className="text-sm text-destructive mt-1">Username is not available</p>
                          )}
                        </div>

                        <div>
                          <Label htmlFor="display_name">Display Name</Label>
                          <Input
                            id="display_name"
                            placeholder="Your Name or Business"
                            value={profileForm.display_name}
                            onChange={(e) => setProfileForm(prev => ({ ...prev, display_name: e.target.value }))}
                            className="mt-1"
                          />
                        </div>

                        <div>
                          <Label htmlFor="bio">Bio</Label>
                          <Textarea
                            id="bio"
                            placeholder="Tell people about yourself or your business..."
                            value={profileForm.bio}
                            onChange={(e) => setProfileForm(prev => ({ ...prev, bio: e.target.value }))}
                            className="mt-1 resize-none"
                            rows={4}
                          />
                        </div>
                      </div>

                      {/* Right Column */}
                      <div className="space-y-6">
                        <div className="text-center">
                          <Label className="block mb-4">Profile Pictures</Label>
                          <div className="flex justify-center mb-4">
                            <EnhancedProfilePicture
                              profilePicture={profileForm.profile_picture}
                              companyLogo={profileForm.company_logo}
                              size="xl"
                            />
                          </div>
                        </div>

                        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                          <div>
                            <Label className="block mb-2">Profile Picture</Label>
                            <FileUpload
                              bucket="profile-pictures"
                              currentImage={profileForm.profile_picture}
                              onImageChange={(url) => setProfileForm(prev => ({ ...prev, profile_picture: url }))}
                            />
                          </div>

                          <div>
                            <Label className="block mb-2">Company Logo</Label>
                            <FileUpload
                              bucket="company-logos"
                              currentImage={profileForm.company_logo}
                              onImageChange={(url) => setProfileForm(prev => ({ ...prev, company_logo: url }))}
                            />
                          </div>
                        </div>
                      </div>
                    </div>

                    <div className="flex flex-col sm:flex-row gap-3 pt-4 border-t">
                      <Button 
                        onClick={handleProfileSave}
                        disabled={!profileForm.username || usernameAvailable === false || saving}
                        className="w-full sm:w-auto"
                      >
                        {saving ? (
                          <>
                            <Loader2 size={16} className="mr-2 animate-spin" />
                            Saving...
                          </>
                        ) : (
                          profile ? 'Update Profile' : 'Create Profile'
                        )}
                      </Button>
                    </div>
                  </CardContent>
                </Card>
              </TabsContent>

              {/* Design Tab */}
              <TabsContent value="design" className="space-y-6">
                <Card>
                  <CardHeader>
                    <CardTitle className="flex items-center gap-2">
                      <Palette size={20} />
                      Design & Appearance
                    </CardTitle>
                  </CardHeader>
                  <CardContent className="space-y-6">
                    <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
                      <div className="space-y-4">
                        <BackgroundSelector
                          currentBackground={backgroundSettings}
                          onBackgroundChange={setBackgroundSettings}
                        />
                        
                        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                          <div>
                            <Label htmlFor="theme_color">Theme Color</Label>
                            <div className="flex items-center gap-2 mt-1">
                              <Input
                                id="theme_color"
                                type="color"
                                value={profileForm.theme_color}
                                onChange={(e) => setProfileForm(prev => ({ ...prev, theme_color: e.target.value }))}
                                className="w-12 h-10 p-0 border-0"
                              />
                              <Input
                                type="text"
                                value={profileForm.theme_color}
                                onChange={(e) => setProfileForm(prev => ({ ...prev, theme_color: e.target.value }))}
                                className="text-xs font-mono flex-1"
                              />
                            </div>
                          </div>
                          
                          <div>
                            <Label htmlFor="text_color">Text Color</Label>
                            <div className="flex items-center gap-2 mt-1">
                              <Input
                                id="text_color"
                                type="color"
                                value={profileForm.text_color}
                                onChange={(e) => setProfileForm(prev => ({ ...prev, text_color: e.target.value }))}
                                className="w-12 h-10 p-0 border-0"
                              />
                              <Input
                                type="text"
                                value={profileForm.text_color}
                                onChange={(e) => setProfileForm(prev => ({ ...prev, text_color: e.target.value }))}
                                className="text-xs font-mono flex-1"
                              />
                            </div>
                          </div>
                        </div>
                      </div>

                      <div className="space-y-4">
                        <Label>Preview</Label>
                        <div className="border rounded-lg overflow-hidden">
                          <div 
                            className="aspect-[9/16] max-w-[250px] mx-auto p-6 space-y-4 relative"
                            style={renderBackgroundPreview()}
                          >
                            {renderLiveBackground()}
                            <div className="relative z-10">
                              <div className="flex justify-center">
                                <EnhancedProfilePicture
                                  profilePicture={profileForm.profile_picture}
                                  companyLogo={profileForm.company_logo}
                                  size="md"
                                />
                              </div>
                              
                              <div className="text-center" style={{ color: profileForm.text_color }}>
                                <h3 className="font-bold text-lg">
                                  {profileForm.display_name || `@${profileForm.username}`}
                                </h3>
                                {profileForm.bio && (
                                  <p className="text-sm opacity-80 mt-1 line-clamp-2">
                                    {profileForm.bio}
                                  </p>
                                )}
                              </div>

                              <div className="space-y-2">
                                {links.slice(0, 3).map((link) => {
                                  const config = platformConfigs[link.platform];
                                  return (
                                    <div
                                      key={link.id}
                                      className="text-sm p-3 rounded-lg flex items-center justify-center gap-2 font-medium"
                                      style={{ 
                                        backgroundColor: profileForm.theme_color, 
                                        color: '#ffffff' 
                                      }}
                                    >
                                      <span>{config?.icon || '🔗'}</span>
                                      <span className="truncate">{link.title}</span>
                                    </div>
                                  );
                                })}
                                {links.length > 3 && (
                                  <div className="text-xs text-center opacity-60" style={{ color: profileForm.text_color }}>
                                    +{links.length - 3} more links
                                  </div>
                                )}
                              </div>
                            </div>
                          </div>
                        </div>
                      </div>
                    </div>
                  </CardContent>
                </Card>
              </TabsContent>

              {/* Links Tab */}
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

              {/* Settings Tab */}
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
            </Tabs>
          </div>

          {/* Mobile Preview Sidebar */}
          <div className="xl:col-span-1">
            {profile && (
              <div className="sticky top-6">
                <Card className="overflow-hidden">
                  <CardHeader className="pb-4">
                    <div className="flex items-center justify-between">
                      <CardTitle className="text-lg flex items-center gap-2">
                        <Smartphone size={16} />
                        Live Preview
                      </CardTitle>
                      <div className="flex items-center gap-1">
                        <Button 
                          variant={previewMode === 'mobile' ? 'default' : 'ghost'} 
                          size="sm" 
                          className="p-1"
                          onClick={() => setPreviewMode('mobile')}
                        >
                          <Smartphone size={14} />
                        </Button>
                        <Button 
                          variant={previewMode === 'desktop' ? 'default' : 'ghost'}
                          size="sm" 
                          className="p-1"
                          onClick={() => setPreviewMode('desktop')}
                        >
                          <Monitor size={14} />
                        </Button>
                      </div>
                    </div>
                  </CardHeader>
                  <CardContent className="p-0">
                    <div className="mx-auto bg-gray-100 dark:bg-gray-800 rounded-lg p-2">
                      <div 
                        className={`relative overflow-hidden rounded-lg border-2 border-gray-300 dark:border-gray-600 ${
                          previewMode === 'mobile' ? 'aspect-[9/16] max-w-[280px]' : 'aspect-[16/10] w-full max-w-[400px]'
                        } mx-auto`}
                        style={renderBackgroundPreview()}
                      >
                        {renderLiveBackground()}
                        
                        <div className="relative z-10 h-full overflow-y-auto">
                          <div className={`p-6 space-y-6 ${previewMode === 'desktop' ? 'flex flex-col items-center justify-center h-full' : ''}`}>
                            {/* Profile Section */}
                            <div className="text-center space-y-4">
                              <div className="flex justify-center">
                                <EnhancedProfilePicture
                                  profilePicture={profileForm.profile_picture}
                                  companyLogo={profileForm.company_logo}
                                  size={previewMode === 'mobile' ? 'lg' : 'xl'}
                                />
                              </div>
                              
                              <div style={{ color: profileForm.text_color }}>
                                <h3 className={`font-bold ${previewMode === 'mobile' ? 'text-xl' : 'text-2xl'}`}>
                                  {profileForm.display_name || `@${profileForm.username}`}
                                </h3>
                                {profileForm.bio && (
                                  <p className={`opacity-80 mt-2 ${previewMode === 'mobile' ? 'text-sm' : 'text-base'} ${previewMode === 'mobile' ? 'line-clamp-3' : ''}`}>
                                    {profileForm.bio}
                                  </p>
                                )}
                              </div>
                            </div>

                            {/* Links Section */}
                            <div className={`space-y-3 w-full ${previewMode === 'desktop' ? 'max-w-md' : ''}`}>
                              {links.slice(0, previewMode === 'mobile' ? 5 : 6).map((link) => {
                                const config = platformConfigs[link.platform];
                                return (
                                  <div
                                    key={link.id}
                                    className={`${previewMode === 'mobile' ? 'text-sm p-3' : 'text-base p-4'} rounded-xl flex items-center justify-center gap-3 font-medium transition-all duration-200 hover:scale-[1.02] cursor-pointer`}
                                    style={{ 
                                      backgroundColor: profileForm.theme_color, 
                                      color: '#ffffff' 
                                    }}
                                  >
                                    <span className={previewMode === 'mobile' ? 'text-lg' : 'text-xl'}>
                                      {config?.icon || '🔗'}
                                    </span>
                                    <span className="truncate">{link.title}</span>
                                    <ExternalLink size={previewMode === 'mobile' ? 14 : 16} className="opacity-60" />
                                  </div>
                                );
                              })}
                              {links.length > (previewMode === 'mobile' ? 5 : 6) && (
                                <div className="text-center text-xs opacity-60" style={{ color: profileForm.text_color }}>
                                  +{links.length - (previewMode === 'mobile' ? 5 : 6)} more links
                                </div>
                              )}
                            </div>

                            {/* Footer */}
                            <div className="text-center pt-4">
                              <div className="flex items-center justify-center gap-2 text-xs opacity-60" style={{ color: profileForm.text_color }}>
                                <Eye size={12} />
                                <span>{profile.view_count} views</span>
                              </div>
                              <p className="text-xs opacity-40 mt-1" style={{ color: profileForm.text_color }}>
                                Powered by TapyFi
                              </p>
                            </div>
                          </div>
                        </div>
                      </div>
                    </div>

                    {/* Stats Section */}
                    <div className="p-4 space-y-3">
                      <div className="flex items-center justify-between text-sm">
                        <span className="text-muted-foreground">Quick Stats</span>
                        <Button variant="ghost" size="sm" className="h-6 px-2">
                          <BarChart3 size={12} />
                        </Button>
                      </div>
                      <div className="grid grid-cols-2 gap-3 text-center">
                        <div className="p-2 bg-muted/50 rounded-lg">
                          <div className="text-lg font-bold text-primary">{links.length}</div>
                          <div className="text-xs text-muted-foreground">Links</div>
                        </div>
                        <div className="p-2 bg-muted/50 rounded-lg">
                          <div className="text-lg font-bold text-primary">
                            {links.reduce((sum, link) => sum + link.click_count, 0)}
                          </div>
                          <div className="text-xs text-muted-foreground">Clicks</div>
                        </div>
                      </div>
                    </div>
                  </CardContent>
                </Card>
              </div>
            )}
          </div>
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
