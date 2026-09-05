import User from '../models/User.js';

import {
  generateInterviewQuestions,
  evaluateInterviewAnswer
} from '../services/interviewAIService.js';


// Generate Interview Questions
export const getInterviewQuestions = async (req, res) => {
  try {
    const {
      targetRole,
      interviewType,
      difficulty
    } = req.body;

    if (!interviewType || !difficulty) {
      return res.status(400).json({
        message:
          'Interview type and difficulty are required.'
      });
    }

    const result =
      await generateInterviewQuestions(
        targetRole,
        interviewType,
        difficulty
      );

    res.json({
      message:
        'Interview questions generated successfully.',
      questions: result.questions || []
    });

  } catch (error) {
    console.error(
      'Interview Questions Controller Error:',
      error
    );

    res.status(500).json({
      message:
        error.message ||
        'Failed to generate interview questions.'
    });
  }
};


// Evaluate Interview Answer
export const evaluateAnswer = async (req, res) => {
  try {
    const {
      targetRole,
      question,
      answer,
      interviewType,
      difficulty
    } = req.body;

    if (!question || !answer) {
      return res.status(400).json({
        message:
          'Question and answer are required.'
      });
    }

    const feedback =
      await evaluateInterviewAnswer(
        targetRole,
        question,
        answer
      );

    const user =
      await User.findById(req.user._id);

    if (!user) {
      return res.status(404).json({
        message: 'User not found.'
      });
    }

    user.interviewHistory.push({
      interviewType:
        interviewType || 'Technical',

      difficulty:
        difficulty || 'Medium',

      question,

      answer,

      score:
        feedback.score || 0,

      feedback:
        feedback.feedback || '',

      strengths:
        feedback.strengths || [],

      improvements:
        feedback.improvements || [],

      completedAt:
        new Date()
    });

    await user.save({
      validateBeforeSave: false
    });

    res.json({
      message:
        'Answer evaluated successfully.',

      feedback
    });

  } catch (error) {
    console.error(
      'Interview Evaluation Controller Error:',
      error
    );

    res.status(500).json({
      message:
        error.message ||
        'Failed to evaluate your answer.'
    });
  }
};


// Get Saved Interview History
export const getInterviewHistory = async (
  req,
  res
) => {
  try {
    const user =
      await User.findById(req.user._id)
        .select('interviewHistory');

    if (!user) {
      return res.status(404).json({
        message: 'User not found.'
      });
    }

    const history =
      user.interviewHistory || [];

    res.json({
      history
    });

  } catch (error) {
    console.error(
      'Get Interview History Error:',
      error
    );

    res.status(500).json({
      message:
        'Failed to load interview history.'
    });
  }
};