import React from 'react';
import { Routes, Route } from 'react-router-dom';
import { Toaster } from 'react-hot-toast';
import { AuthProvider } from './context/AuthContext';
import ProtectedRoute from './components/ProtectedRoute';
import Navbar from './components/Navbar';
import Footer from './components/Footer';

import Home from './pages/Home';
import SignIn from './pages/SignIn';
import SignUp from './pages/SignUp';
import Jobs from './pages/Jobs';
import JobDetail from './pages/JobDetail';
import CandidateDashboard from './pages/CandidateDashboard';
import AdminDashboard from './pages/AdminDashboard';
import ManageJobs from './pages/ManageJobs';
import ManageApplications from './pages/ManageApplications';
import ManageInterviews from './pages/ManageInterviews';
import ManageBranches from './pages/ManageBranches';
import Profile from './pages/Profile';
import NotFound from './pages/NotFound';

export default function App() {
  return (
    <AuthProvider>
      <Toaster
        position="top-right"
        toastOptions={{
          style: { background: '#1a2e3a', color: '#e0e0e0', border: '1px solid #2a4a5a' },
          success: { iconTheme: { primary: '#5dd88a', secondary: '#0d1f2d' } },
          error: { iconTheme: { primary: '#ef4444', secondary: '#0d1f2d' } },
        }}
      />
      <Navbar />
      <Routes>
        <Route path="/" element={<Home />} />
        <Route path="/signin" element={<SignIn />} />
        <Route path="/signup" element={<SignUp />} />
        <Route path="/jobs" element={<Jobs />} />
        <Route path="/jobs/:id" element={<JobDetail />} />

        {/* Candidate protected routes */}
        <Route path="/dashboard" element={
          <ProtectedRoute roles={['candidate']}><CandidateDashboard /></ProtectedRoute>
        } />
        <Route path="/profile" element={
          <ProtectedRoute><Profile /></ProtectedRoute>
        } />

        {/* HR/Admin protected routes */}
        <Route path="/admin" element={
          <ProtectedRoute roles={['hr', 'admin']}><AdminDashboard /></ProtectedRoute>
        } />
        <Route path="/admin/jobs" element={
          <ProtectedRoute roles={['hr', 'admin']}><ManageJobs /></ProtectedRoute>
        } />
        <Route path="/admin/applications" element={
          <ProtectedRoute roles={['hr', 'admin']}><ManageApplications /></ProtectedRoute>
        } />
        <Route path="/admin/interviews" element={
          <ProtectedRoute roles={['hr', 'admin']}><ManageInterviews /></ProtectedRoute>
        } />
        <Route path="/admin/branches" element={
          <ProtectedRoute roles={['admin']}><ManageBranches /></ProtectedRoute>
        } />

        <Route path="*" element={<NotFound />} />
      </Routes>
      <Footer />
    </AuthProvider>
  );
}
