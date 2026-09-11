import React from 'react';
import { Route, Routes, Navigate } from 'react-router-dom';

import Layout from './components/Layout';
import AuthLayout from './components/AuthLayout';
import DashboardLayout from './components/DashboardLayout';
import LoginPage from './pages/LoginPage/LoginPage';
import RegisterPage from './pages/RegisterPage/RegisterPage';
import DashboardPage from './pages/DashboardPage/DashboardPage';
import DevicesPage from './pages/DevicesPage/DevicesPage';
import FeaturesPage from './pages/FeaturesPage/FeaturesPage';
import AccessibilityPage from './pages/AccessibilityPage/AccessibilityPage';
import CloudPage from './pages/CloudPage/CloudPage';
import ProfilePage from './pages/ProfilePage/ProfilePage';
import HelpPage from './pages/HelpPage/HelpPage';
import NotFound from './pages/NotFound/NotFound';

const RoutesComponent = () => {
  return (
    <Routes>
      <Route element={<AuthLayout />}>
        <Route index element={<Navigate to="/login" replace />} />
        <Route path="login" element={<LoginPage />} />
        <Route path="register" element={<RegisterPage />} />
      </Route>
      <Route path="help" element={<HelpPage />} />
      <Route element={<Layout />}>
        <Route element={<DashboardLayout />}>
          <Route path="dashboard" element={<DashboardPage />} />
          <Route path="dashboard/devices" element={<DevicesPage />} />
          <Route path="dashboard/features" element={<FeaturesPage />} />
          <Route path="dashboard/accessibility" element={<AccessibilityPage />} />
          <Route path="dashboard/cloud" element={<CloudPage />} />
          <Route path="dashboard/profile" element={<ProfilePage />} />
        </Route>
      </Route>
      <Route path="*" element={<NotFound />} />
    </Routes>
  );
};

export default RoutesComponent;
