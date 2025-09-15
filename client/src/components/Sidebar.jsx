// src/components/Sidebar.jsx
import { useState, useEffect } from "react";
import { useNavigate, useLocation } from "react-router-dom";
import { useAuth } from "../contexts/AuthContext";
import { motion, AnimatePresence } from "framer-motion";
import {
  FiHome,
  FiUser,
  FiBook,
  FiUsers,
  FiSettings,
  FiBarChart2,
  FiCalendar,
  FiFileText,
  FiLogOut,
  FiMenu,
  FiX,
  FiChevronLeft,
  FiUserMinus,
} from "react-icons/fi";

const Sidebar = () => {
  const { user, logout } = useAuth();
  const navigate = useNavigate();
  const location = useLocation();
  const [isOpen, setIsOpen] = useState(false);
  const [isMobile, setIsMobile] = useState(window.innerWidth < 768);
  const [collapsed, setCollapsed] = useState(false);

  // Check screen size
  useEffect(() => {
    const handleResize = () => {
      const mobile = window.innerWidth < 768;
      setIsMobile(mobile);
      if (mobile) {
        setIsOpen(false);
      }
    };

    window.addEventListener("resize", handleResize);
    return () => window.removeEventListener("resize", handleResize);
  }, []);

  // Define menu items based on user role
  const getMenuItems = () => {
    const commonItems = [
      {
        id: "dashboard",
        label: "Dashboard",
        icon: FiHome,
        path: `/${user?.role}/dashboard`,
      },
      // {
      //   id: "profile",
      //   label: "Profile",
      //   icon: FiUser,
      //   path: "/profile",
      // },
    ];

    if (user?.role === "admin") {
      return [
        ...commonItems,
        {
          id: "faculties",
          label: "Faculties",
          icon: FiUsers,
          path: "/admin/faculties",
        },
        {
          id: "student",
          label: "Students",
          icon: FiUserMinus,
          path: "/admin/students",
        },
        {
          id: "institute",
          label: "Institute",
          icon: FiBook,
          path: "/admin/institute",
        },
      ];
    } else if (user?.role === "faculty") {
      return [
        ...commonItems,
        {
          id: "students",
          label: "Students",
          icon: FiBook,
          path: "/faculty/students",
        },
        {
          id: "approval",
          label: "Approval Panel",
          icon: FiCalendar,
          path: "/faculty/approval",
        },
        // {
        //   id: "grades",
        //   label: "Grade Management",
        //   icon: FiFileText,
        //   path: "/faculty/grades",
        // },
      ];
    } else if (user?.role === "student") {
      return [
        ...commonItems,
        {
          id: "academics",
          label: "Academics",
          icon: FiBook,
          path: "/student/academics",
        },
        {
          id: "approval",
          label: "Approval",
          icon: FiFileText,
          path: "/student/approval",
        },
        {
          id: "portfolio",
          label: "Portfolio",
          icon: FiCalendar,
          path: "/student/portfolio",
        },
      ];
    }

    return commonItems;
  };

  const menuItems = getMenuItems();

  const handleNavigation = (path) => {
    navigate(path);
    if (isMobile) {
      setIsOpen(false);
    }
  };

  const handleLogout = () => {
    logout();
    navigate("/auth/login");
  };

  const toggleSidebar = () => {
    setIsOpen(!isOpen);
  };

  const sidebarContent = (
    <div
      className={`bg-white text-gray-800 flex flex-col h-full shadow-lg ${
        isMobile ? "w-full" : "w-64"
      }`}
    >
      {/* Header */}
      <div className="p-4 border-b border-gray-200 flex items-center justify-between">
        <div className="flex items-center">
          <div className="w-10 h-10 rounded-full bg-gradient-to-r from-green-500 to-green-600 flex items-center justify-center text-white">
            <FiUser className="h-5 w-5" />
          </div>
          <div className="ml-3 flex flex-col">
            <span className="font-medium text-sm leading-tight">
              {user?.name || "User"}
            </span>
            <span className="text-xs text-gray-500 capitalize mt-0.5">
              {user?.role || "Unknown"}
            </span>
          </div>
        </div>
        {!isMobile && (
          <motion.button
            whileHover={{ scale: 1.1 }}
            whileTap={{ scale: 0.9 }}
            onClick={() => setCollapsed(!collapsed)}
            className="p-1 rounded-md hover:bg-gray-100 transition-colors"
          >
            <FiChevronLeft
              className={`h-4 w-4 transition-transform ${
                collapsed ? "rotate-180" : ""
              }`}
            />
          </motion.button>
        )}
      </div>

      {/* Menu Items */}
      <nav className="flex-1 overflow-y-auto py-4">
        <ul className="space-y-1 px-2">
          {menuItems.map((item) => {
            const Icon = item.icon;
            const isActive = location.pathname === item.path;

            return (
              <li key={item.id}>
                <motion.button
                  whileHover={{ x: 4 }}
                  whileTap={{ scale: 0.98 }}
                  onClick={() => handleNavigation(item.path)}
                  className={`w-full flex items-center px-4 py-3 rounded-lg transition-colors ${
                    isActive
                      ? "bg-green-100 text-green-700 border-r-4 border-green-600"
                      : "text-gray-600 hover:bg-gray-100 hover:text-gray-800"
                  }`}
                >
                  <Icon className="h-5 w-5" />
                  {!collapsed && <span className="ml-3">{item.label}</span>}
                </motion.button>
              </li>
            );
          })}
        </ul>
      </nav>

      {/* Footer */}
      <div className="p-4 border-t border-gray-200">
        <motion.button
          whileHover={{ x: 4 }}
          whileTap={{ scale: 0.98 }}
          onClick={handleLogout}
          className="w-full flex items-center px-4 py-3 rounded-lg text-gray-600 hover:bg-gray-100 hover:text-gray-800 transition-colors"
        >
          <FiLogOut className="h-5 w-5" />
          {!collapsed && <span className="ml-3">Logout</span>}
        </motion.button>
      </div>
    </div>
  );

  if (isMobile) {
    return (
      <>
        {/* Mobile bottom bar */}
        <div className="fixed bottom-0 left-0 right-0 bg-white border-t border-gray-200 z-40 md:hidden shadow-lg">
          <div className="flex justify-around">
            {menuItems.slice(0, 4).map((item) => {
              const Icon = item.icon;
              const isActive = location.pathname === item.path;

              return (
                <motion.button
                  key={item.id}
                  whileTap={{ scale: 0.9 }}
                  onClick={() => handleNavigation(item.path)}
                  className={`flex flex-col items-center py-2 px-4 flex-1 ${
                    isActive ? "text-green-600" : "text-gray-500"
                  }`}
                >
                  <Icon className="h-5 w-5" />
                  <span className="text-xs mt-1">
                    {item.label.split(" ")[0]}
                  </span>
                </motion.button>
              );
            })}
            {menuItems.length > 4 && (
              <motion.button
                whileTap={{ scale: 0.9 }}
                onClick={toggleSidebar}
                className="flex flex-col items-center py-2 px-4 flex-1 text-gray-500"
              >
                <FiMenu className="h-5 w-5" />
                <span className="text-xs mt-1">More</span>
              </motion.button>
            )}
          </div>
        </div>

        {/* Mobile sidebar overlay */}
        <AnimatePresence>
          {isOpen && (
            <>
              <motion.div
                initial={{ opacity: 0 }}
                animate={{ opacity: 0.5 }}
                exit={{ opacity: 0 }}
                className="fixed inset-0 bg-black z-50 md:hidden"
                onClick={() => setIsOpen(false)}
              />
              <motion.div
                initial={{ x: "100%" }}
                animate={{ x: 0 }}
                exit={{ x: "100%" }}
                transition={{ type: "tween", ease: "easeInOut" }}
                className="fixed top-0 right-0 bottom-0 w-64 z-50 md:hidden"
              >
                <div className="relative h-full">
                  {sidebarContent}
                  <motion.button
                    whileHover={{ scale: 1.1 }}
                    whileTap={{ scale: 0.9 }}
                    onClick={() => setIsOpen(false)}
                    className="absolute top-4 right-4 p-2 rounded-full bg-gray-100 text-gray-800 shadow-md"
                  >
                    <FiX className="h-5 w-5" />
                  </motion.button>
                </div>
              </motion.div>
            </>
          )}
        </AnimatePresence>
      </>
    );
  }

  // Desktop sidebar
  return (
    <motion.div
      initial={{ width: collapsed ? 150 : 256 }}
      animate={{ width: collapsed ? 150 : 256 }}
      transition={{ duration: 0.2, ease: "easeInOut" }}
      className="hidden md:flex flex-shrink-0 h-full relative"
    >
      {sidebarContent}
    </motion.div>
  );
};

export default Sidebar;
