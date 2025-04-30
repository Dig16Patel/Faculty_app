import React from 'react';
import { Routes, Route } from 'react-router-dom';
import FacultyDashboard from '../pages/faculty/Dashboard';
import Appraisal from '../pages/faculty/Appraisal';
import Publications from '../pages/faculty/Publications';
import Events from '../pages/faculty/Events';
import Profile from '../pages/faculty/Profile';

const FacultyRoutes = () => {
  return (
    <Routes>
      <Route path="/" element={<FacultyDashboard />} />
      <Route path="/appraisal" element={<Appraisal />} />
      <Route path="/publications" element={<Publications />} />
      <Route path="/events" element={<Events />} />
      <Route path="/profile" element={<Profile />} />
    </Routes>
  );
};

export default FacultyRoutes; 