// Check if the logged-in user is an Admin
const checkAdmin = (req, res, next) => {
  if (!req.user || req.user.role !== "admin") {
    return res.status(403).json({ message: "Access denied. Admins only." });
  }
  next();
};

// Check if the logged-in user is a Faculty
const checkFaculty = (req, res, next) => {
  if (!req.user || req.user.role !== "faculty") {
    return res.status(403).json({ message: "Access denied. Faculty only." });
  }
  next();
};

// Check if the logged-in user is a Student
const checkStudent = (req, res, next) => {
  if (!req.user || req.user.role !== "student") {
    return res.status(403).json({ message: "Access denied. Students only." });
  }
  next();
};

module.exports = {
  checkAdmin,
  checkFaculty,
  checkStudent,
};
