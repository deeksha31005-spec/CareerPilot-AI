import express from 'express';

import { analyzeResume } from '../controllers/resumeAnalyzerController.js';

import { protect } from '../middleware/authMiddleware.js';

const router = express.Router();

router.get(
  '/',
  protect,
  analyzeResume
);

export default router;