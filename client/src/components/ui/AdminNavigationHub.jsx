import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import Icon from '../AppIcon';
import Button from './Button';

const AdminNavigationHub = () => {
  const navigate = useNavigate();
  const [activeTab, setActiveTab] = useState('overview');
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [userRole, setUserRole] = useState(null);

  useEffect(() => {
    const storedAuth = localStorage.getItem('edunotesAuth');
    if (storedAuth) {
      const authData = JSON.parse(storedAuth);
      setIsAuthenticated(true);
      setUserRole(authData?.role);

      if (authData?.role !== 'admin') {
        navigate('/home');
      }
    } else {
      navigate('/home');
    }
  }, [navigate]);

  const navigationTabs = [
    {
      id: 'overview',
      label: 'Overview',
      icon: 'LayoutDashboard',
      description: 'Platform statistics and insights'
    },
    {
      id: 'users',
      label: 'User Management',
      icon: 'Users',
      description: 'Manage students, staff, and administrators'
    },
    {
      id: 'content',
      label: 'Content Moderation',
      icon: 'FileCheck',
      description: 'Review and approve uploaded notes'
    },
    {
      id: 'analytics',
      label: 'Analytics',
      icon: 'BarChart3',
      description: 'Performance metrics and reports'
    },
    {
      id: 'settings',
      label: 'Settings',
      icon: 'Settings',
      description: 'Platform configuration and preferences'
    }
  ];

  const handleTabChange = (tabId) => {
    setActiveTab(tabId);
  };

  const handleBackToHome = () => {
    navigate('/home');
  };

  if (!isAuthenticated || userRole !== 'admin') {
    return null;
  }

  return (
    <div className="min-h-screen bg-background">
      <div className="bg-card border-b border-border sticky top-0 z-50">
        <div className="max-w-[1440px] mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex items-center justify-between h-16">
            <div className="flex items-center space-x-4">
              <button
                onClick={handleBackToHome}
                className="p-2 rounded-lg hover:bg-muted transition-smooth"
                aria-label="Back to home"
              >
                <Icon name="ArrowLeft" size={20} color="var(--color-foreground)" />
              </button>

              <div className="flex items-center space-x-3">
                <div className="w-10 h-10 bg-primary/10 rounded-xl flex items-center justify-center">
                  <Icon name="Shield" size={24} color="var(--color-primary)" />
                </div>
                <div>
                  <h1 className="text-lg font-semibold text-foreground">
                    Admin Dashboard
                  </h1>
                  <p className="text-xs text-muted-foreground">
                    Platform Management
                  </p>
                </div>
              </div>
            </div>

            <Button variant="outline" size="sm" onClick={handleBackToHome}>
              Exit Admin
            </Button>
          </div>
        </div>
      </div>
      <div className="max-w-[1440px] mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <div className="bg-card rounded-xl border border-border overflow-hidden">
          <div className="border-b border-border overflow-x-auto">
            <nav className="flex space-x-1 p-2 min-w-max">
              {navigationTabs?.map((tab) => (
                <button
                  key={tab?.id}
                  onClick={() => handleTabChange(tab?.id)}
                  className={`flex items-center space-x-2 px-4 py-3 rounded-lg transition-smooth ${
                    activeTab === tab?.id
                      ? 'bg-primary text-primary-foreground'
                      : 'text-foreground/70 hover:text-foreground hover:bg-muted'
                  }`}
                >
                  <Icon
                    name={tab?.icon}
                    size={18}
                    color={activeTab === tab?.id ? 'currentColor' : 'var(--color-foreground)'}
                  />
                  <span className="text-sm font-medium whitespace-nowrap">
                    {tab?.label}
                  </span>
                </button>
              ))}
            </nav>
          </div>

          <div className="p-8">
            <div className="mb-6">
              <h2 className="text-2xl font-semibold text-foreground mb-2">
                {navigationTabs?.find(tab => tab?.id === activeTab)?.label}
              </h2>
              <p className="text-sm text-muted-foreground">
                {navigationTabs?.find(tab => tab?.id === activeTab)?.description}
              </p>
            </div>

            <div className="bg-muted/30 rounded-xl p-12 text-center">
              <Icon
                name={navigationTabs?.find(tab => tab?.id === activeTab)?.icon}
                size={48}
                color="var(--color-muted-foreground)"
                className="mx-auto mb-4"
              />
              <p className="text-muted-foreground">
                {activeTab === 'overview' && 'Platform overview and statistics will be displayed here'}
                {activeTab === 'users' && 'User management interface will be displayed here'}
                {activeTab === 'content' && 'Content moderation tools will be displayed here'}
                {activeTab === 'analytics' && 'Analytics and reports will be displayed here'}
                {activeTab === 'settings' && 'Platform settings will be displayed here'}
              </p>
            </div>
          </div>
        </div>

        <div className="mt-6 grid grid-cols-1 md:grid-cols-3 gap-4">
          <div className="bg-card rounded-xl border border-border p-6">
            <div className="flex items-center justify-between mb-4">
              <h3 className="text-sm font-medium text-muted-foreground">
                Total Users
              </h3>
              <Icon name="Users" size={20} color="var(--color-primary)" />
            </div>
            <p className="text-3xl font-semibold text-foreground data-text">
              1,247
            </p>
            <p className="text-xs text-success mt-2">
              +12% from last month
            </p>
          </div>

          <div className="bg-card rounded-xl border border-border p-6">
            <div className="flex items-center justify-between mb-4">
              <h3 className="text-sm font-medium text-muted-foreground">
                Total Notes
              </h3>
              <Icon name="FileText" size={20} color="var(--color-accent)" />
            </div>
            <p className="text-3xl font-semibold text-foreground data-text">
              1,098
            </p>
            <p className="text-xs text-success mt-2">
              +8% from last month
            </p>
          </div>

          <div className="bg-card rounded-xl border border-border p-6">
            <div className="flex items-center justify-between mb-4">
              <h3 className="text-sm font-medium text-muted-foreground">
                Pending Reviews
              </h3>
              <Icon name="Clock" size={20} color="var(--color-warning)" />
            </div>
            <p className="text-3xl font-semibold text-foreground data-text">
              23
            </p>
            <p className="text-xs text-muted-foreground mt-2">
              Requires attention
            </p>
          </div>
        </div>
      </div>
    </div>
  );
};

export default AdminNavigationHub;