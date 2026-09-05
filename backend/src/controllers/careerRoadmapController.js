import User from '../models/User.js';
import { extractResumeText } from '../services/resumeParser.js';
import { generateCareerRoadmapWithAI } from '../services/careerRoadmapAIService.js';

export const generateCareerRoadmap = async (req, res) => {
  try {
    const user = await User.findById(req.user._id);

    if (!user) {
      return res.status(404).json({
        message: 'User not found.'
      });
    }

    if (!user.resume || !user.resume.fileUrl) {
      return res.status(400).json({
        message: 'Please upload a resume first.'
      });
    }

    const matches = user.resume.fileUrl.match(
      /^data:(.+);base64,(.+)$/
    );

    if (!matches) {
      return res.status(400).json({
        message: 'Invalid stored resume file.'
      });
    }

    const mimeType = matches[1];
    const base64Data = matches[2];

    const fileBuffer = Buffer.from(
      base64Data,
      'base64'
    );

    const file = {
      mimetype: mimeType,
      buffer: fileBuffer
    };

    const resumeText = await extractResumeText(file);

    if (!resumeText) {
      return res.status(400).json({
        message:
          'Could not extract text from the resume. Please upload a text-based PDF or DOCX file.'
      });
    }

    const roadmap = await generateCareerRoadmapWithAI(
      resumeText,
      user.targetRole
    );

    user.roadmapHistory.push({
      targetRole:
        roadmap.targetRole ||
        user.targetRole ||
        'Software Engineer',

      currentLevel:
        roadmap.currentLevel || '',

      careerSummary:
        roadmap.careerSummary || '',

      skillGap:
        roadmap.skillGap || [],

      roadmap:
        roadmap.roadmap || [],

      recommendedProjects:
        roadmap.recommendedProjects || [],

      recommendedCertifications:
        roadmap.recommendedCertifications || [],

      createdAt: new Date()
    });

    await user.save({
      validateBeforeSave: false
    });

    res.json({
      message:
        'Career roadmap generated successfully.',
      roadmap
    });

  } catch (error) {
    console.error(
      'Career Roadmap Controller Error:',
      error
    );

    res.status(500).json({
      message:
        error.message ||
        'Failed to generate career roadmap.'
    });
  }
};

export const getCareerRoadmapHistory = async (req, res) => {
  try {
    const user = await User.findById(req.user._id)
      .select('roadmapHistory');

    if (!user) {
      return res.status(404).json({
        message: 'User not found.'
      });
    }

    const roadmapHistory = user.roadmapHistory || [];

    if (roadmapHistory.length === 0) {
      return res.json({
        roadmap: null,
        history: []
      });
    }

    const latestRoadmap =
      roadmapHistory[roadmapHistory.length - 1];

    res.json({
      roadmap: latestRoadmap,
      history: roadmapHistory
    });

  } catch (error) {
    console.error(
      'Get Career Roadmap History Error:',
      error
    );

    res.status(500).json({
      message:
        'Failed to load saved career roadmap.'
    });
  }
};