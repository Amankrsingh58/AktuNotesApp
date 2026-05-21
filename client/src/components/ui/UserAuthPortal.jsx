import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import Icon from '../AppIcon';
import Button from './Button';
import Input from './Input';

const UserAuthPortal = () => {
  const navigate = useNavigate();
  const [isOpen, setIsOpen] = useState(false);
  const [authMode, setAuthMode] = useState('signin');
  const [userRole, setUserRole] = useState(null);
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [showDropdown, setShowDropdown] = useState(false);

  const [formData, setFormData] = useState({
    email: '',
    password: '',
    name: '',
    role: 'student'
  });

  const [errors, setErrors] = useState({});

  useEffect(() => {
    const storedAuth = localStorage.getItem('edunotesAuth');
    if (storedAuth) {
      const authData = JSON.parse(storedAuth);
      setIsAuthenticated(true);
      setUserRole(authData?.role);
    }
  }, []);

  useEffect(() => {
    if (isOpen) {
      document.body.style.overflow = 'hidden';
    } else {
      document.body.style.overflow = 'unset';
    }

    return () => {
      document.body.style.overflow = 'unset';
    };
  }, [isOpen]);

  const handleInputChange = (e) => {
    const { name, value } = e?.target;
    setFormData(prev => ({
      ...prev,
      [name]: value
    }));
    if (errors?.[name]) {
      setErrors(prev => ({
        ...prev,
        [name]: ''
      }));
    }
  };

  const validateForm = () => {
    const newErrors = {};

    if (!formData?.email) {
      newErrors.email = 'Email is required';
    } else if (!/\S+@\S+\.\S+/?.test(formData?.email)) {
      newErrors.email = 'Email is invalid';
    }

    if (!formData?.password) {
      newErrors.password = 'Password is required';
    } else if (formData?.password?.length < 6) {
      newErrors.password = 'Password must be at least 6 characters';
    }

    if (authMode === 'signup' && !formData?.name) {
      newErrors.name = 'Name is required';
    }

    setErrors(newErrors);
    return Object.keys(newErrors)?.length === 0;
  };

  const handleSubmit = (e) => {
    e?.preventDefault();

    if (!validateForm()) {
      return;
    }

    const authData = {
      email: formData?.email,
      name: authMode === 'signup' ? formData?.name : 'User',
      role: formData?.role,
      timestamp: new Date()?.toISOString()
    };

    localStorage.setItem('edunotesAuth', JSON.stringify(authData));
    setIsAuthenticated(true);
    setUserRole(authData?.role);
    setIsOpen(false);

    setFormData({
      email: '',
      password: '',
      name: '',
      role: 'student'
    });

    if (authData?.role === 'admin') {
      navigate('/admin-dashboard');
    }
  };

  const handleSignOut = () => {
    localStorage.removeItem('edunotesAuth');
    setIsAuthenticated(false);
    setUserRole(null);
    setShowDropdown(false);
    navigate('/home');
  };

  const openAuthModal = (mode) => {
    setAuthMode(mode);
    setIsOpen(true);
    setErrors({});
  };

  const closeAuthModal = () => {
    setIsOpen(false);
    setFormData({
      email: '',
      password: '',
      name: '',
      role: 'student'
    });
    setErrors({});
  };

  const roleOptions = [
    { value: 'student', label: 'Student', icon: 'GraduationCap' },
    { value: 'staff', label: 'Staff/Creator', icon: 'BookOpen' },
    { value: 'admin', label: 'Administrator', icon: 'Shield' }
  ];

  if (isAuthenticated) {
    return (
      <div className="relative">
        <button
          onClick={() => setShowDropdown(!showDropdown)}
          className="flex items-center space-x-2 px-3 py-2 rounded-lg hover:bg-muted transition-smooth"
        >
          <div className="w-8 h-8 rounded-full bg-primary/10 flex items-center justify-center">
            <Icon name="User" size={18} color="var(--color-primary)" />
          </div>
          <Icon
            name="ChevronDown"
            size={16}
            color="var(--color-foreground)"
            className={`transition-smooth ${showDropdown ? 'rotate-180' : ''}`}
          />
        </button>
        {showDropdown && (
          <>
            <div
              className="fixed inset-0 z-[90]"
              onClick={() => setShowDropdown(false)}
            />
            <div className="absolute right-0 top-full mt-2 w-56 bg-popover border border-border rounded-xl shadow-lg z-[100] overflow-hidden">
              <div className="p-4 border-b border-border">
                <p className="text-sm font-medium text-foreground">
                  {JSON.parse(localStorage.getItem('edunotesAuth'))?.name}
                </p>
                <p className="text-xs text-muted-foreground capitalize">
                  {userRole}
                </p>
              </div>

              <div className="py-2">
                {userRole === 'admin' && (
                  <button
                    onClick={() => {
                      navigate('/admin-dashboard');
                      setShowDropdown(false);
                    }}
                    className="w-full px-4 py-2 text-left text-sm hover:bg-muted transition-smooth flex items-center space-x-2"
                  >
                    <Icon name="LayoutDashboard" size={16} />
                    <span>Dashboard</span>
                  </button>
                )}

                <button
                  onClick={handleSignOut}
                  className="w-full px-4 py-2 text-left text-sm text-error hover:bg-error/10 transition-smooth flex items-center space-x-2"
                >
                  <Icon name="LogOut" size={16} />
                  <span>Sign Out</span>
                </button>
              </div>
            </div>
          </>
        )}
      </div>
    );
  }

  return (
    <>
      <div className="flex items-center space-x-2">
        <Button variant="ghost" size="sm" onClick={() => openAuthModal('signin')}>
          Sign In
        </Button>
        <Button variant="default" size="sm" onClick={() => openAuthModal('signup')}>
          Get Started
        </Button>
      </div>
      {isOpen && (
        <div className="fixed inset-0 z-[200] flex items-center justify-center p-4">
          <div
            className="absolute inset-0 bg-background"
            onClick={closeAuthModal}
          />

          <div className="relative w-full max-w-md bg-card rounded-2xl shadow-2xl elevation-5 overflow-hidden animate-scale-in">
            <button
              onClick={closeAuthModal}
              className="absolute top-4 right-4 p-2 rounded-lg hover:bg-muted transition-smooth z-10"
              aria-label="Close"
            >
              <Icon name="X" size={20} color="var(--color-foreground)" />
            </button>

            <div className="p-8">
              <div className="text-center mb-8">
                <div className="w-16 h-16 bg-primary/10 rounded-2xl flex items-center justify-center mx-auto mb-4">
                  <Icon name="GraduationCap" size={32} color="var(--color-primary)" />
                </div>
                <h2 className="text-2xl font-semibold text-foreground mb-2">
                  {authMode === 'signin' ? 'Welcome Back' : 'Join EduNotes'}
                </h2>
                <p className="text-sm text-muted-foreground">
                  {authMode === 'signin' ?'Sign in to access your notes' :'Create an account to get started'}
                </p>
              </div>

              <form onSubmit={handleSubmit} className="space-y-4">
                {authMode === 'signup' && (
                  <Input
                    label="Full Name"
                    type="text"
                    name="name"
                    placeholder="Enter your name"
                    value={formData?.name}
                    onChange={handleInputChange}
                    error={errors?.name}
                    required
                  />
                )}

                <Input
                  label="Email Address"
                  type="email"
                  name="email"
                  placeholder="Enter your email"
                  value={formData?.email}
                  onChange={handleInputChange}
                  error={errors?.email}
                  required
                />

                <Input
                  label="Password"
                  type="password"
                  name="password"
                  placeholder="Enter your password"
                  value={formData?.password}
                  onChange={handleInputChange}
                  error={errors?.password}
                  required
                />

                {authMode === 'signup' && (
                  <div className="space-y-2">
                    <label className="text-sm font-medium text-foreground">
                      I am a
                    </label>
                    <div className="grid grid-cols-3 gap-2">
                      {roleOptions?.map((role) => (
                        <button
                          key={role?.value}
                          type="button"
                          onClick={() => setFormData(prev => ({ ...prev, role: role?.value }))}
                          className={`p-3 rounded-lg border transition-smooth ${
                            formData?.role === role?.value
                              ? 'border-primary bg-primary/10' :'border-border hover:border-primary/50'
                          }`}
                        >
                          <Icon
                            name={role?.icon}
                            size={20}
                            color={
                              formData?.role === role?.value
                                ? 'var(--color-primary)'
                                : 'var(--color-muted-foreground)'
                            }
                            className="mx-auto mb-1"
                          />
                          <span className="text-xs font-medium block">
                            {role?.label}
                          </span>
                        </button>
                      ))}
                    </div>
                  </div>
                )}

                <Button type="submit" variant="default" fullWidth className="mt-6">
                  {authMode === 'signin' ? 'Sign In' : 'Create Account'}
                </Button>
              </form>

              <div className="mt-6 text-center">
                <button
                  type="button"
                  onClick={() => setAuthMode(authMode === 'signin' ? 'signup' : 'signin')}
                  className="text-sm text-primary hover:underline"
                >
                  {authMode === 'signin' ? "Don't have an account? Sign up"
                    : 'Already have an account? Sign in'}
                </button>
              </div>
            </div>
          </div>
        </div>
      )}
    </>
  );
};

export default UserAuthPortal;