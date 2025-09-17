import React, { useState, useEffect } from "react";
import { getFacultyDashboard } from "../../Utils/Api";
import { motion } from "framer-motion";
import {
  FiUsers,
  FiBook,
  FiActivity,
  FiCheckCircle,
  FiClock,
  FiXCircle,
  FiPieChart,
  FiBarChart2,
  FiTrendingUp,
  FiAward,
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

const FacultyDashboard = () => {
  const [dashboardData, setDashboardData] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchDashboardData();
  }, []);

  const fetchDashboardData = async () => {
    try {
      setLoading(true);
      const response = await getFacultyDashboard();
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
        backgroundColor: ["#3B82F6", "#8B5CF6"],
        borderColor: ["#3B82F6", "#8B5CF6"],
        borderWidth: 1,
      },
    ],
  };

  const studentStatsData = {
    labels: ["Total Students"],
    datasets: [
      {
        label: "Student Count",
        data: dashboardData ? [dashboardData.students] : [],
        backgroundColor: ["#10B981"],
        borderColor: ["#10B981"],
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
            Faculty Dashboard
          </h1>
          <p className="text-[#4B5563]">
            Overview of your students and activities
          </p>
        </div>
      </div>

      {/* Stats Cards */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4 mb-6">
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
              <FiAward className="h-5 w-5" />
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
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 mb-6">
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
              <p className="text-[#4B5563]">Student activity performance</p>
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

        {/* Activity Status Chart */}
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
      </div>

      {/* Charts Section */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 mb-6">
        {/* Academic Performance Chart */}
        <div className="bg-white rounded-lg shadow-md p-6">
          <div className="flex items-center mb-4">
            <FiBarChart2 className="h-5 w-5 text-green-600 mr-2" />
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

        {/* Student Stats Chart */}
        <div className="bg-white rounded-lg shadow-md p-6">
          <div className="flex items-center mb-4">
            <FiUsers className="h-5 w-5 text-purple-600 mr-2" />
            <h3 className="text-lg font-bold text-[#1F2937]">
              Student Statistics
            </h3>
          </div>
          <div className="h-64">
            <Bar
              data={studentStatsData}
              options={{
                ...chartOptions,
                scales: {
                  y: {
                    beginAtZero: true,
                  },
                },
              }}
            />
          </div>
        </div>
      </div>

      {/* Quick Stats Summary */}
      <div className="bg-white rounded-lg shadow-md p-6">
        <h2 className="text-xl font-bold text-[#1F2937] mb-4">
          Performance Overview
        </h2>
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
          <div className="text-center p-4 bg-blue-50 rounded-lg">
            <div className="text-2xl font-bold text-blue-600 mb-1">
              {dashboardData.students}
            </div>
            <div className="text-sm text-blue-800">Students</div>
          </div>
          <div className="text-center p-4 bg-green-50 rounded-lg">
            <div className="text-2xl font-bold text-green-600 mb-1">
              {dashboardData.academics.avgAttendance}%
            </div>
            <div className="text-sm text-green-800">Avg Attendance</div>
          </div>
          <div className="text-center p-4 bg-purple-50 rounded-lg">
            <div className="text-2xl font-bold text-purple-600 mb-1">
              {dashboardData.academics.avgCGPA}
            </div>
            <div className="text-sm text-purple-800">Avg CGPA</div>
          </div>
          <div className="text-center p-4 bg-orange-50 rounded-lg">
            <div className="text-2xl font-bold text-orange-600 mb-1">
              {dashboardData.activities.total}
            </div>
            <div className="text-sm text-orange-800">Total Activities</div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default FacultyDashboard;
