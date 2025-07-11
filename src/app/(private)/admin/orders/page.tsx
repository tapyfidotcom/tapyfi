"use client";
import { getAllOrders, getOrdersOfUser } from "@/actions/orders";
import { Button } from "@/components/ui/button";
import PageTitle from "@/components/ui/page-title";
import Spinner from "@/components/ui/spinner";
import usersGlobalStore, {
  IUsersGlobalStore,
} from "@/global-store/users-store";
import { IOrderItem } from "@/interfaces";
import dayjs from "dayjs";
import React, { useEffect } from "react";
import toast from "react-hot-toast";
import OrderDetails from "../../user/orders/_components/order-details";

function AdminOrdersPage() {
  const [loading, setLoading] = React.useState(true);
  const [orders, setOrders] = React.useState([]);
  const [selectedOrder, setSelectedOrder] = React.useState<IOrderItem | null>(
    null
  );
  const [openOrderDetails, setOpenOrderDetails] = React.useState(false);

  const fetchData = async () => {
    try {
      setLoading(true);
      const response: any = await getAllOrders();
      if (response.success) {
        console.log(response.data);
        setOrders(response.data);
      } else {
        toast.error(response.message);
      }
    } catch (error: any) {
      toast.error(error.message);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchData();
  }, []);

  const renderOrderProperty = (key: string, value: any) => {
    return (
      <div className="flex flex-col">
        <span className="text-xs text-gray-500 font-semibold">{key}</span>
        <span className="text-sm font-semibold capitalize">{value}</span>
      </div>
    );
  };

  return (
    <div>
      <PageTitle title="All Orders" />

      {loading && <Spinner height={120} />}

      {!loading && !orders.length && (
        <div className="text-sm mt-7">No orders found</div>
      )}

      {!loading && (
        <div className="flex flex-col gap-7 mt-7">
          {orders.map((order: IOrderItem) => (
            <div
              key={order.id}
              className="p-5 rounded-lg border border-gray-300"
            >
              <div className="grid grid-cols-1 lg:grid-cols-4 md:grid-cols-2 gap-5">
                {renderOrderProperty("Order ID", order.id)}
                {renderOrderProperty("Customer Name", order.user_profiles.name)}
                {renderOrderProperty("Customer ID", order.user_profiles.id)}
                {renderOrderProperty(
                  "Order Date and Time",
                  dayjs(order.created_at).format("MMM DD, YYYY hh:mm A")
                )}
                {renderOrderProperty("Order Total", `$ ${order.total}`)}
                {renderOrderProperty("Order Status", order.order_status)}
              </div>

              <div className="mt-5">
                <h1 className="text-sm font-bold text-gray-600">Order Items</h1>
                <div className="mt-5 flex flex-col gap-5">
                  {order.order_items.map((item: any) => (
                    <div
                      className="flex gap-5 items-center border-l border-b border-gray-200 p-1"
                      key={item.name}
                    >
                      <img
                        src={item.image}
                        className="w-10 h-10 object-contain"
                      />

                      <div className="flex flex-col">
                        <h1 className="text-sm text-gray-700">
                          {item.name} * {item.quantity}
                        </h1>
                        <h1 className="font-bold text-primary text-sm">
                          Total : ${item.total}
                        </h1>
                      </div>
                    </div>
                  ))}
                </div>
              </div>

              <div className="flex justify-end gap-5 mt-5">
                <Button
                  onClick={() => {
                    setSelectedOrder(order);
                    setOpenOrderDetails(true);
                  }}
                >
                  View Details
                </Button>
              </div>
            </div>
          ))}
        </div>
      )}

      {openOrderDetails && selectedOrder && (
        <OrderDetails
          openOrderDetails={openOrderDetails}
          setOpenOrderDetails={setOpenOrderDetails}
          selectedOrder={selectedOrder}
          reloadData={fetchData}
        />
      )}
    </div>
  );
}

export default AdminOrdersPage;
