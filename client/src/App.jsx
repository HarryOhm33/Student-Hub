// src/App.jsx
import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
import { AuthProvider } from "./contexts/AuthContext";
import Navbar from "./components/Navbar";
import Home from "./Pages/Home";
import Signup from "./Pages/Signup";
import Login from "./Pages/Login";
import Verify from "./Pages/Verify";
import ProtectedAuth from "./components/Protected/ProtectedAuth";
import ProtectedRoute from "./components/Protected/ProtectedRoute";
import ForgotPassword from "./Pages/ForgotPassword";
import ResetPassword from "./Pages/ResetPassword";
import Profile from "./Pages/Profile";
import AdminDashboard from "./Pages/Admin/AdminDashboard";
import FacultyDashboard from "./Pages/Faculty/FacultyDashboard";
import StudentDashboard from "./Pages/Student/StudentDashboard";
import DashboardLayout from "./components/DashboardLayout";
import Institute from "./Pages/Admin/Institute";
import Faculties from "./Pages/Admin/Faculties";
import Students from "./Pages/Admin/Students";

function App() {
  return (
    <Router>
      <AuthProvider>
        {/* Navbar is always visible */}
        <Navbar />

        <Routes>
          {/* Public routes */}
          <Route path="/" element={<Home />} />

          <Route element={<ProtectedAuth />}>
            <Route path="/auth/signup" element={<Signup />} />
            <Route path="/auth/verify" element={<Verify />} />
            <Route path="/auth/login" element={<Login />} />
            <Route path="/auth/forgot-password" element={<ForgotPassword />} />
            <Route path="/auth/reset-password" element={<ResetPassword />} />
          </Route>

          {/* Protected routes with sidebar layout */}
          <Route element={<DashboardLayout />}>
            <Route element={<ProtectedRoute role="admin" />}>
              <Route path="/admin/dashboard" element={<AdminDashboard />} />
              <Route path="/admin/faculties" element={<Faculties />} />
              <Route path="/admin/students" element={<Students />} />
              <Route path="/admin/institute" element={<Institute />} />
            </Route>

            <Route element={<ProtectedRoute role="faculty" />}>
              <Route path="/faculty/dashboard" element={<FacultyDashboard />} />
            </Route>

            <Route element={<ProtectedRoute role="student" />}>
              <Route path="/student/dashboard" element={<StudentDashboard />} />
            </Route>

            {/* Common protected routes for all roles */}
            <Route path="/profile" element={<Profile />} />
          </Route>
        </Routes>
      </AuthProvider>
    </Router>
  );
}

export default App;
