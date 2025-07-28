"use server";

import supabase from "@/config/supabase-config";
import { currentUser } from "@clerk/nextjs/server";

export const saveClerkUserToSubabase = async (clerkUser: any) => {
  try {
    const supabaseUserObj = {
      name: clerkUser.firstName + " " + clerkUser.lastName,
      email: clerkUser.emailAddresses[0].emailAddress,
      clerk_user_id: clerkUser.id,
      profile_pic: clerkUser.imageUrl || "",
      is_admin: false,
      is_seller: false,
      is_active: true,
    };

    const { data, error } = await supabase
      .from("user_profiles")
      .insert([supabaseUserObj])
      .select("*");
    
    if (error) {
      throw new Error(error.message);
    }

    return {
      success: true,
      data: data[0],
    };
  } catch (error: any) {
    return {
      success: false,
      message: error.message,
    };
  }
};

export const updateClerkUserInSupabase = async (clerkUser: any) => {
  try {
    const updatedUserObj = {
      name: clerkUser.firstName + " " + clerkUser.lastName,
      email: clerkUser.emailAddresses[0].emailAddress,
      profile_pic: clerkUser.imageUrl || "",
    };

    const { data, error } = await supabase
      .from("user_profiles")
      .update(updatedUserObj)
      .eq("clerk_user_id", clerkUser.id)
      .select("*");

    if (error) {
      throw new Error(error.message);
    }

    return {
      success: true,
      data: data[0],
    };
  } catch (error: any) {
    return {
      success: false,
      message: error.message,
    };
  }
};

export const getCurrentUserFromSupabase = async () => {
  try {
    const clerkUser = await currentUser();
    
    if (!clerkUser) {
      return {
        success: false,
        message: "No authenticated user found",
      };
    }

    const { data, error } = await supabase
      .from("user_profiles")
      .select("*")
      .eq("clerk_user_id", clerkUser.id);

    if (error) {
      throw new Error(error.message);
    }

    if (data && data.length > 0) {
      // Update user data if profile has changed
      const existingUser = data[0];
      const currentName = clerkUser.firstName + " " + clerkUser.lastName;
      const currentEmail = clerkUser.emailAddresses[0].emailAddress;
      const currentProfilePic = clerkUser.imageUrl || "";

      if (
        existingUser.name !== currentName ||
        existingUser.email !== currentEmail ||
        existingUser.profile_pic !== currentProfilePic
      ) {
        const updateResponse = await updateClerkUserInSupabase(clerkUser);
        if (updateResponse.success) {
          return {
            success: true,
            data: updateResponse.data,
          };
        }
      }

      return {
        success: true,
        data: existingUser,
      };
    }

    // Create new user if doesn't exist
    const newUserResponse = await saveClerkUserToSubabase(clerkUser);
    return newUserResponse;
  } catch (error: any) {
    return {
      success: false,
      message: error.message,
    };
  }
};

export const getAllUsers = async ({ roleType = "" }: { roleType: string }) => {
  try {
    let query = supabase
      .from("user_profiles")
      .select("*")
      .order("created_at", { ascending: false });

    if (roleType === "seller") {
      query = query.eq("is_seller", true).neq("is_admin", true);
    } else if (roleType === "user") {
      query = query.eq("is_seller", false).eq("is_admin", false);
    }

    const { data, error } = await query;

    if (error) {
      throw new Error(error.message);
    }

    return {
      success: true,
      data,
    };
  } catch (error: any) {
    return {
      success: false,
      message: error.message,
    };
  }
};

export const addSeller = async (email: string) => {
  try {
    const { data, error } = await supabase
      .from("user_profiles")
      .select("*")
      .eq("email", email);
    
    if (error) {
      throw new Error(error.message);
    }

    if (data.length > 0) {
      const user = data[0];
      if (user.is_seller) {
        throw new Error("User is already a seller");
      }

      const { error: updateError } = await supabase
        .from("user_profiles")
        .update({ is_seller: true })
        .eq("email", email);

      if (updateError) {
        throw new Error(updateError.message);
      }

      return {
        success: true,
        message: "Seller added successfully",
      };
    }

    return {
      success: false,
      message: "User not found",
    };
  } catch (error: any) {
    return {
      success: false,
      message: error.message,
    };
  }
};
