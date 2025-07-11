"use client";
import React, { useEffect } from "react";
import PageTitle from "@/components/ui/page-title";
import { IUser } from "@/interfaces";
import toast from "react-hot-toast";
import { addSeller, getAllUsers } from "@/actions/users";
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
import { Button } from "@/components/ui/button";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";

function AdminSellersPage() {
  const [loading, setLoading] = React.useState(true);
  const [sellers, setSellers] = React.useState<IUser[]>([]);
  const [openAddSellerDialog, setOpenAddSellerDialog] = React.useState(false);
  const [email, setEmail] = React.useState("");
  const [loadingForDialog, setLoadingForDialog] = React.useState(false);

  const fetchData = async () => {
    try {
      setLoading(true);
      const response: any = await getAllUsers({ roleType: "seller" });
      if (response.success) {
        setSellers(response.data);
      } else {
        toast.error(response.message);
      }
    } catch (error) {
      toast.error("Failed to fetch sellers");
    } finally {
      setLoading(false);
    }
  };

  const addSellerHandler = async () => {
    try {
      setLoadingForDialog(true);
      const response = await addSeller(email);
      if (response.success) {
        toast.success("Seller added successfully");
        setOpenAddSellerDialog(false);
        fetchData();
      } else {
        toast.error(response.message);
      }
    } catch (error: any) {
      toast.error(error.message);
    } finally {
      setLoadingForDialog(false);
    }
  };

  const onRemoveSellerAccess = async (email: string) => {
    // assignment
  }

  useEffect(() => {
    fetchData();
  }, []);

  const columns = ["Seller ID", "Name", "Email", "Created At" , "Actions"];
  return (
    <div>
      <div className="flex gap-5 justify-between items-center">
        <PageTitle title="Sellers" />
        <Button
         onClick={() => setOpenAddSellerDialog(true)}
        >Add seller</Button>
      </div>

      {loading && <Spinner height={120} />}

      {!loading && sellers.length > 0 && (
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
            {sellers.map((item: IUser) => (
              <TableRow key={item.name}>
                <TableCell>{item.id}</TableCell>
                <TableCell>{item.name}</TableCell>
                <TableCell>{item.email}</TableCell>
                <TableCell>
                  {dayjs(item.created_at).format("MMM DD , YYYY hh:mm A")}
                </TableCell>
                <TableCell>
                    <Button variant={'secondary'}>
                        Remove seller access
                    </Button>
                </TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
      )}

      <Dialog open={openAddSellerDialog} onOpenChange={setOpenAddSellerDialog}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Add Seller</DialogTitle>
            <DialogDescription>
              Enter the email address of the seller to add them to the platform.
            </DialogDescription>
          </DialogHeader>

          <Input
            placeholder="Email"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
          />

          <div className="flex justify-end gap-5">
            <Button variant={'outline'}>Close</Button>
            <Button disabled={loadingForDialog || !email} onClick={addSellerHandler}>
              Add Seller
            </Button>
          </div>
        </DialogContent>
      </Dialog>
    </div>
  );
}

export default AdminSellersPage;
