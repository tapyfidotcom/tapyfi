"use client";
import PageTitle from "@/components/ui/page-title";
import React, { useEffect } from "react";
import DashboardCard from "./_components/dashboard-card";
import toast from "react-hot-toast";
import { getUsersReport, getOrdersRevenueReport } from "@/actions/dashboard";

function AdminDashboardPage() {
  const [usersReport, setUsersReport] = React.useState({
    totalUsers: 0,
    totalCustomers: 0,
    totalSellers: 0,
    totalAdmins: 0,
  });

  const [ordersAndRevenueReport, setOrdersAndRevenueReport] = React.useState({
    totalOrders: 0,
    cancelledOrders: 0,
    grossRevenue: 0,
    netRevenue: 0,
  });

  const fetchReports = async () => {
    try {
      // Fetch users report
      const usersReportResponse: any = await getUsersReport();
      if (!usersReportResponse.success) {
        throw new Error(usersReportResponse.error);
      }
      setUsersReport(usersReportResponse.data);

      // Fetch orders and revenue report
      const ordersReportResponse: any = await getOrdersRevenueReport();
      if (!ordersReportResponse.success) {
        throw new Error(ordersReportResponse.error);
      }
      setOrdersAndRevenueReport(ordersReportResponse.data);
      
    } catch (error) {
      toast.error("Failed to fetch reports");
    }
  };

  useEffect(() => {
    fetchReports();
  }, []);

  return (
    <div>
      <PageTitle title="Dashboard" />

      <div className="mt-7">
        <h1 className="text-primary my-2 font-bold">Users</h1>
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-5">
          <DashboardCard
            title="Total Users"
            value={usersReport.totalUsers}
            isAmount={false}
            description="Total users"
          />
          <DashboardCard
            title="Customers"
            value={usersReport.totalCustomers}
            isAmount={false}
            description="Total customers"
          />

          <DashboardCard
            title="Sellers"
            value={usersReport.totalSellers}
            isAmount={false}
            description="Total sellers"
          />

          <DashboardCard
            title="Admins"
            value={usersReport.totalAdmins}
            isAmount={false}
            description="Total admins"
          />
        </div>
      </div>

      <div className="mt-7">
        <h1 className="text-primary my-2 font-bold">Orders and Revenue</h1>
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-5">
          <DashboardCard
            title="Total Orders"
            value={ordersAndRevenueReport.totalOrders}
            isAmount={false}
            description="Total orders"
          />

          <DashboardCard
            title="Cancelled Orders"
            value={ordersAndRevenueReport.cancelledOrders}
            isAmount={false}
            description="Total cancelled orders"
          />

          <DashboardCard
            title="Gross Revenue"
            value={ordersAndRevenueReport.grossRevenue}
            isAmount={true}
            description="Total gross revenue"
          />

          <DashboardCard
            title="Net Revenue"
            value={ordersAndRevenueReport.netRevenue}
            isAmount={true}
            description="Total net revenue"
          />
        </div>
      </div>
    </div>
  );
}

export default AdminDashboardPage;
