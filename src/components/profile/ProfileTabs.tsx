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
import { User, Check, X, Loader2, Link } from "lucide-react";

interface ProfileTabProps {
  profileForm: ProfileFormData;
  setProfileForm: (
    form: ProfileFormData | ((prev: ProfileFormData) => ProfileFormData)
  ) => void;
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
  handleUsernameChange,
}: ProfileTabProps) {
  return (
    <TabsContent value="profile" className="space-y-3">
      {/* Mobile-optimized transparent card */}
      <Card className="bg-white/60 dark:bg-gray-900/60 backdrop-blur-lg border-white/20 dark:border-gray-700/30 shadow-lg">
        <CardHeader className="pb-3">
          <CardTitle className="flex items-center gap-2 text-sm lg:text-base">
            <User size={16} className="lg:size-5" />
            <span className="text-sm lg:text-base font-semibold">Basic Information</span>
          </CardTitle>
        </CardHeader>
        
        <CardContent className="space-y-4 p-3 lg:p-6">
          {/* Mobile-first grid layout */}
          <div className="space-y-4 lg:grid lg:grid-cols-2 lg:gap-6 lg:space-y-0">
            
            {/* Left Column - Form Fields */}
            <div className="space-y-4">
              {/* Username Section */}
              <div className="space-y-2">
                <div className="flex items-center gap-2">
                  <Link size={14} className="text-indigo-500 dark:text-indigo-400" />
                  <Label
                    htmlFor="username"
                    className="font-medium uppercase tracking-wide text-gray-700 dark:text-gray-300 text-xs"
                  >
                    Username *
                  </Label>
                </div>
                
                <div className="flex items-center gap-2">
                  <div className="flex items-center border border-gray-300/60 dark:border-gray-600/60 rounded-lg overflow-hidden flex-1 bg-white/80 dark:bg-gray-800/80 backdrop-blur-sm hover:border-indigo-400/60 transition-colors">
                    <span className="px-2 py-2 bg-gradient-to-r from-indigo-50/80 to-purple-50/80 dark:from-gray-700/80 dark:to-gray-600/80 text-indigo-600 dark:text-indigo-400 text-xs font-medium border-r border-gray-300/60 dark:border-gray-600/60">
                      tapyfi.com/
                    </span>
                    <Input
                      id="username"
                      placeholder="yourusername"
                      value={profileForm.username}
                      onChange={(e) => handleUsernameChange(e.target.value.toLowerCase())}
                      className="border-0 focus:ring-0 bg-transparent py-2 px-2 text-sm font-medium placeholder:text-gray-400 text-gray-900 dark:text-white"
                      required
                    />
                  </div>
                  
                  <div className="flex items-center justify-center w-8 h-8 rounded-full border border-gray-300/60 dark:border-gray-600/60 bg-white/80 dark:bg-gray-800/80 backdrop-blur-sm">
                    {usernameChecking && (
                      <Loader2 className="h-3 w-3 animate-spin text-indigo-500" />
                    )}
                    {usernameAvailable === true && (
                      <Check className="h-4 w-4 text-emerald-500" />
                    )}
                    {usernameAvailable === false && (
                      <X className="h-4 w-4 text-red-500" />
                    )}
                  </div>
                </div>

                {/* Username validation messages */}
                {usernameAvailable === false && (
                  <div className="flex items-center gap-1 p-2 bg-red-50/80 dark:bg-red-900/30 border border-red-200/60 dark:border-red-800/60 rounded-lg backdrop-blur-sm">
                    <X className="h-3 w-3 text-red-500 flex-shrink-0" />
                    <p className="text-xs text-red-600 dark:text-red-400 font-medium">
                      Username not available
                    </p>
                  </div>
                )}

                {usernameAvailable === true && (
                  <div className="flex items-center gap-1 p-2 bg-emerald-50/80 dark:bg-emerald-900/30 border border-emerald-200/60 dark:border-emerald-800/60 rounded-lg backdrop-blur-sm">
                    <Check className="h-3 w-3 text-emerald-500 flex-shrink-0" />
                    <p className="text-xs text-emerald-600 dark:text-emerald-400 font-medium">
                      Username available!
                    </p>
                  </div>
                )}
              </div>

              {/* Display Name Section */}
              <div className="space-y-2">
                <Label
                  htmlFor="display_name"
                  className="font-medium uppercase tracking-wide text-gray-700 dark:text-gray-300 text-xs"
                >
                  Display Name
                </Label>
                <Input
                  id="display_name"
                  placeholder="Your Name or Business"
                  value={profileForm.display_name}
                  onChange={(e) =>
                    setProfileForm((prev: ProfileFormData) => ({
                      ...prev,
                      display_name: e.target.value,
                    }))
                  }
                  className="border border-gray-300/60 dark:border-gray-600/60 rounded-lg py-2 px-3 bg-white/80 dark:bg-gray-800/80 backdrop-blur-sm hover:border-indigo-400/60 focus:border-indigo-500 focus:ring-1 focus:ring-indigo-500/30 transition-colors text-sm"
                />
              </div>

              {/* Bio Section */}
              <div className="space-y-2">
                <Label
                  htmlFor="bio"
                  className="font-medium uppercase tracking-wide text-gray-700 dark:text-gray-300 text-xs"
                >
                  Bio
                </Label>
                <Textarea
                  id="bio"
                  placeholder="Tell people about yourself or your business..."
                  value={profileForm.bio}
                  onChange={(e) =>
                    setProfileForm((prev: ProfileFormData) => ({
                      ...prev,
                      bio: e.target.value,
                    }))
                  }
                  className="border border-gray-300/60 dark:border-gray-600/60 rounded-lg py-2 px-3 bg-white/80 dark:bg-gray-800/80 backdrop-blur-sm hover:border-indigo-400/60 focus:border-indigo-500 focus:ring-1 focus:ring-indigo-500/30 transition-colors resize-none text-sm"
                  rows={3}
                />
              </div>
            </div>

            {/* Right Column - Profile Pictures */}
            <div className="space-y-4">
              {/* Profile Picture Preview */}
              <div className="text-center p-4 rounded-lg border border-gray-300/60 dark:border-gray-600/60 bg-gradient-to-br from-indigo-50/60 to-purple-50/60 dark:from-gray-800/60 dark:to-gray-700/60 backdrop-blur-sm">
                <Label className="block mb-3 font-medium uppercase tracking-wide text-gray-700 dark:text-gray-300 text-xs">
                  Profile Pictures
                </Label>
                <div className="flex justify-center mb-3">
                  <EnhancedProfilePicture
                    profilePicture={profileForm.profile_picture}
                    companyLogo={profileForm.company_logo}
                    size="lg"
                  />
                </div>
              </div>

              {/* File Upload Sections */}
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                <div className="p-3 rounded-lg border border-gray-300/60 dark:border-gray-600/60 bg-white/60 dark:bg-gray-800/60 backdrop-blur-sm">
                  <Label className="block mb-2 font-medium uppercase tracking-wide text-gray-700 dark:text-gray-300 text-xs">
                    Profile Picture
                  </Label>
                  <FileUpload
                    bucket="profile-pictures"
                    currentImage={profileForm.profile_picture}
                    onImageChange={(url) =>
                      setProfileForm((prev: ProfileFormData) => ({
                        ...prev,
                        profile_picture: url,
                      }))
                    }
                  />
                </div>

                <div className="p-3 rounded-lg border border-gray-300/60 dark:border-gray-600/60 bg-white/60 dark:bg-gray-800/60 backdrop-blur-sm">
                  <Label className="block mb-2 font-medium uppercase tracking-wide text-gray-700 dark:text-gray-300 text-xs">
                    Company Logo
                  </Label>
                  <FileUpload
                    bucket="company-logos"
                    currentImage={profileForm.company_logo}
                    onImageChange={(url) =>
                      setProfileForm((prev: ProfileFormData) => ({
                        ...prev,
                        company_logo: url,
                      }))
                    }
                  />
                </div>
              </div>
            </div>
          </div>

          {/* Save Button */}
          <div className="pt-4 border-t border-gray-200/50 dark:border-gray-700/50">
            <Button
              onClick={handleProfileSave}
              disabled={!profileForm.username || usernameAvailable === false || saving}
              className="w-full bg-gradient-to-r from-indigo-500 to-purple-600 hover:from-indigo-600 hover:to-purple-700 text-white font-medium py-2.5 px-6 rounded-lg shadow-md hover:shadow-lg transition-all duration-200 disabled:opacity-50 disabled:cursor-not-allowed text-sm"
            >
              {saving ? (
                <>
                  <Loader2 size={14} className="mr-2 animate-spin" />
                  Saving...
                </>
              ) : profile ? (
                "Update Profile"
              ) : (
                "Create Profile"
              )}
            </Button>
          </div>
        </CardContent>
      </Card>
    </TabsContent>
  );
}
