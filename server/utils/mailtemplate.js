const accountcreated = `
    <div class="header" style="background: #28a745; color: white; padding: 20px; text-align: center;">
        <h2>🎉 Account Created</h2>
    </div>
    <div class="content" style="padding: 30px; text-align: center;">
        <p>Welcome to <strong>Modern-Auth</strong>!</p>
        <p>{{name}} Your account was successfully created. Please verify your email to start using all features.</p>
    </div>
    <div class="footer" style="background: #f1f1f1; padding: 10px; text-align: center; font-size: 12px;">
        &copy; 2025 Modern-Auth. All rights reserved.
    </div>`

const verificationOTPsent =
  `
 <div class="header" style="background: #007bff; color: white; padding: 20px; text-align: center;">
    <h2>📩 Email Verification</h2>
  </div>
  <div class="content" style="padding: 30px; text-align: center;">
    <p>Verify your email address with the code below:</p>
    <div class="otp" style="font-size: 30px; font-weight: bold; background: #eee; padding: 15px 20px; display: inline-block; margin: 15px 0;">{{otp}}</div>
    <p>This code will expire in 15 minutes.</p>
  </div>
  <div class="footer" style="background: #f1f1f1; padding: 10px; text-align: center; font-size: 12px;">
    &copy; 2025 Modern-Auth. All rights reserved.
  </div>`

const acVerSuccess =
  `
   <div class="header" style="background: #20c997; color: white; padding: 20px; text-align: center;">
    <h2>✅ Email Verified</h2>
  </div>
  <div class="content" style="padding: 30px; text-align: center;">
    <p>Thank you! Your email has been successfully verified.</p>
    <p>You can now access all features of your account.</p>
  </div>
  <div class="footer" style="background: #f1f1f1; padding: 10px; text-align: center; font-size: 12px;">
    &copy; 2025 Modern-Auth. All rights reserved.
  </div>`

const resetOTPsent =
  `
<div class="header" style="background: #ffc107; color: black; padding: 20px; text-align: center;">
    <h2>🔐 Password Reset OTP</h2>
  </div>
  <div class="content" style="padding: 30px; text-align: center;">
    <p>Use the OTP below to reset your password:</p>
    <div class="otp" style="font-size: 30px; font-weight: bold; background: #fff3cd; padding: 15px 20px; display: inline-block; margin: 15px 0;">{{otp}}</div>
    <p>This OTP will expire in 10 minutes.</p>
  </div>
  <div class="footer" style="background: #f1f1f1; padding: 10px; text-align: center; font-size: 12px;">
    &copy; 2025 Modern-Auth. All rights reserved.
  </div>
  `
const resetPassSuccess =
  `
  <div class="header" style="background: #17a2b8; color: white; padding: 20px; text-align: center;">
    <h2>🔁 Password Reset Successful</h2>
  </div>
  <div class="content" style="padding: 30px; text-align: center;">
    <p>Your password has been successfully reset.</p>
    <p>If this wasn't you, please contact support immediately.</p>
  </div>
  <div class="footer" style="background: #f1f1f1; padding: 10px; text-align: center; font-size: 12px;">
    &copy; 2025 Modern-Auth. All rights reserved.
  </div>
  `

function tempMail(body) {
  const template = `<!DOCTYPE html>
    <html>
      <head>
        <style>
          body {
            font-family: Arial, sans-serif;
            background: #f4f4f4;
            margin: 0;
            padding: 0;
          }
          .email-container {
            max-width: 500px;
            margin: auto;
            background: #fff;
            border-radius: 10px;
            overflow: hidden;
            box-shadow: 0 2px 10px rgba(0,0,0,0.1);
          }
          .header {
            background: #4a90e2;
            color: white;
            text-align: center;
            padding: 20px;
          }
          .content {
            padding: 30px;
            text-align: center;
          }
          .otp {
            font-size: 32px;
            font-weight: bold;
            background: #f1f1f1;
            padding: 15px 20px;
            margin: 20px 0;
            display: inline-block;
            border-radius: 5px;
            letter-spacing: 2px;
          }
          .footer {
            background: #f1f1f1;
            padding: 10px;
            text-align: center;
            font-size: 12px;
            color: #666;
          }
        </style>
      </head>
      <body>
        ${body}
      </body>
    </html>
    `
  return template
}

export { tempMail, accountcreated, verificationOTPsent, acVerSuccess, resetOTPsent, resetPassSuccess }