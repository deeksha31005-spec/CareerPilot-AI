import React, { useContext, useEffect, useState } from 'react';
import axios from 'axios';
import {
  Upload,
  FileText,
  Trash2,
  ArrowLeft,
  Sparkles,
  Loader2,
  CheckCircle,
  AlertCircle,
  Lightbulb,
  Target
} from 'lucide-react';
import { useNavigate } from 'react-router-dom';
import { AuthContext } from '../context/AuthContext';

function Resume() {
  const navigate = useNavigate();
  const { token } = useContext(AuthContext);

  const [file, setFile] = useState(null);
  const [resume, setResume] = useState(null);

  const [uploading, setUploading] = useState(false);
  const [analyzing, setAnalyzing] = useState(false);

  const [analysis, setAnalysis] = useState(null);

  const [message, setMessage] = useState('');
  const [error, setError] = useState('');

  useEffect(() => {
    const fetchProfile = async () => {
      if (!token) {
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

        if (response.data.resume?.fileName) {
          setResume(response.data.resume);
        }

        // Restore previously saved AI analysis
        if (
          response.data.resumeAnalysis &&
          response.data.resumeAnalysis.analyzedAt
        ) {
          setAnalysis(response.data.resumeAnalysis);
        }

      } catch (error) {
        console.error('Failed to load resume:', error);
      }
    };

    fetchProfile();
  }, [token]);

  const handleFileChange = (e) => {
    const selectedFile = e.target.files[0];

    setMessage('');
    setError('');
    setAnalysis(null);

    if (!selectedFile) {
      return;
    }

    const allowedTypes = [
      'application/pdf',
      'application/msword',
      'application/vnd.openxmlformats-officedocument.wordprocessingml.document'
    ];

    if (!allowedTypes.includes(selectedFile.type)) {
      setError('Only PDF, DOC, and DOCX files are allowed.');
      setFile(null);
      return;
    }

    if (selectedFile.size > 5 * 1024 * 1024) {
      setError('File size must be less than 5 MB.');
      setFile(null);
      return;
    }

    setFile(selectedFile);
  };

  const handleUpload = async () => {
    if (!file) {
      setError('Please select a resume file.');
      return;
    }

    if (!token) {
      setError('Not authorized. Please log in again.');
      return;
    }

    try {
      setUploading(true);
      setMessage('');
      setError('');
      setAnalysis(null);

      const formData = new FormData();
      formData.append('resume', file);

      const response = await axios.post(
        'http://localhost:5000/api/resume/upload',
        formData,
        {
          headers: {
            Authorization: `Bearer ${token}`
          }
        }
      );

      setResume(response.data.resume);
      setMessage('Resume uploaded successfully.');
      setFile(null);

    } catch (error) {
      setError(
        error.response?.data?.message ||
        'Failed to upload resume.'
      );
    } finally {
      setUploading(false);
    }
  };

  const handleAnalyze = async () => {
    if (!token) {
      setError('Not authorized. Please log in again.');
      return;
    }

    if (!resume) {
      setError('Please upload a resume first.');
      return;
    }

    try {
      setAnalyzing(true);
      setMessage('');
      setError('');
      setAnalysis(null);

      const response = await axios.get(
        'http://localhost:5000/api/resume-analyzer',
        {
          headers: {
            Authorization: `Bearer ${token}`
          }
        }
      );

      setAnalysis(response.data.analysis);
      setMessage('AI resume analysis completed successfully.');

    } catch (error) {
      setError(
        error.response?.data?.message ||
        'Failed to analyze resume.'
      );
    } finally {
      setAnalyzing(false);
    }
  };

  const handleDelete = async () => {
    if (!token) {
      setError('Not authorized. Please log in again.');
      return;
    }

    try {
      setError('');
      setMessage('');
      setAnalysis(null);

      await axios.delete(
        'http://localhost:5000/api/resume',
        {
          headers: {
            Authorization: `Bearer ${token}`
          }
        }
      );

      setResume(null);
      setMessage('Resume deleted successfully.');

    } catch (error) {
      setError(
        error.response?.data?.message ||
        'Failed to delete resume.'
      );
    }
  };

  return (
    <div className="resume-page">
      <div className="resume-container">

        <button
          className="profile-back-button"
          onClick={() => navigate('/dashboard')}
        >
          <ArrowLeft size={18} />
          Back to Dashboard
        </button>

        <div className="resume-header">
          <div className="resume-icon-large">
            <FileText size={32} />
          </div>

          <div>
            <h1>My Resume</h1>
            <p>
              Upload and manage your resume for CareerPilot AI analysis.
            </p>
          </div>
        </div>

        <div className="resume-card">

          <div className="resume-card-header">
            <h2>Upload Resume</h2>

            <p>
              Supported formats: PDF, DOC, DOCX · Maximum size: 5 MB
            </p>
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

          <label className="resume-upload-box">

            <Upload size={32} />

            <strong>
              {file
                ? file.name
                : 'Choose your resume'}
            </strong>

            <span>
              Click to browse your files
            </span>

            <input
              type="file"
              accept=".pdf,.doc,.docx"
              onChange={handleFileChange}
            />

          </label>

          {file && (
            <button
              className="resume-upload-button"
              onClick={handleUpload}
              disabled={uploading}
            >
              {uploading ? (
                <Loader2 size={18} className="spin-icon" />
              ) : (
                <Upload size={18} />
              )}

              {uploading
                ? 'Uploading...'
                : 'Upload Resume'}
            </button>
          )}

        </div>

        {resume && (
          <div className="resume-card">

            <div className="resume-card-header">
              <h2>Current Resume</h2>
            </div>

            <div className="resume-file-item">

              <div className="resume-file-info">

                <div className="resume-file-icon">
                  <FileText size={22} />
                </div>

                <div>
                  <strong>{resume.fileName}</strong>

                  <span>
                    Uploaded on{' '}
                    {resume.uploadedAt
                      ? new Date(
                          resume.uploadedAt
                        ).toLocaleDateString()
                      : ''}
                  </span>
                </div>

              </div>

              <button
                className="resume-delete-button"
                onClick={handleDelete}
              >
                <Trash2 size={18} />
                Delete
              </button>

            </div>

            <button
              className="resume-analyze-button"
              onClick={handleAnalyze}
              disabled={analyzing}
            >
              {analyzing ? (
                <Loader2 size={18} className="spin-icon" />
              ) : (
                <Sparkles size={18} />
              )}

              {analyzing
                ? 'Analyzing Resume...'
                : 'Analyze Resume'}
            </button>

          </div>
        )}

        {analysis && (
          <div className="resume-analysis-container">

            {/* ATS SCORE */}

            <div className="resume-card ats-score-card">

              <div className="resume-card-header">
                <h2>ATS Score</h2>

                <p>
                  How well your resume matches your target role.
                </p>
              </div>

              <div className="ats-score-content">

                <div className="ats-score-circle">
                  <span>
                    {analysis.atsScore}
                  </span>

                  <small>
                    / 100
                  </small>
                </div>

                <div className="ats-score-info">

                  <h3>
                    {analysis.atsScore >= 80
                      ? 'Excellent Resume'
                      : analysis.atsScore >= 60
                      ? 'Good Resume'
                      : analysis.atsScore >= 40
                      ? 'Needs Improvement'
                      : 'Major Improvements Needed'}
                  </h3>

                  <p>
                    {analysis.summary}
                  </p>

                </div>

              </div>

            </div>

            {/* STRENGTHS */}

            <div className="resume-card">

              <div className="resume-card-header">

                <h2>
                  <CheckCircle size={20} />
                  Resume Strengths
                </h2>

                <p>
                  Strong areas identified by the AI analyzer.
                </p>

              </div>

              <div className="analysis-list">

                {analysis.strengths?.map(
                  (item, index) => (
                    <div
                      className="analysis-list-item strength-item"
                      key={index}
                    >
                      <CheckCircle size={18} />
                      <span>{item}</span>
                    </div>
                  )
                )}

              </div>

            </div>

            {/* MISSING SKILLS */}

            <div className="resume-card">

              <div className="resume-card-header">

                <h2>
                  <Target size={20} />
                  Missing Skills
                </h2>

                <p>
                  Skills you should consider developing for your target role.
                </p>

              </div>

              <div className="analysis-list">

                {analysis.missingSkills?.length > 0 ? (
                  analysis.missingSkills.map(
                    (item, index) => (
                      <div
                        className="analysis-list-item missing-item"
                        key={index}
                      >
                        <AlertCircle size={18} />
                        <span>{item}</span>
                      </div>
                    )
                  )
                ) : (
                  <p className="analysis-empty">
                    No major missing skills identified.
                  </p>
                )}

              </div>

            </div>

            {/* MISSING KEYWORDS */}

            <div className="resume-card">

              <div className="resume-card-header">

                <h2>
                  <Sparkles size={20} />
                  Missing ATS Keywords
                </h2>

                <p>
                  Keywords that could improve your resume's ATS compatibility.
                </p>

              </div>

              <div className="keyword-list">

                {analysis.missingKeywords?.length > 0 ? (
                  analysis.missingKeywords.map(
                    (keyword, index) => (
                      <span
                        className="keyword-tag"
                        key={index}
                      >
                        {keyword}
                      </span>
                    )
                  )
                ) : (
                  <p className="analysis-empty">
                    No major missing keywords identified.
                  </p>
                )}

              </div>

            </div>

            {/* IMPROVEMENTS */}

            <div className="resume-card">

              <div className="resume-card-header">

                <h2>
                  <Lightbulb size={20} />
                  Improvement Suggestions
                </h2>

                <p>
                  Practical changes you can make to improve your resume.
                </p>

              </div>

              <div className="analysis-list">

                {analysis.improvements?.map(
                  (item, index) => (
                    <div
                      className="analysis-list-item improvement-item"
                      key={index}
                    >
                      <span className="analysis-number">
                        {index + 1}
                      </span>

                      <span>{item}</span>
                    </div>
                  )
                )}

              </div>

            </div>

            {/* SECTION ANALYSIS */}

            <div className="resume-card">

              <div className="resume-card-header">

                <h2>
                  <FileText size={20} />
                  Section Analysis
                </h2>

                <p>
                  AI evaluation of each resume section.
                </p>

              </div>

              <div className="section-analysis">

                {Object.entries(
                  analysis.sectionAnalysis || {}
                ).map(([section, feedback]) => (
                  <div
                    className="section-analysis-item"
                    key={section}
                  >

                    <strong>
                      {section.charAt(0).toUpperCase() +
                        section.slice(1)}
                    </strong>

                    <p>
                      {feedback}
                    </p>

                  </div>
                ))}

              </div>

            </div>

          </div>
        )}

      </div>
    </div>
  );
}

export default Resume;