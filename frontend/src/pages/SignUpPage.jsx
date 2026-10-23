import React, { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import Logo from '../components/Logo';
import {
  CheckCircle2,
  AlertCircle,
  Eye,
  EyeOff,
  User,
  Mail,
  Lock,
  Users,
} from 'lucide-react';

const SignUpPage = () => {
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    password: '',
    confirmPassword: '',
  });
  const [showPassword, setShowPassword] = useState(false);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');

  const { signup } = useAuth();
  const navigate = useNavigate();

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
    if (error) setError('');
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!formData.name.trim() || !formData.email.trim() || !formData.password) {
      setError('Please fill in all required fields.');
      return;
    }

    if (formData.password.length < 8) {
      setError('Password must be at least 8 characters long.');
      return;
    }

    if (formData.password !== formData.confirmPassword) {
      setError('Passwords do not match.');
      return;
    }

    try {
      setLoading(true);
      setError('');
      const res = await signup(formData.name.trim(), formData.email.trim(), formData.password);
      if (res.success) {
        navigate('/dashboard');
      }
    } catch (err) {
      setError(err.userMessage || 'Sign up failed. Please check your details.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-[#F5F3FF] flex flex-col">
      {/* Top Bar with Logo and Sign In link */}
      <header className="px-6 py-4 flex items-center justify-between max-w-7xl mx-auto w-full">
        <Logo size="md" to="/" />
        <Link
          to="/signin"
          className="text-sm font-bold text-gray-700 hover:text-[#6D28D9] px-4 py-2 rounded-xl hover:bg-purple-100/50 transition"
        >
          Sign In
        </Link>
      </header>

      {/* Main Split Screen Container */}
      <div className="flex-1 flex items-center justify-center p-4 sm:p-6 lg:p-8">
        <div className="w-full max-w-5xl bg-white rounded-3xl border border-purple-100 shadow-xl overflow-hidden grid grid-cols-1 lg:grid-cols-12">
          {/* Left Hero / Brand Panel */}
          <div className="lg:col-span-5 bg-gradient-to-br from-purple-50 via-purple-100/40 to-white p-8 lg:p-12 flex flex-col justify-between border-b lg:border-b-0 lg:border-r border-purple-100">
            <div>
              <h2 className="text-3xl font-black text-[#1E1B4B] tracking-tight">
                Join FindIt
              </h2>
              <p className="mt-3 text-sm text-gray-600 leading-relaxed">
                Create an account to report lost or found items and help reunite people with their belongings.
              </p>

              {/* Checklist */}
              <ul className="mt-8 space-y-4">
                {[
                  'Report lost or found items',
                  'Search items easily',
                  'Track your reports',
                  'Be part of a helpful community',
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

            {/* Illustration Graphic */}
            <div className="mt-8 pt-6 border-t border-purple-200/50 flex flex-col items-center justify-center text-center">
              <div className="w-20 h-20 rounded-full bg-purple-200/50 flex items-center justify-center text-[#6D28D9] mb-3 shadow-inner">
                <Users className="w-10 h-10" />
              </div>
              <p className="text-xs font-bold text-purple-900">
                Over 500+ Campus Members Reunited
              </p>
              <p className="text-[11px] text-gray-500 mt-0.5">
                Quick, safe, and dependable community recovery.
              </p>
            </div>
          </div>

          {/* Right Form Card Panel */}
          <div className="lg:col-span-7 p-8 lg:p-12">
            <div className="max-w-md mx-auto">
              <h3 className="text-2xl font-bold text-[#1E1B4B]">Create Account</h3>
              <p className="text-xs text-gray-500 mt-1">
                Enter your details to register your free account.
              </p>

              {error && (
                <div className="mt-4 p-3.5 rounded-xl bg-rose-50 border border-rose-200 text-rose-700 text-xs sm:text-sm flex items-start gap-2.5">
                  <AlertCircle className="w-4 h-4 shrink-0 mt-0.5" />
                  <span>{error}</span>
                </div>
              )}

              <form onSubmit={handleSubmit} className="mt-6 space-y-4">
                {/* Full Name */}
                <div>
                  <label className="block text-xs font-bold text-gray-700 uppercase tracking-wider mb-1.5">
                    Full Name
                  </label>
                  <div className="relative">
                    <User className="w-4 h-4 text-gray-400 absolute left-3.5 top-1/2 -translate-y-1/2" />
                    <input
                      type="text"
                      name="name"
                      value={formData.name}
                      onChange={handleChange}
                      placeholder="Enter your name"
                      required
                      className="w-full pl-10 pr-4 py-2.5 rounded-xl border border-gray-300 focus:border-[#6D28D9] focus:ring-2 focus:ring-purple-200 outline-none text-sm transition"
                    />
                  </div>
                </div>

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
                  <label className="block text-xs font-bold text-gray-700 uppercase tracking-wider mb-1.5">
                    Password
                  </label>
                  <div className="relative">
                    <Lock className="w-4 h-4 text-gray-400 absolute left-3.5 top-1/2 -translate-y-1/2" />
                    <input
                      type={showPassword ? 'text' : 'password'}
                      name="password"
                      value={formData.password}
                      onChange={handleChange}
                      placeholder="Minimum 8 characters"
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

                {/* Confirm Password */}
                <div>
                  <label className="block text-xs font-bold text-gray-700 uppercase tracking-wider mb-1.5">
                    Confirm Password
                  </label>
                  <div className="relative">
                    <Lock className="w-4 h-4 text-gray-400 absolute left-3.5 top-1/2 -translate-y-1/2" />
                    <input
                      type={showPassword ? 'text' : 'password'}
                      name="confirmPassword"
                      value={formData.confirmPassword}
                      onChange={handleChange}
                      placeholder="Confirm your password"
                      required
                      className="w-full pl-10 pr-4 py-2.5 rounded-xl border border-gray-300 focus:border-[#6D28D9] focus:ring-2 focus:ring-purple-200 outline-none text-sm transition"
                    />
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
                  <span>Sign Up</span>
                </button>
              </form>

              {/* Footer link */}
              <p className="mt-6 text-center text-xs text-gray-600">
                Already have an account?{' '}
                <Link to="/signin" className="font-bold text-[#6D28D9] hover:underline">
                  Sign In
                </Link>
              </p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default SignUpPage;
