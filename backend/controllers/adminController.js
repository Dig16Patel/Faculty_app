import User from '../models/User.js';
import Appraisal from '../models/Appraisal.js';
import { errorMessages } from '../config/config.js';

// Get admin dashboard data
export const getDashboard = async (req, res) => {
  try {
    const totalFaculty = await User.countDocuments({ role: 'faculty' });
    const pendingAppraisals = await Appraisal.countDocuments({ status: 'submitted' });
    const completedAppraisals = await Appraisal.countDocuments({ status: 'approved' });

    res.json({
      totalFaculty,
      pendingAppraisals,
      completedAppraisals
    });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// Get all faculty members
export const getAllFaculty = async (req, res) => {
  try {
    const faculty = await User.find({ role: 'faculty' })
      .select('-password')
      .sort({ name: 1 });
    res.json(faculty);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// Get faculty member by ID
export const getFacultyById = async (req, res) => {
  try {
    const faculty = await User.findById(req.params.id).select('-password');
    if (!faculty) {
      return res.status(404).json({ message: 'Faculty member not found' });
    }
    res.json(faculty);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// Update faculty status
export const updateFacultyStatus = async (req, res) => {
  try {
    const { isActive } = req.body;
    const faculty = await User.findById(req.params.id);
    
    if (!faculty) {
      return res.status(404).json({ message: 'Faculty member not found' });
    }

    faculty.isActive = isActive;
    await faculty.save();

    res.json({ message: 'Faculty status updated successfully', faculty });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// Get appraisals for review
export const getAppraisalsForReview = async (req, res) => {
  try {
    const appraisals = await Appraisal.find({ status: 'submitted' })
      .populate('faculty', 'name department designation')
      .sort({ submittedAt: -1 });
    res.json(appraisals);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// Review appraisal
export const reviewAppraisal = async (req, res) => {
  try {
    const { status, feedback } = req.body;
    const appraisal = await Appraisal.findById(req.params.id);

    if (!appraisal) {
      return res.status(404).json({ message: errorMessages.appraisal.notFound });
    }

    appraisal.status = status;
    appraisal.feedback = feedback;
    appraisal.reviewedBy = req.user.id;
    appraisal.reviewedAt = new Date();

    await appraisal.save();

    res.json({ message: 'Appraisal reviewed successfully', appraisal });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// Generate reports
export const generateReports = async (req, res) => {
  try {
    const { startDate, endDate, department } = req.query;
    let query = {};

    if (startDate && endDate) {
      query.submittedAt = {
        $gte: new Date(startDate),
        $lte: new Date(endDate)
      };
    }

    if (department) {
      query['faculty.department'] = department;
    }

    const appraisals = await Appraisal.find(query)
      .populate('faculty', 'name department designation')
      .sort({ submittedAt: -1 });

    res.json(appraisals);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// Get analytics
export const getAnalytics = async (req, res) => {
  try {
    const totalAppraisals = await Appraisal.countDocuments();
    const approvedAppraisals = await Appraisal.countDocuments({ status: 'approved' });
    const averageScore = await Appraisal.aggregate([
      { $match: { status: 'approved' } },
      { $group: { _id: null, avgScore: { $avg: '$finalScore' } } }
    ]);

    const departmentStats = await Appraisal.aggregate([
      { $match: { status: 'approved' } },
      {
        $group: {
          _id: '$faculty.department',
          count: { $sum: 1 },
          avgScore: { $avg: '$finalScore' }
        }
      }
    ]);

    res.json({
      totalAppraisals,
      approvedAppraisals,
      averageScore: averageScore[0]?.avgScore || 0,
      departmentStats
    });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
}; 