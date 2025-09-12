// src/components/Navbar.jsx
import { Link, useLocation, useNavigate } from "react-router-dom";
import { useAuth } from "../contexts/AuthContext";
import { motion, AnimatePresence } from "framer-motion";
import {
  FiHome,
  FiUser,
  FiLogIn,
  FiLogOut,
  FiLoader,
  FiMenu,
  FiX,
  FiGrid,
  FiBookOpen,
  FiShield,
} from "react-icons/fi";
import { useState, useRef, useEffect } from "react";

const Navbar = () => {
  const { user, logout, loading } = useAuth();
  const location = useLocation();
  const navigate = useNavigate();
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
  const mobileMenuRef = useRef(null);

  // Close mobile menu when clicking outside
  useEffect(() => {
    const handleClickOutside = (event) => {
      if (
        mobileMenuRef.current &&
        !mobileMenuRef.current.contains(event.target)
      ) {
        setIsMobileMenuOpen(false);
      }
    };

    document.addEventListener("mousedown", handleClickOutside);
    return () => {
      document.removeEventListener("mousedown", handleClickOutside);
    };
  }, []);

  const toggleMobileMenu = () => {
    setIsMobileMenuOpen(!isMobileMenuOpen);
  };

  const closeMobileMenu = () => {
    setIsMobileMenuOpen(false);
  };

  const handleLogout = () => {
    logout();
    closeMobileMenu();
  };

  const getRoleBasedPath = () => {
    if (user?.role === "admin") return "/admin/dashboard";
    if (user?.role === "faculty") return "/faculty/dashboard";
    if (user?.role === "student") return "/student/dashboard";
    return "/auth/login";
  };

  // Navigation items based on authentication state
  const getNavItems = () => {
    if (loading) {
      // Only show Home when loading
      return [
        { path: "/", label: "Home", icon: <FiHome className="h-5 w-5" /> },
      ];
    }

    if (user) {
      // User is authenticated
      return [
        { path: "/", label: "Home", icon: <FiHome className="h-5 w-5" /> },
        {
          path: getRoleBasedPath(),
          label: "Dashboard",
          icon: <FiGrid className="h-5 w-5" />,
        },
        // {
        //   path: "/profile",
        //   label: "Profile",
        //   icon: <FiUser className="h-5 w-5" />,
        // },
      ];
    }

    // User is not authenticated
    return [
      { path: "/", label: "Home", icon: <FiHome className="h-5 w-5" /> },
      {
        path: "/auth/signup",
        label: "Signup",
        icon: <FiUser className="h-5 w-5" />,
      },
      {
        path: "/auth/login",
        label: "Login",
        icon: <FiLogIn className="h-5 w-5" />,
      },
    ];
  };

  const navItems = getNavItems();

  return (
    <nav className="bg-white border-b border-gray-200 shadow-sm relative">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex justify-between h-16">
          {/* Logo/Brand */}
          <div className="flex items-center">
            <Link
              to="/"
              className="flex-shrink-0 flex items-center text-xl font-bold"
            >
              <span className="bg-gradient-to-r from-green-600 to-emerald-500 bg-clip-text text-transparent">
                Achievo
              </span>
            </Link>
          </div>

          {/* Desktop Navigation */}
          <div className="hidden md:flex items-center space-x-2">
            {navItems.map((item) => (
              <motion.div
                key={item.path}
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.95 }}
              >
                <Link
                  to={item.path}
                  className={`flex items-center px-3 py-2 rounded-md text-sm font-medium transition-colors ${
                    location.pathname === item.path
                      ? "text-white bg-green-600"
                      : "text-gray-700 hover:text-green-600 hover:bg-green-50"
                  }`}
                >
                  <span className="mr-1">{item.icon}</span>
                  {item.label}
                </Link>
              </motion.div>
            ))}

            {/* Show logout button only when user is authenticated and not loading */}
            {user && !loading && (
              <motion.button
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.95 }}
                onClick={handleLogout}
                className="flex items-center px-3 py-2 rounded-md text-sm font-medium text-gray-700 hover:text-green-600 hover:bg-green-50 transition-colors"
              >
                <FiLogOut className="h-5 w-5 mr-1" />
                Logout
              </motion.button>
            )}

            {/* Show loading indicator during authentication */}
            {loading && (
              <div className="flex items-center text-gray-500 px-3 py-2">
                <FiLoader className="h-5 w-5 animate-spin mr-2" />
                Authenticating...
              </div>
            )}

            {/* Role-based quick access buttons */}
            {/* {!user && !loading && (
              <div className="flex items-center space-x-2 ml-4 pl-4 border-l border-gray-200">
                <motion.button
                  whileHover={{ scale: 1.05 }}
                  whileTap={{ scale: 0.95 }}
                  onClick={() => navigate("/auth/login?role=student")}
                  className="flex items-center px-3 py-2 rounded-md text-sm font-medium text-white bg-green-600 hover:bg-green-700 transition-colors"
                >
                  <FiUser className="h-4 w-4 mr-1" />
                  Student
                </motion.button>
                <motion.button
                  whileHover={{ scale: 1.05 }}
                  whileTap={{ scale: 0.95 }}
                  onClick={() => navigate("/auth/login?role=faculty")}
                  className="flex items-center px-3 py-2 rounded-md text-sm font-medium text-white bg-green-600 hover:bg-green-700 transition-colors"
                >
                  <FiBookOpen className="h-4 w-4 mr-1" />
                  Faculty
                </motion.button>
                <motion.button
                  whileHover={{ scale: 1.05 }}
                  whileTap={{ scale: 0.95 }}
                  onClick={() => navigate("/auth/login?role=admin")}
                  className="flex items-center px-3 py-2 rounded-md text-sm font-medium text-white bg-green-600 hover:bg-green-700 transition-colors"
                >
                  <FiShield className="h-4 w-4 mr-1" />
                  Admin
                </motion.button>
              </div>
            )} */}
          </div>

          {/* Mobile menu button */}
          <div className="md:hidden flex items-center">
            <motion.button
              whileTap={{ scale: 0.95 }}
              onClick={toggleMobileMenu}
              className="inline-flex items-center justify-center p-2 rounded-md text-gray-600 hover:text-green-600 hover:bg-green-50 focus:outline-none"
            >
              {isMobileMenuOpen ? (
                <FiX className="block h-6 w-6" />
              ) : (
                <FiMenu className="block h-6 w-6" />
              )}
            </motion.button>
          </div>
        </div>
      </div>

      {/* Mobile Navigation - Positioned in top right corner */}
      <AnimatePresence>
        {isMobileMenuOpen && (
          <div className="absolute top-full right-0 z-50 md:hidden">
            <motion.div
              ref={mobileMenuRef}
              initial={{ opacity: 0, scale: 0.95, y: -10 }}
              animate={{ opacity: 1, scale: 1, y: 0 }}
              exit={{ opacity: 0, scale: 0.95, y: -10 }}
              transition={{ duration: 0.15 }}
              className="bg-white border border-gray-200 rounded-lg shadow-xl w-56 mt-1 mr-2 overflow-hidden"
            >
              <div className="py-1">
                {navItems.map((item) => (
                  <motion.div
                    key={item.path}
                    whileHover={{ backgroundColor: "#f0fdf4" }}
                  >
                    <Link
                      to={item.path}
                      onClick={closeMobileMenu}
                      className={`flex items-center px-4 py-3 text-sm transition-colors ${
                        location.pathname === item.path
                          ? "text-white bg-green-600"
                          : "text-gray-700 hover:text-green-600"
                      }`}
                    >
                      <span className="mr-2">{item.icon}</span>
                      {item.label}
                    </Link>
                  </motion.div>
                ))}

                {/* Show logout button only when user is authenticated and not loading */}
                {user && !loading && (
                  <motion.div whileHover={{ backgroundColor: "#f0fdf4" }}>
                    <button
                      onClick={handleLogout}
                      className="w-full flex items-center px-4 py-3 text-sm text-gray-700 hover:text-green-600 transition-colors"
                    >
                      <FiLogOut className="h-5 w-5 mr-2" />
                      Logout
                    </button>
                  </motion.div>
                )}

                {/* Show loading indicator during authentication */}
                {loading && (
                  <div className="flex items-center px-4 py-3 text-sm text-gray-500">
                    <FiLoader className="h-5 w-5 animate-spin mr-2" />
                    Authenticating...
                  </div>
                )}

                {/* Role-based quick access buttons for mobile */}
                {/* {!user && !loading && (
                  <div className="border-t border-gray-100 pt-2 mt-2">
                    <div className="px-2 space-y-1">
                      <motion.button
                        whileHover={{ backgroundColor: "#f0fdf4" }}
                        onClick={() => {
                          navigate("/auth/login?role=student");
                          closeMobileMenu();
                        }}
                        className="w-full flex items-center px-3 py-2 rounded text-sm text-gray-700 hover:text-green-600 transition-colors"
                      >
                        <FiUser className="h-4 w-4 mr-2" />
                        Student Login
                      </motion.button>
                      <motion.button
                        whileHover={{ backgroundColor: "#f0fdf4" }}
                        onClick={() => {
                          navigate("/auth/login?role=faculty");
                          closeMobileMenu();
                        }}
                        className="w-full flex items-center px-3 py-2 rounded text-sm text-gray-700 hover:text-green-600 transition-colors"
                      >
                        <FiBookOpen className="h-4 w-4 mr-2" />
                        Faculty Login
                      </motion.button>
                      <motion.button
                        whileHover={{ backgroundColor: "#f0fdf4" }}
                        onClick={() => {
                          navigate("/auth/login?role=admin");
                          closeMobileMenu();
                        }}
                        className="w-full flex items-center px-3 py-2 rounded text-sm text-gray-700 hover:text-green-600 transition-colors"
                      >
                        <FiShield className="h-4 w-4 mr-2" />
                        Admin Login
                      </motion.button>
                    </div>
                  </div>
                )} */}
              </div>
            </motion.div>
          </div>
        )}
      </AnimatePresence>
    </nav>
  );
};

export default Navbar;
