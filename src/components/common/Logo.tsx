import React from 'react';

interface LogoProps {
  className?: string;
  size?: number;
  showText?: boolean;
}

export const Logo: React.FC<LogoProps> = ({ className = '', size = 32, showText = true }) => {
  return (
    <div className={`flex items-center gap-2.5 ${className}`}>
      <div
        className="relative flex items-center justify-center rounded-xl bg-gradient-to-br from-[#12304A] to-[#16A6A1] text-white shadow-sm flex-shrink-0"
        style={{ width: size, height: size }}
      >
        <svg
          viewBox="0 0 32 32"
          fill="none"
          xmlns="http://www.w3.org/2000/svg"
          className="w-3/4 h-3/4"
        >
          {/* Stylized DNA Double Helix with Neural AI nodes */}
          <path
            d="M8 6C12 11 20 11 24 16C20 21 12 21 8 26"
            stroke="#B8F2D0"
            strokeWidth="2.5"
            strokeLinecap="round"
          />
          <path
            d="M24 6C20 11 12 11 8 16C12 21 20 21 24 26"
            stroke="#FFFFFF"
            strokeWidth="2.5"
            strokeLinecap="round"
          />
          {/* Base pairs / neural rungs */}
          <line x1="10.5" y1="9" x2="21.5" y2="9" stroke="#B8F2D0" strokeWidth="1.75" strokeLinecap="round" opacity="0.8" />
          <line x1="13" y1="13.5" x2="19" y2="13.5" stroke="#FFFFFF" strokeWidth="1.75" strokeLinecap="round" opacity="0.9" />
          <line x1="13" y1="18.5" x2="19" y2="18.5" stroke="#FFFFFF" strokeWidth="1.75" strokeLinecap="round" opacity="0.9" />
          <line x1="10.5" y1="23" x2="21.5" y2="23" stroke="#B8F2D0" strokeWidth="1.75" strokeLinecap="round" opacity="0.8" />
          {/* AI node circles */}
          <circle cx="16" cy="16" r="2.2" fill="#B8F2D0" />
          <circle cx="24" cy="6" r="1.8" fill="#FFFFFF" />
          <circle cx="8" cy="26" r="1.8" fill="#FFFFFF" />
        </svg>
      </div>

      {showText && (
        <div className="flex flex-col leading-tight">
          <div className="flex items-center gap-1.5">
            <span className="font-bold text-base tracking-tight text-[#12304A] dark:text-white">
              BioAssist
            </span>
            <span className="text-xs font-semibold px-1.5 py-0.5 rounded bg-[#16A6A1]/10 text-[#16A6A1] dark:bg-[#16A6A1]/20 dark:text-[#20C2BC]">
              PRO
            </span>
          </div>
          <span className="text-[10px] text-[#68778A] dark:text-[#94A3B8] tracking-wider uppercase font-medium">
            Biotech Workspace
          </span>
        </div>
      )}
    </div>
  );
};
