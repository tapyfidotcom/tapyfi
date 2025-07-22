"use server";

import supabase from "@/config/supabase-config";
const stripe = require("stripe")(process.env.STRIPE_SECRET_KEY);

export const saveOrderAndOrderItems = async ({
  orderPayload,
  items,
}: {
  orderPayload: any;
  items: any[];
}) => {
  try {
    // step 1 : save the order and get the order id
    const { data, error } = await supabase
      .from("orders")
      .insert([orderPayload])
      .select("id");
    // step 2 : ad order_id to each item and save the items to order_items table

    if (data?.length) {
      const itemsArrayForTable = items.map((item) => ({
        seller_id: item.seller_id,
        order_id: data[0].id,
        product_id: item.id,
        name: item.name,
        price: item.price,
        quantity: item.quantity,
        image: item.images[0],
        total: item.price * item.quantity,
      }));

      const { error } = await supabase
        .from("order_items")
        .insert(itemsArrayForTable);
      if (error) {
        return {
          success: false,
          message: error.message,
        };
      }

      return {
        success: true,
        message: "Order saved successfully",
      };
    }
  } catch (error: any) {
    return {
      success: false,
      message: error.message,
    };
  }
};

export const getOrdersOfUser = async (userId: string) => {
  try {
    const { data, error } = await supabase
      .from("orders")
      .select("* , order_items(*) , addresses(*)")
      .eq("customer_id", userId);
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

export const getOrderedItemsOfSeller = async (sellerId: string) => {
  try {
    const { data, error } = await supabase
      .from("order_items")
      .select("*")
      .eq("seller_id", sellerId);
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

export const cancelOrder = async (orderId: number, paymentId: string) => {
  try {
    const { data, error } = await supabase
      .from("orders")
      .update({ order_status: "cancelled" })
      .eq("id", orderId);
    if (error) {
      throw new Error(error.message);
    }

    // if refund is needed , do it here
    const refund = await stripe.refunds.create({
      payment_intent: paymentId,
    });

    if (refund.error) {
      throw new Error(refund.error.message);
    }

    return {
      success: true,
      message: "Order cancelled successfully",
    };
  } catch (error: any) {
    return {
      success: false,
      message: error.message,
    };
  }
};

export const getAllOrders = async () => {
  try {
    const { data, error } = await supabase
      .from("orders")
      .select("* , order_items(*) , addresses(*) , user_profiles(*)");
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
}

export const markOrderAsDelivered = async (orderId: number) => {
  try {
    const { data, error } = await supabase
      .from("orders")
      .update({ order_status: "delivered" })
      .eq("id", orderId);
    if (error) {
      throw new Error(error.message);
    }
    return {
      success: true,
      message: "Order marked as delivered",
    };
  } catch (error: any) {
    return {
      success: false,
      message: error.message,
    };
  }
}

export const getOrdersReport = async () => {
  try {
    
    // get total orders count , total sales , total products sold
    const { data, error } = await supabase.rpc("get_orders_report");

  } catch (error: any) {
    return {
      success: false,
      message: error.message,
    }
    
  }
}