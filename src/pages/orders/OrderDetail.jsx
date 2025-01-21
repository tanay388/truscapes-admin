import { useState } from "react";
import { useParams, Link } from "react-router-dom";
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { apiService } from "../../api/apiwrapper";
import { toast } from "react-toastify";
import AnimatedLoader from "../../components/loaders/AnimatedLoader";
import { ArrowLeft } from "@mui/icons-material";

const OrderStatus = {
  PENDING: "PENDING",
  PROCESSING: "PROCESSING",
  SHIPPED: "SHIPPED",
  DELIVERED: "DELIVERED",
  CANCELLED: "CANCELLED",
};

const OrderDetail = () => {
  const { id } = useParams();
  const queryClient = useQueryClient();
  const [updateDialog, setUpdateDialog] = useState(false);
  const [updateData, setUpdateData] = useState({
    status: "",
    trackingNumber: "",
    notes: "",
  });

  const { data: order, isLoading } = useQuery({
    queryKey: ["order", id],
    queryFn: () => apiService.get(`/orders/${id}`).then((res) => res.data),
  });

  const updateMutation = useMutation({
    mutationFn: (data) => apiService.patch(`/orders/${id}`, data),
    onSuccess: () => {
      queryClient.invalidateQueries(["order", id]);
      toast.success("Order updated successfully");
      setUpdateDialog(false);
    },
    onError: (error) => {
      toast.error("Failed to update order");
      console.error("Update error:", error);
    },
  });

  const handleUpdateSubmit = () => {
    updateMutation.mutate(updateData);
  };

  if (isLoading) {
    return <AnimatedLoader />;
  }

  if (!order) {
    return (
      <div className="p-6">
        <h1 className="text-xl font-bold text-gray-700">Order not found</h1>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50 p-6">
      <div className="max-w-7xl mx-auto">
        {/* Header */}
        <div className="mb-8">
          <Link
            to="/orders"
            className="inline-flex items-center text-gray-600 hover:text-gray-900 mb-4"
          >
            <ArrowLeft className="mr-2" />
            Back to Orders
          </Link>

          <div className="flex justify-between items-start">
            <div>
              <h1 className="text-3xl font-bold text-gray-900">
                Order #{order.id}
              </h1>
              <p className="text-gray-500 mt-1">
                Placed on {new Date(order.createdAt).toLocaleString()}
              </p>
            </div>

            <button
              onClick={() => {
                setUpdateData({
                  status: order.status,
                  trackingNumber: order.trackingNumber || "",
                  notes: order.notes || "",
                });
                setUpdateDialog(true);
              }}
              className="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors"
            >
              Update Order
            </button>
          </div>

          <div className="mt-4">
            <span
              className={`px-3 py-1 rounded-full text-sm font-semibold
              ${
                order.status === "DELIVERED"
                  ? "bg-green-100 text-green-800"
                  : order.status === "PENDING"
                  ? "bg-yellow-100 text-yellow-800"
                  : order.status === "CANCELLED"
                  ? "bg-red-100 text-red-800"
                  : "bg-blue-100 text-blue-800"
              }`}
            >
              {order.status}
            </span>
          </div>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-8">
          {/* Customer Information */}
          <div className="bg-white rounded-lg shadow-sm p-6">
            <h2 className="text-xl font-semibold mb-4">Customer Information</h2>
            <div className="space-y-3">
              <div>
                <label className="text-sm text-gray-500">Name</label>
                <p className="font-medium">{order.user?.name}</p>
              </div>
              <div>
                <label className="text-sm text-gray-500">Email</label>
                <p className="font-medium">{order.user?.email}</p>
              </div>
              <div>
                <label className="text-sm text-gray-500">Phone</label>
                <p className="font-medium">{order.user?.phone || "N/A"}</p>
              </div>
            </div>
          </div>

          {/* Shipping Information */}
          <div className="bg-white rounded-lg shadow-sm p-6">
            <h2 className="text-xl font-semibold mb-4">Shipping Information</h2>
            <div className="space-y-3">
              <div>
                <label className="text-sm text-gray-500">Tracking Number</label>
                <p className="font-medium">
                  {order.trackingNumber || "Not available"}
                </p>
              </div>
              <div>
                <label className="text-sm text-gray-500">Notes</label>
                <p className="font-medium">{order.notes || "No notes"}</p>
              </div>
            </div>
          </div>
        </div>

        {/* Order Items */}
        <div className="bg-white rounded-lg shadow-sm">
          <div className="p-6">
            <h2 className="text-xl font-semibold mb-6">Order Items</h2>
            <div className="divide-y divide-gray-200">
              {order.items?.map((item, index) => (
                <div
                  key={index}
                  className="py-4 flex items-center justify-between"
                >
                  <div className="flex items-center space-x-4">
                    {item.product?.images?.[0] && (
                      <img
                        src={item.product.images[0]}
                        alt={item.product.name}
                        className="w-16 h-16 object-cover rounded-lg"
                      />
                    )}
                    <div>
                      <h3 className="font-medium">{item.product?.name}</h3>
                      <p className="text-sm text-gray-500">
                        Variant: {item.variant.name}
                      </p>
                      <p className="text-sm text-gray-500">
                        Quantity: {item.quantity}
                      </p>
                      <p className="text-sm text-gray-500">
                        ${item.price} per unit
                      </p>
                    </div>
                  </div>
                  <p className="font-semibold">${item.price * item.quantity}</p>
                </div>
              ))}
            </div>

            <div className="mt-6 pt-6 border-t border-gray-200">
              <div className="flex justify-between items-center">
                <span className="text-lg font-semibold">Total Amount</span>
                <span className="text-2xl font-bold">${order.total}</span>
              </div>
            </div>
          </div>
        </div>

        {/* Update Dialog */}
        {updateDialog && (
          <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center p-4">
            <div className="bg-white rounded-lg max-w-md w-full p-6">
              <h2 className="text-xl font-semibold mb-4">Update Order</h2>

              <div className="space-y-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    Status
                  </label>
                  <select
                    value={updateData.status}
                    onChange={(e) =>
                      setUpdateData({ ...updateData, status: e.target.value })
                    }
                    className="w-full border border-gray-300 rounded-md px-3 py-2"
                  >
                    {Object.values(OrderStatus).map((status) => (
                      <option key={status} value={status}>
                        {status}
                      </option>
                    ))}
                  </select>
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    Tracking Number
                  </label>
                  <input
                    type="text"
                    value={updateData.trackingNumber}
                    onChange={(e) =>
                      setUpdateData({
                        ...updateData,
                        trackingNumber: e.target.value,
                      })
                    }
                    className="w-full border border-gray-300 rounded-md px-3 py-2"
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    Notes
                  </label>
                  <textarea
                    value={updateData.notes}
                    onChange={(e) =>
                      setUpdateData({ ...updateData, notes: e.target.value })
                    }
                    rows={3}
                    className="w-full border border-gray-300 rounded-md px-3 py-2"
                  />
                </div>
              </div>

              <div className="mt-6 flex justify-end space-x-3">
                <button
                  onClick={() => setUpdateDialog(false)}
                  className="px-4 py-2 text-gray-600 hover:text-gray-800"
                >
                  Cancel
                </button>
                <button
                  onClick={handleUpdateSubmit}
                  disabled={updateMutation.isLoading}
                  className="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors disabled:opacity-50"
                >
                  {updateMutation.isLoading ? "Updating..." : "Update"}
                </button>
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

export default OrderDetail;
