import React, {
  useContext,
  useEffect,
  useState
} from 'react';

import axios from 'axios';

import {
  ArrowLeft,
  Sparkles,
  Loader2,
  Target,
  BookOpen,
  CheckCircle,
  Briefcase,
  Award,
  AlertCircle
} from 'lucide-react';

import { useNavigate } from 'react-router-dom';
import { AuthContext } from '../context/AuthContext';


function CareerRoadmap() {

  const navigate = useNavigate();

  const { token } = useContext(AuthContext);


  const [roadmap, setRoadmap] = useState(null);

  const [loading, setLoading] = useState(false);

  const [loadingSavedRoadmap, setLoadingSavedRoadmap] =
    useState(true);

  const [error, setError] = useState('');

  const [message, setMessage] = useState('');


  /*
   * =========================================
   * LOAD SAVED ROADMAP
   * =========================================
   *
   * This request ONLY reads MongoDB.
   *
   * It does NOT call OpenRouter.
   *
   * Therefore, it does NOT consume AI credits.
   */

  useEffect(() => {

    const loadSavedRoadmap = async () => {

      if (!token) {
        setLoadingSavedRoadmap(false);
        return;
      }

      try {

        const response = await axios.get(
          'http://localhost:5000/api/career-roadmap/history',
          {
            headers: {
              Authorization: `Bearer ${token}`
            }
          }
        );


        if (response.data?.roadmap) {

          setRoadmap(response.data.roadmap);

          setMessage(
            'Saved career roadmap loaded.'
          );

        }

      } catch (error) {

        console.error(
          'Load Saved Roadmap Error:',
          error
        );

      } finally {

        setLoadingSavedRoadmap(false);

      }

    };


    loadSavedRoadmap();

  }, [token]);


  /*
   * =========================================
   * GENERATE NEW ROADMAP
   * =========================================
   *
   * This DOES call OpenRouter.
   *
   * Use this button only when you actually
   * want to generate a new roadmap.
   */

  const handleGenerateRoadmap = async () => {

    if (!token) {

      setError(
        'Not authorized. Please log in again.'
      );

      return;
    }


    try {

      setLoading(true);

      setError('');

      setMessage('');

      setRoadmap(null);


      const response = await axios.get(
        'http://localhost:5000/api/career-roadmap',
        {
          headers: {
            Authorization: `Bearer ${token}`
          }
        }
      );


      setRoadmap(
        response.data.roadmap
      );


      setMessage(
        'Career roadmap generated successfully.'
      );


    } catch (error) {

      setError(
        error.response?.data?.message ||
        'Failed to generate career roadmap.'
      );

    } finally {

      setLoading(false);

    }

  };


  /*
   * =========================================
   * PAGE
   * =========================================
   */

  return (

    <div className="resume-page">

      <div className="resume-container">


        {/* BACK BUTTON */}

        <button
          className="profile-back-button"
          onClick={() => navigate('/dashboard')}
        >

          <ArrowLeft size={18} />

          Back to Dashboard

        </button>


        {/* HEADER */}

        <div className="resume-header">

          <div className="resume-icon-large">

            <Target size={32} />

          </div>


          <div>

            <h1>
              Career Roadmap
            </h1>

            <p>
              Get a personalized AI-powered career
              roadmap based on your resume.
            </p>

          </div>

        </div>


        {/* GENERATE CARD */}

        <div className="resume-card">

          <div className="resume-card-header">

            <h2>

              <Sparkles size={20} />

              AI Career Roadmap

            </h2>


            <p>

              CareerPilot AI will analyze your resume
              and target role to identify your skill
              gaps and recommended learning path.

            </p>

          </div>


          {/* ERROR */}

          {error && (

            <div className="auth-error">

              <AlertCircle size={18} />

              {error}

            </div>

          )}


          {/* SUCCESS MESSAGE */}

          {message && (

            <div className="auth-success">

              <CheckCircle size={18} />

              {message}

            </div>

          )}


          {/* LOADING SAVED ROADMAP */}

          {loadingSavedRoadmap && (

            <div className="analysis-empty">

              Loading saved roadmap...

            </div>

          )}


          {/* GENERATE BUTTON */}

          <button
            className="resume-analyze-button"
            onClick={handleGenerateRoadmap}
            disabled={loading || loadingSavedRoadmap}
          >

            {loading ? (

              <Loader2
                size={18}
                className="spin-icon"
              />

            ) : (

              <Sparkles size={18} />

            )}


            {loading
              ? 'Generating Roadmap...'
              : 'Generate Career Roadmap'}

          </button>


        </div>


        {/* =====================================
            ROADMAP RESULTS
        ====================================== */}

        {roadmap && (

          <div className="resume-analysis-container">


            {/* CAREER TARGET */}

            <div className="resume-card">

              <div className="resume-card-header">

                <h2>

                  <Target size={20} />

                  Your Career Target

                </h2>

              </div>


              <div className="roadmap-target-grid">


                <div className="roadmap-info-box">

                  <span>
                    Target Role
                  </span>

                  <strong>
                    {roadmap.targetRole}
                  </strong>

                </div>


                <div className="roadmap-info-box">

                  <span>
                    Current Level
                  </span>

                  <strong>
                    {roadmap.currentLevel}
                  </strong>

                </div>


              </div>


              <div className="roadmap-summary">

                <strong>
                  Career Summary
                </strong>

                <p>
                  {roadmap.careerSummary}
                </p>

              </div>


            </div>


            {/* SKILL GAP */}

            <div className="resume-card">

              <div className="resume-card-header">

                <h2>

                  <AlertCircle size={20} />

                  Skill Gap

                </h2>


                <p>

                  Important skills you should develop
                  for your target role.

                </p>

              </div>


              <div className="keyword-list">

                {roadmap.skillGap?.length > 0 ? (

                  roadmap.skillGap.map(
                    (skill, index) => (

                      <span
                        className="keyword-tag"
                        key={index}
                      >

                        {skill}

                      </span>

                    )
                  )

                ) : (

                  <p className="analysis-empty">

                    No major skill gaps identified.

                  </p>

                )}

              </div>

            </div>


            {/* LEARNING ROADMAP */}

            <div className="resume-card">

              <div className="resume-card-header">

                <h2>

                  <BookOpen size={20} />

                  Your Learning Roadmap

                </h2>


                <p>

                  Follow these phases to move toward
                  your target role.

                </p>

              </div>


              <div className="career-roadmap">

                {roadmap.roadmap?.map(
                  (phase, index) => (

                    <div
                      className="career-phase"
                      key={index}
                    >


                      <div className="career-phase-number">

                        {phase.phase}

                      </div>


                      <div className="career-phase-content">


                        <div className="career-phase-header">

                          <div>

                            <h3>
                              {phase.title}
                            </h3>

                            <span>
                              {phase.duration}
                            </span>

                          </div>

                        </div>


                        {/* SKILLS */}

                        <div className="roadmap-section">

                          <strong>
                            Skills to Learn
                          </strong>


                          <div className="keyword-list">

                            {phase.skills?.map(
                              (skill, skillIndex) => (

                                <span
                                  className="keyword-tag"
                                  key={skillIndex}
                                >

                                  {skill}

                                </span>

                              )
                            )}

                          </div>

                        </div>


                        {/* TASKS */}

                        <div className="roadmap-section">

                          <strong>
                            Action Tasks
                          </strong>


                          <div className="analysis-list">

                            {phase.tasks?.map(
                              (task, taskIndex) => (

                                <div
                                  className="analysis-list-item improvement-item"
                                  key={taskIndex}
                                >

                                  <CheckCircle size={18} />

                                  <span>
                                    {task}
                                  </span>

                                </div>

                              )
                            )}

                          </div>

                        </div>


                      </div>

                    </div>

                  )
                )}

              </div>

            </div>


            {/* RECOMMENDED PROJECTS */}

            <div className="resume-card">

              <div className="resume-card-header">

                <h2>

                  <Briefcase size={20} />

                  Recommended Projects

                </h2>


                <p>

                  Projects that can strengthen
                  your portfolio.

                </p>

              </div>


              <div className="analysis-list">

                {roadmap.recommendedProjects?.map(
                  (project, index) => (

                    <div
                      className="analysis-list-item improvement-item"
                      key={index}
                    >

                      <span className="analysis-number">

                        {index + 1}

                      </span>


                      <span>

                        {project}

                      </span>

                    </div>

                  )
                )}

              </div>

            </div>


            {/* RECOMMENDED CERTIFICATIONS */}

            <div className="resume-card">

              <div className="resume-card-header">

                <h2>

                  <Award size={20} />

                  Recommended Certifications

                </h2>


                <p>

                  Certifications that may support
                  your career goals.

                </p>

              </div>


              <div className="analysis-list">

                {roadmap.recommendedCertifications?.map(
                  (certification, index) => (

                    <div
                      className="analysis-list-item strength-item"
                      key={index}
                    >

                      <Award size={18} />

                      <span>

                        {certification}

                      </span>

                    </div>

                  )
                )}

              </div>

            </div>


          </div>

        )}

      </div>

    </div>

  );

}


export default CareerRoadmap;