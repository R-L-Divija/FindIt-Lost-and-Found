import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { itemsAPI } from '../services/api';
import EmptyState from '../components/EmptyState';
import ConfirmModal from '../components/ConfirmModal';
import EditReportModal from '../components/EditReportModal';
import {
  FileText,
  MapPin,
  Calendar,
  Edit2,
  Trash2,
  AlertCircle,
  CheckCircle2,
  Package,
  PlusCircle,
} from 'lucide-react';

const MyReportsPage = () => {
  const [reports, setReports] = useState([]);
  const [filterType, setFilterType] = useState('all'); // 'all' | 'lost' | 'found'
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [successToast, setSuccessToast] = useState('');

  // Modals state
  const [editingItem, setEditingItem] = useState(null);
  const [deletingItem, setDeletingItem] = useState(null);
  const [deleteLoading, setDeleteLoading] = useState(false);

  const fetchReports = async () => {
    try {
      setLoading(true);
      setError('');
      const res = await itemsAPI.getMyReports();
      if (res.success && Array.isArray(res.items)) {
        setReports(res.items);
      }
    } catch (err) {
      console.warn('Fetch my reports error:', err.userMessage);
      setError(err.userMessage || 'Could not load your reports.');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchReports();
  }, []);

  const showToast = (msg) => {
    setSuccessToast(msg);
    setTimeout(() => setSuccessToast(''), 3000);
  };

  const handleEditClick = (item) => {
    setEditingItem(item);
  };

  const handleEditSaved = (updatedItem) => {
    setReports((prev) =>
      prev.map((r) => (r._id === updatedItem._id ? updatedItem : r))
    );
    showToast('Report updated successfully!');
  };

  const handleDeleteClick = (item) => {
    setDeletingItem(item);
  };

  const handleConfirmDelete = async () => {
    if (!deletingItem) return;

    try {
      setDeleteLoading(true);
      await itemsAPI.deleteItem(deletingItem._id);
      setReports((prev) => prev.filter((r) => r._id !== deletingItem._id));
      setDeletingItem(null);
      showToast('Report deleted successfully.');
    } catch (err) {
      console.error('Delete error:', err);
      setError(err.userMessage || 'Could not delete report.');
    } finally {
      setDeleteLoading(false);
    }
  };

  // Counts for filter pills
  const totalCount = reports.length;
  const lostCount = reports.filter((r) => r.type === 'lost').length;
  const foundCount = reports.filter((r) => r.type === 'found').length;

  const filteredReports = reports.filter((item) => {
    if (filterType === 'all') return true;
    return item.type === filterType;
  });

  return (
    <div className="space-y-6">
      {/* Top Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h1 className="text-2xl sm:text-3xl font-extrabold text-[#1E1B4B]">
            My Reports
          </h1>
          <p className="text-sm text-gray-500 mt-1">
            View and manage all items you have reported.
          </p>
        </div>

        <div className="flex items-center gap-2">
          <Link
            to="/report-lost"
            className="px-4 py-2.5 rounded-xl bg-[#6D28D9] hover:bg-[#5B21B6] text-white text-xs font-bold shadow-xs transition flex items-center gap-1.5"
          >
            <PlusCircle className="w-4 h-4" />
            <span>New Report</span>
          </Link>
        </div>
      </div>

      {/* Success Notification Banner */}
      {successToast && (
        <div className="p-4 rounded-2xl bg-emerald-50 border border-emerald-200 text-emerald-800 text-xs sm:text-sm flex items-center gap-2.5 animate-in fade-in">
          <CheckCircle2 className="w-4 h-4 text-emerald-600 shrink-0" />
          <span>{successToast}</span>
        </div>
      )}

      {error && (
        <div className="p-4 rounded-2xl bg-rose-50 border border-rose-200 text-rose-700 text-xs sm:text-sm flex items-center gap-2.5">
          <AlertCircle className="w-4 h-4 text-rose-600 shrink-0" />
          <span>{error}</span>
        </div>
      )}

      {/* Filter Tabs / Pills (Matches reference screenshot 9: All, Lost, Found) */}
      <div className="flex items-center gap-2">
        <button
          type="button"
          onClick={() => setFilterType('all')}
          className={`px-4 py-2 rounded-xl text-xs font-bold transition shadow-xs ${
            filterType === 'all'
              ? 'bg-[#6D28D9] text-white'
              : 'bg-white text-gray-600 border border-purple-100 hover:bg-purple-50'
          }`}
        >
          All ({totalCount})
        </button>
        <button
          type="button"
          onClick={() => setFilterType('lost')}
          className={`px-4 py-2 rounded-xl text-xs font-bold transition shadow-xs ${
            filterType === 'lost'
              ? 'bg-[#6D28D9] text-white'
              : 'bg-white text-gray-600 border border-purple-100 hover:bg-purple-50'
          }`}
        >
          Lost ({lostCount})
        </button>
        <button
          type="button"
          onClick={() => setFilterType('found')}
          className={`px-4 py-2 rounded-xl text-xs font-bold transition shadow-xs ${
            filterType === 'found'
              ? 'bg-[#6D28D9] text-white'
              : 'bg-white text-gray-600 border border-purple-100 hover:bg-purple-50'
          }`}
        >
          Found ({foundCount})
        </button>
      </div>

      {/* Reports List / Table (Matches reference screenshot 9) */}
      <div className="bg-white rounded-3xl border border-purple-100 shadow-xs overflow-hidden">
        {loading ? (
          <div className="p-16 flex flex-col items-center justify-center">
            <div className="w-8 h-8 border-3 border-purple-200 border-t-[#6D28D9] rounded-full animate-spin mb-3" />
            <p className="text-xs text-gray-400 font-semibold">Loading your reports...</p>
          </div>
        ) : filteredReports.length > 0 ? (
          <div className="divide-y divide-purple-50">
            {filteredReports.map((item) => {
              const isLost = item.type === 'lost';
              const formattedDate = item.date
                ? new Date(item.date).toLocaleDateString('en-US', {
                    month: 'short',
                    day: 'numeric',
                    year: 'numeric',
                  })
                : 'Recent';

              return (
                <div
                  key={item._id}
                  className="p-4 sm:p-5 flex flex-col lg:flex-row lg:items-center justify-between gap-4 hover:bg-purple-50/30 transition"
                >
                  {/* Left Info with Thumbnail */}
                  <div className="flex items-start sm:items-center gap-4 flex-1 min-w-0">
                    <Link
                      to={`/items/${item._id}`}
                      className="w-14 h-14 sm:w-16 sm:h-16 rounded-2xl bg-purple-50 overflow-hidden flex items-center justify-center shrink-0 border border-purple-100 relative group"
                    >
                      {item.imageUrl ? (
                        <img
                          src={item.imageUrl}
                          alt={item.title}
                          className="w-full h-full object-cover group-hover:scale-110 transition duration-200"
                        />
                      ) : (
                        <Package className="w-7 h-7 text-purple-300" />
                      )}
                    </Link>

                    <div className="flex-1 min-w-0">
                      <div className="flex flex-wrap items-center gap-2">
                        <Link
                          to={`/items/${item._id}`}
                          className="text-base font-bold text-gray-900 hover:text-[#6D28D9] transition truncate"
                        >
                          {item.title}
                        </Link>
                        <span
                          className={`text-[10px] font-extrabold px-2.5 py-0.5 rounded-full capitalize ${
                            isLost
                              ? 'bg-rose-50 text-rose-700 border border-rose-200'
                              : 'bg-emerald-50 text-emerald-700 border border-emerald-200'
                          }`}
                        >
                          {item.type}
                        </span>
                      </div>

                      {item.description && (
                        <p className="text-xs text-gray-500 line-clamp-1 mt-0.5">
                          {item.description}
                        </p>
                      )}

                      <div className="flex flex-wrap items-center gap-3 mt-1.5 text-xs text-gray-500">
                        <span className="flex items-center gap-1">
                          <MapPin className="w-3.5 h-3.5 text-[#6D28D9]" />
                          {item.location}
                        </span>
                        <span>•</span>
                        <span className="flex items-center gap-1">
                          <Calendar className="w-3.5 h-3.5 text-purple-400" />
                          {formattedDate}
                        </span>
                        <span>•</span>
                        <span className="text-gray-400">{item.category}</span>
                      </div>
                    </div>
                  </div>

                  {/* Right Status Badge & Edit/Delete Actions */}
                  <div className="flex items-center gap-3 self-end lg:self-center shrink-0">
                    <span
                      className={`text-xs font-semibold px-3 py-1 rounded-full capitalize ${
                        item.status === 'reunited'
                          ? 'bg-emerald-50 text-emerald-700 border border-emerald-200'
                          : 'bg-amber-50 text-amber-700 border border-amber-200'
                      }`}
                    >
                      {item.status === 'reunited' ? 'Reunited' : 'Pending'}
                    </span>

                    <button
                      type="button"
                      onClick={() => handleEditClick(item)}
                      className="px-3.5 py-1.5 rounded-xl border border-purple-200 text-xs font-bold text-[#6D28D9] hover:bg-[#6D28D9] hover:text-white transition flex items-center gap-1.5"
                    >
                      <Edit2 className="w-3 h-3" />
                      <span>Edit</span>
                    </button>

                    <button
                      type="button"
                      onClick={() => handleDeleteClick(item)}
                      className="px-3.5 py-1.5 rounded-xl border border-rose-200 text-xs font-bold text-rose-600 hover:bg-rose-600 hover:text-white transition flex items-center gap-1.5"
                    >
                      <Trash2 className="w-3 h-3" />
                      <span>Delete</span>
                    </button>
                  </div>
                </div>
              );
            })}
          </div>
        ) : (
          <div className="p-8">
            <EmptyState
              title={`No ${filterType === 'all' ? '' : filterType} reports found`}
              description="You have no item reports in this view. Ready to report a missing or found belonging?"
              actionText="Create New Report"
              actionLink="/report-lost"
            />
          </div>
        )}
      </div>

      {/* Edit Modal */}
      <EditReportModal
        isOpen={Boolean(editingItem)}
        item={editingItem}
        onClose={() => setEditingItem(null)}
        onUpdated={handleEditSaved}
      />

      {/* Delete Confirmation Modal */}
      <ConfirmModal
        isOpen={Boolean(deletingItem)}
        title="Delete Item Report"
        message={`Are you sure you want to delete "${deletingItem?.title}"? This report and its associated photo will be permanently removed.`}
        confirmText="Yes, Delete"
        cancelText="Cancel"
        loading={deleteLoading}
        onConfirm={handleConfirmDelete}
        onCancel={() => setDeletingItem(null)}
      />
    </div>
  );
};

export default MyReportsPage;
