// src/components/StatCard.jsx
import React from "react";

const StatCard = ({ title, value, icon, bgColor = "bg-blue-500" }) => {
  return (
    <div className={`p-6 rounded-lg shadow-lg text-white ${bgColor}`}>
      <div className="flex items-center space-x-4">
        <div className="text-3xl">{icon}</div>
        <div>
          <h3 className="text-lg font-semibold">{title}</h3>
          <p className="text-2xl font-bold">{value}</p>
        </div>
      </div>
    </div>
  );
};

export default StatCard;
