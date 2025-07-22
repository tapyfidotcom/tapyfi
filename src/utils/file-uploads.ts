"use server";

import supabase from "@/config/supabase-config";

export const uploadFileAndGetUrl = async (file: File) => {
  try {
    const fileName = file.name + Date.now();
    const { data, error } = await supabase.storage
      .from("default")
      .upload(fileName, file);
    if (error) {
      throw new Error(error.message);
    }

    const { data: urlResponse } = await supabase.storage
      .from("default")
      .getPublicUrl(fileName);

    return {
      success: true,
      url: urlResponse.publicUrl,
    };
  } catch (error: any) {
    return {
      success: false,
      message: error.message,
    };
  }
};
