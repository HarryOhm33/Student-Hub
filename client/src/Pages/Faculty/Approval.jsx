// Approval.jsx
import React, { useState, useEffect } from "react";
import { getActivitiesFaculty, validateActivity } from "../../Utils/Api";
import { useAuth } from "../../contexts/AuthContext";
import { motion, AnimatePresence } from "framer-motion";
import {
  FiCheckCircle,
  FiXCircle,
  FiClock,
  FiEye,
  FiDownload,
  FiEdit,
  FiCheck,
  FiX,
  FiUser,
  FiFileText,
  FiMessageSquare,
  FiShield,
} from "react-icons/fi";
import { toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";

const Approval = () => {
  const { user } = useAuth();
  const [activities, setActivities] = useState([]);
  const [loading, setLoading] = useState(true);
  const [activeTab, setActiveTab] = useState("Pending");
  const [selectedActivity, setSelectedActivity] = useState(null);
  const [showValidationModal, setShowValidationModal] = useState(false);
  const [validationForm, setValidationForm] = useState({
    status: "Approved",
    remarks: "",
  });

  useEffect(() => {
    fetchActivities();
  }, []);

  const fetchActivities = async () => {
    try {
      setLoading(true);
      const response = await getActivitiesFaculty();
      if (response.data.valid) {
        setActivities(response.data.activities);
      }
    } catch (error) {
      toast.error("Error Fetching Activities!");
      console.error("Error fetching activities:", error);
    } finally {
      setLoading(false);
    }
  };

  const handleValidate = async (e) => {
    e.preventDefault();
    try {
      const response = await validateActivity({
        activityId: selectedActivity._id,
        status: validationForm.status,
        remarks: validationForm.remarks,
      });

      if (response?.data?.valid) {
        toast.success(
          `Activity ${validationForm.status.toLowerCase()} successfully!`
        );
        setShowValidationModal(false);
        setSelectedActivity(null);
        setValidationForm({
          status: "Approved",
          remarks: "",
        });
        fetchActivities(); // Refresh the list
      } else {
        toast.error("Failed to validate activity.");
      }
    } catch (error) {
      console.error("Error validating activity:", error);
      toast.error("Error validating activity!");
    }
  };

  const openValidationModal = (activity) => {
    setSelectedActivity(activity);
    setValidationForm({
      status: activity.status === "Rejected" ? "Rejected" : "Approved",
      remarks: activity.remarks || "",
    });
    setShowValidationModal(true);
  };

  const filteredActivities = activities.filter((activity) => {
    if (activeTab === "all") return true;
    return activity.status === activeTab;
  });

  const getStatusIcon = (status) => {
    switch (status) {
      case "Approved":
        return <FiCheckCircle className="h-5 w-5 text-green-500" />;
      case "Pending":
        return <FiClock className="h-5 w-5 text-yellow-500" />;
      case "Rejected":
        return <FiXCircle className="h-5 w-5 text-red-500" />;
      default:
        return <FiClock className="h-5 w-5 text-gray-500" />;
    }
  };

  const getStatusColor = (status) => {
    switch (status) {
      case "Approved":
        return "bg-green-100 text-green-800";
      case "Pending":
        return "bg-yellow-100 text-yellow-800";
      case "Rejected":
        return "bg-red-100 text-red-800";
      default:
        return "bg-gray-100 text-gray-800";
    }
  };

  const getIssuerVerificationStatus = (activity) => {
    if (activity.activityType !== "Extra-Curricular") {
      return {
        text: "Not Required",
        color: "bg-gray-100 text-gray-800",
        icon: <FiShield className="h-4 w-4 text-gray-500" />,
      };
    }

    if (activity.isIssuerVerified) {
      return {
        text: "Verified by Issuer",
        color: "bg-green-100 text-green-800",
        icon: <FiCheckCircle className="h-4 w-4 text-green-500" />,
      };
    } else {
      return {
        text: "Pending Verification",
        color: "bg-yellow-100 text-yellow-800",
        icon: <FiClock className="h-4 w-4 text-yellow-500" />,
      };
    }
  };

  const getStats = () => {
    const stats = {
      total: activities.length,
      pending: activities.filter((a) => a.status === "Pending").length,
      approved: activities.filter((a) => a.status === "Approved").length,
      rejected: activities.filter((a) => a.status === "Rejected").length,
    };
    return stats;
  };

  const stats = getStats();

  if (loading) {
    return (
      <div className="flex items-center justify-center h-64">
        <div className="w-8 h-8 border-4 border-[#10B981] border-t-transparent rounded-full animate-spin"></div>
      </div>
    );
  }

  return (
    <div className="p-6">
      <div className="mb-6">
        <h1 className="text-2xl font-bold text-[#1F2937]">
          Activity Approvals
        </h1>
        <p className="text-[#4B5563]">
          Review and validate student activity applications
        </p>
      </div>

      {/* Stats Cards */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-4 mb-6">
        <div className="bg-white rounded-lg shadow-md p-4">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm text-[#4B5563]">Total</p>
              <p className="text-2xl font-bold text-[#1F2937]">{stats.total}</p>
            </div>
            <div className="w-10 h-10 rounded-full bg-blue-100 flex items-center justify-center">
              <FiFileText className="h-5 w-5 text-blue-600" />
            </div>
          </div>
        </div>

        <div className="bg-white rounded-lg shadow-md p-4">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm text-[#4B5563]">Pending</p>
              <p className="text-2xl font-bold text-[#1F2937]">
                {stats.pending}
              </p>
            </div>
            <div className="w-10 h-10 rounded-full bg-yellow-100 flex items-center justify-center">
              <FiClock className="h-5 w-5 text-yellow-600" />
            </div>
          </div>
        </div>

        <div className="bg-white rounded-lg shadow-md p-4">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm text-[#4B5563]">Approved</p>
              <p className="text-2xl font-bold text-[#1F2937]">
                {stats.approved}
              </p>
            </div>
            <div className="w-10 h-10 rounded-full bg-green-100 flex items-center justify-center">
              <FiCheckCircle className="h-5 w-5 text-green-600" />
            </div>
          </div>
        </div>

        <div className="bg-white rounded-lg shadow-md p-4">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm text-[#4B5563]">Rejected</p>
              <p className="text-2xl font-bold text-[#1F2937]">
                {stats.rejected}
              </p>
            </div>
            <div className="w-10 h-10 rounded-full bg-red-100 flex items-center justify-center">
              <FiXCircle className="h-5 w-5 text-red-600" />
            </div>
          </div>
        </div>
      </div>

      {/* Tabs */}
      <div className="bg-white rounded-lg shadow-md mb-6">
        <div className="flex overflow-x-auto">
          {["all", "Pending", "Approved", "Rejected"].map((tab) => (
            <button
              key={tab}
              onClick={() => setActiveTab(tab)}
              className={`px-6 py-3 font-medium text-sm whitespace-nowrap ${
                activeTab === tab
                  ? "text-[#10B981] border-b-2 border-[#10B981]"
                  : "text-[#4B5563] hover:text-[#1F2937]"
              }`}
            >
              {tab === "all" && "All Activities"}
              {tab === "Pending" && `Pending (${stats.pending})`}
              {tab === "Approved" && `Approved (${stats.approved})`}
              {tab === "Rejected" && `Rejected (${stats.rejected})`}
            </button>
          ))}
        </div>
      </div>

      {/* Activities List */}
      <div className="bg-white rounded-lg shadow-md overflow-hidden">
        {filteredActivities.length === 0 ? (
          <div className="p-8 text-center">
            <FiFileText className="h-12 w-12 text-gray-400 mx-auto mb-4" />
            <p className="text-[#4B5563]">
              {activeTab === "all"
                ? "No activity applications found."
                : `No ${activeTab} activities found.`}
            </p>
          </div>
        ) : (
          <div className="overflow-x-auto">
            <table className="w-full">
              <thead className="bg-[#ECFDF5]">
                <tr>
                  <th className="px-6 py-3 text-left text-xs font-medium text-[#1F2937] uppercase tracking-wider">
                    Student
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-[#1F2937] uppercase tracking-wider">
                    Activity
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-[#1F2937] uppercase tracking-wider">
                    Type
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-[#1F2937] uppercase tracking-wider">
                    Credential ID
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-[#1F2937] uppercase tracking-wider">
                    Status
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-[#1F2937] uppercase tracking-wider">
                    Issuer Verification
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-[#1F2937] uppercase tracking-wider">
                    Date
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-[#1F2937] uppercase tracking-wider">
                    Actions
                  </th>
                  {activeTab !== "Pending" && (
                    <th className="px-6 py-3 text-left text-xs font-medium text-[#1F2937] uppercase tracking-wider">
                      Remarks
                    </th>
                  )}
                </tr>
              </thead>
              <tbody className="bg-white divide-y divide-gray-200">
                {filteredActivities.map((activity) => {
                  const issuerStatus = getIssuerVerificationStatus(activity);
                  return (
                    <tr key={activity._id} className="hover:bg-gray-50">
                      <td className="px-6 py-4 whitespace-nowrap">
                        <div className="flex items-center">
                          <div className="w-8 h-8 rounded-full bg-[#10B981] flex items-center justify-center text-white mr-3">
                            <FiUser className="h-4 w-4" />
                          </div>
                          <div>
                            <div className="text-sm font-medium text-[#1F2937]">
                              {activity.student.name}
                            </div>
                            <div className="text-xs text-[#4B5563]">
                              {activity.student.regNumber}
                            </div>
                            <div className="text-xs text-[#4B5563]">
                              {activity.student.email}
                            </div>
                          </div>
                        </div>
                      </td>
                      <td className="px-6 py-4">
                        <div>
                          <div className="text-sm font-medium text-[#1F2937]">
                            {activity.title}
                          </div>
                          <div className="text-sm text-[#4B5563] line-clamp-2">
                            {activity.description}
                          </div>
                        </div>
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap text-sm text-[#4B5563]">
                        {activity.activityType ||
                          activity.acitvityType ||
                          "N/A"}
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap text-sm text-[#4B5563]">
                        {activity.credentialId}
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap">
                        <div
                          className={`inline-flex items-center gap-1 px-3 py-1 rounded-full text-xs font-medium ${getStatusColor(
                            activity.status
                          )}`}
                        >
                          {getStatusIcon(activity.status)}
                          {activity.status}
                        </div>
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap">
                        <div
                          className={`inline-flex items-center gap-1 px-3 py-1 rounded-full text-xs font-medium ${issuerStatus.color}`}
                        >
                          {issuerStatus.icon}
                          {issuerStatus.text}
                        </div>
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap text-sm text-[#4B5563]">
                        {new Date(activity.createdAt).toLocaleDateString()}
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap text-sm font-medium">
                        <div className="flex gap-2">
                          {activity.attachmentLink && (
                            <motion.a
                              whileHover={{ scale: 1.05 }}
                              whileTap={{ scale: 0.95 }}
                              href={activity.attachmentLink}
                              target="_blank"
                              rel="noopener noreferrer"
                              className="p-2 text-blue-600 hover:bg-blue-100 rounded-lg"
                              title="View Attachment"
                            >
                              <FiEye className="h-4 w-4" />
                            </motion.a>
                          )}
                          {activity.status === "Pending" && (
                            <motion.button
                              whileHover={{ scale: 1.05 }}
                              whileTap={{ scale: 0.95 }}
                              onClick={() => openValidationModal(activity)}
                              className="p-2 text-green-600 hover:bg-green-100 rounded-lg"
                              title="Validate Activity"
                            >
                              <FiCheck className="h-4 w-4" />
                            </motion.button>
                          )}
                          {activity.status !== "Pending" && (
                            <motion.button
                              whileHover={{ scale: 1.05 }}
                              whileTap={{ scale: 0.95 }}
                              onClick={() => openValidationModal(activity)}
                              className="p-2 text-gray-600 hover:bg-gray-100 rounded-lg"
                              title="Edit Validation"
                            >
                              <FiEdit className="h-4 w-4" />
                            </motion.button>
                          )}
                        </div>
                      </td>
                      {activeTab !== "Pending" && (
                        <td className="px-6 py-4 whitespace-normal text-sm text-[#4B5563]">
                          {activity.remarks || "—"}
                        </td>
                      )}
                    </tr>
                  );
                })}
              </tbody>
            </table>
          </div>
        )}
      </div>

      {/* Validation Modal */}
      <AnimatePresence>
        {showValidationModal && selectedActivity && (
          <>
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 0.5 }}
              exit={{ opacity: 0 }}
              className="fixed inset-0 bg-black z-50"
              onClick={() => setShowValidationModal(false)}
            />
            <motion.div
              initial={{ opacity: 0, scale: 0.9 }}
              animate={{ opacity: 1, scale: 1 }}
              exit={{ opacity: 0, scale: 0.9 }}
              className="fixed top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 bg-white p-6 rounded-lg shadow-xl z-50 w-full max-w-md"
            >
              <div className="flex justify-between items-center mb-4">
                <h2 className="text-xl font-bold text-[#1F2937]">
                  Validate Activity
                </h2>
                <button
                  onClick={() => setShowValidationModal(false)}
                  className="text-gray-500 hover:text-gray-700"
                >
                  <FiX className="h-5 w-5" />
                </button>
              </div>

              <div className="mb-4 p-4 bg-gray-50 rounded-lg">
                <h3 className="font-medium text-[#1F2937] mb-2">
                  Activity Details
                </h3>
                <p className="text-sm text-[#4B5563]">
                  <strong>Title:</strong> {selectedActivity.title}
                </p>
                <p className="text-sm text-[#4B5563]">
                  <strong>Student:</strong> {selectedActivity.student.name}
                </p>
                <p className="text-sm text-[#4B5563]">
                  <strong>Type:</strong>{" "}
                  {selectedActivity.activityType ||
                    selectedActivity.acitvityType}
                </p>
                <p className="text-sm text-[#4B5563]">
                  <strong>Credential ID:</strong>{" "}
                  {selectedActivity.credentialId}
                </p>
                {selectedActivity.activityType === "Extra-Curricular" && (
                  <p className="text-sm text-[#4B5563]">
                    <strong>Issuer Verification:</strong>{" "}
                    {selectedActivity.isIssuerVerified
                      ? "Verified"
                      : "Pending Verification"}
                  </p>
                )}
              </div>

              <form onSubmit={handleValidate} className="space-y-4">
                <div>
                  <label className="block text-sm font-medium text-[#4B5563] mb-1">
                    Status *
                  </label>
                  <select
                    name="status"
                    value={validationForm.status}
                    onChange={(e) =>
                      setValidationForm({
                        ...validationForm,
                        status: e.target.value,
                      })
                    }
                    className="w-full px-4 py-2 bg-white border border-gray-300 rounded-lg text-[#1F2937] focus:outline-none focus:ring-2 focus:ring-[#10B981] focus:border-transparent"
                    required
                  >
                    <option value="Approved">Approve</option>
                    <option value="Rejected">Reject</option>
                  </select>
                </div>

                <div>
                  <label className="block text-sm font-medium text-[#4B5563] mb-1">
                    Remarks {validationForm.status === "Rejected" && "*"}
                  </label>
                  <textarea
                    name="remarks"
                    placeholder="Enter remarks or feedback..."
                    value={validationForm.remarks}
                    onChange={(e) =>
                      setValidationForm({
                        ...validationForm,
                        remarks: e.target.value,
                      })
                    }
                    rows={3}
                    className="w-full px-4 py-2 bg-white border border-gray-300 rounded-lg text-[#1F2937] placeholder-[#9CA3AF] focus:outline-none focus:ring-2 focus:ring-[#10B981] focus:border-transparent"
                    required={validationForm.status === "Rejected"}
                  />
                  {validationForm.status === "Rejected" && (
                    <p className="text-xs text-[#6B7280] mt-1">
                      Remarks are required when rejecting an application.
                    </p>
                  )}
                </div>

                <div className="flex gap-2">
                  <motion.button
                    whileHover={{ scale: 1.02 }}
                    whileTap={{ scale: 0.98 }}
                    type="button"
                    onClick={() => setShowValidationModal(false)}
                    className="flex-1 px-4 py-2 bg-gray-300 hover:bg-gray-400 text-gray-700 rounded-lg font-medium"
                  >
                    Cancel
                  </motion.button>
                  <motion.button
                    whileHover={{ scale: 1.02 }}
                    whileTap={{ scale: 0.98 }}
                    type="submit"
                    className="flex-1 px-4 py-2 bg-[#10B981] hover:bg-[#059669] text-white rounded-lg font-medium"
                  >
                    {validationForm.status === "Approved"
                      ? "Approve"
                      : "Reject"}
                  </motion.button>
                </div>
              </form>
            </motion.div>
          </>
        )}
      </AnimatePresence>
    </div>
  );
};

export default Approval;
