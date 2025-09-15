// Institute.jsx
import React, { useState, useEffect } from "react";
import { getInstituteDetails, addDepartment, addCourse } from "../../Utils/Api";
import { useAuth } from "../../contexts/AuthContext";
import { motion, AnimatePresence } from "framer-motion";
import {
  FiPlus,
  FiX,
  FiBook,
  FiHash,
  FiHome,
  FiMail,
  FiCalendar,
  FiAward,
} from "react-icons/fi";
import { toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";

const Institute = () => {
  const { user } = useAuth();
  const [institute, setInstitute] = useState(null);
  const [loading, setLoading] = useState(true);
  const [showAddDeptForm, setShowAddDeptForm] = useState(false);
  const [showAddCourseForm, setShowAddCourseForm] = useState(false);
  const [deptFormData, setDeptFormData] = useState({
    departmentName: "",
    departmentCode: "",
  });
  const [courseFormData, setCourseFormData] = useState({
    courseName: "",
    courseCode: "",
  });

  useEffect(() => {
    fetchInstituteDetails();
  }, []);

  const fetchInstituteDetails = async () => {
    try {
      setLoading(true);
      const response = await getInstituteDetails();
      if (response.data.valid) {
        setInstitute(response.data.institute);
      }
    } catch (error) {
      toast.error("Error Fetching Institute Details!");
      console.error("Error fetching institute details:", error);
    } finally {
      setLoading(false);
    }
  };

  const handleDeptSubmit = async (e) => {
    e.preventDefault();
    try {
      const response = await addDepartment(deptFormData);

      if (response?.data?.valid) {
        toast.success("Department added successfully!");
        setShowAddDeptForm(false);
        setDeptFormData({
          departmentName: "",
          departmentCode: "",
        });
        fetchInstituteDetails(); // Refresh the institute data
      } else {
        toast.error("Something went wrong. Please check details.");
      }
    } catch (error) {
      console.error("Error adding department:", error);
      toast.error("Error adding department!");
    }
  };

  const handleCourseSubmit = async (e) => {
    e.preventDefault();
    try {
      const response = await addCourse(courseFormData);

      if (response?.data?.valid) {
        toast.success("Course added successfully!");
        setShowAddCourseForm(false);
        setCourseFormData({
          courseName: "",
          courseCode: "",
        });
        fetchInstituteDetails(); // Refresh the institute data
      } else {
        toast.error("Something went wrong. Please check details.");
      }
    } catch (error) {
      console.error("Error adding course:", error);
      toast.error("Error adding course!");
    }
  };

  const handleDeptInputChange = (e) => {
    setDeptFormData({
      ...deptFormData,
      [e.target.name]: e.target.value,
    });
  };

  const handleCourseInputChange = (e) => {
    setCourseFormData({
      ...courseFormData,
      [e.target.name]: e.target.value,
    });
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
      <div className="mb-8">
        <h1 className="text-2xl font-bold text-[#1F2937] mb-2">
          Institute Details
        </h1>

        {institute && (
          <div className="bg-white rounded-lg shadow-md p-6">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div className="flex items-center">
                <FiHome className="h-6 w-6 text-[#10B981] mr-3" />
                <div>
                  <p className="text-sm text-[#4B5563]">Name</p>
                  <p className="text-lg font-semibold text-[#1F2937]">
                    {institute.name}
                  </p>
                </div>
              </div>

              <div className="flex items-center">
                <FiHash className="h-6 w-6 text-[#10B981] mr-3" />
                <div>
                  <p className="text-sm text-[#4B5563]">Code</p>
                  <p className="text-lg font-semibold text-[#1F2937]">
                    {institute.code}
                  </p>
                </div>
              </div>

              <div className="flex items-center">
                <FiMail className="h-6 w-6 text-[#10B981] mr-3" />
                <div>
                  <p className="text-sm text-[#4B5563]">Email</p>
                  <p className="text-lg font-semibold text-[#1F2937]">
                    {institute.instituteEmail}
                  </p>
                </div>
              </div>

              <div className="flex items-center">
                <FiCalendar className="h-6 w-6 text-[#10B981] mr-3" />
                <div>
                  <p className="text-sm text-[#4B5563]">Created At</p>
                  <p className="text-lg font-semibold text-[#1F2937]">
                    {new Date(institute.createdAt).toLocaleDateString()}
                  </p>
                </div>
              </div>
            </div>

            <div className="mt-8 grid grid-cols-1 md:grid-cols-2 gap-8">
              {/* Departments Section */}
              <div>
                <div className="flex justify-between items-center mb-4">
                  <h2 className="text-xl font-bold text-[#1F2937]">
                    Departments
                  </h2>
                  <motion.button
                    whileHover={{ scale: 1.05 }}
                    whileTap={{ scale: 0.95 }}
                    onClick={() => setShowAddDeptForm(true)}
                    className="flex items-center gap-2 px-3 py-1 bg-[#10B981] hover:bg-[#059669] text-white rounded-lg font-semibold text-sm"
                  >
                    <FiPlus className="h-3 w-3" />
                    Add
                  </motion.button>
                </div>

                {institute.departments && institute.departments.length > 0 ? (
                  <div className="bg-[#ECFDF5] rounded-lg p-4">
                    {institute.departments.map((dept, index) => (
                      <div key={dept._id || index} className="mb-3 last:mb-0">
                        <div className="flex justify-between items-center bg-white p-3 rounded-lg shadow-sm">
                          <div>
                            <p className="font-medium text-[#1F2937]">
                              {dept.name}
                            </p>
                            <p className="text-sm text-[#4B5563]">
                              Code: {dept.code}
                            </p>
                          </div>
                          <FiBook className="h-5 w-5 text-[#10B981]" />
                        </div>
                      </div>
                    ))}
                  </div>
                ) : (
                  <p className="text-[#4B5563]">No departments added yet.</p>
                )}
              </div>

              {/* Courses Section */}
              <div>
                <div className="flex justify-between items-center mb-4">
                  <h2 className="text-xl font-bold text-[#1F2937]">Courses</h2>
                  <motion.button
                    whileHover={{ scale: 1.05 }}
                    whileTap={{ scale: 0.95 }}
                    onClick={() => setShowAddCourseForm(true)}
                    className="flex items-center gap-2 px-3 py-1 bg-[#10B981] hover:bg-[#059669] text-white rounded-lg font-semibold text-sm"
                  >
                    <FiPlus className="h-3 w-3" />
                    Add
                  </motion.button>
                </div>

                {institute.courses && institute.courses.length > 0 ? (
                  <div className="bg-[#ECFDF5] rounded-lg p-4">
                    {institute.courses.map((course, index) => (
                      <div key={course._id || index} className="mb-3 last:mb-0">
                        <div className="flex justify-between items-center bg-white p-3 rounded-lg shadow-sm">
                          <div>
                            <p className="font-medium text-[#1F2937]">
                              {course.name}
                            </p>
                            <p className="text-sm text-[#4B5563]">
                              Code: {course.code}
                            </p>
                          </div>
                          <FiAward className="h-5 w-5 text-[#10B981]" />
                        </div>
                      </div>
                    ))}
                  </div>
                ) : (
                  <p className="text-[#4B5563]">No courses added yet.</p>
                )}
              </div>
            </div>
          </div>
        )}
      </div>

      {/* Add Department Modal */}
      <AnimatePresence>
        {showAddDeptForm && (
          <>
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 0.5 }}
              exit={{ opacity: 0 }}
              className="fixed inset-0 bg-black z-50"
              onClick={() => setShowAddDeptForm(false)}
            />
            <motion.div
              initial={{ opacity: 0, scale: 0.9 }}
              animate={{ opacity: 1, scale: 1 }}
              exit={{ opacity: 0, scale: 0.9 }}
              className="fixed top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 bg-white p-6 rounded-lg shadow-xl z-50 w-full max-w-md"
            >
              <div className="flex justify-between items-center mb-4">
                <h2 className="text-xl font-bold text-[#1F2937]">
                  Add New Department
                </h2>
                <button
                  onClick={() => setShowAddDeptForm(false)}
                  className="text-gray-500 hover:text-gray-700"
                >
                  <FiX className="h-5 w-5" />
                </button>
              </div>

              <form onSubmit={handleDeptSubmit} className="space-y-4">
                <div className="relative">
                  <FiBook className="absolute left-3 top-3 h-5 w-5 text-[#4B5563]" />
                  <input
                    type="text"
                    name="departmentName"
                    placeholder="Department Name"
                    value={deptFormData.departmentName}
                    onChange={handleDeptInputChange}
                    className="pl-10 w-full px-4 py-2 bg-white border border-gray-300 rounded-lg text-[#1F2937] placeholder-[#9CA3AF] focus:outline-none focus:ring-2 focus:ring-[#10B981] focus:border-transparent"
                    required
                  />
                </div>

                <div className="relative">
                  <FiHash className="absolute left-3 top-3 h-5 w-5 text-[#4B5563]" />
                  <input
                    type="text"
                    name="departmentCode"
                    placeholder="Department Code"
                    value={deptFormData.departmentCode}
                    onChange={handleDeptInputChange}
                    className="pl-10 w-full px-4 py-2 bg-white border border-gray-300 rounded-lg text-[#1F2937] placeholder-[#9CA3AF] focus:outline-none focus:ring-2 focus:ring-[#10B981] focus:border-transparent"
                    required
                  />
                </div>

                <motion.button
                  whileHover={{ scale: 1.02 }}
                  whileTap={{ scale: 0.98 }}
                  type="submit"
                  className="w-full bg-[#10B981] hover:bg-[#059669] text-white py-2 rounded-lg font-semibold shadow-md"
                >
                  Add Department
                </motion.button>
              </form>
            </motion.div>
          </>
        )}
      </AnimatePresence>

      {/* Add Course Modal */}
      <AnimatePresence>
        {showAddCourseForm && (
          <>
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 0.5 }}
              exit={{ opacity: 0 }}
              className="fixed inset-0 bg-black z-50"
              onClick={() => setShowAddCourseForm(false)}
            />
            <motion.div
              initial={{ opacity: 0, scale: 0.9 }}
              animate={{ opacity: 1, scale: 1 }}
              exit={{ opacity: 0, scale: 0.9 }}
              className="fixed top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 bg-white p-6 rounded-lg shadow-xl z-50 w-full max-w-md"
            >
              <div className="flex justify-between items-center mb-4">
                <h2 className="text-xl font-bold text-[#1F2937]">
                  Add New Course
                </h2>
                <button
                  onClick={() => setShowAddCourseForm(false)}
                  className="text-gray-500 hover:text-gray-700"
                >
                  <FiX className="h-5 w-5" />
                </button>
              </div>

              <form onSubmit={handleCourseSubmit} className="space-y-4">
                <div className="relative">
                  <FiAward className="absolute left-3 top-3 h-5 w-5 text-[#4B5563]" />
                  <input
                    type="text"
                    name="courseName"
                    placeholder="Course Name"
                    value={courseFormData.courseName}
                    onChange={handleCourseInputChange}
                    className="pl-10 w-full px-4 py-2 bg-white border border-gray-300 rounded-lg text-[#1F2937] placeholder-[#9CA3AF] focus:outline-none focus:ring-2 focus:ring-[#10B981] focus:border-transparent"
                    required
                  />
                </div>

                <div className="relative">
                  <FiHash className="absolute left-3 top-3 h-5 w-5 text-[#4B5563]" />
                  <input
                    type="text"
                    name="courseCode"
                    placeholder="Course Code"
                    value={courseFormData.courseCode}
                    onChange={handleCourseInputChange}
                    className="pl-10 w-full px-4 py-2 bg-white border border-gray-300 rounded-lg text-[#1F2937] placeholder-[#9CA3AF] focus:outline-none focus:ring-2 focus:ring-[#10B981] focus:border-transparent"
                    required
                  />
                </div>

                <motion.button
                  whileHover={{ scale: 1.02 }}
                  whileTap={{ scale: 0.98 }}
                  type="submit"
                  className="w-full bg-[#10B981] hover:bg-[#059669] text-white py-2 rounded-lg font-semibold shadow-md"
                >
                  Add Course
                </motion.button>
              </form>
            </motion.div>
          </>
        )}
      </AnimatePresence>
    </div>
  );
};

export default Institute;
