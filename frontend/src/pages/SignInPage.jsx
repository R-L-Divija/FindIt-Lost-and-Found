import React, { useState } from 'react';
import { Link, useNavigate, useLocation } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import Logo from '../components/Logo';
import {
  CheckCircle2,
  AlertCircle,
  Eye,
  EyeOff,
  Mail,
  Lock,
  ShieldCheck,
  KeyRound,
} from 'lucide-react';

const SignInPage = () => {
  const [formData, setFormData] = useState({
    email: '',
    password: '',
  });
  const [showPassword, setShowPassword] = useState(false);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const [forgotNotice, setForgotNotice] = useState(false);

  const { signin } = useAuth();
  const navigate = useNavigate();
  const location = useLocation();

  const from = location.state?.from?.pathname || '/dashboard';

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
    if (error) setError('');
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!formData.email.trim() || !formData.password) {
      setError('Please provide your email and password.');
      return;
    }

    try {
      setLoading(true);
      setError('');
      const res = await signin(formData.email.trim(), formData.password);
      if (res.success) {
        navigate(from, { replace: true });
      }
    } catch (err) {
      setError(err.userMessage || 'Invalid email or password.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-[#F5F3FF] flex flex-col">
      {/* Top Bar with Logo and Sign Up button */}
      <header className="px-6 py-4 flex items-center justify-between max-w-7xl mx-auto w-full">
        <Logo size="md" to="/" />
        <Link
          to="/signup"
          className="text-sm font-bold text-white bg-[#6D28D9] hover:bg-[#5B21B6] px-5 py-2 rounded-xl shadow-xs transition"
        >
          Sign Up
        </Link>
      </header>

      {/* Main Split Screen Container */}
      <div className="flex-1 flex items-center justify-center p-4 sm:p-6 lg:p-8">
        <div className="w-full max-w-5xl bg-white rounded-3xl border border-purple-100 shadow-xl overflow-hidden grid grid-cols-1 lg:grid-cols-12">
          {/* Left Hero / Brand Panel */}
          <div className="lg:col-span-5 bg-gradient-to-br from-purple-50 via-purple-100/40 to-white p-8 lg:p-12 flex flex-col justify-between border-b lg:border-b-0 lg:border-r border-purple-100">
            <div>
              <h2 className="text-3xl font-black text-[#1E1B4B] tracking-tight">
                Welcome Back!
              </h2>
              <p className="mt-3 text-sm text-gray-600 leading-relaxed">
                Sign in to continue to your FindIt account and manage your reports.
              </p>

              {/* Checklist */}
              <ul className="mt-8 space-y-4">
                {[
                  'Access your reports',
                  'Manage your items',
                  'Track claim requests',
                  'Help reunite lost items',
                ].map((item, idx) => (
                  <li key={idx} className="flex items-center gap-3 text-sm font-semibold text-gray-700">
                    <div className="w-5 h-5 rounded-full bg-[#6D28D9] text-white flex items-center justify-center shrink-0 shadow-xs">
                      <CheckCircle2 className="w-3.5 h-3.5" />
                    </div>
                    <span>{item}</span>
                  </li>
                ))}
              </ul>
            </div>

            {/* Security Themed Illustration (matches screenshot) */}
            <div className="mt-8 pt-6 border-t border-purple-200/50 flex flex-col items-center justify-center text-center">
              <div className="w-20 h-20 rounded-3xl bg-gradient-to-br from-[#7C3AED] to-[#6D28D9] flex items-center justify-center text-white mb-3 shadow-lg shadow-purple-500/25">
                <ShieldCheck className="w-10 h-10" />
              </div>
              <p className="text-xs font-bold text-purple-900">
                Encrypted & Secure Access
              </p>
              <p className="text-[11px] text-gray-500 mt-0.5">
                Your report information is verified and protected.
              </p>
            </div>
          </div>

          {/* Right Form Card Panel */}
          <div className="lg:col-span-7 p-8 lg:p-12">
            <div className="max-w-md mx-auto">
              <h3 className="text-2xl font-bold text-[#1E1B4B]">Sign In</h3>
              <p className="text-xs text-gray-500 mt-1">
                Enter your registered credentials to access your dashboard.
              </p>

              {error && (
                <div className="mt-4 p-3.5 rounded-xl bg-rose-50 border border-rose-200 text-rose-700 text-xs sm:text-sm flex items-start gap-2.5">
                  <AlertCircle className="w-4 h-4 shrink-0 mt-0.5" />
                  <span>{error}</span>
                </div>
              )}

              {forgotNotice && (
                <div className="mt-4 p-3.5 rounded-xl bg-purple-50 border border-purple-200 text-purple-800 text-xs flex items-start gap-2">
                  <KeyRound className="w-4 h-4 shrink-0 mt-0.5 text-[#6D28D9]" />
                  <span>
                    To reset your password, please contact the campus administrator or IT desk at admin@findit.local.
                  </span>
                </div>
              )}

              <form onSubmit={handleSubmit} className="mt-6 space-y-4">
                {/* Email */}
                <div>
                  <label className="block text-xs font-bold text-gray-700 uppercase tracking-wider mb-1.5">
                    Email
                  </label>
                  <div className="relative">
                    <Mail className="w-4 h-4 text-gray-400 absolute left-3.5 top-1/2 -translate-y-1/2" />
                    <input
                      type="email"
                      name="email"
                      value={formData.email}
                      onChange={handleChange}
                      placeholder="Enter your email"
                      required
                      className="w-full pl-10 pr-4 py-2.5 rounded-xl border border-gray-300 focus:border-[#6D28D9] focus:ring-2 focus:ring-purple-200 outline-none text-sm transition"
                    />
                  </div>
                </div>

                {/* Password */}
                <div>
                  <div className="flex items-center justify-between mb-1.5">
                    <label className="block text-xs font-bold text-gray-700 uppercase tracking-wider">
                      Password
                    </label>
                    <button
                      type="button"
                      onClick={() => setForgotNotice(!forgotNotice)}
                      className="text-xs font-semibold text-[#6D28D9] hover:underline"
                    >
                      Forgot Password?
                    </button>
                  </div>
                  <div className="relative">
                    <Lock className="w-4 h-4 text-gray-400 absolute left-3.5 top-1/2 -translate-y-1/2" />
                    <input
                      type={showPassword ? 'text' : 'password'}
                      name="password"
                      value={formData.password}
                      onChange={handleChange}
                      placeholder="Enter your password"
                      required
                      className="w-full pl-10 pr-11 py-2.5 rounded-xl border border-gray-300 focus:border-[#6D28D9] focus:ring-2 focus:ring-purple-200 outline-none text-sm transition"
                    />
                    <button
                      type="button"
                      onClick={() => setShowPassword(!showPassword)}
                      className="absolute right-3.5 top-1/2 -translate-y-1/2 text-gray-400 hover:text-gray-600 focus:outline-none"
                    >
                      {showPassword ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
                    </button>
                  </div>
                </div>

                {/* Submit Button */}
                <button
                  type="submit"
                  disabled={loading}
                  className="w-full mt-2 py-3 px-4 rounded-xl bg-[#6D28D9] hover:bg-[#5B21B6] text-white text-sm font-bold shadow-md shadow-purple-500/25 transition-all duration-150 flex items-center justify-center gap-2 disabled:opacity-50"
                >
                  {loading && (
                    <svg className="animate-spin w-4 h-4 text-white" fill="none" viewBox="0 0 24 24">
                      <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" />
                      <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8v8H4z" />
                    </svg>
                  )}
                  <span>Sign In</span>
                </button>
              </form>

              {/* Footer link */}
              <p className="mt-6 text-center text-xs text-gray-600">
                New to FindIt?{' '}
                <Link to="/signup" className="font-bold text-[#6D28D9] hover:underline">
                  Create an account
                </Link>
              </p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default SignInPage;
