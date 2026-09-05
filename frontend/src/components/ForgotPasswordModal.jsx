import React, { useState } from 'react';
import axios from 'axios';

function ForgotPasswordModal({
  isOpen,
  onClose,
  openLoginModal
}) {
  const [email, setEmail] = useState('');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const [success, setSuccess] = useState('');

  if (!isOpen) return null;

  const handleSubmit = async (e) => {
    e.preventDefault();

    setError('');
    setSuccess('');

    if (!email) {
      setError('Please enter your email address.');
      return;
    }

    try {
      setLoading(true);

      const response = await axios.post(
        'http://localhost:5000/api/auth/forgot-password',
        {
          email: email.trim()
        }
      );

      setSuccess(response.data.message);
    } catch (error) {
      setError(
        error.response?.data?.message ||
        'Unable to send reset email. Please try again.'
      );
    } finally {
      setLoading(false);
    }
  };

  const handleBackToLogin = () => {
    setEmail('');
    setError('');
    setSuccess('');
    openLoginModal();
  };

  return (
    <div
      className="auth-overlay"
      onMouseDown={(e) => {
        if (e.target === e.currentTarget) {
          onClose();
        }
      }}
    >
      <div className="auth-modal">

        <button
          className="auth-close"
          onClick={onClose}
          aria-label="Close"
        >
          ×
        </button>

        <div className="auth-logo">🔐</div>

        <h2>Forgot Password?</h2>

        <p className="auth-subtitle">
          Enter your registered email address and we'll
          send you a secure password reset link.
        </p>

        {error && (
          <div className="auth-error">
            {error}
          </div>
        )}

        {success && (
          <div className="auth-success">
            {success}
          </div>
        )}

        <form
          className="auth-form"
          onSubmit={handleSubmit}
        >
          <div className="auth-field">

            <label>Email Address</label>

            <input
              type="email"
              placeholder="you@example.com"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              autoComplete="email"
            />

          </div>

          <button
            type="submit"
            className="auth-submit"
            disabled={loading}
          >
            {loading
              ? 'Sending Reset Link...'
              : 'Send Reset Link'}
          </button>
        </form>

        <div className="auth-footer">

          Remember your password?{' '}

          <button
            type="button"
            className="auth-link"
            onClick={handleBackToLogin}
          >
            Sign In
          </button>

        </div>

      </div>
    </div>
  );
}

export default ForgotPasswordModal;