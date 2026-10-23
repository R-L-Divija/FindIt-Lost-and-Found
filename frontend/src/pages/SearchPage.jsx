import React, { useState, useEffect } from 'react';
import { useSearchParams } from 'react-router-dom';
import { itemsAPI } from '../services/api';
import ItemCard from '../components/ItemCard';
import ItemCardSkeleton from '../components/ItemCardSkeleton';
import EmptyState from '../components/EmptyState';
import { Search, Filter, RotateCcw, PackageSearch, AlertCircle } from 'lucide-react';

const CATEGORIES = [
  'All Categories',
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

const SearchPage = () => {
  const [searchParams, setSearchParams] = useSearchParams();

  const [searchTerm, setSearchTerm] = useState(searchParams.get('search') || '');
  const [selectedType, setSelectedType] = useState(searchParams.get('type') || 'all');
  const [selectedCategory, setSelectedCategory] = useState(searchParams.get('category') || 'All Categories');
  const [locationQuery, setLocationQuery] = useState(searchParams.get('location') || '');

  const [items, setItems] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');

  // Fetch items whenever filters change
  useEffect(() => {
    const fetchItems = async () => {
      try {
        setLoading(true);
        setError('');

        const params = {};
        if (searchTerm.trim()) params.search = searchTerm.trim();
        if (selectedType !== 'all') params.type = selectedType;
        if (selectedCategory !== 'All Categories') params.category = selectedCategory;
        if (locationQuery.trim()) params.location = locationQuery.trim();

        const res = await itemsAPI.getItems(params);
        if (res.success && Array.isArray(res.items)) {
          setItems(res.items);
        } else {
          setItems([]);
        }
      } catch (err) {
        console.warn('Items fetch error:', err.userMessage);
        setError(err.userMessage || 'Failed to fetch items.');
        setItems([]);
      } finally {
        setLoading(false);
      }
    };

    fetchItems();
  }, [searchTerm, selectedType, selectedCategory, locationQuery]);

  // Synchronize state with URL parameters
  const updateUrlParams = (newParams) => {
    const updated = new URLSearchParams(searchParams);
    Object.entries(newParams).forEach(([k, v]) => {
      if (v && v !== 'all' && v !== 'All Categories') {
        updated.set(k, v);
      } else {
        updated.delete(k);
      }
    });
    setSearchParams(updated);
  };

  const handleSearchSubmit = (e) => {
    e.preventDefault();
    updateUrlParams({ search: searchTerm });
  };

  const handleTypeChange = (type) => {
    setSelectedType(type);
    updateUrlParams({ type });
  };

  const handleCategoryChange = (category) => {
    setSelectedCategory(category);
    updateUrlParams({ category });
  };

  const handleLocationChange = (e) => {
    const loc = e.target.value;
    setLocationQuery(loc);
    updateUrlParams({ location: loc });
  };

  const handleResetFilters = () => {
    setSearchTerm('');
    setSelectedType('all');
    setSelectedCategory('All Categories');
    setLocationQuery('');
    setSearchParams({});
  };

  return (
    <div className="space-y-6">
      {/* Title */}
      <div>
        <h1 className="text-2xl sm:text-3xl font-extrabold text-[#1E1B4B]">
          Search Items
        </h1>
        <p className="text-sm text-gray-500 mt-1">
          Explore all active lost and found reports across campus.
        </p>
      </div>

      {/* Main Search Input Form */}
      <form onSubmit={handleSearchSubmit} className="relative">
        <div className="flex items-center bg-white rounded-2xl shadow-xs border border-purple-200/90 p-2 focus-within:ring-2 focus-within:ring-[#6D28D9] focus-within:border-transparent transition">
          <Search className="w-5 h-5 text-gray-400 ml-3 mr-2 shrink-0" />
          <input
            type="text"
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            placeholder="Search for items (e.g., phone, bag, keys...)"
            className="w-full bg-transparent px-2 py-2 text-sm text-gray-800 placeholder-gray-400 focus:outline-none"
          />
          <button
            type="submit"
            className="shrink-0 p-3 rounded-xl bg-[#6D28D9] hover:bg-[#5B21B6] text-white shadow-xs transition"
            aria-label="Search items"
          >
            <Search className="w-4 h-4" />
          </button>
        </div>
      </form>

      {/* Filters Bar (Matches reference screenshot 5) */}
      <div className="bg-white rounded-2xl p-4 border border-purple-100 shadow-xs flex flex-wrap items-center justify-between gap-3">
        <div className="flex flex-wrap items-center gap-3 flex-1">
          {/* Type Filter */}
          <div className="relative min-w-[130px]">
            <select
              value={selectedType}
              onChange={(e) => handleTypeChange(e.target.value)}
              className="w-full appearance-none px-3.5 py-2 pr-8 rounded-xl border border-gray-200 bg-white text-xs font-semibold text-gray-700 focus:border-[#6D28D9] focus:outline-none shadow-xs"
            >
              <option value="all">All Types</option>
              <option value="lost">Lost Only</option>
              <option value="found">Found Only</option>
            </select>
            <div className="pointer-events-none absolute right-2.5 top-1/2 -translate-y-1/2 text-gray-400">
              <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M19 9l-7 7-7-7" />
              </svg>
            </div>
          </div>

          {/* Category Filter */}
          <div className="relative min-w-[160px]">
            <select
              value={selectedCategory}
              onChange={(e) => handleCategoryChange(e.target.value)}
              className="w-full appearance-none px-3.5 py-2 pr-8 rounded-xl border border-gray-200 bg-white text-xs font-semibold text-gray-700 focus:border-[#6D28D9] focus:outline-none shadow-xs"
            >
              {CATEGORIES.map((cat) => (
                <option key={cat} value={cat}>
                  {cat}
                </option>
              ))}
            </select>
            <div className="pointer-events-none absolute right-2.5 top-1/2 -translate-y-1/2 text-gray-400">
              <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M19 9l-7 7-7-7" />
              </svg>
            </div>
          </div>

          {/* Location Input */}
          <div className="relative min-w-[160px]">
            <input
              type="text"
              value={locationQuery}
              onChange={handleLocationChange}
              placeholder="Filter location (e.g. Library)"
              className="w-full px-3.5 py-2 rounded-xl border border-gray-200 text-xs font-semibold text-gray-700 focus:border-[#6D28D9] focus:outline-none shadow-xs placeholder-gray-400"
            />
          </div>
        </div>

        {/* Clear Filters */}
        {(searchTerm || selectedType !== 'all' || selectedCategory !== 'All Categories' || locationQuery) && (
          <button
            type="button"
            onClick={handleResetFilters}
            className="flex items-center gap-1.5 px-3 py-2 rounded-xl text-xs font-semibold text-gray-500 hover:text-[#6D28D9] hover:bg-purple-50 transition"
          >
            <RotateCcw className="w-3.5 h-3.5" />
            <span>Reset Filters</span>
          </button>
        )}
      </div>

      {/* Results Header */}
      <div className="flex items-center justify-between text-xs font-semibold text-gray-500 px-1">
        <span>
          Showing {loading ? '...' : items.length} active report{items.length === 1 ? '' : 's'}
        </span>
        {selectedType !== 'all' && (
          <span className="capitalize text-[#6D28D9] bg-purple-50 px-2 py-0.5 rounded-md">
            Filtered by: {selectedType}
          </span>
        )}
      </div>

      {error && (
        <div className="p-4 rounded-2xl bg-rose-50 border border-rose-200 text-rose-700 text-xs sm:text-sm flex items-start gap-2.5">
          <AlertCircle className="w-4 h-4 shrink-0 mt-0.5" />
          <span>{error}</span>
        </div>
      )}

      {/* Grid of Results */}
      {loading ? (
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
          {[...Array(6)].map((_, i) => (
            <ItemCardSkeleton key={i} />
          ))}
        </div>
      ) : items.length > 0 ? (
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
          {items.map((item) => (
            <ItemCard key={item._id} item={item} />
          ))}
        </div>
      ) : (
        <EmptyState
          icon={PackageSearch}
          title="No items found"
          description="We couldn't find any items matching your active search or filters. Try searching with different keywords."
          actionText="Reset All Filters"
          onAction={handleResetFilters}
        />
      )}
    </div>
  );
};

export default SearchPage;
