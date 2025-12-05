
import React from 'react';

export enum MagneticState {
  ACTIVE = 'ACTIVE', // Has replies (Orbiting spheres)
  INACTIVE = 'INACTIVE', // Has posts, no replies (Static target)
  OFF = 'OFF' // No posts (Null state)
}

interface MagneticFieldProps {
  state: MagneticState;
  username: string;
}

export const MagneticField: React.FC<MagneticFieldProps> = ({ state, username }) => {
  const color = "#00A651";
  
  return (
    <div className="w-full h-full flex flex-col items-center justify-center relative overflow-hidden bg-[#F5F3EF]">
      {/* Container Label */}
      <div className="absolute top-4 font-bold text-xs tracking-widest text-[#00A651] uppercase">
        {state === MagneticState.OFF ? '[ OFF ]' : '[ MAGNETIC FIELD ]'}
      </div>

      {/* Main SVG Visualization */}
      <svg 
        viewBox="0 0 400 400" 
        className="w-full h-full max-w-[400px] max-h-[400px] p-8"
      >
        <defs>
          <filter id="glow">
            <feGaussianBlur stdDeviation="2" result="coloredBlur"/>
            <feMerge>
              <feMergeNode in="coloredBlur"/>
              <feMergeNode in="SourceGraphic"/>
            </feMerge>
          </filter>
        </defs>

        {/* Global Crosshairs (Present in all states) */}
        <line x1="0" y1="0" x2="400" y2="400" stroke={color} strokeWidth="1" opacity="0.2" />
        <line x1="400" y1="0" x2="0" y2="400" stroke={color} strokeWidth="1" opacity="0.2" />

        {/* STATE 3: OFF / NULL */}
        {state === MagneticState.OFF && (
          <g>
            <circle cx="200" cy="200" r="100" stroke={color} strokeWidth="1" fill="none" opacity="0.3" />
            <circle cx="200" cy="200" r="50" stroke={color} strokeWidth="1" fill="none" opacity="0.3" />
            
            {/* Arrows */}
            <path d="M100 350 L80 350 L80 340 L60 355 L80 370 L80 360 L100 360 Z" fill={color} />
            <path d="M300 350 L320 350 L320 340 L340 355 L320 370 L320 360 L300 360 Z" fill={color} />
            
            <text x="200" y="360" textAnchor="middle" fill={color} fontSize="12" fontWeight="bold" letterSpacing="2">NULL</text>
            <path d="M190 60 L210 60 L200 80 Z" fill={color} />
          </g>
        )}

        {/* STATE 2: INACTIVE (Static Target) */}
        {state === MagneticState.INACTIVE && (
          <g>
            {/* Concentric Circles */}
            <circle cx="200" cy="200" r="140" stroke={color} strokeWidth="1" fill="none" opacity="0.5" />
            <circle cx="200" cy="200" r="70" stroke={color} strokeWidth="4" fill="none" />
            <circle cx="200" cy="200" r="12" fill={color} fillOpacity="0.2" stroke={color} />
            
            {/* Static decorations */}
            <path d="M200 60 L210 50 L190 50 Z" fill={color} transform="rotate(180 200 55)" />
            <path d="M60 350 L80 350 L80 340 L60 355 L80 370 L80 360 L60 360 Z" fill={color} transform="rotate(180 70 355)" />
            <path d="M340 350 L360 350 L360 340 L340 355 L360 370 L360 360 L340 360 Z" fill={color} />
            
            <text x="200" y="360" textAnchor="middle" fill={color} fontSize="12" fontWeight="bold" letterSpacing="2">铁达尼号滑铲</text>
          </g>
        )}

        {/* STATE 1: ACTIVE (Orbiting Spheres) */}
        {state === MagneticState.ACTIVE && (
          <g>
            {/* Outer Static Ring */}
            <circle cx="200" cy="200" r="140" stroke={color} strokeWidth="1" fill="none" opacity="0.6" />
            
            {/* Central Core */}
            <circle cx="200" cy="200" r="60" stroke={color} strokeWidth="4" fill="none" />
            <circle cx="200" cy="200" r="12" fill={color} />

            {/* Orbit Animation Group */}
            <g>
              <animateTransform 
                attributeName="transform" 
                attributeType="XML" 
                type="rotate" 
                from="0 200 200" 
                to="360 200 200" 
                dur="10s" 
                repeatCount="indefinite" 
              />
              {/* Orbiting Spheres */}
              <circle cx="200" cy="60" r="10" fill={color} fillOpacity="0.2" stroke={color} />
              <circle cx="340" cy="200" r="10" fill={color} fillOpacity="0.2" stroke={color} />
              <circle cx="200" cy="340" r="10" fill={color} fillOpacity="0.2" stroke={color} />
              <circle cx="60" cy="200" r="10" fill={color} fillOpacity="0.2" stroke={color} />
            </g>
            
            {/* Top Indicator */}
             <path d="M190 70 L210 70 L200 90 Z" fill={color} />
             
             <text x="200" y="360" textAnchor="middle" fill={color} fontSize="12" fontWeight="bold" letterSpacing="2">铁达尼号滑铲</text>
             <path d="M60 350 L80 350 L80 340 L60 355 L80 370 L80 360 L60 360 Z" fill={color} transform="rotate(180 70 355)" />
             <path d="M340 350 L360 350 L360 340 L340 355 L360 370 L360 360 L340 360 Z" fill={color} />
          </g>
        )}
      </svg>
    </div>
  );
};
