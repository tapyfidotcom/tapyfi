import { cancelOrder, markOrderAsDelivered } from "@/actions/orders";
import { Button } from "@/components/ui/button";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import usersGlobalStore, {
  IUsersGlobalStore,
} from "@/global-store/users-store";
import { IOrderItem } from "@/interfaces";
import React from "react";
import toast from "react-hot-toast";

interface IOrderDetailsProps {
  openOrderDetails: boolean;
  setOpenOrderDetails: (value: boolean) => void;
  selectedOrder: IOrderItem;
  reloadData: () => void;
}

function OrderDetails({
  openOrderDetails,
  setOpenOrderDetails,
  selectedOrder,
  reloadData,
}: IOrderDetailsProps) {
  const [loading, setLoading] = React.useState(false);
  const { user } = usersGlobalStore() as IUsersGlobalStore;
  const renderOrderProperty = (key: string, value: any) => {
    return (
      <div className="flex flex-col">
        <span className="text-xs text-gray-500 font-semibold">{key}</span>
        <span className="text-sm font-semibold capitalize">{value}</span>
      </div>
    );
  };

  const cancelOrderHandler = async () => {
    try {
      setLoading(true);
      const response = await cancelOrder(
        selectedOrder?.id,
        selectedOrder.payment_id
      );
      if (response.success) {
        toast.success(response.message);
        reloadData();
        setOpenOrderDetails(false);
      } else {
        toast.error(response.message);
      }
    } catch (error: any) {
      toast.error(error.message);
    } finally {
      setLoading(false);
    }
  };

  const markAsDeliveredHandler = async () => {
    try {
      setLoading(true);
      const response = await markOrderAsDelivered(selectedOrder?.id);
      if (response.success) {
        toast.success(response.message);
        reloadData();
        setOpenOrderDetails(false);
      } else {
        toast.error(response.message);
      }
    } catch (error: any) {
      toast.error(error.message);
       
    } finally {
      setLoading(false);
    }
  };

  return (
    <Dialog open={openOrderDetails} onOpenChange={setOpenOrderDetails}>
      <DialogContent className="lg:max-w-[1000px]">
        <DialogHeader>
          <DialogTitle>Order Details</DialogTitle>
        </DialogHeader>

        <hr className="my-3 border border-gray-200" />

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-5">
          {renderOrderProperty("Order ID", selectedOrder.id)}
          {renderOrderProperty("Customer Name", selectedOrder.addresses.name)}
          {renderOrderProperty("Customer Email", selectedOrder.addresses.email)}
          {renderOrderProperty(
            "Customer Phone",
            selectedOrder.addresses.phone_number
          )}
          {renderOrderProperty("City", selectedOrder.addresses.city)}
          {renderOrderProperty("State", selectedOrder.addresses.state)}
          {renderOrderProperty(
            "Postal Code",
            selectedOrder.addresses.postal_code
          )}

          <div className="col-span-3">
            {renderOrderProperty("Address", selectedOrder.addresses.address)}
          </div>
        </div>

        <hr className="my-3 border border-gray-200" />

        <div className="flex justify-end gap-5">
          {selectedOrder.order_status === "order_placed" && (
            <div className="flex gap-5">
              <Button
                variant={"outline"}
                onClick={cancelOrderHandler}
                disabled={loading}
              >
                Cancel Order
              </Button>

              {user.is_admin && (
                <Button
                  variant={"outline"}
                  onClick={markAsDeliveredHandler}
                  disabled={loading}
                >
                  Mark as Delivered
                </Button>
              )}
            </div>
          )}
          <Button disabled={loading} onClick={() => setOpenOrderDetails(false)}>
            Close
          </Button>
        </div>
      </DialogContent>
    </Dialog>
  );
}

export default OrderDetails;
