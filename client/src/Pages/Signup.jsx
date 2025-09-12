import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { useAuth } from "../contexts/AuthContext";
import { motion } from "framer-motion";
import {
  FiUser,
  FiMail,
  FiLock,
  FiArrowRight,
  FiEye,
  FiEyeOff,
} from "react-icons/fi";

const Signup = () => {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [name, setName] = useState("");
  const [instituteName, setInstituteName] = useState("");
  const [instituteEmail, setInstituteEmail] = useState("");
  const [showPassword, setShowPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);
  const { signup, loading } = useAuth();
  const navigate = useNavigate();

  const handleSubmit = async (e) => {
    e.preventDefault();

    if (password !== confirmPassword) {
      alert("Passwords don't match!");
      return;
    }

    await signup(name, email, password, instituteName, instituteEmail);
  };

  const togglePasswordVisibility = () => {
    setShowPassword(!showPassword);
  };

  const toggleConfirmPasswordVisibility = () => {
    setShowConfirmPassword(!showConfirmPassword);
  };

  return (
    <div className="min-h-screen bg-[#F9FAFB] flex items-center justify-center p-4">
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5 }}
        className="bg-white p-8 rounded-xl shadow-2xl w-full max-w-md border border-gray-200"
      >
        <div className="text-center mb-8">
          <h1 className="text-3xl font-bold text-[#1F2937] mb-2">
            Create Account
          </h1>
          <p className="text-[#4B5563]">Join us and start your journey</p>
        </div>

        <form onSubmit={handleSubmit} className="space-y-6">
          <div className="space-y-4">
            <div className="relative">
              <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                <FiUser className="h-5 w-5 text-[#4B5563]" />
              </div>
              <input
                className="pl-10 w-full px-4 py-3 bg-white border border-gray-300 rounded-lg text-[#1F2937] placeholder-[#9CA3AF] focus:outline-none focus:ring-2 focus:ring-[#10B981] focus:border-transparent"
                placeholder="Full Name"
                onChange={(e) => setName(e.target.value)}
                required
              />
            </div>

            <div className="relative">
              <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                <FiMail className="h-5 w-5 text-[#4B5563]" />
              </div>
              <input
                type="email"
                className="pl-10 w-full px-4 py-3 bg-white border border-gray-300 rounded-lg text-[#1F2937] placeholder-[#9CA3AF] focus:outline-none focus:ring-2 focus:ring-[#10B981] focus:border-transparent"
                placeholder="Email Address"
                onChange={(e) => setEmail(e.target.value)}
                required
              />
            </div>

            {/* Institute Name */}
            <div className="relative">
              <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                <FiUser className="h-5 w-5 text-[#4B5563]" />
              </div>
              <input
                className="pl-10 w-full px-4 py-3 bg-white border border-gray-300 rounded-lg text-[#1F2937] placeholder-[#9CA3AF] focus:outline-none focus:ring-2 focus:ring-[#10B981] focus:border-transparent"
                placeholder="Institute Name"
                onChange={(e) => setInstituteName(e.target.value)}
                required
              />
            </div>

            {/* Institute Email */}
            <div className="relative">
              <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                <FiMail className="h-5 w-5 text-[#4B5563]" />
              </div>
              <input
                type="email"
                className="pl-10 w-full px-4 py-3 bg-white border border-gray-300 rounded-lg text-[#1F2937] placeholder-[#9CA3AF] focus:outline-none focus:ring-2 focus:ring-[#10B981] focus:border-transparent"
                placeholder="Institute Email"
                onChange={(e) => setInstituteEmail(e.target.value)}
                required
              />
            </div>

            <div className="relative">
              <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                <FiLock className="h-5 w-5 text-[#4B5563]" />
              </div>
              <input
                type={showPassword ? "text" : "password"}
                className="pl-10 pr-10 w-full px-4 py-3 bg-white border border-gray-300 rounded-lg text-[#1F2937] placeholder-[#9CA3AF] focus:outline-none focus:ring-2 focus:ring-[#10B981] focus:border-transparent"
                placeholder="Password"
                onChange={(e) => setPassword(e.target.value)}
                required
              />
              <button
                type="button"
                className="absolute inset-y-0 right-0 pr-3 flex items-center"
                onClick={togglePasswordVisibility}
              >
                {showPassword ? (
                  <FiEyeOff className="h-5 w-5 text-[#4B5563]" />
                ) : (
                  <FiEye className="h-5 w-5 text-[#4B5563]" />
                )}
              </button>
            </div>

            <div className="relative">
              <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                <FiLock className="h-5 w-5 text-[#4B5563]" />
              </div>
              <input
                type={showConfirmPassword ? "text" : "password"}
                className="pl-10 pr-10 w-full px-4 py-3 bg-white border border-gray-300 rounded-lg text-[#1F2937] placeholder-[#9CA3AF] focus:outline-none focus:ring-2 focus:ring-[#10B981] focus:border-transparent"
                placeholder="Confirm Password"
                onChange={(e) => setConfirmPassword(e.target.value)}
                required
              />
              <button
                type="button"
                className="absolute inset-y-0 right-0 pr-3 flex items-center"
                onClick={toggleConfirmPasswordVisibility}
              >
                {showConfirmPassword ? (
                  <FiEyeOff className="h-5 w-5 text-[#4B5563]" />
                ) : (
                  <FiEye className="h-5 w-5 text-[#4B5563]" />
                )}
              </button>
            </div>
          </div>

          <motion.button
            whileHover={{ scale: 1.02 }}
            whileTap={{ scale: 0.98 }}
            type="submit"
            disabled={loading}
            className="w-full bg-[#10B981] hover:bg-[#059669] text-white py-3 rounded-lg font-semibold flex items-center justify-center gap-2 shadow-md"
          >
            {loading ? (
              <div className="w-5 h-5 border-2 border-white border-t-transparent rounded-full animate-spin"></div>
            ) : (
              <>
                Sign Up <FiArrowRight className="h-5 w-5" />
              </>
            )}
          </motion.button>
        </form>

        <div className="mt-6 text-center">
          <p className="text-[#4B5563]">
            Already have an account?{" "}
            <button
              onClick={() => navigate("/auth/login")}
              className="text-[#10B981] hover:text-[#059669] font-medium"
            >
              Log In
            </button>
          </p>
        </div>
      </motion.div>
    </div>
  );
};

export default Signup;
