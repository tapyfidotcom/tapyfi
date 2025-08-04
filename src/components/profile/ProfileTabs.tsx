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
            <div
              className="space-y-6 p-5 rounded-xl border border-gray-200 bg-gradient-to-br from-gray-50 to-white dark:from-gray-900 dark:to-gray-800 dark:border-gray-700 shadow-sm"
              style={{ fontVariant: "small-caps" }}
            >
              <div className="space-y-3">
                <div className="flex items-center gap-2 mb-3">
                  <Link
                    size={16}
                    className="text-indigo-600 dark:text-indigo-400"
                  />
                  <Label
                    htmlFor="username"
                    className="font-semibold uppercase tracking-wide text-gray-700 dark:text-gray-300 text-sm"
                  >
                    Username *
                  </Label>
                </div>

                <div className="flex items-center gap-3">
                  <div className="flex items-center border-2 border-gray-200 dark:border-gray-600 rounded-xl overflow-hidden flex-1 shadow-sm hover:border-indigo-300 dark:hover:border-indigo-500 transition-colors duration-200 focus-within:border-indigo-500 focus-within:ring-2 focus-within:ring-indigo-500/20">
                    <span className="px-4 py-3 bg-gradient-to-r from-indigo-50 to-purple-50 dark:from-gray-800 dark:to-gray-700 text-indigo-600 dark:text-indigo-400 text-sm font-medium border-r-2 border-gray-200 dark:border-gray-600 whitespace-nowrap">
                      tapyfi.com/
                    </span>
                    <Input
                      id="username"
                      placeholder="yourusername"
                      value={profileForm.username}
                      onChange={(e) =>
                        handleUsernameChange(e.target.value.toLowerCase())
                      }
                      className="border-0 focus:ring-0 flex-1 py-3 px-4 bg-white dark:bg-gray-900 text-gray-900 dark:text-white font-medium placeholder:text-gray-400"
                      style={{ fontVariant: "normal" }}
                      required
                    />
                  </div>

                  <div className="flex items-center justify-center w-10 h-10 rounded-full border-2 border-gray-200 dark:border-gray-600 bg-white dark:bg-gray-800 shadow-sm">
                    {usernameChecking && (
                      <Loader2 className="h-4 w-4 animate-spin text-indigo-600 dark:text-indigo-400" />
                    )}
                    {usernameAvailable === true && (
                      <Check className="h-5 w-5 text-emerald-500" />
                    )}
                    {usernameAvailable === false && (
                      <X className="h-5 w-5 text-red-500" />
                    )}
                  </div>
                </div>

                {usernameAvailable === false && (
                  <div className="flex items-center gap-2 mt-3 p-3 bg-red-50 dark:bg-red-900/20 border border-red-200 dark:border-red-800 rounded-lg">
                    <X className="h-4 w-4 text-red-500 flex-shrink-0" />
                    <p className="text-sm text-red-600 dark:text-red-400 font-medium">
                      Username is not available
                    </p>
                  </div>
                )}

                {usernameAvailable === true && (
                  <div className="flex items-center gap-2 mt-3 p-3 bg-emerald-50 dark:bg-emerald-900/20 border border-emerald-200 dark:border-emerald-800 rounded-lg">
                    <Check className="h-4 w-4 text-emerald-500 flex-shrink-0" />
                    <p className="text-sm text-emerald-600 dark:text-emerald-400 font-medium">
                      Username is available!
                    </p>
                  </div>
                )}
              </div>

              <div className="space-y-3">
                <Label
                  htmlFor="display_name"
                  className="font-semibold uppercase tracking-wide text-gray-700 dark:text-gray-300 text-sm"
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
                  className="border-2 border-gray-200 dark:border-gray-600 rounded-xl py-3 px-4 bg-white dark:bg-gray-900 hover:border-indigo-300 dark:hover:border-indigo-500 focus:border-indigo-500 focus:ring-2 focus:ring-indigo-500/20 transition-colors duration-200 shadow-sm"
                  style={{ fontVariant: "normal" }}
                />
              </div>

              <div className="space-y-3">
                <Label
                  htmlFor="bio"
                  className="font-semibold uppercase tracking-wide text-gray-700 dark:text-gray-300 text-sm"
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
                  className="border-2 border-gray-200 dark:border-gray-600 rounded-xl py-3 px-4 bg-white dark:bg-gray-900 hover:border-indigo-300 dark:hover:border-indigo-500 focus:border-indigo-500 focus:ring-2 focus:ring-indigo-500/20 transition-colors duration-200 shadow-sm resize-none"
                  style={{ fontVariant: "normal" }}
                  rows={4}
                />
              </div>
            </div>

            {/* Right Column */}
            <div className="space-y-6">
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

          <div className="flex flex-col sm:flex-row gap-3 pt-6 border-t border-gray-200 dark:border-gray-700">
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
        </CardContent>
      </Card>
    </TabsContent>
  );
}
