import React, { useEffect } from "react";
import Header from "./components/header";
import toast from "react-hot-toast";
import { getCurrentUserFromSupabase } from "@/actions/users";
import Spinner from "@/components/ui/spinner";
import usersGlobalStore, {
  IUsersGlobalStore,
} from "@/global-store/users-store";
import { usePathname } from "next/navigation";

function PrivateLayout({ children }: { children: React.ReactNode }) {
  const pathname = usePathname();
  const { user, setUser } = usersGlobalStore() as IUsersGlobalStore;
  const [loading, setLoading] = React.useState(false);

  const fetchUser = async () => {
    try {
      setLoading(true);
      const response = await getCurrentUserFromSupabase();
      if (!response.success) {
        toast.error("An error occurred while fetching user");
      } else {
        setUser(response.data);
      }
    } catch (error) {
      toast.error("An error occurred while fetching user");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    if (!user) {
      fetchUser();
    }
  }, [pathname]);

  if (loading) {
    return <Spinner />;
  }

  return (
    <div>
      <Header user={user!} />
      <div className="p-5">{children}</div>
    </div>
  );
}

export default PrivateLayout;
