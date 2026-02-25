// AI_Insights.jsx
import React, { useState, useEffect } from "react";
import { getAIInsights } from "../../Utils/Api";
import { motion } from "framer-motion";
import {
  FiCpu,
  FiRefreshCw,
  FiTrendingUp,
  FiAward,
  FiAlertTriangle,
  FiTarget,
  FiUserCheck,
  FiZap,
  FiAlertCircle,
  FiCheckCircle,
  FiArrowLeft,
  FiBriefcase,
  FiCode,
  FiStar,
  FiTrendingDown,
} from "react-icons/fi";
import { toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import { useNavigate } from "react-router-dom";

const AI_Insights = () => {
  const navigate = useNavigate();
  const [insights, setInsights] = useState(null);
  const [loading, setLoading] = useState(false);
  const [initialLoading, setInitialLoading] = useState(true);

  // Load insights from localStorage on component mount
  useEffect(() => {
    const storedInsights = localStorage.getItem("ai_insights");
    if (storedInsights) {
      setInsights(JSON.parse(storedInsights));
    }
    setInitialLoading(false);
  }, []);

  const fetchAIInsights = async (showToast = true) => {
    try {
      setLoading(true);
      const response = await getAIInsights();

      if (response?.data?.valid) {
        const insightsData = response.data.ai_insights;
        setInsights(insightsData);

        // Save to localStorage
        localStorage.setItem("ai_insights", JSON.stringify(insightsData));

        if (showToast) {
          toast.success(
            response.data.message || "AI insights generated successfully!",
          );
        }
      } else {
        toast.error("Failed to fetch AI insights");
      }
    } catch (error) {
      console.error("Error fetching AI insights:", error);
      toast.error("Error fetching AI insights!");
    } finally {
      setLoading(false);
    }
  };

  const handleRefresh = () => {
    fetchAIInsights(true);
  };

  // Function to determine risk score color
  const getRiskScoreColor = (score) => {
    if (score < 30) return "text-green-600";
    if (score < 60) return "text-yellow-600";
    return "text-red-600";
  };

  // Function to get risk score background
  const getRiskScoreBg = (score) => {
    if (score < 30) return "bg-green-100";
    if (score < 60) return "bg-yellow-100";
    return "bg-red-100";
  };

  if (initialLoading) {
    return (
      <div className="flex items-center justify-center h-64">
        <div className="w-8 h-8 border-4 border-indigo-600 border-t-transparent rounded-full animate-spin"></div>
      </div>
    );
  }

  return (
    <div className="p-6">
      {/* Header */}
      <div className="flex flex-col md:flex-row justify-between items-start md:items-center mb-6 gap-4">
        <div className="flex items-center gap-4">
          {/* <motion.button
            whileHover={{ scale: 1.1 }}
            whileTap={{ scale: 0.9 }}
            onClick={() => navigate("/student/dashboard")}
            className="p-2 hover:bg-gray-100 rounded-lg transition-colors"
          >
            <FiArrowLeft className="h-5 w-5 text-[#4B5563]" />
          </motion.button> */}
          <div>
            <h1 className="text-2xl font-bold text-[#1F2937] flex items-center gap-2">
              <FiCpu className="text-indigo-600" />
              AI Insights
            </h1>
            <p className="text-[#4B5563]">
              Personalized recommendations based on your performance
            </p>
          </div>
        </div>
        <motion.button
          whileHover={{ scale: 1.05 }}
          whileTap={{ scale: 0.95 }}
          onClick={handleRefresh}
          disabled={loading}
          className="flex items-center gap-2 px-4 py-2 bg-indigo-600 hover:bg-indigo-700 text-white rounded-lg font-semibold shadow-md disabled:opacity-50"
        >
          {loading ? (
            <div className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin"></div>
          ) : (
            <FiRefreshCw className="h-4 w-4" />
          )}
          {loading ? "Refreshing..." : "Refresh Insights"}
        </motion.button>
      </div>

      {!insights ? (
        <div className="bg-white rounded-lg shadow-md p-12 text-center">
          <div className="w-20 h-20 bg-indigo-100 rounded-full flex items-center justify-center mx-auto mb-4">
            <FiCpu className="h-10 w-10 text-indigo-600" />
          </div>
          <h3 className="text-xl font-bold text-[#1F2937] mb-2">
            No AI Insights Available
          </h3>
          <p className="text-[#4B5563] mb-6">
            Click the refresh button to generate your personalized AI insights
          </p>
          <motion.button
            whileHover={{ scale: 1.05 }}
            whileTap={{ scale: 0.95 }}
            onClick={handleRefresh}
            disabled={loading}
            className="inline-flex items-center gap-2 px-6 py-3 bg-indigo-600 hover:bg-indigo-700 text-white rounded-lg font-semibold shadow-md"
          >
            {loading ? (
              <div className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin"></div>
            ) : (
              <FiRefreshCw className="h-4 w-4" />
            )}
            {loading ? "Generating..." : "Generate AI Insights"}
          </motion.button>
        </div>
      ) : (
        <div className="space-y-6">
          {/* Risk Score Card */}
          <div className="bg-white rounded-lg shadow-md p-6">
            <div className="flex items-center justify-between mb-4">
              <div className="flex items-center gap-2">
                <FiAlertTriangle className="h-5 w-5 text-yellow-600" />
                <h2 className="text-lg font-bold text-[#1F2937]">
                  Risk Assessment
                </h2>
              </div>
              <div
                className={`px-4 py-2 rounded-full ${getRiskScoreBg(insights.risk_score)}`}
              >
                <span
                  className={`font-bold ${getRiskScoreColor(insights.risk_score)}`}
                >
                  Risk Score: {insights.risk_score}%
                </span>
              </div>
            </div>

            {insights.risk_flags && insights.risk_flags.length > 0 && (
              <div className="space-y-2">
                {insights.risk_flags.map((flag, index) => (
                  <div
                    key={index}
                    className="flex items-center gap-2 p-3 bg-red-50 text-red-700 rounded-lg"
                  >
                    <FiAlertCircle className="h-4 w-4 flex-shrink-0" />
                    <span className="text-sm">{flag}</span>
                  </div>
                ))}
              </div>
            )}
          </div>

          {/* Main Insights Grid */}
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
            {/* Career Paths */}
            <div className="bg-white rounded-lg shadow-md p-6">
              <div className="flex items-center gap-2 mb-4">
                <div className="w-8 h-8 rounded-full bg-blue-100 flex items-center justify-center">
                  <FiBriefcase className="h-4 w-4 text-blue-600" />
                </div>
                <h3 className="font-bold text-[#1F2937]">
                  Recommended Career Paths
                </h3>
              </div>
              <div className="flex flex-wrap gap-2">
                {insights.career_paths.map((path, index) => (
                  <span
                    key={index}
                    className="px-3 py-1 bg-blue-100 text-blue-700 rounded-full text-sm font-medium"
                  >
                    {path}
                  </span>
                ))}
              </div>
            </div>

            {/* Suggested Roles */}
            <div className="bg-white rounded-lg shadow-md p-6">
              <div className="flex items-center gap-2 mb-4">
                <div className="w-8 h-8 rounded-full bg-purple-100 flex items-center justify-center">
                  <FiUserCheck className="h-4 w-4 text-purple-600" />
                </div>
                <h3 className="font-bold text-[#1F2937]">Suggested Roles</h3>
              </div>
              <div className="flex flex-wrap gap-2">
                {insights.suggested_roles.map((role, index) => (
                  <span
                    key={index}
                    className="px-3 py-1 bg-purple-100 text-purple-700 rounded-full text-sm font-medium"
                  >
                    {role}
                  </span>
                ))}
              </div>
            </div>

            {/* Top Skills Detected */}
            <div className="bg-white rounded-lg shadow-md p-6">
              <div className="flex items-center gap-2 mb-4">
                <div className="w-8 h-8 rounded-full bg-green-100 flex items-center justify-center">
                  <FiZap className="h-4 w-4 text-green-600" />
                </div>
                <h3 className="font-bold text-[#1F2937]">
                  Top Skills Detected
                </h3>
              </div>
              <div className="flex flex-wrap gap-2">
                {insights.top_skills_detected.map((skill, index) => (
                  <span
                    key={index}
                    className="px-3 py-1 bg-green-100 text-green-700 rounded-full text-sm font-medium"
                  >
                    {skill}
                  </span>
                ))}
              </div>
            </div>

            {/* Strength Tags */}
            <div className="bg-white rounded-lg shadow-md p-6">
              <div className="flex items-center gap-2 mb-4">
                <div className="w-8 h-8 rounded-full bg-yellow-100 flex items-center justify-center">
                  <FiStar className="h-4 w-4 text-yellow-600" />
                </div>
                <h3 className="font-bold text-[#1F2937]">Your Strengths</h3>
              </div>
              <div className="flex flex-wrap gap-2">
                {insights.strength_tags.map((strength, index) => (
                  <span
                    key={index}
                    className="px-3 py-1 bg-yellow-100 text-yellow-700 rounded-full text-sm font-medium"
                  >
                    {strength}
                  </span>
                ))}
              </div>
            </div>

            {/* Improvement Areas */}
            <div className="bg-white rounded-lg shadow-md p-6">
              <div className="flex items-center gap-2 mb-4">
                <div className="w-8 h-8 rounded-full bg-orange-100 flex items-center justify-center">
                  <FiTrendingDown className="h-4 w-4 text-orange-600" />
                </div>
                <h3 className="font-bold text-[#1F2937]">
                  Areas for Improvement
                </h3>
              </div>
              <div className="flex flex-wrap gap-2">
                {insights.improvement_tags.map((tag, index) => (
                  <span
                    key={index}
                    className="px-3 py-1 bg-orange-100 text-orange-700 rounded-full text-sm font-medium"
                  >
                    {tag}
                  </span>
                ))}
              </div>
            </div>

            {/* Recommended Activity Categories */}
            <div className="bg-white rounded-lg shadow-md p-6">
              <div className="flex items-center gap-2 mb-4">
                <div className="w-8 h-8 rounded-full bg-indigo-100 flex items-center justify-center">
                  <FiTarget className="h-4 w-4 text-indigo-600" />
                </div>
                <h3 className="font-bold text-[#1F2937]">
                  Recommended Activities
                </h3>
              </div>
              <div className="flex flex-wrap gap-2">
                {insights.recommended_activity_categories.map(
                  (activity, index) => (
                    <span
                      key={index}
                      className="px-3 py-1 bg-indigo-100 text-indigo-700 rounded-full text-sm font-medium"
                    >
                      {activity}
                    </span>
                  ),
                )}
              </div>
            </div>
          </div>

          {/* Suggested Actions */}
          <div className="bg-white rounded-lg shadow-md p-6">
            <div className="flex items-center gap-2 mb-4">
              <div className="w-8 h-8 rounded-full bg-teal-100 flex items-center justify-center">
                <FiCheckCircle className="h-4 w-4 text-teal-600" />
              </div>
              <h3 className="font-bold text-[#1F2937]">Suggested Actions</h3>
            </div>
            <div className="space-y-3">
              {insights.suggested_actions.map((action, index) => (
                <div
                  key={index}
                  className="flex items-start gap-3 p-3 bg-gray-50 rounded-lg hover:bg-gray-100 transition-colors"
                >
                  <span className="w-6 h-6 rounded-full bg-teal-100 text-teal-600 flex items-center justify-center flex-shrink-0 text-sm font-medium">
                    {index + 1}
                  </span>
                  <p className="text-[#4B5563]">{action}</p>
                </div>
              ))}
            </div>
          </div>

          {/* Summary Note */}
          <div className="bg-indigo-50 rounded-lg p-4 text-center">
            <p className="text-indigo-700 text-sm">
              These insights are generated based on your academic performance,
              activities, and achievements. Regular updates will help you track
              your progress and make informed decisions.
            </p>
          </div>
        </div>
      )}
    </div>
  );
};

export default AI_Insights;
