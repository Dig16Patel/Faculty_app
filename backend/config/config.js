export const config = {
  // JWT Configuration
  jwt: {
    secret: process.env.JWT_SECRET || 'your-super-secret-jwt-key',
    expiresIn: '24h'
  },

  // File Upload Configuration
  upload: {
    maxFileSize: 5 * 1024 * 1024, // 5MB
    allowedFileTypes: ['image/jpeg', 'image/png', 'application/pdf'],
    uploadPath: 'uploads/'
  },

  // Pagination Configuration
  pagination: {
    defaultLimit: 10,
    maxLimit: 100
  },

  // Appraisal Configuration
  appraisal: {
    submissionDeadline: 30, // days before semester end
    reviewDeadline: 15, // days after submission
    minScore: 0,
    maxScore: 100
  },

  // Email Configuration
  email: {
    from: process.env.EMAIL_FROM || 'noreply@faculty-appraisal.com',
    smtp: {
      host: process.env.SMTP_HOST,
      port: process.env.SMTP_PORT,
      secure: process.env.SMTP_SECURE === 'true',
      auth: {
        user: process.env.SMTP_USER,
        pass: process.env.SMTP_PASS
      }
    }
  },

  // Logging Configuration
  logging: {
    level: process.env.LOG_LEVEL || 'info',
    format: 'combined'
  }
};

// Validation Rules
export const validationRules = {
  password: {
    minLength: 8,
    requireUppercase: true,
    requireLowercase: true,
    requireNumbers: true,
    requireSpecialChars: true
  },
  name: {
    minLength: 2,
    maxLength: 50
  },
  email: {
    maxLength: 100
  }
};

// Error Messages
export const errorMessages = {
  auth: {
    invalidCredentials: 'Invalid email or password',
    tokenExpired: 'Authentication token has expired',
    unauthorized: 'Unauthorized access'
  },
  validation: {
    required: 'This field is required',
    invalidEmail: 'Please enter a valid email address',
    passwordMismatch: 'Passwords do not match'
  },
  appraisal: {
    submissionClosed: 'Appraisal submission period has ended',
    alreadySubmitted: 'Appraisal has already been submitted',
    notFound: 'Appraisal not found'
  }
}; 