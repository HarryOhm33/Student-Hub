import React, { useState } from "react";
import { getInstituteWiseStatsAadhar } from "../Utils/Api";
import { motion, AnimatePresence } from "framer-motion";
import {
  FiSearch,
  FiUser,
  FiBook,
  FiAward,
  FiActivity,
  FiCheckCircle,
  FiClock,
  FiXCircle,
  FiHome,
  FiHash,
  FiChevronDown,
  FiChevronUp,
  FiFileText,
} from "react-icons/fi";
import { toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";

const StudentSearch = () => {
  const [aadhar, setAadhar] = useState("");
  const [loading, setLoading] = useState(false);
  const [searchData, setSearchData] = useState(null);
  const [expandedInstitute, setExpandedInstitute] = useState(null);

  const handleSearch = async (e) => {
    e.preventDefault();
    if (!aadhar.trim()) {
      toast.error("Please enter Aadhar number");
      return;
    }

    if (aadhar.length !== 12) {
      toast.error("Aadhar number must be 12 digits");
      return;
    }

    try {
      setLoading(true);
      const response = await getInstituteWiseStatsAadhar({ aadhar });

      if (response.data.valid) {
        setSearchData(response.data);
        setExpandedInstitute(null);
        toast.success("Data fetched successfully!");
      } else {
        toast.error("No data found for this Aadhar number");
        setSearchData(null);
      }
    } catch (error) {
      console.error("Error fetching data:", error);
      toast.error("Error fetching data. Please try again.");
      setSearchData(null);
    } finally {
      setLoading(false);
    }
  };

  const toggleInstitute = (instituteId) => {
    if (expandedInstitute === instituteId) {
      setExpandedInstitute(null);
    } else {
      setExpandedInstitute(instituteId);
    }
  };

  // Function to categorize activities by status
  const categorizeActivities = (activities) => {
    const categorized = {
      validated: [],
      unvalidated: [],
      unlooked: [],
    };

    activities.forEach((activity) => {
      if (activity.status === "Validated") {
        categorized.validated.push(activity);
      } else if (activity.status === "Un-validated") {
        categorized.unvalidated.push(activity);
      } else if (activity.status === "Un-Looked") {
        categorized.unlooked.push(activity);
      }
    });

    return categorized;
  };

  return (
    <div className="p-6">
      {/* Header */}
      <div className="flex flex-col md:flex-row justify-between items-start md:items-center mb-6 gap-4">
        <div>
          <h1 className="text-2xl font-bold text-[#1F2937]">Student Search</h1>
          <p className="text-[#4B5563]">
            Search student data by Aadhar number across institutes
          </p>
        </div>
      </div>

      {/* Search Form */}
      <div className="bg-white rounded-lg shadow-md p-6 mb-6">
        <form onSubmit={handleSearch} className="space-y-4">
          <div>
            <label className="block text-sm font-medium text-[#4B5563] mb-2">
              Aadhar Number
            </label>
            <div className="relative">
              <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                <FiHash className="h-5 w-5 text-gray-500" />
              </div>
              <input
                type="text"
                value={aadhar}
                onChange={(e) =>
                  setAadhar(e.target.value.replace(/\D/g, "").slice(0, 12))
                }
                placeholder="Enter 12-digit Aadhar number"
                className="pl-10 w-full px-4 py-3 bg-white border border-gray-300 rounded-lg text-gray-800 placeholder-gray-500 focus:outline-none focus:ring-2 focus:ring-green-500 focus:border-transparent transition-colors"
                maxLength={12}
              />
            </div>
            <p className="text-xs text-gray-500 mt-1">
              Enter 12-digit Aadhar number (numbers only)
            </p>
          </div>

          <motion.button
            whileHover={{ scale: 1.02 }}
            whileTap={{ scale: 0.98 }}
            type="submit"
            disabled={loading}
            className="w-full bg-gradient-to-r from-green-500 to-green-600 text-white py-3 rounded-lg font-semibold flex items-center justify-center gap-2 hover:from-green-600 hover:to-green-700 transition-all shadow-md disabled:opacity-50"
          >
            {loading ? (
              <div className="w-5 h-5 border-2 border-white border-t-transparent rounded-full animate-spin"></div>
            ) : (
              <>
                <FiSearch className="h-5 w-5" />
                Search
              </>
            )}
          </motion.button>
        </form>
      </div>

      {/* Results Section */}
      {searchData && (
        <div className="space-y-6">
          {/* Aadhar Info */}
          <div className="bg-white rounded-lg shadow-md p-6">
            <h2 className="text-xl font-bold text-[#1F2937] mb-4 flex items-center gap-2">
              <FiUser className="h-5 w-5 text-blue-600" />
              Search Results for Aadhar: {searchData.aadhar}
            </h2>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div className="p-3 bg-blue-50 rounded-lg">
                <p className="text-sm text-blue-800 font-medium">
                  Total Institutes
                </p>
                <p className="text-2xl font-bold text-blue-600">
                  {searchData.institutes.length}
                </p>
              </div>
              <div className="p-3 bg-green-50 rounded-lg">
                <p className="text-sm text-green-800 font-medium">
                  Total Students
                </p>
                <p className="text-2xl font-bold text-green-600">
                  {searchData.institutes.reduce(
                    (total, inst) => total + inst.student.length,
                    0
                  )}
                </p>
              </div>
            </div>
          </div>

          {/* Institutes List */}
          <div className="space-y-4">
            <h3 className="text-lg font-semibold text-[#1F2937] flex items-center gap-2">
              <FiHome className="h-5 w-5 text-purple-600" />
              Associated Institutes
            </h3>

            {searchData.institutes.map((instituteData, index) => {
              const isExpanded =
                expandedInstitute === instituteData.institute._id;

              return (
                <motion.div
                  key={instituteData.institute._id}
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: index * 0.1 }}
                  className="bg-white rounded-lg shadow-md overflow-hidden"
                >
                  {/* Institute Header */}
                  <div
                    className="p-4 cursor-pointer hover:bg-gray-50 transition-colors"
                    onClick={() => toggleInstitute(instituteData.institute._id)}
                  >
                    <div className="flex items-center justify-between">
                      <div className="flex items-center gap-3">
                        <div className="w-10 h-10 rounded-full bg-purple-100 flex items-center justify-center text-purple-600">
                          <FiHome className="h-5 w-5" />
                        </div>
                        <div>
                          <h4 className="font-semibold text-[#1F2937]">
                            {instituteData.institute.name}
                          </h4>
                          <p className="text-sm text-[#6B7280]">
                            Code: {instituteData.institute.code}
                          </p>
                        </div>
                      </div>
                      <div className="flex items-center gap-4">
                        <span className="text-sm text-gray-600">
                          {instituteData.student.length} student(s)
                        </span>
                        {isExpanded ? (
                          <FiChevronUp className="h-5 w-5 text-gray-500" />
                        ) : (
                          <FiChevronDown className="h-5 w-5 text-gray-500" />
                        )}
                      </div>
                    </div>
                  </div>

                  {/* Expanded Content - Student Details */}
                  <AnimatePresence>
                    {isExpanded && (
                      <motion.div
                        initial={{ opacity: 0, height: 0 }}
                        animate={{ opacity: 1, height: "auto" }}
                        exit={{ opacity: 0, height: 0 }}
                        transition={{ duration: 0.3 }}
                        className="border-t border-gray-200 overflow-hidden"
                      >
                        {instituteData.student.map((student) => {
                          const categorizedActivities = categorizeActivities(
                            student.activities || []
                          );

                          return (
                            <div key={student._id} className="p-4">
                              {/* Student Information */}
                              <div className="bg-blue-50 rounded-lg p-4 mb-6">
                                <h5 className="font-semibold text-[#1F2937] mb-3 flex items-center gap-2">
                                  <FiUser className="h-5 w-5 text-blue-600" />
                                  Student Details
                                </h5>
                                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                                  <div>
                                    <p className="text-sm text-gray-600">
                                      Name
                                    </p>
                                    <p className="font-medium text-[#1F2937]">
                                      {student.name}
                                    </p>
                                  </div>
                                  <div>
                                    <p className="text-sm text-gray-600">
                                      Registration Number
                                    </p>
                                    <p className="font-medium text-[#1F2937]">
                                      {student.regNumber}
                                    </p>
                                  </div>
                                  <div>
                                    <p className="text-sm text-gray-600">
                                      CGPA
                                    </p>
                                    <p className="font-medium text-[#1F2937]">
                                      {student.academics?.cgpa || "N/A"}
                                    </p>
                                  </div>
                                  <div>
                                    <p className="text-sm text-gray-600">
                                      Attendance
                                    </p>
                                    <p className="font-medium text-[#1F2937]">
                                      {student.academics?.attendance || "N/A"}%
                                    </p>
                                  </div>
                                </div>
                              </div>

                              {/* Activity Statistics */}
                              <div className="bg-gray-50 p-4 rounded-lg mb-6">
                                <h5 className="font-semibold text-[#1F2937] mb-3 flex items-center gap-2">
                                  <FiActivity className="h-5 w-5 text-gray-600" />
                                  Activity Statistics
                                </h5>
                                <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                                  <div className="text-center p-3 bg-gray-100 rounded-lg">
                                    <p className="text-sm text-gray-600">
                                      Total
                                    </p>
                                    <p className="text-xl font-bold text-gray-800">
                                      {student.activities?.length || 0}
                                    </p>
                                  </div>
                                  <div className="text-center p-3 bg-green-100 rounded-lg">
                                    <FiCheckCircle className="h-5 w-5 text-green-600 mx-auto mb-1" />
                                    <p className="text-sm text-green-600">
                                      Validated
                                    </p>
                                    <p className="text-lg font-bold text-green-700">
                                      {categorizedActivities.validated.length}
                                    </p>
                                  </div>
                                  <div className="text-center p-3 bg-red-100 rounded-lg">
                                    <FiXCircle className="h-5 w-5 text-red-600 mx-auto mb-1" />
                                    <p className="text-sm text-red-600">
                                      Un-Validated
                                    </p>
                                    <p className="text-lg font-bold text-red-700">
                                      {categorizedActivities.unvalidated.length}
                                    </p>
                                  </div>
                                  <div className="text-center p-3 bg-yellow-100 rounded-lg">
                                    <FiClock className="h-5 w-5 text-yellow-600 mx-auto mb-1" />
                                    <p className="text-sm text-yellow-600">
                                      Un-Looked
                                    </p>
                                    <p className="text-lg font-bold text-yellow-700">
                                      {categorizedActivities.unlooked.length}
                                    </p>
                                  </div>
                                </div>
                              </div>

                              {/* Activities by Status */}
                              {student.activities &&
                                student.activities.length > 0 && (
                                  <div>
                                    <h5 className="font-semibold text-[#1F2937] mb-3 flex items-center gap-2">
                                      <FiActivity className="h-5 w-5 text-blue-600" />
                                      Activities
                                    </h5>

                                    {/* Validated Activities */}
                                    {categorizedActivities.validated.length >
                                      0 && (
                                      <div className="mb-6">
                                        <h6 className="text-sm font-medium text-green-700 mb-2 flex items-center gap-1">
                                          <FiCheckCircle className="h-4 w-4" />
                                          Validated Activities (
                                          {
                                            categorizedActivities.validated
                                              .length
                                          }
                                          )
                                        </h6>
                                        <div className="space-y-3">
                                          {categorizedActivities.validated.map(
                                            (activity) => (
                                              <motion.div
                                                key={activity._id}
                                                className="p-4 bg-green-50 rounded-lg border border-green-100"
                                                initial={{ opacity: 0, y: 10 }}
                                                animate={{ opacity: 1, y: 0 }}
                                                transition={{ delay: 0.1 }}
                                              >
                                                <p className="font-medium text-green-800">
                                                  {activity.title}
                                                </p>
                                                <p className="text-sm text-green-700 mt-1">
                                                  {activity.description}
                                                </p>
                                                <div className="flex flex-wrap gap-2 mt-3">
                                                  <span className="text-xs text-green-600 bg-green-100 px-2 py-1 rounded-full">
                                                    {activity.activityType}
                                                  </span>
                                                  <span className="text-xs text-green-600 bg-green-100 px-2 py-1 rounded-full">
                                                    {activity.credentialId}
                                                  </span>
                                                  <span className="text-xs text-green-600">
                                                    {new Date(
                                                      activity.createdAt
                                                    ).toLocaleDateString()}
                                                  </span>
                                                </div>
                                                {activity.remarks && (
                                                  <p className="text-xs text-green-600 mt-2">
                                                    Remarks: {activity.remarks}
                                                  </p>
                                                )}
                                              </motion.div>
                                            )
                                          )}
                                        </div>
                                      </div>
                                    )}

                                    {/* Un-Validated Activities */}
                                    {categorizedActivities.unvalidated.length >
                                      0 && (
                                      <div className="mb-6">
                                        <h6 className="text-sm font-medium text-red-700 mb-2 flex items-center gap-1">
                                          <FiXCircle className="h-4 w-4" />
                                          Un-Validated Activities (
                                          {
                                            categorizedActivities.unvalidated
                                              .length
                                          }
                                          )
                                        </h6>
                                        <div className="space-y-3">
                                          {categorizedActivities.unvalidated.map(
                                            (activity) => (
                                              <motion.div
                                                key={activity._id}
                                                className="p-4 bg-red-50 rounded-lg border border-red-100"
                                                initial={{ opacity: 0, y: 10 }}
                                                animate={{ opacity: 1, y: 0 }}
                                                transition={{ delay: 0.2 }}
                                              >
                                                <p className="font-medium text-red-800">
                                                  {activity.title}
                                                </p>
                                                <p className="text-sm text-red-700 mt-1">
                                                  {activity.description}
                                                </p>
                                                <div className="flex flex-wrap gap-2 mt-3">
                                                  <span className="text-xs text-red-600 bg-red-100 px-2 py-1 rounded-full">
                                                    {activity.activityType}
                                                  </span>
                                                  <span className="text-xs text-red-600 bg-red-100 px-2 py-1 rounded-full">
                                                    {activity.credentialId}
                                                  </span>
                                                  <span className="text-xs text-red-600">
                                                    {new Date(
                                                      activity.createdAt
                                                    ).toLocaleDateString()}
                                                  </span>
                                                </div>
                                                {activity.remarks && (
                                                  <p className="text-xs text-red-600 mt-2">
                                                    Remarks: {activity.remarks}
                                                  </p>
                                                )}
                                              </motion.div>
                                            )
                                          )}
                                        </div>
                                      </div>
                                    )}

                                    {/* Un-Looked Activities */}
                                    {categorizedActivities.unlooked.length >
                                      0 && (
                                      <div className="mb-6">
                                        <h6 className="text-sm font-medium text-yellow-700 mb-2 flex items-center gap-1">
                                          <FiClock className="h-4 w-4" />
                                          Un-Looked Activities (
                                          {
                                            categorizedActivities.unlooked
                                              .length
                                          }
                                          )
                                        </h6>
                                        <div className="space-y-3">
                                          {categorizedActivities.unlooked.map(
                                            (activity) => (
                                              <motion.div
                                                key={activity._id}
                                                className="p-4 bg-yellow-50 rounded-lg border border-yellow-100"
                                                initial={{ opacity: 0, y: 10 }}
                                                animate={{ opacity: 1, y: 0 }}
                                                transition={{ delay: 0.3 }}
                                              >
                                                <p className="font-medium text-yellow-800">
                                                  {activity.title}
                                                </p>
                                                <p className="text-sm text-yellow-700 mt-1">
                                                  {activity.description}
                                                </p>
                                                <div className="flex flex-wrap gap-2 mt-3">
                                                  <span className="text-xs text-yellow-600 bg-yellow-100 px-2 py-1 rounded-full">
                                                    {activity.activityType}
                                                  </span>
                                                  <span className="text-xs text-yellow-600 bg-yellow-100 px-2 py-1 rounded-full">
                                                    {activity.credentialId}
                                                  </span>
                                                  <span className="text-xs text-yellow-600">
                                                    {new Date(
                                                      activity.createdAt
                                                    ).toLocaleDateString()}
                                                  </span>
                                                </div>
                                              </motion.div>
                                            )
                                          )}
                                        </div>
                                      </div>
                                    )}
                                  </div>
                                )}
                            </div>
                          );
                        })}
                      </motion.div>
                    )}
                  </AnimatePresence>
                </motion.div>
              );
            })}
          </div>
        </div>
      )}

      {/* Empty State */}
      {searchData && searchData.institutes.length === 0 && (
        <div className="bg-white rounded-lg shadow-md p-8 text-center">
          <FiFileText className="h-12 w-12 text-gray-400 mx-auto mb-4" />
          <h3 className="text-lg font-medium text-gray-900 mb-2">
            No Institutes Found
          </h3>
          <p className="text-gray-500">
            No institute data found for the provided Aadhar number.
          </p>
        </div>
      )}
    </div>
  );
};

export default StudentSearch;
