import User from '../models/User.js';
import Appraisal from '../models/Appraisal.js';
import { errorMessages, config } from '../config/config.js';

// Get faculty dashboard data
export const getDashboard = async (req, res) => {
  try {
    const faculty = await User.findById(req.user.id).select('-password');
    const appraisals = await Appraisal.find({ faculty: req.user.id })
      .sort({ createdAt: -1 })
      .limit(5);

    res.json({
      faculty,
      recentAppraisals: appraisals
    });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// Submit new appraisal
export const submitAppraisal = async (req, res) => {
  try {
    const appraisal = new Appraisal({
      ...req.body,
      faculty: req.user.id,
      status: 'submitted',
      submittedAt: new Date()
    });

    await appraisal.save();
    res.status(201).json({ message: 'Appraisal submitted successfully', appraisal });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// Get all appraisals for the faculty member
export const getAppraisals = async (req, res) => {
  try {
    const appraisals = await Appraisal.find({ faculty: req.user.id })
      .sort({ createdAt: -1 });
    res.json(appraisals);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// Get specific appraisal by ID
export const getAppraisalById = async (req, res) => {
  try {
    const appraisal = await Appraisal.findOne({
      _id: req.params.id,
      faculty: req.user.id
    });

    if (!appraisal) {
      return res.status(404).json({ message: errorMessages.appraisal.notFound });
    }

    res.json(appraisal);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// Update appraisal
export const updateAppraisal = async (req, res) => {
  try {
    const appraisal = await Appraisal.findOne({
      _id: req.params.id,
      faculty: req.user.id,
      status: 'draft'
    });

    if (!appraisal) {
      return res.status(404).json({ message: errorMessages.appraisal.notFound });
    }

    Object.assign(appraisal, req.body);
    await appraisal.save();

    res.json({ message: 'Appraisal updated successfully', appraisal });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// Delete appraisal
export const deleteAppraisal = async (req, res) => {
  try {
    const appraisal = await Appraisal.findOneAndDelete({
      _id: req.params.id,
      faculty: req.user.id,
      status: 'draft'
    });

    if (!appraisal) {
      return res.status(404).json({ message: errorMessages.appraisal.notFound });
    }

    res.json({ message: 'Appraisal deleted successfully' });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// Add publication
export const addPublication = async (req, res) => {
  try {
    const appraisal = await Appraisal.findOne({
      faculty: req.user.id,
      status: 'draft'
    });

    if (!appraisal) {
      return res.status(404).json({ message: 'No draft appraisal found' });
    }

    appraisal.research.publications.push(req.body);
    await appraisal.save();

    res.status(201).json({ message: 'Publication added successfully', appraisal });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// Get publications
export const getPublications = async (req, res) => {
  try {
    const appraisal = await Appraisal.findOne({
      faculty: req.user.id,
      status: 'draft'
    });

    if (!appraisal) {
      return res.status(404).json({ message: 'No draft appraisal found' });
    }

    res.json(appraisal.research.publications);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// Update publication
export const updatePublication = async (req, res) => {
  try {
    const appraisal = await Appraisal.findOne({
      faculty: req.user.id,
      status: 'draft'
    });

    if (!appraisal) {
      return res.status(404).json({ message: 'No draft appraisal found' });
    }

    const publication = appraisal.research.publications.id(req.params.id);
    if (!publication) {
      return res.status(404).json({ message: 'Publication not found' });
    }

    Object.assign(publication, req.body);
    await appraisal.save();

    res.json({ message: 'Publication updated successfully', publication });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// Delete publication
export const deletePublication = async (req, res) => {
  try {
    const appraisal = await Appraisal.findOne({
      faculty: req.user.id,
      status: 'draft'
    });

    if (!appraisal) {
      return res.status(404).json({ message: 'No draft appraisal found' });
    }

    appraisal.research.publications.pull(req.params.id);
    await appraisal.save();

    res.json({ message: 'Publication deleted successfully' });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// Add event
export const addEvent = async (req, res) => {
  try {
    const appraisal = await Appraisal.findOne({
      faculty: req.user.id,
      status: 'draft'
    });

    if (!appraisal) {
      return res.status(404).json({ message: 'No draft appraisal found' });
    }

    appraisal.professionalDevelopment.workshops.push(req.body);
    await appraisal.save();

    res.status(201).json({ message: 'Event added successfully', appraisal });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// Get events
export const getEvents = async (req, res) => {
  try {
    const appraisal = await Appraisal.findOne({
      faculty: req.user.id,
      status: 'draft'
    });

    if (!appraisal) {
      return res.status(404).json({ message: 'No draft appraisal found' });
    }

    res.json(appraisal.professionalDevelopment.workshops);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// Update event
export const updateEvent = async (req, res) => {
  try {
    const appraisal = await Appraisal.findOne({
      faculty: req.user.id,
      status: 'draft'
    });

    if (!appraisal) {
      return res.status(404).json({ message: 'No draft appraisal found' });
    }

    const event = appraisal.professionalDevelopment.workshops.id(req.params.id);
    if (!event) {
      return res.status(404).json({ message: 'Event not found' });
    }

    Object.assign(event, req.body);
    await appraisal.save();

    res.json({ message: 'Event updated successfully', event });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// Delete event
export const deleteEvent = async (req, res) => {
  try {
    const appraisal = await Appraisal.findOne({
      faculty: req.user.id,
      status: 'draft'
    });

    if (!appraisal) {
      return res.status(404).json({ message: 'No draft appraisal found' });
    }

    appraisal.professionalDevelopment.workshops.pull(req.params.id);
    await appraisal.save();

    res.json({ message: 'Event deleted successfully' });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// Get faculty profile
export const getProfile = async (req, res) => {
  try {
    const faculty = await User.findById(req.user.id).select('-password');
    res.json(faculty);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// Update faculty profile
export const updateProfile = async (req, res) => {
  try {
    const faculty = await User.findById(req.user.id);
    
    if (!faculty) {
      return res.status(404).json({ message: 'Faculty not found' });
    }

    // Update allowed fields
    const allowedUpdates = ['name', 'phone', 'address'];
    allowedUpdates.forEach(update => {
      if (req.body[update]) {
        faculty[update] = req.body[update];
      }
    });

    await faculty.save();

    res.json({ message: 'Profile updated successfully', faculty });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
}; 