// src/pages/Home.jsx
import { motion } from "framer-motion";
import {
  FiBarChart2,
  FiBookOpen,
  FiCheckCircle,
  FiShield,
  FiTrendingUp,
  FiUser,
  FiSearch,
  FiLogIn,
  FiUsers,
  FiHome,
  FiFileText,
} from "react-icons/fi";
import lock3 from "../assets/lock3.png";
import { useNavigate } from "react-router-dom";
import { useEffect, useState } from "react";
import { getHomeData } from "../Utils/Api";
import { toast } from "react-toastify";

const Home = () => {
  const navigate = useNavigate();
  const [homeData, setHomeData] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchHomeData();
  }, []);

  const fetchHomeData = async () => {
    try {
      setLoading(true);
      const response = await getHomeData();
      if (response.data.valid) {
        setHomeData(response.data.data);
      }
    } catch (error) {
      console.error("Error fetching home data:", error);
      toast.error("Error loading statistics");
      // Set fallback data
      setHomeData({
        studentCount: 0,
        instituteCount: 0,
        reportCount: 0,
      });
    } finally {
      setLoading(false);
    }
  };

  // Calculate percentages based on realistic targets
  const calculatePercentage = (current, target = 100) => {
    return Math.min(Math.round((current / target) * 100), 100);
  };

  const stats = homeData
    ? {
        studentsPercent: calculatePercentage(homeData.studentCount, 500),
        institutesPercent: calculatePercentage(homeData.instituteCount, 50),
        reportsPercent: calculatePercentage(homeData.reportCount, 1000),
      }
    : null;

  return (
    <div className="bg-[#F9FAFB]">
      {/* Hero Section */}
      <section
        className="relative min-h-screen flex items-center justify-center px-6 bg-cover bg-center"
        style={{ backgroundImage: `url(${lock3})` }}
      >
        <div className="max-w-5xl mx-auto text-center">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6 }}
            className="mb-8 sm:mb-8 mt-8 sm:-mt-16"
          >
            <h1 className="text-4xl md:text-6xl font-extrabold text-[#1F2937] mb-6 leading-tight">
              One Platform for All Student Achievements
            </h1>
            <p className="text-lg md:text-xl text-[#4B5563] max-w-2xl mx-auto">
              Empowering Students, Faculty, and Institutions with Analytics,
              Career Guidance, and Accreditation-Ready Reports.
            </p>
          </motion.div>

          {/* CTA Buttons */}
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: 0.3, duration: 0.6 }}
            className="flex flex-col sm:flex-row gap-4 justify-center mb-12"
          >
            <motion.button
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
              onClick={() => navigate("/auth/signup")}
              className="flex items-center justify-center gap-2 px-6 py-3 bg-[#10B981] hover:bg-[#059669] text-white rounded-lg font-semibold shadow-md"
            >
              <FiUser className="h-5 w-5" />
              Get Started
            </motion.button>

            <motion.button
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
              onClick={() => navigate("/auth/login")}
              className="flex items-center justify-center gap-2 px-6 py-3 bg-white border-2 border-[#10B981] text-[#10B981] rounded-lg font-semibold hover:bg-[#10B981] hover:text-white transition-all"
            >
              <FiLogIn className="h-5 w-5" />
              Login
            </motion.button>

            <motion.button
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
              onClick={() => navigate("/student-search")}
              className="flex items-center justify-center gap-2 px-6 py-3 bg-[#3B82F6] hover:bg-[#2563EB] text-white rounded-lg font-semibold shadow-md"
            >
              <FiSearch className="h-5 w-5" />
              Student Search
            </motion.button>
          </motion.div>

          {/* Quick Stats with Static Data */}
          <div className="grid grid-cols-1 sm:grid-cols-3 gap-8 mt-16 text-center">
            {[
              {
                icon: <FiUsers className="h-8 w-8 text-white" />,
                value: homeData
                  ? homeData.studentCount.toLocaleString()
                  : "2,500+",
                label: "Students Empowered",
                color: "bg-[#10B981]",
                loading: loading,
              },
              {
                icon: <FiHome className="h-8 w-8 text-white" />,
                value: homeData
                  ? homeData.instituteCount.toLocaleString()
                  : "50+",
                label: "Institutions",
                color: "bg-[#3B82F6]",
                loading: loading,
              },
              {
                icon: <FiFileText className="h-8 w-8 text-white" />,
                value: homeData
                  ? homeData.reportCount.toLocaleString()
                  : "1,000+",
                label: "Reports Generated",
                color: "bg-[#8B5CF6]",
                loading: loading,
              },
            ].map((stat, idx) => (
              <motion.div
                key={idx}
                className="flex flex-col items-center"
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.8 + idx * 0.1, duration: 0.5 }}
              >
                <div
                  className={`w-20 h-20 ${stat.color} rounded-full flex items-center justify-center shadow-lg mb-4`}
                >
                  {stat.icon}
                </div>

                {stat.loading ? (
                  <div className="h-8 w-20 bg-gray-200 rounded animate-pulse mb-2"></div>
                ) : (
                  <h3 className="text-3xl font-bold text-[#1F2937] mb-2">
                    {stat.value}
                  </h3>
                )}

                <p className="text-[#4B5563] text-sm font-medium">
                  {stat.label}
                </p>
              </motion.div>
            ))}
          </div>

          {/* Loading State */}
          {loading && (
            <div className="grid grid-cols-1 sm:grid-cols-3 gap-10 mt-16 text-center">
              {[1, 2, 3].map((item) => (
                <div key={item} className="flex flex-col items-center">
                  <div className="w-32 h-32 rounded-full bg-gray-200 animate-pulse mb-3"></div>
                  <div className="h-4 w-24 bg-gray-200 rounded animate-pulse"></div>
                </div>
              ))}
            </div>
          )}
        </div>
      </section>

      {/* Key Features Section */}
      <section className="py-12">
        <div className="max-w-6xl mx-auto px-6 text-center">
          <motion.h2
            className="text-3xl font-bold text-[#1F2937] mb-12"
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6 }}
            viewport={{ once: true }}
          >
            Key Features
          </motion.h2>
          <div className="grid gap-8 md:grid-cols-2 lg:grid-cols-4">
            {[
              {
                icon: <FiUser className="h-8 w-8 text-white" />,
                title: "Student Dashboard",
                description:
                  "Track grades, achievements, certificates, and career insights in real time.",
              },
              {
                icon: <FiBookOpen className="h-8 w-8 text-white" />,
                title: "Faculty Approvals",
                description:
                  "Easily validate student submissions, attendance, and performance data.",
              },
              {
                icon: <FiShield className="h-8 w-8 text-white" />,
                title: "Admin Reports",
                description:
                  "Generate NAAC/NIRF-ready reports and manage institute-level insights.",
              },
              {
                icon: <FiTrendingUp className="h-8 w-8 text-white" />,
                title: "Portfolio Auto-Generation",
                description:
                  "Automatically build a verified professional portfolio from approved data.",
              },
            ].map((feature, index) => (
              <motion.div
                key={index}
                className="relative bg-white shadow-lg rounded-xl pt-12 pb-6 px-4 border border-[#10B981] hover:shadow-xl hover:border-2 hover:border-[#10B981] transition duration-300"
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                transition={{ delay: index * 0.1, duration: 0.5 }}
                viewport={{ once: true }}
              >
                <div className="absolute -top-8 left-1/2 transform -translate-x-1/2 bg-[#10B981] w-16 h-16 rounded-full flex items-center justify-center shadow-md">
                  {feature.icon}
                </div>
                <h3 className="text-xl font-semibold text-[#1F2937] mb-2 mt-4">
                  {feature.title}
                </h3>
                <p className="text-[#4B5563]">{feature.description}</p>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* How It Works Section */}
      <section className="py-12 bg-[#ECFDF5]">
        <div className="max-w-6xl mx-auto px-6 text-center">
          <motion.h2
            className="text-3xl font-bold text-[#1F2937] mb-12"
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6 }}
            viewport={{ once: true }}
          >
            How It Works
          </motion.h2>
          <div className="grid gap-8 md:grid-cols-3">
            {[
              {
                icon: (
                  <FiCheckCircle className="h-12 w-12 text-[#10B981] mx-auto mb-4" />
                ),
                title: "Step 1: Student Uploads",
                description:
                  "Students upload certificates, achievements, and activity records.",
              },
              {
                icon: (
                  <FiBookOpen className="h-12 w-12 text-[#10B981] mx-auto mb-4" />
                ),
                title: "Step 2: Faculty Validates",
                description:
                  "Faculty review and validate uploaded data for accuracy.",
              },
              {
                icon: (
                  <FiBarChart2 className="h-12 w-12 text-[#10B981] mx-auto mb-4" />
                ),
                title: "Step 3: Admin Generates Reports",
                description:
                  "Admins generate data-driven reports and dashboards instantly.",
              },
            ].map((step, index) => (
              <motion.div
                key={index}
                className="p-6"
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                transition={{ delay: index * 0.1, duration: 0.5 }}
                viewport={{ once: true }}
              >
                {step.icon}
                <h3 className="text-xl font-semibold text-[#1F2937]">
                  {step.title}
                </h3>
                <p className="text-[#4B5563]">{step.description}</p>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* AI + Portfolio + Leaderboard Section */}
      <section className="py-12">
        <div className="max-w-6xl mx-auto px-6 text-center">
          <motion.h2
            className="text-3xl font-bold text-[#1F2937] mb-12"
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6 }}
            viewport={{ once: true }}
          >
            AI Career Tools, Portfolio & Leaderboard
          </motion.h2>
          <motion.p
            className="text-lg text-[#4B5563] max-w-3xl mx-auto mb-10"
            initial={{ opacity: 0 }}
            whileInView={{ opacity: 1 }}
            transition={{ delay: 0.2, duration: 0.6 }}
            viewport={{ once: true }}
          >
            Our AI analyzes achievements to recommend career tracks,
            automatically builds professional portfolios, and generates a
            gamified leaderboard so students stay motivated through credits and
            rankings.
          </motion.p>

          <div className="grid gap-8 md:grid-cols-3">
            {[
              {
                icon: (
                  <FiTrendingUp className="h-10 w-10 text-[#10B981] mx-auto mb-4" />
                ),
                title: "Career Insights",
                description:
                  "Personalized AI-powered recommendations on future career paths.",
              },
              {
                icon: (
                  <FiCheckCircle className="h-10 w-10 text-[#10B981] mx-auto mb-4" />
                ),
                title: "Portfolio Auto-Generation",
                description:
                  "Instantly create a professional portfolio from validated achievements.",
              },
              {
                icon: (
                  <FiBarChart2 className="h-10 w-10 text-[#10B981] mx-auto mb-4" />
                ),
                title: "Leaderboard System",
                description:
                  "Track achievements and compete with peers using a credit-based ranking system.",
              },
            ].map((feature, index) => (
              <motion.div
                key={index}
                className="p-6 bg-white shadow-lg rounded-xl"
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                transition={{ delay: index * 0.1, duration: 0.5 }}
                viewport={{ once: true }}
              >
                {feature.icon}
                <h3 className="text-xl font-semibold text-[#1F2937] mb-2">
                  {feature.title}
                </h3>
                <p className="text-[#4B5563]">{feature.description}</p>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* Final CTA */}
      <section className="py-20 bg-[#10B981] text-white text-center">
        <motion.h2
          className="text-3xl md:text-4xl font-bold mb-6"
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6 }}
          viewport={{ once: true }}
        >
          Join the Future of Student Achievement Management
        </motion.h2>
        <motion.p
          className="text-lg max-w-2xl mx-auto mb-8"
          initial={{ opacity: 0 }}
          whileInView={{ opacity: 1 }}
          transition={{ delay: 0.2, duration: 0.6 }}
          viewport={{ once: true }}
        >
          Start today and empower your institution with smarter, faster, and
          more impactful solutions.
        </motion.p>
        <motion.div
          className="flex flex-col sm:flex-row justify-center gap-4"
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.4, duration: 0.6 }}
          viewport={{ once: true }}
        >
          <button
            onClick={() => navigate("/auth/signup")}
            className="px-6 py-3 bg-white text-[#10B981] rounded-lg font-semibold hover:bg-gray-100 transition-colors"
          >
            Get Started
          </button>
          <button
            onClick={() => navigate("/student-search")}
            className="px-6 py-3 border-2 border-white text-white rounded-lg font-semibold hover:bg-white hover:text-[#10B981] transition-colors"
          >
            Student Search
          </button>
        </motion.div>
      </section>
    </div>
  );
};

export default Home;
