import React, { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import { Bell, Menu, User, LogOut, CheckCircle2 } from 'lucide-react';

const DashboardHeader = ({ setMobileOpen }) => {
  const { user, signout } = useAuth();
  const [dropdownOpen, setDropdownOpen] = useState(false);
  const [showNotification, setShowNotification] = useState(false);
  const navigate = useNavigate();

  const handleSignOut = () => {
    signout();
    navigate('/');
  };

  return (
    <header className="sticky top-0 z-20 h-16 bg-white/95 backdrop-blur-md border-b border-purple-100 px-4 sm:px-6 flex items-center justify-between">
      {/* Left: Mobile hamburger & breadcrumb links */}
      <div className="flex items-center gap-4">
        <button
          type="button"
          onClick={() => setMobileOpen(true)}
          className="md:hidden p-2 rounded-lg text-gray-600 hover:text-gray-900 hover:bg-purple-50"
        >
          <Menu className="w-5 h-5" />
        </button>

        <nav className="hidden sm:flex items-center gap-6 text-sm font-semibold text-gray-600">
          <Link to="/" className="hover:text-[#6D28D9] transition-colors">
            Home
          </Link>
          <Link to="/search" className="hover:text-[#6D28D9] transition-colors">
            Browse
          </Link>
          <Link to="/report-lost" className="hover:text-[#6D28D9] transition-colors">
            Report
          </Link>
        </nav>
      </div>

      {/* Right: Notifications & Profile */}
      <div className="flex items-center gap-3 sm:gap-4">
        {/* Notification Bell */}
        <div className="relative">
          <button
            type="button"
            onClick={() => setShowNotification(!showNotification)}
            className="p-2 rounded-full text-gray-600 hover:text-[#6D28D9] hover:bg-purple-50 transition relative"
            aria-label="Notifications"
          >
            <Bell className="w-5 h-5" />
            <span className="absolute top-1.5 right-1.5 w-2 h-2 bg-[#6D28D9] rounded-full ring-2 ring-white"></span>
          </button>

          {showNotification && (
            <>
              <div
                className="fixed inset-0 z-10"
                onClick={() => setShowNotification(false)}
              />
              <div className="absolute right-0 mt-2 w-80 bg-white rounded-xl shadow-xl border border-purple-100 p-4 z-20 animate-in fade-in zoom-in-95">
                <div className="flex items-center justify-between pb-3 border-b border-gray-100">
                  <h4 className="text-sm font-bold text-gray-900">Notifications</h4>
                  <span className="text-xs bg-purple-100 text-[#6D28D9] font-semibold px-2 py-0.5 rounded-full">
                    1 New
                  </span>
                </div>
                <div className="py-3 flex items-start gap-3">
                  <div className="w-8 h-8 rounded-full bg-purple-100 flex items-center justify-center text-[#6D28D9] shrink-0">
                    <CheckCircle2 className="w-4 h-4" />
                  </div>
                  <div>
                    <p className="text-xs font-semibold text-gray-900">Welcome to FindIt!</p>
                    <p className="text-[11px] text-gray-500 mt-0.5">
                      You can report lost or found items and search the active database anytime.
                    </p>
                    <span className="text-[10px] text-purple-600 font-medium mt-1 block">Just now</span>
                  </div>
                </div>
              </div>
            </>
          )}
        </div>

        {/* User Pill Dropdown */}
        <div className="relative">
          <button
            type="button"
            onClick={() => setDropdownOpen(!dropdownOpen)}
            className="flex items-center gap-2.5 p-1 sm:pr-3 rounded-full hover:bg-purple-50 transition border border-transparent hover:border-purple-200"
          >
            <div className="w-8 h-8 rounded-full bg-gradient-to-br from-[#7C3AED] to-[#6D28D9] text-white flex items-center justify-center font-bold text-sm shadow-xs">
              {user?.name ? user.name.charAt(0).toUpperCase() : 'U'}
            </div>
            <span className="hidden sm:inline-block text-sm font-semibold text-gray-800 max-w-[120px] truncate">
              {user?.name || 'Account'}
            </span>
            <svg
              className={`hidden sm:block w-4 h-4 text-gray-500 transition-transform ${dropdownOpen ? 'rotate-180' : ''}`}
              fill="none"
              stroke="currentColor"
              viewBox="0 0 24 24"
            >
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M19 9l-7 7-7-7" />
            </svg>
          </button>

          {dropdownOpen && (
            <>
              <div
                className="fixed inset-0 z-10"
                onClick={() => setDropdownOpen(false)}
              />
              <div className="absolute right-0 mt-2 w-52 bg-white rounded-xl shadow-xl border border-purple-100 py-1.5 z-20 animate-in fade-in zoom-in-95">
                <div className="px-4 py-2 border-b border-gray-100">
                  <p className="text-xs text-gray-500 font-medium">Signed in as</p>
                  <p className="text-sm font-bold text-gray-900 truncate">{user?.name}</p>
                  <p className="text-xs text-gray-500 truncate">{user?.email}</p>
                </div>
                <Link
                  to="/profile"
                  onClick={() => setDropdownOpen(false)}
                  className="flex items-center gap-2.5 px-4 py-2 text-sm text-gray-700 hover:bg-purple-50 hover:text-[#6D28D9]"
                >
                  <User className="w-4 h-4" />
                  Profile Details
                </Link>
                <div className="border-t border-gray-100 my-1" />
                <button
                  type="button"
                  onClick={handleSignOut}
                  className="w-full text-left flex items-center gap-2.5 px-4 py-2 text-sm text-red-600 hover:bg-red-50 transition"
                >
                  <LogOut className="w-4 h-4" />
                  Sign Out
                </button>
              </div>
            </>
          )}
        </div>
      </div>
    </header>
  );
};

export default DashboardHeader;
