// src/pages/Home.jsx
import { motion } from "framer-motion";
import {
  FiBarChart2,
  FiBookOpen,
  FiCheckCircle,
  FiLogIn,
  FiSearch,
  FiShield,
  FiTrendingUp,
  FiUser,
} from "react-icons/fi";
import achivo from "../assets/achivo.png";
import Footer from "../components/Footer";
import { useNavigate } from "react-router-dom";

// Animation variants
const containerVariants = {
  hidden: { opacity: 0 },
  visible: {
    opacity: 1,
    transition: {
      staggerChildren: 0.2,
      delayChildren: 0.3,
    },
  },
};

const itemVariants = {
  hidden: { y: 20, opacity: 0 },
  visible: {
    y: 0,
    opacity: 1,
    transition: {
      duration: 0.6,
      ease: "easeOut",
    },
  },
};

const cardVariants = {
  hidden: { y: 30, opacity: 0 },
  visible: {
    y: 0,
    opacity: 1,
    transition: {
      duration: 0.5,
      ease: "easeOut",
    },
  },
};

const progressRingVariants = {
  hidden: { scale: 0, opacity: 0 },
  visible: {
    scale: 1,
    opacity: 1,
    transition: {
      duration: 0.8,
      ease: "easeOut",
    },
  },
};

const Home = () => {
  const navigate = useNavigate();

  return (
    <div className="bg-[#F9FAFB]">
      {/* Hero Section */}
      <section
        className="relative min-h-screen flex items-center justify-center px-6 bg-cover bg-center"
        style={{ backgroundImage: `url(${achivo})` }}
      >
        <div className="max-w-5xl mx-auto text-center">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6 }}
            className="mb-8 sm:mb-8 mt-8 sm:-mt-16"
          >
            <h1 className="text-4xl md:text-6xl font-extrabold text-[#000000] mb-6 leading-tight">
              One Platform for All Student Achievements
            </h1>
            <p className="text-lg md:text-xl text-[#000000] max-w-2xl mx-auto">
              Empowering Students, Faculty, and Institutions with Analytics,
              Career Guidance, and Accreditation-Ready Reports.
            </p>
          </motion.div>

          {/* CTA Buttons */}
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: 0.3, duration: 0.6 }}
            className="flex flex-col sm:flex-row gap-4 justify-center"
          >
            <motion.button
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
              onClick={() => navigate("/auth/signup")}
              className="flex items-center justify-center gap-2 px-6 py-3 bg-[#28a745] text-white rounded-lg font-semibold shadow-md"
            >
              <FiUser className="h-5 w-5" />
              Get Started
            </motion.button>

            <motion.button
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
              onClick={() => navigate("/auth/login")}
              className="flex items-center justify-center gap-2 px-6 py-2 bg-white border-2 border-[#10B981] text-[#10B981] rounded-lg font-semibold transition-all"
            >
              <FiLogIn className="h-5 w-5" />
              Login
            </motion.button>

            <motion.button
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
              onClick={() => navigate("/student-search")}
              className="flex items-center justify-center gap-2 px-6 py-3 bg-[#0000FF] text-white rounded-lg font-semibold shadow-md"
            >
              <FiSearch className="h-5 w-5" />
              Student Search
            </motion.button>
          </motion.div>

          {/* Quick Stats with Progress Rings */}
          <motion.div
            className="grid grid-cols-1 sm:grid-cols-3 gap-10 mt-16 text-center"
            variants={containerVariants}
            initial="hidden"
            whileInView="visible"
            viewport={{ once: true }}
          >
            {[
              {
                percent: 88.5,
                color: "#862121ff",
                label: "Students Empowered",
              },
              { percent: 73.1, color: "#0a063cff", label: "Institutions" },
              { percent: 61.5, color: "#0c4b12ff", label: "Reports Generated" },
            ].map((item, idx) => {
              const radius = 54;
              const circumference = 2 * Math.PI * radius;
              const offset =
                circumference - (item.percent / 100) * circumference;

              return (
                <motion.div
                  key={idx}
                  className="flex flex-col items-center"
                  variants={progressRingVariants}
                >
                  <svg
                    width="140"
                    height="140"
                    viewBox="0 0 120 120"
                    className="mb-3"
                  >
                    {/* Background Ring */}
                    <circle
                      cx="60"
                      cy="60"
                      r={radius}
                      stroke="#E5E7EB"
                      strokeWidth="10"
                      fill="none"
                    />
                    {/* Progress Ring */}
                    <circle
                      cx="60"
                      cy="60"
                      r={radius}
                      stroke={item.color}
                      strokeWidth="10"
                      fill="none"
                      strokeLinecap="round"
                      strokeDasharray={circumference}
                      strokeDashoffset={offset}
                      transform="rotate(-90 60 60)"
                    />
                    {/* Percentage Text */}
                    <text
                      x="50%"
                      y="50%"
                      dominantBaseline="middle"
                      textAnchor="middle"
                      className="font-bold"
                      fontSize="24"
                      fill="#1F2937"
                    >
                      {item.percent}%
                    </text>
                  </svg>
                  <p className="text-[#4B5563] text-sm font-medium">
                    {item.label}
                  </p>
                </motion.div>
              );
            })}
          </motion.div>
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
          <motion.div
            className="grid gap-8 md:grid-cols-2 lg:grid-cols-4"
            variants={containerVariants}
            initial="hidden"
            whileInView="visible"
            viewport={{ once: true }}
          >
            {/* Card 1 */}
            <motion.div
              className="relative bg-white shadow-lg rounded-xl pt-12 pb-6 px-4 border border-[#10B981] hover:shadow-xl hover:border-2 hover:border-[#10B981] transition duration-300"
              variants={cardVariants}
              whileHover={{ y: -5 }}
            >
              <div className="absolute -top-8 left-1/2 transform -translate-x-1/2 bg-[#10B981] w-16 h-16 rounded-full flex items-center justify-center shadow-md">
                <FiUser className="h-8 w-8 text-white" />
              </div>
              <h3 className="text-xl font-semibold text-[#1F2937] mb-2 mt-4">
                Student Dashboard
              </h3>
              <p className="text-[#4B5563]">
                Track grades, achievements, certificates, and career insights in
                real time.
              </p>
            </motion.div>

            {/* Card 2 */}
            <motion.div
              className="relative bg-white shadow-lg rounded-xl pt-12 pb-6 px-4 border border-[#10B981] hover:shadow-xl hover:border-2 hover:border-[#10B981] transition duration-300"
              variants={cardVariants}
              whileHover={{ y: -5 }}
              transition={{ delay: 0.1 }}
            >
              <div className="absolute -top-8 left-1/2 transform -translate-x-1/2 bg-[#10B981] w-16 h-16 rounded-full flex items-center justify-center shadow-md">
                <FiBookOpen className="h-8 w-8 text-white" />
              </div>
              <h3 className="text-xl font-semibold text-[#1F2937] mb-2 mt-4">
                Faculty Approvals
              </h3>
              <p className="text-[#4B5563]">
                Easily validate student submissions, attendance, and performance
                data.
              </p>
            </motion.div>

            {/* Card 3 */}
            <motion.div
              className="relative bg-white shadow-lg rounded-xl pt-12 pb-6 px-4 border border-[#10B981] hover:shadow-xl hover:border-2 hover:border-[#10B981] transition duration-300"
              variants={cardVariants}
              whileHover={{ y: -5 }}
              transition={{ delay: 0.2 }}
            >
              <div className="absolute -top-8 left-1/2 transform -translate-x-1/2 bg-[#10B981] w-16 h-16 rounded-full flex items-center justify-center shadow-md">
                <FiShield className="h-8 w-8 text-white" />
              </div>
              <h3 className="text-xl font-semibold text-[#1F2937] mb-2 mt-4">
                Admin Reports
              </h3>
              <p className="text-[#4B5563]">
                Generate NAAC/NIRF-ready reports and manage institute-level
                insights.
              </p>
            </motion.div>

            {/* Card 4 */}
            <motion.div
              className="relative bg-white shadow-lg rounded-xl pt-12 pb-6 px-4 border border-[#10B981] hover:shadow-xl hover:border-2 hover:border-[#10B981] transition duration-300"
              variants={cardVariants}
              whileHover={{ y: -5 }}
              transition={{ delay: 0.3 }}
            >
              <div className="absolute -top-8 left-1/2 transform -translate-x-1/2 bg-[#10B981] w-16 h-16 rounded-full flex items-center justify-center shadow-md">
                <FiTrendingUp className="h-8 w-8 text-white" />
              </div>
              <h3 className="text-xl font-semibold text-[#1F2937] mb-2 mt-4">
                Portfolio Auto-Generation
              </h3>
              <p className="text-[#4B5563]">
                Automatically build a verified professional portfolio for each
                student from approved data.
              </p>
            </motion.div>
          </motion.div>
        </div>
      </section>

      {/* AI + Portfolio + Leaderboard Section */}
      <section className="py-4 bg-gradient-to-r from-[#10B981] via-[#059669] to-[#047857] text-white">
        <div className="max-w-6xl mx-auto px-6 text-center">
          {/* Heading */}
          <motion.h2
            className="text-3xl md:text-4xl font-bold mb-4"
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6 }}
            viewport={{ once: true }}
          >
            AI Career Tools, Portfolio & Leaderboard
          </motion.h2>
          <motion.p
            className="text-lg max-w-3xl mx-auto mb-12 text-gray-100"
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, delay: 0.1 }}
            viewport={{ once: true }}
          >
            Our AI analyzes achievements to recommend career tracks,
            automatically builds professional portfolios, and generates a
            gamified leaderboard so students stay motivated through credits and
            rankings.
          </motion.p>

          {/* Features Grid */}
          <motion.div
            className="grid gap-8 md:grid-cols-3"
            variants={containerVariants}
            initial="hidden"
            whileInView="visible"
            viewport={{ once: true }}
          >
            {/* Career Insights */}
            <motion.div
              className="p-6 bg-white/10 backdrop-blur-lg rounded-2xl shadow-lg hover:scale-105 transition-transform"
              variants={itemVariants}
              whileHover={{ scale: 1.05 }}
            >
              <FiTrendingUp className="h-12 w-12 text-white mx-auto mb-4" />
              <h3 className="text-xl font-semibold mb-2">Career Insights</h3>
              <p className="text-gray-200 text-sm">
                Personalized AI-powered recommendations on future career paths.
              </p>
            </motion.div>

            {/* Portfolio Auto-Generation */}
            <motion.div
              className="p-6 bg-white/10 backdrop-blur-lg rounded-2xl shadow-lg hover:scale-105 transition-transform"
              variants={itemVariants}
              whileHover={{ scale: 1.05 }}
              transition={{ delay: 0.1 }}
            >
              <FiCheckCircle className="h-12 w-12 text-white mx-auto mb-4" />
              <h3 className="text-xl font-semibold mb-2">
                Portfolio Auto-Generation
              </h3>
              <p className="text-gray-200 text-sm">
                Instantly create a professional portfolio from validated
                achievements, ready to share with employers and recruiters.
              </p>
            </motion.div>

            {/* Leaderboard System */}
            <motion.div
              className="p-6 bg-white/10 backdrop-blur-lg rounded-2xl shadow-lg hover:scale-105 transition-transform"
              variants={itemVariants}
              whileHover={{ scale: 1.05 }}
              transition={{ delay: 0.2 }}
            >
              <FiBarChart2 className="h-12 w-12 text-white mx-auto mb-4" />
              <h3 className="text-xl font-semibold mb-2">Leaderboard System</h3>
              <p className="text-gray-200 text-sm">
                Track achievements and compete with peers using a credit-based
                ranking system.
              </p>
            </motion.div>
          </motion.div>
        </div>
      </section>

      {/* How It Works Section */}
      <section className="py-12">
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
          <motion.div
            className="grid gap-8 md:grid-cols-3"
            variants={containerVariants}
            initial="hidden"
            whileInView="visible"
            viewport={{ once: true }}
          >
            <motion.div className="p-6" variants={itemVariants}>
              <FiCheckCircle className="h-12 w-12 text-[#28a745] mx-auto mb-4" />
              <h3 className="text-xl font-semibold text-[#1F2937]">
                Step 1: Student Uploads
              </h3>
              <p className="text-[#4B5563]">
                Students upload certificates, achievements, and activity
                records.
              </p>
            </motion.div>
            <motion.div
              className="p-6"
              variants={itemVariants}
              transition={{ delay: 0.1 }}
            >
              <FiBookOpen className="h-12 w-12 text-[#28a745] mx-auto mb-4" />
              <h3 className="text-xl font-semibold text-[#1F2937]">
                Step 2: Faculty Validates
              </h3>
              <p className="text-[#4B5563]">
                Faculty review and validate uploaded data for accuracy.
              </p>
            </motion.div>
            <motion.div
              className="p-6"
              variants={itemVariants}
              transition={{ delay: 0.2 }}
            >
              <FiBarChart2 className="h-12 w-12 text-[#28a745] mx-auto mb-4" />
              <h3 className="text-xl font-semibold text-[#1F2937]">
                Step 3: Admin Generates Reports
              </h3>
              <p className="text-[#4B5563]">
                Admins generate data-driven reports and dashboards instantly.
              </p>
            </motion.div>
          </motion.div>
        </div>
      </section>

      {/* Impact Section */}
      <section className="py-12 bg-[#ECFDF5]">
        <div className="max-w-6xl mx-auto px-6 text-center">
          <motion.h2
            className="text-3xl font-bold text-[#1F2937] mb-12"
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6 }}
            viewport={{ once: true }}
          >
            For Institutions
          </motion.h2>
          <motion.p
            className="text-lg text-[#4B5563] max-w-3xl mx-auto mb-10"
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, delay: 0.1 }}
            viewport={{ once: true }}
          >
            Simplify accreditation processes and unlock deep insights into
            student performance.
          </motion.p>
          <motion.div
            className="grid gap-8 md:grid-cols-3"
            variants={containerVariants}
            initial="hidden"
            whileInView="visible"
            viewport={{ once: true }}
          >
            <motion.div
              className="p-6 bg-white shadow-lg rounded-xl"
              variants={cardVariants}
            >
              <h3 className="text-xl font-semibold text-[#1F2937] mb-2">
                Accreditation-Ready
              </h3>
              <p className="text-[#4B5563]">
                Generate instant NAAC/NIRF-ready reports with verified student
                data.
              </p>
            </motion.div>
            <motion.div
              className="p-6 bg-white shadow-lg rounded-xl"
              variants={cardVariants}
              transition={{ delay: 0.1 }}
            >
              <h3 className="text-xl font-semibold text-[#1F2937] mb-2">
                Data-Driven Insights
              </h3>
              <p className="text-[#4B5563]">
                Make informed decisions based on analytics and trends across
                departments.
              </p>
            </motion.div>
            <motion.div
              className="p-6 bg-white shadow-lg rounded-xl"
              variants={cardVariants}
              transition={{ delay: 0.2 }}
            >
              <h3 className="text-xl font-semibold text-[#1F2937] mb-2">
                Reduced Paperwork
              </h3>
              <p className="text-[#4B5563]">
                Automate certificate validation and reporting, saving time for
                faculty & staff.
              </p>
            </motion.div>
          </motion.div>
        </div>
      </section>

      {/* Final CTA */}
      <section className="py-20 bg-white text-center">
        <motion.h2
          className="text-3xl md:text-4xl font-bold mb-6 text-[#1F2937]"
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6 }}
          viewport={{ once: true }}
        >
          Join the Future of Student Achievement Management
        </motion.h2>
        <motion.p
          className="text-lg max-w-2xl mx-auto mb-8 text-[#4B5563]"
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6, delay: 0.1 }}
          viewport={{ once: true }}
        >
          Start today and empower your institution with smarter, faster, and
          more impactful solutions.
        </motion.p>
        <motion.div
          className="flex flex-col sm:flex-row justify-center gap-4"
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6, delay: 0.2 }}
          viewport={{ once: true }}
        >
          <motion.button
            whileHover={{ scale: 1.05 }}
            whileTap={{ scale: 0.95 }}
            onClick={() => navigate("/auth/signup")}
            className="px-6 py-3 bg-[#10B981] text-white rounded-lg font-semibold hover:bg-[#059669]"
          >
            Get Started
          </motion.button>
          <motion.button
            whileHover={{ scale: 1.05 }}
            whileTap={{ scale: 0.95 }}
            onClick={() => navigate("/contact")}
            className="px-6 py-3 border-2 border-[#10B981] text-[#10B981] rounded-lg font-semibold hover:bg-[#10B981] hover:text-white"
          >
            Contact Us
          </motion.button>
        </motion.div>
      </section>

      <Footer />
    </div>
  );
};

export default Home;
