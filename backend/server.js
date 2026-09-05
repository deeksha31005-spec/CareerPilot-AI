import express from 'express';
import dotenv from 'dotenv';
import cors from 'cors';
import { connectDB } from './src/config/db.js';
import authRoutes from './src/routes/authRoutes.js';
import dashboardRoutes from './src/routes/dashboardRoutes.js';
import profileRoutes from './src/routes/profileRoutes.js';
import resumeRoutes from './src/routes/resumeRoutes.js';
import resumeAnalyzerRoutes from './src/routes/resumeAnalyzerRoutes.js';
import careerRoadmapRoutes from './src/routes/careerRoadmapRoutes.js';
import interviewRoutes from './src/routes/interviewRoutes.js';

// Load environment variables
dotenv.config();

// Initialize Express App
const app = express();

// Connect Database
connectDB();

// Middleware
app.use(cors({
  origin: '*',
  credentials: true
}));
app.use(express.json());

// API Routes
app.use('/api/auth', authRoutes);
app.use('/api/dashboard', dashboardRoutes);
app.use('/api/profile', profileRoutes);
app.use('/api/resume', resumeRoutes);
app.use('/api/resume-analyzer', resumeAnalyzerRoutes);
app.use('/api/career-roadmap', careerRoadmapRoutes);
app.use('/api/interview', interviewRoutes);
// Root Health Check Route
app.get('/', (req, res) => {
  res.json({
    project: 'CareerPilot AI Backend API',
    status: 'Running',
    version: '1.0.0',
    timestamp: new Date().toISOString()
  });
});

// Error Handling Middleware
app.use((req, res) => {
  res.status(404).json({ message: 'Route Not Found' });
});

// Start Server
const PORT = process.env.PORT || 5000;
app.listen(PORT, () => {
  console.log(`🚀 CareerPilot AI Backend Server running on http://localhost:${PORT}`);
});
