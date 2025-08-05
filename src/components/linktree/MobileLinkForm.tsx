"use client";

import React, { useState, useEffect } from "react";
import { platformConfigs } from "@/lib/platform-configs";
import { generatePlatformLink } from "@/lib/link-generators";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { ArrowLeft, Eye, EyeOff, Loader2, ExternalLink, Check, AlertCircle } from "lucide-react";
import { CreateLinktreeLink } from "@/interfaces/linktree";
import Image from "next/image";

interface MobileLinkFormProps {
  platform: string;
  initialData?: Partial<CreateLinktreeLink>;
  onSave: (linkData: CreateLinktreeLink) => Promise<void> | void;
  onCancel: () => void;
  isEditing?: boolean;
}

export default function MobileLinkForm({
  platform,
  initialData,
  onSave,
  onCancel,
  isEditing = false,
}: MobileLinkFormProps) {
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
    return <span className="text-xl">{icon}</span>;
  };

  if (!config) {
    return (
      <div className="h-full flex flex-col items-center justify-center p-6">
        <AlertCircle className="h-12 w-12 text-destructive mb-4" />
        <p className="text-destructive font-medium mb-4">Platform configuration not found</p>
        <Button onClick={onCancel} variant="outline">
          Go Back
        </Button>
      </div>
    );
  }

  const isSubmitDisabled =
    isLoading ||
    !formData.title.trim() ||
    (platform !== "custom" &&
      (!formData.input.trim() || !generatedLink.isValid));

  return (
    <div className="h-full flex flex-col">
      {/* Mobile Header */}
      <div className="flex items-center gap-3 pb-4 border-b border-gray-200/50 dark:border-gray-700/50">
        <Button
          variant="ghost"
          size="sm"
          onClick={onCancel}
          disabled={isLoading}
          className="h-8 w-8 p-0 rounded-lg"
        >
          <ArrowLeft size={16} />
        </Button>
        <div className="flex items-center gap-3">
          <div className="w-8 h-8 rounded-lg bg-gradient-to-br from-gray-100 to-gray-200 dark:from-gray-800 dark:to-gray-700 flex items-center justify-center">
            {renderIcon(config.icon, 20)}
          </div>
          <div>
            <h2 className="text-lg font-semibold">
              {isEditing ? "Edit" : "Add"} {config.name}
            </h2>
          </div>
        </div>
      </div>

      {/* Mobile Form */}
      <form onSubmit={handleSubmit} className="flex-1 flex flex-col">
        <div className="flex-1 py-4 space-y-4">
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
              className="h-10 text-sm rounded-lg"
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
                className="h-10 text-sm rounded-lg"
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
                  className={`h-10 text-sm rounded-lg pr-10 ${
                    formData.input && generatedLink.isValid
                      ? "border-green-500"
                      : formData.input && generatedLink.error
                      ? "border-red-500"
                      : ""
                  }`}
                  disabled={isLoading}
                  required
                />
                {formData.input && (
                  <div className="absolute right-3 top-1/2 transform -translate-y-1/2">
                    {generatedLink.isValid ? (
                      <Check size={16} className="text-green-500" />
                    ) : generatedLink.error ? (
                      <AlertCircle size={16} className="text-red-500" />
                    ) : null}
                  </div>
                )}
              </div>
              {generatedLink.error && (
                <p className="text-sm text-red-600 dark:text-red-400 flex items-center gap-2">
                  <AlertCircle size={14} />
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
                    className="h-8 px-3"
                  >
                    {showPreview ? <EyeOff size={14} /> : <Eye size={14} />}
                  </Button>
                  <Button
                    type="button"
                    variant="ghost"
                    size="sm"
                    onClick={() => window.open(generatedLink.url, '_blank')}
                    disabled={isLoading}
                    className="h-8 px-3"
                  >
                    <ExternalLink size={14} />
                  </Button>
                </div>
              </div>
              {showPreview && (
                <div className="p-3 bg-muted rounded-lg text-sm break-all font-mono">
                  {generatedLink.url}
                </div>
              )}
            </div>
          )}
        </div>

        {/* Mobile Actions */}
        <div className="pt-4 border-t border-gray-200/50 dark:border-gray-700/50 space-y-3">
          <Button
            type="submit"
            className="w-full h-12 bg-gradient-to-r from-blue-600 to-purple-600 hover:from-blue-700 hover:to-purple-700 text-white font-medium rounded-lg"
            disabled={isSubmitDisabled}
          >
            {isLoading && <Loader2 className="animate-spin mr-2" size={16} />}
            {isEditing ? "Update" : "Add"} Link
          </Button>
          <Button
            type="button"
            variant="outline"
            onClick={onCancel}
            className="w-full h-10 rounded-lg"
            disabled={isLoading}
          >
            Cancel
          </Button>
        </div>
      </form>
    </div>
  );
}
