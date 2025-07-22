"use client";
import React, { useEffect } from "react";
import PageTitle from "@/components/ui/page-title";
import { IUser } from "@/interfaces";
import toast from "react-hot-toast";
import { getAllUsers } from "@/actions/users";
import Spinner from "@/components/ui/spinner";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import dayjs from "dayjs";
import { Switch } from "@/components/ui/switch";

function AdminUsersPage() {
  const [loading, setLoading] = React.useState(true);
  const [users, setUsers] = React.useState<IUser[]>([]);

  const onActiveChange = async (id: string, isActive: boolean) => {
    try {
        // this is an assignment
    } catch (error) {
        
    }
  }

  const fetchData = async () => {
    try {
      setLoading(true);
      const response: any = await getAllUsers({ roleType: "user" });
      if (response.success) {
        setUsers(response.data);
      } else {
        toast.error(response.message);
      }
    } catch (error) {
      toast.error("Failed to fetch users");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchData();
  }, []);

  const columns = [
    "User ID",
    "Name",
    "Email",
    "Clerk User ID",
    "Created At",
    "Is Active",
  ];
  return (
    <div>
      <PageTitle title="Users" />

      {loading && <Spinner height={120} />}

      {!loading && users.length > 0 && (
        <Table className="mt-7">
          <TableHeader className="bg-gray-200">
            <TableRow>
              {columns.map((column, index) => (
                <TableHead className="font-bold" key={index}>
                  {column}
                </TableHead>
              ))}
            </TableRow>
          </TableHeader>
          <TableBody>
            {users.map((item: IUser) => (
              <TableRow key={item.name}>
                <TableCell>{item.id}</TableCell>
                <TableCell>{item.name}</TableCell>
                <TableCell>{item.email}</TableCell>
                <TableCell>{item.clerk_user_id}</TableCell>
                <TableCell>
                  {dayjs(item.created_at).format("MMM DD , YYYY hh:mm A")}
                </TableCell>
                <TableCell>
                  <Switch
                    checked={item.is_active}
                    onCheckedChange={(checked) => onActiveChange(item.id, checked)}
                  />
                </TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
      )}
    </div>
  );
}

export default AdminUsersPage;
