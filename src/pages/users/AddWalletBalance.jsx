import React, { useState } from "react";
import { toast } from "react-toastify";
import { apiService } from "../../api/apiwrapper";

const AddWalletBalancePopup = ({ isOpen, onClose, user, setUser }) => {
  const [amount, setAmount] = useState("");
  const [description, setDescription] = useState("");
  const [loading, setLoading] = useState(false);

  const handleAddBalance = async () => {
    if (!amount || isNaN(amount) || Number(amount) <= 0) {
      toast.error("Please enter a valid amount.");
      return;
    }

    if (!description.trim()) {
      toast.error("Description cannot be empty.");
      return;
    }

    try {
      setLoading(true);
      await apiService.post(`wallet/${user.id}/credit`, {
        amount: Number(amount),
        description: description.trim(),
      });
      setUser();
      toast.success("Wallet balance added successfully!");
      setAmount("");
      setDescription("");
      onClose(); // Close the popup
    } catch (error) {
      console.error("Error adding balance:", error);
      toast.error("Failed to add wallet balance.");
    } finally {
      setLoading(false);
    }
  };

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black bg-opacity-50">
      <div className="bg-white rounded-lg shadow-lg w-full max-w-md p-6">
        <h2 className="text-xl font-bold mb-4">Add Wallet Balance</h2>
        <p className="text-gray-600 mb-4">
          Add wallet balance for user: <strong>{user.email}</strong>
        </p>

        {/* Amount Input */}
        <label
          htmlFor="amount"
          className="block text-sm font-medium text-gray-700 mb-2"
        >
          Enter Amount
        </label>
        <input
          type="number"
          id="amount"
          value={amount}
          onChange={(e) => setAmount(e.target.value)}
          className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring focus:ring-blue-300"
          placeholder="Enter amount (e.g., 100)"
        />

        {/* Description Input */}
        <label
          htmlFor="description"
          className="block text-sm font-medium text-gray-700 mt-4 mb-2"
        >
          Description
        </label>
        <textarea
          id="description"
          value={description}
          onChange={(e) => setDescription(e.target.value)}
          className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring focus:ring-blue-300"
          placeholder="Enter a brief description (e.g., Refund for order cancellation)"
          rows={4}
        ></textarea>

        {/* Buttons */}
        <div className="mt-6 flex justify-end gap-4">
          <button
            onClick={onClose}
            className="px-4 py-2 bg-gray-200 text-gray-800 rounded-lg hover:bg-gray-300"
            disabled={loading}
          >
            Cancel
          </button>
          <button
            onClick={handleAddBalance}
            className={`px-4 py-2 text-white rounded-lg ${
              loading ? "bg-blue-300" : "bg-blue-500 hover:bg-blue-600"
            }`}
            disabled={loading}
          >
            {loading ? "Processing..." : "Add Balance"}
          </button>
        </div>
      </div>
    </div>
  );
};

export default AddWalletBalancePopup;
