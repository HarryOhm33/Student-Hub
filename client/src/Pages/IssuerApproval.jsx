import React, { useState, useEffect } from "react";
import { motion } from "framer-motion";
import {
  FiX,
  FiUser,
  FiMail,
  FiBook,
  FiCalendar,
  FiCheckCircle,
  FiXCircle,
  FiSend,
  FiClock,
  FiHash,
} from "react-icons/fi";
import { toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import { getIssuerApprovalSession, verifyIssuerApproval } from "../Utils/Api";

const IssuerApproval = () => {
  const [loading, setLoading] = useState(true);
  const [submitting, setSubmitting] = useState(false);
  const [sessionData, setSessionData] = useState(null);
  const [credentialId, setCredentialId] = useState("");
  const [error, setError] = useState("");

  // Get token from URL query parameters
  const urlParams = new URLSearchParams(window.location.search);
  const token = urlParams.get("token");

  useEffect(() => {
    if (!token) {
      setError("No token available");
      setLoading(false);

      // Close tab after 5 seconds
      const timer = setTimeout(() => {
        window.close();
      }, 5000);

      return () => clearTimeout(timer);
    } else {
      fetchSessionInfo();
    }
  }, [token]);

  const fetchSessionInfo = async () => {
    try {
      setLoading(true);
      const response = await getIssuerApprovalSession({ token });

      if (response.data.valid) {
        setSessionData(response.data.session);
      } else {
        setError(response.data.message || "Invalid session token");

        // Close tab after 5 seconds if invalid
        const timer = setTimeout(() => {
          window.close();
        }, 5000);

        return () => clearTimeout(timer);
      }
    } catch (error) {
      console.error("Error fetching session info:", error);
      setError(
        error.response.data.message || "Error fetching session information"
      );

      // Close tab after 5 seconds on error
      const timer = setTimeout(() => {
        window.close();
      }, 5000);

      return () => clearTimeout(timer);
    } finally {
      setLoading(false);
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    if (!credentialId.trim()) {
      toast.error("Please enter a credential ID");
      return;
    }

    setSubmitting(true);

    try {
      const response = await verifyIssuerApproval({
        token,
        credentialId: credentialId.trim(),
      });

      if (response.data.valid) {
        toast.success("Approval verified successfully!");
        setCredentialId("");
      } else {
        toast.error(response.data.message || "Verification failed");
      }
    } catch (error) {
      console.error("Error verifying approval:", error);
      toast.error(error.response.data.message || "Error verifying approval");
    } finally {
      setSubmitting(false);
    }
  };

  const closeWindow = () => {
    window.close();
  };

  if (loading) {
    return (
      <div className="flex items-center justify-center h-screen">
        <div className="w-8 h-8 border-4 border-[#10B981] border-t-transparent rounded-full animate-spin"></div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center p-4">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="bg-white p-6 rounded-lg shadow-md max-w-md w-full"
        >
          <div className="text-center">
            <FiXCircle className="h-12 w-12 text-red-500 mx-auto mb-4" />
            <h2 className="text-xl font-bold text-[#1F2937] mb-2">Error</h2>
            <p className="text-[#4B5563] mb-6">{error}</p>
            <p className="text-sm text-[#6B7280] mb-6">
              This tab will close automatically in 5 seconds.
            </p>
            <button
              onClick={closeWindow}
              className="px-4 py-2 bg-[#10B981] hover:bg-[#059669] text-white rounded-lg font-semibold"
            >
              Close Now
            </button>
          </div>
        </motion.div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50 p-6">
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        className="max-w-2xl mx-auto bg-white rounded-lg shadow-md overflow-hidden"
      >
        <div className="bg-[#10B981] p-6 text-white">
          <h1 className="text-2xl font-bold">Issuer Approval</h1>
          <p className="opacity-90">Verify activity credential for student</p>
        </div>

        {sessionData && (
          <div className="p-6">
            {/* Student Information */}
            <div className="mb-6">
              <h2 className="text-lg font-semibold text-[#1F2937] mb-4">
                Student Information
              </h2>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div className="flex items-center">
                  <FiUser className="h-5 w-5 text-[#10B981] mr-2" />
                  <div>
                    <p className="text-sm text-[#4B5563]">Name</p>
                    <p className="font-medium">
                      {sessionData.activity.student.name}
                    </p>
                  </div>
                </div>
                <div className="flex items-center">
                  <FiMail className="h-5 w-5 text-[#10B981] mr-2" />
                  <div>
                    <p className="text-sm text-[#4B5563]">Email</p>
                    <p className="font-medium">
                      {sessionData.activity.student.email}
                    </p>
                  </div>
                </div>
                <div className="flex items-center">
                  <FiHash className="h-5 w-5 text-[#10B981] mr-2" />
                  <div>
                    <p className="text-sm text-[#4B5563]">
                      Registration Number
                    </p>
                    <p className="font-medium">
                      {sessionData.activity.student.regNumber}
                    </p>
                  </div>
                </div>
                <div className="flex items-center">
                  <FiBook className="h-5 w-5 text-[#10B981] mr-2" />
                  <div>
                    <p className="text-sm text-[#4B5563]">Department</p>
                    <p className="font-medium">
                      {sessionData.activity.student.department}
                    </p>
                  </div>
                </div>
              </div>
            </div>

            {/* Activity Information */}
            <div className="mb-6">
              <h2 className="text-lg font-semibold text-[#1F2937] mb-4">
                Activity Information
              </h2>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div className="col-span-2">
                  <div className="flex items-start">
                    <FiBook className="h-5 w-5 text-[#10B981] mr-2 mt-1" />
                    <div>
                      <p className="text-sm text-[#4B5563]">Title</p>
                      <p className="font-medium">
                        {sessionData.activity.title}
                      </p>
                    </div>
                  </div>
                </div>
                <div className="col-span-2">
                  <div className="flex items-start">
                    <FiBook className="h-5 w-5 text-[#10B981] mr-2 mt-1" />
                    <div>
                      <p className="text-sm text-[#4B5563]">Description</p>
                      <p className="font-medium">
                        {sessionData.activity.description}
                      </p>
                    </div>
                  </div>
                </div>
                <div>
                  <div className="flex items-center">
                    <FiHash className="h-5 w-5 text-[#10B981] mr-2" />
                    <div>
                      <p className="text-sm text-[#4B5563]">Activity Type</p>
                      <p className="font-medium">
                        {sessionData.activity.activityType}
                      </p>
                    </div>
                  </div>
                </div>
                <div>
                  <div className="flex items-center">
                    <FiCalendar className="h-5 w-5 text-[#10B981] mr-2" />
                    <div>
                      <p className="text-sm text-[#4B5563]">Created At</p>
                      <p className="font-medium">
                        {new Date(
                          sessionData.activity.createdAt
                        ).toLocaleDateString()}
                      </p>
                    </div>
                  </div>
                </div>
              </div>
            </div>

            {/* Session Information */}
            <div className="mb-6">
              <h2 className="text-lg font-semibold text-[#1F2937] mb-4">
                Approval Session
              </h2>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                  <div className="flex items-center">
                    <FiCalendar className="h-5 w-5 text-[#10B981] mr-2" />
                    <div>
                      <p className="text-sm text-[#4B5563]">Expires At</p>
                      <p className="font-medium">
                        {new Date(sessionData.expiresAt).toLocaleDateString()}
                      </p>
                    </div>
                  </div>
                </div>
                <div>
                  <div className="flex items-center">
                    <FiClock className="h-5 w-5 text-[#10B981] mr-2" />
                    <div>
                      <p className="text-sm text-[#4B5563]">Days Remaining</p>
                      <p className="font-medium">
                        {Math.ceil(
                          (new Date(sessionData.expiresAt) - new Date()) /
                            (1000 * 60 * 60 * 24)
                        )}
                      </p>
                    </div>
                  </div>
                </div>
              </div>
            </div>

            {/* Verification Form */}
            <div>
              <h2 className="text-lg font-semibold text-[#1F2937] mb-4">
                Verify Credential
              </h2>
              <form onSubmit={handleSubmit} className="space-y-4">
                <div>
                  <label className="block text-sm font-medium text-[#4B5563] mb-1">
                    Credential ID *
                  </label>
                  <input
                    type="text"
                    value={credentialId}
                    onChange={(e) => setCredentialId(e.target.value)}
                    placeholder="Enter credential ID"
                    className="w-full px-4 py-2 bg-white border border-gray-300 rounded-lg text-[#1F2937] placeholder-[#9CA3AF] focus:outline-none focus:ring-2 focus:ring-[#10B981] focus:border-transparent"
                    required
                  />
                  <p className="text-xs text-[#6B7280] mt-1">
                    Enter the credential ID provided by the student
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
                      Verifying...
                    </>
                  ) : (
                    <>
                      <FiCheckCircle className="h-4 w-4" />
                      Verify Approval
                    </>
                  )}
                </motion.button>
              </form>
            </div>
          </div>
        )}

        <div className="bg-gray-50 p-4 border-t border-gray-200">
          <p className="text-xs text-center text-[#6B7280]">
            This verification session is valid until{" "}
            {sessionData
              ? new Date(sessionData.expiresAt).toLocaleDateString()
              : ""}
          </p>
        </div>
      </motion.div>
    </div>
  );
};

export default IssuerApproval;
