// src/components/ChartCard.jsx
import React from "react";

const ChartCard = ({ title, children }) => {
  return (
    <div className="bg-white shadow-lg rounded-lg p-6">
      <h3 className="text-lg font-semibold text-gray-800 mb-4">{title}</h3>
      <div>{children}</div>
    </div>
  );
};

export default ChartCard;
