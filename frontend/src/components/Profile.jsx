import React, { useContext, useEffect, useState } from 'react';
import axios from 'axios';
import { User, Mail, Briefcase, Save, ArrowLeft } from 'lucide-react';
import { useNavigate } from 'react-router-dom';
import { AuthContext } from '../context/AuthContext';

function Profile() {
  const navigate = useNavigate();
  const { token } = useContext(AuthContext);

  const [profile, setProfile] = useState({
    name: '',
    email: '',
    targetRole: ''
  });

  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [message, setMessage] = useState('');
  const [error, setError] = useState('');

  useEffect(() => {
    const fetchProfile = async () => {
      if (!token) {
        setError('Not authorized. Please log in again.');
        setLoading(false);
        return;
      }

      try {
        const response = await axios.get(
          'http://localhost:5000/api/profile',
          {
            headers: {
              Authorization: `Bearer ${token}`
            }
          }
        );

        setProfile({
          name: response.data.name || '',
          email: response.data.email || '',
          targetRole: response.data.targetRole || ''
        });

        setError('');
      } catch (error) {
        setError(
          error.response?.data?.message ||
          'Failed to load profile.'
        );
      } finally {
        setLoading(false);
      }
    };

    fetchProfile();
  }, [token]);

  const handleChange = (e) => {
    setProfile({
      ...profile,
      [e.target.name]: e.target.value
    });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    setMessage('');
    setError('');

    if (!profile.name.trim() || !profile.targetRole.trim()) {
      setError('Name and target role are required.');
      return;
    }

    if (!token) {
      setError('Not authorized. Please log in again.');
      return;
    }

    try {
      setSaving(true);

      const response = await axios.put(
        'http://localhost:5000/api/profile',
        {
          name: profile.name.trim(),
          targetRole: profile.targetRole.trim()
        },
        {
          headers: {
            Authorization: `Bearer ${token}`
          }
        }
      );

      setProfile({
        name: response.data.name,
        email: response.data.email,
        targetRole: response.data.targetRole
      });

      setMessage('Profile updated successfully.');
    } catch (error) {
      setError(
        error.response?.data?.message ||
        'Failed to update profile.'
      );
    } finally {
      setSaving(false);
    }
  };

  if (loading) {
    return (
      <div className="profile-page">
        <div className="profile-loading">
          Loading profile...
        </div>
      </div>
    );
  }

  return (
    <div className="profile-page">
      <div className="profile-container">

        <button
          className="profile-back-button"
          onClick={() => navigate('/dashboard')}
        >
          <ArrowLeft size={18} />
          Back to Dashboard
        </button>

        <div className="profile-header">
          <div className="profile-avatar-large">
            {profile.name
              ? profile.name.charAt(0).toUpperCase()
              : 'U'}
          </div>

          <div>
            <h1>My Profile</h1>
            <p>
              Manage your CareerPilot AI profile and career preferences.
            </p>
          </div>
        </div>

        <div className="profile-card">

          <div className="profile-card-header">
            <div>
              <h2>Personal Information</h2>
              <p>
                Keep your career information up to date.
              </p>
            </div>
          </div>

          {error && (
            <div className="auth-error">
              {error}
            </div>
          )}

          {message && (
            <div className="auth-success">
              {message}
            </div>
          )}

          <form
            className="profile-form"
            onSubmit={handleSubmit}
          >

            <div className="profile-field">
              <label>
                <User size={16} />
                Full Name
              </label>

              <input
                type="text"
                name="name"
                value={profile.name}
                onChange={handleChange}
                placeholder="Enter your full name"
              />
            </div>

            <div className="profile-field">
              <label>
                <Mail size={16} />
                Email Address
              </label>

              <input
                type="email"
                value={profile.email}
                disabled
              />

              <span className="profile-hint">
                Email address cannot be changed.
              </span>
            </div>

            <div className="profile-field">
              <label>
                <Briefcase size={16} />
                Target Career Role
              </label>

              <select
                name="targetRole"
                value={profile.targetRole}
                onChange={handleChange}
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
              className="profile-save-button"
              disabled={saving}
            >
              <Save size={18} />

              {saving
                ? 'Saving Changes...'
                : 'Save Changes'}
            </button>

          </form>
        </div>

      </div>
    </div>
  );
}

export default Profile;