"use client";

import React from 'react';

interface LogoProps {
  size?: number;
  className?: string;
  style?: React.CSSProperties;
}

export const Logo: React.FC<LogoProps> = ({ 
  size = 40, 
  className, 
  style 
}) => {
  return (
    <svg
      width={size}
      height={size}
      viewBox="0 0 80 80"
      fill="none"
      xmlns="http://www.w3.org/2000/svg"
      className={className}
      style={style}
    >
      {/* Left hand - larger and more detailed */}
      <path
        d="M12 45c-1-2 0-4 1-6 0-2 1-4 3-5 1-2 3-3 5-3 2 0 4 1 5 2 1-1 2-2 4-2 2 0 4 1 5 3 1-1 3-1 4 0 2 1 3 3 3 5 0 1 0 2-1 3 1 0 2 1 3 2 1 1 2 3 2 5v8c0 4-2 8-5 10-2 2-5 3-8 3-3 0-6-1-8-3-3-2-5-6-5-10v-8c0-1 0-2 1-3l1-1z"
        fill="#0078d4"
        stroke="#005a9e"
        strokeWidth="0.5"
      />
      
      {/* Right hand - mirror of left hand */}
      <path
        d="M68 45c1-2 0-4-1-6 0-2-1-4-3-5-1-2-3-3-5-3-2 0-4 1-5 2-1-1-2-2-4-2-2 0-4 1-5 3-1-1-3-1-4 0-2 1-3 3-3 5 0 1 0 2 1 3-1 0-2 1-3 2-1 1-2 3-2 5v8c0 4 2 8 5 10 2 2 5 3 8 3 3 0 6-1 8-3 3-2 5-6 5-10v-8c0-1 0-2-1-3l-1-1z"
        fill="#0078d4"
        stroke="#005a9e"
        strokeWidth="0.5"
      />
      
      {/* Central connecting element - representing unity */}
      <circle
        cx="40"
        cy="50"
        r="8"
        fill="url(#centerGradient)"
        opacity="0.8"
      />
      
      {/* Heart in the center */}
      <path
        d="M40 45c-2-3-6-3-8 0-2 3 0 7 8 12 8-5 10-9 8-12-2-3-6-3-8 0z"
        fill="#d13438"
      />
      
      {/* Gradient definitions */}
      <defs>
        <radialGradient id="centerGradient" cx="0.5" cy="0.5" r="0.8">
          <stop offset="0%" stopColor="#ffffff" stopOpacity="0.9" />
          <stop offset="50%" stopColor="#deecf9" stopOpacity="0.7" />
          <stop offset="100%" stopColor="#0078d4" stopOpacity="0.3" />
        </radialGradient>
      </defs>
    </svg>
  );
};

export default Logo;