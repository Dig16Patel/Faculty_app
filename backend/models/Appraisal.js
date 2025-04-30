import mongoose from 'mongoose';

const appraisalSchema = new mongoose.Schema({
  faculty: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User',
    required: true
  },
  academicYear: {
    type: String,
    required: true
  },
  semester: {
    type: String,
    required: true
  },
  teaching: {
    coursesTaught: [{
      name: String,
      students: Number,
      feedback: Number
    }],
    averageFeedback: Number,
    totalStudents: Number
  },
  research: {
    publications: [{
      title: String,
      journal: String,
      year: Number,
      impactFactor: Number
    }],
    conferences: [{
      title: String,
      venue: String,
      year: Number
    }],
    patents: [{
      title: String,
      year: Number,
      status: String
    }]
  },
  service: {
    administrative: [{
      role: String,
      duration: String,
      description: String
    }],
    committees: [{
      name: String,
      role: String,
      duration: String
    }]
  },
  professionalDevelopment: {
    workshops: [{
      title: String,
      organizer: String,
      date: Date
    }],
    certifications: [{
      name: String,
      issuer: String,
      date: Date
    }]
  },
  achievements: [{
    title: String,
    description: String,
    date: Date
  }],
  selfAssessment: {
    strengths: [String],
    areasForImprovement: [String],
    goals: [String]
  },
  status: {
    type: String,
    enum: ['draft', 'submitted', 'reviewed', 'approved'],
    default: 'draft'
  },
  submittedAt: Date,
  reviewedBy: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User'
  },
  reviewedAt: Date,
  feedback: String,
  finalScore: Number
}, {
  timestamps: true
});

// Calculate final score before saving
appraisalSchema.pre('save', function(next) {
  if (this.status === 'approved') {
    // Calculate score based on various parameters
    let score = 0;
    
    // Teaching score (40%)
    if (this.teaching.averageFeedback) {
      score += (this.teaching.averageFeedback / 5) * 40;
    }
    
    // Research score (30%)
    const publicationScore = this.research.publications.length * 5;
    const conferenceScore = this.research.conferences.length * 3;
    const patentScore = this.research.patents.length * 8;
    score += (publicationScore + conferenceScore + patentScore) * 0.3;
    
    // Service score (20%)
    const serviceScore = (this.service.administrative.length + this.service.committees.length) * 2;
    score += serviceScore * 0.2;
    
    // Professional Development score (10%)
    const devScore = (this.professionalDevelopment.workshops.length + this.professionalDevelopment.certifications.length) * 2;
    score += devScore * 0.1;
    
    this.finalScore = Math.min(100, score);
  }
  
  next();
});

const Appraisal = mongoose.model('Appraisal', appraisalSchema);

export default Appraisal; 