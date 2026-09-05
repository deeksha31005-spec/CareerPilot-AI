import dotenv from 'dotenv';
dotenv.config();

import crypto from 'crypto';
import jwt from 'jsonwebtoken';
import { Resend } from 'resend';
import User from '../models/User.js';

const resend = new Resend(process.env.RESEND_API_KEY);

export const forgotPassword = async (req, res) => {
  try {
    const { email } = req.body;

    if (!email) {
      return res.status(400).json({
        message: 'Please provide your email address.'
      });
    }

    const normalizedEmail = email.toLowerCase().trim();

    const user = await User.findOne({
      email: normalizedEmail
    });

    // Do not reveal whether an email exists.
    if (!user) {
      return res.json({
        message:
          'If an account exists with this email, a password reset link has been sent.'
      });
    }

    // Create a secure JWT reset token.
    const resetToken = jwt.sign(
      {
        userId: user._id.toString(),
        purpose: 'password-reset'
      },
      process.env.JWT_SECRET,
      {
        expiresIn: '15m'
      }
    );

    const frontendUrl =
      process.env.FRONTEND_URL ||
      'http://localhost:3000';

    const resetUrl =
      `${frontendUrl}/reset-password/${resetToken}`;

    await resend.emails.send({
      from: process.env.EMAIL_FROM,
      to: user.email,
      subject: 'CareerPilot AI - Reset Your Password',

      html: `
        <div style="
          font-family: Arial, sans-serif;
          max-width: 600px;
          margin: auto;
          padding: 30px;
          background: #0f172a;
          color: #f8fafc;
          border-radius: 16px;
        ">

          <h1 style="
            color: #60a5fa;
            margin-bottom: 10px;
          ">
            🚀 CareerPilot AI
          </h1>

          <h2>Reset Your Password</h2>

          <p style="
            color: #cbd5e1;
            line-height: 1.6;
          ">
            We received a request to reset your CareerPilot AI
            account password.
          </p>

          <p style="
            color: #cbd5e1;
            line-height: 1.6;
          ">
            Click the button below to create a new password.
          </p>

          <div style="margin: 30px 0;">

            <a
              href="${resetUrl}"
              style="
                display: inline-block;
                padding: 14px 24px;
                background: #2563eb;
                color: white;
                text-decoration: none;
                border-radius: 8px;
                font-weight: bold;
              "
            >
              Reset Password
            </a>

          </div>

          <p style="
            color: #94a3b8;
            font-size: 13px;
          ">
            This link will expire in 15 minutes.
          </p>

          <p style="
            color: #94a3b8;
            font-size: 13px;
          ">
            If you did not request a password reset,
            you can safely ignore this email.
          </p>

        </div>
      `
    });

    return res.json({
      message:
        'If an account exists with this email, a password reset link has been sent.'
    });

  } catch (error) {
    console.error('Forgot Password Error:', error);

    return res.status(500).json({
      message:
        'Unable to send password reset email. Please try again later.'
    });
  }
};


export const resetPassword = async (req, res) => {
  try {
    const { token } = req.params;
    const { password } = req.body;

    if (!token) {
      return res.status(400).json({
        message: 'Invalid password reset link.'
      });
    }

    if (!password) {
      return res.status(400).json({
        message: 'Please provide a new password.'
      });
    }

    if (password.length < 6) {
      return res.status(400).json({
        message: 'Password must contain at least 6 characters.'
      });
    }

    let decoded;

    try {
      decoded = jwt.verify(
        token,
        process.env.JWT_SECRET
      );
    } catch (error) {
      return res.status(400).json({
        message:
          'Password reset link is invalid or has expired.'
      });
    }

    if (decoded.purpose !== 'password-reset') {
      return res.status(400).json({
        message:
          'Password reset link is invalid or has expired.'
      });
    }

    const user = await User.findById(decoded.userId);

    if (!user) {
      return res.status(400).json({
        message:
          'Password reset link is invalid or has expired.'
      });
    }

    user.password = password;

    // Clear the old database reset fields.
    user.resetPasswordToken = null;
    user.resetPasswordExpires = null;

    await user.save();

    return res.json({
      message:
        'Password reset successful. You can now sign in.'
    });

  } catch (error) {
    console.error('Reset Password Error:', error);

    return res.status(500).json({
      message:
        'Unable to reset password. Please try again.'
    });
  }
};