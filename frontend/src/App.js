import React, { useState, useEffect } from 'react';
import { Navigate, Route, Routes, useLocation } from 'react-router-dom';
import Dashboard from './pages/Dashboard';
import Login from './components/Login';
import LeadCapturePage from './pages/LeadCapturePage';
import AdsExpenses from './pages/AdsExpenses';
import './styles/index.css';

function AppContent() {
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [loading, setLoading] = useState(true);
  const location = useLocation();
  const isPublicPage =
    location.pathname === '/' && Boolean(new URLSearchParams(location.search).get('source'));

  useEffect(() => {
    const token = localStorage.getItem('authToken');
    if (token && !isPublicPage) {
      setIsAuthenticated(true);
    } else if (!token) {
      setIsAuthenticated(false);
    }
    setLoading(false);
  }, [isPublicPage]);

  const handleLoginSuccess = () => {
    setIsAuthenticated(true);
  };

  const handleLogout = () => {
    localStorage.removeItem('authToken');
    localStorage.removeItem('username');
    setIsAuthenticated(false);
  };

  if (loading) {
    return (
      <div style={{
        display: 'flex',
        justifyContent: 'center',
        alignItems: 'center',
        height: '100vh',
        background: 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)',
        color: 'white',
        fontSize: '1.2rem'
      }}>
        ⏳ Loading...
      </div>
    );
  }

  // Public lead capture page (accessible via URL with source parameter)
  if (isPublicPage) {
    return (
      <div className="App">
        <LeadCapturePage />
      </div>
    );
  }

  return (
    <div className="App">
      {isAuthenticated ? (
        <Routes>
          <Route path="/" element={<Dashboard onLogout={handleLogout} />} />
          <Route path="/ads-expenses" element={<AdsExpenses />} />
          <Route path="*" element={<Navigate to="/" replace />} />
        </Routes>
      ) : (
        <Login onLoginSuccess={handleLoginSuccess} />
      )}
    </div>
  );
}

function App() {
  return <AppContent />;
}

export default App;
