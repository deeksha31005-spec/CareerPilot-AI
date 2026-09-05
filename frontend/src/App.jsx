import { BrowserRouter, Routes, Route, Navigate } from 'react-router-dom';
import { useState, useContext } from 'react';

import Profile from './components/Profile';
import Resume from './components/Resume';
import CareerRoadmap from './components/CareerRoadmap';
import InterviewPrep from './components/InterviewPrep';

import Navbar from './components/Navbar';
import Hero from './components/Hero';
import Features from './components/Features';
import Footer from './components/Footer';

import RegisterModal from './components/RegisterModal';
import LoginModal from './components/LoginModal';
import ForgotPasswordModal from './components/ForgotPasswordModal';
import ResetPassword from './components/ResetPassword';

import Dashboard from './components/Dashboard';

import { AuthContext } from './context/AuthContext';


const ProtectedRoute = ({ children }) => {
  const { user, token, loading } = useContext(AuthContext);

  if (loading) {
    return (
      <div
        style={{
          display: 'flex',
          justifyContent: 'center',
          alignItems: 'center',
          minHeight: '60vh',
          color: '#60a5fa',
          fontSize: '18px'
        }}
      >
        Loading...
      </div>
    );
  }

  if (!user || !token) {
    return <Navigate to="/" replace />;
  }

  return children;
};


const LandingPage = ({
  showLoginModal,
  setShowLoginModal,
  showRegisterModal,
  setShowRegisterModal,
  showForgotPasswordModal,
  setShowForgotPasswordModal,
  openForgotPasswordModal
}) => {

  const openLoginModal = () => {
    setShowRegisterModal(false);
    setShowLoginModal(true);
  };

  const openRegisterModal = () => {
    setShowLoginModal(false);
    setShowRegisterModal(true);
  };

  return (
    <>
      <Navbar
        showLoginModal={showLoginModal}
        setShowLoginModal={setShowLoginModal}
        showRegisterModal={showRegisterModal}
        setShowRegisterModal={setShowRegisterModal}
      />

      <Hero
        onGetStarted={() => {
          setShowRegisterModal(true);
          setShowLoginModal(false);
        }}
      />

      <Features />

      <Footer />

      <LoginModal
        isOpen={showLoginModal}
        onClose={() => setShowLoginModal(false)}
        openRegisterModal={openRegisterModal}
        openForgotPasswordModal={openForgotPasswordModal}
      />

      <RegisterModal
        isOpen={showRegisterModal}
        onClose={() => setShowRegisterModal(false)}
        openLoginModal={openLoginModal}
      />

      <ForgotPasswordModal
        isOpen={showForgotPasswordModal}
        onClose={() => setShowForgotPasswordModal(false)}
        openLoginModal={openLoginModal}
      />
    </>
  );
};


const DashboardPage = () => {
  return (
    <>
      <Navbar
        showLoginModal={false}
        setShowLoginModal={() => {}}
        showRegisterModal={false}
        setShowRegisterModal={() => {}}
      />

      <Dashboard />
    </>
  );
};


function AppRoutes() {

  const [showLoginModal, setShowLoginModal] = useState(false);
  const [showRegisterModal, setShowRegisterModal] = useState(false);
  const [showForgotPasswordModal, setShowForgotPasswordModal] = useState(false);


  const openForgotPasswordModal = () => {
    setShowLoginModal(false);
    setShowRegisterModal(false);
    setShowForgotPasswordModal(true);
  };


  return (
    <Routes>

      {/* Landing Page */}
      <Route
        path="/"
        element={
          <LandingPage
            showLoginModal={showLoginModal}
            setShowLoginModal={setShowLoginModal}
            showRegisterModal={showRegisterModal}
            setShowRegisterModal={setShowRegisterModal}
            showForgotPasswordModal={showForgotPasswordModal}
            setShowForgotPasswordModal={setShowForgotPasswordModal}
            openForgotPasswordModal={openForgotPasswordModal}
          />
        }
      />


      {/* Dashboard */}
      <Route
        path="/dashboard"
        element={
          <ProtectedRoute>
            <DashboardPage />
          </ProtectedRoute>
        }
      />


      {/* Profile */}
      <Route
        path="/profile"
        element={
          <ProtectedRoute>
            <Profile />
          </ProtectedRoute>
        }
      />


      {/* Resume */}
      <Route
        path="/resume"
        element={
          <ProtectedRoute>
            <Resume />
          </ProtectedRoute>
        }
      />


      {/* Career Roadmap */}
      <Route
        path="/career-roadmap"
        element={
          <ProtectedRoute>
            <CareerRoadmap />
          </ProtectedRoute>
        }
      />


      {/* Interview Preparation */}
      <Route
        path="/interview-prep"
        element={
          <ProtectedRoute>
            <InterviewPrep />
          </ProtectedRoute>
        }
      />


      {/* Reset Password */}
      <Route
        path="/reset-password/:token"
        element={<ResetPassword />}
      />


      {/* Unknown Route */}
      <Route
        path="*"
        element={<Navigate to="/" replace />}
      />

    </Routes>
  );
}


function App() {
  return (
    <BrowserRouter>
      <AppRoutes />
    </BrowserRouter>
  );
}


export default App;