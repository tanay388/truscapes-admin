// src/pages/Dashboard.jsx
import React from "react";
import StatCard from "../../components/shop/StatCard";
import ChartCard from "../../components/shop/ChartCard";

// Dummy Data
const stats = [
  { title: "Total Orders", value: 120, icon: "📦", bgColor: "bg-blue-500" },
  { title: "Pending Orders", value: 15, icon: "⏳", bgColor: "bg-yellow-500" },
  { title: "Total Products", value: 80, icon: "🛒", bgColor: "bg-green-500" },
  { title: "Active Users", value: 200, icon: "👤", bgColor: "bg-purple-500" },
  {
    title: "Today's Revenue",
    value: "$1,250",
    icon: "💰",
    bgColor: "bg-teal-500",
  },
];

const Dashboard = () => {
  return (
    <div className="flex min-h-screen">
      <div className="flex flex-col flex-grow">
        <main className="p-6 bg-gray-50">
          {/* Stats Section */}
          <section className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6 mb-6">
            {stats.map((stat, index) => (
              <StatCard
                key={index}
                title={stat.title}
                value={stat.value}
                icon={stat.icon}
                bgColor={stat.bgColor}
              />
            ))}
          </section>

          {/* Charts Section */}
          <section className="grid grid-cols-1 lg:grid-cols-2 gap-6">
            <ChartCard title="Orders Summary">
              <div className="h-64 flex items-center justify-center text-gray-500">
                {/* Placeholder for Chart */}
                <p>Line Chart Here</p>
              </div>
            </ChartCard>
            <ChartCard title="Revenue Trends">
              <div className="h-64 flex items-center justify-center text-gray-500">
                {/* Placeholder for Chart */}
                <p>Bar Chart Here</p>
              </div>
            </ChartCard>
          </section>
        </main>
      </div>
    </div>
  );
};

export default Dashboard;
