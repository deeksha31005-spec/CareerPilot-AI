import express from 'express';

import {
  uploadResume,
  deleteResume
} from '../controllers/resumeController.js';

import { protect } from '../middleware/authMiddleware.js';

import multer from 'multer';

const router = express.Router();

const storage = multer.memoryStorage();

const upload = multer({
  storage,

  limits: {
    fileSize: 5 * 1024 * 1024
  }
});

router.post(
  '/upload',
  protect,
  upload.single('resume'),
  uploadResume
);

router.delete(
  '/',
  protect,
  deleteResume
);

export default router;