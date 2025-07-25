import React, { useMemo } from "react";
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
} from "lucide-react";
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group";
import { usePathname, useRouter } from "next/navigation";
import { Label } from "@/components/ui/label";
import { Button } from "@/components/ui/button";
import { useAuth } from "@clerk/nextjs";
import toast from "react-hot-toast";
import usersGlobalStore, {
  IUsersGlobalStore,
} from "@/global-store/users-store";

interface IMenuItems {
  openMenuItems: boolean;
  setOpenMenuItems: React.Dispatch<React.SetStateAction<boolean>>;
}

function MenuItems({ openMenuItems, setOpenMenuItems }: IMenuItems) {
  const { user } = usersGlobalStore() as IUsersGlobalStore;
  const [selectedRole, setSelectedRole] = React.useState("user");
  const [loading, setLoading] = React.useState(false);
  const pathname = usePathname();
  const router = useRouter();
  const iconSize = 16;

  const { signOut } = useAuth();

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

  const userMenuItems = [
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
    {
      name: "Profile",
      route: "/user/profile",
      icon: <User2 size={iconSize} />,
    },
  ];

  const sellerMenuItems = [
    {
      name: "Products",
      route: "/seller/products",
      icon: <ShoppingBag size={iconSize} />,
    },
    {
      name: "Orders",
      route: "/seller/orders",
      icon: <List size={iconSize} />,
    },
  ];

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
      icon: <User2 size={iconSize} />,
    },
    {
      name: "Sellers",
      route: "/admin/sellers",
      icon: <Gem size={iconSize} />,
    },
  ];

  let userRoles = [
    {
      name: "User",
      value: "user",
    },
    {
      name: "Seller",
      value: "seller",
    },
    {
      name: "Admin",
      value: "admin",
    },
  ];

  // ---- Prevent error when user is null -----
  if (user) {
    if (!user.is_seller) {
      userRoles = userRoles.filter((role) => role.value !== "seller");
    }
    if (!user.is_admin) {
      userRoles = userRoles.filter((role) => role.value !== "admin");
    }
  } else {
    // If user is not loaded, show only User role (optional, or show nothing/spinner)
    userRoles = userRoles.filter((role) => role.value === "user");
  }

  // just for testing
  let menuItemsToRender = useMemo(() => {
    if (selectedRole === "user") {
      return userMenuItems;
    } else if (selectedRole === "seller") {
      return sellerMenuItems;
    }
    return adminMenuItems;
  }, [selectedRole]);

  // ----- Handle null user -----
  if (!user) {
    return (
      <Sheet open={openMenuItems} onOpenChange={() => setOpenMenuItems(false)}>
        <SheetContent>
          <SheetHeader>
            <SheetTitle>Loading...</SheetTitle>
          </SheetHeader>
        </SheetContent>
      </Sheet>
    );
  }

  return (
    <Sheet open={openMenuItems} onOpenChange={() => setOpenMenuItems(false)}>
      <SheetContent>
        <SheetHeader>
          <SheetTitle></SheetTitle>
        </SheetHeader>

        {userRoles.length > 1 && (
          <div className="flex flex-col gap-1 mt-10">
            <h3 className="text-sm font-semibold text-gray-500">Select Role</h3>
            <RadioGroup
              defaultValue={selectedRole}
              className="flex flex-row gap-5"
              onValueChange={(value) => setSelectedRole(value as string)}
            >
              {userRoles.map((role, index) => (
                <div className="flex items-center space-x-2" key={index}>
                  <RadioGroupItem value={role.value} id={role.value} />
                  <Label htmlFor={role.value}>{role.name}</Label>
                </div>
              ))}
            </RadioGroup>
          </div>
        )}
        <div className="flex flex-col gap-10 mt-10">
          {menuItemsToRender.map((item, index) => (
            <div
              className={`flex gap-5 p-3 rounded-md cursor-pointer items-center
             ${
               pathname === item.route
                 ? "bg-gray-100 border border-gray-500 text-primary"
                 : ""
             }
            `}
              key={index}
              onClick={() => {
                router.push(item.route);
                setOpenMenuItems(false);
              }}
            >
              {item.icon}
              <span className="text-sm">{item.name}</span>
            </div>
          ))}

          <Button onClick={onSignOut} disabled={loading}>
            Sign Out
          </Button>
        </div>
      </SheetContent>
    </Sheet>
  );
}

export default MenuItems;
