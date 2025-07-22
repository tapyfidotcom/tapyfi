import { IUser } from "@/interfaces";
import { Menu, ShoppingCart } from "lucide-react";
import React from "react";
import MenuItems from "./menu-items";
import { Button } from "@/components/ui/button";
import productsCartStore, {
  IProductsCartStore,
} from "@/global-store/products-cart-store";
import { useRouter } from "next/navigation";
import { UserButton } from "@clerk/nextjs";

function Header({ user }: { user: IUser }) {
  const [openMenuItems, setOpenMenuItems] = React.useState(false);
  const { items } = productsCartStore() as IProductsCartStore;
  const totalItemsCount = items.reduce((acc, item) => acc + item.quantity, 0);
  const router = useRouter();

  return (
    <div className="bg-black border-b border-gray-800 p-4 sm:p-5 flex justify-between items-center">
      {/* Brand Logo */}
      <div
        className="flex items-center cursor-pointer hover:opacity-80 transition-opacity"
        onClick={() => router.push("/")}
      >
        <h1 className="text-xl sm:text-2xl font-extrabold tracking-wide">
          <span className="text-emerald-400 drop-shadow-[0_0_10px_rgba(52,211,153,0.5)]">
            Tapy
          </span>
          <span className="text-violet-400 drop-shadow-[0_0_10px_rgba(167,139,250,0.5)]">
            Fi
          </span>
        </h1>
      </div>

      {/* User section */}
      <div className="flex items-center gap-3 sm:gap-6">
        {/* User info with gradient border */}
        {user && (
          <div className="hidden sm:flex items-center justify-center bg-gray-900 rounded-full pl-4 pr-1 py-1.5 border border-transparent bg-clip-padding relative">
            <div className="absolute inset-0 rounded-full bg-gradient-to-r from-orange-500 to-pink-500 -z-10 blur-[1px] opacity-50"></div>
            <span className="text-sm font-medium text-white mr-3">
              {user.name}
            </span>
            <div className="rounded-full overflow-hidden flex items-center justify-center">
              <UserButton />
            </div>
          </div>
        )}

        {/* Mobile view - just the avatar */}
        <div className="sm:hidden">
          <UserButton />
        </div>

        {/* Cart */}
        {totalItemsCount > 0 && (
          <div
            className="flex cursor-pointer relative group"
            onClick={() => router.push("/user/cart")}
          >
            <ShoppingCart
              size={20}
              className="text-gray-300 group-hover:text-emerald-400 transition-colors"
            />
            <div className="absolute -top-2 -right-2 w-5 h-5 bg-emerald-400 rounded-full flex items-center justify-center text-xs font-bold text-black shadow-[0_0_10px_rgba(52,211,153,0.5)]">
              {totalItemsCount}
            </div>
          </div>
        )}

        {/* Menu Button */}
        <Button
          onClick={() => setOpenMenuItems(true)}
          className="bg-gray-800 hover:bg-gray-700 border border-gray-600 hover:border-emerald-400 transition-all hover:shadow-[0_0_10px_rgba(52,211,153,0.3)]"
        >
          <Menu size={16} className="text-gray-300" />
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
