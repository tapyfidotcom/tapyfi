"use client";

import React, { useState, useEffect } from "react";
import { platformConfigs } from "@/lib/platform-configs";
import { generatePlatformLink } from "@/lib/link-generators";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { X, Eye, EyeOff } from "lucide-react";
import { CreateLinktreeLink } from "@/interfaces/linktree";

interface LinkFormProps {
  platform: string;
  initialData?: Partial<CreateLinktreeLink>;
  onSave: (linkData: CreateLinktreeLink) => void;
  onCancel: () => void;
  isEditing?: boolean;
}

export default function LinkForm({ 
  platform, 
  initialData, 
  onSave, 
  onCancel, 
  isEditing = false 
}: LinkFormProps) {
  const [formData, setFormData] = useState({
    title: initialData?.title || '',
    input: '',
    url: initialData?.url || ''
  });
  const [showPreview, setShowPreview] = useState(false);
  
  // Fix: Initialize with proper structure matching the expected type
  const [generatedLink, setGeneratedLink] = useState<{
    url: string;
    isValid: boolean;
    error: string;
  }>({ 
    url: '', 
    isValid: false, 
    error: '' 
  });

  const config = platformConfigs[platform];

  useEffect(() => {
    if (initialData?.url && !formData.input) {
      setFormData(prev => ({ ...prev, url: initialData.url! }));
    }
  }, [initialData, formData.input]);

  useEffect(() => {
    if (formData.input) {
      const result = generatePlatformLink(platform, formData.input);
      // Fix: Ensure error is always a string
      setGeneratedLink({
        url: result.url,
        isValid: result.isValid,
        error: result.error || ''
      });
      if (result.isValid) {
        setFormData(prev => ({ ...prev, url: result.url }));
      }
    } else {
      setGeneratedLink({ url: '', isValid: false, error: '' });
    }
  }, [formData.input, platform]);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!formData.title.trim()) {
      return;
    }

    if (platform === 'custom') {
      if (!formData.url.trim()) return;
    } else {
      if (!formData.input.trim() || !generatedLink.isValid) return;
    }

    onSave({
      platform,
      title: formData.title.trim(),
      url: formData.url,
      icon: config?.icon
    });
  };

  if (!config) {
    return (
      <div className="text-center py-8">
        <p className="text-destructive">Platform configuration not found</p>
      </div>
    );
  }

  return (
    <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4">
      <div className="bg-card rounded-xl shadow-xl w-full max-w-md">
        {/* Header */}
        <div className="flex items-center justify-between p-6 border-b border-border">
          <div className="flex items-center gap-3">
            <span className="text-2xl">{config.icon}</span>
            <h2 className="text-lg font-semibold">
              {isEditing ? 'Edit' : 'Add'} {config.name}
            </h2>
          </div>
          <Button variant="ghost" size="sm" onClick={onCancel}>
            <X size={20} />
          </Button>
        </div>

        {/* Form */}
        <form onSubmit={handleSubmit} className="p-6 space-y-4">
          {/* Title */}
          <div>
            <Label htmlFor="title">Display Title</Label>
            <Input
              id="title"
              placeholder={`My ${config.name}`}
              value={formData.title}
              onChange={(e) => setFormData(prev => ({ ...prev, title: e.target.value }))}
              className="mt-1"
              required
            />
          </div>

          {/* Platform Input */}
          {platform === 'custom' ? (
            <div>
              <Label htmlFor="url">Website URL</Label>
              <Input
                id="url"
                type="url"
                placeholder="https://yourwebsite.com"
                value={formData.url}
                onChange={(e) => setFormData(prev => ({ ...prev, url: e.target.value }))}
                className="mt-1"
                required
              />
            </div>
          ) : (
            <div>
              <Label htmlFor="input">
                {config.name} {config.inputType === 'phone' ? 'Phone Number' : 
                              config.inputType === 'email' ? 'Email' : 'Username/Handle'}
              </Label>
              <Input
                id="input"
                type={config.inputType}
                placeholder={config.placeholder}
                value={formData.input}
                onChange={(e) => setFormData(prev => ({ ...prev, input: e.target.value }))}
                className="mt-1"
                required
              />
              {generatedLink.error && (
                <p className="text-sm text-destructive mt-1">{generatedLink.error}</p>
              )}
            </div>
          )}

          {/* Generated URL Preview */}
          {generatedLink.url && (
            <div>
              <div className="flex items-center justify-between">
                <Label>Generated URL</Label>
                <Button
                  type="button"
                  variant="ghost"
                  size="sm"
                  onClick={() => setShowPreview(!showPreview)}
                >
                  {showPreview ? <EyeOff size={16} /> : <Eye size={16} />}
                </Button>
              </div>
              {showPreview && (
                <div className="mt-1 p-2 bg-muted rounded text-sm break-all">
                  {generatedLink.url}
                </div>
              )}
            </div>
          )}

          {/* Actions */}
          <div className="flex gap-3 pt-4">
            <Button type="button" variant="outline" onClick={onCancel} className="flex-1">
              Cancel
            </Button>
            <Button 
              type="submit" 
              className="flex-1"
              disabled={!formData.title.trim() || 
                       (platform !== 'custom' && (!formData.input.trim() || !generatedLink.isValid))}
            >
              {isEditing ? 'Update' : 'Add'} Link
            </Button>
          </div>
        </form>
      </div>
    </div>
  );
}
