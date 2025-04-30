import express from 'express';
import { auth, checkRole } from '../middleware/auth.js';
import {
  getDashboard,
  submitAppraisal,
  getAppraisals,
  getAppraisalById,
  updateAppraisal,
  deleteAppraisal,
  addPublication,
  getPublications,
  updatePublication,
  deletePublication,
  addEvent,
  getEvents,
  updateEvent,
  deleteEvent,
  getProfile,
  updateProfile
} from '../controllers/facultyController.js';

const router = express.Router();

// Apply auth middleware to all routes
router.use(auth);
router.use(checkRole(['faculty']));

// Dashboard
router.get('/dashboard', getDashboard);

// Appraisal Routes
router.post('/appraisal', submitAppraisal);
router.get('/appraisals', getAppraisals);
router.get('/appraisal/:id', getAppraisalById);
router.put('/appraisal/:id', updateAppraisal);
router.delete('/appraisal/:id', deleteAppraisal);

// Publication Routes
router.post('/publications', addPublication);
router.get('/publications', getPublications);
router.put('/publications/:id', updatePublication);
router.delete('/publications/:id', deletePublication);

// Event Routes
router.post('/events', addEvent);
router.get('/events', getEvents);
router.put('/events/:id', updateEvent);
router.delete('/events/:id', deleteEvent);

// Profile Routes
router.get('/profile', getProfile);
router.put('/profile', updateProfile);

export default router;