import React, { useState, useEffect } from 'react';
import { 
  Zap, 
  Lock, 
  Mail, 
  ArrowRight, 
  Eye, 
  EyeOff, 
  Calendar, 
  Sun, 
  Moon, 
  ChevronDown, 
  MapPin, 
  Users, 
  CreditCard,
  UserCheck,
  CheckCircle2,
  Briefcase
} from 'lucide-react';
import { INITIAL_USERS } from '../data/mockData';
import heroLight1 from '../assets/hero-light-1.png';
import heroLight2 from '../assets/hero-light-2.png';
import heroLight3 from '../assets/hero-light-3.png';
import heroDark1 from '../assets/hero-dark-1.png';
import heroDark2 from '../assets/hero-dark-2.png';
import heroDark3 from '../assets/hero-dark-3.png';

const LIGHT_IMAGES = [heroLight1, heroLight2, heroLight3];
const DARK_IMAGES = [heroDark1, heroDark2, heroDark3];

export default function LoginPage({ 
  onLoginSuccess, 
  users = INITIAL_USERS,
  theme = 'dark',
  setTheme
}) {
  const userList = users && users.length > 0 ? users : INITIAL_USERS;
  
  const [selectedUser, setSelectedUser] = useState(userList[0]);
  const [email, setEmail] = useState(userList[0].email);
  const [password, setPassword] = useState('••••••••');
  const [showPassword, setShowPassword] = useState(false);
  const [rememberMe, setRememberMe] = useState(true);
  const [showUserDropdown, setShowUserDropdown] = useState(false);
  const [activeHeroTab, setActiveHeroTab] = useState('generators');
  const [activeSlide, setActiveSlide] = useState(0);

  const isLight = theme === 'light';
  const currentImages = isLight ? LIGHT_IMAGES : DARK_IMAGES;

  // Reset slide index when theme changes
  useEffect(() => {
    setActiveSlide(0);
  }, [theme]);

  // Automatic background image slideshow (fades every 4 seconds)
  useEffect(() => {
    const timer = setInterval(() => {
      setActiveSlide((prev) => (prev + 1) % currentImages.length);
    }, 4000);

    return () => clearInterval(timer);
  }, [currentImages.length]);

  // Handle switching user presets
  const handleSelectUser = (user) => {
    setSelectedUser(user);
    setEmail(user.email);
    setShowUserDropdown(false);
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    const inputClean = email.trim().toLowerCase();
    const matchedUser = userList.find(u => 
      u.email.toLowerCase() === inputClean || u.id.toLowerCase() === inputClean
    ) || selectedUser;
    
    onLoginSuccess(matchedUser);
  };

  const toggleTheme = () => {
    if (setTheme) {
      setTheme(theme === 'light' ? 'dark' : 'light');
    }
  };

  // Extract initials for circle avatar
  const initials = selectedUser.name
    ? selectedUser.name.split(' ').map(n => n[0]).join('').substring(0, 2).toUpperCase()
    : 'SN';

  const userRoleDisplay = selectedUser.role === 'admin' 
    ? 'Admin' 
    : selectedUser.role === 'supervisor' 
      ? 'Supervisor' 
      : 'Finance';

  return (
    <div className={`login-page-wrapper ${isLight ? 'light-mode' : 'dark-mode'}`}>
      
      {/* LEFT SHOWCASE PANEL (58% width on desktop) */}
      <div className="login-left-panel">
        {/* Generator Facility Background Image Slideshow - strictly contained within left panel */}
        <div className="slideshow-container">
          {currentImages.map((imgSrc, idx) => (
            <img 
              key={`${theme}-slide-${idx}`}
              src={imgSrc} 
              alt={`Generator Facility Background ${idx + 1}`} 
              className={`login-bg-image ${idx === activeSlide ? 'active' : ''}`}
            />
          ))}
        </div>

        {/* Overlay Tint & Flares */}
        <div className="login-left-overlay"></div>
        <div className="login-diagonal-flare flare-top"></div>
        <div className="login-diagonal-flare flare-bottom"></div>

        {/* Slideshow Pagination Indicator Dots */}
        <div className="slideshow-indicators">
          {currentImages.map((_, idx) => (
            <button
              key={idx}
              type="button"
              className={`slideshow-dot ${idx === activeSlide ? 'active' : ''}`}
              onClick={() => setActiveSlide(idx)}
              aria-label={`Go to slide ${idx + 1}`}
            />
          ))}
        </div>

        {/* Top-Left Logo & Branding */}
        <header className="login-left-header">
          <div className="login-brand-group">
            <div className="login-brand-icon">
              <Zap size={18} className="text-white" />
            </div>
            <div>
              <h1 className="login-brand-title">
                MAINTENANCE <span className="brand-accent">APP</span>
              </h1>
              <p className="login-brand-subtitle">Manage your sites, generators & payments</p>
            </div>
          </div>
        </header>

        {/* Left Showcase Hero Content */}
        <div className="login-hero-showcase">
          <div className="hero-tagline">
            SMART MAINTENANCE &nbsp;&bull;&nbsp; RELIABLE OPERATIONS
          </div>

          <h2 className="hero-heading">
            Keep Your Generators <br />
            <span className="hero-heading-highlight">Running Smoothly</span>
          </h2>

          <p className="hero-description">
            Track maintenance, manage sites, handle suppliers and payments — all in one place.
          </p>

          {/* Bottom Floating Feature Capsule Bar */}
          <div className="hero-floating-pills">
            <button 
              className={`hero-pill ${activeHeroTab === 'generators' ? 'active' : ''}`}
              onClick={() => setActiveHeroTab('generators')}
              type="button"
            >
              <Briefcase size={18} className="pill-icon" />
              <span>Generators</span>
            </button>

            <div className="hero-pill-divider"></div>

            <button 
              className={`hero-pill ${activeHeroTab === 'sites' ? 'active' : ''}`}
              onClick={() => setActiveHeroTab('sites')}
              type="button"
            >
              <MapPin size={18} className="pill-icon" />
              <span>Sites</span>
            </button>

            <div className="hero-pill-divider"></div>

            <button 
              className={`hero-pill ${activeHeroTab === 'suppliers' ? 'active' : ''}`}
              onClick={() => setActiveHeroTab('suppliers')}
              type="button"
            >
              <Users size={18} className="pill-icon" />
              <span>Suppliers</span>
            </button>

            <div className="hero-pill-divider"></div>

            <button 
              className={`hero-pill ${activeHeroTab === 'payments' ? 'active' : ''}`}
              onClick={() => setActiveHeroTab('payments')}
              type="button"
            >
              <CreditCard size={18} className="pill-icon" />
              <span>Payments</span>
            </button>
          </div>
        </div>
      </div>

      {/* RIGHT LOGIN FORM PANEL (50% width on desktop) */}
      <div className="login-right-panel">
        {/* Top Floating Controls Header */}
        <header className="login-top-header">
          <div className="login-header-controls">
            {/* Theme Toggle Button */}
            <button 
              className="login-theme-toggle"
              onClick={toggleTheme}
              title={isLight ? 'Switch to Dark Theme' : 'Switch to Light Theme'}
              type="button"
              aria-label="Toggle Theme"
            >
              {isLight ? <Moon size={16} /> : <Sun size={16} />}
            </button>
          </div>
        </header>

        {/* Centered Login Card Wrapper */}
        <div className="login-card-container">
          <div className="login-form-card">
            
            <div className="form-intro">
              <h3 className="form-title">Sign In to Workspace</h3>
              <p className="form-subtitle">
                Enter your corporate credentials below to log into your site workspace.
              </p>
            </div>

            {/* Login Form */}
            <form onSubmit={handleSubmit} className="login-form">
              
              {/* Email Field */}
              <div className="form-field">
                <label htmlFor="email" className="field-label">Corporate Email Address</label>
                <div className="input-wrapper">
                  <Mail size={16} className="input-icon" />
                  <input 
                    id="email"
                    type="email"
                    className="login-input"
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    placeholder="admin@company.com"
                    required
                  />
                </div>
              </div>

              {/* Password Field */}
              <div className="form-field">
                <div className="field-label-row">
                  <label htmlFor="password" className="field-label">Password</label>
                  <a href="#forgot" onClick={(e) => e.preventDefault()} className="forgot-link">
                    Forgot password?
                  </a>
                </div>
                <div className="input-wrapper">
                  <Lock size={16} className="input-icon" />
                  <input 
                    id="password"
                    type={showPassword ? 'text' : 'password'}
                    className="login-input"
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
                    placeholder="••••••••"
                    required
                  />
                  <button 
                    type="button"
                    className="password-toggle-btn"
                    onClick={() => setShowPassword(!showPassword)}
                    aria-label={showPassword ? 'Hide password' : 'Show password'}
                  >
                    {showPassword ? <EyeOff size={16} /> : <Eye size={16} />}
                  </button>
                </div>
              </div>

              {/* Remember Me Checkbox */}
              <div className="checkbox-row">
                <label className="custom-checkbox-label">
                  <input 
                    type="checkbox"
                    checked={rememberMe}
                    onChange={(e) => setRememberMe(e.target.checked)}
                    className="hidden-checkbox"
                  />
                  <span className="checkbox-box">
                    {rememberMe && (
                      <svg viewBox="0 0 24 24" width="12" height="12" stroke="currentColor" strokeWidth="3" fill="none">
                        <polyline points="20 6 9 17 4 12"></polyline>
                      </svg>
                    )}
                  </span>
                  <span className="checkbox-text">Remember login session</span>
                </label>
              </div>

              {/* Submit Button */}
              <button type="submit" className="login-submit-btn">
                <span>Sign In to Maintenance Portal</span>
                <ArrowRight size={16} className="btn-arrow" />
              </button>
            </form>

            {/* Bottom Security Callout Banner */}
            <div className="security-callout">
              <UserCheck size={16} className="security-icon" />
              <div className="security-text">
                <strong className="security-highlight">Role Access Controlled/Enforced</strong> &ndash; Site data isolation active for {userRoleDisplay} login.
              </div>
            </div>

          </div>
        </div>

      </div>

    </div>
  );
}
