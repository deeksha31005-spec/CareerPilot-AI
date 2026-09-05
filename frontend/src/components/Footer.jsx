import React from 'react';

function Footer() {
  return (
    <footer className="footer">
      <div className="content-wrapper">

        <div className="footer-grid">

          <div className="footer-brand">
            <div className="logo-brand">
              <div className="logo-icon-box">
                🚀
              </div>

              <span className="logo-title">
                CareerPilot AI
              </span>
            </div>

            <p>
              Your AI-powered career companion for resume
              optimization, skill development and interview
              preparation.
            </p>
          </div>

          <div className="footer-col">
            <h4>Platform</h4>

            <ul className="footer-links">
              <li>
                <a href="#features">
                  Features
                </a>
              </li>

              <li>
                <a href="#features">
                  Resume Analysis
                </a>
              </li>

              <li>
                <a href="#features">
                  Interview Prep
                </a>
              </li>
            </ul>
          </div>

          <div className="footer-col">
            <h4>CareerPilot AI</h4>

            <ul className="footer-links">
              <li>
                <a href="#">
                  Home
                </a>
              </li>

              <li>
                <a href="#features">
                  About
                </a>
              </li>

              <li>
                <a href="#features">
                  Features
                </a>
              </li>
            </ul>
          </div>

        </div>

        <div className="footer-bottom">
          © 2026 CareerPilot AI. Built for the future of careers.
        </div>

      </div>
    </footer>
  );
}

export default Footer;