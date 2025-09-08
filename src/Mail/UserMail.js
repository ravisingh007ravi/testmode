const nodemailer = require("nodemailer");
const dotenv = require("dotenv");
dotenv.config();

const transporter = nodemailer.createTransport({
  host: "smtp.ethereal.email",
  port: 465,
  secure: true, 
  service: "gmail",
  auth: {
    user: process.env.NodeMailerUserName,
    pass: process.env.NodeMailerPassword
  },
});


exports.otpVerificationUser = async (name, email, randomOtp) => {
  try {
    const info = await transporter.sendMail({
      from: '"Your App Name"  ravi6680singh@gmail.com', 
      to: email,
      subject: "OTP Verification - Your App Name",
      html: `
        <div style="font-family: Arial, sans-serif; max-width: 600px; margin: auto; padding: 20px; border: 1px solid #e0e0e0; border-radius: 10px;">
          <h2 style="text-align: center; color: #0163ae;">Welcome to Your App, ${name}!</h2>
          <p style="font-size: 16px; color: #333;">Thank you for registering with us. To complete your verification, please use the following OTP:</p>
          
          <div style="text-align: center; margin: 30px 0;">
            <span style="display: inline-block; background-color: #f0f0f0; padding: 10px 20px; font-size: 24px; letter-spacing: 5px; border-radius: 5px; color: #0163ae; font-weight: bold;">
              ${randomOtp}
            </span>
          </div>

          <p style="font-size: 14px; color: #555;">This OTP is valid for 10 minutes. Do not share it with anyone.</p>
          
          <p style="font-size: 14px; color: #555;">If you did not request this, please ignore this email.</p>
          
          <hr style="margin: 30px 0;" />
          <p style="font-size: 12px; color: #999; text-align: center;">© 2025 Your App Name. All rights reserved.</p>
        </div>
      `
    });

    console.log("Message sent:", info.messageId);
  } catch (e) {
    console.log(e);
  }
};


exports.otpVerificationAdmin = async (name, email, randomOtp) => {
  try {
    const info = await transporter.sendMail({
      from: '"Hartron Admin Panel" <ravi6680singh@gmail.com>',
      to: email,
      subject: "🔐 Admin OTP Verification - Hartron Panel Access",
      html: `
        <div style="font-family: 'Segoe UI', Tahoma, Geneva, Verdana, sans-serif; max-width: 600px; margin: auto; padding: 25px; border: 1px solid #dcdcdc; border-radius: 10px; background-color: #fafafa;">
          
          <h2 style="text-align: center; color: #004080;">Hello Admin ${name},</h2>
          
          <p style="font-size: 16px; color: #333; line-height: 1.6;">
            You are attempting to access the <strong>Hartron Admin Dashboard</strong>. Please verify your identity by entering the One-Time Password (OTP) below:
          </p>
          
          <div style="text-align: center; margin: 30px 0;">
            <span style="display: inline-block; background-color: #e6f2ff; padding: 15px 25px; font-size: 26px; letter-spacing: 6px; border-radius: 6px; color: #004080; font-weight: 600;">
              ${randomOtp}
            </span>
          </div>
          
          <p style="font-size: 14px; color: #555;">🔒 This OTP is valid for <strong>10 minutes</strong> and should not be shared with anyone.</p>
          
          <p style="font-size: 14px; color: #555;">If you did not initiate this action, please contact your system administrator immediately.</p>
          
          <hr style="margin: 30px 0; border-color: #ddd;" />
          
          <p style="font-size: 12px; color: #999; text-align: center;">
            © 2025 Hartron Skill Centre Admin Panel. All rights reserved.
          </p>
        </div>
      `
    });

    console.log("OTP email sent to admin:", info.messageId);
  } catch (e) {
    console.log("Error sending admin OTP email:", e);
  }
};

exports.changeEmail = async (name, email, randomOtp) => {
  console.log(name,email,randomOtp)
  try {
    const info = await transporter.sendMail({
      from: '"Hartron Admin Panel" <ravi6680singh@gmail.com>',
      to: email,
      subject: "🔐 Email Change Verification - Hartron Admin Panel",
      html: `
        <div style="font-family: 'Segoe UI', Tahoma, Geneva, Verdana, sans-serif; max-width: 600px; margin: auto; padding: 25px; border: 1px solid #dcdcdc; border-radius: 10px; background-color: #fafafa;">
          
          <h2 style="text-align: center; color: #004080;">Hi ${name},</h2>
          
          <p style="font-size: 16px; color: #333; line-height: 1.6;">
            You've requested to <strong>change the email address</strong> associated with your <strong>Hartron Admin Panel</strong> account.
          </p>
          
          <p style="font-size: 16px; color: #333; line-height: 1.6;">
            To confirm this change, please enter the following One-Time Password (OTP):
          </p>
          
          <div style="text-align: center; margin: 30px 0;">
            <span style="display: inline-block; background-color: #e6f2ff; padding: 15px 25px; font-size: 26px; letter-spacing: 6px; border-radius: 6px; color: #004080; font-weight: 600;">
              ${randomOtp}
            </span>
          </div>
          
          <p style="font-size: 14px; color: #555;">⚠️ This OTP is valid for <strong>10 minutes</strong>. Do not share it with anyone.</p>
          
          <p style="font-size: 14px; color: #555;">If you did not request this change, please notify your system administrator immediately.</p>
          
          <hr style="margin: 30px 0; border-color: #ddd;" />
          
          <p style="font-size: 12px; color: #999; text-align: center;">
            © 2025 Hartron Skill Centre Admin Panel. All rights reserved.
          </p>
        </div>
      `
    });

    console.log("Email change OTP sent to:", info.messageId);
  } catch (e) {
    console.log("Error sending email change OTP:", e);
  }
};


