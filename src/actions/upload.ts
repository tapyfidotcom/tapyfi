"use server";

import { createClient } from '@supabase/supabase-js';
import { currentUser } from "@clerk/nextjs/server";

// Create a separate Supabase client for server operations
const supabaseAdmin = createClient(
  process.env.NEXT_PUBLIC_SUPABASE_URL!,
  process.env.SUPABASE_SERVICE_ROLE_KEY!, // Use service role for server operations
  {
    auth: {
      autoRefreshToken: false,
      persistSession: false
    }
  }
);

export const uploadImage = async (
  file: File, 
  bucket: 'profile-pictures' | 'company-logos'
) => {
  try {
    const clerkUser = await currentUser();
    if (!clerkUser) {
      return { success: false, message: "User not authenticated" };
    }

    // Get user profile from your database
    const { data: userProfile, error: userError } = await supabaseAdmin
      .from("user_profiles")
      .select("id")
      .eq("clerk_user_id", clerkUser.id)
      .single();

    if (userError || !userProfile) {
      console.error('User profile error:', userError);
      return { success: false, message: "User profile not found" };
    }

    // Validate file
    if (!file) {
      return { success: false, message: "No file provided" };
    }

    if (!file.type.startsWith('image/')) {
      return { success: false, message: "File must be an image" };
    }

    if (file.size > 5 * 1024 * 1024) {
      return { success: false, message: "File size must be less than 5MB" };
    }

    // Generate unique filename with user folder structure
    const fileExt = file.name.split('.').pop()?.toLowerCase();
    const fileName = `${Date.now()}-${Math.random().toString(36).substring(2)}.${fileExt}`;
    const filePath = `${userProfile.id}/${fileName}`;

    // Convert File to ArrayBuffer for server-side upload
    const arrayBuffer = await file.arrayBuffer();

    // Upload to Supabase Storage using service role
    const { data, error } = await supabaseAdmin.storage
      .from(bucket)
      .upload(filePath, arrayBuffer, {
        contentType: file.type,
        cacheControl: '3600',
        upsert: false // Don't overwrite existing files
      });

    if (error) {
      console.error('Storage upload error:', error);
      return { 
        success: false, 
        message: `Upload failed: ${error.message}` 
      };
    }

    // Get public URL
    const { data: { publicUrl } } = supabaseAdmin.storage
      .from(bucket)
      .getPublicUrl(filePath);

    console.log('Upload successful:', { filePath, publicUrl });

    return { 
      success: true, 
      url: publicUrl,
      path: data.path
    };
  } catch (error: any) {
    console.error('Upload error:', error);
    return { 
      success: false, 
      message: `Upload failed: ${error.message}` 
    };
  }
};

export const deleteImage = async (
  filePath: string,
  bucket: 'profile-pictures' | 'company-logos'
) => {
  try {
    const clerkUser = await currentUser();
    if (!clerkUser) {
      return { success: false, message: "User not authenticated" };
    }

    const { error } = await supabaseAdmin.storage
      .from(bucket)
      .remove([filePath]);

    if (error) {
      console.error('Delete error:', error);
      return { success: false, message: "Failed to delete image" };
    }

    return { success: true };
  } catch (error: any) {
    console.error('Delete error:', error);
    return { success: false, message: error.message };
  }
};
