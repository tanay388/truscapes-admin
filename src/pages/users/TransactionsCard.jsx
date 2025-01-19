import React, { useState, useEffect } from "react";
import { toast } from "react-toastify";
import { apiService } from "../../api/apiwrapper";
import { FiLoader } from "react-icons/fi";

const TransactionCard = ({ user }) => {
  const [transactions, setTransactions] = useState([]);
  const [loading, setLoading] = useState(true);
  const [currentPage, setCurrentPage] = useState(1);
  const [pageSize] = useState(5);
  const [hasMoreData, setHasMoreData] = useState(true);

  const fetchTransactions = async (page = 1) => {
    try {
      setLoading(true);
      const response = await apiService.get(
        `/transactions/user/${user.id}?take=${pageSize}&skip=${
          (page - 1) * pageSize
        }`
      );
      if (response.data.length < pageSize) {
        setHasMoreData(false);
      } else {
        setHasMoreData(true);
      }
      setTransactions(response.data);
    } catch (error) {
      toast.error("Failed to fetch transactions.");
      console.error("Error fetching transactions:", error);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchTransactions(currentPage);
  }, [currentPage]);

  const handlePageChange = (page) => {
    setCurrentPage(page);
  };

  return (
    <div className="w-full mt-6">
      <div className="bg-white shadow-lg rounded-lg overflow-hidden border">
        <div className="h-2 bg-gradient-to-r from-yellow-500 to-yellow-300"></div>
        <div className="p-6">
          <h2 className="text-lg font-semibold text-gray-800 mb-4">
            Transactions
          </h2>

          {loading ? (
            <div className="flex justify-center py-6">
              <FiLoader className="animate-spin text-yellow-500 text-3xl" />
            </div>
          ) : transactions.length === 0 ? (
            <div className="text-center py-6 text-gray-600">
              No transactions found.
            </div>
          ) : (
            <div className="divide-y divide-gray-200">
              {transactions.map((transaction) => (
                <div
                  key={transaction.id}
                  className="flex flex-col md:flex-row items-start md:items-center justify-between py-4"
                >
                  <div className="flex flex-col md:w-1/4">
                    <span className="text-sm font-medium text-gray-500">
                      Type
                    </span>
                    <span
                      className={`text-base font-semibold ${
                        transaction.type === "DEPOSIT"
                          ? "text-green-500"
                          : transaction.type === "WITHDRAWAL"
                          ? "text-red-500"
                          : "text-blue-500"
                      }`}
                    >
                      {transaction.type.replace("_", " ")}
                    </span>
                  </div>
                  <div className="flex flex-col md:w-1/4">
                    <span className="text-sm font-medium text-gray-500">
                      Amount
                    </span>
                    <span
                      className={`text-base font-semibold ${
                        transaction.type === "WITHDRAWAL"
                          ? "text-red-500"
                          : "text-gray-800"
                      }`}
                    >
                      ${transaction.amount.toFixed(2)}
                    </span>
                  </div>
                  <div className="flex flex-col md:w-1/3">
                    <span className="text-sm font-medium text-gray-500">
                      Description
                    </span>
                    <span className="text-base text-gray-700">
                      {transaction.description || "N/A"}
                    </span>
                  </div>
                  <div className="flex flex-col md:w-1/4">
                    <span className="text-sm font-medium text-gray-500">
                      Date
                    </span>
                    <span className="text-base text-gray-700">
                      {new Date(transaction.createdAt).toLocaleDateString()}
                    </span>
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>

        {/* Pagination */}
        {!loading && transactions.length > 0 && hasMoreData && (
          <div className="mt-4 flex justify-center">
            {currentPage > 1 && (
              <button
                onClick={() => handlePageChange(currentPage - 1)}
                className="px-4 py-2 mx-1 border rounded bg-gray-100 text-gray-700 hover:bg-gray-200"
              >
                Previous
              </button>
            )}
            <button
              onClick={() => handlePageChange(currentPage + 1)}
              className="px-4 py-2 mx-1 border rounded bg-blue-500 text-white hover:bg-blue-600"
            >
              Next
            </button>
          </div>
        )}
      </div>
    </div>
  );
};

export default TransactionCard;
