// StudentDashboard.jsx
import React, { useState, useEffect } from "react";
import { getStudentDashboard, uploadPortfolio } from "../../Utils/Api";
import { useAuth } from "../../contexts/AuthContext";
import { motion } from "framer-motion";
import {
  FiUser,
  FiMail,
  FiBook,
  FiAward,
  FiCalendar,
  FiActivity,
  FiCheckCircle,
  FiClock,
  FiXCircle,
  FiDownload,
  FiUpload,
  FiFileText,
  FiPieChart,
  FiBarChart2,
  FiHash,
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
import PortfolioPDF from "./PortfolioPDF";

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

const StudentDashboard = () => {
  const { user } = useAuth();
  const [dashboardData, setDashboardData] = useState(null);
  const [loading, setLoading] = useState(true);
  const [generatingPdf, setGeneratingPdf] = useState(false);

  useEffect(() => {
    fetchDashboardData();
  }, []);

  const fetchDashboardData = async () => {
    try {
      setLoading(true);
      const response = await getStudentDashboard();
      if (response.data.valid) {
        setDashboardData(response.data.dashboard);
      }
    } catch (error) {
      toast.error("Error Fetching Dashboard Data!");
      console.error("Error fetching dashboard:", error);
    } finally {
      setLoading(false);
    }
  };

  const generateAndUploadPortfolio = async () => {
    try {
      setGeneratingPdf(true);

      // Generate PDF
      const pdfBlob = await PortfolioPDF.generatePDF(dashboardData);

      // Create FormData for upload
      const formData = new FormData();
      formData.append("title", `${dashboardData.student.name}'s Portfolio`);
      formData.append(
        "description",
        `Automatically generated portfolio for ${dashboardData.student.name}`
      );
      formData.append(
        "file",
        pdfBlob,
        `${dashboardData.student.regNumber}_portfolio.pdf`
      );

      // Upload the generated PDF
      const response = await uploadPortfolio(formData);

      if (response?.data?.valid) {
        toast.success("Portfolio generated and uploaded successfully!");

        // Download the PDF for the user
        const url = window.URL.createObjectURL(pdfBlob);
        const link = document.createElement("a");
        link.href = url;
        link.download = `${dashboardData.student.name}'s_portfolio.pdf`;
        document.body.appendChild(link);
        link.click();
        link.remove();
        window.URL.revokeObjectURL(url);
      } else {
        toast.error("Failed to upload portfolio.");
      }
    } catch (error) {
      console.error("Error generating/uploading portfolio:", error);
      toast.error("Error generating portfolio!");
    } finally {
      setGeneratingPdf(false);
    }
  };

  // Chart data configurations
  const attendanceChartData = {
    labels: dashboardData?.charts.attendanceTrend.map((item) => item.label),
    datasets: [
      {
        label: "Classes",
        data: dashboardData?.charts.attendanceTrend.map((item) => item.value),
        backgroundColor: ["#10B981", "#EF4444"],
        borderColor: ["#10B981", "#EF4444"],
        borderWidth: 1,
      },
    ],
  };

  const activityStatusData = {
    labels: dashboardData?.charts.activityStatus.map((item) => item.label),
    datasets: [
      {
        data: dashboardData?.charts.activityStatus.map((item) => item.value),
        backgroundColor: ["#10B981", "#F59E0B", "#EF4444"],
        borderColor: ["#10B981", "#F59E0B", "#EF4444"],
        borderWidth: 1,
      },
    ],
  };

  const activityTypesData = {
    labels: dashboardData?.charts.activityTypes.map((item) => item.label),
    datasets: [
      {
        data: dashboardData?.charts.activityTypes.map((item) => item.value),
        backgroundColor: ["#3B82F6", "#8B5CF6", "#10B981"],
        borderColor: ["#3B82F6", "#8B5CF6", "#10B981"],
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
          <h1 className="text-2xl font-bold text-[#1F2937]">
            Student Dashboard
          </h1>
          <p className="text-[#4B5563]">
            Welcome back, {dashboardData.student.name}!
          </p>
        </div>
        <motion.button
          whileHover={{ scale: 1.05 }}
          whileTap={{ scale: 0.95 }}
          onClick={generateAndUploadPortfolio}
          disabled={generatingPdf}
          className="flex items-center gap-2 px-4 py-2 bg-[#10B981] hover:bg-[#059669] text-white rounded-lg font-semibold shadow-md disabled:opacity-50"
        >
          {generatingPdf ? (
            <div className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin"></div>
          ) : (
            <FiDownload className="h-4 w-4" />
          )}
          {generatingPdf ? "Generating PDF..." : "Generate Portfolio PDF"}
        </motion.button>
      </div>

      {/* Student Info Cards */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4 mb-6">
        <div className="bg-white rounded-lg shadow-md p-4">
          <div className="flex items-center">
            <div className="w-10 h-10 rounded-full bg-blue-100 flex items-center justify-center text-blue-600 mr-3">
              <FiUser className="h-5 w-5" />
            </div>
            <div>
              <p className="text-sm text-[#4B5563]">Name</p>
              <p className="font-medium text-[#1F2937]">
                {dashboardData.student.name}
              </p>
            </div>
          </div>
        </div>

        <div className="bg-white rounded-lg shadow-md p-4">
          <div className="flex items-center">
            <div className="w-10 h-10 rounded-full bg-green-100 flex items-center justify-center text-green-600 mr-3">
              <FiBook className="h-5 w-5" />
            </div>
            <div>
              <p className="text-sm text-[#4B5563]">Department</p>
              <p className="font-medium text-[#1F2937]">
                {dashboardData.student.department}
              </p>
            </div>
          </div>
        </div>

        <div className="bg-white rounded-lg shadow-md p-4">
          <div className="flex items-center">
            <div className="w-10 h-10 rounded-full bg-purple-100 flex items-center justify-center text-purple-600 mr-3">
              <FiHash className="h-5 w-5" />
            </div>
            <div>
              <p className="text-sm text-[#4B5563]">Registration No.</p>
              <p className="font-medium text-[#1F2937]">
                {dashboardData.student.regNumber}
              </p>
            </div>
          </div>
        </div>

        <div className="bg-white rounded-lg shadow-md p-4">
          <div className="flex items-center">
            <div className="w-10 h-10 rounded-full bg-yellow-100 flex items-center justify-center text-yellow-600 mr-3">
              <FiMail className="h-5 w-5" />
            </div>
            <div>
              <p className="text-sm text-[#4B5563]">Email</p>
              <p className="font-medium text-[#1F2937]">
                {dashboardData.student.email}
              </p>
            </div>
          </div>
        </div>
      </div>

      {/* Academic Stats */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 mb-6">
        {/* Academic Performance */}
        <div className="bg-white rounded-lg shadow-md p-6">
          <div className="flex items-center mb-4">
            <div className="w-10 h-10 rounded-full bg-blue-100 flex items-center justify-center text-blue-600 mr-3">
              <FiAward className="h-5 w-5" />
            </div>
            <div>
              <h2 className="text-xl font-bold text-[#1F2937]">
                Academic Performance
              </h2>
              <p className="text-[#4B5563]">Current academic status</p>
            </div>
          </div>

          <div className="space-y-4">
            <div className="flex justify-between items-center p-3 bg-gray-50 rounded-lg">
              <span className="text-[#4B5563]">CGPA</span>
              <span className="text-2xl font-bold text-[#10B981]">
                {dashboardData.academics.cgpa}
              </span>
            </div>

            <div className="flex justify-between items-center p-3 bg-gray-50 rounded-lg">
              <span className="text-[#4B5563]">Attendance</span>
              <span className="text-2xl font-bold text-[#10B981]">
                {dashboardData.academics.attendance.percentage}%
              </span>
            </div>

            <div className="grid grid-cols-2 gap-2">
              <div className="p-3 bg-gray-50 rounded-lg text-center">
                <p className="text-sm text-[#4B5563]">Classes Held</p>
                <p className="font-bold text-[#1F2937]">
                  {dashboardData.academics.attendance.totalHeld}
                </p>
              </div>
              <div className="p-3 bg-gray-50 rounded-lg text-center">
                <p className="text-sm text-[#4B5563]">Classes Attended</p>
                <p className="font-bold text-[#1F2937]">
                  {dashboardData.academics.attendance.totalAttended}
                </p>
              </div>
            </div>
          </div>
        </div>

        {/* Activity Stats */}
        <div className="bg-white rounded-lg shadow-md p-6">
          <div className="flex items-center mb-4">
            <div className="w-10 h-10 rounded-full bg-green-100 flex items-center justify-center text-green-600 mr-3">
              <FiActivity className="h-5 w-5" />
            </div>
            <div>
              <h2 className="text-xl font-bold text-[#1F2937]">
                Activity Summary
              </h2>
              <p className="text-[#4B5563]">Your activity performance</p>
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

            <div className="grid grid-cols-3 gap-2">
              <div className="p-3 bg-blue-50 rounded-lg text-center">
                <p className="text-sm text-[#4B5563]">Curricular</p>
                <p className="font-bold text-[#1F2937]">
                  {dashboardData.activities.breakdown.curricular}
                </p>
              </div>
              <div className="p-3 bg-purple-50 rounded-lg text-center">
                <p className="text-sm text-[#4B5563]">Co-Curricular</p>
                <p className="font-bold text-[#1F2937]">
                  {dashboardData.activities.breakdown.coCurricular}
                </p>
              </div>
              <div className="p-3 bg-green-50 rounded-lg text-center">
                <p className="text-sm text-[#4B5563]">Extra-Curricular</p>
                <p className="font-bold text-[#1F2937]">
                  {dashboardData.activities.breakdown.extraCurricular}
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

        {/* Quick Actions */}
        <div className="bg-white rounded-lg shadow-md p-6">
          <h2 className="text-xl font-bold text-[#1F2937] mb-4">
            Quick Actions
          </h2>
          <div className="space-y-3">
            <motion.button
              whileHover={{ scale: 1.02 }}
              whileTap={{ scale: 0.98 }}
              className="w-full flex items-center gap-3 px-4 py-3 bg-blue-100 hover:bg-blue-200 text-blue-700 rounded-lg font-medium"
              onClick={() => (window.location.href = "/academics")}
            >
              <FiAward className="h-5 w-5" />
              View Academic Performance
            </motion.button>

            <motion.button
              whileHover={{ scale: 1.02 }}
              whileTap={{ scale: 0.98 }}
              className="w-full flex items-center gap-3 px-4 py-3 bg-green-100 hover:bg-green-200 text-green-700 rounded-lg font-medium"
              onClick={() => (window.location.href = "/apply-approval")}
            >
              <FiActivity className="h-5 w-5" />
              Apply for Activity Approval
            </motion.button>

            <motion.button
              whileHover={{ scale: 1.02 }}
              whileTap={{ scale: 0.98 }}
              className="w-full flex items-center gap-3 px-4 py-3 bg-purple-100 hover:bg-purple-200 text-purple-700 rounded-lg font-medium"
              onClick={generateAndUploadPortfolio}
              disabled={generatingPdf}
            >
              <FiDownload className="h-5 w-5" />
              {generatingPdf ? "Generating..." : "Generate Portfolio"}
            </motion.button>
          </div>
        </div>
      </div>

      {/* Charts Section */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 mb-6">
        {/* Attendance Chart */}
        <div className="bg-white rounded-lg shadow-md p-6">
          <div className="flex items-center mb-4">
            <FiBarChart2 className="h-5 w-5 text-blue-600 mr-2" />
            <h3 className="text-lg font-bold text-[#1F2937]">
              Attendance Distribution
            </h3>
          </div>
          <div className="h-64">
            <Doughnut data={attendanceChartData} options={chartOptions} />
          </div>
        </div>

        {/* Activity Status Chart */}
        <div className="bg-white rounded-lg shadow-md p-6">
          <div className="flex items-center mb-4">
            <FiPieChart className="h-5 w-5 text-green-600 mr-2" />
            <h3 className="text-lg font-bold text-[#1F2937]">
              Activity Status
            </h3>
          </div>
          <div className="h-64">
            <Pie data={activityStatusData} options={chartOptions} />
          </div>
        </div>

        {/* Activity Types Chart */}
        <div className="bg-white rounded-lg shadow-md p-6">
          <div className="flex items-center mb-4">
            <FiPieChart className="h-5 w-5 text-purple-600 mr-2" />
            <h3 className="text-lg font-bold text-[#1F2937]">Activity Types</h3>
          </div>
          <div className="h-64">
            <Pie data={activityTypesData} options={chartOptions} />
          </div>
        </div>
      </div>
    </div>
  );
};

export default StudentDashboard;
