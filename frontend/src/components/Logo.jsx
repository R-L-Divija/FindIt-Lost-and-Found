import React from 'react';
import { Link } from 'react-router-dom';

const Logo = ({ size = 'md', to = '/' }) => {
  const iconSizes = {
    sm: 'w-7 h-7',
    md: 'w-9 h-9',
    lg: 'w-11 h-11',
  };

  const textSizes = {
    sm: 'text-lg',
    md: 'text-2xl',
    lg: 'text-3xl',
  };

  const content = (
    <div className="flex items-center gap-2.5 font-bold tracking-tight text-[#1E1B4B] group transition-transform duration-200 hover:scale-[1.02]">
      {/* Shield with magnifying glass logo */}
      <div
        className={`${iconSizes[size]} rounded-xl bg-gradient-to-br from-[#7C3AED] to-[#6D28D9] flex items-center justify-center text-white shadow-md shadow-purple-500/20 ring-2 ring-purple-400/30 transition-shadow group-hover:shadow-purple-500/40`}
      >
        <svg
          viewBox="0 0 24 24"
          fill="none"
          stroke="currentColor"
          strokeWidth="2.2"
          strokeLinecap="round"
          strokeLinejoin="round"
          className="w-5 h-5 text-white"
        >
          {/* Shield outline */}
          <path d="M12 22s8-4 8-10V5l-8-3-8 3v7c0 6 8 10 8 10z" fill="rgba(255,255,255,0.15)" />
          {/* Magnifying glass in center */}
          <circle cx="11" cy="10" r="3.2" strokeWidth="2" stroke="white" />
          <path d="m13.5 12.5 3 3" strokeWidth="2.2" stroke="white" />
        </svg>
      </div>
      <div className="flex flex-col">
        <span className={`${textSizes[size]} font-extrabold text-[#1E1B4B] leading-none`}>
          Find<span className="text-[#6D28D9]">It</span>
        </span>
      </div>
    </div>
  );

  if (to) {
    return <Link to={to} className="inline-block focus:outline-none focus-visible:ring-2 focus-visible:ring-purple-500 rounded-lg">{content}</Link>;
  }

  return content;
};

export default Logo;
