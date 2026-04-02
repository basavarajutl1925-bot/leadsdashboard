import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import StatsCards from '../components/StatsCards';
import FiltersPanel from '../components/FiltersPanel';
import LeadsTable from '../components/LeadsTable';
import ChangePassword from './ChangePassword';
import UserManagement from './UserManagement';
import '../styles/Dashboard.css';

const Dashboard = ({ onLogout }) => {
  const [refreshTrigger, setRefreshTrigger] = useState(0);
  const [filters, setFilters] = useState({});
  const [currentView, setCurrentView] = useState('dashboard');
  const [showUserMenu, setShowUserMenu] = useState(false);

  const handleFilterChange = (newFilters) => {
    setFilters(newFilters);
  };

  const handleRefresh = () => {
    setRefreshTrigger(prev => prev + 1);
  };

  const handleLogout = () => {
    if (window.confirm('Are you sure you want to logout?')) {
      localStorage.removeItem('token');
      localStorage.removeItem('user');
      localStorage.removeItem('authToken');
      localStorage.removeItem('username');
      onLogout();
    }
  };

  // ✅ Safe user parsing
  let user = { username: "User" };
  try {
    user = JSON.parse(localStorage.getItem('user')) || user;
  } catch (e) {
    console.error("Invalid user data in localStorage");
  }

  const isAdmin = user?.role === 'admin';

  // 🔄 Render Views
  if (currentView === 'changePassword') {
    return <ChangePassword />;
  }

  if (currentView === 'userManagement') {
    return <UserManagement />;
  }

  return (
    <div className="dashboard">
      {/* Header */}
      <header className="dashboard-header">
        <div className="header-content">
          <h1>📊 Lead Management Dashboard</h1>
          <p>View, track, and manage your sales leads efficiently</p>
        </div>

        <div className="header-actions">
          <Link to="/ads-expenses" className="ads-expense-nav-btn">
            <span className="ads-expense-nav-icon">💸</span>
            <span>Ads Expenses</span>
          </Link>

          <div className="user-menu-container">
            <button
              className="user-menu-btn"
              onClick={() => setShowUserMenu(!showUserMenu)}
            >
              👤 {user.username}
            </button>

            {showUserMenu && (
              <div className="user-menu-dropdown">
                <div className="user-menu-header">
                  <strong>{user.username}</strong>
                  <small>{user.email}</small>
                </div>

                <hr />

                <button
                  className="menu-item"
                  onClick={() => {
                    setCurrentView('changePassword');
                    setShowUserMenu(false);
                  }}
                >
                  🔐 Change Password
                </button>

                {isAdmin && (
                  <button
                    className="menu-item"
                    onClick={() => {
                      setCurrentView('userManagement');
                      setShowUserMenu(false);
                    }}
                  >
                    👥 Manage Users
                  </button>
                )}

                <hr />

                <button
                  className="menu-item logout"
                  onClick={handleLogout}
                >
                  🚪 Logout
                </button>
              </div>
            )}
          </div>
        </div>
      </header>

      {/* Main Content */}
      <main className="dashboard-main">

        {/* Lead Capture Section */}
        <section className="section info-section">
          <div className="info-banner">
            <span className="info-icon">ℹ️</span>
            <div className="info-content">
              <h3>Lead Capture</h3>
              <p>Share these public links with your customers:</p>

              <div className="lead-links">
                <code>http://localhost:3000/?source=instagram</code>
                <code>http://localhost:3000/?source=facebook</code>
                <code>http://localhost:3000/?source=whatsapp</code>
              </div>
            </div>
          </div>
        </section>

        {/* Stats */}
        <section className="section stats-section">
          <StatsCards refreshTrigger={refreshTrigger} />
        </section>

        {/* Filters */}
        <section className="section filters-section">
          <FiltersPanel
            onFilterChange={handleFilterChange}
            onRefresh={handleRefresh}
          />
        </section>

        {/* Leads Table */}
        <section className="section table-section">
          <LeadsTable
            refreshTrigger={refreshTrigger}
            filters={filters}
          />
        </section>

      </main>

      {/* Footer */}
      <footer className="dashboard-footer">
        <p>
          © 2024 Lead Management Dashboard | MERN Stack with WhatsApp Integration
        </p>
      </footer>
    </div>
  );
};

export default Dashboard;
