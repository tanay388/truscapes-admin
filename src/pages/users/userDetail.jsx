import { useState } from "react";
import { Link, useParams } from "react-router-dom";
import { useQuery } from "@tanstack/react-query";
import { toast } from "react-toastify";
import { FaTiktok } from "react-icons/fa";
import { BsCheckCircleFill } from "react-icons/bs";
import TransactionCard from "./TransactionsCard";
import WalletCard from "./WalletCard";
import { apiService } from "../../api/apiwrapper";

const InfluencerDetails = () => {
  const { id } = useParams();
  const [confirmDialog, setConfirmDialog] = useState({
    open: false,
    title: "",
    action: null,
  });

  const [isPaymentPopupOpen, setIsPaymentPopupOpen] = useState(false); // Track popup state

  const {
    data: user,
    isLoading,
    refetch,
  } = useQuery({
    queryKey: ["user", id],
    queryFn: async () => {
      const response = await apiService.get(`user/${id}`);
      return response.data;
    },
  });

  // useEffect(() => {
  //   // Refetch user data when the payment popup closes
  //   if (!isPaymentPopupOpen) {
  //     refetch();
  //   }
  // }, [isPaymentPopupOpen, refetch]);

  const handleApprove = async () => {
    try {
      await apiService.post(`user/users/${id}/approve`);
      setConfirmDialog({ open: false, title: "", action: null });
      toast.success("Influencer approved successfully");
      user.approved = true;
    } catch (error) {
      console.error("Error approving influencer:", error);
    }
  };

  const handleSuspend = async () => {
    try {
      await apiService.post(`user/users/${id}/block`);
      setConfirmDialog({ open: false, title: "", action: null });
      toast.success("Influencer suspended successfully");
      user.approved = false;
    } catch (error) {
      console.error("Error suspending influencer:", error);
    }
  };

  const openConfirmDialog = (title, action) => {
    setConfirmDialog({
      open: true,
      title,
      action,
    });
  };

  if (isLoading) {
    return (
      <div className="flex items-center justify-center h-screen">
        <div className="loader animate-spin rounded-full h-16 w-16 border-t-4 border-yellow-500"></div>
      </div>
    );
  }

  // Helper function for fallback avatar
  const getAvatarContent = () => {
    if (user.photo) {
      return (
        <img
          src={user.photo}
          alt={user.name}
          className="w-full h-full rounded-full object-cover"
        />
      );
    }
    if (user.name) {
      const initials = user.name
        .split(" ")
        .map((word) => word[0])
        .join("")
        .toUpperCase();
      return (
        <div className="bg-blue-500 text-white w-full h-full flex justify-center items-center text-xl font-bold rounded-full">
          {initials}
        </div>
      );
    }
    return (
      <div className="bg-gray-300 w-full h-full flex justify-center items-center rounded-full">
        <svg
          className="w-12 h-12 text-gray-500"
          fill="currentColor"
          viewBox="0 0 24 24"
        >
          <path d="M12 12c2.67 0 8 1.34 8 4v2H4v-2c0-2.66 5.33-4 8-4zm0-2c-1.11 0-2-.89-2-2s.89-2 2-2 2 .89 2 2-.89 2-2 2z" />
        </svg>
      </div>
    );
  };

  if (!user) {
    return (
      <div className="p-6">
        <h1 className="text-xl font-bold text-gray-700">User not found</h1>
      </div>
    );
  }

  return (
    <div className="bg-gray-50 min-h-screen">
      <div className="max-w-6xl mx-auto py-8 px-4">
        {/* Header Card */}
        <div className="bg-white shadow-md rounded-lg p-6 mb-8">
          <div className="flex items-center gap-6">
            <div className="w-28 h-28">{getAvatarContent()}</div>
            <div>
              <h1 className="text-2xl font-bold">{user.name}</h1>
              <p className="text-gray-600 mt-1 flex items-center gap-2">
                {user.role}
                <span
                  className={`text-sm font-semibold px-3 py-1 rounded-full ${
                    user.approved
                      ? "bg-green-100 text-green-600"
                      : "bg-yellow-100 text-yellow-600"
                  }`}
                >
                  {user.approved ? "Approved" : "Pending"}
                </span>
              </p>
            </div>
            <div className="ml-auto">
              {!user.approved ? (
                <button
                  className="bg-green-600 text-white px-4 py-2 rounded-md shadow-md hover:bg-green-700"
                  onClick={() =>
                    openConfirmDialog(
                      "Are you sure you want to approve this influencer?",
                      handleApprove
                    )
                  }
                >
                  Approve
                </button>
              ) : (
                <button
                  className="bg-red-600 text-white px-4 py-2 rounded-md shadow-md hover:bg-red-700"
                  onClick={() =>
                    openConfirmDialog(
                      "Are you sure you want to suspend this influencer?",
                      handleSuspend
                    )
                  }
                >
                  Suspend
                </button>
              )}
            </div>
          </div>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          {/* Basic Information */}
          <div className="bg-white shadow-md rounded-lg p-6">
            <h2 className="text-lg font-semibold mb-4">Basic Information</h2>
            <ul className="space-y-3 text-gray-700">
              <li className="flex items-center gap-2">
                <span className="font-medium">Email:</span> {user.email}
              </li>
              <li className="flex items-center gap-2">
                <span className="font-medium">Phone:</span> {user.phone}
              </li>
              {user.birthDate && (
                <li className="flex items-center gap-2">
                  <span className="font-medium">Birth Date:</span>{" "}
                  {new Date(user.birthDate).toLocaleDateString()}
                </li>
              )}
              <li className="flex items-center gap-2">
                <span className="font-medium">Gender:</span> {user.gender}
              </li>
              {user.category && (
                <li className="flex items-center gap-2">
                  <span className="font-medium">Category:</span>{" "}
                  {user.category.name}
                </li>
              )}
            </ul>
          </div>

          {/* Company Info */}
          <div className="bg-white shadow-md rounded-lg p-6">
            <h2 className="text-lg font-semibold mb-4">Company Info</h2>
            <ul className="space-y-3 text-gray-700">
              {user.country && (
                <li className="flex items-center gap-2">
                  <span className="font-medium">Country:</span> {user.country}
                </li>
              )}
              {user.city && (
                <li className="flex items-center gap-2">
                  <span className="font-medium">City:</span> {user.city}
                </li>
              )}
              {user.company && (
                <li className="flex items-center gap-2">
                  <span className="font-medium">Company:</span> {user.company}
                </li>
              )}
              {user.companyWebsite && (
                <li className="flex items-center gap-2">
                  <span className="font-medium">Website:</span>{" "}
                  <a
                    href={user.companyWebsite}
                    target="_blank"
                    rel="noreferrer"
                    className="text-blue-600 hover:underline"
                  >
                    {user.companyWebsite}
                  </a>
                </li>
              )}
              {user.companyAddress && (
                <li className="flex items-center gap-2">
                  <span className="font-medium">Address:</span>{" "}
                  {user.companyAddress}
                </li>
              )}
            </ul>
          </div>
        </div>

        <WalletCard user={user} setUser={refetch} />
        <TransactionCard user={user} />
      </div>

      {/* Confirmation Dialog */}
      {confirmDialog.open && (
        <div className="fixed inset-0 flex items-center justify-center bg-black bg-opacity-50">
          <div className="bg-white rounded-lg shadow-lg p-6 w-96">
            <h3 className="text-lg font-semibold">{confirmDialog.title}</h3>
            <div className="flex justify-end mt-4">
              <button
                className="text-gray-600 px-4 py-2 hover:bg-gray-100 rounded-md"
                onClick={() =>
                  setConfirmDialog({ open: false, title: "", action: null })
                }
              >
                Cancel
              </button>
              <button
                className="bg-blue-600 text-white px-4 py-2 ml-2 rounded-md hover:bg-blue-700"
                onClick={confirmDialog.action}
              >
                Confirm
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default InfluencerDetails;
