"use client";
import { Button } from "@/components/ui/button";
import PageTitle from "@/components/ui/page-title";
import productsCartStore, {
  IProductsCartStore,
} from "@/global-store/products-cart-store";
import usersGlobalStore, {
  IUsersGlobalStore,
} from "@/global-store/users-store";
import { IProduct } from "@/interfaces";
import { Minus, Plus } from "lucide-react";
import { useRouter } from "next/navigation";
import React from "react";
import toast from "react-hot-toast";

function UserCartPage() {
  const { user } = usersGlobalStore() as IUsersGlobalStore;
  const {
    items,
    addProductToCart,
    updateProductQuantity,
    deleteProductFromCart,
    clearCart,
  } = productsCartStore() as IProductsCartStore;
  const router = useRouter();

  const handleAddToCart = (product: IProduct) => {
    try {
      const newQuantity = product.quantity + 1;
      updateProductQuantity(product.id, newQuantity);
    } catch (error) {
      toast.error("Failed to add product to cart");
    }
  };

  const handleRemoveFromCart = (product: IProduct) => {
    try {
      if (product.quantity === 1) {
        deleteProductFromCart(product.id);
      } else {
        const newQuantity = product.quantity - 1;
        updateProductQuantity(product.id, newQuantity);
      }
    } catch (error) {
      toast.error("Failed to remove product from cart");
    }
  };

  const renderAmountProperty = (label: string, value: number) => (
    <div className="flex justify-between">
      <span className="text-sm">{label}</span>
      <span className="text-sm font-semibold">${value.toFixed(2)}</span>
    </div>
  );

  let subTotal = 0;
  items.forEach((item) => {
    subTotal += item.price * item.quantity;
  });

  let deliveryFeeAndTax = subTotal * 0.1;

  return (
    <div>
      <PageTitle title="Cart" />

      <div className="grid grid-cols-4 gap-5 mt-7 items-start">
        <div className="col-span-3">
          <div className="grid grid-cols-7 bg-gray-100 p-2 text-sm border rounded">
            <span className="col-span-3">Product</span>
            <span className="col-span-2">Quantity</span>
            <span className="col-span-1">Price</span>
            <span className="col-span-1">Total</span>
          </div>

          <div className="flex flex-col gap-5">
            {items.map((item) => (
              <div className="grid grid-cols-7 p-2 items-center" key={item.id}>
                <div className="flex items-center col-span-3 gap-5">
                  <img
                    src={item.images[0]}
                    alt=""
                    className="w-20 h-20 object-contain"
                  />
                  <span className="text-sm text-gray-600">{item.name}</span>
                </div>

                <div className="flex gap-5 items-center col-span-2">
                  <Button
                    variant={"secondary"}
                    size={"icon"}
                    onClick={() => handleRemoveFromCart(item)}
                    disabled={item.quantity === 0}
                  >
                    <Minus size={15} />
                  </Button>

                  <span className="font-bold text-sm text-primary">
                    {" "}
                    {item.quantity}
                  </span>

                  <Button
                    variant={"secondary"}
                    size={"icon"}
                    onClick={() => handleAddToCart(item)}
                  >
                    <Plus size={15} />
                  </Button>
                </div>

                <span>${item.price}</span>

                <span>${item.price * item.quantity}</span>

                <div className="col-span-7">
                  <hr className="border border-gray-200 my-2" />
                </div>
              </div>
            ))}

            {items.length === 0 && (
              <div className="text-center text-gray-500 text-sm mt-7">
                Your cart is empty
              </div>
            )}
          </div>

          {items.length > 0 && (
            <div className="flex justify-end">
              <span
                className="text-sm underline cursor-pointer"
                onClick={clearCart}
              >
                Clear Cart
              </span>
            </div>
          )}
        </div>
        <div className="col-span-1 p-5 border border-gray-300 rounded flex flex-col gap-1">
          {renderAmountProperty("Subtotal", subTotal)}
          {renderAmountProperty("Delivery Fee & Tax", deliveryFeeAndTax)}
          {renderAmountProperty("Total", subTotal + deliveryFeeAndTax)}

          <Button
            className="w-full mt-5"
            disabled={items.length === 0}
            onClick={() => router.push("/user/checkout")}
          >
            Proceed to Checkout
          </Button>
        </div>
      </div>
    </div>
  );
}

export default UserCartPage;
