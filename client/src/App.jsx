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
import Approval from "./Pages/Faculty/Approval";
import StudentList from "./Pages/Faculty/StudentList";
import StudentDetails from "./Pages/Faculty/StudentDetails";
import Academics from "./Pages/Student/Academics";
import ApplyApproval from "./Pages/Student/ApplyApproval";
import Portfolio from "./Pages/Student/Portfolio";
import Reports from "./Pages/Admin/Reports";
import StudentSearch from "./Pages/StudentSearch";
import NotFound from "./Pages/NotFound"; // Import the new component

function App() {
  return (
    <Router>
      <AuthProvider>
        {/* Navbar is always visible */}
        <Navbar />

        <Routes>
          {/* Public routes */}
          <Route path="/" element={<Home />} />
          <Route path="/student-search" element={<StudentSearch />} />

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
              <Route path="/admin/reports" element={<Reports />} />
            </Route>

            <Route element={<ProtectedRoute role="faculty" />}>
              <Route path="/faculty/dashboard" element={<FacultyDashboard />} />
              <Route path="/faculty/students" element={<StudentList />} />
              <Route
                path="/faculty/students/:id"
                element={<StudentDetails />}
              />
              <Route path="/faculty/approval" element={<Approval />} />
            </Route>

            <Route element={<ProtectedRoute role="student" />}>
              <Route path="/student/dashboard" element={<StudentDashboard />} />
              <Route path="/student/academics" element={<Academics />} />
              <Route path="/student/approval" element={<ApplyApproval />} />
              <Route path="/student/portfolio" element={<Portfolio />} />
            </Route>

            {/* Common protected routes for all roles */}
            <Route path="/profile" element={<Profile />} />
          </Route>

          {/* 404 Catch-all route - MUST BE LAST */}
          <Route path="*" element={<NotFound />} />
        </Routes>
      </AuthProvider>
    </Router>
  );
}

export default App;
