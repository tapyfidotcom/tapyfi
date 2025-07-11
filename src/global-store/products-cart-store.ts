import { create } from "zustand";
import { IProduct } from "@/interfaces";

const productsCartStore = create((set, get: any) => ({
  items: [] as IProduct[],

  addProductToCart: (product: IProduct) => {
    const existingItems = [...get().items];
    existingItems.push(product);
    set({ items: existingItems });
  },

  updateProductQuantity: (productId: string, quantity: number) => {
    const existingItems = [...get().items];
    const newItems = existingItems.map((item) => {
      if (item.id === productId) {
        return { ...item, quantity };
      }
      return item;
    });
    set({ items: newItems });
  },

  deleteProductFromCart: (productId: string) => {
    const existingItems = [...get().items];
    const newItems = existingItems.filter((item) => item.id !== productId);
    set({ items: newItems });
  },

  clearCart: () => {
    set({ items: [] });
  },
}));

export default productsCartStore;

export interface IProductsCartStore {
  items: IProduct[];
  addProductToCart: (product: IProduct) => void;
  updateProductQuantity: (productId: number, quantity: number) => void;
  deleteProductFromCart: (productId: number) => void;
  clearCart: () => void;
}
