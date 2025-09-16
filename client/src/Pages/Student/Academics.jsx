// Academics.jsx
import React, { useState, useEffect } from "react";
import { getAcademics } from "../../Utils/Api";
import { useAuth } from "../../contexts/AuthContext";
import { motion } from "framer-motion";
import {
  FiBook,
  FiCalendar,
  FiAward,
  FiTrendingUp,
  FiAlertCircle,
  FiCheckCircle,
  FiHash,
  FiFileText,
  FiExternalLink,
  FiActivity,
} from "react-icons/fi";
import { toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";

const Academics = () => {
  const { user } = useAuth();
  const [attendance, setAttendance] = useState(null);
  const [grade, setGrade] = useState(null);
  const [approvedActivities, setApprovedActivities] = useState([]);
  const [loading, setLoading] = useState(true);
  const [activeActivityTab, setActiveActivityTab] = useState("all");

  useEffect(() => {
    fetchAcademics();
  }, []);

  const fetchAcademics = async () => {
    try {
      setLoading(true);
      const response = await getAcademics({ studentId: user._id });
      if (response.data.valid) {
        setAttendance(response.data.attendance);
        setGrade(response.data.grade);
        setApprovedActivities(response.data.approvedActivities || []);
      }
    } catch (error) {
      toast.error("Error Fetching Academic Information!");
      console.error("Error fetching academics:", error);
    } finally {
      setLoading(false);
    }
  };

  const calculateAttendancePercentage = () => {
    if (!attendance || attendance.totalHeld === 0) return 0;
    return ((attendance.totalAttended / attendance.totalHeld) * 100).toFixed(1);
  };

  const getAttendanceStatus = () => {
    const percentage = calculateAttendancePercentage();
    if (percentage >= 75) return "Good";
    if (percentage >= 60) return "Average";
    return "Low";
  };

  const getAttendanceColor = () => {
    const percentage = calculateAttendancePercentage();
    if (percentage >= 75) return "text-green-600 bg-green-100";
    if (percentage >= 60) return "text-yellow-600 bg-yellow-100";
    return "text-red-600 bg-red-100";
  };

  const getGradeStatus = () => {
    if (!grade) return "No data";
    if (grade.cgpa >= 8.5) return "Excellent";
    if (grade.cgpa >= 7.0) return "Good";
    if (grade.cgpa >= 5.5) return "Average";
    return "Needs Improvement";
  };

  const getGradeColor = () => {
    if (!grade) return "text-gray-600 bg-gray-100";
    if (grade.cgpa >= 8.5) return "text-green-600 bg-green-100";
    if (grade.cgpa >= 7.0) return "text-blue-600 bg-blue-100";
    if (grade.cgpa >= 5.5) return "text-yellow-600 bg-yellow-100";
    return "text-red-600 bg-red-100";
  };

  const getActivityTypeColor = (type) => {
    switch (type) {
      case "Curricular":
        return "bg-blue-100 text-blue-800";
      case "Co-Curricular":
        return "bg-purple-100 text-purple-800";
      case "Extra-Curricular":
        return "bg-green-100 text-green-800";
      default:
        return "bg-gray-100 text-gray-800";
    }
  };

  const filterActivitiesByType = (type) => {
    if (type === "all") return approvedActivities;
    return approvedActivities.filter(
      (activity) =>
        activity.activityType === type ||
        (type === "Curricular" && !activity.activityType) // Handle legacy data
    );
  };

  const getActivityTypeCount = (type) => {
    if (type === "all") return approvedActivities.length;
    return approvedActivities.filter(
      (activity) =>
        activity.activityType === type ||
        (type === "Curricular" && !activity.activityType)
    ).length;
  };

  if (loading) {
    return (
      <div className="flex items-center justify-center h-64">
        <div className="w-8 h-8 border-4 border-[#10B981] border-t-transparent rounded-full animate-spin"></div>
      </div>
    );
  }

  const filteredActivities = filterActivitiesByType(activeActivityTab);

  return (
    <div className="p-6">
      <div className="mb-6">
        <h1 className="text-2xl font-bold text-[#1F2937]">
          Academic Performance
        </h1>
        <p className="text-[#4B5563]">Your attendance and grade records</p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-6">
        {/* Attendance Card */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.3 }}
          className="bg-white rounded-lg shadow-md p-6"
        >
          <div className="flex items-center mb-4">
            <div className="w-12 h-12 rounded-full bg-blue-100 flex items-center justify-center text-blue-600 mr-4">
              <FiCalendar className="h-6 w-6" />
            </div>
            <div>
              <h2 className="text-xl font-bold text-[#1F2937]">Attendance</h2>
              <p className="text-[#4B5563]">Class attendance records</p>
            </div>
          </div>

          {attendance ? (
            <div className="space-y-4">
              <div className="grid grid-cols-2 gap-4">
                <div className="bg-gray-50 p-4 rounded-lg">
                  <p className="text-sm text-[#4B5563]">Total Classes</p>
                  <p className="text-2xl font-bold text-[#1F2937]">
                    {attendance.totalHeld}
                  </p>
                </div>
                <div className="bg-gray-50 p-4 rounded-lg">
                  <p className="text-sm text-[#4B5563]">Classes Attended</p>
                  <p className="text-2xl font-bold text-[#1F2937]">
                    {attendance.totalAttended}
                  </p>
                </div>
              </div>

              <div className="bg-gray-50 p-4 rounded-lg">
                <p className="text-sm text-[#4B5563] mb-2">
                  Attendance Percentage
                </p>
                <div className="flex items-center justify-between mb-2">
                  <span className="text-2xl font-bold text-[#1F2937]">
                    {calculateAttendancePercentage()}%
                  </span>
                  <span
                    className={`px-3 py-1 rounded-full text-sm font-medium ${getAttendanceColor()}`}
                  >
                    {getAttendanceStatus()}
                  </span>
                </div>
                <div className="w-full bg-gray-200 rounded-full h-2">
                  <div
                    className="h-2 rounded-full bg-[#10B981]"
                    style={{ width: `${calculateAttendancePercentage()}%` }}
                  ></div>
                </div>
              </div>

              {calculateAttendancePercentage() < 75 && (
                <div className="bg-yellow-50 border border-yellow-200 rounded-lg p-4">
                  <div className="flex items-start">
                    <FiAlertCircle className="h-5 w-5 text-yellow-600 mr-2 mt-0.5" />
                    <div>
                      <p className="text-sm font-medium text-yellow-800">
                        Attendance Alert
                      </p>
                      <p className="text-sm text-yellow-700">
                        Your attendance is below 75%. Please ensure regular
                        class attendance.
                      </p>
                    </div>
                  </div>
                </div>
              )}
            </div>
          ) : (
            <div className="text-center py-8">
              <FiCalendar className="h-12 w-12 text-gray-400 mx-auto mb-4" />
              <p className="text-[#4B5563]">No attendance records found</p>
              <p className="text-sm text-gray-500 mt-1">
                Attendance data will appear here once recorded by your faculty
              </p>
            </div>
          )}
        </motion.div>

        {/* Grades Card */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.3, delay: 0.1 }}
          className="bg-white rounded-lg shadow-md p-6"
        >
          <div className="flex items-center mb-4">
            <div className="w-12 h-12 rounded-full bg-purple-100 flex items-center justify-center text-purple-600 mr-4">
              <FiAward className="h-6 w-6" />
            </div>
            <div>
              <h2 className="text-xl font-bold text-[#1F2937]">Grades</h2>
              <p className="text-[#4B5563]">Academic performance</p>
            </div>
          </div>

          {grade ? (
            <div className="space-y-4">
              <div className="text-center py-6">
                <div className="w-24 h-24 bg-gradient-to-br from-purple-100 to-blue-100 rounded-full flex items-center justify-center mx-auto mb-4">
                  <span className="text-3xl font-bold text-[#1F2937]">
                    {grade.cgpa}
                  </span>
                </div>
                <p className="text-sm text-[#4B5563]">Current CGPA</p>
              </div>

              <div className="bg-gray-50 p-4 rounded-lg">
                <div className="flex items-center justify-between">
                  <span className="text-sm text-[#4B5563]">Performance</span>
                  <span
                    className={`px-3 py-1 rounded-full text-sm font-medium ${getGradeColor()}`}
                  >
                    {getGradeStatus()}
                  </span>
                </div>
              </div>

              <div className="grid grid-cols-3 gap-2 text-center">
                <div
                  className={`p-2 rounded-lg ${
                    grade.cgpa >= 5.5
                      ? "bg-green-100 text-green-800"
                      : "bg-gray-100 text-gray-500"
                  }`}
                >
                  <p className="text-xs">Pass</p>
                  <p className="font-semibold">≥5.5</p>
                </div>
                <div
                  className={`p-2 rounded-lg ${
                    grade.cgpa >= 7.0
                      ? "bg-blue-100 text-blue-800"
                      : "bg-gray-100 text-gray-500"
                  }`}
                >
                  <p className="text-xs">Good</p>
                  <p className="font-semibold">≥7.0</p>
                </div>
                <div
                  className={`p-2 rounded-lg ${
                    grade.cgpa >= 8.5
                      ? "bg-purple-100 text-purple-800"
                      : "bg-gray-100 text-gray-500"
                  }`}
                >
                  <p className="text-xs">Excellent</p>
                  <p className="font-semibold">≥8.5</p>
                </div>
              </div>
            </div>
          ) : (
            <div className="text-center py-8">
              <FiAward className="h-12 w-12 text-gray-400 mx-auto mb-4" />
              <p className="text-[#4B5563]">No grade records found</p>
              <p className="text-sm text-gray-500 mt-1">
                Grade data will appear here once recorded by your faculty
              </p>
            </div>
          )}
        </motion.div>
      </div>

      {/* Approved Activities Section */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.3, delay: 0.2 }}
        className="bg-white rounded-lg shadow-md p-6 mb-6"
      >
        <div className="flex justify-between items-center mb-6">
          <div>
            <h2 className="text-xl font-bold text-[#1F2937]">
              Approved Activities
            </h2>
            <p className="text-[#4B5563]">
              Your approved extracurricular activities
            </p>
          </div>
          <div className="flex items-center gap-2">
            <FiActivity className="h-5 w-5 text-[#10B981]" />
            <span className="text-sm font-medium text-[#4B5563]">
              Total: {approvedActivities.length}
            </span>
          </div>
        </div>

        {/* Activity Tabs */}
        <div className="bg-gray-100 rounded-lg p-1 mb-6">
          <div className="flex overflow-x-auto">
            {["all", "Curricular", "Co-Curricular", "Extra-Curricular"].map(
              (tab) => (
                <button
                  key={tab}
                  onClick={() => setActiveActivityTab(tab)}
                  className={`px-4 py-2 font-medium text-sm whitespace-nowrap rounded-md ${
                    activeActivityTab === tab
                      ? "bg-white text-[#10B981] shadow-sm"
                      : "text-[#4B5563] hover:text-[#1F2937]"
                  }`}
                >
                  {tab === "all" ? "All Activities" : tab}
                  <span className="ml-2 px-2 py-1 bg-gray-200 rounded-full text-xs">
                    {getActivityTypeCount(tab)}
                  </span>
                </button>
              )
            )}
          </div>
        </div>

        {/* Activities List */}
        {filteredActivities.length === 0 ? (
          <div className="text-center py-8">
            <FiFileText className="h-12 w-12 text-gray-400 mx-auto mb-4" />
            <p className="text-[#4B5563]">
              {activeActivityTab === "all"
                ? "No approved activities found."
                : `No ${activeActivityTab} activities found.`}
            </p>
            <p className="text-sm text-gray-500 mt-1">
              Activities will appear here once approved by your faculty
            </p>
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
            {filteredActivities.map((activity) => (
              <motion.div
                key={activity._id}
                whileHover={{ scale: 1.02 }}
                className="bg-gray-50 rounded-lg p-4 border border-gray-200"
              >
                <div className="flex justify-between items-start mb-3">
                  <div>
                    <h3 className="font-medium text-[#1F2937]">
                      {activity.title}
                    </h3>
                    <p className="text-sm text-[#4B5563]">
                      {activity.credentialId}
                    </p>
                  </div>
                  {activity.activityType && (
                    <span
                      className={`px-2 py-1 rounded-full text-xs font-medium ${getActivityTypeColor(
                        activity.activityType
                      )}`}
                    >
                      {activity.activityType}
                    </span>
                  )}
                </div>

                <p className="text-sm text-[#4B5563] mb-3 line-clamp-2">
                  {activity.description}
                </p>

                {activity.remarks && (
                  <div className="mb-3">
                    <p className="text-xs font-medium text-[#4B5563]">
                      Faculty Remarks:
                    </p>
                    <p className="text-xs text-[#6B7280]">{activity.remarks}</p>
                  </div>
                )}

                <div className="flex justify-between items-center">
                  <span className="text-xs text-[#6B7280]">
                    {new Date(activity.createdAt).toLocaleDateString()}
                  </span>
                  {activity.attachmentLink && (
                    <motion.a
                      whileHover={{ scale: 1.1 }}
                      href={activity.attachmentLink}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="p-1 text-blue-600 hover:bg-blue-100 rounded"
                      title="View Attachment"
                    >
                      <FiExternalLink className="h-4 w-4" />
                    </motion.a>
                  )}
                </div>
              </motion.div>
            ))}
          </div>
        )}
      </motion.div>

      {/* Additional Information */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.3, delay: 0.3 }}
        className="bg-white rounded-lg shadow-md p-6"
      >
        <h3 className="text-lg font-bold text-[#1F2937] mb-4">
          Academic Information
        </h3>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div className="flex items-center">
            <FiBook className="h-5 w-5 text-[#10B981] mr-3" />
            <div>
              <p className="text-sm text-[#4B5563]">Department</p>
              <p className="font-medium text-[#1F2937]">
                {user.department || "Not specified"}
              </p>
            </div>
          </div>
          <div className="flex items-center">
            <FiBook className="h-5 w-5 text-[#10B981] mr-3" />
            <div>
              <p className="text-sm text-[#4B5563]">Course</p>
              <p className="font-medium text-[#1F2937]">
                {user.course || "Not specified"}
              </p>
            </div>
          </div>
          <div className="flex items-center">
            <FiCalendar className="h-5 w-5 text-[#10B981] mr-3" />
            <div>
              <p className="text-sm text-[#4B5563]">Academic Year</p>
              <p className="font-medium text-[#1F2937]">
                {user.year || "Not specified"}
              </p>
            </div>
          </div>
          <div className="flex items-center">
            <FiHash className="h-5 w-5 text-[#10B981] mr-3" />
            <div>
              <p className="text-sm text-[#4B5563]">Registration Number</p>
              <p className="font-medium text-[#1F2937]">
                {user.regNumber || "Not specified"}
              </p>
            </div>
          </div>
        </div>
      </motion.div>
    </div>
  );
};

export default Academics;
