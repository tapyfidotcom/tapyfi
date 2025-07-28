import React from "react";
import {
  Sheet,
  SheetContent,
  SheetHeader,
  SheetTitle,
} from "@/components/ui/sheet";
import {
  Gem,
  LayoutDashboardIcon,
  List,
  Map,
  ShoppingBag,
  ShoppingCart,
  User2,
  Moon,
  Sun,
  LogOut,
  Users,
  Package,
  QrCode,
  Wallet,
  Mail,
} from "lucide-react";
import { usePathname, useRouter } from "next/navigation";
import { Button } from "@/components/ui/button";
import { Switch } from "@/components/ui/switch";
import { useAuth } from "@clerk/nextjs";
import toast from "react-hot-toast";
import usersGlobalStore, {
  IUsersGlobalStore,
} from "@/global-store/users-store";
import { useTheme } from "@/components/theme-provider";

interface IMenuItems {
  openMenuItems: boolean;
  setOpenMenuItems: React.Dispatch<React.SetStateAction<boolean>>;
}

function MenuItems({ openMenuItems, setOpenMenuItems }: IMenuItems) {
  const { user } = usersGlobalStore() as IUsersGlobalStore;
  const [loading, setLoading] = React.useState(false);
  const pathname = usePathname();
  const router = useRouter();
  const { signOut } = useAuth();
  
  // Fix: Destructure setTheme from useTheme hook
  const { isDark, toggleTheme, setTheme } = useTheme();
  const iconSize = 20;

  const onSignOut = async () => {
    try {
      setLoading(true);
      await signOut();
      toast.success("Signed out successfully");
      router.push("/");
    } catch (error) {
      toast.error("Failed to sign out");
    } finally {
      setLoading(false);
    }
  };

  // Admin menu items
  const adminMenuItems = [
    {
      name: "Dashboard",
      route: "/admin/dashboard",
      icon: <LayoutDashboardIcon size={iconSize} />,
    },
    {
      name: "Orders",
      route: "/admin/orders",
      icon: <List size={iconSize} />,
    },
    {
      name: "Users",
      route: "/admin/users",
      icon: <Users size={iconSize} />,
    },
    {
      name: "Sellers",
      route: "/admin/sellers",
      icon: <Gem size={iconSize} />,
    },
  ];

  // Seller menu items
  const sellerMenuItems = [
    {
      name: "Products",
      route: "/seller/products",
      icon: <Package size={iconSize} />,
    },
    {
      name: "Orders",
      route: "/seller/orders",
      icon: <List size={iconSize} />,
    },
  ];

  // User profile menu items
  const userProfileMenuItems = [
    {
      name: "Profile",
      route: "/user/profile",
      icon: <User2 size={iconSize} />,
    },
    {
      name: "Activate QR/NFC",
      route: "/user/activate-qr",
      icon: <QrCode size={iconSize} />,
    },
    {
      name: "Add to Wallet",
      route: "/user/wallet",
      icon: <Wallet size={iconSize} />,
    },
    {
      name: "Make QR",
      route: "/user/make-qr",
      icon: <QrCode size={iconSize} />,
    },
    {
      name: "Email Signature",
      route: "/user/email-signature",
      icon: <Mail size={iconSize} />,
    },
  ];

  // E-commerce menu items
  const ecommerceMenuItems = [
    {
      name: "Shop",
      route: "/user/shop",
      icon: <ShoppingBag size={iconSize} />,
    },
    {
      name: "Cart",
      route: "/user/cart",
      icon: <ShoppingCart size={iconSize} />,
    },
    {
      name: "Orders",
      route: "/user/orders",
      icon: <List size={iconSize} />,
    },
    {
      name: "Addresses",
      route: "/user/addresses",
      icon: <Map size={iconSize} />,
    },
  ];

  if (!user) {
    return (
      <Sheet open={openMenuItems} onOpenChange={() => setOpenMenuItems(false)}>
        <SheetContent className="w-[300px] sm:w-[400px]">
          <SheetHeader>
            <SheetTitle>Loading...</SheetTitle>
          </SheetHeader>
        </SheetContent>
      </Sheet>
    );
  }

  const renderMenuItem = (item: any, index: number) => (
    <div
      key={index}
      className={`flex items-center gap-3 p-3 rounded-lg cursor-pointer transition-all duration-200 hover:bg-accent
        ${
          pathname === item.route
            ? "bg-primary/10 border border-primary/20 text-primary"
            : "hover:bg-accent"
        }
      `}
      onClick={() => {
        router.push(item.route);
        setOpenMenuItems(false);
      }}
    >
      <div className={`${pathname === item.route ? "text-primary" : "text-muted-foreground"}`}>
        {item.icon}
      </div>
      <span className="text-sm font-medium">{item.name}</span>
    </div>
  );

  return (
    <Sheet open={openMenuItems} onOpenChange={() => setOpenMenuItems(false)}>
      <SheetContent className="w-[300px] sm:w-[400px] overflow-y-auto">
        <SheetHeader className="border-b border-border pb-4">
          <div className="flex items-center gap-3">
            <div className="w-12 h-12 rounded-full overflow-hidden bg-muted">
              {user.profile_pic ? (
                <img 
                  src={user.profile_pic} 
                  alt={user.name}
                  className="w-full h-full object-cover"
                />
              ) : (
                <div className="w-full h-full flex items-center justify-center bg-primary/10">
                  <User2 size={24} className="text-primary" />
                </div>
              )}
            </div>
            <div>
              <SheetTitle className="text-left text-base">{user.name}</SheetTitle>
              <p className="text-sm text-muted-foreground text-left">{user.email}</p>
            </div>
          </div>
        </SheetHeader>

        <div className="space-y-6 mt-6">
          {/* Admin Section */}
          {user.is_admin && (
            <div className="space-y-1">
              <h3 className="text-sm font-semibold text-muted-foreground mb-3">
                Administration
              </h3>
              {adminMenuItems.map((item, index) => renderMenuItem(item, index))}
            </div>
          )}

          {/* Seller Section - Show for admin+seller or just seller */}
          {(user.is_admin && user.is_seller) && (
            <div className="space-y-1">
              <h3 className="text-sm font-semibold text-muted-foreground mb-3">
                Seller Management
              </h3>
              {sellerMenuItems.map((item, index) => renderMenuItem(item, index))}
            </div>
          )}

          {/* Seller Only Section */}
          {(user.is_seller && !user.is_admin) && (
            <div className="space-y-1">
              <h3 className="text-sm font-semibold text-muted-foreground mb-3">
                Seller Tools
              </h3>
              {sellerMenuItems.map((item, index) => renderMenuItem(item, index))}
            </div>
          )}

          {/* User Profile Section - Show for regular users only */}
          {(!user.is_admin && !user.is_seller) && (
            <>
              <div className="space-y-1">
                <h3 className="text-sm font-semibold text-muted-foreground mb-3">
                  Administration
                </h3>
                {userProfileMenuItems.map((item, index) => renderMenuItem(item, index))}
              </div>

              <div className="space-y-1">
                <h3 className="text-sm font-semibold text-muted-foreground mb-3">
                  E-commerce
                </h3>
                {ecommerceMenuItems.map((item, index) => renderMenuItem(item, index))}
              </div>
            </>
          )}

          {/* General Settings */}
          <div className="space-y-1">
            <h3 className="text-sm font-semibold text-muted-foreground mb-3">General</h3>
            
            {/* Dark Mode Toggle - Fixed Version */}
            <div className="flex items-center justify-between p-3 rounded-lg hover:bg-accent transition-colors">
              <div className="flex items-center gap-3">
                {isDark ? (
                  <Moon size={iconSize} className="text-muted-foreground" />
                ) : (
                  <Sun size={iconSize} className="text-muted-foreground" />
                )}
                <span className="text-sm font-medium">Dark Mode</span>
              </div>
              
              {/* Custom Toggle Switch that persists on refresh */}
              <div 
                className={`relative inline-flex h-6 w-11 items-center rounded-full transition-colors cursor-pointer ${
                  isDark ? 'bg-primary' : 'bg-gray-300'
                }`}
                onClick={(e) => {
                  e.stopPropagation();
                  toggleTheme();
                }}
              >
                <span
                  className={`inline-block h-4 w-4 transform rounded-full bg-white transition-transform ${
                    isDark ? 'translate-x-6' : 'translate-x-1'
                  }`}
                />
              </div>
            </div>
          </div>

          {/* Logout Button */}
          <div className="pt-4 border-t border-border">
            <Button 
              onClick={onSignOut} 
              disabled={loading}
              variant="outline"
              className="w-full justify-start gap-3 h-12"
            >
              <LogOut size={iconSize} />
              {loading ? "Signing out..." : "Log Out"}
            </Button>
          </div>
        </div>
      </SheetContent>
    </Sheet>
  );
}

export default MenuItems;
