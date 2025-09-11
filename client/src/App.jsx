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
import FacultyDashbard from "./Pages/Faculty/FacultyDashbard";
import StudentDashboard from "./Pages/Student/StudentDashboard";

function App() {
  return (
    <Router>
      <AuthProvider>
        <Navbar />
        <Routes>
          <Route path="/" element={<Home />} />

          <Route element={<ProtectedAuth />}>
            <Route path="/auth/signup" element={<Signup />} />
            <Route path="/auth/verify" element={<Verify />} />
            <Route path="/auth/login" element={<Login />} />
            {/* <Route path="/auth/forgot-password" element={<ForgotPassword />} /> */}
            {/* <Route path="/auth/reset-password" element={<ResetPassword />} /> */}
          </Route>

          <Route element={<ProtectedRoute role="admin" />}>
            <Route path="/admin/dashboard" element={<AdminDashboard />} />
            {/* <Route path="/profile" element={<Profile />} /> */}
          </Route>

          <Route element={<ProtectedRoute role="faculty" />}>
            <Route path="/faculty/dashboard" element={<FacultyDashbard />} />
          </Route>

          <Route element={<ProtectedRoute role="student" />}>
            <Route path="/student/dashboard" element={<StudentDashboard />} />
          </Route>
        </Routes>
      </AuthProvider>
    </Router>
  );
}

export default App;
