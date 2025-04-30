import express from 'express';
import { auth, checkRole } from '../middleware/auth.js';
import {
  getDashboard,
  getAllFaculty,
  getFacultyById,
  updateFacultyStatus,
  getAppraisalsForReview,
  reviewAppraisal,
  generateReports,
  getAnalytics
} from '../controllers/adminController.js';

const router = express.Router();

// Apply auth middleware to all routes
router.use(auth);
router.use(checkRole(['admin']));

// Dashboard
router.get('/dashboard', getDashboard);

// Faculty Management
router.get('/faculty-list', getAllFaculty);
router.get('/faculty/:id', getFacultyById);
router.put('/faculty/:id/status', updateFacultyStatus);

// Appraisal Review
router.get('/appraisal-review', getAppraisalsForReview);
router.put('/appraisal-review/:id', reviewAppraisal);

// Reports and Analytics
router.get('/reports', generateReports);
router.get('/analytics', getAnalytics);

export default router; 