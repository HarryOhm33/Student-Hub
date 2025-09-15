// StudentList.jsx
import React, { useState, useEffect } from "react";
import { getStudentListFaculty } from "../../Utils/Api";
import { motion } from "framer-motion";
import {
  FiUser,
  FiMail,
  FiBook,
  FiHash,
  FiCalendar,
  FiArrowRight,
} from "react-icons/fi";
import { useNavigate } from "react-router-dom";
import { toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";

const StudentList = () => {
  const [students, setStudents] = useState([]);
  const [loading, setLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState("");
  const navigate = useNavigate();

  useEffect(() => {
    fetchStudents();
  }, []);

  const fetchStudents = async () => {
    try {
      setLoading(true);
      const response = await getStudentListFaculty();
      if (response.data.valid) {
        setStudents(response.data.students);
      }
    } catch (error) {
      toast.error("Error Fetching Students!");
      console.error("Error fetching students:", error);
    } finally {
      setLoading(false);
    }
  };

  const handleStudentClick = (studentId) => {
    navigate(`/faculty/students/${studentId}`);
  };

  const filteredStudents = students.filter(
    (student) =>
      student.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
      student.regNumber.toLowerCase().includes(searchTerm.toLowerCase()) ||
      student.email.toLowerCase().includes(searchTerm.toLowerCase())
  );

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
          <h1 className="text-2xl font-bold text-[#1F2937]">Student List</h1>
          <p className="text-[#4B5563]">Total: {students.length} students</p>
        </div>

        <div className="relative w-full md:w-64">
          <input
            type="text"
            placeholder="Search students..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="w-full px-4 py-2 pl-10 bg-white border border-gray-300 rounded-lg text-[#1F2937] placeholder-[#9CA3AF] focus:outline-none focus:ring-2 focus:ring-[#10B981] focus:border-transparent"
          />
          <FiUser className="absolute left-3 top-2.5 h-5 w-5 text-[#4B5563]" />
        </div>
      </div>

      {/* Desktop Table View */}
      <div className="bg-white rounded-lg shadow-md overflow-hidden hidden md:block">
        {filteredStudents.length === 0 ? (
          <div className="p-8 text-center">
            <p className="text-[#4B5563]">
              {searchTerm
                ? "No students match your search."
                : "No students found."}
            </p>
          </div>
        ) : (
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
                    Registration Number
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-[#1F2937] uppercase tracking-wider">
                    Department
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-[#1F2937] uppercase tracking-wider">
                    Course
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-[#1F2937] uppercase tracking-wider">
                    Year
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-[#1F2937] uppercase tracking-wider">
                    Actions
                  </th>
                </tr>
              </thead>
              <tbody className="bg-white divide-y divide-gray-200">
                {filteredStudents.map((student) => (
                  <tr key={student._id} className="hover:bg-gray-50">
                    <td className="px-6 py-4 whitespace-nowrap">
                      <div className="flex items-center">
                        <div className="w-8 h-8 rounded-full bg-[#10B981] flex items-center justify-center text-white mr-3">
                          <FiUser className="h-4 w-4" />
                        </div>
                        <div className="text-sm font-medium text-[#1F2937]">
                          {student.name}
                        </div>
                      </div>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-[#4B5563]">
                      {student.email}
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-[#4B5563]">
                      {student.regNumber}
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-[#4B5563]">
                      {student.department}
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-[#4B5563]">
                      {student.course}
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-[#4B5563]">
                      {student.year}
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm font-medium">
                      <motion.button
                        whileHover={{ scale: 1.05 }}
                        whileTap={{ scale: 0.95 }}
                        onClick={() => handleStudentClick(student._id)}
                        className="flex items-center gap-1 px-3 py-1 bg-[#10B981] hover:bg-[#059669] text-white rounded-lg text-xs"
                      >
                        View
                        <FiArrowRight className="h-3 w-3" />
                      </motion.button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
      </div>

      {/* Mobile Cards View */}
      <div className="mt-6 md:hidden">
        {filteredStudents.length === 0 ? (
          <div className="p-4 text-center bg-white rounded-lg shadow-md">
            <p className="text-[#4B5563]">
              {searchTerm
                ? "No students match your search."
                : "No students found."}
            </p>
          </div>
        ) : (
          <div className="space-y-4">
            {filteredStudents.map((student) => (
              <motion.div
                key={student._id}
                whileHover={{ scale: 1.02 }}
                className="bg-white rounded-lg shadow-md p-4"
              >
                <div className="flex items-start justify-between mb-3">
                  <div className="flex items-center">
                    <div className="w-10 h-10 rounded-full bg-[#10B981] flex items-center justify-center text-white mr-3">
                      <FiUser className="h-5 w-5" />
                    </div>
                    <div>
                      <h3 className="font-medium text-[#1F2937]">
                        {student.name}
                      </h3>
                      <p className="text-sm text-[#4B5563]">{student.email}</p>
                    </div>
                  </div>
                  <motion.button
                    whileHover={{ scale: 1.1 }}
                    whileTap={{ scale: 0.9 }}
                    onClick={() => handleStudentClick(student._id)}
                    className="p-1 text-[#10B981] hover:text-[#059669]"
                  >
                    <FiArrowRight className="h-5 w-5" />
                  </motion.button>
                </div>

                <div className="grid grid-cols-2 gap-2 text-sm">
                  <div className="flex items-center">
                    <FiHash className="h-4 w-4 text-[#4B5563] mr-2" />
                    <span className="text-[#4B5563]">{student.regNumber}</span>
                  </div>
                  <div className="flex items-center">
                    <FiBook className="h-4 w-4 text-[#4B5563] mr-2" />
                    <span className="text-[#4B5563]">{student.department}</span>
                  </div>
                  <div className="flex items-center">
                    <FiBook className="h-4 w-4 text-[#4B5563] mr-2" />
                    <span className="text-[#4B5563]">{student.course}</span>
                  </div>
                  <div className="flex items-center">
                    <FiCalendar className="h-4 w-4 text-[#4B5563] mr-2" />
                    <span className="text-[#4B5563]">{student.year}</span>
                  </div>
                </div>
              </motion.div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
};

export default StudentList;
