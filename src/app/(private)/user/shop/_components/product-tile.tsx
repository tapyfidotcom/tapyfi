"use client";
import { Button } from "@/components/ui/button";
import productsCartStore, {
  IProductsCartStore,
} from "@/global-store/products-cart-store";
import { IProduct } from "@/interfaces";
import { Minus, Plus } from "lucide-react";
import React from "react";
import toast from "react-hot-toast";

function ProductTile({ product }: { product: IProduct }) {
  const [showDescription, setShowDescription] = React.useState(false);
  const {
    items,
    addProductToCart,
    updateProductQuantity,
    deleteProductFromCart,
  } = productsCartStore() as IProductsCartStore;

  const productInCart = items.find((item) => item.id === product.id);
  let quantityInCart = productInCart ? productInCart.quantity : 0;

  const handleAddToCart = () => {
    try {
      if (productInCart) {
        const newQuantity = quantityInCart + 1;
        updateProductQuantity(product.id, newQuantity);
      } else {
        addProductToCart({
          ...product,
          quantity: 1,
        });
      }
    } catch (error) {
      toast.error("Failed to add product to cart");
    }
  };

  const handleRemoveFromCart = () => {
    try {
      if (quantityInCart === 1) {
        deleteProductFromCart(product.id);
      } else {
        const newQuantity = quantityInCart - 1;
        updateProductQuantity(product.id, newQuantity);
      }
    } catch (error) {
      toast.error("Failed to remove product from cart");
    }
  };

  return (
    <div className="p-5 border border-gray-300 rounded-lg">
      <h1 className="text-sm font-bold">{product.name}</h1>
      <p className="text-xs text-gray-500">
        Seller : {product.user_profiles.name}
      </p>
      <hr className="my-2 border border-gray-300" />

      <div
        className="h-40 flex justify-center items-center relative cursor-pointer"
        onMouseEnter={() => setShowDescription(true)}
        onMouseLeave={() => setShowDescription(false)}
      >
        <img
          src={product.images[0]}
          alt={product.name}
          className={`h-full object-contain transition-all duration-300 ${
            showDescription ? "opacity-30" : "opacity-100"
          }`}
        />
        <p
          className={`text-sm text-gray-200 absolute inset-0 flex justify-center items-center
             ${
               showDescription
                 ? "opacity-100 bg-black rounded bg-opacity-70 p-3"
                 : "opacity-0"
             }
            `}
        >
          {product.description}
        </p>
      </div>

      <div className="flex justify-between items-center mt-5">
        <h1 className="text-xl font-bold text-primary">$ {product.price}</h1>

        <div className="flex gap-5 items-center">
          <Button
            variant={"secondary"}
            size={"icon"}
            onClick={handleRemoveFromCart}
            disabled={quantityInCart === 0}
          >
            <Minus size={15} />
          </Button>

          {quantityInCart > 0 && (
            <span className="font-bold text-sm text-primary">
              {" "}
              {quantityInCart}{" "}
            </span>
          )}

          <Button variant={"secondary"} size={"icon"} onClick={handleAddToCart}>
            <Plus size={15} />
          </Button>
        </div>
      </div>
    </div>
  );
}

export default ProductTile;
