"use client";

import React, { useRef, useState } from "react";
import { Button } from "@/components/ui/button";
import { Upload, X, Loader2, AlertCircle } from "lucide-react";
import { uploadImage } from "@/actions/upload";
import toast from "react-hot-toast";

interface FileUploadProps {
  bucket: 'profile-pictures' | 'company-logos';
  currentImage?: string;
  onImageChange: (imageUrl: string) => void;
  className?: string;
  disabled?: boolean;
}

export default function FileUpload({ 
  bucket, 
  currentImage, 
  onImageChange, 
  className = "",
  disabled = false
}: FileUploadProps) {
  const fileInputRef = useRef<HTMLInputElement>(null);
  const [uploading, setUploading] = useState(false);
  const [error, setError] = useState<string>("");

  const validateFile = (file: File): string | null => {
    if (!file.type.startsWith('image/')) {
      return 'Please select an image file (PNG, JPG, JPEG, GIF, WebP)';
    }

    if (file.size > 5 * 1024 * 1024) {
      return 'File size must be less than 5MB';
    }

    return null;
  };

  const handleFileSelect = async (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    if (!file) return;

    // Clear previous errors
    setError("");

    // Validate file
    const validationError = validateFile(file);
    if (validationError) {
      setError(validationError);
      toast.error(validationError);
      return;
    }

    try {
      setUploading(true);
      console.log('Starting upload:', { fileName: file.name, fileSize: file.size, bucket });
      
      // Pass currentImage to enable old image deletion
      const result = await uploadImage(file, bucket, currentImage);
      
      console.log('Upload result:', result);
      
      if (result.success && result.url) {
        onImageChange(result.url);
        toast.success('Image uploaded successfully!');
        setError("");
      } else {
        const errorMessage = result.message || 'Failed to upload image';
        setError(errorMessage);
        toast.error(errorMessage);
        console.error('Upload failed:', result);
      }
    } catch (error: any) {
      const errorMessage = error.message || 'Failed to upload image';
      setError(errorMessage);
      toast.error(errorMessage);
      console.error('Upload error:', error);
    } finally {
      setUploading(false);
      // Reset file input
      if (fileInputRef.current) {
        fileInputRef.current.value = '';
      }
    }
  };

  const handleRemoveImage = () => {
    onImageChange('');
    setError("");
  };

  return (
    <div className={`space-y-3 ${className}`}>
      <input
        ref={fileInputRef}
        type="file"
        accept="image/*"
        onChange={handleFileSelect}
        className="hidden"
        disabled={uploading || disabled}
      />
      
      {/* Error Display */}
      {error && (
        <div className="flex items-center gap-2 p-2 bg-destructive/10 border border-destructive/20 rounded-md">
          <AlertCircle size={16} className="text-destructive" />
          <span className="text-sm text-destructive">{error}</span>
        </div>
      )}
      
      {currentImage ? (
        <div className="relative">
          <div className="w-24 h-24 border rounded-lg overflow-hidden bg-muted">
            <img 
              src={currentImage} 
              alt="Preview" 
              className="w-full h-full object-cover"
              onError={() => setError("Failed to load image")}
            />
          </div>
          <Button
            type="button"
            variant="destructive"
            size="sm"
            className="absolute -top-2 -right-2 h-6 w-6 rounded-full p-0"
            onClick={handleRemoveImage}
            disabled={uploading || disabled}
          >
            <X size={12} />
          </Button>
        </div>
      ) : (
        <div className="w-24 h-24 border-2 border-dashed border-muted-foreground/25 rounded-lg flex items-center justify-center bg-muted/50">
          <Upload size={24} className="text-muted-foreground" />
        </div>
      )}

      <Button
        type="button"
        variant="outline"
        size="sm"
        onClick={() => fileInputRef.current?.click()}
        disabled={uploading || disabled}
        className="w-full"
      >
        {uploading ? (
          <>
            <Loader2 size={16} className="mr-2 animate-spin" />
            Uploading...
          </>
        ) : (
          <>
            <Upload size={16} className="mr-2" />
            {currentImage ? 'Change Image' : 'Upload Image'}
          </>
        )}
      </Button>

      {/* File size and format info */}
      <p className="text-xs text-muted-foreground">
        PNG, JPG, JPEG, GIF, WebP up to 5MB
      </p>
    </div>
  );
}
