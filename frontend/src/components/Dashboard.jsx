import React, { useState, useEffect, useContext } from 'react';
import { AuthContext } from '../context/AuthContext';
import axios from 'axios';
import {
  FileText,
  MessageSquare,
  Map,
  Award,
  Sparkles,
  CheckCircle2
} from 'lucide-react';
import { useNavigate } from 'react-router-dom';

const Dashboard = () => {
  const { user, token } = useContext(AuthContext);
  const navigate = useNavigate();

  const [dashboardData, setDashboardData] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchDashboard = async () => {
      try {
        const response = await axios.get(
          'http://localhost:5000/api/dashboard',
          {
            headers: {
              Authorization: `Bearer ${token}`
            }
          }
        );

        setDashboardData(response.data);
      } catch (error) {
        console.error(
          'Failed to fetch dashboard metrics:',
          error
        );
      } finally {
        setLoading(false);
      }
    };

    if (token) {
      fetchDashboard();
    } else {
      setLoading(false);
    }
  }, [token]);

  const stats = dashboardData?.stats || {
    resumesAnalyzed: 0,
    interviewsCompleted: 0,
    roadmapsCreated: 0,
    profileScore: 0,
    atsScore: 0
  };

  const activities = dashboardData?.recentActivity || [];

  if (loading) {
    return (
      <div
        style={{
          minHeight: '60vh',
          display: 'flex',
          justifyContent: 'center',
          alignItems: 'center',
          color: '#60a5fa',
          fontSize: '18px'
        }}
      >
        Loading dashboard...
      </div>
    );
  }

  return (
    <div
      className="dashboard-container"
      style={{
        padding: '30px 0 80px'
      }}
    >

      {/* TOP BANNER */}

      <div
        className="glass-card"
        style={{
          padding: '32px',
          marginBottom: '32px',
          border: '1px solid var(--border-glow)'
        }}
      >
        <div
          style={{
            display: 'flex',
            justifyContent: 'space-between',
            alignItems: 'center',
            flexWrap: 'wrap',
            gap: '20px'
          }}
        >

          <div>
            <div
              className="hero-badge"
              style={{
                marginBottom: '12px'
              }}
            >
              <Sparkles size={14} />
              ACTIVE AI CAREER PILOT
            </div>

            <h1
              style={{
                fontSize: '32px',
                fontWeight: '800',
                color: '#ffffff',
                marginBottom: '8px'
              }}
            >
              Welcome back, {user?.name || 'Developer'}! 👋
            </h1>

            <p
              style={{
                color: 'var(--text-muted)',
                fontSize: '15px'
              }}
            >
              Target Role:{' '}
              <strong
                style={{
                  color: '#60a5fa'
                }}
              >
                {dashboardData?.user?.targetRole || 'Software Engineer'}
              </strong>{' '}
              | Ready to boost your interview readiness?
            </p>
          </div>

          {/* Career Readiness */}

          <div
            style={{
              display: 'flex',
              alignItems: 'center',
              gap: '16px',
              background: 'rgba(15,23,42,0.6)',
              padding: '16px 24px',
              borderRadius: '16px'
            }}
          >
            <div
              style={{
                textAlign: 'right'
              }}
            >
              <span
                style={{
                  fontSize: '12px',
                  color: 'var(--text-muted)',
                  display: 'block'
                }}
              >
                Career Readiness
              </span>

              <strong
                style={{
                  fontSize: '20px',
                  color: '#34d399'
                }}
              >
                {stats.profileScore}% Optimized
              </strong>
            </div>

            <div
              style={{
                width: '48px',
                height: '48px',
                borderRadius: '50%',
                border: '4px solid #34d399',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                fontWeight: '800',
                fontSize: '14px',
                color: '#fff'
              }}
            >
              {stats.profileScore}%
            </div>
          </div>

        </div>
      </div>


      {/* METRICS */}

      <div
        style={{
          display: 'grid',
          gridTemplateColumns:
            'repeat(auto-fit, minmax(220px, 1fr))',
          gap: '20px',
          marginBottom: '36px'
        }}
      >

        {/* Resumes */}

        <div
          className="glass-card"
          style={{
            padding: '24px'
          }}
        >
          <div
            style={{
              display: 'flex',
              justifyContent: 'space-between',
              alignItems: 'center',
              marginBottom: '12px'
            }}
          >
            <span
              style={{
                fontSize: '13px',
                color: 'var(--text-muted)',
                fontWeight: '600'
              }}
            >
              RESUMES ANALYZED
            </span>

            <div
              style={{
                width: '36px',
                height: '36px',
                background: 'rgba(6,182,212,0.15)',
                color: 'var(--cyan)',
                borderRadius: '10px',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center'
              }}
            >
              <FileText size={20} />
            </div>
          </div>

          <h3
            style={{
              fontSize: '28px',
              fontWeight: '800',
              color: '#fff'
            }}
          >
            {stats.resumesAnalyzed}
          </h3>

          <span
            style={{
              fontSize: '12px',
              color: stats.resumesAnalyzed > 0
                ? '#34d399'
                : 'var(--text-muted)'
            }}
          >
            {stats.resumesAnalyzed > 0
              ? 'AI analysis available'
              : 'No analysis yet'}
          </span>
        </div>


        {/* Interviews */}

        <div
          className="glass-card"
          style={{
            padding: '24px'
          }}
        >
          <div
            style={{
              display: 'flex',
              justifyContent: 'space-between',
              alignItems: 'center',
              marginBottom: '12px'
            }}
          >
            <span
              style={{
                fontSize: '13px',
                color: 'var(--text-muted)',
                fontWeight: '600'
              }}
            >
              INTERVIEWS PREPARED
            </span>

            <div
              style={{
                width: '36px',
                height: '36px',
                background: 'rgba(139,92,246,0.15)',
                color: 'var(--purple)',
                borderRadius: '10px',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center'
              }}
            >
              <MessageSquare size={20} />
            </div>
          </div>

          <h3
            style={{
              fontSize: '28px',
              fontWeight: '800',
              color: '#fff'
            }}
          >
            {stats.interviewsCompleted}
          </h3>

          <span
            style={{
              fontSize: '12px',
              color: stats.interviewsCompleted > 0
                ? '#34d399'
                : 'var(--text-muted)'
            }}
          >
            {stats.interviewsCompleted > 0
              ? 'AI evaluations completed'
              : 'No interviews yet'}
          </span>
        </div>


        {/* Roadmaps */}

        <div
          className="glass-card"
          style={{
            padding: '24px'
          }}
        >
          <div
            style={{
              display: 'flex',
              justifyContent: 'space-between',
              alignItems: 'center',
              marginBottom: '12px'
            }}
          >
            <span
              style={{
                fontSize: '13px',
                color: 'var(--text-muted)',
                fontWeight: '600'
              }}
            >
              ROADMAP MILESTONES
            </span>

            <div
              style={{
                width: '36px',
                height: '36px',
                background: 'rgba(59,130,246,0.15)',
                color: 'var(--primary)',
                borderRadius: '10px',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center'
              }}
            >
              <Map size={20} />
            </div>
          </div>

          <h3
            style={{
              fontSize: '28px',
              fontWeight: '800',
              color: '#fff'
            }}
          >
            {stats.roadmapsCreated}
          </h3>

          <span
            style={{
              fontSize: '12px',
              color: stats.roadmapsCreated > 0
                ? 'var(--cyan)'
                : 'var(--text-muted)'
            }}
          >
            {stats.roadmapsCreated > 0
              ? 'Active goal roadmap'
              : 'No roadmap yet'}
          </span>
        </div>


        {/* ATS */}

        <div
          className="glass-card"
          style={{
            padding: '24px',
            cursor: 'pointer'
          }}
          onClick={() => navigate('/resume')}
        >
          <div
            style={{
              display: 'flex',
              justifyContent: 'space-between',
              alignItems: 'center',
              marginBottom: '12px'
            }}
          >
            <span
              style={{
                fontSize: '13px',
                color: 'var(--text-muted)',
                fontWeight: '600'
              }}
            >
              TOP ATS RATING
            </span>

            <div
              style={{
                width: '36px',
                height: '36px',
                background: 'rgba(16,185,129,0.15)',
                color: '#34d399',
                borderRadius: '10px',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center'
              }}
            >
              <Award size={20} />
            </div>
          </div>

          <h3
            style={{
              fontSize: '28px',
              fontWeight: '800',
              color: '#fff'
            }}
          >
            {stats.atsScore || 0}/100
          </h3>

          <span
            style={{
              fontSize: '12px',
              color: stats.atsScore > 0
                ? '#34d399'
                : 'var(--text-muted)'
            }}
          >
            {stats.atsScore > 0
              ? 'Latest AI ATS score'
              : 'Analyze your resume'}
          </span>
        </div>

      </div>


      {/* QUICK ACTION HUB */}

      <h2
        style={{
          fontSize: '22px',
          fontWeight: '800',
          marginBottom: '20px',
          color: '#ffffff'
        }}
      >
        Quick Action Hub
      </h2>

      <div
        style={{
          display: 'grid',
          gridTemplateColumns:
            'repeat(auto-fit, minmax(260px, 1fr))',
          gap: '20px',
          marginBottom: '40px'
        }}
      >

        {/* RESUME SCANNER */}

        <div
          className="glass-card feature-card"
          style={{
            cursor: 'pointer',
            padding: '24px'
          }}
          onClick={() => navigate('/resume')}
        >
          <div
            className="feature-icon-box cyan"
            style={{
              marginBottom: '16px'
            }}
          >
            <FileText size={24} />
          </div>

          <h4
            style={{
              fontSize: '18px',
              fontWeight: '700',
              marginBottom: '8px',
              color: '#fff'
            }}
          >
            AI Resume Scanner
          </h4>

          <p
            style={{
              fontSize: '13px',
              color: 'var(--text-muted)',
              marginBottom: '16px'
            }}
          >
            Upload your resume PDF/DOCX to get instant ATS
            scores and formatting fixes.
          </p>

          <span className="feature-action">
            Launch Scanner &rarr;
          </span>
        </div>


        {/* INTERVIEW */}

        <div
          className="glass-card feature-card"
          style={{
            cursor: 'pointer',
            padding: '24px'
          }}
          onClick={() => navigate('/interview-prep')}
        >
          <div
            className="feature-icon-box purple"
            style={{
              marginBottom: '16px'
            }}
          >
            <MessageSquare size={24} />
          </div>

          <h4
            style={{
              fontSize: '18px',
              fontWeight: '700',
              marginBottom: '8px',
              color: '#fff'
            }}
          >
            AI Interview Prep
          </h4>

          <p
            style={{
              fontSize: '13px',
              color: 'var(--text-muted)',
              marginBottom: '16px'
            }}
          >
            Practice role-specific interview questions with
            real-time AI feedback.
          </p>

          <span className="feature-action">
            Start Practice &rarr;
          </span>
        </div>


        {/* ROADMAP */}

        <div
          className="glass-card feature-card"
          style={{
            cursor: 'pointer',
            padding: '24px'
          }}
          onClick={() => navigate('/career-roadmap')}
        >
          <div
            className="feature-icon-box blue"
            style={{
              marginBottom: '16px'
            }}
          >
            <Map size={24} />
          </div>

          <h4
            style={{
              fontSize: '18px',
              fontWeight: '700',
              marginBottom: '8px',
              color: '#fff'
            }}
          >
            Personalized Roadmap
          </h4>

          <p
            style={{
              fontSize: '13px',
              color: 'var(--text-muted)',
              marginBottom: '16px'
            }}
          >
            Generate a targeted skill roadmap tailored to
            your dream company role.
          </p>

          <span className="feature-action">
            Generate Roadmap &rarr;
          </span>
        </div>

      </div>


      {/* RECENT ACTIVITY */}

      <h2
        style={{
          fontSize: '22px',
          fontWeight: '800',
          marginBottom: '20px',
          color: '#ffffff'
        }}
      >
        Recent Activity History
      </h2>

      <div
        className="glass-card"
        style={{
          padding: '24px'
        }}
      >
        <div
          style={{
            display: 'flex',
            flexDirection: 'column',
            gap: '16px'
          }}
        >

          {activities.length > 0 ? (
            activities.map((item) => (
              <div
                key={item.id}
                style={{
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'space-between',
                  padding: '16px',
                  background: 'rgba(15,23,42,0.5)',
                  borderRadius: '12px',
                  border: '1px solid var(--border-light)',
                  flexWrap: 'wrap',
                  gap: '12px'
                }}
              >
                <div
                  style={{
                    display: 'flex',
                    alignItems: 'center',
                    gap: '14px'
                  }}
                >
                  <div
                    style={{
                      width: '40px',
                      height: '40px',
                      borderRadius: '10px',
                      background: 'rgba(37,99,235,0.15)',
                      color: 'var(--primary)',
                      display: 'flex',
                      alignItems: 'center',
                      justifyContent: 'center'
                    }}
                  >
                    <CheckCircle2 size={22} />
                  </div>

                  <div>
                    <h4
                      style={{
                        fontSize: '15px',
                        fontWeight: '700',
                        color: '#fff'
                      }}
                    >
                      {item.title}
                    </h4>

                    <span
                      style={{
                        fontSize: '12px',
                        color: 'var(--text-muted)'
                      }}
                    >
                      Date: {item.date}
                    </span>
                  </div>
                </div>

                <div
                  style={{
                    display: 'flex',
                    alignItems: 'center',
                    gap: '16px'
                  }}
                >
                  <span
                    className="pill success"
                    style={{
                      fontSize: '12px',
                      padding: '6px 12px'
                    }}
                  >
                    {item.score}
                  </span>
                </div>
              </div>
            ))
          ) : (
            <div
              style={{
                textAlign: 'center',
                padding: '30px 20px',
                color: 'var(--text-muted)'
              }}
            >
              <CheckCircle2
                size={32}
                style={{
                  marginBottom: '10px',
                  opacity: 0.5
                }}
              />

              <p
                style={{
                  margin: 0,
                  fontSize: '14px'
                }}
              >
                No recent activity yet.
              </p>

              <span
                style={{
                  display: 'block',
                  marginTop: '6px',
                  fontSize: '12px'
                }}
              >
                Start using CareerPilot AI to see your activity here.
              </span>
            </div>
          )}

        </div>
      </div>

    </div>
  );
};

export default Dashboard;