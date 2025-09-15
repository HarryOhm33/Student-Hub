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
} from "react-icons/fi";
import { toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";

const Academics = () => {
  const { user } = useAuth();
  const [attendance, setAttendance] = useState(null);
  const [grade, setGrade] = useState(null);
  const [loading, setLoading] = useState(true);

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

  const getGradeIcon = () => {
    if (!grade) return <FiAlertCircle className="h-6 w-6" />;
    if (grade.cgpa >= 8.5) return <FiTrendingUp className="h-6 w-6" />;
    if (grade.cgpa >= 7.0) return <FiCheckCircle className="h-6 w-6" />;
    return <FiAlertCircle className="h-6 w-6" />;
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
      <div className="mb-6">
        <h1 className="text-2xl font-bold text-[#1F2937]">
          Academic Performance
        </h1>
        <p className="text-[#4B5563]">Your attendance and grade records</p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
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

      {/* Additional Information */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.3, delay: 0.2 }}
        className="bg-white rounded-lg shadow-md p-6 mt-6"
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
