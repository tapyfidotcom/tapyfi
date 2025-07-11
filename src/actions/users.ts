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
      data,
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
    // check if clerk user is already saved in supabase , if yes return the user or else save the user in supabase
    const clerkUser = await currentUser();

    const { data, error } = await supabase
      .from("user_profiles")
      .select("*")
      .eq("clerk_user_id", clerkUser?.id);

    if (error) {
      throw new Error(error.message);
    }

    if (data && data.length > 0) {
      return {
        success: true,
        data: data[0],
      };
    }

    const newUserResponse = await saveClerkUserToSubabase(clerkUser);

    if (!newUserResponse.success) {
      throw new Error(newUserResponse.message);
    }

    return {
      success: true,
      data: newUserResponse.data,
    };
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
    // check if the user is already present in the user_profiles table , is_seller value is true
    const { data, error } = await supabase
      .from("user_profiles")
      .select("*")
      .eq("email", email);
    if (error) {
      throw new Error(error.message);
    }

    if (data.length > 0) {
      const row = data[0];
      if (row.is_seller) {
        throw new Error("Seller already exists");
      } else {
        const { data, error } = await supabase
          .from("user_profiles")
          .update({ is_seller: true })
          .eq("email", email);
        if (error) {
          throw new Error(error.message);
        }
        return {
          success: true,
          message: "Seller added successfully",
        };
      }
    }

    return {
      success: false,
      message: "Seller not found",
    };
  } catch (error: any) {
    return {
      success: false,
      message: error.message,
    };
  }
};
