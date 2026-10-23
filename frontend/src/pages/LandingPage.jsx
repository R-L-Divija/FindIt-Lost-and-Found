import React, { useState, useEffect } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { itemsAPI } from '../services/api';
import ItemCard from '../components/ItemCard';
import ItemCardSkeleton from '../components/ItemCardSkeleton';
import EmptyState from '../components/EmptyState';
import {
  Search,
  CheckCircle2,
  FileText,
  Users,
  Star,
  ArrowRight,
  Shield,
  Clock,
  Sparkles,
  Smartphone,
  Key,
  Watch,
  MapPin,
} from 'lucide-react';

const LandingPage = () => {
  const [searchQuery, setSearchQuery] = useState('');
  const [recentItems, setRecentItems] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const navigate = useNavigate();

  useEffect(() => {
    const fetchRecentItems = async () => {
      try {
        setLoading(true);
        const res = await itemsAPI.getItems();
        if (res.success && Array.isArray(res.items)) {
          // Take the latest 6 items
          setRecentItems(res.items.slice(0, 6));
        }
      } catch (err) {
        console.warn('Could not fetch recent items from backend:', err.userMessage);
        setError(err.userMessage || 'Could not load recent items.');
      } finally {
        setLoading(false);
      }
    };

    fetchRecentItems();
  }, []);

  const handleSearchSubmit = (e) => {
    e.preventDefault();
    if (searchQuery.trim()) {
      navigate(`/search?search=${encodeURIComponent(searchQuery.trim())}`);
    } else {
      navigate('/search');
    }
  };

  return (
    <div className="flex flex-col min-h-screen">
      {/* Hero Section */}
      <section className="relative overflow-hidden pt-10 pb-16 sm:pt-16 sm:pb-24 lg:pt-20 lg:pb-28">
        {/* Soft background glows */}
        <div className="absolute top-1/4 left-1/2 -translate-x-1/2 -translate-y-1/2 w-96 h-96 bg-purple-300/30 rounded-full blur-3xl pointer-events-none" />
        <div className="absolute top-1/2 right-10 w-72 h-72 bg-violet-400/20 rounded-full blur-2xl pointer-events-none" />

        <div className="relative max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-12 items-center">
            {/* Left Content */}
            <div className="lg:col-span-7 space-y-6 text-center lg:text-left">
              {/* Badge */}
              <div className="inline-flex items-center gap-2 px-3.5 py-1.5 rounded-full bg-purple-100 text-[#6D28D9] text-xs font-bold tracking-wider uppercase">
                <Sparkles className="w-3.5 h-3.5" />
                <span>Lost Something? Found Something?</span>
              </div>

              {/* Main Headline */}
              <h1 className="text-4xl sm:text-5xl lg:text-6xl font-black text-[#1E1B4B] tracking-tight leading-[1.1]">
                Search. Find.{' '}
                <span className="text-[#6D28D9] underline decoration-purple-300 decoration-wavy decoration-2">
                  Reunite.
                </span>
              </h1>

              {/* Subtitle */}
              <p className="text-base sm:text-lg text-gray-600 max-w-2xl mx-auto lg:mx-0 leading-relaxed font-normal">
                FindIt helps you report lost or found items and get them back to their owners. Connect with your campus and local community quickly and securely.
              </p>

              {/* Search Bar Input */}
              <form
                onSubmit={handleSearchSubmit}
                className="relative max-w-xl mx-auto lg:mx-0 mt-4 group"
              >
                <div className="relative flex items-center bg-white rounded-2xl shadow-lg shadow-purple-500/10 border border-purple-200/80 p-2 transition-all focus-within:ring-2 focus-within:ring-[#6D28D9] focus-within:border-transparent">
                  <Search className="w-5 h-5 text-gray-400 ml-3 mr-2 shrink-0 group-focus-within:text-[#6D28D9] transition-colors" />
                  <input
                    type="text"
                    value={searchQuery}
                    onChange={(e) => setSearchQuery(e.target.value)}
                    placeholder="Search for items (e.g., phone, bag, keys...)"
                    className="w-full bg-transparent px-2 py-2 text-sm text-gray-800 placeholder-gray-400 focus:outline-none"
                  />
                  <button
                    type="submit"
                    className="shrink-0 px-5 py-3 rounded-xl bg-[#6D28D9] hover:bg-[#5B21B6] text-white text-sm font-bold transition-all duration-150 shadow-sm hover:shadow-md hover:shadow-purple-500/30 flex items-center gap-1.5"
                  >
                    <span>Search</span>
                    <Search className="w-4 h-4 hidden sm:inline" />
                  </button>
                </div>
              </form>

              {/* Action Buttons: Report Lost / Report Found */}
              <div className="flex flex-wrap items-center justify-center lg:justify-start gap-4 pt-2">
                <Link
                  to="/report-lost"
                  className="px-6 py-3.5 rounded-xl bg-[#6D28D9] hover:bg-[#5B21B6] text-white text-sm font-bold shadow-md shadow-purple-500/25 transition-all duration-150 hover:-translate-y-0.5 flex items-center gap-2"
                >
                  <span>Report Lost Item</span>
                  <ArrowRight className="w-4 h-4" />
                </Link>
                <Link
                  to="/report-found"
                  className="px-6 py-3.5 rounded-xl bg-purple-100/90 hover:bg-purple-200 text-[#6D28D9] text-sm font-bold border border-purple-200 transition-all duration-150 hover:-translate-y-0.5 flex items-center gap-2"
                >
                  <span>Report Found Item</span>
                </Link>
              </div>
            </div>

            {/* Right Hero Graphic Illustration (matches reference screenshot) */}
            <div className="lg:col-span-5 flex justify-center relative">
              <div className="relative w-80 h-80 sm:w-96 sm:h-96 flex items-center justify-center">
                {/* Concentric rings */}
                <div className="absolute inset-0 rounded-full border border-purple-200/60 animate-pulse pointer-events-none" />
                <div className="absolute inset-8 rounded-full border border-purple-300/40 pointer-events-none" />

                {/* Central Purple Backpack Vector Card */}
                <div className="relative z-10 w-56 h-64 bg-gradient-to-b from-[#7C3AED] to-[#5B21B6] rounded-3xl p-5 shadow-2xl shadow-purple-600/30 flex flex-col items-center justify-center text-white border-2 border-white/20 transform -rotate-3 hover:rotate-0 transition-transform duration-300">
                  <div className="w-16 h-4 bg-purple-400/50 rounded-full mb-3" />
                  <div className="w-36 h-36 bg-purple-800/40 rounded-2xl flex flex-col items-center justify-center p-3 relative border border-white/10">
                    {/* Backpack graphic representation */}
                    <svg viewBox="0 0 64 64" fill="none" className="w-24 h-24 text-white">
                      <path
                        d="M20 20C20 13.37 25.37 8 32 8s12 5.37 12 12v32c0 4.42-3.58 8-8 8H28c-4.42 0-8-3.58-8-8V20z"
                        fill="currentColor"
                        fillOpacity="0.9"
                      />
                      <rect x="24" y="32" width="16" height="16" rx="4" fill="#DDD6FE" fillOpacity="0.4" />
                      <line x1="28" y1="24" x2="36" y2="24" stroke="#FFF" strokeWidth="2" strokeLinecap="round" />
                      <circle cx="32" cy="40" r="2" fill="#FFF" />
                    </svg>
                  </div>
                  <span className="text-xs font-bold tracking-widest text-purple-200 uppercase mt-2">
                    Campus Lost & Found
                  </span>
                </div>

                {/* Floating Item 1: Smartphone */}
                <div className="absolute -top-3 left-4 z-20 bg-white p-3 rounded-2xl shadow-lg border border-purple-100 flex items-center gap-2 transform -translate-y-2 animate-bounce duration-1000">
                  <div className="w-8 h-8 rounded-xl bg-purple-50 text-[#6D28D9] flex items-center justify-center">
                    <Smartphone className="w-4 h-4" />
                  </div>
                  <div>
                    <p className="text-[10px] text-gray-400 font-semibold uppercase">Found</p>
                    <p className="text-xs font-bold text-gray-800">iPhone 13</p>
                  </div>
                </div>

                {/* Floating Item 2: Keys */}
                <div className="absolute bottom-2 -left-4 z-20 bg-white p-3 rounded-2xl shadow-lg border border-purple-100 flex items-center gap-2 transform translate-y-1">
                  <div className="w-8 h-8 rounded-xl bg-rose-50 text-rose-600 flex items-center justify-center">
                    <Key className="w-4 h-4" />
                  </div>
                  <div>
                    <p className="text-[10px] text-gray-400 font-semibold uppercase">Lost</p>
                    <p className="text-xs font-bold text-gray-800">Car Keys</p>
                  </div>
                </div>

                {/* Floating Item 3: Smartwatch */}
                <div className="absolute top-10 -right-2 z-20 bg-white p-3 rounded-2xl shadow-lg border border-purple-100 flex items-center gap-2">
                  <div className="w-8 h-8 rounded-xl bg-amber-50 text-amber-600 flex items-center justify-center">
                    <Watch className="w-4 h-4" />
                  </div>
                  <div>
                    <p className="text-[10px] text-gray-400 font-semibold uppercase">Reunited</p>
                    <p className="text-xs font-bold text-gray-800">Apple Watch</p>
                  </div>
                </div>

                {/* Floating Pin */}
                <div className="absolute -bottom-4 right-10 z-20 bg-white px-3 py-1.5 rounded-full shadow-md border border-purple-100 flex items-center gap-1.5 text-xs font-bold text-[#6D28D9]">
                  <MapPin className="w-3.5 h-3.5 text-purple-600" />
                  <span>Main Library</span>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Statistics Row (Exact match to reference image) */}
      <section className="relative z-10 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 -mt-6 sm:-mt-10 mb-16 w-full">
        <div className="grid grid-cols-2 lg:grid-cols-4 gap-4 sm:gap-6 bg-white rounded-3xl p-6 sm:p-8 border border-purple-100 shadow-xl shadow-purple-900/5">
          {/* Stat 1 */}
          <div className="flex items-center gap-4">
            <div className="w-12 h-12 rounded-2xl bg-purple-50 text-[#6D28D9] flex items-center justify-center shrink-0">
              <CheckCircle2 className="w-6 h-6" />
            </div>
            <div>
              <h3 className="text-2xl sm:text-3xl font-extrabold text-[#1E1B4B]">125+</h3>
              <p className="text-xs sm:text-sm font-medium text-gray-500">Items Reunited</p>
            </div>
          </div>

          {/* Stat 2 */}
          <div className="flex items-center gap-4">
            <div className="w-12 h-12 rounded-2xl bg-blue-50 text-blue-600 flex items-center justify-center shrink-0">
              <FileText className="w-6 h-6" />
            </div>
            <div>
              <h3 className="text-2xl sm:text-3xl font-extrabold text-[#1E1B4B]">300+</h3>
              <p className="text-xs sm:text-sm font-medium text-gray-500">Active Reports</p>
            </div>
          </div>

          {/* Stat 3 */}
          <div className="flex items-center gap-4">
            <div className="w-12 h-12 rounded-2xl bg-emerald-50 text-emerald-600 flex items-center justify-center shrink-0">
              <Users className="w-6 h-6" />
            </div>
            <div>
              <h3 className="text-2xl sm:text-3xl font-extrabold text-[#1E1B4B]">500+</h3>
              <p className="text-xs sm:text-sm font-medium text-gray-500">Registered Users</p>
            </div>
          </div>

          {/* Stat 4 */}
          <div className="flex items-center gap-4">
            <div className="w-12 h-12 rounded-2xl bg-amber-50 text-amber-500 flex items-center justify-center shrink-0">
              <Star className="w-6 h-6 fill-amber-500" />
            </div>
            <div>
              <h3 className="text-2xl sm:text-3xl font-extrabold text-[#1E1B4B]">95%</h3>
              <p className="text-xs sm:text-sm font-medium text-gray-500">Success Rate</p>
            </div>
          </div>
        </div>
      </section>

      {/* Recently Reported Items Section */}
      <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-10 w-full">
        <div className="flex items-center justify-between mb-8">
          <div>
            <h2 className="text-2xl sm:text-3xl font-extrabold text-[#1E1B4B]">
              Recently Reported Items
            </h2>
            <p className="text-sm text-gray-500 mt-1">
              Browse the latest lost and found submissions across campus.
            </p>
          </div>
          <Link
            to="/search"
            className="inline-flex items-center gap-1.5 text-sm font-bold text-[#6D28D9] hover:text-[#5B21B6] transition-colors group"
          >
            <span>View All</span>
            <ArrowRight className="w-4 h-4 group-hover:translate-x-1 transition-transform" />
          </Link>
        </div>

        {/* Items Grid */}
        {loading ? (
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
            {[...Array(6)].map((_, i) => (
              <ItemCardSkeleton key={i} />
            ))}
          </div>
        ) : recentItems.length > 0 ? (
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
            {recentItems.map((item) => (
              <ItemCard key={item._id} item={item} />
            ))}
          </div>
        ) : (
          <EmptyState
            title="No recent items reported yet"
            description="Be the first to submit a lost or found report to help reunite belongings!"
            actionText="Report an Item"
            actionLink="/report-lost"
          />
        )}
      </section>

      {/* How It Works Section */}
      <section id="about" className="bg-white py-16 sm:py-20 border-t border-purple-100 mt-12">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center max-w-2xl mx-auto mb-14">
            <span className="text-xs font-bold text-[#6D28D9] uppercase tracking-wider">
              Simple & Transparent
            </span>
            <h2 className="text-3xl font-extrabold text-[#1E1B4B] mt-2">
              How FindIt Works
            </h2>
            <p className="text-sm text-gray-500 mt-2">
              Follow three simple steps to submit reports or recover missing valuables.
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            {/* Step 1 */}
            <div className="bg-purple-50/50 rounded-2xl p-6 border border-purple-100 flex flex-col items-center text-center">
              <div className="w-14 h-14 rounded-2xl bg-[#6D28D9] text-white flex items-center justify-center font-black text-xl mb-5 shadow-md shadow-purple-500/20">
                1
              </div>
              <h3 className="text-lg font-bold text-gray-900 mb-2">Report an Item</h3>
              <p className="text-xs text-gray-500 leading-relaxed">
                Whether you lost something precious or found someone else's item, fill out a quick report with details and optional photo.
              </p>
            </div>

            {/* Step 2 */}
            <div className="bg-purple-50/50 rounded-2xl p-6 border border-purple-100 flex flex-col items-center text-center">
              <div className="w-14 h-14 rounded-2xl bg-[#7C3AED] text-white flex items-center justify-center font-black text-xl mb-5 shadow-md shadow-purple-500/20">
                2
              </div>
              <h3 className="text-lg font-bold text-gray-900 mb-2">Search & Match</h3>
              <p className="text-xs text-gray-500 leading-relaxed">
                Filter by category, campus location, or search keywords to identify matching items in seconds.
              </p>
            </div>

            {/* Step 3 */}
            <div className="bg-purple-50/50 rounded-2xl p-6 border border-purple-100 flex flex-col items-center text-center">
              <div className="w-14 h-14 rounded-2xl bg-[#8B5CF6] text-white flex items-center justify-center font-black text-xl mb-5 shadow-md shadow-purple-500/20">
                3
              </div>
              <h3 className="text-lg font-bold text-gray-900 mb-2">Connect & Reunite</h3>
              <p className="text-xs text-gray-500 leading-relaxed">
                Verify proof of ownership, contact the reporter, and securely arrange the handover at a campus reception desk.
              </p>
            </div>
          </div>
        </div>
      </section>
    </div>
  );
};

export default LandingPage;
