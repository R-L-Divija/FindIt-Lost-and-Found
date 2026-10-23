import React, { useState, useEffect } from 'react';
import { useParams, Link, useNavigate } from 'react-router-dom';
import { itemsAPI } from '../services/api';
import ContactModal from '../components/ContactModal';
import {
  ArrowLeft,
  MapPin,
  Calendar,
  Tag,
  User,
  Share2,
  Check,
  Package,
  AlertCircle,
  ShieldCheck,
} from 'lucide-react';

const ItemDetailsPage = () => {
  const { id } = useParams();
  const navigate = useNavigate();

  const [item, setItem] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [contactModalOpen, setContactModalOpen] = useState(false);
  const [copiedLink, setCopiedLink] = useState(false);
  const [imgError, setImgError] = useState(false);

  useEffect(() => {
    const fetchItem = async () => {
      try {
        setLoading(true);
        setError('');
        const res = await itemsAPI.getItemById(id);
        if (res.success && res.item) {
          setItem(res.item);
        } else {
          setError('Item not found');
        }
      } catch (err) {
        console.warn('Get item error:', err.userMessage);
        setError(err.userMessage || 'Failed to load item details.');
      } finally {
        setLoading(false);
      }
    };

    fetchItem();
  }, [id]);

  const handleShare = () => {
    navigator.clipboard.writeText(window.location.href);
    setCopiedLink(true);
    setTimeout(() => setCopiedLink(false), 2500);
  };

  if (loading) {
    return (
      <div className="py-20 flex flex-col items-center justify-center">
        <div className="w-10 h-10 border-4 border-purple-200 border-t-[#6D28D9] rounded-full animate-spin mb-4" />
        <p className="text-sm font-semibold text-gray-500">Loading item report...</p>
      </div>
    );
  }

  if (error || !item) {
    return (
      <div className="py-12 max-w-md mx-auto text-center space-y-4">
        <div className="w-16 h-16 rounded-2xl bg-rose-50 text-rose-600 flex items-center justify-center mx-auto">
          <AlertCircle className="w-8 h-8" />
        </div>
        <h3 className="text-xl font-bold text-gray-900">{error || 'Report Not Found'}</h3>
        <p className="text-sm text-gray-500">
          The requested report may have been removed or does not exist.
        </p>
        <Link
          to="/search"
          className="inline-flex items-center gap-2 px-5 py-2.5 rounded-xl bg-[#6D28D9] text-white text-sm font-bold shadow transition hover:bg-[#5B21B6]"
        >
          <ArrowLeft className="w-4 h-4" />
          <span>Back to Search</span>
        </Link>
      </div>
    );
  }

  const isLost = item.type === 'lost';
  const formattedDate = item.date
    ? new Date(item.date).toLocaleDateString('en-US', {
        month: 'short',
        day: 'numeric',
        year: 'numeric',
      })
    : 'Unknown date';

  return (
    <div className="space-y-6">
      {/* Back button */}
      <div>
        <button
          type="button"
          onClick={() => navigate(-1)}
          className="inline-flex items-center gap-2 text-sm font-bold text-gray-600 hover:text-[#6D28D9] transition-colors py-1"
        >
          <ArrowLeft className="w-4 h-4" />
          <span>Back to Search</span>
        </button>
      </div>

      {/* Main Details Grid (Matches reference screenshot 6) */}
      <div className="bg-white rounded-3xl border border-purple-100 shadow-sm overflow-hidden grid grid-cols-1 lg:grid-cols-12">
        {/* Left Column: Big Image Display */}
        <div className="lg:col-span-6 bg-purple-50/40 p-6 sm:p-8 flex flex-col items-center justify-center border-b lg:border-b-0 lg:border-r border-purple-100">
          <div className="w-full max-w-md aspect-square bg-white rounded-2xl shadow-sm border border-purple-100 overflow-hidden flex items-center justify-center relative">
            {item.imageUrl && !imgError ? (
              <img
                src={item.imageUrl}
                alt={item.title}
                onError={() => setImgError(true)}
                className="w-full h-full object-cover"
              />
            ) : (
              <div className="flex flex-col items-center justify-center text-purple-300 p-8 text-center">
                <Package className="w-20 h-20 stroke-[1.5]" />
                <span className="text-sm font-semibold text-purple-400 mt-3">
                  No image provided
                </span>
                <span className="text-xs text-gray-400 mt-1 max-w-xs">
                  A photo was not uploaded for this report. Use the description to verify.
                </span>
              </div>
            )}

            {/* Type badge overlay */}
            <div className="absolute top-4 left-4">
              <span
                className={`px-3 py-1 rounded-full text-xs font-bold tracking-wide uppercase shadow-sm ${
                  isLost
                    ? 'bg-rose-50 text-rose-700 border border-rose-200'
                    : 'bg-emerald-50 text-emerald-700 border border-emerald-200'
                }`}
              >
                {item.type}
              </span>
            </div>
          </div>
        </div>

        {/* Right Column: Information & Actions */}
        <div className="lg:col-span-6 p-6 sm:p-8 lg:p-10 flex flex-col justify-between">
          <div className="space-y-6">
            {/* Title & Badge */}
            <div className="flex items-start justify-between gap-4">
              <div>
                <h1 className="text-2xl sm:text-3xl font-extrabold text-[#1E1B4B]">
                  {item.title}
                </h1>
                <p className="text-xs text-gray-400 mt-1">
                  Report ID: {item._id}
                </p>
              </div>
              <span
                className={`shrink-0 px-3 py-1 rounded-full text-xs font-bold capitalize ${
                  item.status === 'reunited'
                    ? 'bg-emerald-50 text-emerald-700 border border-emerald-200'
                    : 'bg-purple-50 text-[#6D28D9] border border-purple-200'
                }`}
              >
                {item.status === 'open' ? 'Active' : item.status}
              </span>
            </div>

            {/* Metadata Badges */}
            <div className="space-y-3.5 bg-purple-50/50 p-4 rounded-2xl border border-purple-100">
              <div className="flex items-center gap-3 text-sm text-gray-700">
                <Tag className="w-4 h-4 text-[#6D28D9] shrink-0" />
                <span className="font-semibold text-gray-500 w-28">Category</span>
                <span className="font-bold text-gray-900">{item.category}</span>
              </div>

              <div className="flex items-center gap-3 text-sm text-gray-700">
                <MapPin className="w-4 h-4 text-[#6D28D9] shrink-0" />
                <span className="font-semibold text-gray-500 w-28">Location</span>
                <span className="font-bold text-gray-900">{item.location}</span>
              </div>

              <div className="flex items-center gap-3 text-sm text-gray-700">
                <Calendar className="w-4 h-4 text-[#6D28D9] shrink-0" />
                <span className="font-semibold text-gray-500 w-28">
                  {isLost ? 'Date Lost' : 'Date Found'}
                </span>
                <span className="font-bold text-gray-900">{formattedDate}</span>
              </div>

              <div className="flex items-center gap-3 text-sm text-gray-700">
                <User className="w-4 h-4 text-[#6D28D9] shrink-0" />
                <span className="font-semibold text-gray-500 w-28">Reported By</span>
                <span className="font-bold text-gray-900">
                  {item.reportedBy?.name || 'FindIt Member'}
                </span>
              </div>
            </div>

            {/* Description Section */}
            <div>
              <h3 className="text-sm font-bold text-gray-900 uppercase tracking-wider mb-2">
                Description
              </h3>
              <p className="text-sm text-gray-600 leading-relaxed whitespace-pre-line bg-gray-50/50 p-4 rounded-xl border border-gray-100">
                {item.description}
              </p>
            </div>
          </div>

          {/* Action Buttons */}
          <div className="pt-8 border-t border-purple-100 mt-6 flex items-center gap-3">
            <button
              type="button"
              onClick={() => setContactModalOpen(true)}
              className="flex-1 py-3 px-6 rounded-xl bg-[#6D28D9] hover:bg-[#5B21B6] text-white text-sm font-bold shadow-md shadow-purple-500/25 transition flex items-center justify-center gap-2"
            >
              <ShieldCheck className="w-4 h-4" />
              <span>{isLost ? 'I Found This Item' : 'Claim This Item'}</span>
            </button>

            <button
              type="button"
              onClick={handleShare}
              className="p-3 rounded-xl border border-purple-200 text-gray-600 hover:text-[#6D28D9] hover:bg-purple-50 transition relative"
              title="Share report link"
              aria-label="Share report"
            >
              {copiedLink ? (
                <Check className="w-5 h-5 text-emerald-600" />
              ) : (
                <Share2 className="w-5 h-5" />
              )}
            </button>
          </div>
        </div>
      </div>

      {/* Contact modal */}
      <ContactModal
        isOpen={contactModalOpen}
        item={item}
        onClose={() => setContactModalOpen(false)}
      />
    </div>
  );
};

export default ItemDetailsPage;
