import React from 'react';
import { Routes, Route, Navigate } from 'react-router-dom';
import Landing from './pages/Landing';
import Dashboard from './pages/Dashboard';
import ProtectedRoute from './components/ProtectedRoute';
import useAuth from './stores/useAuth';

function App() {
  const { userUid, empresaUid } = useAuth();

  return (
    <Routes>
      <Route 
        path="/" 
        element={
          userUid && empresaUid ? (
            <Navigate to="/dashboard" replace />
          ) : (
            <Landing />
          )
        } 
      />
      <Route 
        path="/dashboard" 
        element={
          <ProtectedRoute>
            <Dashboard />
          </ProtectedRoute>
        } 
      />
      <Route 
        path="/assistants" 
        element={
          <ProtectedRoute>
            <Dashboard />
          </ProtectedRoute>
        } 
      />
      <Route 
        path="/statistics" 
        element={
          <ProtectedRoute>
            <Dashboard />
          </ProtectedRoute>
        } 
      />
      <Route path="*" element={<Navigate to="/" replace />} />
    </Routes>
  );
}

export default App;