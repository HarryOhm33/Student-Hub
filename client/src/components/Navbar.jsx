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
import logo from "../assets/logo.png";

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
        {
          path: "/student-search",
          label: "Student Search",
          icon: <FiGrid className="h-5 w-5" />,
        },
      ];
    }

    if (user) {
      // User is authenticated
      return [
        { path: "/", label: "Home", icon: <FiHome className="h-5 w-5" /> },
        {
          path: "/student-search",
          label: "Student Search",
          icon: <FiGrid className="h-5 w-5" />,
        },
        {
          path: getRoleBasedPath(),
          label: "Dashboard",
          icon: <FiGrid className="h-5 w-5" />,
        },
      ];
    }

    // User is not authenticated
    return [
      { path: "/", label: "Home", icon: <FiHome className="h-5 w-5" /> },
      {
        path: "/student-search",
        label: "Student Search",
        icon: <FiGrid className="h-5 w-5" />,
      },
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
    <nav className="bg-white border-b border-gray-200 shadow-sm relative sticky top-0 z-40">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex justify-between h-16">
          {/* Logo/Brand */}
          <div className="flex items-center">
            <Link
              to="/"
              className="flex-shrink-0 flex items-center text-xl font-bold"
            >
              {/* Logo Image */}
              <img
                src={logo}
                alt="Logo"
                className="h-10 w-auto object-contain"
              />
              {/* Brand Name */}
              <span className="ml-2 bg-gradient-to-r from-green-600 to-emerald-500 bg-clip-text text-transparent hidden sm:block">
                Pratibha-Kosh
              </span>
            </Link>
          </div>

          {/* Desktop Navigation */}
          <div className="hidden md:flex items-center space-x-1">
            {navItems.map((item) => (
              <motion.div
                key={item.path}
                whileHover={{ y: -2 }}
                whileTap={{ scale: 0.98 }}
              >
                <Link
                  to={item.path}
                  className={`flex items-center px-3 py-2 rounded-md text-sm font-medium transition-all duration-200 ${
                    location.pathname === item.path
                      ? "text-white bg-gradient-to-r from-green-600 to-emerald-500 shadow-md"
                      : "text-gray-600 hover:text-emerald-600 hover:bg-emerald-50"
                  }`}
                >
                  <span className="mr-1.5">{item.icon}</span>
                  {item.label}
                </Link>
              </motion.div>
            ))}

            {/* Show logout button only when user is authenticated and not loading */}
            {user && !loading && (
              <motion.button
                whileHover={{ y: -2 }}
                whileTap={{ scale: 0.98 }}
                onClick={handleLogout}
                className="flex items-center px-3 py-2 rounded-md text-sm font-medium text-gray-600 hover:text-red-600 hover:bg-red-50 transition-all duration-200 ml-2"
              >
                <FiLogOut className="h-5 w-5 mr-1.5" />
                Logout
              </motion.button>
            )}

            {/* Show loading indicator during authentication */}
            {loading && (
              <div className="flex items-center text-gray-500 px-3 py-2 ml-2">
                <FiLoader className="h-5 w-5 animate-spin mr-2" />
                <span className="text-sm">Loading...</span>
              </div>
            )}
          </div>

          {/* User status indicator for desktop */}
          {/* <div className="hidden md:flex items-center ml-4 pl-4 border-l border-gray-200">
            {user && !loading ? (
              <div className="flex items-center">
                <div className="h-8 w-8 rounded-full bg-emerald-100 flex items-center justify-center">
                  <span className="text-emerald-700 font-medium text-sm">
                    {user.role?.charAt(0).toUpperCase()}
                  </span>
                </div>
                <div className="ml-2">
                  <p className="text-xs text-gray-500">Logged in as</p>
                  <p className="text-sm font-medium text-gray-800 capitalize">
                    {user.role}
                  </p>
                </div>
              </div>
            ) : (
              !loading && (
                <div className="text-sm text-gray-500">Guest User</div>
              )
            )}
          </div> */}

          {/* Mobile menu button */}
          <div className="md:hidden flex items-center">
            {user && !loading && (
              <div className="h-8 w-8 rounded-full bg-emerald-100 flex items-center justify-center mr-3">
                <span className="text-emerald-700 font-medium text-sm">
                  {user.role?.charAt(0).toUpperCase()}
                </span>
              </div>
            )}
            <motion.button
              whileTap={{ scale: 0.95 }}
              onClick={toggleMobileMenu}
              className="inline-flex items-center justify-center p-2 rounded-md text-gray-600 hover:text-emerald-600 hover:bg-emerald-50 focus:outline-none transition-colors"
              aria-expanded="false"
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

      {/* Mobile Navigation */}
      <AnimatePresence>
        {isMobileMenuOpen && (
          <div className="fixed inset-0 z-50 md:hidden mt-16">
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              transition={{ duration: 0.2 }}
              className="fixed inset-0 bg-black bg-opacity-10"
              onClick={closeMobileMenu}
            ></motion.div>

            <motion.div
              ref={mobileMenuRef}
              initial={{ opacity: 0, x: 300 }}
              animate={{ opacity: 1, x: 0 }}
              exit={{ opacity: 0, x: 300 }}
              transition={{ type: "spring", damping: 25, stiffness: 300 }}
              className="absolute top-0 right-0 bg-white w-64 h-full shadow-xl overflow-y-auto"
            >
              <div className="flex items-center justify-between p-4 border-b border-gray-200">
                <div className="flex items-center">
                  {user && !loading ? (
                    <>
                      <div className="h-10 w-10 rounded-full bg-emerald-100 flex items-center justify-center">
                        <span className="text-emerald-700 font-medium">
                          {user.role?.charAt(0).toUpperCase()}
                        </span>
                      </div>
                      <div className="ml-3">
                        <p className="text-xs text-gray-500">Logged in as</p>
                        <p className="text-sm font-medium text-gray-800 capitalize">
                          {user.role}
                        </p>
                      </div>
                    </>
                  ) : (
                    <p className="text-sm font-medium text-gray-800">
                      Guest User
                    </p>
                  )}
                </div>
                <button
                  onClick={closeMobileMenu}
                  className="p-1 rounded-md text-gray-400 hover:text-gray-600"
                >
                  <FiX className="h-5 w-5" />
                </button>
              </div>

              <div className="py-2 px-3">
                {navItems.map((item) => (
                  <motion.div key={item.path} whileTap={{ scale: 0.98 }}>
                    <Link
                      to={item.path}
                      onClick={closeMobileMenu}
                      className={`flex items-center px-4 py-3 rounded-md text-sm transition-all my-1 ${
                        location.pathname === item.path
                          ? "text-white bg-gradient-to-r from-green-600 to-emerald-500 shadow-md"
                          : "text-gray-600 hover:bg-emerald-50 hover:text-emerald-700"
                      }`}
                    >
                      <span className="mr-3">{item.icon}</span>
                      {item.label}
                    </Link>
                  </motion.div>
                ))}

                {/* Show logout button only when user is authenticated and not loading */}
                {user && !loading && (
                  <motion.div whileTap={{ scale: 0.98 }}>
                    <button
                      onClick={handleLogout}
                      className="w-full flex items-center px-4 py-3 rounded-md text-sm text-gray-600 hover:bg-red-50 hover:text-red-700 transition-all my-1"
                    >
                      <FiLogOut className="h-5 w-5 mr-3" />
                      Logout
                    </button>
                  </motion.div>
                )}

                {/* Show loading indicator during authentication */}
                {loading && (
                  <div className="flex items-center px-4 py-3 text-sm text-gray-500">
                    <FiLoader className="h-5 w-5 animate-spin mr-3" />
                    Loading...
                  </div>
                )}
              </div>
            </motion.div>
          </div>
        )}
      </AnimatePresence>
    </nav>
  );
};

export default Navbar;
