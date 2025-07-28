"use client";

import React from "react";
import { TabsContent } from "@/components/ui/tabs";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import FileUpload from "@/components/ui/file-upload";
import EnhancedProfilePicture from "@/components/ui/enhanced-profile-picture";
import { LinktreeProfile } from "@/interfaces/linktree";
import { ProfileFormData } from "@/types/profile";
import { User, Check, X, Loader2 } from "lucide-react";

interface ProfileTabProps {
  profileForm: ProfileFormData;
  setProfileForm: (form: ProfileFormData | ((prev: ProfileFormData) => ProfileFormData)) => void;
  usernameChecking: boolean;
  usernameAvailable: boolean | null;
  handleProfileSave: () => void;
  saving: boolean;
  profile: LinktreeProfile | null;
  handleUsernameChange: (username: string) => void;
}

export default function ProfileTab({
  profileForm,
  setProfileForm,
  usernameChecking,
  usernameAvailable,
  handleProfileSave,
  saving,
  profile,
  handleUsernameChange
}: ProfileTabProps) {
  return (
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
                  onChange={(e) => setProfileForm((prev: ProfileFormData) => ({ ...prev, display_name: e.target.value }))}
                  className="mt-1"
                />
              </div>

              <div>
                <Label htmlFor="bio">Bio</Label>
                <Textarea
                  id="bio"
                  placeholder="Tell people about yourself or your business..."
                  value={profileForm.bio}
                  onChange={(e) => setProfileForm((prev: ProfileFormData) => ({ ...prev, bio: e.target.value }))}
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
                    onImageChange={(url) => setProfileForm((prev: ProfileFormData) => ({ ...prev, profile_picture: url }))}
                  />
                </div>

                <div>
                  <Label className="block mb-2">Company Logo</Label>
                  <FileUpload
                    bucket="company-logos"
                    currentImage={profileForm.company_logo}
                    onImageChange={(url) => setProfileForm((prev: ProfileFormData) => ({ ...prev, company_logo: url }))}
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
  );
}
