// ApplyApproval.jsx
import React, { useState, useEffect } from "react";
import {
  getFacultyListStudent,
  applyActivityApproval,
  getMyActivities,
} from "../../Utils/Api";
import { useAuth } from "../../contexts/AuthContext";
import { motion, AnimatePresence } from "framer-motion";
import {
  FiPlus,
  FiX,
  FiUser,
  FiFileText,
  FiCheckCircle,
  FiClock,
  FiXCircle,
  FiDownload,
  FiEye,
  FiSend,
  FiMail,
  FiShield,
} from "react-icons/fi";
import { toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";

const ApplyApproval = () => {
  const { user } = useAuth();
  const [faculties, setFaculties] = useState([]);
  const [activities, setActivities] = useState([]);
  const [loading, setLoading] = useState(true);
  const [showApplyForm, setShowApplyForm] = useState(false);
  const [activeTab, setActiveTab] = useState("all");
  const [formData, setFormData] = useState({
    title: "",
    description: "",
    activityType: "",
    credentialId: "",
    appliedTo: "",
    issuerEmail: "",
    attachment: null,
  });
  const [submitting, setSubmitting] = useState(false);

  useEffect(() => {
    fetchFaculties();
    fetchActivities();
  }, []);

  const fetchFaculties = async () => {
    try {
      const response = await getFacultyListStudent();
      if (response.data.valid) {
        setFaculties(response.data.faculties);
      }
    } catch (error) {
      toast.error("Error Fetching Faculties!");
      console.error("Error fetching faculties:", error);
    }
  };

  const fetchActivities = async () => {
    try {
      setLoading(true);
      const response = await getMyActivities();
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

  const handleSubmit = async (e) => {
    e.preventDefault();
    setSubmitting(true);
    try {
      const formDataToSend = new FormData();
      formDataToSend.append("title", formData.title);
      formDataToSend.append("description", formData.description);
      formDataToSend.append("activityType", formData.activityType);
      formDataToSend.append("credentialId", formData.credentialId);
      formDataToSend.append("appliedTo", formData.appliedTo);

      // Add issuer email only for Extra-Curricular activities
      if (
        formData.activityType === "Extra-Curricular" &&
        formData.issuerEmail
      ) {
        formDataToSend.append("issuerEmail", formData.issuerEmail);
      }

      if (formData.attachment) {
        formDataToSend.append("attachment", formData.attachment);
      }

      const response = await applyActivityApproval(formDataToSend);

      if (response?.data?.valid) {
        toast.success("Activity application submitted successfully!");
        setShowApplyForm(false);
        setFormData({
          title: "",
          description: "",
          activityType: "",
          credentialId: "",
          appliedTo: "",
          issuerEmail: "",
          attachment: null,
        });
        fetchActivities(); // Refresh the list
      } else {
        toast.error("Something went wrong. Please check details.");
      }
    } catch (error) {
      console.error("Error applying for activity:", error);
      toast.error("Error submitting application!");
    } finally {
      setSubmitting(false);
    }
  };

  const handleInputChange = (e) => {
    if (e.target.name === "attachment") {
      setFormData({
        ...formData,
        [e.target.name]: e.target.files[0],
      });
    } else {
      setFormData({
        ...formData,
        [e.target.name]: e.target.value,
      });
    }
  };

  const filteredActivities = activities.filter((activity) => {
    if (activeTab === "all") return true;
    if (activeTab === "approved") return activity.status === "Approved";
    if (activeTab === "pending") return activity.status === "Pending";
    if (activeTab === "rejected") return activity.status === "Rejected";
    return true;
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

  if (loading) {
    return (
      <div className="flex items-center justify-center h-64">
        <div className="w-8 h-8 border-4 border-[#10B981] border-t-transparent rounded-full animate-spin"></div>
      </div>
    );
  }

  return (
    <div className="p-6">
      <div className="flex flex-col md:flex-row justify-between items-start md:items-center mb-6 gap-4">
        <div>
          <h1 className="text-2xl font-bold text-[#1F2937]">
            Activity Approvals
          </h1>
          <p className="text-[#4B5563]">Manage your activity applications</p>
        </div>
        <motion.button
          whileHover={{ scale: 1.05 }}
          whileTap={{ scale: 0.95 }}
          onClick={() => setShowApplyForm(true)}
          className="flex items-center gap-2 px-4 py-2 bg-[#10B981] hover:bg-[#059669] text-white rounded-lg font-semibold shadow-md"
        >
          <FiPlus className="h-4 w-4" />
          Apply for Approval
        </motion.button>
      </div>

      {/* Tabs */}
      <div className="bg-white rounded-lg shadow-md mb-6">
        <div className="flex overflow-x-auto">
          {["all", "approved", "pending", "rejected"].map((tab) => (
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
              {tab === "approved" && "Approved"}
              {tab === "pending" && "Pending"}
              {tab === "rejected" && "Rejected"}
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
                ? "You haven't applied for any activities yet."
                : `No ${activeTab} activities found.`}
            </p>
            {activeTab === "all" && (
              <button
                onClick={() => setShowApplyForm(true)}
                className="mt-4 px-4 py-2 bg-[#10B981] text-white rounded-lg"
              >
                Apply Now
              </button>
            )}
          </div>
        ) : (
          <div className="overflow-x-auto">
            <table className="w-full">
              <thead className="bg-[#ECFDF5]">
                <tr>
                  <th className="px-6 py-3 text-left text-xs font-medium text-[#1F2937] uppercase tracking-wider">
                    Activity
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-[#1F2937] uppercase tracking-wider">
                    Faculty
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
                      <td className="px-6 py-4 whitespace-nowrap">
                        <div className="flex items-center">
                          <div className="w-8 h-8 rounded-full bg-[#10B981] flex items-center justify-center text-white mr-3">
                            <FiUser className="h-4 w-4" />
                          </div>
                          <div>
                            <div className="text-sm font-medium text-[#1F2937]">
                              {activity.faculty?.name || "N/A"}
                            </div>
                            <div className="text-xs text-[#4B5563]">
                              {activity.faculty?.email || "N/A"}
                            </div>
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

      {/* Apply Form Modal */}
      <AnimatePresence>
        {showApplyForm && (
          <>
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 0.5 }}
              exit={{ opacity: 0 }}
              className="fixed inset-0 bg-black z-50"
              onClick={() => setShowApplyForm(false)}
            />
            <motion.div
              initial={{ opacity: 0, scale: 0.9 }}
              animate={{ opacity: 1, scale: 1 }}
              exit={{ opacity: 0, scale: 0.9 }}
              className="fixed top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 bg-white p-6 rounded-lg shadow-xl z-50 w-full max-w-md max-h-[90vh] overflow-y-auto"
            >
              <div className="flex justify-between items-center mb-4">
                <h2 className="text-xl font-bold text-[#1F2937]">
                  Apply for Activity Approval
                </h2>
                <button
                  onClick={() => setShowApplyForm(false)}
                  className="text-gray-500 hover:text-gray-700"
                >
                  <FiX className="h-5 w-5" />
                </button>
              </div>

              <form onSubmit={handleSubmit} className="space-y-4">
                <div>
                  <label className="block text-sm font-medium text-[#4B5563] mb-1">
                    Title *
                  </label>
                  <input
                    type="text"
                    name="title"
                    placeholder="Activity Title"
                    value={formData.title}
                    onChange={handleInputChange}
                    className="w-full px-4 py-2 bg-white border border-gray-300 rounded-lg text-[#1F2937] placeholder-[#9CA3AF] focus:outline-none focus:ring-2 focus:ring-[#10B981] focus:border-transparent"
                    required
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium text-[#4B5563] mb-1">
                    Description *
                  </label>
                  <textarea
                    name="description"
                    placeholder="Activity Description"
                    value={formData.description}
                    onChange={handleInputChange}
                    rows={3}
                    className="w-full px-4 py-2 bg-white border border-gray-300 rounded-lg text-[#1F2937] placeholder-[#9CA3AF] focus:outline-none focus:ring-2 focus:ring-[#10B981] focus:border-transparent"
                    required
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium text-[#4B5563] mb-1">
                    Activity Type *
                  </label>
                  <select
                    name="activityType"
                    value={formData.activityType}
                    onChange={handleInputChange}
                    className="w-full px-4 py-2 bg-white border border-gray-300 rounded-lg text-[#1F2937] focus:outline-none focus:ring-2 focus:ring-[#10B981] focus:border-transparent"
                    required
                  >
                    <option value="">Select Activity Type</option>
                    <option value="Curricular">Curricular</option>
                    <option value="Co-Curricular">Co-Curricular</option>
                    <option value="Extra-Curricular">Extra-Curricular</option>
                  </select>
                </div>

                {/* Issuer Email Field (Only for Extra-Curricular) */}
                {formData.activityType === "Extra-Curricular" && (
                  <motion.div
                    initial={{ opacity: 0, height: 0 }}
                    animate={{ opacity: 1, height: "auto" }}
                    exit={{ opacity: 0, height: 0 }}
                    transition={{ duration: 0.3 }}
                  >
                    <label className="block text-sm font-medium text-[#4B5563] mb-1">
                      Issuer's Email *
                    </label>
                    <div className="relative">
                      <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                        <FiMail className="h-4 w-4 text-gray-400" />
                      </div>
                      <input
                        type="email"
                        name="issuerEmail"
                        placeholder="Issuer's Email Address"
                        value={formData.issuerEmail}
                        onChange={handleInputChange}
                        className="w-full pl-10 px-4 py-2 bg-white border border-gray-300 rounded-lg text-[#1F2937] placeholder-[#9CA3AF] focus:outline-none focus:ring-2 focus:ring-[#10B981] focus:border-transparent"
                        required
                      />
                    </div>
                    <p className="text-xs text-[#6B7280] mt-1">
                      Enter the email of the organization or person who issued
                      this certificate
                    </p>
                  </motion.div>
                )}

                <div>
                  <label className="block text-sm font-medium text-[#4B5563] mb-1">
                    Credential ID *
                  </label>
                  <input
                    type="text"
                    name="credentialId"
                    placeholder="Credential ID"
                    value={formData.credentialId}
                    onChange={handleInputChange}
                    className="w-full px-4 py-2 bg-white border border-gray-300 rounded-lg text-[#1F2937] placeholder-[#9CA3AF] focus:outline-none focus:ring-2 focus:ring-[#10B981] focus:border-transparent"
                    required
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium text-[#4B5563] mb-1">
                    Apply To (Faculty) *
                  </label>
                  <select
                    name="appliedTo"
                    value={formData.appliedTo}
                    onChange={handleInputChange}
                    className="w-full px-4 py-2 bg-white border border-gray-300 rounded-lg text-[#1F2937] focus:outline-none focus:ring-2 focus:ring-[#10B981] focus:border-transparent"
                    required
                  >
                    <option value="">Select Faculty</option>
                    {faculties.map((faculty) => (
                      <option key={faculty._id} value={faculty._id}>
                        {faculty.name}
                      </option>
                    ))}
                  </select>
                </div>

                <div>
                  <label className="block text-sm font-medium text-[#4B5563] mb-1">
                    Attachment (Certificate/Proof)
                  </label>
                  <input
                    type="file"
                    name="attachment"
                    onChange={handleInputChange}
                    className="w-full px-4 py-2 bg-white border border-gray-300 rounded-lg text-[#1F2937] focus:outline-none focus:ring-2 focus:ring-[#10B981] focus:border-transparent"
                    accept="image/*,.pdf,.doc,.docx"
                  />
                  <p className="text-xs text-[#6B7280] mt-1">
                    Supported formats: JPG, PNG, PDF, DOC (Max 5MB)
                  </p>
                </div>

                <motion.button
                  whileHover={{ scale: submitting ? 1 : 1.02 }}
                  whileTap={{ scale: submitting ? 1 : 0.98 }}
                  type="submit"
                  disabled={submitting}
                  className={`w-full flex items-center justify-center gap-2 py-2 rounded-lg font-semibold shadow-md 
                    ${
                      submitting
                        ? "bg-gray-400 cursor-not-allowed"
                        : "bg-[#10B981] hover:bg-[#059669] text-white"
                    }`}
                >
                  {submitting ? (
                    <>
                      <div className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin"></div>
                      Adding...
                    </>
                  ) : (
                    <>
                      <FiSend className="h-4 w-4" />
                      Submit Application
                    </>
                  )}
                </motion.button>
              </form>
            </motion.div>
          </>
        )}
      </AnimatePresence>
    </div>
  );
};

export default ApplyApproval;
