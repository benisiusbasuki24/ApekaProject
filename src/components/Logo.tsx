import React from 'react';

interface LogoProps {
  size?: 'sm' | 'md' | 'lg';
  showSubtitle?: boolean;
  className?: string;
}

export const Logo: React.FC<LogoProps> = ({
  size = 'md',
  showSubtitle = false,
  className = ''
}) => {
  const iconSizes = {
    sm: 'w-7 h-7',
    md: 'w-9 h-9',
    lg: 'w-12 h-12'
  };

  const textSizes = {
    sm: 'text-base',
    md: 'text-xl',
    lg: 'text-2xl'
  };

  return (
    <div className={`flex items-center gap-2.5 ${className}`}>
      {/* Bespoke Geometric Hex-Code Vector Emblem */}
      <div className={`relative ${iconSizes[size]} shrink-0 flex items-center justify-center rounded-xl bg-slate-900 border border-cyan-500/30 shadow-md shadow-cyan-500/10 group`}>
        <div className="absolute inset-0 bg-gradient-to-tr from-cyan-600/20 via-indigo-600/20 to-violet-600/20 rounded-xl" />
        <svg
          viewBox="0 0 40 40"
          fill="none"
          xmlns="http://www.w3.org/2000/svg"
          className="w-full h-full p-1.5 transition-transform duration-300 group-hover:scale-105"
        >
          <defs>
            <linearGradient id="apkGrad1" x1="0" y1="0" x2="40" y2="40" gradientUnits="userSpaceOnUse">
              <stop stopColor="#22D3EE" />
              <stop offset="0.5" stopColor="#38BDF8" />
              <stop offset="1" stopColor="#6366F1" />
            </linearGradient>
            <linearGradient id="apkGrad2" x1="40" y1="0" x2="0" y2="40" gradientUnits="userSpaceOnUse">
              <stop stopColor="#A855F7" />
              <stop offset="1" stopColor="#06B6D4" />
            </linearGradient>
          </defs>
          
          {/* Hexagon outer structural frame */}
          <polygon
            points="20,4 34,12 34,28 20,36 6,28 6,12"
            stroke="url(#apkGrad1)"
            strokeWidth="2"
            strokeLinejoin="round"
            className="opacity-70"
          />

          {/* Interlocking 'A' and code bracket '< / >' dynamic form */}
          <path
            d="M20 9L29 27H23.5L21.5 22H18.5L16.5 27H11L20 9Z"
            fill="url(#apkGrad1)"
            fillOpacity="0.9"
          />
          <path
            d="M20 14.5L18.8 19.5H21.2L20 14.5Z"
            fill="#020617"
          />
          
          {/* Subtle tech dot accent */}
          <circle cx="20" cy="30" r="1.5" fill="#38BDF8" />
        </svg>
      </div>

      <div className="flex flex-col">
        <div className={`font-bold tracking-tight text-white flex items-center leading-none ${textSizes[size]}`}>
          <span>apeka</span>
          <span className="text-cyan-400 font-semibold ml-1">project</span>
        </div>
        {showSubtitle && (
          <span className="text-[10px] tracking-wider text-slate-400 font-medium uppercase mt-0.5">
            Web App Studio &amp; SaaS
          </span>
        )}
      </div>
    </div>
  );
};
