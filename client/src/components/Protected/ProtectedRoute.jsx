import { Outlet, useNavigate } from "react-router-dom";
import { useAuth } from "../../contexts/AuthContext";
import { motion } from "framer-motion";
import { FiLoader, FiAlertCircle, FiLock } from "react-icons/fi";
import { useEffect } from "react";

const ProtectedRoute = ({ role = null }) => {
  const { user, loading } = useAuth();
  const navigate = useNavigate();

  // 🔄 Redirect after delay if not logged in or wrong role
  useEffect(() => {
    if (!loading && !user) {
      const timer = setTimeout(() => {
        navigate("/auth/login", { replace: true });
      }, 3000);

      return () => clearTimeout(timer);
    }

    if (!loading && user && role && user.role !== role) {
      const timer = setTimeout(() => {
        navigate("/unauthorized", { replace: true });
      }, 3000);

      return () => clearTimeout(timer);
    }
  }, [loading, user, role, navigate]);

  // Show loading state
  if (loading) {
    return (
      <div className="min-h-screen bg-gray-900 flex items-center justify-center p-4">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5 }}
          className="bg-gray-800 p-8 rounded-xl shadow-2xl w-full max-w-md text-center"
        >
          <div className="inline-flex items-center justify-center w-16 h-16 bg-purple-500/20 rounded-full mb-4">
            <FiLoader className="h-8 w-8 text-purple-500 animate-spin" />
          </div>
          <h2 className="text-2xl font-bold text-white mb-4">
            Checking Access
          </h2>
          <p className="text-gray-400">Verifying your permissions...</p>
        </motion.div>
      </div>
    );
  }

  // If no user, show access denied
  if (!user) {
    return (
      <div className="min-h-screen bg-gray-900 flex items-center justify-center p-4">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5 }}
          className="bg-gray-800 p-8 rounded-xl shadow-2xl w-full max-w-md text-center"
        >
          <div className="inline-flex items-center justify-center w-16 h-16 bg-red-500/20 rounded-full mb-4">
            <FiAlertCircle className="h-8 w-8 text-red-500" />
          </div>
          <h2 className="text-2xl font-bold text-white mb-4">Access Denied</h2>
          <p className="text-gray-400 mb-6">
            You need to be logged in to access this page.
          </p>
          <p className="text-gray-500 text-sm mb-4">
            Redirecting you to the login page...
          </p>
        </motion.div>
      </div>
    );
  }

  // If user exists but doesn't have the required role
  if (role && user.role !== role) {
    return (
      <div className="min-h-screen bg-gray-900 flex items-center justify-center p-4">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5 }}
          className="bg-gray-800 p-8 rounded-xl shadow-2xl w-full max-w-md text-center"
        >
          <div className="inline-flex items-center justify-center w-16 h-16 bg-yellow-500/20 rounded-full mb-4">
            <FiLock className="h-8 w-8 text-yellow-500" />
          </div>
          <h2 className="text-2xl font-bold text-white mb-4">
            Insufficient Permissions
          </h2>
          <p className="text-gray-400 mb-6">
            You don't have the required role to access this page.
          </p>
          <p className="text-gray-500 text-sm mb-4">
            Required role:{" "}
            <span className="font-medium text-yellow-500">{role}</span>
          </p>
          <p className="text-gray-500 text-sm">
            Your role:{" "}
            <span className="font-medium text-purple-500">{user.role}</span>
          </p>
          <p className="text-gray-500 text-sm mt-4">
            Redirecting you to an appropriate page...
          </p>
        </motion.div>
      </div>
    );
  }

  // ✅ User is authenticated and authorized
  return <Outlet />;
};

export default ProtectedRoute;
