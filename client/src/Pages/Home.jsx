// src/pages/Home.jsx
import { motion } from "framer-motion";
import {
  FiBarChart2,
  FiBookOpen,
  FiCheckCircle,
  FiShield,
  FiTrendingUp,
  FiUser,
} from "react-icons/fi";
import { useNavigate } from "react-router-dom";

const Home = () => {
  const navigate = useNavigate();

  return (
    <div className="bg-[#F9FAFB]">
      {/* Hero Section */}
      <section className="min-h-screen flex items-center justify-center px-6  -mt-16">
        <div className="max-w-5xl mx-auto text-center">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6 }}
            className="mb-8"
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
            className="flex flex-col sm:flex-row gap-4 justify-center"
          >
            <motion.button
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
              onClick={() => navigate("/auth/student")}
              className="flex items-center justify-center gap-2 px-6 py-3 bg-[#10B981] hover:bg-[#059669] text-white rounded-lg font-semibold shadow-md"
            >
              <FiUser className="h-5 w-5" />
              Student Login / Signup
            </motion.button>

            <motion.button
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
              onClick={() => navigate("/auth/faculty")}
              className="flex items-center justify-center gap-2 px-6 py-3 bg-[#10B981] hover:bg-[#059669] text-white rounded-lg font-semibold shadow-md"
            >
              <FiBookOpen className="h-5 w-5" />
              Faculty Login / Signup
            </motion.button>

            <motion.button
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
              onClick={() => navigate("/auth/admin")}
              className="flex items-center justify-center gap-2 px-6 py-3 bg-[#10B981] hover:bg-[#059669] text-white rounded-lg font-semibold shadow-md"
            >
              <FiShield className="h-5 w-5" />
              Admin Login
            </motion.button>
          </motion.div>
 {/* Quick Stats with Progress Rings */}
<div className="grid grid-cols-1 sm:grid-cols-3 gap-10 mt-16 text-center">
  {/* Students Empowered */}
  <div className="flex flex-col items-center">
    <svg width="140" height="140" viewBox="0 0 120 120" className="mb-3">
      {/* Background Ring */}
      <circle
        cx="60"
        cy="60"
        r="54"
        stroke="#E5E7EB"  // light gray background
        strokeWidth="6"
        fill="none"
      />
      {/* Progress Ring */}
      <circle
        cx="60"
        cy="60"
        r="54"
        stroke="#10B981" // primary
        strokeWidth="6"
        fill="none"
        strokeLinecap="round"
        strokeDasharray={`${2 * Math.PI * 54}`}
        strokeDashoffset={`${2 * Math.PI * 54 * 0.3}`} // ~70% filled
        transform="rotate(-90 60 60)" // start from top
      />
      {/* Text */}
      <text
        x="50%"
        y="50%"
        dominantBaseline="middle"
        textAnchor="middle"
        className="font-bold"
        fontSize="18"
        fill="#1F2937"
      >
        10,000+
      </text>
    </svg>
    <p className="text-[#4B5563] text-sm font-medium">Students Empowered</p>
  </div>

  {/* Institutions */}
  <div className="flex flex-col items-center">
    <svg width="140" height="140" viewBox="0 0 120 120" className="mb-3">
      <circle
        cx="60"
        cy="60"
        r="54"
        stroke="#E5E7EB"
        strokeWidth="6"
        fill="none"
      />
      <circle
        cx="60"
        cy="60"
        r="54"
        stroke="#1F2937" // primary text
        strokeWidth="6"
        fill="none"
        strokeLinecap="round"
        strokeDasharray={`${2 * Math.PI * 54}`}
        strokeDashoffset={`${2 * Math.PI * 54 * 0.5}`} // ~50% filled
        transform="rotate(-90 60 60)"
      />
      <text
        x="50%"
        y="50%"
        dominantBaseline="middle"
        textAnchor="middle"
        className="font-bold"
        fontSize="18"
        fill="#1F2937"
      >
        100+
      </text>
    </svg>
    <p className="text-[#4B5563] text-sm font-medium">Institutions</p>
  </div>

  {/* Reports Generated */}
  <div className="flex flex-col items-center">
    <svg width="140" height="140" viewBox="0 0 120 120" className="mb-3">
      <circle
        cx="60"
        cy="60"
        r="54"
        stroke="#E5E7EB"
        strokeWidth="6"
        fill="none"
      />
      <circle
        cx="60"
        cy="60"
        r="54"
        stroke="#4B5563" // secondary text
        strokeWidth="6"
        fill="none"
        strokeLinecap="round"
        strokeDasharray={`${2 * Math.PI * 54}`}
        strokeDashoffset={`${2 * Math.PI * 54 * 0.7}`} // ~30% filled
        transform="rotate(-90 60 60)"
      />
      <text
        x="50%"
        y="50%"
        dominantBaseline="middle"
        textAnchor="middle"
        className="font-bold"
        fontSize="18"
        fill="#1F2937"
      >
        500+
      </text>
    </svg>
    <p className="text-[#4B5563] text-sm font-medium">Reports Generated</p>
  </div>
</div>

        </div>
      </section>

      {/* Key Features Section */}
      {/* <section className="py-12 bg-[#ECFDF5]">
        <div className="max-w-6xl mx-auto px-6 text-center">
          <h2 className="text-3xl font-bold text-[#1F2937] mb-12">Key Features</h2>
          <div className="grid gap-8 md:grid-cols-3">
            <div className="p-6 bg-white shadow-lg rounded-xl">
              <FiUser className="h-10 w-10 text-[#10B981] mx-auto mb-4" />
              <h3 className="text-xl font-semibold text-[#1F2937] mb-2">Student Dashboard</h3>
              <p className="text-[#4B5563]">Track grades, achievements, certificates, and career insights in real time.</p>
            </div>
            <div className="p-6 bg-white shadow-lg rounded-xl">
              <FiBookOpen className="h-10 w-10 text-[#10B981] mx-auto mb-4" />
              <h3 className="text-xl font-semibold text-[#1F2937] mb-2">Faculty Approvals</h3>
              <p className="text-[#4B5563]">Easily validate student submissions, attendance, and performance data.</p>
            </div>
            <div className="p-6 bg-white shadow-lg rounded-xl">
              <FiShield className="h-10 w-10 text-[#10B981] mx-auto mb-4" />
              <h3 className="text-xl font-semibold text-[#1F2937] mb-2">Admin Reports</h3>
              <p className="text-[#4B5563]">Generate NAAC/NIRF-ready reports and manage institute-level insights.</p>
            </div>
            
                <div className="p-6 bg-white shadow-lg rounded-xl">
              <FiTrendingUp className="h-10 w-10 text-[#10B981] mx-auto mb-4" />
              <h3 className="text-xl font-semibold text-[#1F2937] mb-2">Portfolio Auto-Generation</h3>
              <p className="text-[#4B5563]">
                Automatically build a verified professional portfolio for each student from approved data.
              </p>
            </div>
          </div>
        </div>
      </section> */}

      {/* Key Features Section */}
      <section className="py-12 bg-[#ECFDF5]">
        <div className="max-w-6xl mx-auto px-6 text-center">
          <h2 className="text-3xl font-bold text-[#1F2937] mb-12">
            Key Features
          </h2>
          <div className="grid gap-8 md:grid-cols-2 lg:grid-cols-4">
            <div className="px-4 py-3 bg-white shadow-lg rounded-xl">
              <FiUser className="h-10 w-10 text-[#10B981] mx-auto mb-4" />
              <h3 className="text-xl font-semibold text-[#1F2937] mb-2">
                Student Dashboard
              </h3>
              <p className="text-[#4B5563]">
                Track grades, achievements, certificates, and career insights in
                real time.
              </p>
            </div>
            <div className="px-4 py-3 bg-white shadow-lg rounded-xl">
              <FiBookOpen className="h-10 w-10 text-[#10B981] mx-auto mb-4" />
              <h3 className="text-xl font-semibold text-[#1F2937] mb-2">
                Faculty Approvals
              </h3>
              <p className="text-[#4B5563]">
                Easily validate student submissions, attendance, and performance
                data.
              </p>
            </div>
            <div className="px-4 py-3 bg-white shadow-lg rounded-xl">
              <FiShield className="h-10 w-10 text-[#10B981] mx-auto mb-4" />
              <h3 className="text-xl font-semibold text-[#1F2937] mb-2">
                Admin Reports
              </h3>
              <p className="text-[#4B5563]">
                Generate NAAC/NIRF-ready reports and manage institute-level
                insights.
              </p>
            </div>
            <div className="px-4 py-3 bg-white shadow-lg rounded-xl">
              <FiTrendingUp className="h-10 w-10 text-[#10B981] mx-auto mb-4" />
              <h3 className="text-xl font-semibold text-[#1F2937] mb-2">
                Portfolio Auto-Generation
              </h3>
              <p className="text-[#4B5563]">
                Automatically build a verified professional portfolio for each
                student from approved data.
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* How It Works Section */}
      <section className="py-12">
        <div className="max-w-6xl mx-auto px-6 text-center">
          <h2 className="text-3xl font-bold text-[#1F2937] mb-12">
            How It Works
          </h2>
          <div className="grid gap-8 md:grid-cols-3">
            <div className="p-6">
              <FiCheckCircle className="h-12 w-12 text-[#10B981] mx-auto mb-4" />
              <h3 className="text-xl font-semibold text-[#1F2937]">
                Step 1: Student Uploads
              </h3>
              <p className="text-[#4B5563]">
                Students upload certificates, achievements, and activity
                records.
              </p>
            </div>
            <div className="p-6">
              <FiBookOpen className="h-12 w-12 text-[#10B981] mx-auto mb-4" />
              <h3 className="text-xl font-semibold text-[#1F2937]">
                Step 2: Faculty Validates
              </h3>
              <p className="text-[#4B5563]">
                Faculty review and validate uploaded data for accuracy.
              </p>
            </div>
            <div className="p-6">
              <FiBarChart2 className="h-12 w-12 text-[#10B981] mx-auto mb-4" />
              <h3 className="text-xl font-semibold text-[#1F2937]">
                Step 3: Admin Generates Reports
              </h3>
              <p className="text-[#4B5563]">
                Admins generate data-driven reports and dashboards instantly.
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* AI + Leaderboard Section */}
      {/* <section className="py-20 bg-[#ECFDF5]">
        <div className="max-w-6xl mx-auto px-6 text-center">
          <h2 className="text-3xl font-bold text-[#1F2937] mb-12">AI Career Guidance & Leaderboard</h2>
          <p className="text-lg text-[#4B5563] max-w-3xl mx-auto mb-10">
            Our AI analyzes achievements to recommend career tracks and generates a gamified leaderboard 
            so students stay motivated through credits and rankings.
          </p>
          <div className="flex flex-col sm:flex-row justify-center gap-6">
            <div className="p-6 bg-white shadow-lg rounded-xl flex-1">
              <FiTrendingUp className="h-10 w-10 text-[#10B981] mx-auto mb-4" />
              <h3 className="text-xl font-semibold text-[#1F2937] mb-2">Career Insights</h3>
              <p className="text-[#4B5563]">Personalized AI-powered recommendations on future career paths.</p>
            </div>

            
            <div className="p-6 bg-white shadow-lg rounded-xl flex-1">
              <FiBarChart2 className="h-10 w-10 text-[#10B981] mx-auto mb-4" />
              <h3 className="text-xl font-semibold text-[#1F2937] mb-2">Leaderboard System</h3>
              <p className="text-[#4B5563]">Track achievements and compete with peers using a credit-based ranking system.</p>
            </div>
          </div>
        </div>
      </section> */}

      {/* AI + Portfolio + Leaderboard Section */}
      <section className="py-12 bg-[#ECFDF5]">
        <div className="max-w-6xl mx-auto px-6 text-center">
          <h2 className="text-3xl font-bold text-[#1F2937] mb-12">
            AI Career Tools, Portfolio & Leaderboard
          </h2>
          <p className="text-lg text-[#4B5563] max-w-3xl mx-auto mb-10">
            Our AI analyzes achievements to recommend career tracks,
            automatically builds professional portfolios, and generates a
            gamified leaderboard so students stay motivated through credits and
            rankings.
          </p>

          <div className="grid gap-8 md:grid-cols-3">
            {/* Career Insights */}
            <div className="p-6 bg-white shadow-lg rounded-xl">
              <FiTrendingUp className="h-10 w-10 text-[#10B981] mx-auto mb-4" />
              <h3 className="text-xl font-semibold text-[#1F2937] mb-2">
                Career Insights
              </h3>
              <p className="text-[#4B5563]">
                Personalized AI-powered recommendations on future career paths.
              </p>
            </div>

            {/* Portfolio Auto-Generation */}
            <div className="p-6 bg-white shadow-lg rounded-xl">
              <FiCheckCircle className="h-10 w-10 text-[#10B981] mx-auto mb-4" />
              <h3 className="text-xl font-semibold text-[#1F2937] mb-2">
                Portfolio Auto-Generation
              </h3>
              <p className="text-[#4B5563]">
                Instantly create a professional portfolio from validated
                achievements, ready to share with employers and recruiters.
              </p>
            </div>

            {/* Leaderboard System */}
            <div className="p-6 bg-white shadow-lg rounded-xl">
              <FiBarChart2 className="h-10 w-10 text-[#10B981] mx-auto mb-4" />
              <h3 className="text-xl font-semibold text-[#1F2937] mb-2">
                Leaderboard System
              </h3>
              <p className="text-[#4B5563]">
                Track achievements and compete with peers using a credit-based
                ranking system.
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* Impact Section */}
      <section className="py-12">
        <div className="max-w-6xl mx-auto px-6 text-center">
          <h2 className="text-3xl font-bold text-[#1F2937] mb-12">
            For Institutions
          </h2>
          <p className="text-lg text-[#4B5563] max-w-3xl mx-auto mb-10">
            Simplify accreditation processes and unlock deep insights into
            student performance.
          </p>
          <div className="grid gap-8 md:grid-cols-3">
            <div className="p-6 bg-white shadow-lg rounded-xl">
              <h3 className="text-xl font-semibold text-[#1F2937] mb-2">
                Accreditation-Ready
              </h3>
              <p className="text-[#4B5563]">
                Generate instant NAAC/NIRF-ready reports with verified student
                data.
              </p>
            </div>
            <div className="p-6 bg-white shadow-lg rounded-xl">
              <h3 className="text-xl font-semibold text-[#1F2937] mb-2">
                Data-Driven Insights
              </h3>
              <p className="text-[#4B5563]">
                Make informed decisions based on analytics and trends across
                departments.
              </p>
            </div>
            <div className="p-6 bg-white shadow-lg rounded-xl">
              <h3 className="text-xl font-semibold text-[#1F2937] mb-2">
                Reduced Paperwork
              </h3>
              <p className="text-[#4B5563]">
                Automate certificate validation and reporting, saving time for
                faculty & staff.
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* Final CTA */}
      <section className="py-20 bg-[#10B981] text-white text-center">
        <h2 className="text-3xl md:text-4xl font-bold mb-6">
          Join the Future of Student Achievement Management
        </h2>
        <p className="text-lg max-w-2xl mx-auto mb-8">
          Start today and empower your institution with smarter, faster, and
          more impactful solutions.
        </p>
        <div className="flex flex-col sm:flex-row justify-center gap-4">
          <button
            onClick={() => navigate("/auth/signup")}
            className="px-6 py-3 bg-white text-[#10B981] rounded-lg font-semibold hover:bg-gray-100"
          >
            Get Started
          </button>
          <button
            onClick={() => navigate("/contact")}
            className="px-6 py-3 border-2 border-white text-white rounded-lg font-semibold hover:bg-[#059669]"
          >
            Contact Us
          </button>
        </div>
      </section>
    </div>
  );
};

export default Home;
