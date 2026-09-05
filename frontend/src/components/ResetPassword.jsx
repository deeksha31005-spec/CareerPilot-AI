import React, { useState } from 'react';
import axios from 'axios';
import { useNavigate, useParams } from 'react-router-dom';

function ResetPassword() {
  const { token } = useParams();
  const navigate = useNavigate();

  const [password, setPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');

  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const [success, setSuccess] = useState('');

  const handleSubmit = async (e) => {
    e.preventDefault();

    setError('');
    setSuccess('');

    if (!password || !confirmPassword) {
      setError('Please enter both password fields.');
      return;
    }

    if (password.length < 6) {
      setError('Password must contain at least 6 characters.');
      return;
    }

    if (password !== confirmPassword) {
      setError('Passwords do not match.');
      return;
    }

    try {
      setLoading(true);

      const response = await axios.post(
        `http://localhost:5000/api/auth/reset-password/${token}`,
        {
          password
        }
      );

      setSuccess(response.data.message);

      setTimeout(() => {
        navigate('/');
      }, 2000);
    } catch (error) {
      setError(
        error.response?.data?.message ||
        'Unable to reset password. Please try again.'
      );
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="auth-overlay">
      <div className="auth-modal">

        <div className="auth-logo">🔐</div>

        <h2>Create New Password</h2>

        <p className="auth-subtitle">
          Enter a new password for your CareerPilot AI account.
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

        {!success && (
          <form
            className="auth-form"
            onSubmit={handleSubmit}
          >

            <div className="auth-field">
              <label>New Password</label>

              <input
                type="password"
                placeholder="Minimum 6 characters"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                autoComplete="new-password"
              />
            </div>

            <div className="auth-field">
              <label>Confirm New Password</label>

              <input
                type="password"
                placeholder="Re-enter your password"
                value={confirmPassword}
                onChange={(e) =>
                  setConfirmPassword(e.target.value)
                }
                autoComplete="new-password"
              />
            </div>

            <button
              type="submit"
              className="auth-submit"
              disabled={loading}
            >
              {loading
                ? 'Updating Password...'
                : 'Update Password'}
            </button>

          </form>
        )}

      </div>
    </div>
  );
}

export default ResetPassword;