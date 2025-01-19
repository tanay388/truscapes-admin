import React, { useState } from "react";
import AddWalletBalancePopup from "./AddWalletBalance";

const WalletCard = ({ user, setUser }) => {
  const [isPopupOpen, setIsPopupOpen] = useState(false);

  const openPopup = () => {
    setIsPopupOpen(true);
  };

  const closePopup = () => {
    setIsPopupOpen(false);
  };

  return (
    <div className="w-full mt-6">
      {/* Card Container */}
      <div className="bg-white shadow-lg rounded-lg overflow-hidden border">
        {/* Gradient Bar */}
        <div className="h-2 bg-gradient-to-r from-green-500 to-green-300"></div>

        {/* Card Content */}
        <div className="p-6">
          <h2 className="text-lg font-bold text-gray-800 mb-4">
            Wallet Information
          </h2>
          <div className="border-b mb-4"></div>

          {/* Wallet Info Grid */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            {/* Wallet Balance */}
            <div>
              <p className="text-sm text-gray-500 font-medium mb-1">
                Wallet Balance
              </p>
              <p className="text-xl font-semibold text-gray-900">
                ${user.wallet?.balance?.toFixed(2) || "0.00"}
              </p>
            </div>

            {/* Credit Due */}
            <div>
              <p className="text-sm text-gray-500 font-medium mb-1">
                Credit Due
              </p>
              <p className="text-xl font-semibold text-red-500">
                ${user.wallet?.creditDue?.toFixed(2) || "0.00"}
              </p>
            </div>
          </div>

          {/* Add Credit Button */}
          <div className="mt-6 flex justify-end">
            <button
              onClick={openPopup}
              className="px-4 py-2 bg-blue-500 text-white text-sm font-medium rounded-md shadow hover:bg-blue-600 transition"
            >
              Add Credit
            </button>
          </div>
        </div>
      </div>

      {/* Add Wallet Balance Popup */}
      <AddWalletBalancePopup
        isOpen={isPopupOpen}
        onClose={closePopup}
        user={user}
        setUser={setUser}
      />
    </div>
  );
};

export default WalletCard;
