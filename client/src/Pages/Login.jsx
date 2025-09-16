import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { useAuth } from "../contexts/AuthContext";
import { motion } from "framer-motion";
import {
  FiMail,
  FiLock,
  FiArrowRight,
  FiLogIn,
  FiEye,
  FiEyeOff,
  FiUser,
  FiBook,
  FiAward,
} from "react-icons/fi";

const Login = () => {
  const [activeTab, setActiveTab] = useState("admin");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [employeeId, setEmployeeId] = useState("");
  const [registrationNumber, setRegistrationNumber] = useState("");
  const [showPassword, setShowPassword] = useState(false);
  const { login, loading } = useAuth();
  const navigate = useNavigate();

  const handleLogin = async (e) => {
    e.preventDefault();

    let identifier, role;

    switch (activeTab) {
      case "admin":
        identifier = email;
        role = "admin";
        break;
      case "faculty":
        identifier = employeeId;
        role = "faculty";
        break;
      case "student":
        identifier = registrationNumber;
        role = "student";
        break;
      default:
        identifier = email;
        role = "admin";
    }

    await login(identifier, password, role);
  };

  const togglePasswordVisibility = () => {
    setShowPassword(!showPassword);
  };

  const renderInputFields = () => {
    switch (activeTab) {
      case "admin":
        return (
          <motion.div
            initial={{ opacity: 0, x: -10 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.3 }}
            className="relative"
          >
            <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
              <FiMail className="h-5 w-5 text-gray-500" />
            </div>
            <input
              className="pl-10 w-full px-4 py-3 bg-white border border-gray-300 rounded-lg text-gray-800 placeholder-gray-500 focus:outline-none focus:ring-2 focus:ring-green-500 focus:border-transparent transition-colors"
              placeholder="Email Address"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              required
            />
          </motion.div>
        );
      case "faculty":
        return (
          <motion.div
            initial={{ opacity: 0, x: -10 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.3 }}
            className="relative"
          >
            <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
              <FiUser className="h-5 w-5 text-gray-500" />
            </div>
            <input
              className="pl-10 w-full px-4 py-3 bg-white border border-gray-300 rounded-lg text-gray-800 placeholder-gray-500 focus:outline-none focus:ring-2 focus:ring-green-500 focus:border-transparent transition-colors"
              placeholder="Employee ID"
              value={employeeId}
              onChange={(e) => setEmployeeId(e.target.value)}
              required
            />
          </motion.div>
        );
      case "student":
        return (
          <motion.div
            initial={{ opacity: 0, x: -10 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.3 }}
            className="relative"
          >
            <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
              <FiAward className="h-5 w-5 text-gray-500" />
            </div>
            <input
              className="pl-10 w-full px-4 py-3 bg-white border border-gray-300 rounded-lg text-gray-800 placeholder-gray-500 focus:outline-none focus:ring-2 focus:ring-green-500 focus:border-transparent transition-colors"
              placeholder="Registration Number"
              value={registrationNumber}
              onChange={(e) => setRegistrationNumber(e.target.value)}
              required
            />
          </motion.div>
        );
      default:
        return null;
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-green-50 to-gray-100 flex items-center justify-center p-4">
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5 }}
        className="bg-white p-8 rounded-xl shadow-lg w-full max-w-md border border-gray-100"
      >
        <div className="text-center mb-8">
          <motion.div
            initial={{ scale: 0 }}
            animate={{ scale: 1 }}
            transition={{ delay: 0.2, type: "spring", stiffness: 200 }}
            className="inline-flex items-center justify-center w-16 h-16 bg-gradient-to-r from-green-500 to-green-600 rounded-full mb-4"
          >
            <FiLogIn className="h-8 w-8 text-white" />
          </motion.div>
          <h1 className="text-3xl font-bold text-gray-800 mb-2">
            Welcome Back
          </h1>
          <p className="text-gray-600">Sign in to continue to your account</p>
        </div>

        {/* Role Selection Tabs */}
        <div className="flex bg-gray-100 rounded-lg p-1 mb-6">
          {["admin", "faculty", "student"].map((role) => (
            <motion.button
              key={role}
              whileHover={{ scale: 1.02 }}
              whileTap={{ scale: 0.98 }}
              className={`flex-1 py-2 px-4 rounded-md text-sm font-medium transition-all duration-200 ${
                activeTab === role
                  ? "bg-green-600 text-white shadow-md"
                  : "text-gray-600 hover:text-green-700"
              }`}
              onClick={() => setActiveTab(role)}
            >
              <div className="flex items-center justify-center gap-1">
                {role === "admin" && <FiUser className="h-4 w-4" />}
                {role === "faculty" && <FiBook className="h-4 w-4" />}
                {role === "student" && <FiAward className="h-4 w-4" />}
                {role.charAt(0).toUpperCase() + role.slice(1)}
              </div>
            </motion.button>
          ))}
        </div>

        <form onSubmit={handleLogin} className="space-y-6">
          <div className="space-y-4">
            {renderInputFields()}

            <motion.div
              initial={{ opacity: 0, x: -10 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ duration: 0.3, delay: 0.1 }}
              className="relative"
            >
              <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                <FiLock className="h-5 w-5 text-gray-500" />
              </div>
              <input
                type={showPassword ? "text" : "password"}
                className="pl-10 pr-10 w-full px-4 py-3 bg-white border border-gray-300 rounded-lg text-gray-800 placeholder-gray-500 focus:outline-none focus:ring-2 focus:ring-green-500 focus:border-transparent transition-colors"
                placeholder="Password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                required
              />
              <button
                type="button"
                className="absolute inset-y-0 right-0 pr-3 flex items-center text-gray-500 hover:text-gray-700 transition-colors"
                onClick={togglePasswordVisibility}
              >
                {showPassword ? (
                  <FiEyeOff className="h-5 w-5" />
                ) : (
                  <FiEye className="h-5 w-5" />
                )}
              </button>
            </motion.div>
          </div>

          <motion.button
            whileHover={{ scale: 1.02 }}
            whileTap={{ scale: 0.98 }}
            type="submit"
            disabled={loading}
            className="w-full bg-gradient-to-r from-green-500 to-green-600 text-white py-3 rounded-lg font-semibold flex items-center justify-center gap-2 hover:from-green-600 hover:to-green-700 transition-all shadow-md disabled:opacity-50 disabled:cursor-not-allowed"
          >
            {loading ? (
              <div className="w-5 h-5 border-2 border-white border-t-transparent rounded-full animate-spin"></div>
            ) : (
              <>
                Sign In <FiArrowRight className="h-5 w-5" />
              </>
            )}
          </motion.button>
        </form>

        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 0.4 }}
          className="mt-6 text-center"
        >
          <p className="text-gray-600">
            Don't have an account?{" "}
            <button
              onClick={() => navigate("/auth/signup")}
              className="text-green-600 hover:text-green-700 font-medium transition-colors"
            >
              Sign Up
            </button>
          </p>
        </motion.div>

        {/* Demo Credentials */}
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 0.6 }}
          className="mt-6 p-4 bg-green-50 border border-green-200 rounded-lg text-sm text-gray-700"
        >
          <h3 className="font-semibold text-green-800 mb-2 text-center">
            Demo Credentials
          </h3>
          <div className="space-y-2">
            <div>
              <span className="font-medium text-green-700">Admin:</span>
              <p className="text-xs">Email: hari333333om@gmail.com</p>
              <p className="text-xs">Password: 1234</p>
            </div>
            <div>
              <span className="font-medium text-green-700">Faculty:</span>
              <p className="text-xs">Employee ID: EMPDCE1017290</p>
              <p className="text-xs">Password: 1234</p>
            </div>
            <div>
              <span className="font-medium text-green-700">Student:</span>
              <p className="text-xs">Registration No.: 23874111999</p>
              <p className="text-xs">Password: 1234</p>
            </div>
          </div>
        </motion.div>
      </motion.div>
    </div>
  );
};

export default Login;
