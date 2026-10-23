import React from 'react';

const ItemCardSkeleton = () => {
  return (
    <div className="flex flex-col bg-white rounded-2xl border border-purple-100 overflow-hidden shadow-xs animate-pulse">
      <div className="w-full h-48 bg-purple-100/70" />
      <div className="p-5 flex flex-col flex-1 space-y-3">
        <div className="h-4 bg-purple-100 rounded-md w-3/4" />
        <div className="h-3 bg-purple-50 rounded-md w-full" />
        <div className="h-3 bg-purple-50 rounded-md w-2/3" />
        <div className="pt-3 border-t border-purple-50 space-y-2 mt-auto">
          <div className="h-3 bg-purple-50 rounded-md w-1/2" />
          <div className="h-3 bg-purple-50 rounded-md w-1/3" />
        </div>
      </div>
    </div>
  );
};

export default ItemCardSkeleton;
