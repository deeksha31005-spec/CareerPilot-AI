import React, { useContext, useState } from 'react';
import { ArrowRight } from 'lucide-react';
import { useNavigate } from 'react-router-dom';
import { AuthContext } from '../context/AuthContext';

function LoginModal({
  isOpen,
  onClose,
  openRegisterModal,
  openForgotPasswordModal
}) {
  const { login, loading } = useContext(AuthContext);
  const navigate = useNavigate();

  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');
  const [successMessage, setSuccessMessage] = useState('');

  if (!isOpen) return null;

  const handleSubmit = async (e) => {
    e.preventDefault();

    setError('');
    setSuccessMessage('');

    if (!email || !password) {
      setError('Please enter your email and password.');
      return;
    }

    const result = await login(email, password);

    if (result.success) {
      setSuccessMessage('Login successful! Welcome back.');

      setTimeout(() => {
        onClose();
        setSuccessMessage('');
        navigate('/dashboard');
      }, 800);
    } else {
      setError(result.message);
    }
  };

  const handleForgotPassword = () => {
    setError('');
    setSuccessMessage('');
    onClose();
    openForgotPasswordModal();
  };

  const handleCreateAccount = () => {
    setError('');
    setSuccessMessage('');
    onClose();
    openRegisterModal();
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

        <div className="auth-logo">🚀</div>

        <h2>Welcome Back</h2>

        <p className="auth-subtitle">
          Sign in to continue your CareerPilot AI journey.
        </p>

        {error && (
          <div className="auth-error">
            {error}
          </div>
        )}

        {successMessage && (
          <div className="auth-success">
            {successMessage}
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

          <div className="auth-field">
            <label>Password</label>

            <input
              type="password"
              placeholder="Enter your password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              autoComplete="current-password"
            />
          </div>

          <div className="forgot-password">
            <button
              type="button"
              onClick={handleForgotPassword}
            >
              Forgot password?
            </button>
          </div>

          <button
            type="submit"
            className="auth-submit"
            disabled={loading}
          >
            {loading
              ? 'Signing In...'
              : 'Sign In'}

            {!loading && (
              <ArrowRight size={18} />
            )}
          </button>

        </form>

        <div className="auth-footer">
          Don't have an account?{' '}

          <button
            type="button"
            className="auth-link"
            onClick={handleCreateAccount}
          >
            Create Account
          </button>
        </div>

      </div>
    </div>
  );
}

export default LoginModal;