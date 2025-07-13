import React from 'react';
import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom';
import { Toaster } from '@/components/ui/toaster';
import { AuthProvider } from '@/contexts/AuthContext';
import { DashboardProvider } from '@/contexts/DashboardContext';
import { ProtectedRoute } from '@/components/auth/ProtectedRoute';
import { Layout } from '@/components/layout/Layout';
import { AuthLayout } from '@/components/layout/AuthLayout';

// Pages
import Index from '@/pages/Index';
import { Dashboard } from '@/pages/Dashboard';
import { Upload } from '@/pages/Upload';
import { BriefView } from '@/pages/BriefView';
import { History } from '@/pages/History';
import { Analytics } from '@/pages/Analytics';
import { Settings } from '@/pages/Settings';
import { Templates } from '@/pages/Templates';
import { Login } from '@/pages/auth/Login';
import { Register } from '@/pages/auth/Register';
import { ResetPassword } from '@/pages/auth/ResetPassword';

function App() {
  return (
    <AuthProvider>
      <Router>
        <div className="min-h-screen bg-background">
          <Routes>
            {/* Public Landing Page */}
            <Route path="/" element={<Index />} />

            {/* Auth Routes */}
            <Route path="/auth" element={<AuthLayout />}>
              <Route path="login" element={<Login />} />
              <Route path="register" element={<Register />} />
              <Route path="reset" element={<ResetPassword />} />
            </Route>

            {/* Protected App Routes with Dashboard Context */}
            <Route path="/app" element={
              <ProtectedRoute>
                <DashboardProvider>
                  <Layout />
                </DashboardProvider>
              </ProtectedRoute>
            }>
              <Route index element={<Dashboard />} />
              <Route path="upload" element={<Upload />} />
              <Route path="briefs/:id" element={<BriefView />} />
              <Route path="history" element={<History />} />
              <Route path="analytics" element={<Analytics />} />
              <Route path="settings" element={<Settings />} />
              <Route path="templates" element={<Templates />} />
            </Route>

            {/* Redirect unknown routes */}
            <Route path="*" element={<Navigate to="/" replace />} />
          </Routes>
          <Toaster />
        </div>
      </Router>
    </AuthProvider>
  );
}

export default App;