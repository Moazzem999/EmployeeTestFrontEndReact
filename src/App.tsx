import React from 'react';
import { Routes, Route, Navigate } from 'react-router-dom';
import DashboardLayout from '@/layouts/DashboardLayout';
import Dashboard from '@/pages/Dashboard';
import EmployeeList from '@/pages/EmployeeList';
import EmployeeFormPage from '@/pages/EmployeeFormPage';
import Login from '@/pages/Login';

const ProtectedRoute = ({ children }: { children: React.ReactNode }) => {
  const token = localStorage.getItem('token');
  if (!token) return <Navigate to="/login" replace />;
  return <DashboardLayout>{children}</DashboardLayout>;
};

function App() {
  return (
    <Routes>
      <Route path="/login" element={<Login />} />
      <Route 
        path="/" 
        element={
          <ProtectedRoute>
            <Dashboard />
          </ProtectedRoute>
        } 
      />
      <Route 
        path="/employees" 
        element={
          <ProtectedRoute>
            <EmployeeList />
          </ProtectedRoute>
        } 
      />
      <Route 
        path="/employees/add" 
        element={
          <ProtectedRoute>
            <EmployeeFormPage />
          </ProtectedRoute>
        } 
      />
      <Route 
        path="/employees/edit/:id" 
        element={
          <ProtectedRoute>
            <EmployeeFormPage />
          </ProtectedRoute>
        } 
      />
      <Route path="*" element={<Navigate to="/" replace />} />
    </Routes>
  );
}

export default App;
