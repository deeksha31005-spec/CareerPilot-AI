import React, { useState, useContext } from 'react';
import { Link } from 'react-router-dom';
import { AuthContext } from '../context/AuthContext';
import {
  User,
  LogOut,
  Menu,
  X,
  ChevronDown,
  LayoutDashboard
} from 'lucide-react';

/**
 * Navbar Component
 * Shows navigation links, auth modals trigger when logged out,
 * user avatar dropdown with dashboard, profile and logout
 */
const Navbar = ({
  showLoginModal,
  setShowLoginModal,
  showRegisterModal,
  setShowRegisterModal
}) => {
  const { user, token, logout } = useContext(AuthContext);

  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const [showUserMenu, setShowUserMenu] = useState(false);

  const handleLogout = () => {
    logout();
    setShowUserMenu(false);
  };

  const openLogin = () => {
    setShowLoginModal(true);
    setIsMenuOpen(false);
  };

  const openRegister = () => {
    setShowRegisterModal(true);
    setIsMenuOpen(false);
  };

  return (
    <header className="navbar">
      <div className="nav-content">

        <Link
          to="/"
          className="logo-brand"
          style={{ textDecoration: 'none' }}
        >
          <div className="logo-icon-box">
            <span style={{ fontSize: '20px' }}>🚀</span>
          </div>

          <span className="logo-title">
            CareerPilot AI
          </span>
        </Link>

        <nav className={`nav-links ${isMenuOpen ? 'open' : ''}`}>

          <Link
            to="/"
            className="nav-link"
            onClick={() => setIsMenuOpen(false)}
          >
            Home
          </Link>

          <Link
            to="#features"
            className="nav-link"
            onClick={() => setIsMenuOpen(false)}
          >
            Features
          </Link>

          <Link
            to="#"
            className="nav-link"
            onClick={() => setIsMenuOpen(false)}
          >
            About
          </Link>

          {user && token ? (

            <div
              className="user-menu-wrapper"
              style={{ position: 'relative' }}
            >

              <button
                className="user-avatar-btn"
                onClick={() => setShowUserMenu(!showUserMenu)}
                aria-label="User menu"
                style={{
                  display: 'flex',
                  alignItems: 'center',
                  gap: '10px',
                  background: 'rgba(37, 99, 235, 0.15)',
                  border: '1px solid rgba(59, 130, 246, 0.3)',
                  padding: '8px 16px',
                  borderRadius: '30px',
                  cursor: 'pointer',
                  color: '#60a5fa',
                  fontSize: '14px',
                  fontWeight: '600',
                  transition: 'all 0.3s ease'
                }}
              >

                <div
                  style={{
                    width: '32px',
                    height: '32px',
                    borderRadius: '50%',
                    background:
                      'linear-gradient(135deg, #2563eb, #06b6d4)',
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'center',
                    color: '#fff',
                    fontWeight: '700',
                    fontSize: '14px'
                  }}
                >
                  {user.name?.charAt(0).toUpperCase() || 'U'}
                </div>

                <span
                  style={{
                    maxWidth: '120px',
                    textOverflow: 'ellipsis',
                    overflow: 'hidden',
                    whiteSpace: 'nowrap'
                  }}
                >
                  {user.name}
                </span>

                <ChevronDown size={16} />

              </button>

              {showUserMenu && (

                <div
                  className="user-dropdown"
                  style={{
                    position: 'absolute',
                    top: '110%',
                    right: 0,
                    background: 'var(--bg-card)',
                    backdropFilter: 'blur(16px)',
                    border: '1px solid var(--border-light)',
                    borderRadius: 'var(--radius-md)',
                    padding: '8px',
                    minWidth: '220px',
                    boxShadow:
                      '0 10px 30px -10px rgba(0, 0, 0, 0.5)',
                    zIndex: 1000,
                    animation: 'fadeIn 0.2s ease'
                  }}
                >

                  {/* User Information */}
                  <div
                    style={{
                      padding: '12px 16px',
                      borderBottom:
                        '1px solid var(--border-light)'
                    }}
                  >
                    <div
                      style={{
                        fontWeight: '700',
                        color: '#fff',
                        fontSize: '14px'
                      }}
                    >
                      {user.name}
                    </div>

                    <div
                      style={{
                        fontSize: '12px',
                        color: 'var(--text-muted)',
                        marginTop: '2px'
                      }}
                    >
                      {user.email}
                    </div>

                    <div
                      style={{
                        fontSize: '11px',
                        color: 'var(--cyan)',
                        marginTop: '4px'
                      }}
                    >
                      Target: {user.targetRole || 'Software Engineer'}
                    </div>
                  </div>

                  {/* Dashboard */}
                  <Link
                    to="/dashboard"
                    className="nav-link"
                    style={{
                      display: 'flex',
                      alignItems: 'center',
                      gap: '10px',
                      padding: '10px 16px',
                      borderRadius: 'var(--radius-sm)',
                      color: 'var(--text-main)',
                      textDecoration: 'none'
                    }}
                    onClick={() => setShowUserMenu(false)}
                  >
                    <LayoutDashboard size={18} />
                    Dashboard
                  </Link>

                  {/* Profile */}
                  <Link
                    to="/profile"
                    className="nav-link"
                    style={{
                      display: 'flex',
                      alignItems: 'center',
                      gap: '10px',
                      padding: '10px 16px',
                      borderRadius: 'var(--radius-sm)',
                      color: 'var(--text-main)',
                      textDecoration: 'none'
                    }}
                    onClick={() => setShowUserMenu(false)}
                  >
                    <User size={18} />
                    Profile
                  </Link>

                  {/* Logout */}
                  <button
                    onClick={handleLogout}
                    style={{
                      display: 'flex',
                      alignItems: 'center',
                      gap: '10px',
                      padding: '10px 16px',
                      borderRadius: 'var(--radius-sm)',
                      color: '#fca5a5',
                      background: 'none',
                      border: 'none',
                      cursor: 'pointer',
                      fontSize: '14px',
                      fontWeight: '500',
                      width: '100%',
                      textAlign: 'left'
                    }}
                  >
                    <LogOut size={18} />
                    Logout
                  </button>

                </div>
              )}

            </div>

          ) : (

            // Guest Buttons
            <div
              style={{
                display: 'flex',
                gap: '12px',
                alignItems: 'center'
              }}
            >

              <button
                onClick={openLogin}
                className="btn-secondary"
                style={{
                  padding: '10px 20px',
                  fontSize: '14px'
                }}
              >
                Sign In
              </button>

              <button
                onClick={openRegister}
                className="btn-primary"
                style={{
                  padding: '10px 20px',
                  fontSize: '14px'
                }}
              >
                Get Started
              </button>

            </div>
          )}

        </nav>

        <button
          className="mobile-toggle"
          onClick={() => setIsMenuOpen(!isMenuOpen)}
          aria-label="Toggle navigation"
        >
          {isMenuOpen ? (
            <X size={24} />
          ) : (
            <Menu size={24} />
          )}
        </button>

      </div>
    </header>
  );
};

export default Navbar;