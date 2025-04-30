# Faculty Appraisal System

A comprehensive web application for managing faculty performance appraisals in educational institutions.

## Features

### Faculty Features
- User authentication (login/register)
- Profile management
- Appraisal form submission
- Publication management
- Event tracking
- Performance history

### Admin Features
- Faculty management
- Appraisal review and approval
- Performance analytics
- Report generation

## Tech Stack

- Frontend: React.js with Vite
- Backend: Node.js with Express
- Database: MongoDB
- Authentication: JWT
- UI Framework: Material-UI

## Prerequisites

- Node.js (v14 or higher)
- MongoDB
- npm or yarn

## Setup Instructions

1. Clone the repository:
```bash
git clone <repository-url>
cd faculty-appraisal-system
```

2. Install backend dependencies:
```bash
cd backend
npm install
```

3. Install frontend dependencies:
```bash
cd ../frontend
npm install
```

4. Configure environment variables:
- Copy `.env.example` to `.env` in the backend directory
- Update the variables as needed

5. Start MongoDB:
```bash
mongod
```

6. Start the backend server:
```bash
cd backend
npm run dev
```

7. Start the frontend development server:
```bash
cd frontend
npm run dev
```

## Project Structure

```
faculty-appraisal-system/
├── frontend/
│   ├── src/
│   │   ├── pages/         # All pages
│   │   ├── styles/        # All CSS files
│   │   ├── components/    # Reusable components
│   │   ├── context/       # React context
│   │   └── utils/         # Utility functions
│   └── package.json
│
├── backend/
│   ├── config/           # Configuration files
│   ├── controllers/      # Route controllers
│   ├── middleware/       # Custom middleware
│   ├── models/          # Database models
│   ├── routes/          # API routes
│   ├── utils/           # Utility functions
│   └── package.json
│
└── README.md
```

## API Endpoints

### Authentication
- POST /api/auth/register - Register new user
- POST /api/auth/login - Login user
- GET /api/auth/me - Get current user
- PUT /api/auth/profile - Update user profile

### Faculty
- GET /api/faculty/dashboard - Get faculty dashboard
- POST /api/faculty/appraisal - Submit appraisal
- GET /api/faculty/publications - Get publications
- POST /api/faculty/publications - Add publication
- GET /api/faculty/events - Get events
- POST /api/faculty/events - Add event

### Admin
- GET /api/admin/dashboard - Get admin dashboard
- GET /api/admin/faculty-list - Get all faculty
- GET /api/admin/appraisal-review - Get appraisals for review
- PUT /api/admin/appraisal-review/:id - Review appraisal

## Contributing

1. Fork the repository
2. Create your feature branch
3. Commit your changes
4. Push to the branch
5. Create a new Pull Request

## License

This project is licensed under the MIT License - see the LICENSE file for details. 