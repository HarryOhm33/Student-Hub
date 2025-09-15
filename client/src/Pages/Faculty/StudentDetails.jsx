// StudentDetails.jsx
import React, { useState, useEffect } from "react";
import { useParams, useNavigate } from "react-router-dom";
import { getStudentById, addGrade, addAttendance } from "../../Utils/Api";
import { useAuth } from "../../contexts/AuthContext";
import { motion } from "framer-motion";
import {
  FiUser,
  FiMail,
  FiHash,
  FiBook,
  FiCalendar,
  FiArrowLeft,
  FiEdit,
  FiCheck,
  FiX,
  FiPercent,
  FiAward,
} from "react-icons/fi";
import { toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";

const StudentDetails = () => {
  const { id: studentId } = useParams();
  const navigate = useNavigate();
  const { user } = useAuth();
  const [student, setStudent] = useState(null);
  const [attendance, setAttendance] = useState(null);
  const [grade, setGrade] = useState(null);
  const [loading, setLoading] = useState(true);
  const [editingGrade, setEditingGrade] = useState(false);
  const [editingAttendance, setEditingAttendance] = useState(false);
  const [gradeForm, setGradeForm] = useState({ cgpa: "" });
  const [attendanceForm, setAttendanceForm] = useState({
    totalHeld: "",
    totalAttended: "",
  });

  useEffect(() => {
    fetchStudentDetails();
  }, [studentId]);

  const fetchStudentDetails = async () => {
    try {
      setLoading(true);
      const response = await getStudentById({ studentId });
      if (response.data.valid) {
        setStudent(response.data.student);
        setAttendance(response.data.attendance);
        setGrade(response.data.grade);

        // Initialize forms with existing data
        if (response.data.grade) {
          setGradeForm({ cgpa: response.data.grade.cgpa.toString() });
        }
        if (response.data.attendance) {
          setAttendanceForm({
            totalHeld: response.data.attendance.totalHeld.toString(),
            totalAttended: response.data.attendance.totalAttended.toString(),
          });
        }
      }
    } catch (error) {
      toast.error("Error Fetching Student Details!");
      console.error("Error fetching student details:", error);
    } finally {
      setLoading(false);
    }
  };

  const handleGradeSubmit = async (e) => {
    e.preventDefault();
    try {
      const response = await addGrade({
        studentId: studentId,
        cgpa: parseFloat(gradeForm.cgpa),
      });

      if (response?.data?.valid) {
        toast.success("Grade updated successfully!");
        setEditingGrade(false);
        fetchStudentDetails(); // Refresh data
      } else {
        toast.error("Failed to update grade.");
      }
    } catch (error) {
      console.error("Error updating grade:", error);
      toast.error("Error updating grade!");
    }
  };

  const handleAttendanceSubmit = async (e) => {
    e.preventDefault();
    try {
      const response = await addAttendance({
        studentId: studentId,
        totalHeld: parseInt(attendanceForm.totalHeld),
        totalAttended: parseInt(attendanceForm.totalAttended),
      });

      if (response?.data?.valid) {
        toast.success("Attendance updated successfully!");
        setEditingAttendance(false);
        fetchStudentDetails(); // Refresh data
      } else {
        toast.error("Failed to update attendance.");
      }
    } catch (error) {
      console.error("Error updating attendance:", error);
      toast.error("Error updating attendance!");
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
    if (percentage >= 75) return "text-green-600";
    if (percentage >= 60) return "text-yellow-600";
    return "text-red-600";
  };

  if (loading) {
    return (
      <div className="flex items-center justify-center h-64">
        <div className="w-8 h-8 border-4 border-[#10B981] border-t-transparent rounded-full animate-spin"></div>
      </div>
    );
  }

  if (!student) {
    return (
      <div className="p-6 text-center">
        <p className="text-[#4B5563]">Student not found.</p>
        <button
          onClick={() => navigate(-1)}
          className="mt-4 px-4 py-2 bg-[#10B981] text-white rounded-lg"
        >
          Go Back
        </button>
      </div>
    );
  }

  return (
    <div className="p-6">
      {/* Header */}
      <div className="flex items-center mb-6">
        <motion.button
          whileHover={{ scale: 1.05 }}
          whileTap={{ scale: 0.95 }}
          onClick={() => navigate(-1)}
          className="flex items-center gap-2 px-4 py-2 bg-gray-200 hover:bg-gray-300 text-gray-700 rounded-lg font-semibold mr-4"
        >
          <FiArrowLeft className="h-4 w-4" />
          Back
        </motion.button>
        <div>
          <h1 className="text-2xl font-bold text-[#1F2937]">Student Details</h1>
          <p className="text-[#4B5563]">View and manage student information</p>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Student Information Card */}
        <div className="lg:col-span-2 bg-white rounded-lg shadow-md p-6">
          <h2 className="text-xl font-bold text-[#1F2937] mb-4">
            Student Information
          </h2>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div className="flex items-center">
              <div className="w-12 h-12 rounded-full bg-[#10B981] flex items-center justify-center text-white mr-4">
                <FiUser className="h-6 w-6" />
              </div>
              <div>
                <p className="text-sm text-[#4B5563]">Name</p>
                <p className="font-medium text-[#1F2937]">{student.name}</p>
              </div>
            </div>

            <div className="flex items-center">
              <FiMail className="h-6 w-6 text-[#10B981] mr-4" />
              <div>
                <p className="text-sm text-[#4B5563]">Email</p>
                <p className="font-medium text-[#1F2937]">{student.email}</p>
              </div>
            </div>

            <div className="flex items-center">
              <FiHash className="h-6 w-6 text-[#10B981] mr-4" />
              <div>
                <p className="text-sm text-[#4B5563]">Registration Number</p>
                <p className="font-medium text-[#1F2937]">
                  {student.regNumber}
                </p>
              </div>
            </div>

            <div className="flex items-center">
              <FiBook className="h-6 w-6 text-[#10B981] mr-4" />
              <div>
                <p className="text-sm text-[#4B5563]">Department</p>
                <p className="font-medium text-[#1F2937]">
                  {student.department}
                </p>
              </div>
            </div>

            <div className="flex items-center">
              <FiBook className="h-6 w-6 text-[#10B981] mr-4" />
              <div>
                <p className="text-sm text-[#4B5563]">Course</p>
                <p className="font-medium text-[#1F2937]">{student.course}</p>
              </div>
            </div>

            <div className="flex items-center">
              <FiCalendar className="h-6 w-6 text-[#10B981] mr-4" />
              <div>
                <p className="text-sm text-[#4B5563]">Academic Year</p>
                <p className="font-medium text-[#1F2937]">{student.year}</p>
              </div>
            </div>
          </div>
        </div>

        {/* Attendance Card */}
        <div className="bg-white rounded-lg shadow-md p-6">
          <div className="flex justify-between items-center mb-4">
            <h2 className="text-xl font-bold text-[#1F2937]">Attendance</h2>
            {!editingAttendance ? (
              <motion.button
                whileHover={{ scale: 1.1 }}
                whileTap={{ scale: 0.9 }}
                onClick={() => setEditingAttendance(true)}
                className="p-2 text-[#10B981] hover:bg-gray-100 rounded-full"
              >
                <FiEdit className="h-5 w-5" />
              </motion.button>
            ) : (
              <div className="flex gap-2">
                <motion.button
                  whileHover={{ scale: 1.1 }}
                  whileTap={{ scale: 0.9 }}
                  onClick={() => {
                    setEditingAttendance(false);
                    if (attendance) {
                      setAttendanceForm({
                        totalHeld: attendance.totalHeld.toString(),
                        totalAttended: attendance.totalAttended.toString(),
                      });
                    }
                  }}
                  className="p-2 text-red-500 hover:bg-gray-100 rounded-full"
                >
                  <FiX className="h-5 w-5" />
                </motion.button>
                <motion.button
                  whileHover={{ scale: 1.1 }}
                  whileTap={{ scale: 0.9 }}
                  onClick={handleAttendanceSubmit}
                  className="p-2 text-green-500 hover:bg-gray-100 rounded-full"
                >
                  <FiCheck className="h-5 w-5" />
                </motion.button>
              </div>
            )}
          </div>

          {editingAttendance ? (
            <form onSubmit={handleAttendanceSubmit} className="space-y-4">
              <div>
                <label className="block text-sm font-medium text-[#4B5563] mb-1">
                  Total Classes Held
                </label>
                <input
                  type="number"
                  value={attendanceForm.totalHeld}
                  onChange={(e) =>
                    setAttendanceForm({
                      ...attendanceForm,
                      totalHeld: e.target.value,
                    })
                  }
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-[#10B981]"
                  min="0"
                  required
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-[#4B5563] mb-1">
                  Total Classes Attended
                </label>
                <input
                  type="number"
                  value={attendanceForm.totalAttended}
                  onChange={(e) =>
                    setAttendanceForm({
                      ...attendanceForm,
                      totalAttended: e.target.value,
                    })
                  }
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-[#10B981]"
                  min="0"
                  max={attendanceForm.totalHeld}
                  required
                />
              </div>
            </form>
          ) : attendance ? (
            <div className="space-y-3">
              <div className="flex justify-between items-center">
                <span className="text-[#4B5563]">Classes Held:</span>
                <span className="font-medium">{attendance.totalHeld}</span>
              </div>
              <div className="flex justify-between items-center">
                <span className="text-[#4B5563]">Classes Attended:</span>
                <span className="font-medium">{attendance.totalAttended}</span>
              </div>
              <div className="flex justify-between items-center">
                <span className="text-[#4B5563]">Percentage:</span>
                <span className={`font-medium ${getAttendanceColor()}`}>
                  {calculateAttendancePercentage()}%
                </span>
              </div>
              <div className="flex justify-between items-center">
                <span className="text-[#4B5563]">Status:</span>
                <span className={`font-medium ${getAttendanceColor()}`}>
                  {getAttendanceStatus()}
                </span>
              </div>
            </div>
          ) : (
            <p className="text-[#4B5563]">No attendance record found.</p>
          )}
        </div>

        {/* Grade Card */}
        <div className="bg-white rounded-lg shadow-md p-6">
          <div className="flex justify-between items-center mb-4">
            <h2 className="text-xl font-bold text-[#1F2937]">Grades</h2>
            {!editingGrade ? (
              <motion.button
                whileHover={{ scale: 1.1 }}
                whileTap={{ scale: 0.9 }}
                onClick={() => setEditingGrade(true)}
                className="p-2 text-[#10B981] hover:bg-gray-100 rounded-full"
              >
                <FiEdit className="h-5 w-5" />
              </motion.button>
            ) : (
              <div className="flex gap-2">
                <motion.button
                  whileHover={{ scale: 1.1 }}
                  whileTap={{ scale: 0.9 }}
                  onClick={() => {
                    setEditingGrade(false);
                    if (grade) {
                      setGradeForm({ cgpa: grade.cgpa.toString() });
                    }
                  }}
                  className="p-2 text-red-500 hover:bg-gray-100 rounded-full"
                >
                  <FiX className="h-5 w-5" />
                </motion.button>
                <motion.button
                  whileHover={{ scale: 1.1 }}
                  whileTap={{ scale: 0.9 }}
                  onClick={handleGradeSubmit}
                  className="p-2 text-green-500 hover:bg-gray-100 rounded-full"
                >
                  <FiCheck className="h-5 w-5" />
                </motion.button>
              </div>
            )}
          </div>

          {editingGrade ? (
            <form onSubmit={handleGradeSubmit} className="space-y-4">
              <div>
                <label className="block text-sm font-medium text-[#4B5563] mb-1">
                  CGPA
                </label>
                <input
                  type="number"
                  step="0.1"
                  min="0"
                  max="10"
                  value={gradeForm.cgpa}
                  onChange={(e) => setGradeForm({ cgpa: e.target.value })}
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-[#10B981]"
                  required
                />
              </div>
            </form>
          ) : grade ? (
            <div className="text-center">
              <div className="w-20 h-20 bg-[#ECFDF5] rounded-full flex items-center justify-center mx-auto mb-4">
                <span className="text-2xl font-bold text-[#10B981]">
                  {grade.cgpa}
                </span>
              </div>
              <p className="text-[#4B5563]">Current CGPA</p>
            </div>
          ) : (
            <p className="text-[#4B5563]">No grade record found.</p>
          )}
        </div>
      </div>
    </div>
  );
};

export default StudentDetails;
