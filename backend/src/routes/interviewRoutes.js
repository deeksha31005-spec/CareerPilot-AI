import express from 'express';

import {
  getInterviewQuestions,
  evaluateAnswer,
  getInterviewHistory
} from '../controllers/interviewController.js';

import { protect } from '../middleware/authMiddleware.js';

const router = express.Router();


// Generate interview questions
router.post(
  '/questions',
  protect,
  getInterviewQuestions
);


// Evaluate interview answer
router.post(
  '/evaluate',
  protect,
  evaluateAnswer
);


// Get saved interview history
router.get(
  '/history',
  protect,
  getInterviewHistory
);


export default router;