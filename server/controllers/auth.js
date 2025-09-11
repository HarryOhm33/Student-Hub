const bcrypt = require("bcryptjs");
const jwt = require("jsonwebtoken");
const Admin = require("../models/admin");
const Faculty = require("../models/faculty");
const Student = require("../models/student");
const Institute = require("../models/institute");
const Session = require("../models/session");
// const otpGenerator = require("otp-generator");
const sendEmail = require("../utils/sendEmail");
const EmailToken = require("../models/emailToken");
const crypto = require("crypto");
const {
  generateVerificationEmail,
  generatePasswordResetEmail,
} = require("../utils/mailTemplates");

module.exports.signup = async (req, res) => {
  const { name, email, password, instituteName, instituteEmail } = req.body;

  if (!name || !email || !password || !instituteName || !instituteEmail)
    return res.status(400).json({ message: "All fields are required" });

  const existingUser = await Admin.findOne({ email });
  if (existingUser && existingUser.isVerified)
    return res
      .status(400)
      .json({ message: "Email already exists, Please Log in" });

  // Delete old token if exists
  await EmailToken.deleteOne({ email });

  // Generate token
  const token = crypto.randomBytes(32).toString("hex");

  // Hash password
  const hashedPassword = await bcrypt.hash(password, 10);

  // Save token
  await EmailToken.create({ email, token });

  let institute;
  if (!existingUser) {
    // Create institute
    const instCode = `${instituteName
      .toUpperCase()
      .replace(/\s+/g, "")}_${Date.now()}`;
    institute = await Institute.create({
      name: instituteName,
      code: instCode,
      createdByEmail: email,
      instituteEmail, // ✅ now storing institute email
      isVerified: false,
    });

    // Create admin linked to institute
    await Admin.create({
      name,
      email,
      password: hashedPassword,
      isVerified: false,
      institute: institute._id,
    });
  } else {
    // Update existing user
    existingUser.name = name;
    existingUser.password = hashedPassword;
    existingUser.isVerified = false;
    await existingUser.save();

    // Update or create institute if not exists
    institute = await Institute.findOne({ instituteEmail });
    if (!institute) {
      const instCode = `${instituteName
        .toUpperCase()
        .replace(/\s+/g, "")}_${Date.now()}`;
      institute = await Institute.create({
        name: instituteName,
        code: instCode,
        createdByEmail: email,
        instituteEmail, // ✅ now using the passed institute email
        isVerified: false,
      });
    }
  }

  // Send verification link
  const verificationLink = `${
    process.env.FRONTEND_URL
  }/auth/verify?token=${token}&email=${encodeURIComponent(email)}`;

  const htmlContent = generateVerificationEmail(name, verificationLink);

  await sendEmail(email, "Verify Your Account", {
    text: "Please verify your account using the code/link.",
    html: htmlContent,
  });

  res.status(200).json({
    valid: true,
    message:
      "Verification link sent to email (valid for 10 min). Verify to complete signup. Please check your spam folder if you don't see it in your inbox.",
  });
};

module.exports.verify = async (req, res) => {
  const { token, email } = req.body;
  console.log(token, email);

  if (!token || !email)
    return res.status(400).json({ message: "Token is required" });

  const record = await EmailToken.findOne({ token: token, email: email });
  // console.log(record);

  if (!record) {
    return res.status(400).json({ message: "Invalid or expired token" });
  }

  // Change user verification status
  const user = await Admin.findOne({ email: record.email });

  if (!user) {
    return res.status(404).json({ message: "User not found" });
  }

  const institute = await Institute.findOne({ createdByEmail: record.email });

  if (!institute) {
    return res.status(404).json({ message: "Institute not found" });
  }

  user.institute = institute._id;

  user.isVerified = true;
  institute.isVerified = true;
  await user.save();
  await institute.save();

  // ✅ Delete email token after successful verification
  await EmailToken.deleteOne({ token: token, email: email });

  res
    .status(200)
    .json({ valid: true, message: "Signup successful. You can now log in." });
};

module.exports.login = async (req, res) => {
  const { identifier, password, role } = req.body;
  let user;

  // Determine which model to use based on role
  if (role === "admin") {
    user = await Admin.findOne({ email: identifier });
  } else if (role === "faculty") {
    user = await Faculty.findOne({ employeeId: identifier });
  } else if (role === "student") {
    user = await Student.findOne({ regNumber: identifier });
  } else {
    return res.status(400).json({ message: "Invalid role" });
  }

  if (!user) {
    return res.status(400).json({ message: "User not found, SignUp first!" });
  }

  if (!user.isVerified) {
    return res
      .status(403)
      .json({ message: "Please signup or verify your account first." });
  }

  const isMatch = await bcrypt.compare(password, user.password);
  if (!isMatch) {
    return res.status(400).json({ message: "Invalid credentials" });
  }

  // ✅ Generate JWT Token
  const token = jwt.sign({ user: user }, process.env.JWT_SECRET, {
    expiresIn: "7d",
  });

  // ✅ Store session in MongoDB
  await Session.create({ userId: user._id, token });

  // ✅ Set token in HTTP-only cookies
  res.cookie("autoKey", token, {
    httpOnly: true,
    secure: process.env.NODE_ENV === "production",
    maxAge: 7 * 24 * 60 * 60 * 1000, // 7 days
  });

  const { password: pwd, ...userData } = user.toObject(); // Exclude password

  res.status(200).json({
    valid: true,
    message: "Login successful",
    user: userData,
    token: token,
  });
};

module.exports.verifySession = async (req, res) => {
  // ✅ Check if user is authenticated
  if (!req.user) {
    return res.status(401).json({ message: "Unauthorized" });
  }

  const role = req.user.role;
  let user;

  if (role === "admin") {
    user = await Admin.findById(req.user._id);
  } else if (role === "faculty") {
    user = await Faculty.findById(req.user._id);
  } else if (role === "student") {
    user = await Student.findById(req.user._id);
  }

  if (!user) {
    return res.status(404).json({ message: "User not found" });
  }

  const { password, ...userData } = user.toObject();
  // ✅ Return user info
  res.status(200).json({ valid: true, user: userData });
};

module.exports.logout = async (req, res) => {
  // ✅ Delete the session from MongoDB
  await Session.deleteOne({ userId: req.user._id, token: req.token });

  // ✅ Clear the authentication cookie
  res.clearCookie("autoKey", {
    httpOnly: true,
    secure: process.env.NODE_ENV === "production",
  });

  res.status(200).json({ valid: true, message: "Logged out successfully" });
};

// module.exports.resendOTP = async (req, res) => {
//   const { email } = req.body;

//   const existingUser = await OTP.findOne({ email });
//   if (!existingUser)
//     return res.status(400).json({ message: "No pending verification found." });

//   // ✅ Generate new OTP
//   const otp = otpGenerator.generate(6, {
//     digits: true,
//     upperCaseAlphabets: false, // ❌ Disable uppercase letters
//     lowerCaseAlphabets: false, // ❌ Disable lowercase letters
//     specialChars: false, // ❌ Disable special characters
//   });

//   // ✅ Update OTP in DB
//   await OTP.updateOne({ email }, { otp });

//   // ✅ Send OTP via email
//   await sendEmail(email, "Resend OTP", `Your new OTP is ${otp}`);

//   res.status(200).json({ message: "New OTP sent successfully." });
// };

module.exports.forgotPassword = async (req, res) => {
  const { email } = req.body;

  if (!email) return res.status(400).json({ message: "Email is required" });

  const user = await User.findOne({ email });
  if (!user) return res.status(400).json({ message: "User not found" });

  // delete old token if exists
  await EmailToken.deleteOne({ email });

  // generate token
  const token = crypto.randomBytes(32).toString("hex");
  await EmailToken.create({ email, token });

  // build reset link
  const resetLink = `${
    process.env.FRONTEND_URL
  }/auth/reset-password?token=${token}&email=${encodeURIComponent(email)}`;

  // send email
  const htmlContent = generatePasswordResetEmail(user.name, resetLink);

  await sendEmail(email, "Reset Your Password", {
    text: "You requested to reset your password.",
    html: htmlContent,
  });

  res
    .status(200)
    .json({ valid: true, message: "Password reset link sent to email" });
};

module.exports.resetPassword = async (req, res) => {
  const { token, email, newPassword } = req.body;
  // console.log(token, email, newPassword);

  if (!token || !email || !newPassword) {
    return res.status(400).json({ message: "All fields are required" });
  }

  const record = await EmailToken.findOne({ token, email });
  if (!record)
    return res.status(400).json({ message: "Invalid or expired token" });

  const user = await User.findOne({ email });
  if (!user) return res.status(404).json({ message: "User not found" });

  // hash new password
  const hashed = await bcrypt.hash(newPassword, 10);
  user.password = hashed;
  await user.save();

  // delete token after reset
  await EmailToken.deleteOne({ token, email });

  res.status(200).json({
    valid: true,
    message: "Password reset successful. Please log in.",
  });
};
