import User from '../models/User.js';

/**
 * @desc    Get user dashboard stats and summary
 * @route   GET /api/dashboard
 * @access  Private (JWT Protected)
 */
export const getDashboardData = async (req, res) => {
  try {
    const user = await User.findById(req.user._id)
      .select('-password');

    if (!user) {
      return res.status(404).json({
        message: 'User profile not found.'
      });
    }

    const hasResume = Boolean(
      user.resume &&
      user.resume.fileUrl
    );

    // Profile completeness
    let profileScore = 0;

    if (user.name) profileScore += 20;
    if (user.email) profileScore += 20;
    if (user.targetRole) profileScore += 20;
    if (hasResume) profileScore += 40;

    profileScore = Math.min(profileScore, 100);

    // Real stored metrics
    const resumesAnalyzed =
  hasResume ? 1 : 0;
    const interviewsCompleted =
      user.interviewHistory?.length || 0;

    const roadmapsCreated =
      user.roadmapHistory?.length || 0;

    const atsScore =
      user.resumeAnalysis?.atsScore || 0;

    // Build recent activity
    const recentActivity = [];

    if (user.resumeAnalysis?.analyzedAt) {
      recentActivity.push({
        id: 'resume-analysis',
        title: 'ATS Resume Scan Completed',
        date: new Date(
          user.resumeAnalysis.analyzedAt
        ).toLocaleDateString(),
        score: `${atsScore}/100`,
        type: 'resume'
      });
    }

    if (user.interviewHistory?.length > 0) {
      const latestInterview =
        user.interviewHistory[
          user.interviewHistory.length - 1
        ];

      recentActivity.push({
        id: 'interview-latest',
        title: 'AI Interview Answer Evaluated',
        date: new Date(
          latestInterview.completedAt
        ).toLocaleDateString(),
        score: `${latestInterview.score}/100`,
        type: 'interview'
      });
    }

    if (user.roadmapHistory?.length > 0) {
      const latestRoadmap =
        user.roadmapHistory[
          user.roadmapHistory.length - 1
        ];

      recentActivity.push({
        id: 'roadmap-latest',
        title: 'Career Roadmap Generated',
        date: new Date(
          latestRoadmap.createdAt
        ).toLocaleDateString(),
        score: 'Completed',
        type: 'roadmap'
      });
    }

    const dashboardStats = {
      user: {
        id: user._id,
        name: user.name,
        email: user.email,
        targetRole:
          user.targetRole ||
          'Software Engineer',
        joinedAt: user.createdAt
      },

      stats: {
        resumesAnalyzed,
        interviewsCompleted,
        roadmapsCreated,
        profileScore,
        atsScore
      },

      recentActivity:
        recentActivity.slice(0, 5)
    };

    return res.json(dashboardStats);

  } catch (error) {
    console.error(
      'Dashboard Error:',
      error.message
    );

    return res.status(500).json({
      message:
        'Server error retrieving dashboard analytics.'
    });
  }
};