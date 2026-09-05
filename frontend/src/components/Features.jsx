import React from 'react';
import {
  FileText,
  MessageSquare,
  Map,
  ArrowRight
} from 'lucide-react';

function Features() {
  return (
    <section id="features" className="features-section">
      <div className="content-wrapper">

        <div className="section-head">
          <span className="section-tag">
            POWERFUL AI FEATURES
          </span>

          <h2>
            What can CareerPilot AI do?
          </h2>

          <p>
            Everything you need to prepare for your dream career,
            from resume optimization to interview preparation.
          </p>
        </div>

        <div className="features-grid">

          <div className="glass-card feature-card">
            <div className="feature-icon-box cyan">
              <FileText size={26} />
            </div>

            <h3>
              AI Resume Analysis
            </h3>

            <p>
              Upload your resume and get an AI-powered ATS score,
              keyword analysis and actionable suggestions to
              improve your resume.
            </p>

            <span className="feature-action">
              Analyze Resume
              <ArrowRight size={15} />
            </span>
          </div>

          <div className="glass-card feature-card">
            <div className="feature-icon-box purple">
              <MessageSquare size={26} />
            </div>

            <h3>
              AI Interview Preparation
            </h3>

            <p>
              Practice technical and behavioral interview questions
              tailored to your target role and receive intelligent
              feedback on your answers.
            </p>

            <span className="feature-action">
              Practice Interviews
              <ArrowRight size={15} />
            </span>
          </div>

          <div className="glass-card feature-card">
            <div className="feature-icon-box blue">
              <Map size={26} />
            </div>

            <h3>
              Personalized Learning Roadmap
            </h3>

            <p>
              Discover the skills you need for your target role and
              follow a personalized roadmap designed around your
              career goals.
            </p>

            <span className="feature-action">
              Explore Roadmap
              <ArrowRight size={15} />
            </span>
          </div>

        </div>
      </div>
    </section>
  );
}

export default Features;