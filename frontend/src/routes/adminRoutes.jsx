import React from 'react';
import { Routes, Route } from 'react-router-dom';
import Dashboard from '../pages/admin/Dashboard';
import FacultyManagement from '../pages/admin/FacultyManagement';
import AppraisalManagement from '../pages/admin/AppraisalManagement';
import EventManagement from '../pages/admin/EventManagement';
import PublicationManagement from '../pages/admin/PublicationManagement';
import Reports from '../pages/admin/Reports';
import Settings from '../pages/admin/Settings';
import Notifications from '../pages/admin/Notifications';

const AdminRoutes = () => {
  return (
    <Routes>
      <Route path="/" element={<Dashboard />} />
      <Route path="/faculty" element={<FacultyManagement />} />
      <Route path="/faculty/new" element={<FacultyManagement />} />
      <Route path="/faculty/:id" element={<FacultyManagement />} />
      <Route path="/appraisals" element={<AppraisalManagement />} />
      <Route path="/events" element={<EventManagement />} />
      <Route path="/publications" element={<PublicationManagement />} />
      <Route path="/reports" element={<Reports />} />
      <Route path="/reports/generate" element={<Reports />} />
      <Route path="/settings" element={<Settings />} />
      <Route path="/notifications" element={<Notifications />} />
    </Routes>
  );
};

export default AdminRoutes; 