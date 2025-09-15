// Utils/Api.js
import axios from "axios";
import Cookies from "js-cookie";

const axiosInstance = axios.create({
  baseURL: import.meta.env.VITE_BACKEND_URL || "http://localhost:8001", // support vite & CRA
});

// 🔑 Attach token from cookies automatically
axiosInstance.interceptors.request.use((config) => {
  const token = Cookies.get("magicalKey");
  if (token) {
    config.headers.Authorization = `Bearer ${token}`;
  }
  return config;
});

// ===================== Admin APIs =====================

// Get institute details
export const getInstituteDetails = () =>
  axiosInstance.get("/api/admin/institute-details");

// Add Department
export const addDepartment = (data) =>
  axiosInstance.post("/api/admin/add-department", data);

// Add Course
export const addCourse = (data) =>
  axiosInstance.post("/api/admin/add-course", data);

// Add Faculty
export const addFaculty = (data) =>
  axiosInstance.post("/api/admin/add-faculty", data);

// Faculty List
export const getFacultyList = () =>
  axiosInstance.get("/api/admin/faculty-list");

// Add Student
export const addStudent = (data) =>
  axiosInstance.post("/api/admin/add-student", data);

export const getStudentList = () =>
  axiosInstance.get("/api/admin/student-list");

// ===================== Faculty APIs ===================

export const getStudentListFaculty = () =>
  axiosInstance.get("/api/faculty/students");

export const getStudentById = (data) =>
  axiosInstance.post("/api/faculty/student", data);

export const addGrade = (data) =>
  axiosInstance.post("/api/faculty/student/grade", data);

export const addAttendance = (data) =>
  axiosInstance.post("/api/faculty/student/attendance", data);

// ===================== Student APIs ==================

export const getAcademics = (data) =>
  axiosInstance.get("api/student/academics", data);

export default axiosInstance;
