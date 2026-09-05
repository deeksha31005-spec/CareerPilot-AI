import express from 'express';

import {
  generateCareerRoadmap
} from '../controllers/careerRoadmapController.js';

import { protect } from '../middleware/authMiddleware.js';

const router = express.Router();

router.get(
  '/',
  protect,
  generateCareerRoadmap
);

export default router;