"use client";
import { getOrderedItemsOfSeller } from "@/actions/orders";
import PageTitle from "@/components/ui/page-title";
import Spinner from "@/components/ui/spinner";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import usersGlobalStore, {
  IUsersGlobalStore,
} from "@/global-store/users-store";
import dayjs from "dayjs";
import React from "react";
import toast from "react-hot-toast";

function SellerOrdersPage() {
  const [items, setItems] = React.useState([]);
  const { user } = usersGlobalStore() as IUsersGlobalStore;
  const [loading, setLoading] = React.useState(true);
  const fetchData = async () => {
    try {
      setLoading(true);
      const response: any = await getOrderedItemsOfSeller(user.id);
      if (response.success) {
        setItems(response.data);
      } else {
        toast.error(response.message);
      }
    } catch (error: any) {
      toast.error(error.message);
    } finally {
      setLoading(false);
    }
  };

  React.useEffect(() => {
    fetchData();
  }, []);

  const columns = [
    "Order ID",
    "Item",
    "Quantity",
    "Unit Price",
    "Total Price",
    "Ordered At",
  ];

  return (
    <div>
      <PageTitle title="Ordered Items" />

      {loading && <Spinner height={120} />}

      {items.length === 0 && !loading && <div>No orders found</div>}

      {items.length > 0 && (
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
            {items.map((item: any) => (
              <TableRow key={item.name}>
                <TableCell>{item.order_id}</TableCell>
                <TableCell className="font-medium">{item.name}</TableCell>
                <TableCell>{item.quantity}</TableCell>
                <TableCell>$ {item.price}</TableCell>
                <TableCell>$ {item.total}</TableCell>
                <TableCell>
                  {dayjs(item.created_at).format("MMM DD, YYYY hh:mm A")}
                </TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
      )}
    </div>
  );
}

export default SellerOrdersPage;
