import User from '../models/User.js';
import { extractResumeText } from '../services/resumeParser.js';
import { analyzeResumeWithAI } from '../services/resumeAIService.js';

export const analyzeResume = async (req, res) => {
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

    const analysis = await analyzeResumeWithAI(
      resumeText,
      user.targetRole
    );

    // Save latest AI analysis to MongoDB
    user.resumeAnalysis = {
      atsScore: analysis.atsScore || 0,

      summary: analysis.summary || '',

      strengths: analysis.strengths || [],

      missingSkills: analysis.missingSkills || [],

      missingKeywords: analysis.missingKeywords || [],

      improvements: analysis.improvements || [],

      sectionAnalysis: {
        contact:
          analysis.sectionAnalysis?.contact || '',

        summary:
          analysis.sectionAnalysis?.summary || '',

        skills:
          analysis.sectionAnalysis?.skills || '',

        education:
          analysis.sectionAnalysis?.education || '',

        experience:
          analysis.sectionAnalysis?.experience || '',

        projects:
          analysis.sectionAnalysis?.projects || '',

        certifications:
          analysis.sectionAnalysis?.certifications || ''
      },

      analyzedAt: new Date()
    };

    await user.save({
      validateBeforeSave: false
    });

    res.json({
      message: 'Resume analyzed successfully.',
      analysis
    });

  } catch (error) {
    console.error(
      'Resume Analyzer Controller Error:',
      error
    );

    res.status(500).json({
      message:
        error.message ||
        'Failed to analyze resume.'
    });
  }
};