import React, { useState, useEffect } from "react";
import { getAdminDashboard, uploadReport } from "../../Utils/Api";
import { motion } from "framer-motion";
import {
  FiUsers,
  FiUser,
  FiBook,
  FiActivity,
  FiCheckCircle,
  FiClock,
  FiXCircle,
  FiDownload,
  FiPieChart,
  FiBarChart2,
  FiTrendingUp,
  FiX,
} from "react-icons/fi";
import { toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import { Bar, Doughnut, Pie } from "react-chartjs-2";
import {
  Chart as ChartJS,
  CategoryScale,
  LinearScale,
  BarElement,
  ArcElement,
  Title,
  Tooltip,
  Legend,
} from "chart.js";
import ReportPDF from "./ReportPDF";

// Register ChartJS components
ChartJS.register(
  CategoryScale,
  LinearScale,
  BarElement,
  ArcElement,
  Title,
  Tooltip,
  Legend
);

const AdminDashboard = () => {
  const [dashboardData, setDashboardData] = useState(null);
  const [loading, setLoading] = useState(true);
  const [generatingReport, setGeneratingReport] = useState(false);
  const [showReportModal, setShowReportModal] = useState(false);
  const [reportForm, setReportForm] = useState({
    title: "",
    description: "",
    type: "NAAC",
  });

  useEffect(() => {
    fetchDashboardData();
  }, []);

  const fetchDashboardData = async () => {
    try {
      setLoading(true);
      const response = await getAdminDashboard();
      if (response.data.valid) {
        setDashboardData(response.data.data);
      }
    } catch (error) {
      toast.error("Error Fetching Dashboard Data!");
      console.error("Error fetching dashboard:", error);
    } finally {
      setLoading(false);
    }
  };

  const generateAndUploadReport = async () => {
    if (!reportForm.title || !reportForm.description) {
      toast.error("Please fill all required fields!");
      return;
    }

    try {
      setGeneratingReport(true);

      // Generate PDF
      const pdfBlob = await ReportPDF.generatePDF(dashboardData, reportForm);

      // Create FormData for upload
      const formData = new FormData();
      formData.append("title", reportForm.title);
      formData.append("description", reportForm.description);
      formData.append("type", reportForm.type);
      formData.append(
        "file",
        pdfBlob,
        `${reportForm.type}_Report_${new Date().getFullYear()}.pdf`
      );

      // Upload the generated PDF
      const response = await uploadReport(formData);

      if (response?.data?.valid) {
        toast.success("Report generated and uploaded successfully!");
        setShowReportModal(false);
        setReportForm({
          title: "",
          description: "",
          type: "NAAC",
        });

        // Download the PDF for the user
        const url = window.URL.createObjectURL(pdfBlob);
        const link = document.createElement("a");
        link.href = url;
        link.download = `${
          reportForm.type
        }_Report_${new Date().getFullYear()}.pdf`;
        document.body.appendChild(link);
        link.click();
        link.remove();
        window.URL.revokeObjectURL(url);
      } else {
        toast.error("Failed to upload report.");
      }
    } catch (error) {
      console.error("Error generating/uploading report:", error);
      toast.error("Error generating report!");
    } finally {
      setGeneratingReport(false);
    }
  };

  const handleInputChange = (e) => {
    setReportForm({
      ...reportForm,
      [e.target.name]: e.target.value,
    });
  };

  // Chart data configurations
  const activityStatusData = {
    labels: ["Approved", "Pending", "Rejected"],
    datasets: [
      {
        data: dashboardData
          ? [
              dashboardData.activities.approved,
              dashboardData.activities.pending,
              dashboardData.activities.rejected,
            ]
          : [],
        backgroundColor: ["#10B981", "#F59E0B", "#EF4444"],
        borderColor: ["#10B981", "#F59E0B", "#EF4444"],
        borderWidth: 1,
      },
    ],
  };

  const userDistributionData = {
    labels: ["Students", "Faculties"],
    datasets: [
      {
        data: dashboardData
          ? [dashboardData.students, dashboardData.faculties]
          : [],
        backgroundColor: ["#3B82F6", "#8B5CF6"],
        borderColor: ["#3B82F6", "#8B5CF6"],
        borderWidth: 1,
      },
    ],
  };

  const academicPerformanceData = {
    labels: ["Average Attendance", "Average CGPA"],
    datasets: [
      {
        label: "Performance Metrics",
        data: dashboardData
          ? [
              parseFloat(dashboardData.academics.avgAttendance),
              parseFloat(dashboardData.academics.avgCGPA) * 10, // Scale CGPA for better visualization
            ]
          : [],
        backgroundColor: ["#10B981", "#3B82F6"],
        borderColor: ["#10B981", "#3B82F6"],
        borderWidth: 1,
      },
    ],
  };

  const chartOptions = {
    responsive: true,
    maintainAspectRatio: false,
    plugins: {
      legend: {
        position: "bottom",
      },
    },
  };

  if (loading) {
    return (
      <div className="flex items-center justify-center h-64">
        <div className="w-8 h-8 border-4 border-[#10B981] border-t-transparent rounded-full animate-spin"></div>
      </div>
    );
  }

  if (!dashboardData) {
    return (
      <div className="p-6 text-center">
        <p className="text-[#4B5563]">Unable to load dashboard data.</p>
      </div>
    );
  }

  return (
    <div className="p-6">
      {/* Header */}
      <div className="flex flex-col md:flex-row justify-between items-start md:items-center mb-6 gap-4">
        <div>
          <h1 className="text-2xl font-bold text-[#1F2937]">Admin Dashboard</h1>
          <p className="text-[#4B5563]">Institutional overview and analytics</p>
        </div>
        <motion.button
          whileHover={{ scale: 1.05 }}
          whileTap={{ scale: 0.95 }}
          onClick={() => setShowReportModal(true)}
          className="flex items-center gap-2 px-4 py-2 bg-[#10B981] hover:bg-[#059669] text-white rounded-lg font-semibold shadow-md"
        >
          <FiDownload className="h-4 w-4" />
          Generate Report
        </motion.button>
      </div>

      {/* Stats Cards */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4 mb-6">
        <div className="bg-white rounded-lg shadow-md p-4">
          <div className="flex items-center">
            <div className="w-10 h-10 rounded-full bg-blue-100 flex items-center justify-center text-blue-600 mr-3">
              <FiUsers className="h-5 w-5" />
            </div>
            <div>
              <p className="text-sm text-[#4B5563]">Total Students</p>
              <p className="font-medium text-[#1F2937] text-2xl">
                {dashboardData.students}
              </p>
            </div>
          </div>
        </div>

        <div className="bg-white rounded-lg shadow-md p-4">
          <div className="flex items-center">
            <div className="w-10 h-10 rounded-full bg-purple-100 flex items-center justify-center text-purple-600 mr-3">
              <FiUser className="h-5 w-5" />
            </div>
            <div>
              <p className="text-sm text-[#4B5563]">Total Faculties</p>
              <p className="font-medium text-[#1F2937] text-2xl">
                {dashboardData.faculties}
              </p>
            </div>
          </div>
        </div>

        <div className="bg-white rounded-lg shadow-md p-4">
          <div className="flex items-center">
            <div className="w-10 h-10 rounded-full bg-green-100 flex items-center justify-center text-green-600 mr-3">
              <FiTrendingUp className="h-5 w-5" />
            </div>
            <div>
              <p className="text-sm text-[#4B5563]">Avg Attendance</p>
              <p className="font-medium text-[#1F2937] text-2xl">
                {dashboardData.academics.avgAttendance}%
              </p>
            </div>
          </div>
        </div>

        <div className="bg-white rounded-lg shadow-md p-4">
          <div className="flex items-center">
            <div className="w-10 h-10 rounded-full bg-indigo-100 flex items-center justify-center text-indigo-600 mr-3">
              <FiBook className="h-5 w-5" />
            </div>
            <div>
              <p className="text-sm text-[#4B5563]">Avg CGPA</p>
              <p className="font-medium text-[#1F2937] text-2xl">
                {dashboardData.academics.avgCGPA}
              </p>
            </div>
          </div>
        </div>
      </div>

      {/* Activity Stats */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 mb-6">
        {/* Activity Summary */}
        <div className="bg-white rounded-lg shadow-md p-6">
          <div className="flex items-center mb-4">
            <div className="w-10 h-10 rounded-full bg-green-100 flex items-center justify-center text-green-600 mr-3">
              <FiActivity className="h-5 w-5" />
            </div>
            <div>
              <h2 className="text-xl font-bold text-[#1F2937]">
                Activity Summary
              </h2>
              <p className="text-[#4B5563]">Overall activity performance</p>
            </div>
          </div>

          <div className="space-y-4">
            <div className="grid grid-cols-3 gap-2">
              <div className="p-3 bg-green-50 rounded-lg text-center">
                <FiCheckCircle className="h-6 w-6 text-green-600 mx-auto mb-1" />
                <p className="text-sm text-[#4B5563]">Approved</p>
                <p className="font-bold text-[#1F2937]">
                  {dashboardData.activities.approved}
                </p>
              </div>
              <div className="p-3 bg-yellow-50 rounded-lg text-center">
                <FiClock className="h-6 w-6 text-yellow-600 mx-auto mb-1" />
                <p className="text-sm text-[#4B5563]">Pending</p>
                <p className="font-bold text-[#1F2937]">
                  {dashboardData.activities.pending}
                </p>
              </div>
              <div className="p-3 bg-red-50 rounded-lg text-center">
                <FiXCircle className="h-6 w-6 text-red-600 mx-auto mb-1" />
                <p className="text-sm text-[#4B5563]">Rejected</p>
                <p className="font-bold text-[#1F2937]">
                  {dashboardData.activities.rejected}
                </p>
              </div>
            </div>

            <div className="p-3 bg-gray-50 rounded-lg text-center">
              <p className="text-sm text-[#4B5563]">Total Activities</p>
              <p className="text-2xl font-bold text-[#10B981]">
                {dashboardData.activities.total}
              </p>
            </div>
          </div>
        </div>

        {/* Charts Section */}
        <div className="bg-white rounded-lg shadow-md p-6">
          <div className="flex items-center mb-4">
            <FiPieChart className="h-5 w-5 text-blue-600 mr-2" />
            <h3 className="text-lg font-bold text-[#1F2937]">
              Activity Status
            </h3>
          </div>
          <div className="h-64">
            <Pie data={activityStatusData} options={chartOptions} />
          </div>
        </div>

        <div className="bg-white rounded-lg shadow-md p-6">
          <div className="flex items-center mb-4">
            <FiBarChart2 className="h-5 w-5 text-purple-600 mr-2" />
            <h3 className="text-lg font-bold text-[#1F2937]">
              User Distribution
            </h3>
          </div>
          <div className="h-64">
            <Doughnut data={userDistributionData} options={chartOptions} />
          </div>
        </div>
      </div>

      {/* Academic Performance Chart */}
      <div className="bg-white rounded-lg shadow-md p-6 mb-6">
        <div className="flex items-center mb-4">
          <FiTrendingUp className="h-5 w-5 text-green-600 mr-2" />
          <h3 className="text-lg font-bold text-[#1F2937]">
            Academic Performance
          </h3>
        </div>
        <div className="h-64">
          <Bar
            data={academicPerformanceData}
            options={{
              ...chartOptions,
              scales: {
                y: {
                  beginAtZero: true,
                  max: 100,
                  ticks: {
                    callback: function (value) {
                      return value + "%";
                    },
                  },
                },
              },
            }}
          />
        </div>
      </div>

      {/* Report Generation Modal */}
      {showReportModal && (
        <>
          {/* The overlay with motion animation */}
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 0.5 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 bg-black z-50"
            onClick={() => setShowReportModal(false)}
          />
          {/* The modal content with motion animation */}
          <motion.div
            initial={{ opacity: 0, scale: 0.9 }}
            animate={{ opacity: 1, scale: 1 }}
            exit={{ opacity: 0, scale: 0.9 }}
            className="fixed top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 bg-white p-6 rounded-lg shadow-xl z-50 w-full max-w-md"
          >
            <div className="flex justify-between items-center mb-4">
              <h2 className="text-xl font-bold text-[#1F2937]">
                Generate Report
              </h2>
              <button
                onClick={() => setShowReportModal(false)}
                className="text-gray-500 hover:text-gray-700"
              >
                <FiX className="h-5 w-5" />
              </button>
            </div>

            <div className="space-y-4">
              <div>
                <label className="block text-sm font-medium text-[#4B5563] mb-1">
                  Report Type
                </label>
                <select
                  name="type"
                  value={reportForm.type}
                  onChange={handleInputChange}
                  className="w-full px-4 py-2 bg-white border border-gray-300 rounded-lg text-gray-800 focus:outline-none focus:ring-2 focus:ring-green-500 focus:border-transparent"
                >
                  <option value="NAAC">NAAC</option>
                  <option value="AICTE">AICTE</option>
                  <option value="NIRF">NIRF</option>
                </select>
              </div>

              <div>
                <label className="block text-sm font-medium text-[#4B5563] mb-1">
                  Title
                </label>
                <input
                  type="text"
                  name="title"
                  value={reportForm.title}
                  onChange={handleInputChange}
                  placeholder="e.g., NAAC Report 2025"
                  className="w-full px-4 py-2 bg-white border border-gray-300 rounded-lg text-gray-800 focus:outline-none focus:ring-2 focus:ring-green-500 focus:border-transparent"
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-[#4B5563] mb-1">
                  Description
                </label>
                <textarea
                  name="description"
                  value={reportForm.description}
                  onChange={handleInputChange}
                  placeholder="e.g., Annual NAAC submission"
                  rows="3"
                  className="w-full px-4 py-2 bg-white border border-gray-300 rounded-lg text-gray-800 focus:outline-none focus:ring-2 focus:ring-green-500 focus:border-transparent"
                />
              </div>
            </div>

            <div className="flex justify-end gap-3 mt-6">
              <button
                onClick={() => setShowReportModal(false)}
                className="px-4 py-2 text-gray-600 hover:text-gray-800 font-medium"
              >
                Cancel
              </button>
              <button
                onClick={generateAndUploadReport}
                disabled={generatingReport}
                className="flex items-center gap-2 px-4 py-2 bg-[#10B981] hover:bg-[#059669] text-white rounded-lg font-medium disabled:opacity-50"
              >
                {generatingReport ? (
                  <div className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin"></div>
                ) : (
                  <FiDownload className="h-4 w-4" />
                )}
                {generatingReport ? "Generating..." : "Generate & Upload"}
              </button>
            </div>
          </motion.div>
        </>
      )}
    </div>
  );
};

export default AdminDashboard;
