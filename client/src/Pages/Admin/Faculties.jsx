// Faculties.jsx
import React, { useState, useEffect } from "react";
import { getFacultyList, addFaculty } from "../../Utils/Api";
import { useAuth } from "../../contexts/AuthContext";
import { motion, AnimatePresence } from "framer-motion";
import {
  FiPlus,
  FiX,
  FiUser,
  FiMail,
  FiBook,
  FiHash,
  FiAward,
} from "react-icons/fi";
import { toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";

const Faculties = () => {
  const { user } = useAuth();
  const [faculties, setFaculties] = useState([]);
  const [loading, setLoading] = useState(true);
  const [showAddForm, setShowAddForm] = useState(false);
  const [formData, setFormData] = useState({
    name: "",
    email: "",
    password: "",
    departmentName: "",
    designation: "",
    employeeId: "",
  });
  const [submitting, setSubmitting] = useState(false);

  useEffect(() => {
    fetchFaculties();
  }, []);

  const fetchFaculties = async () => {
    try {
      setLoading(true);
      const response = await getFacultyList();
      if (response.data.valid) {
        setFaculties(response.data.faculties);
      }
    } catch (error) {
      toast.error("Error Fetching Faculties!");
      console.error("Error fetching faculties:", error);
    } finally {
      setLoading(false);
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setSubmitting(true); // 🔹 start loading
    try {
      const response = await addFaculty(formData);

      if (response?.data?.valid) {
        toast.success("Faculty added successfully!");
        setShowAddForm(false);
        setFormData({
          name: "",
          email: "",
          password: "",
          departmentName: "",
          designation: "",
          // employeeId: "",
        });
        fetchFaculties(); // Refresh the list
      } else {
        toast.error("Something went wrong. Please check details.");
      }
    } catch (error) {
      console.error("Error adding faculty:", error);
      toast.error("Error adding faculty!");
    } finally {
      setSubmitting(false); // 🔹 stop loading
    }
  };

  const handleInputChange = (e) => {
    setFormData({
      ...formData,
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
      <div className="flex justify-between items-center mb-6">
        <div>
          <h1 className="text-2xl font-bold text-[#1F2937]">Faculties</h1>
          <p className="text-[#4B5563]">Total: {faculties.length} faculties</p>
        </div>
        <motion.button
          whileHover={{ scale: 1.05 }}
          whileTap={{ scale: 0.95 }}
          onClick={() => setShowAddForm(true)}
          className="flex items-center gap-2 px-4 py-2 bg-[#10B981] hover:bg-[#059669] text-white rounded-lg font-semibold shadow-md"
        >
          <FiPlus className="h-4 w-4" />
          Add Faculty
        </motion.button>
      </div>

      <div className="bg-white rounded-lg shadow-md overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full">
            <thead className="bg-[#ECFDF5]">
              <tr>
                <th className="px-6 py-3 text-left text-xs font-medium text-[#1F2937] uppercase tracking-wider">
                  Name
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-[#1F2937] uppercase tracking-wider">
                  Email
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-[#1F2937] uppercase tracking-wider">
                  Employee ID
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-[#1F2937] uppercase tracking-wider">
                  Department
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-[#1F2937] uppercase tracking-wider">
                  Designation
                </th>
              </tr>
            </thead>
            <tbody className="bg-white divide-y divide-gray-200">
              {faculties.map((faculty) => (
                <tr key={faculty._id} className="hover:bg-gray-50">
                  <td className="px-6 py-4 whitespace-nowrap">
                    <div className="flex items-center">
                      <div className="w-8 h-8 rounded-full bg-[#10B981] flex items-center justify-center text-white mr-3">
                        <FiUser className="h-4 w-4" />
                      </div>
                      <div className="text-sm font-medium text-[#1F2937]">
                        {faculty.name}
                      </div>
                    </div>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm text-[#4B5563]">
                    {faculty.email}
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm text-[#4B5563]">
                    {faculty.employeeId}
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm text-[#4B5563]">
                    {faculty.department}
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm text-[#4B5563]">
                    {faculty.designation}
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>

      <AnimatePresence>
        {showAddForm && (
          <>
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 0.5 }}
              exit={{ opacity: 0 }}
              className="fixed inset-0 bg-black z-50"
              onClick={() => setShowAddForm(false)}
            />
            <motion.div
              initial={{ opacity: 0, scale: 0.9 }}
              animate={{ opacity: 1, scale: 1 }}
              exit={{ opacity: 0, scale: 0.9 }}
              className="fixed top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 bg-white p-6 rounded-lg shadow-xl z-50 w-full max-w-md"
            >
              <div className="flex justify-between items-center mb-4">
                <h2 className="text-xl font-bold text-[#1F2937]">
                  Add New Faculty
                </h2>
                <button
                  onClick={() => setShowAddForm(false)}
                  className="text-gray-500 hover:text-gray-700"
                >
                  <FiX className="h-5 w-5" />
                </button>
              </div>

              <form onSubmit={handleSubmit} className="space-y-4">
                <div className="relative">
                  <FiUser className="absolute left-3 top-3 h-5 w-5 text-[#4B5563]" />
                  <input
                    type="text"
                    name="name"
                    placeholder="Full Name"
                    value={formData.name}
                    onChange={handleInputChange}
                    className="pl-10 w-full px-4 py-2 bg-white border border-gray-300 rounded-lg text-[#1F2937] placeholder-[#9CA3AF] focus:outline-none focus:ring-2 focus:ring-[#10B981] focus:border-transparent"
                    required
                  />
                </div>

                <div className="relative">
                  <FiMail className="absolute left-3 top-3 h-5 w-5 text-[#4B5563]" />
                  <input
                    type="email"
                    name="email"
                    placeholder="Email Address"
                    value={formData.email}
                    onChange={handleInputChange}
                    className="pl-10 w-full px-4 py-2 bg-white border border-gray-300 rounded-lg text-[#1F2937] placeholder-[#9CA3AF] focus:outline-none focus:ring-2 focus:ring-[#10B981] focus:border-transparent"
                    required
                  />
                </div>

                {/* <div className="relative">
                  <FiHash className="absolute left-3 top-3 h-5 w-5 text-[#4B5563]" />
                  <input
                    type="text"
                    name="employeeId"
                    placeholder="Employee ID"
                    value={formData.employeeId}
                    onChange={handleInputChange}
                    className="pl-10 w-full px-4 py-2 bg-white border border-gray-300 rounded-lg text-[#1F2937] placeholder-[#9CA3AF] focus:outline-none focus:ring-2 focus:ring-[#10B981] focus:border-transparent"
                    required
                  />
                </div> */}

                <div className="relative">
                  <FiBook className="absolute left-3 top-3 h-5 w-5 text-[#4B5563]" />
                  <select
                    name="departmentName"
                    value={formData.departmentName}
                    onChange={handleInputChange}
                    className="pl-10 w-full px-4 py-2 bg-white border border-gray-300 rounded-lg text-[#1F2937] placeholder-[#9CA3AF] focus:outline-none focus:ring-2 focus:ring-[#10B981] focus:border-transparent"
                    required
                  >
                    <option value="">Select Department</option>
                    {user?.institute?.departments?.map((dept) => (
                      <option key={dept._id} value={dept.name}>
                        {dept.name}
                      </option>
                    ))}
                  </select>
                </div>

                <div className="relative">
                  <FiAward className="absolute left-3 top-3 h-5 w-5 text-[#4B5563]" />
                  <input
                    type="text"
                    name="designation"
                    placeholder="Designation (e.g., Asst. Prof.)"
                    value={formData.designation}
                    onChange={handleInputChange}
                    className="pl-10 w-full px-4 py-2 bg-white border border-gray-300 rounded-lg text-[#1F2937] placeholder-[#9CA3AF] focus:outline-none focus:ring-2 focus:ring-[#10B981] focus:border-transparent"
                    required
                  />
                </div>

                <div className="relative">
                  <input
                    type="password"
                    name="password"
                    placeholder="Password"
                    value={formData.password}
                    onChange={handleInputChange}
                    className="w-full px-4 py-2 bg-white border border-gray-300 rounded-lg text-[#1F2937] placeholder-[#9CA3AF] focus:outline-none focus:ring-2 focus:ring-[#10B981] focus:border-transparent"
                    required
                  />
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
                    "Add Faculty"
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

export default Faculties;
