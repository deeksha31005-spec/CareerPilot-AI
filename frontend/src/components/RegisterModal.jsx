import React, { useContext, useState } from 'react';
import { ArrowRight } from 'lucide-react';
import { useNavigate } from 'react-router-dom';
import { AuthContext } from '../context/AuthContext';

function RegisterModal({
  isOpen,
  onClose,
  openLoginModal
}) {
  const { register, loading } = useContext(AuthContext);

  const navigate = useNavigate();

  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [targetRole, setTargetRole] = useState('Software Engineer');

  const [error, setError] = useState('');
  const [successMessage, setSuccessMessage] = useState('');

  if (!isOpen) return null;

  const handleSubmit = async (e) => {
    e.preventDefault();

    setError('');
    setSuccessMessage('');

    if (!name || !email || !password) {
      setError('Please fill in all required fields.');
      return;
    }

    if (password.length < 6) {
      setError('Password must contain at least 6 characters.');
      return;
    }

    const result = await register(
      name,
      email,
      password,
      targetRole
    );

    if (result.success) {
      setSuccessMessage(
        'Account created successfully! Welcome to CareerPilot AI.'
      );

      setTimeout(() => {
        onClose();
        setSuccessMessage('');
        navigate('/dashboard');
      }, 800);
    } else {
      setError(result.message);
    }
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

        <div className="auth-logo">
          🚀
        </div>

        <h2>
          Create Account
        </h2>

        <p className="auth-subtitle">
          Join CareerPilot AI and build your career with
          intelligent guidance.
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

            <label>
              Full Name
            </label>

            <input
              type="text"
              placeholder="Enter your full name"
              value={name}
              onChange={(e) => setName(e.target.value)}
              autoComplete="name"
            />

          </div>

          <div className="auth-field">

            <label>
              Email Address
            </label>

            <input
              type="email"
              placeholder="you@example.com"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              autoComplete="email"
            />

          </div>

          <div className="auth-field">

            <label>
              Password
            </label>

            <input
              type="password"
              placeholder="Minimum 6 characters"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              autoComplete="new-password"
            />

          </div>

          <div className="auth-field">

            <label>
              Target Career Role
            </label>

            <select
              value={targetRole}
              onChange={(e) => setTargetRole(e.target.value)}
            >
              <option value="Software Engineer">
                Software Engineer
              </option>

              <option value="Data Scientist">
                Data Scientist
              </option>

              <option value="Machine Learning Engineer">
                Machine Learning Engineer
              </option>

              <option value="AI Engineer">
                AI Engineer
              </option>

              <option value="Data Analyst">
                Data Analyst
              </option>

              <option value="Frontend Developer">
                Frontend Developer
              </option>

              <option value="Backend Developer">
                Backend Developer
              </option>
            </select>

          </div>

          <button
            type="submit"
            className="auth-submit"
            disabled={loading}
          >
            {loading ? 'Creating Account...' : 'Create Account'}
            {!loading && <ArrowRight size={18} />}
          </button>

        </form>

        <div className="auth-footer">

          Already have an account?{' '}

          <button
            type="button"
            className="auth-link"
            onClick={openLoginModal}
          >
            Sign In
          </button>

        </div>

      </div>

    </div>
  );
}

export default RegisterModal;