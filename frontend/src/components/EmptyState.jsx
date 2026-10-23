import React from 'react';
import { PackageSearch } from 'lucide-react';
import { Link } from 'react-router-dom';

const EmptyState = ({
  icon: Icon = PackageSearch,
  title = 'No reports found',
  description = 'There are currently no items matching your criteria. Try adjusting your filters or search keywords.',
  actionText,
  actionLink,
  onAction,
}) => {
  return (
    <div className="flex flex-col items-center justify-center p-8 sm:p-12 text-center bg-white rounded-2xl border border-purple-100 shadow-xs max-w-md mx-auto my-6">
      <div className="w-16 h-16 rounded-2xl bg-purple-50 text-[#6D28D9] flex items-center justify-center mb-4 shadow-inner ring-4 ring-purple-50/50">
        <Icon className="w-8 h-8 stroke-[1.75]" />
      </div>
      <h3 className="text-lg font-bold text-gray-900 mb-1.5">{title}</h3>
      <p className="text-sm text-gray-500 max-w-sm mb-6 leading-relaxed">
        {description}
      </p>

      {actionText && actionLink && (
        <Link
          to={actionLink}
          className="inline-flex items-center justify-center px-5 py-2.5 rounded-xl bg-[#6D28D9] hover:bg-[#5B21B6] text-white text-sm font-semibold transition-all duration-150 shadow-sm hover:shadow-md hover:shadow-purple-500/25"
        >
          {actionText}
        </Link>
      )}

      {actionText && onAction && !actionLink && (
        <button
          type="button"
          onClick={onAction}
          className="inline-flex items-center justify-center px-5 py-2.5 rounded-xl bg-[#6D28D9] hover:bg-[#5B21B6] text-white text-sm font-semibold transition-all duration-150 shadow-sm hover:shadow-md hover:shadow-purple-500/25"
        >
          {actionText}
        </button>
      )}
    </div>
  );
};

export default EmptyState;
