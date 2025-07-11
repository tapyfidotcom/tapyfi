import PageTitle from "@/components/ui/page-title";
import React from "react";

interface DashboardCardProps {
  title: string;
  value: number;
  isAmount: boolean;
  description: string;
}

function DashboardCard({
  title,
  value,
  isAmount,
  description,
}: DashboardCardProps) {
  return (
    <div className="border border-gray-300 p-5">
      <div>
        <h1 className="text-sm font-bold">{title}</h1>
        <p className="text-xs text-gray-500">{description}</p>
      </div>

      <h1 className="text-5xl font-bold mt-2 text-gray-700">
        {isAmount ? `$ ${value}` : value}
      </h1>
    </div>
  );
}

export default DashboardCard;
