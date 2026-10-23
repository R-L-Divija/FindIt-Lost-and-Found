import React from 'react';
import { NavLink, useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import Logo from './Logo';
import {
  LayoutDashboard,
  Search,
  AlertCircle,
  PackagePlus,
  FileText,
  User,
  LogOut,
  X,
} from 'lucide-react';

const Sidebar = ({ mobileOpen, setMobileOpen }) => {
  const { signout, user } = useAuth();
  const navigate = useNavigate();

  const handleSignOut = () => {
    signout();
    navigate('/');
  };

  const navItems = [
    { name: 'Dashboard', path: '/dashboard', icon: LayoutDashboard },
    { name: 'Search Items', path: '/search', icon: Search },
    { name: 'Report Lost Item', path: '/report-lost', icon: AlertCircle },
    { name: 'Report Found Item', path: '/report-found', icon: PackagePlus },
    { name: 'My Reports', path: '/my-reports', icon: FileText },
    { name: 'Profile', path: '/profile', icon: User },
  ];

  const linkClass = ({ isActive }) =>
    `flex items-center gap-3.5 px-4 py-3 rounded-xl text-sm font-semibold transition-all duration-150 ${
      isActive
        ? 'bg-[#EDE9FE] text-[#6D28D9] font-bold shadow-xs'
        : 'text-gray-600 hover:bg-purple-50 hover:text-[#6D28D9]'
    }`;

  const sidebarContent = (
    <div className="flex flex-col h-full bg-white border-r border-purple-100 shadow-sm">
      {/* Brand Logo header */}
      <div className="p-6 pb-4 flex items-center justify-between border-b border-purple-50">
        <Logo size="md" to="/dashboard" />
        {setMobileOpen && (
          <button
            type="button"
            onClick={() => setMobileOpen(false)}
            className="md:hidden p-1.5 rounded-lg text-gray-500 hover:bg-gray-100"
          >
            <X className="w-5 h-5" />
          </button>
        )}
      </div>

      {/* Nav Links */}
      <nav className="flex-1 px-4 py-6 space-y-1.5 overflow-y-auto">
        {navItems.map((item) => {
          const Icon = item.icon;
          return (
            <NavLink
              key={item.path}
              to={item.path}
              onClick={() => setMobileOpen && setMobileOpen(false)}
              className={linkClass}
            >
              <Icon className="w-5 h-5 shrink-0" />
              <span>{item.name}</span>
            </NavLink>
          );
        })}
      </nav>

      {/* User info snippet & Sign Out */}
      <div className="p-4 border-t border-purple-100 space-y-2">
        <div className="flex items-center gap-3 px-3 py-2 rounded-xl bg-purple-50/70">
          <div className="w-9 h-9 rounded-full bg-[#6D28D9] text-white flex items-center justify-center font-bold text-sm shadow-xs">
            {user?.name ? user.name.charAt(0).toUpperCase() : 'U'}
          </div>
          <div className="flex-1 min-w-0">
            <p className="text-xs font-bold text-gray-900 truncate">{user?.name || 'User'}</p>
            <p className="text-[11px] text-gray-500 truncate">{user?.email || ''}</p>
          </div>
        </div>

        <button
          type="button"
          onClick={handleSignOut}
          className="w-full flex items-center gap-3.5 px-4 py-2.5 rounded-xl text-sm font-semibold text-gray-600 hover:text-red-600 hover:bg-red-50 transition-all duration-150"
        >
          <LogOut className="w-5 h-5" />
          <span>Sign Out</span>
        </button>
      </div>
    </div>
  );

  return (
    <>
      {/* Desktop fixed sidebar */}
      <aside className="hidden md:flex flex-col w-64 shrink-0 h-screen sticky top-0 z-30">
        {sidebarContent}
      </aside>

      {/* Mobile drawer overlay */}
      {mobileOpen && (
        <div className="fixed inset-0 z-50 md:hidden flex">
          <div
            className="fixed inset-0 bg-black/40 backdrop-blur-xs transition-opacity"
            onClick={() => setMobileOpen(false)}
          />
          <div className="relative flex flex-col w-72 max-w-[80vw] h-full z-10 animate-in slide-in-from-left duration-200">
            {sidebarContent}
          </div>
        </div>
      )}
    </>
  );
};

export default Sidebar;
