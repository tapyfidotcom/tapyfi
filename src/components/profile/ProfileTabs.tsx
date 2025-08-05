"use client";

import React from "react";
import { TabsContent } from "@/components/ui/tabs";
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
    <TabsContent value="profile" className="space-y-4">
      <div className="space-y-4">
        {/* Header - Perfect Glass Effect */}
        <div className="flex items-center justify-between pb-4 border-b border-gray-200/50 dark:border-gray-700/50">
          <div className="flex items-center gap-2">
            <User size={18} className="text-primary" />
            <h2 className="text-lg font-semibold text-gray-900 dark:text-gray-100">Basic Information</h2>
          </div>
          <Button
            onClick={handleProfileSave}
            disabled={!profileForm.username || usernameAvailable === false || saving}
            size="sm"
            className="h-8 px-3 text-xs rounded-full bg-gradient-to-r from-blue-600 to-purple-600 hover:from-blue-700 hover:to-purple-700 shadow-md hover:shadow-lg transition-all duration-200 text-white font-medium"
          >
            {saving ? (
              <>
                <Loader2 size={12} className="mr-1 animate-spin" />
                Saving...
              </>
            ) : profile ? (
              "Update Profile"
            ) : (
              "Create Profile"
            )}
          </Button>
        </div>

        {/* Main Content Card - Perfect Glass Effect */}
        <div className="bg-white/80 dark:bg-gray-800 backdrop-blur-xl border border-white/20 dark:border-gray-300/20 rounded-lg p-4 lg:p-6 shadow-lg">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
            {/* Left Column - Form Fields */}
            <div className="space-y-4">
              {/* Username Section */}
              <div className="space-y-2">
                <div className="flex items-center gap-2">
                  <Link size={14} className="text-indigo-600 dark:text-indigo-400" />
                  <Label
                    htmlFor="username"
                    className="font-medium text-gray-900 dark:text-gray-100 text-sm"
                  >
                    Username *
                  </Label>
                </div>
                
                <div className="flex items-center gap-2">
                  <div className="flex items-center border border-white/30 dark:border-gray-300/30 rounded-lg overflow-hidden flex-1 bg-white/30 dark:bg-gray-100/30 backdrop-blur-sm hover:border-indigo-400/60 transition-colors">
                    <span className="px-3 py-2 text-xs bg-white/40 dark:bg-gray-100/40 text-black dark:text-black font-medium border-r border-white/30 dark:border-gray-300/30 whitespace-nowrap">
                      tapyfi.com/
                    </span>
                    <Input
                      id="username"
                      placeholder="yourusername"
                      value={profileForm.username}
                      onChange={(e) => handleUsernameChange(e.target.value.toLowerCase())}
                      className="border-0 focus:ring-0 bg-transparent py-2 px-3 text-sm font-medium placeholder:text-gray-500 dark:placeholder:text-gray-400 text-gray-900 dark:text-gray-100"
                      required
                    />
                  </div>
                  
                  <div className="flex items-center justify-center w-8 h-8 rounded-full border border-white/30 dark:border-gray-300/30 bg-white/30 dark:bg-gray-100/30 backdrop-blur-sm shadow-sm">
                    {usernameChecking && (
                      <Loader2 className="h-3 w-3 animate-spin text-indigo-600 dark:text-indigo-400" />
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
                  <div className="flex items-center gap-2 p-2 bg-red-50/80 dark:bg-red-900/30 border border-red-200/60 dark:border-red-800/60 rounded-lg backdrop-blur-sm">
                    <X className="h-3 w-3 text-red-500 flex-shrink-0" />
                    <p className="text-xs text-red-600 dark:text-red-400 font-medium">
                      Username not available
                    </p>
                  </div>
                )}

                {usernameAvailable === true && (
                  <div className="flex items-center gap-2 p-2 bg-emerald-50/80 dark:bg-emerald-900/30 border border-emerald-200/60 dark:border-emerald-800/60 rounded-lg backdrop-blur-sm">
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
                  className="font-medium text-gray-900 dark:text-gray-100 text-sm"
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
                  className="border border-white/30 dark:border-gray-300/30 rounded-lg py-2 px-3 bg-white/30 dark:bg-gray-100/30 backdrop-blur-sm hover:border-indigo-400/60 focus:border-indigo-500 focus:ring-1 focus:ring-indigo-500/30 transition-colors text-sm text-gray-900 dark:text-gray-100 placeholder:text-gray-500 dark:placeholder:text-gray-400"
                />
              </div>

              {/* Bio Section */}
              <div className="space-y-2">
                <Label
                  htmlFor="bio"
                  className="font-medium text-gray-900 dark:text-gray-100 text-sm"
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
                  className="border border-white/30 dark:border-gray-300/30 rounded-lg py-2 px-3 bg-white/30 dark:bg-gray-100/30 backdrop-blur-sm hover:border-indigo-400/60 focus:border-indigo-500 focus:ring-1 focus:ring-indigo-500/30 transition-colors resize-none text-sm text-gray-900 dark:text-gray-100 placeholder:text-gray-500 dark:placeholder:text-gray-400"
                  rows={4}
                />
              </div>
            </div>

            {/* Right Column - OLD STYLE Profile Pictures */}
            <div className="space-y-6">
              {/* Profile Picture Preview - OLD STYLE */}
              <div className="text-center p-6 rounded-xl border border-gray-200 bg-gradient-to-br from-indigo-50 to-purple-50 dark:from-gray-900 dark:to-gray-800 dark:border-gray-700 shadow-sm">
                <Label className="block mb-6 font-semibold uppercase tracking-wide text-gray-700 dark:text-gray-300 text-sm">
                  Profile Pictures
                </Label>
                <div className="flex justify-center mb-6">
                  <div className="relative">
                    <EnhancedProfilePicture
                      profilePicture={profileForm.profile_picture}
                      companyLogo={profileForm.company_logo}
                      size="xl"
                    />
                  </div>
                </div>
              </div>

              {/* File Upload Sections - OLD STYLE */}
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div className="p-4 rounded-xl border border-gray-200 bg-white dark:bg-gray-900 dark:border-gray-700 shadow-sm">
                  <Label className="block mb-3 font-semibold uppercase tracking-wide text-gray-700 dark:text-gray-300 text-xs">
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

                <div className="p-4 rounded-xl border border-gray-200 bg-white dark:bg-gray-900 dark:border-gray-700 shadow-sm">
                  <Label className="block mb-3 font-semibold uppercase tracking-wide text-gray-700 dark:text-gray-300 text-xs">
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

          {/* Save Button for Mobile - OLD STYLE */}
          <div className="flex flex-col sm:flex-row gap-3 pt-6 border-t border-gray-200 dark:border-gray-700 lg:hidden">
            <Button
              onClick={handleProfileSave}
              disabled={
                !profileForm.username || usernameAvailable === false || saving
              }
              className="w-full sm:w-auto bg-gradient-to-r from-indigo-500 to-purple-600 hover:from-indigo-600 hover:to-purple-700 text-white font-semibold py-3 px-8 rounded-xl shadow-lg hover:shadow-xl transition-all duration-200 disabled:opacity-50 disabled:cursor-not-allowed"
            >
              {saving ? (
                <>
                  <Loader2 size={16} className="mr-2 animate-spin" />
                  Saving...
                </>
              ) : profile ? (
                "Update Profile"
              ) : (
                "Create Profile"
              )}
            </Button>
          </div>
        </div>
      </div>
    </TabsContent>
  );
}
