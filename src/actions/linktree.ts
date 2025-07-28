"use server";

import supabase from "@/config/supabase-config";
import { currentUser } from "@clerk/nextjs/server";
import { CreateLinktreeProfile, CreateLinktreeLink, LinktreeProfile, LinktreeLink } from "@/interfaces/linktree";
import { validateUsername } from "@/lib/link-generators";

export const createLinktreeProfile = async (profileData: CreateLinktreeProfile & { background_settings?: string }) => {
  try {
    const clerkUser = await currentUser();
    if (!clerkUser) {
      return { success: false, message: "User not authenticated" };
    }

    // Get user from user_profiles table
    const { data: userProfile, error: userError } = await supabase
      .from("user_profiles")
      .select("id")
      .eq("clerk_user_id", clerkUser.id)
      .single();

    if (userError || !userProfile) {
      return { success: false, message: "User profile not found" };
    }

    // Validate username
    const usernameValidation = validateUsername(profileData.username);
    if (!usernameValidation.isValid) {
      return { success: false, message: usernameValidation.error };
    }

    // Check if username is already taken
    const { data: existingProfile, error: checkError } = await supabase
      .from("linktree_profiles")
      .select("id")
      .eq("username", profileData.username.toLowerCase())
      .single();

    if (existingProfile) {
      return { success: false, message: "Username is already taken" };
    }

    // Check if user already has a profile
    const { data: userExistingProfile, error: userCheckError } = await supabase
      .from("linktree_profiles")
      .select("id")
      .eq("user_id", userProfile.id)
      .single();

    if (userExistingProfile) {
      return { success: false, message: "You already have a linktree profile" };
    }

    // Create profile with background settings
    const { data, error } = await supabase
      .from("linktree_profiles")
      .insert({
        user_id: userProfile.id,
        username: profileData.username.toLowerCase(),
        display_name: profileData.display_name,
        bio: profileData.bio,
        profile_picture: profileData.profile_picture,
        company_logo: profileData.company_logo,
        theme_color: profileData.theme_color || '#10b981',
        background_color: profileData.background_color || '#ffffff',
        text_color: profileData.text_color || '#000000',
        background_settings: profileData.background_settings || '{"type":"solid","color":"#ffffff","speed":1,"intensity":1}'
      })
      .select()
      .single();

    if (error) {
      return { success: false, message: error.message };
    }

    return { success: true, data };
  } catch (error: any) {
    return { success: false, message: error.message };
  }
};

export const updateLinktreeProfile = async (profileData: Partial<CreateLinktreeProfile> & { background_settings?: string }) => {
  try {
    const clerkUser = await currentUser();
    if (!clerkUser) {
      return { success: false, message: "User not authenticated" };
    }

    // Get user profile
    const { data: userProfile, error: userError } = await supabase
      .from("user_profiles")
      .select("id")
      .eq("clerk_user_id", clerkUser.id)
      .single();

    if (userError || !userProfile) {
      return { success: false, message: "User profile not found" };
    }

    // Get linktree profile
    const { data: linktreeProfile, error: linktreeError } = await supabase
      .from("linktree_profiles")
      .select("id, username")
      .eq("user_id", userProfile.id)
      .single();

    if (linktreeError || !linktreeProfile) {
      return { success: false, message: "Linktree profile not found" };
    }

    // If username is being updated, validate it
    if (profileData.username && profileData.username !== linktreeProfile.username) {
      const usernameValidation = validateUsername(profileData.username);
      if (!usernameValidation.isValid) {
        return { success: false, message: usernameValidation.error };
      }

      // Check if new username is already taken
      const { data: existingProfile } = await supabase
        .from("linktree_profiles")
        .select("id")
        .eq("username", profileData.username.toLowerCase())
        .neq("id", linktreeProfile.id)
        .single();

      if (existingProfile) {
        return { success: false, message: "Username is already taken" };
      }

      profileData.username = profileData.username.toLowerCase();
    }

    // Update profile including background settings
    const { data, error } = await supabase
      .from("linktree_profiles")
      .update({
        ...profileData,
        background_settings: profileData.background_settings
      })
      .eq("id", linktreeProfile.id)
      .select()
      .single();

    if (error) {
      return { success: false, message: error.message };
    }

    return { success: true, data };
  } catch (error: any) {
    return { success: false, message: error.message };
  }
};

export const getUserLinktreeProfile = async () => {
  try {
    const clerkUser = await currentUser();
    if (!clerkUser) {
      return { success: false, message: "User not authenticated" };
    }

    // Get user profile
    const { data: userProfile, error: userError } = await supabase
      .from("user_profiles")
      .select("id")
      .eq("clerk_user_id", clerkUser.id)
      .single();

    if (userError || !userProfile) {
      return { success: false, message: "User profile not found" };
    }

    // Get linktree profile with links
    const { data: profile, error: profileError } = await supabase
      .from("linktree_profiles")
      .select(`
        *,
        linktree_links (*)
      `)
      .eq("user_id", userProfile.id)
      .single();

    if (profileError) {
      return { success: false, message: "Linktree profile not found", data: null };
    }

    return { success: true, data: profile };
  } catch (error: any) {
    return { success: false, message: error.message };
  }
};

export const getPublicLinktreeProfile = async (username: string) => {
  try {
    const { data: profile, error } = await supabase
      .from("linktree_profiles")
      .select(`
        *,
        linktree_links!inner (*)
      `)
      .eq("username", username.toLowerCase())
      .eq("is_active", true)
      .eq("linktree_links.is_active", true)
      .order("display_order", { foreignTable: "linktree_links" });

    if (error || !profile || profile.length === 0) {
      return { success: false, message: "Profile not found" };
    }

    // Increment view count
    await supabase.rpc('increment_profile_view', { profile_id_param: profile[0].id });

    return { success: true, data: profile[0] };
  } catch (error: any) {
    return { success: false, message: error.message };
  }
};

export const addLinktreeLink = async (linkData: CreateLinktreeLink) => {
  try {
    const clerkUser = await currentUser();
    if (!clerkUser) {
      return { success: false, message: "User not authenticated" };
    }

    // Get user profile
    const { data: userProfile, error: userError } = await supabase
      .from("user_profiles")
      .select("id")
      .eq("clerk_user_id", clerkUser.id)
      .single();

    if (userError || !userProfile) {
      return { success: false, message: "User profile not found" };
    }

    // Get linktree profile
    const { data: linktreeProfile, error: linktreeError } = await supabase
      .from("linktree_profiles")
      .select("id")
      .eq("user_id", userProfile.id)
      .single();

    if (linktreeError || !linktreeProfile) {
      return { success: false, message: "Linktree profile not found" };
    }

    // Get next display order
    const { data: lastLink } = await supabase
      .from("linktree_links")
      .select("display_order")
      .eq("profile_id", linktreeProfile.id)
      .order("display_order", { ascending: false })
      .limit(1)
      .single();

    const nextOrder = lastLink ? lastLink.display_order + 1 : 0;

    // Add link
    const { data, error } = await supabase
      .from("linktree_links")
      .insert({
        profile_id: linktreeProfile.id,
        platform: linkData.platform,
        title: linkData.title,
        url: linkData.url,
        icon: linkData.icon,
        display_order: linkData.display_order ?? nextOrder
      })
      .select()
      .single();

    if (error) {
      return { success: false, message: error.message };
    }

    return { success: true, data };
  } catch (error: any) {
    return { success: false, message: error.message };
  }
};

export const updateLinktreeLink = async (linkId: number, linkData: Partial<CreateLinktreeLink>) => {
  try {
    const clerkUser = await currentUser();
    if (!clerkUser) {
      return { success: false, message: "User not authenticated" };
    }

    // Verify ownership
    const { data: link, error: linkError } = await supabase
      .from("linktree_links")
      .select(`
        id,
        linktree_profiles!inner (
          user_id,
          user_profiles!inner (clerk_user_id)
        )
      `)
      .eq("id", linkId)
      .single();

    if (linkError || !link) {
      return { success: false, message: "Link not found" };
    }

    // Type assertion for the nested structure
    const profiles = link.linktree_profiles as any;
    if (profiles.user_profiles.clerk_user_id !== clerkUser.id) {
      return { success: false, message: "Unauthorized" };
    }

    // Update link
    const { data, error } = await supabase
      .from("linktree_links")
      .update(linkData)
      .eq("id", linkId)
      .select()
      .single();

    if (error) {
      return { success: false, message: error.message };
    }

    return { success: true, data };
  } catch (error: any) {
    return { success: false, message: error.message };
  }
};

export const deleteLinktreeLink = async (linkId: number) => {
  try {
    const clerkUser = await currentUser();
    if (!clerkUser) {
      return { success: false, message: "User not authenticated" };
    }

    // Verify ownership (same as update)
    const { data: link, error: linkError } = await supabase
      .from("linktree_links")
      .select(`
        id,
        linktree_profiles!inner (
          user_id,
          user_profiles!inner (clerk_user_id)
        )
      `)
      .eq("id", linkId)
      .single();

    if (linkError || !link) {
      return { success: false, message: "Link not found" };
    }

    const profiles = link.linktree_profiles as any;
    if (profiles.user_profiles.clerk_user_id !== clerkUser.id) {
      return { success: false, message: "Unauthorized" };
    }

    // Delete link
    const { error } = await supabase
      .from("linktree_links")
      .delete()
      .eq("id", linkId);

    if (error) {
      return { success: false, message: error.message };
    }

    return { success: true };
  } catch (error: any) {
    return { success: false, message: error.message };
  }
};

export const reorderLinktreeLinks = async (linkIds: number[]) => {
  try {
    const clerkUser = await currentUser();
    if (!clerkUser) {
      return { success: false, message: "User not authenticated" };
    }

    // Update each link with new order
    const promises = linkIds.map((linkId, index) =>
      supabase
        .from("linktree_links")
        .update({ display_order: index })
        .eq("id", linkId)
    );

    await Promise.all(promises);

    return { success: true };
  } catch (error: any) {
    return { success: false, message: error.message };
  }
};

export const checkUsernameAvailability = async (username: string) => {
  try {
    const usernameValidation = validateUsername(username);
    if (!usernameValidation.isValid) {
      return { success: false, message: usernameValidation.error };
    }

    const { data, error } = await supabase
      .from("linktree_profiles")
      .select("id")
      .eq("username", username.toLowerCase())
      .single();

    if (data) {
      return { success: false, message: "Username is already taken" };
    }

    return { success: true, message: "Username is available" };
  } catch (error: any) {
    return { success: true, message: "Username is available" }; // If no record found, it's available
  }
};
