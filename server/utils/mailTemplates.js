module.exports.generateVerificationEmail = (name, verificationLink) => {
  return `
<!DOCTYPE html>
<html lang="en">
<head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <title>Verify Your Account</title>
    <style>
        body {
            font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, Oxygen, Ubuntu, Cantarell, 'Open Sans', 'Helvetica Neue', sans-serif;
            line-height: 1.6;
            color: #333;
            margin: 0;
            padding: 0;
            background-color: #f9fafb;
        }
        .container {
            max-width: 600px;
            margin: 0 auto;
            background-color: #ffffff;
        }
        .header {
            background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
            padding: 30px 20px;
            text-align: center;
            border-radius: 8px 8px 0 0;
        }
        .header h1 {
            color: white;
            margin: 0;
            font-size: 28px;
            font-weight: 600;
        }
        .content {
            padding: 30px;
        }
        .welcome-text {
            font-size: 18px;
            margin-bottom: 20px;
            color: #4a5568;
        }
        .verification-box {
            background-color: #f7fafc;
            border: 1px solid #e2e8f0;
            border-radius: 8px;
            padding: 25px;
            text-align: center;
            margin: 25px 0;
        }
        .button {
            display: inline-block;
            padding: 14px 28px;
            background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
            color: white;
            text-decoration: none;
            border-radius: 6px;
            font-weight: 600;
            font-size: 16px;
            margin: 15px 0;
        }
        .link-text {
            word-break: break-all;
            color: #4a5568;
            font-size: 14px;
            margin-top: 15px;
        }
        .footer {
            text-align: center;
            padding: 20px;
            font-size: 14px;
            color: #718096;
            border-top: 1px solid #e2e8f0;
        }
        .warning {
            background-color: #fff5f5;
            border: 1px solid #fed7d7;
            border-radius: 6px;
            padding: 15px;
            margin: 20px 0;
            color: #c53030;
            font-size: 14px;
        }
        .logo {
            font-size: 24px;
            font-weight: bold;
            color: white;
            text-decoration: none;
        }
    </style>
</head>
<body>
    <div class="container">
        <div class="header">
            <h1>Verify Your Account</h1>
        </div>
        
        <div class="content">
            <p class="welcome-text">Hello <strong>${name}</strong>,</p>
            <p>Thank you for signing up! To complete your registration, please verify your email address by clicking the button below:</p>
            
            <div class="verification-box">
                <a href="${verificationLink}" class="button">Verify Email Address</a>
                <p class="link-text">Or copy and paste this link into your browser:<br>${verificationLink}</p>
            </div>
            
            <div class="warning">
                <strong>Important:</strong> This verification link will expire in 10 minutes for security reasons.
            </div>
            
            <p>If you didn't create an account with us, please ignore this email.</p>
            
            <p>Best regards,<br>The Team</p>
        </div>
        
        <div class="footer">
            <p>© ${new Date().getFullYear()} Your Company Name. All rights reserved.</p>
            <p>If you need help, please contact our support team at support@yourdomain.com</p>
        </div>
    </div>
</body>
</html>
  `;
};

module.exports.generatePasswordResetEmail = (name, resetLink) => {
  return `
<!DOCTYPE html>
<html lang="en">
<head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <title>Reset Your Password</title>
    <style>
        body {
            font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, Oxygen, Ubuntu, Cantarell, 'Open Sans', 'Helvetica Neue', sans-serif;
            line-height: 1.6;
            color: #333;
            margin: 0;
            padding: 0;
            background-color: #f9fafb;
        }
        .container {
            max-width: 600px;
            margin: 0 auto;
            background-color: #ffffff;
        }
        .header {
            background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
            padding: 30px 20px;
            text-align: center;
            border-radius: 8px 8px 0 0;
        }
        .header h1 {
            color: white;
            margin: 0;
            font-size: 28px;
            font-weight: 600;
        }
        .content {
            padding: 30px;
        }
        .welcome-text {
            font-size: 18px;
            margin-bottom: 20px;
            color: #4a5568;
        }
        .reset-box {
            background-color: #f7fafc;
            border: 1px solid #e2e8f0;
            border-radius: 8px;
            padding: 25px;
            text-align: center;
            margin: 25px 0;
        }
        .button {
            display: inline-block;
            padding: 14px 28px;
            background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
            color: white;
            text-decoration: none;
            border-radius: 6px;
            font-weight: 600;
            font-size: 16px;
            margin: 15px 0;
        }
        .link-text {
            word-break: break-all;
            color: #4a5568;
            font-size: 14px;
            margin-top: 15px;
        }
        .footer {
            text-align: center;
            padding: 20px;
            font-size: 14px;
            color: #718096;
            border-top: 1px solid #e2e8f0;
        }
        .warning {
            background-color: #fff5f5;
            border: 1px solid #fed7d7;
            border-radius: 6px;
            padding: 15px;
            margin: 20px 0;
            color: #c53030;
            font-size: 14px;
        }
    </style>
</head>
<body>
    <div class="container">
        <div class="header">
            <h1>Password Reset Request</h1>
        </div>
        
        <div class="content">
            <p class="welcome-text">Hello <strong>${name}</strong>,</p>
            <p>We received a request to reset your password. You can reset it by clicking the button below:</p>
            
            <div class="reset-box">
                <a href="${resetLink}" class="button">Reset Password</a>
                <p class="link-text">Or copy and paste this link into your browser:<br>${resetLink}</p>
            </div>
            
            <div class="warning">
                <strong>Important:</strong> This reset link will expire in 10 minutes for security reasons.
            </div>
            
            <p>If you didn’t request this password reset, you can safely ignore this email. Your account will remain secure.</p>
            
            <p>Best regards,<br>The Team</p>
        </div>
        
        <div class="footer">
            <p>© ${new Date().getFullYear()} Your Company Name. All rights reserved.</p>
            <p>If you need help, please contact our support team at support@yourdomain.com</p>
        </div>
    </div>
</body>
</html>
  `;
};

module.exports.generateFacultyWelcomeEmail = (
  name,
  employeeId,
  password,
  department,
  designation
) => {
  return `
<!DOCTYPE html>
<html lang="en">
<head>
  <meta charset="UTF-8">
  <meta name="viewport" content="width=device-width, initial-scale=1.0">
  <title>Welcome to the Institute</title>
  <style>
    body {
      font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, Oxygen, Ubuntu, Cantarell, 'Open Sans', 'Helvetica Neue', sans-serif;
      line-height: 1.6;
      color: #333;
      margin: 0;
      padding: 0;
      background-color: #f9fafb;
    }
    .container {
      max-width: 600px;
      margin: 0 auto;
      background-color: #ffffff;
    }
    .header {
      background: linear-gradient(135deg, #38b2ac 0%, #3182ce 100%);
      padding: 30px 20px;
      text-align: center;
      border-radius: 8px 8px 0 0;
    }
    .header h1 {
      color: white;
      margin: 0;
      font-size: 26px;
      font-weight: 600;
    }
    .content {
      padding: 30px;
    }
    .welcome-text {
      font-size: 18px;
      margin-bottom: 20px;
      color: #2d3748;
    }
    .info-box {
      background-color: #f7fafc;
      border: 1px solid #e2e8f0;
      border-radius: 8px;
      padding: 20px;
      margin: 20px 0;
    }
    .info-box p {
      margin: 8px 0;
      font-size: 15px;
    }
    .footer {
      text-align: center;
      padding: 20px;
      font-size: 14px;
      color: #718096;
      border-top: 1px solid #e2e8f0;
    }
  </style>
</head>
<body>
  <div class="container">
    <div class="header">
      <h1>Welcome to the Institute</h1>
    </div>

    <div class="content">
      <p class="welcome-text">Hello <strong>${name}</strong>,</p>
      <p>We are excited to have you on board as a faculty member. Below are your account details:</p>

      <div class="info-box">
        <p><strong>Employee ID:</strong> ${employeeId}</p>
        <p><strong>Temporary Password:</strong> ${password}</p>
        <p><strong>Department:</strong> ${department}</p>
        <p><strong>Designation:</strong> ${designation}</p>
      </div>

      <p>Please use the above credentials to log in. For security reasons, change your password immediately after your first login.</p>

      <p>Best regards,<br>The Institute Team</p>
    </div>

    <div class="footer">
      <p>© ${new Date().getFullYear()} Your Institute. All rights reserved.</p>
      <p>If you need help, please contact our IT support.</p>
    </div>
  </div>
</body>
</html>
  `;
};

module.exports.generateStudentWelcomeEmail = (
  name,
  regNumber,
  password,
  department,
  course,
  year
) => {
  return `
<!DOCTYPE html>
<html lang="en">
<head>
  <meta charset="UTF-8">
  <meta name="viewport" content="width=device-width, initial-scale=1.0">
  <title>Welcome to the Institute</title>
  <style>
    body {
      font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, Oxygen, Ubuntu, Cantarell, 'Open Sans', 'Helvetica Neue', sans-serif;
      line-height: 1.6;
      color: #333;
      margin: 0;
      padding: 0;
      background-color: #f9fafb;
    }
    .container {
      max-width: 600px;
      margin: 0 auto;
      background-color: #ffffff;
    }
    .header {
      background: linear-gradient(135deg, #38b2ac 0%, #3182ce 100%);
      padding: 30px 20px;
      text-align: center;
      border-radius: 8px 8px 0 0;
    }
    .header h1 {
      color: white;
      margin: 0;
      font-size: 26px;
      font-weight: 600;
    }
    .content {
      padding: 30px;
    }
    .welcome-text {
      font-size: 18px;
      margin-bottom: 20px;
      color: #2d3748;
    }
    .info-box {
      background-color: #f7fafc;
      border: 1px solid #e2e8f0;
      border-radius: 8px;
      padding: 20px;
      margin: 20px 0;
    }
    .info-box p {
      margin: 8px 0;
      font-size: 15px;
    }
    .footer {
      text-align: center;
      padding: 20px;
      font-size: 14px;
      color: #718096;
      border-top: 1px solid #e2e8f0;
    }
  </style>
</head>
<body>
  <div class="container">
    <div class="header">
      <h1>Welcome to the Institute</h1>
    </div>

    <div class="content">
      <p class="welcome-text">Hello <strong>${name}</strong>,</p>
      <p>We are excited to have you on board as a student. Below are your account details:</p>

      <div class="info-box">
        <p><strong>Registration Number:</strong> ${regNumber}</p>
        <p><strong>Temporary Password:</strong> ${password}</p>
        <p><strong>Department:</strong> ${department}</p>
        <p><strong>Course:</strong> ${course}</p>
        <p><strong>Year:</strong> ${year}</p>
      </div>

      <p>Please use the above credentials to log in. For security reasons, change your password immediately after your first login.</p>

      <p>Best regards,<br>The Institute Team</p>
    </div>

    <div class="footer">
      <p>© ${new Date().getFullYear()} Your Institute. All rights reserved.</p>
      <p>If you need help, please contact our IT support.</p>
    </div>
  </div>
</body>
</html>
  `;
};

module.exports.generateIssuerApprovalEmail = (
  studentName,
  activityTitle,
  approvalLink
) => {
  return `
<!DOCTYPE html>
<html lang="en">
<head>
  <meta charset="UTF-8">
  <meta name="viewport" content="width=device-width, initial-scale=1.0">
  <title>Issuer Approval Required</title>
  <style>
    body {
      font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, Oxygen, Ubuntu, Cantarell, 'Open Sans', 'Helvetica Neue', sans-serif;
      line-height: 1.6;
      color: #333;
      margin: 0;
      padding: 0;
      background-color: #f9fafb;
    }
    .container {
      max-width: 600px;
      margin: 0 auto;
      background-color: #ffffff;
    }
    .header {
      background: linear-gradient(135deg, #10b981 0%, #059669 100%);
      padding: 30px 20px;
      text-align: center;
      border-radius: 8px 8px 0 0;
    }
    .header h1 {
      color: white;
      margin: 0;
      font-size: 24px;
      font-weight: 600;
    }
    .content {
      padding: 30px;
    }
    .welcome-text {
      font-size: 18px;
      margin-bottom: 20px;
      color: #374151;
    }
    .verification-box {
      background-color: #f7fafc;
      border: 1px solid #e2e8f0;
      border-radius: 8px;
      padding: 25px;
      text-align: center;
      margin: 25px 0;
    }
    .button {
      display: inline-block;
      padding: 14px 28px;
      background: linear-gradient(135deg, #10b981 0%, #059669 100%);
      color: white;
      text-decoration: none;
      border-radius: 6px;
      font-weight: 600;
      font-size: 16px;
      margin: 15px 0;
    }
    .link-text {
      word-break: break-all;
      color: #4b5563;
      font-size: 14px;
      margin-top: 15px;
    }
    .footer {
      text-align: center;
      padding: 20px;
      font-size: 14px;
      color: #718096;
      border-top: 1px solid #e2e8f0;
    }
    .warning {
      background-color: #fff5f5;
      border: 1px solid #fed7d7;
      border-radius: 6px;
      padding: 15px;
      margin: 20px 0;
      color: #c53030;
      font-size: 14px;
    }
  </style>
</head>
<body>
  <div class="container">
    <div class="header">
      <h1>Approval Required</h1>
    </div>
    
    <div class="content">
      <p class="welcome-text">Hello Issuer,</p>
      <p>Student <strong>${studentName}</strong> has submitted an <b>Extra-Curricular Activity</b> titled:</p>
      <p><strong>${activityTitle}</strong></p>
      
      <div class="verification-box">
        <a href="${approvalLink}" class="button">Review & Approve Activity</a>
        <p class="link-text">Or copy and paste this link:<br>${approvalLink}</p>
      </div>
      
      <div class="warning">
        <strong>Note:</strong> This approval link will expire in 5 days.
      </div>
      
      <p>Thank you,<br>The Institute Portal Team</p>
    </div>
    
    <div class="footer">
      <p>© ${new Date().getFullYear()} Institute Portal. All rights reserved.</p>
    </div>
  </div>
</body>
</html>
  `;
};
