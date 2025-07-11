import { IUser } from "@/interfaces";
import { Menu, ShoppingCart } from "lucide-react";
import React from "react";
import MenuItems from "./menu-items";
import { Button } from "@/components/ui/button";
import productsCartStore, {
  IProductsCartStore,
} from "@/global-store/products-cart-store";
import { useRouter } from "next/navigation";

function Header({ user }: { user: IUser }) {
  const [openMenuItems, setOpenMenuItems] = React.useState(false);
  const { items } = productsCartStore() as IProductsCartStore;
  const totalItemsCount = items.reduce((acc, item) => acc + item.quantity, 0);
  const router = useRouter();
  return (
    <div className="bg-primary p-5 flex justify-between items-center">
      <div className="p-2 bg-white rounded-2xl flex items-center">
        <img
          src="https://next-supa-agri-marketplace.vercel.app/hero.jpg"
          className="w-8 h-8 object-contain"
        />
      </div>

      <div className="flex items-center gap-5">
        <h1 className="text-sm text-white">{user?.name}</h1>
        {totalItemsCount > 0 && (
          <div
            className="flex cursor-pointer"
            onClick={() => router.push("/user/cart")}
          >
            <ShoppingCart size={20} className="text-white cursor-pointer" />
            <div className="w-4 h-4 bg-white rounded text-primary flex items-center justify-center text-xs -mt-2 -mr-2">
              {totalItemsCount}
            </div>
          </div>
        )}
        <Button onClick={() => setOpenMenuItems(true)}>
          <Menu size={14} className="text-white cursor-pointer" />
        </Button>
      </div>

      {openMenuItems && (
        <MenuItems
          openMenuItems={openMenuItems}
          setOpenMenuItems={setOpenMenuItems}
        />
      )}
    </div>
  );
}

export default Header;
