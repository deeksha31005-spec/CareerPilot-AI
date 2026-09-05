import React from 'react';
import {
  Sparkles,
  ArrowRight,
  FileText,
  MessageSquare,
  Map
} from 'lucide-react';

function Hero({ onGetStarted }) {
  return (
    <section className="hero-section">
      <div className="content-wrapper hero-container">

        {/* LEFT SIDE */}
        <div className="hero-content">

          <div className="hero-badge">
            <Sparkles size={15} />
            AI-POWERED CAREER GUIDANCE
          </div>

          <h1 className="hero-title">
            Your AI Career Companion
          </h1>

          <p className="hero-description">
            Get personalized career guidance, resume analysis,
            skill roadmaps and interview preparation — all in
            one intelligent platform.
          </p>

          <div className="hero-cta-group">

            <button
              className="btn-primary"
              onClick={onGetStarted}
            >
              Start Your Journey
              <ArrowRight size={18} />
            </button>

            <a
              href="#features"
              className="btn-secondary"
            >
              Explore Features
            </a>

          </div>

          <div className="hero-stats-row">

            <div className="stat-item">
              <span className="stat-number">AI</span>
              <span className="stat-label">
                Career Guidance
              </span>
            </div>

            <div className="stat-divider"></div>

            <div className="stat-item">
              <span className="stat-number">ATS</span>
              <span className="stat-label">
                Resume Analysis
              </span>
            </div>

            <div className="stat-divider"></div>

            <div className="stat-item">
              <span className="stat-number">24/7</span>
              <span className="stat-label">
                Interview Practice
              </span>
            </div>

          </div>

        </div>

        {/* RIGHT SIDE */}
        <div className="hero-preview">

          <div className="glass-card preview-card-wrap">

            <div className="preview-topbar">

              <div className="window-dots">
                <span className="w-dot red"></span>
                <span className="w-dot yellow"></span>
                <span className="w-dot green"></span>
              </div>

              <span className="window-title">
                CareerPilot AI Workspace
              </span>

            </div>

            <div className="score-widget">

              <div className="score-badge-circle">
                <span className="score-val">ATS</span>
                <span className="score-max">AI</span>
              </div>

              <div className="score-meta">

                <h4>Resume ATS Analysis</h4>

                <p>
                  Get an AI-powered score for your resume.
                </p>

                <div className="pill-group">

                  <span className="pill success">
                    Smart Analysis
                  </span>

                  <span className="pill purple">
                    AI Powered
                  </span>

                </div>

              </div>

            </div>

            <div className="ai-chat-snippet">

              <div className="ai-avatar">
                AI
              </div>

              <p className="ai-text">
                "Get personalized insights to improve your
                resume, skills and interview readiness."
              </p>

            </div>

            <div className="preview-features">

              <div className="preview-feature resume">
                <FileText size={15} />
                Resume
              </div>

              <div className="preview-feature interview">
                <MessageSquare size={15} />
                Interview
              </div>

              <div className="preview-feature roadmap">
                <Map size={15} />
                Roadmap
              </div>

            </div>

          </div>

        </div>

      </div>
    </section>
  );
}

export default Hero;