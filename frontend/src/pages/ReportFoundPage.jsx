import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { itemsAPI } from '../services/api';
import {
  UploadCloud,
  X,
  AlertCircle,
  CheckCircle2,
  Image as ImageIcon,
} from 'lucide-react';

const CATEGORIES = [
  'Electronics',
  'ID Cards',
  'Bags',
  'Keys',
  'Books',
  'Clothing',
  'Jewelry',
  'Documents',
  'Other',
];

const ReportFoundPage = () => {
  const navigate = useNavigate();

  const [formData, setFormData] = useState({
    title: '',
    category: '',
    location: '',
    date: new Date().toISOString().split('T')[0],
    description: '',
  });

  const [imageFile, setImageFile] = useState(null);
  const [imagePreview, setImagePreview] = useState(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const [successMsg, setSuccessMsg] = useState('');

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
    if (error) setError('');
  };

  const handleImageChange = (e) => {
    const file = e.target.files?.[0];
    if (file) {
      if (file.size > 5 * 1024 * 1024) {
        setError('Image must be 5 MB or smaller');
        return;
      }
      setImageFile(file);
      setImagePreview(URL.createObjectURL(file));
      setError('');
    }
  };

  const handleRemoveImage = () => {
    setImageFile(null);
    if (imagePreview) {
      URL.revokeObjectURL(imagePreview);
      setImagePreview(null);
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    if (!formData.title.trim()) {
      setError('Please provide a title for the found item');
      return;
    }
    if (!formData.category) {
      setError('Please select a category');
      return;
    }
    if (!formData.location.trim()) {
      setError('Please provide the location where it was found');
      return;
    }
    if (!formData.date) {
      setError('Please select the date it was found');
      return;
    }
    if (!formData.description.trim()) {
      setError('Please provide a detailed description of the item');
      return;
    }

    try {
      setLoading(true);
      setError('');

      const payload = {
        title: formData.title.trim(),
        description: formData.description.trim(),
        type: 'found',
        category: formData.category,
        location: formData.location.trim(),
        date: formData.date,
      };

      const res = await itemsAPI.createItem(payload, imageFile);

      if (res.success && res.item) {
        setSuccessMsg('Your found item report has been submitted successfully! Thank you for helping.');
        setTimeout(() => {
          navigate(`/items/${res.item._id}`);
        }, 1200);
      }
    } catch (err) {
      console.error('Report submission error:', err);
      setError(err.userMessage || 'Failed to submit report. Please check all fields.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="max-w-3xl mx-auto space-y-6">
      {/* Page Title */}
      <div>
        <h1 className="text-2xl sm:text-3xl font-extrabold text-[#1E1B4B]">
          Report a Found Item
        </h1>
        <p className="text-sm text-gray-500 mt-1">
          Help return this item to its rightful owner by publishing a report.
        </p>
      </div>

      {/* Main Form Card (Matches reference screenshot 8) */}
      <div className="bg-white rounded-3xl p-6 sm:p-8 border border-purple-100 shadow-xs">
        {error && (
          <div className="mb-6 p-4 rounded-2xl bg-rose-50 border border-rose-200 text-rose-700 text-sm flex items-start gap-2.5">
            <AlertCircle className="w-5 h-5 shrink-0 mt-0.5" />
            <span>{error}</span>
          </div>
        )}

        {successMsg && (
          <div className="mb-6 p-4 rounded-2xl bg-emerald-50 border border-emerald-200 text-emerald-800 text-sm flex items-start gap-2.5">
            <CheckCircle2 className="w-5 h-5 shrink-0 mt-0.5 text-emerald-600" />
            <span>{successMsg}</span>
          </div>
        )}

        <form onSubmit={handleSubmit} className="space-y-5">
          {/* Title */}
          <div>
            <label className="block text-xs font-bold text-gray-700 uppercase tracking-wider mb-1.5">
              Title <span className="text-rose-500">*</span>
            </label>
            <input
              type="text"
              name="title"
              value={formData.title}
              onChange={handleChange}
              placeholder="e.g., Found iPhone with clear case, Brown Wallet, Keys"
              required
              className="w-full px-4 py-3 rounded-xl border border-gray-300 focus:border-[#6D28D9] focus:ring-2 focus:ring-purple-200 outline-none text-sm transition"
            />
          </div>

          {/* Description */}
          <div>
            <label className="block text-xs font-bold text-gray-700 uppercase tracking-wider mb-1.5">
              Description <span className="text-rose-500">*</span>
            </label>
            <textarea
              name="description"
              rows={4}
              value={formData.description}
              onChange={handleChange}
              placeholder="Provide a detailed description (appearance, color, condition, specific details to verify ownership)..."
              required
              className="w-full px-4 py-3 rounded-xl border border-gray-300 focus:border-[#6D28D9] focus:ring-2 focus:ring-purple-200 outline-none text-sm transition resize-none"
            />
          </div>

          {/* Category & Location */}
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-5">
            <div>
              <label className="block text-xs font-bold text-gray-700 uppercase tracking-wider mb-1.5">
                Category <span className="text-rose-500">*</span>
              </label>
              <select
                name="category"
                value={formData.category}
                onChange={handleChange}
                required
                className="w-full px-4 py-3 rounded-xl border border-gray-300 focus:border-[#6D28D9] focus:ring-2 focus:ring-purple-200 outline-none text-sm bg-white transition"
              >
                <option value="">Select category</option>
                {CATEGORIES.map((cat) => (
                  <option key={cat} value={cat}>
                    {cat}
                  </option>
                ))}
              </select>
            </div>

            <div>
              <label className="block text-xs font-bold text-gray-700 uppercase tracking-wider mb-1.5">
                Location Found <span className="text-rose-500">*</span>
              </label>
              <input
                type="text"
                name="location"
                value={formData.location}
                onChange={handleChange}
                placeholder="e.g., Main Block Canteen, Table #4"
                required
                className="w-full px-4 py-3 rounded-xl border border-gray-300 focus:border-[#6D28D9] focus:ring-2 focus:ring-purple-200 outline-none text-sm transition"
              />
            </div>
          </div>

          {/* Date Found */}
          <div>
            <label className="block text-xs font-bold text-gray-700 uppercase tracking-wider mb-1.5">
              Date Found <span className="text-rose-500">*</span>
            </label>
            <input
              type="date"
              name="date"
              value={formData.date}
              onChange={handleChange}
              required
              className="w-full sm:w-1/2 px-4 py-3 rounded-xl border border-gray-300 focus:border-[#6D28D9] focus:ring-2 focus:ring-purple-200 outline-none text-sm transition"
            />
          </div>

          {/* Upload Image with live preview */}
          <div>
            <label className="block text-xs font-bold text-gray-700 uppercase tracking-wider mb-1.5">
              Upload Image (Optional)
            </label>

            <div className="grid grid-cols-1 sm:grid-cols-12 gap-4 items-start">
              {/* File upload drag drop zone */}
              <div className="sm:col-span-8">
                <label className="flex flex-col items-center justify-center p-6 border-2 border-dashed border-purple-200 hover:border-[#6D28D9] rounded-2xl cursor-pointer bg-purple-50/40 hover:bg-purple-50/70 transition">
                  <UploadCloud className="w-8 h-8 text-[#6D28D9] mb-2" />
                  <span className="text-xs font-bold text-gray-800">
                    Click to browse or drag and drop
                  </span>
                  <span className="text-[11px] text-gray-400 mt-1">
                    JPG, PNG, or WebP up to 5 MB
                  </span>
                  <input
                    type="file"
                    accept="image/jpeg,image/png,image/webp"
                    onChange={handleImageChange}
                    className="hidden"
                  />
                </label>
              </div>

              {/* Live Preview Card */}
              <div className="sm:col-span-4 flex justify-center">
                {imagePreview ? (
                  <div className="relative w-36 h-36 rounded-2xl overflow-hidden border-2 border-purple-200 shadow-sm group">
                    <img
                      src={imagePreview}
                      alt="Live Preview"
                      className="w-full h-full object-cover"
                    />
                    <button
                      type="button"
                      onClick={handleRemoveImage}
                      className="absolute top-1.5 right-1.5 p-1 rounded-full bg-black/60 text-white hover:bg-rose-600 transition"
                      title="Remove image"
                    >
                      <X className="w-3.5 h-3.5" />
                    </button>
                    <span className="absolute bottom-1 left-2 text-[10px] bg-black/60 text-white px-1.5 py-0.5 rounded font-medium">
                      Preview
                    </span>
                  </div>
                ) : (
                  <div className="w-36 h-36 rounded-2xl border border-gray-200 bg-gray-50 flex flex-col items-center justify-center text-gray-400 p-2 text-center">
                    <ImageIcon className="w-8 h-8 mb-1 stroke-1" />
                    <span className="text-[11px]">No photo chosen</span>
                  </div>
                )}
              </div>
            </div>
          </div>

          {/* Submit Button */}
          <div className="pt-4">
            <button
              type="submit"
              disabled={loading}
              className="w-full py-3.5 px-6 rounded-xl bg-[#6D28D9] hover:bg-[#5B21B6] text-white text-sm font-bold shadow-md shadow-purple-500/25 transition-all duration-150 flex items-center justify-center gap-2 disabled:opacity-50"
            >
              {loading && (
                <svg className="animate-spin w-4 h-4 text-white" fill="none" viewBox="0 0 24 24">
                  <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" />
                  <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8v8H4z" />
                </svg>
              )}
              <span>{loading ? 'Submitting Report...' : 'Submit Report'}</span>
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default ReportFoundPage;
