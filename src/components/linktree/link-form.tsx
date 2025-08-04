"use client";

import React, { useState, useEffect } from "react";
import { platformConfigs } from "@/lib/platform-configs";
import { generatePlatformLink } from "@/lib/link-generators";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { X, Eye, EyeOff, Loader2, ExternalLink, Check, AlertCircle } from "lucide-react";
import { CreateLinktreeLink } from "@/interfaces/linktree";
import Image from "next/image";

interface LinkFormProps {
  platform: string;
  initialData?: Partial<CreateLinktreeLink>;
  onSave: (linkData: CreateLinktreeLink) => Promise<void> | void;
  onCancel: () => void;
  isEditing?: boolean;
}

export default function LinkForm({
  platform,
  initialData,
  onSave,
  onCancel,
  isEditing = false,
}: LinkFormProps) {
  const [formData, setFormData] = useState({
    title: initialData?.title || "",
    input: "",
    url: initialData?.url || "",
  });
  const [showPreview, setShowPreview] = useState(false);
  const [isLoading, setIsLoading] = useState(false);

  const [generatedLink, setGeneratedLink] = useState<{
    url: string;
    isValid: boolean;
    error: string;
  }>({
    url: "",
    isValid: false,
    error: "",
  });

  const config = platformConfigs[platform];

  useEffect(() => {
    if (initialData?.url && !formData.input) {
      setFormData((prev) => ({ ...prev, url: initialData.url! }));
    }
  }, [initialData, formData.input]);

  useEffect(() => {
    if (formData.input) {
      const result = generatePlatformLink(platform, formData.input);
      setGeneratedLink({
        url: result.url,
        isValid: result.isValid,
        error: result.error || "",
      });
      if (result.isValid) {
        setFormData((prev) => ({ ...prev, url: result.url }));
      }
    } else {
      setGeneratedLink({ url: "", isValid: false, error: "" });
    }
  }, [formData.input, platform]);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    if (!formData.title.trim()) {
      return;
    }

    if (platform === "custom") {
      if (!formData.url.trim()) return;
    } else {
      if (!formData.input.trim() || !generatedLink.isValid) return;
    }

    setIsLoading(true);
    try {
      await onSave({
        platform,
        title: formData.title.trim(),
        url: formData.url,
        icon: config?.icon,
      });
    } catch (error) {
      console.error("Error saving link:", error);
    } finally {
      setIsLoading(false);
    }
  };

  // Function to render icon (image or emoji)
  const renderIcon = (icon: string, size: number = 24) => {
    if (icon?.startsWith("/assets/")) {
      return (
        <Image
          src={icon}
          alt={config?.name || "Platform"}
          width={size}
          height={size}
          className="object-contain"
        />
      );
    }
    return <span className="text-2xl">{icon}</span>;
  };

  if (!config) {
    return (
      <div className="fixed inset-0 bg-black/50 backdrop-blur-sm flex items-center justify-center z-50 p-4">
        <div className="bg-card rounded-xl shadow-xl w-full max-w-md p-6 text-center">
          <AlertCircle className="mx-auto h-12 w-12 text-destructive mb-4" />
          <p className="text-destructive font-medium">Platform configuration not found</p>
          <Button onClick={onCancel} className="mt-4" variant="outline">
            Close
          </Button>
        </div>
      </div>
    );
  }

  const isSubmitDisabled =
    isLoading ||
    !formData.title.trim() ||
    (platform !== "custom" &&
      (!formData.input.trim() || !generatedLink.isValid));

  return (
    <div className="fixed inset-0 bg-black/50 backdrop-blur-sm flex items-center justify-center z-50 p-4">
      <div className="bg-card rounded-2xl shadow-2xl w-full max-w-lg border border-border overflow-hidden">
        {/* Header */}
        <div className="p-6 border-b border-border bg-gradient-to-r from-blue-50 to-purple-50 dark:from-blue-950 dark:to-purple-950">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-4">
              <div className="w-12 h-12 rounded-xl bg-gradient-to-br from-gray-100 to-gray-200 dark:from-gray-800 dark:to-gray-700 flex items-center justify-center shadow-sm">
                {renderIcon(config.icon, 32)}
              </div>
              <div>
                <h2 className="text-xl font-bold text-foreground">
                  {isEditing ? "Edit" : "Add"} {config.name}
                </h2>
                <p className="text-sm text-muted-foreground">
                  {isEditing ? "Update your link details" : "Fill in the details below"}
                </p>
              </div>
            </div>
            <Button
              variant="ghost"
              size="sm"
              onClick={onCancel}
              disabled={isLoading}
              className="rounded-full h-10 w-10 p-0 hover:bg-white/20"
            >
              <X size={20} />
            </Button>
          </div>
        </div>

        {/* Form */}
        <form onSubmit={handleSubmit} className="p-6 space-y-6">
          {/* Title */}
          <div className="space-y-2">
            <Label htmlFor="title" className="text-sm font-semibold">
              Display Title
            </Label>
            <Input
              id="title"
              placeholder={`My ${config.name}`}
              value={formData.title}
              onChange={(e) =>
                setFormData((prev) => ({ ...prev, title: e.target.value }))
              }
              className="h-12 text-base rounded-xl border-2 focus:border-primary transition-colors"
              disabled={isLoading}
              required
            />
          </div>

          {/* Platform Input */}
          {platform === "custom" ? (
            <div className="space-y-2">
              <Label htmlFor="url" className="text-sm font-semibold">
                Website URL
              </Label>
              <Input
                id="url"
                type="url"
                placeholder="https://yourwebsite.com"
                value={formData.url}
                onChange={(e) =>
                  setFormData((prev) => ({ ...prev, url: e.target.value }))
                }
                className="h-12 text-base rounded-xl border-2 focus:border-primary transition-colors"
                disabled={isLoading}
                required
              />
            </div>
          ) : (
            <div className="space-y-2">
              <Label htmlFor="input" className="text-sm font-semibold">
                {config.name}{" "}
                {config.inputType === "phone"
                  ? "Phone Number"
                  : config.inputType === "email"
                  ? "Email"
                  : "Username/Handle"}
              </Label>
              <div className="relative">
                <Input
                  id="input"
                  type={config.inputType}
                  placeholder={config.placeholder}
                  value={formData.input}
                  onChange={(e) =>
                    setFormData((prev) => ({ ...prev, input: e.target.value }))
                  }
                  className={`h-12 text-base rounded-xl border-2 transition-colors pr-10 ${
                    formData.input && generatedLink.isValid
                      ? "border-green-500 focus:border-green-500"
                      : formData.input && generatedLink.error
                      ? "border-red-500 focus:border-red-500"
                      : "focus:border-primary"
                  }`}
                  disabled={isLoading}
                  required
                />
                {formData.input && (
                  <div className="absolute right-3 top-1/2 transform -translate-y-1/2">
                    {generatedLink.isValid ? (
                      <Check size={20} className="text-green-500" />
                    ) : generatedLink.error ? (
                      <AlertCircle size={20} className="text-red-500" />
                    ) : null}
                  </div>
                )}
              </div>
              {generatedLink.error && (
                <p className="text-sm text-red-600 dark:text-red-400 flex items-center gap-2">
                  <AlertCircle size={16} />
                  {generatedLink.error}
                </p>
              )}
            </div>
          )}

          {/* Generated URL Preview */}
          {generatedLink.url && (
            <div className="space-y-2">
              <div className="flex items-center justify-between">
                <Label className="text-sm font-semibold">Generated URL</Label>
                <div className="flex items-center gap-2">
                  <Button
                    type="button"
                    variant="ghost"
                    size="sm"
                    onClick={() => setShowPreview(!showPreview)}
                    disabled={isLoading}
                    className="h-8 px-3 rounded-lg"
                  >
                    {showPreview ? <EyeOff size={16} /> : <Eye size={16} />}
                    <span className="ml-1 text-xs">
                      {showPreview ? "Hide" : "Show"}
                    </span>
                  </Button>
                  <Button
                    type="button"
                    variant="ghost"
                    size="sm"
                    onClick={() => window.open(generatedLink.url, '_blank')}
                    disabled={isLoading}
                    className="h-8 px-3 rounded-lg"
                  >
                    <ExternalLink size={16} />
                  </Button>
                </div>
              </div>
              {showPreview && (
                <div className="p-3 bg-muted rounded-xl text-sm break-all font-mono border border-border">
                  {generatedLink.url}
                </div>
              )}
            </div>
          )}

          {/* Actions */}
          <div className="flex flex-col sm:flex-row gap-3 pt-4">
            <Button
              type="button"
              variant="outline"
              onClick={onCancel}
              className="flex-1 h-12 rounded-xl transition-all hover:scale-105"
              disabled={isLoading}
            >
              Cancel
            </Button>
            <Button
              type="submit"
              className="flex-1 h-12 rounded-xl bg-gradient-to-r from-blue-600 to-purple-600 hover:from-blue-700 hover:to-purple-700 shadow-lg hover:shadow-xl transition-all duration-200 hover:scale-105"
              disabled={isSubmitDisabled}
            >
              {isLoading && <Loader2 className="animate-spin mr-2" size={18} />}
              {isEditing ? "Update" : "Add"} Link
            </Button>
          </div>
        </form>
      </div>
    </div>
  );
}
