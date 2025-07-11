"use server";

import supabase from "@/config/supabase-config";

export const addNewProduct = async (payload: any) => {
  try {
    const { error } = await supabase.from("products").insert([payload]);
    if (error) {
      throw new Error(error.message);
    }
    return {
      success: true,
      message: "Product added successfully",
    };
  } catch (error: any) {
    return {
      success: false,
      message: error.message,
    };
  }
};

export const getProductsBySellerId = async (sellerId: string) => {
  try {
    const { data, error } = await supabase
      .from("products")
      .select("*")
      .eq("seller_id", sellerId)
      .order("created_at", { ascending: false });
    if (error) {
      throw new Error(error.message);
    }
    return {
      success: true,
      data: data,
    };
  } catch (error: any) {
    return {
      success: false,
      message: error.message,
    };
  }
};

export const getProductById = async (productId: string) => {
  try {
    const { data, error } = await supabase
      .from("products")
      .select("*")
      .eq("id", productId);
    if (error) {
      throw new Error(error.message);
    }
    return {
      success: true,
      data: data,
    };
  } catch (error: any) {
    return {
      success: false,
      message: error.message,
    };
  }
};

export const editProductById = async (productId: string, payload: any) => {
  try {
    const { error } = await supabase
      .from("products")
      .update(payload)
      .eq("id", productId);
    if (error) {
      throw new Error(error.message);
    }
    return {
      success: true,
      message: "Product updated successfully",
    };
  } catch (error: any) {
    return {
      success: false,
      message: error.message,
    };
  }
};

export const deleteProductById = async (productId: number) => {
  try {
    const { error } = await supabase
      .from("products")
      .delete()
      .eq("id", productId);
    if (error) {
      throw new Error(error.message);
    }
    return {
      success: true,
      message: "Product deleted successfully",
    };
  } catch (error: any) {
    return {
      success: false,
      message: error.message,
    };
  }
};

export const getAllProducts = async ({
  category,
  searchText,
  sortBy,
}: {
  category: string;
  searchText: string;
  sortBy: string;
}) => {
  try {
    // for now ignoring category , searchText and sortBy

    let orderBy = {
      column: "created_at",
      ascending: false,
    };

    if (sortBy === "price_low_to_high") {
      orderBy = {
        column: "price",
        ascending: true,
      };
    }

    if (sortBy === "price_high_to_low") {
      orderBy = {
        column: "price",
        ascending: false,
      };
    }

    const { data, error } = await supabase
      .from("products")
      .select("* , user_profiles(name)")
      .ilike("name", `%${searchText}%`)
      .ilike("category", `%${category}%`)
      .order(orderBy.column, {
        ascending: orderBy.ascending,
      });
    if (error) {
      throw new Error(error.message);
    }

    return {
      success: true,
      data: data,
    };
  } catch (error: any) {
    return {
      success: false,
      message: error.message,
    };
  }
};
