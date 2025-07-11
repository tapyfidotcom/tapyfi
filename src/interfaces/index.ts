export interface IUser {
  id: string;
  clerk_user_id: string;
  name: string;
  email: string;
  profile_pic: string;
  is_admin: boolean;
  is_active: boolean;
  is_seller: boolean;
  created_at: string;
}

export interface IProduct {
  id: number;
  seller_id: string;
  name: string;
  category: string;
  price: number;
  available_stock: number;
  description: string;
  created_at: string;
  images: string[];

  // runtime properties
  user_profiles: IUser;
  quantity: number;
}

export interface IAddress {
  id: number;
  name: string;
  email: string;
  phone_number: number;
  city: string;
  state: string;
  postal_code: number;
  address: string;
}

export interface IOrderItem {
  id: number;
  sub_total: number;
  tax_shipping_fee: number;
  total: number;
  payment_id: string;
  order_status: string;
  addresses: IAddress;
  user_profiles: IUser;
  order_items: {
    name: string;
    price: number;
    quantity: number;
    total: number;
    image: string;
  }[];
  created_at: string;
}
