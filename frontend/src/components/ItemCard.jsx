import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import { MapPin, Calendar, Tag, Package } from 'lucide-react';

const ItemCard = ({ item }) => {
  const [imgError, setImgError] = useState(false);

  if (!item) return null;

  const isLost = item.type === 'lost';

  // Format date safely
  const formattedDate = item.date
    ? new Date(item.date).toLocaleDateString('en-US', {
        month: 'short',
        day: 'numeric',
        year: 'numeric',
      })
    : 'Unknown date';

  return (
    <Link
      to={`/items/${item._id}`}
      className="group flex flex-col bg-white rounded-2xl border border-purple-100/80 overflow-hidden shadow-xs hover:shadow-lg hover:shadow-purple-500/10 transition-all duration-200 hover:-translate-y-1 focus:outline-none focus-visible:ring-2 focus-visible:ring-[#6D28D9]"
    >
      {/* Image container */}
      <div className="relative w-full h-48 bg-purple-50/60 overflow-hidden flex items-center justify-center">
        {item.imageUrl && !imgError ? (
          <img
            src={item.imageUrl}
            alt={item.title}
            onError={() => setImgError(true)}
            className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300"
            loading="lazy"
          />
        ) : (
          <div className="flex flex-col items-center justify-center text-purple-300 group-hover:text-[#6D28D9] transition-colors p-4">
            <Package className="w-12 h-12 stroke-[1.5]" />
            <span className="text-xs font-semibold text-purple-400 mt-2">
              {item.category || 'Item'}
            </span>
          </div>
        )}

        {/* Type Badge */}
        <div className="absolute top-3 left-3">
          <span
            className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-bold tracking-wide capitalize shadow-xs ${
              isLost
                ? 'bg-rose-50 text-rose-700 border border-rose-200'
                : 'bg-emerald-50 text-emerald-700 border border-emerald-200'
            }`}
          >
            {item.type}
          </span>
        </div>

        {/* Category Badge on top-right */}
        {item.category && (
          <div className="absolute top-3 right-3">
            <span className="inline-flex items-center gap-1 px-2 py-0.5 rounded-md text-[11px] font-semibold bg-white/90 backdrop-blur-xs text-gray-700 shadow-xs border border-gray-100">
              <Tag className="w-3 h-3 text-[#6D28D9]" />
              {item.category}
            </span>
          </div>
        )}
      </div>

      {/* Card Content */}
      <div className="p-4 sm:p-5 flex flex-col flex-1">
        <h3 className="font-bold text-gray-900 text-base group-hover:text-[#6D28D9] transition-colors line-clamp-1 mb-2">
          {item.title}
        </h3>

        {item.description && (
          <p className="text-xs text-gray-500 line-clamp-2 mb-4 flex-1">
            {item.description}
          </p>
        )}

        <div className="pt-3 border-t border-purple-50 flex flex-col gap-1.5 text-xs text-gray-500 mt-auto">
          <div className="flex items-center gap-1.5 text-gray-600">
            <MapPin className="w-3.5 h-3.5 text-[#6D28D9] shrink-0" />
            <span className="truncate">{item.location}</span>
          </div>
          <div className="flex items-center gap-1.5 text-gray-500">
            <Calendar className="w-3.5 h-3.5 text-purple-400 shrink-0" />
            <span>{formattedDate}</span>
          </div>
        </div>
      </div>
    </Link>
  );
};

export default ItemCard;
