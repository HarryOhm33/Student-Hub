import React, { useState, useEffect } from "react";
import { getMyReports } from "../../Utils/Api";
import { motion } from "framer-motion";
import {
  FiDownload,
  FiFileText,
  FiCalendar,
  FiUser,
  FiClock,
  FiAward,
  FiBook,
  FiHash,
  FiFilter,
} from "react-icons/fi";
import { toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";

const Reports = () => {
  const [reports, setReports] = useState([]);
  const [filteredReports, setFilteredReports] = useState([]);
  const [loading, setLoading] = useState(true);
  const [activeTab, setActiveTab] = useState("all");

  useEffect(() => {
    fetchReports();
  }, []);

  useEffect(() => {
    filterReports();
  }, [reports, activeTab]);

  const fetchReports = async () => {
    try {
      setLoading(true);
      const response = await getMyReports();
      if (response.data.valid) {
        setReports(response.data.reports);
      }
    } catch (error) {
      toast.error("Error fetching reports!");
      console.error("Error fetching reports:", error);
    } finally {
      setLoading(false);
    }
  };

  const filterReports = () => {
    if (activeTab === "all") {
      setFilteredReports(reports);
    } else {
      setFilteredReports(reports.filter((report) => report.type === activeTab));
    }
  };

  const formatDate = (dateString) => {
    const date = new Date(dateString);
    return date.toLocaleDateString("en-US", {
      year: "numeric",
      month: "short",
      day: "numeric",
      hour: "2-digit",
      minute: "2-digit",
    });
  };

  const getReportIcon = (type) => {
    switch (type) {
      case "NAAC":
        return <FiAward className="h-4 w-4" />;
      case "AICTE":
        return <FiBook className="h-4 w-4" />;
      case "NIRF":
        return <FiHash className="h-4 w-4" />;
      default:
        return <FiFileText className="h-4 w-4" />;
    }
  };

  const getReportColor = (type) => {
    switch (type) {
      case "NAAC":
        return "bg-blue-100 text-blue-600";
      case "AICTE":
        return "bg-green-100 text-green-600";
      case "NIRF":
        return "bg-purple-100 text-purple-600";
      default:
        return "bg-gray-100 text-gray-600";
    }
  };

  const handleDownload = async (report) => {
    try {
      // Fetch the file from the URL
      const response = await fetch(report.fileUrl);
      const blob = await response.blob();

      // Create a blob URL
      const blobUrl = URL.createObjectURL(blob);

      // Create a temporary anchor element
      const link = document.createElement("a");
      link.href = blobUrl;

      // Create filename with report type and year
      const reportYear = new Date(report.createdAt).getFullYear();
      let fileName = `${report.type}_Report_${reportYear}.pdf`;

      link.download = fileName;

      // Append to body, click, and remove
      document.body.appendChild(link);
      link.click();
      document.body.removeChild(link);

      // Clean up the blob URL
      setTimeout(() => URL.revokeObjectURL(blobUrl), 100);

      toast.success("Download started!");
    } catch (error) {
      console.error("Error downloading file:", error);
      toast.error("Failed to download file!");
    }
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
      {/* Header */}
      <div className="flex flex-col md:flex-row justify-between items-start md:items-center mb-6 gap-4">
        <div>
          <h1 className="text-2xl font-bold text-[#1F2937]">
            Institute Reports
          </h1>
          <p className="text-[#4B5563]">
            View and manage all generated institutional reports
          </p>
        </div>
        <div className="text-sm text-[#6B7280] flex items-center gap-2">
          <FiFilter className="h-4 w-4" />
          <span>
            {filteredReports.length}{" "}
            {filteredReports.length === 1 ? "report" : "reports"} found
          </span>
        </div>
      </div>

      {/* Report Type Tabs */}
      <div className="flex bg-gray-100 rounded-lg p-1 mb-6 overflow-x-auto">
        {["all", "NAAC", "AICTE", "NIRF"].map((type) => (
          <motion.button
            key={type}
            whileHover={{ scale: 1.02 }}
            whileTap={{ scale: 0.98 }}
            className={`flex items-center gap-2 py-2 px-4 rounded-md text-sm font-medium transition-all duration-200 whitespace-nowrap ${
              activeTab === type
                ? "bg-white text-green-600 shadow-sm"
                : "text-gray-600 hover:text-green-700"
            }`}
            onClick={() => setActiveTab(type)}
          >
            {type === "all" ? (
              <>
                <FiFileText className="h-4 w-4" />
                All Reports
              </>
            ) : (
              <>
                {getReportIcon(type)}
                {type} Reports
              </>
            )}
          </motion.button>
        ))}
      </div>

      {/* Reports List */}
      {filteredReports.length === 0 ? (
        <div className="bg-white rounded-lg shadow-md p-8 text-center">
          <FiFileText className="h-12 w-12 text-gray-400 mx-auto mb-4" />
          <h3 className="text-lg font-medium text-gray-900 mb-2">
            {activeTab === "all"
              ? "No reports yet"
              : `No ${activeTab} reports found`}
          </h3>
          <p className="text-gray-500">
            {activeTab === "all"
              ? "Your generated reports will appear here once you create them from the dashboard."
              : `No ${activeTab} reports have been generated yet.`}
          </p>
        </div>
      ) : (
        <div className="grid grid-cols-1 gap-4">
          {filteredReports.map((report) => (
            <motion.div
              key={report._id}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.3 }}
              className="bg-white rounded-lg shadow-md p-6 hover:shadow-lg transition-shadow"
            >
              <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
                {/* Report Info */}
                <div className="flex-1">
                  <div className="flex items-start gap-3">
                    <div
                      className={`w-10 h-10 rounded-full flex items-center justify-center flex-shrink-0 ${getReportColor(
                        report.type
                      )}`}
                    >
                      {getReportIcon(report.type)}
                    </div>
                    <div className="flex-1">
                      <div className="flex flex-wrap items-center gap-2 mb-2">
                        <h3 className="text-lg font-semibold text-[#1F2937]">
                          {report.title}
                        </h3>
                        <span
                          className={`px-2 py-1 rounded-full text-xs font-medium ${getReportColor(
                            report.type
                          )}`}
                        >
                          {report.type}
                        </span>
                      </div>
                      <p className="text-[#4B5563] mb-3 text-sm">
                        {report.description}
                      </p>
                      <div className="flex flex-wrap gap-4 text-xs text-[#6B7280]">
                        <div className="flex items-center gap-1">
                          <FiCalendar className="h-3 w-3" />
                          <span>{formatDate(report.createdAt)}</span>
                        </div>
                        <div className="flex items-center gap-1">
                          <FiUser className="h-3 w-3" />
                          <span>Uploaded by {report.uploadedBy.name}</span>
                        </div>
                        <div className="flex items-center gap-1">
                          <FiClock className="h-3 w-3" />
                          <span>
                            {new Date(report.createdAt).toLocaleTimeString()}
                          </span>
                        </div>
                      </div>
                    </div>
                  </div>
                </div>

                {/* Download Button */}
                <div className="flex items-center">
                  <motion.button
                    whileHover={{ scale: 1.05 }}
                    whileTap={{ scale: 0.95 }}
                    onClick={() => handleDownload(report)}
                    className="flex items-center gap-2 px-4 py-2 bg-[#10B981] hover:bg-[#059669] text-white rounded-lg font-medium"
                  >
                    <FiDownload className="h-4 w-4" />
                    Download
                  </motion.button>
                </div>
              </div>
            </motion.div>
          ))}
        </div>
      )}

      {/* Help Text */}
      {filteredReports.length > 0 && (
        <div className="mt-6 p-4 bg-blue-50 rounded-lg border border-blue-200">
          <div className="flex items-start gap-3">
            <div className="w-5 h-5 text-blue-600 mt-0.5 flex-shrink-0">
              <svg
                fill="none"
                stroke="currentColor"
                viewBox="0 0 24 24"
                xmlns="http://www.w3.org/2000/svg"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={2}
                  d="M13 16h-1v-4h-1m1-4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z"
                />
              </svg>
            </div>
            <div>
              <p className="text-sm text-blue-800">
                <strong>Note:</strong> Downloaded files will automatically have
                the .pdf extension and follow the naming format:{" "}
                <code>ReportType_Report_Year.pdf</code>
              </p>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default Reports;
