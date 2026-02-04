if (process.env.NODE_ENV !== "production") {
  require("dotenv").config();
}

const express = require("express");
const cookieParser = require("cookie-parser");
const cors = require("cors");

const ExpressError = require("./utils/ExpressError");
const authRoute = require("./routes/authRoute");
const adminRoute = require("./routes/adminRoute");
const facultyRoute = require("./routes/facultyRoute");
const studentRoute = require("./routes/studentRoute");
const openRoute = require("./routes/openRoute");

const app = express();

app.set("trust proxy", 1);
app.use(express.urlencoded({ extended: true }));
app.use(express.json());
app.use(cookieParser());

const corsOptions = {
  origin: [
    process.env.FRONTEND_URL,
    "http://localhost:5173",
    "http://localhost:5174",
  ],
  credentials: true,
};

app.use(cors(corsOptions));

app.use("/api/auth", authRoute);
app.use("/api/admin", adminRoute);
app.use("/api/faculty", facultyRoute);
app.use("/api/student", studentRoute);
app.use("/api/open", openRoute);

app.get("/", (req, res) => {
  res.status(200).json({ message: "API is Running...." });
});

app.all("*", (req, res, next) => {
  next(new ExpressError(404, "Not a Valid Route"));
});

app.use((err, req, res, next) => {
  res.status(err.status || 500).json({ error: err.message });
});

module.exports = app;
