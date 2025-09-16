import React, { useState, useEffect } from "react";
import { getMyPortfolios } from "../../Utils/Api";
import { useAuth } from "../../contexts/AuthContext";
import { motion } from "framer-motion";
import {
  FiDownload,
  FiFileText,
  FiCalendar,
  FiUser,
  FiClock,
  FiInfo,
} from "react-icons/fi";
import { toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";

const Portfolio = () => {
  const { user } = useAuth();
  const [portfolios, setPortfolios] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchPortfolios();
  }, []);

  const fetchPortfolios = async () => {
    try {
      setLoading(true);
      const response = await getMyPortfolios();
      if (response.data.valid) {
        setPortfolios(response.data.portfolios);
      }
    } catch (error) {
      toast.error("Error fetching portfolios!");
      console.error("Error fetching portfolios:", error);
    } finally {
      setLoading(false);
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

  const handleDownload = async (portfolio) => {
    try {
      // Fetch the file from the URL
      const response = await fetch(portfolio.fileUrl);
      const blob = await response.blob();

      // Create a blob URL
      const blobUrl = URL.createObjectURL(blob);

      // Create a temporary anchor element
      const link = document.createElement("a");
      link.href = blobUrl;

      // Ensure the filename ends with .pdf
      let fileName = portfolio.title.replace(/\s+/g, "_");
      if (!fileName.toLowerCase().endsWith(".pdf")) {
        fileName += ".pdf";
      }

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
          <h1 className="text-2xl font-bold text-[#1F2937]">My Portfolios</h1>
          <p className="text-[#4B5563]">
            View and manage your generated portfolios
          </p>
        </div>
        <div className="text-sm text-[#6B7280]">
          {portfolios.length}{" "}
          {portfolios.length === 1 ? "portfolio" : "portfolios"} found
        </div>
      </div>

      {/* Portfolios List */}
      {portfolios.length === 0 ? (
        <div className="bg-white rounded-lg shadow-md p-8 text-center">
          <FiFileText className="h-12 w-12 text-gray-400 mx-auto mb-4" />
          <h3 className="text-lg font-medium text-gray-900 mb-2">
            No portfolios yet
          </h3>
          <p className="text-gray-500 mb-4">
            Your generated portfolios will appear here once you create them from
            the dashboard.
          </p>
        </div>
      ) : (
        <div className="grid grid-cols-1 gap-4">
          {portfolios.map((portfolio) => (
            <motion.div
              key={portfolio._id}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.3 }}
              className="bg-white rounded-lg shadow-md p-6 hover:shadow-lg transition-shadow"
            >
              <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
                {/* Portfolio Info */}
                <div className="flex-1">
                  <div className="flex items-start gap-3">
                    <div className="w-10 h-10 rounded-full bg-blue-100 flex items-center justify-center text-blue-600 flex-shrink-0">
                      <FiFileText className="h-5 w-5" />
                    </div>
                    <div className="flex-1">
                      <h3 className="text-lg font-semibold text-[#1F2937] mb-1">
                        {portfolio.title}
                      </h3>
                      <p className="text-[#4B5563] mb-2 text-sm">
                        {portfolio.description}
                      </p>
                      <div className="flex flex-wrap gap-4 text-xs text-[#6B7280]">
                        <div className="flex items-center gap-1">
                          <FiCalendar className="h-3 w-3" />
                          <span>{formatDate(portfolio.createdAt)}</span>
                        </div>
                        <div className="flex items-center gap-1">
                          <FiUser className="h-3 w-3" />
                          <span>{user?.name}</span>
                        </div>
                        <div className="flex items-center gap-1">
                          <FiClock className="h-3 w-3" />
                          <span>
                            {new Date(portfolio.createdAt).toLocaleTimeString()}
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
                    onClick={() => handleDownload(portfolio)}
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
      {portfolios.length > 0 && (
        <div className="mt-6 p-4 bg-blue-50 rounded-lg border border-blue-200">
          <div className="flex items-start gap-3">
            <FiInfo className="h-5 w-5 text-blue-600 mt-0.5 flex-shrink-0" />
            <div>
              <p className="text-sm text-blue-800">
                <strong>Note:</strong> Your downloaded files will have the .pdf
                extension added automatically. Click the download button to save
                your portfolio to your device.
              </p>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default Portfolio;
