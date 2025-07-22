"use server";

import supabase from "@/config/supabase-config";

export const addNewAddress = async (payload: any) => {
  try {
    const { data, error } = await supabase.from("addresses").insert([payload]);
    if (error) {
      throw new Error(error.message);
    }
    return {
      success: true,
      message: "Address added successfully",
    };
  } catch (error: any) {
    return {
      success: false,
      message: error.message,
    };
  }
};

export const getAddressesByUserId = async (userId: string) => {
  try {
    const { data, error } = await supabase
      .from("addresses")
      .select("*")
      .eq("user_id", userId);
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
}