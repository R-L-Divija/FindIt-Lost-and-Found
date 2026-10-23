import React, { useState } from 'react';
import { useAuth } from '../context/AuthContext';
import {
  User,
  Mail,
  Shield,
  Camera,
  CheckCircle2,
  Calendar,
  Sparkles,
} from 'lucide-react';

const ProfilePage = () => {
  const { user, updateUserProfile } = useAuth();

  const [name, setName] = useState(user?.name || '');
  const [email, setEmail] = useState(user?.email || '');
  const [avatarUrl, setAvatarUrl] = useState(user?.profileImage || '');
  const [saving, setSaving] = useState(false);
  const [savedSuccess, setSavedSuccess] = useState(false);
  const [photoModalOpen, setPhotoModalOpen] = useState(false);
  const [photoInput, setPhotoInput] = useState('');

  const handleUpdate = (e) => {
    e.preventDefault();
    setSaving(true);
    // Persist to local context state
    updateUserProfile({ name, email, profileImage: avatarUrl });
    setTimeout(() => {
      setSaving(false);
      setSavedSuccess(true);
      setTimeout(() => setSavedSuccess(false), 3000);
    }, 600);
  };

  const handleSavePhoto = (e) => {
    e.preventDefault();
    if (photoInput.trim()) {
      setAvatarUrl(photoInput.trim());
      updateUserProfile({ profileImage: photoInput.trim() });
      setPhotoModalOpen(false);
      setSavedSuccess(true);
      setTimeout(() => setSavedSuccess(false), 3000);
    }
  };

  return (
    <div className="space-y-6">
      {/* Page Title */}
      <div>
        <h1 className="text-2xl sm:text-3xl font-extrabold text-[#1E1B4B]">
          My Profile
        </h1>
        <p className="text-sm text-gray-500 mt-1">
          Manage your account information and preferences.
        </p>
      </div>

      {savedSuccess && (
        <div className="p-4 rounded-2xl bg-emerald-50 border border-emerald-200 text-emerald-800 text-xs sm:text-sm flex items-center gap-2.5 animate-in fade-in">
          <CheckCircle2 className="w-4 h-4 text-emerald-600 shrink-0" />
          <span>Profile details updated successfully!</span>
        </div>
      )}

      {/* Main Two Column Profile Layout (Matches reference screenshot 10) */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
        {/* Left Card: Avatar and overview */}
        <div className="lg:col-span-4 bg-white rounded-3xl p-6 sm:p-8 border border-purple-100 shadow-xs flex flex-col items-center text-center">
          {/* Avatar container */}
          <div className="relative mb-4 group">
            <div className="w-28 h-28 rounded-full overflow-hidden border-4 border-purple-200 shadow-md bg-gradient-to-br from-[#7C3AED] to-[#6D28D9] flex items-center justify-center text-white text-3xl font-black">
              {avatarUrl ? (
                <img
                  src={avatarUrl}
                  alt={user?.name}
                  className="w-full h-full object-cover"
                />
              ) : (
                <span>{user?.name ? user.name.charAt(0).toUpperCase() : 'U'}</span>
              )}
            </div>
            <button
              type="button"
              onClick={() => setPhotoModalOpen(true)}
              className="absolute bottom-0 right-0 p-2 rounded-full bg-[#6D28D9] text-white hover:bg-[#5B21B6] shadow-md border-2 border-white transition transform hover:scale-105"
              title="Change Profile Photo"
            >
              <Camera className="w-4 h-4" />
            </button>
          </div>

          <h3 className="text-lg font-bold text-gray-900">{user?.name || 'FindIt User'}</h3>
          <p className="text-xs text-gray-500 mt-0.5 break-all">{user?.email}</p>

          <div className="mt-2 inline-flex items-center gap-1 px-3 py-1 rounded-full text-xs font-semibold bg-purple-50 text-[#6D28D9] border border-purple-100">
            <Shield className="w-3.5 h-3.5" />
            <span className="capitalize">{user?.role || 'Member'}</span>
          </div>

          <button
            type="button"
            onClick={() => setPhotoModalOpen(true)}
            className="mt-5 px-4 py-2 rounded-xl border border-purple-200 text-xs font-bold text-[#6D28D9] hover:bg-purple-50 transition"
          >
            Change Photo
          </button>

          {/* Account Badges */}
          <div className="w-full border-t border-purple-50 mt-6 pt-6 space-y-3 text-left">
            <div className="flex items-center justify-between text-xs">
              <span className="text-gray-500 flex items-center gap-1.5">
                <Calendar className="w-3.5 h-3.5 text-purple-400" />
                Account Status
              </span>
              <span className="font-bold text-emerald-600">Active</span>
            </div>
            <div className="flex items-center justify-between text-xs">
              <span className="text-gray-500 flex items-center gap-1.5">
                <Sparkles className="w-3.5 h-3.5 text-purple-400" />
                Community Trust
              </span>
              <span className="font-bold text-[#6D28D9]">Verified</span>
            </div>
          </div>
        </div>

        {/* Right Card: Account Information Form */}
        <div className="lg:col-span-8 bg-white rounded-3xl p-6 sm:p-8 border border-purple-100 shadow-xs">
          <div className="pb-6 border-b border-purple-50">
            <h3 className="text-lg font-bold text-[#1E1B4B]">Account Information</h3>
            <p className="text-xs text-gray-500 mt-0.5">
              Update your personal details used for lost & found claim contacts.
            </p>
          </div>

          <form onSubmit={handleUpdate} className="mt-6 space-y-5">
            {/* Full Name */}
            <div>
              <label className="block text-xs font-bold text-gray-700 uppercase tracking-wider mb-1.5">
                Full Name
              </label>
              <div className="relative">
                <User className="w-4 h-4 text-gray-400 absolute left-3.5 top-1/2 -translate-y-1/2" />
                <input
                  type="text"
                  value={name}
                  onChange={(e) => setName(e.target.value)}
                  required
                  placeholder="Your full name"
                  className="w-full pl-10 pr-4 py-3 rounded-xl border border-gray-300 focus:border-[#6D28D9] focus:ring-2 focus:ring-purple-200 outline-none text-sm transition"
                />
              </div>
            </div>

            {/* Email */}
            <div>
              <label className="block text-xs font-bold text-gray-700 uppercase tracking-wider mb-1.5">
                Email Address
              </label>
              <div className="relative">
                <Mail className="w-4 h-4 text-gray-400 absolute left-3.5 top-1/2 -translate-y-1/2" />
                <input
                  type="email"
                  value={email}
                  disabled
                  placeholder="Your email address"
                  className="w-full pl-10 pr-4 py-3 rounded-xl border border-gray-200 bg-gray-50/70 text-gray-500 outline-none text-sm cursor-not-allowed"
                />
              </div>
              <span className="text-[11px] text-gray-400 mt-1 block">
                Email address is tied to your account login and cannot be altered directly.
              </span>
            </div>

            {/* Role / Access */}
            <div>
              <label className="block text-xs font-bold text-gray-700 uppercase tracking-wider mb-1.5">
                Community Role
              </label>
              <div className="relative">
                <Shield className="w-4 h-4 text-gray-400 absolute left-3.5 top-1/2 -translate-y-1/2" />
                <input
                  type="text"
                  value={user?.role || 'Campus User'}
                  disabled
                  className="w-full pl-10 pr-4 py-3 rounded-xl border border-gray-200 bg-gray-50/70 text-gray-500 outline-none text-sm capitalize cursor-not-allowed"
                />
              </div>
            </div>

            {/* Submit Button */}
            <div className="pt-4">
              <button
                type="submit"
                disabled={saving}
                className="py-3 px-6 rounded-xl bg-[#6D28D9] hover:bg-[#5B21B6] text-white text-sm font-bold shadow-md shadow-purple-500/25 transition flex items-center justify-center gap-2 disabled:opacity-50"
              >
                {saving && (
                  <svg className="animate-spin w-4 h-4 text-white" fill="none" viewBox="0 0 24 24">
                    <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" />
                    <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8v8H4z" />
                  </svg>
                )}
                <span>Update Profile</span>
              </button>
            </div>
          </form>
        </div>
      </div>

      {/* Photo URL Change Modal */}
      {photoModalOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/50 backdrop-blur-xs animate-in fade-in">
          <div className="bg-white rounded-2xl max-w-sm w-full p-6 shadow-2xl border border-gray-100">
            <h3 className="text-base font-bold text-gray-900 mb-1">Set Profile Avatar</h3>
            <p className="text-xs text-gray-500 mb-4">
              Enter an image URL for your profile avatar.
            </p>
            <form onSubmit={handleSavePhoto} className="space-y-4">
              <input
                type="url"
                value={photoInput}
                onChange={(e) => setPhotoInput(e.target.value)}
                placeholder="https://example.com/photo.jpg"
                className="w-full px-3.5 py-2.5 rounded-xl border border-gray-300 text-xs focus:border-[#6D28D9] outline-none"
              />
              <div className="flex justify-end gap-2">
                <button
                  type="button"
                  onClick={() => setPhotoModalOpen(false)}
                  className="px-3 py-1.5 rounded-lg text-xs font-semibold text-gray-600 hover:bg-gray-100"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="px-4 py-1.5 rounded-lg text-xs font-bold text-white bg-[#6D28D9] hover:bg-[#5B21B6]"
                >
                  Save Photo
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};

export default ProfilePage;
