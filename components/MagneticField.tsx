
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
      <div className="absolute top-4 font-bold text-xs tracking-widest text-[#00A651] uppercase z-10">
        {state === MagneticState.OFF ? '[ OFF ]' : '[ MAGNETIC FIELD ]'}
      </div>

      {/* Main SVG Visualization */}
      <svg 
        viewBox="0 0 400 400" 
        className="w-full h-full max-w-full max-h-full"
        preserveAspectRatio="xMidYMid meet"
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

        {/* Global Crosshairs (Full Width) */}
        <line x1="0" y1="0" x2="400" y2="400" stroke={color} strokeWidth="1" opacity="0.2" />
        <line x1="400" y1="0" x2="0" y2="400" stroke={color} strokeWidth="1" opacity="0.2" />

        {/* STATE 3: OFF / NULL */}
        {state === MagneticState.OFF && (
          <g>
            <circle cx="200" cy="200" r="140" stroke={color} strokeWidth="1" fill="none" opacity="0.3" />
            <circle cx="200" cy="200" r="70" stroke={color} strokeWidth="1" fill="none" opacity="0.3" />
            
            {/* Arrows Touching Edges */}
            <path d="M100 350 L80 350 L80 340 L60 355 L80 370 L80 360 L100 360 Z" fill={color} opacity="0.5" />
            <path d="M300 350 L320 350 L320 340 L340 355 L320 370 L320 360 L300 360 Z" fill={color} opacity="0.5" />
            
            <text x="200" y="360" textAnchor="middle" fill={color} fontSize="12" fontWeight="bold" letterSpacing="2" opacity="0.5">NULL</text>
            <path d="M190 60 L210 60 L200 80 Z" fill={color} opacity="0.5" />
          </g>
        )}

        {/* STATE 2: INACTIVE (Static Target) */}
        {state === MagneticState.INACTIVE && (
          <g>
            {/* Concentric Circles Touch Edges */}
            <circle cx="200" cy="200" r="199" stroke={color} strokeWidth="1" fill="none" opacity="0.5" />
            <circle cx="200" cy="200" r="100" stroke={color} strokeWidth="4" fill="none" />
            <circle cx="200" cy="200" r="16" fill={color} fillOpacity="0.2" stroke={color} />
            
            {/* Static decorations */}
            <path d="M200 40 L210 30 L190 30 Z" fill={color} transform="rotate(180 200 35)" />
            <path d="M40 350 L60 350 L60 340 L40 355 L60 370 L60 360 L40 360 Z" fill={color} transform="rotate(180 50 355)" />
            <path d="M360 350 L380 350 L380 340 L360 355 L380 370 L380 360 L360 360 Z" fill={color} />
            
            <text x="200" y="360" textAnchor="middle" fill={color} fontSize="12" fontWeight="bold" letterSpacing="2">铁达尼号滑铲</text>
          </g>
        )}

        {/* STATE 1: ACTIVE (Orbiting Spheres) */}
        {state === MagneticState.ACTIVE && (
          <g>
            {/* Outer Static Ring Touching Edges */}
            <circle cx="200" cy="200" r="199" stroke={color} strokeWidth="1" fill="none" opacity="0.6" />
            
            {/* Central Core */}
            <circle cx="200" cy="200" r="80" stroke={color} strokeWidth="4" fill="none" />
            <circle cx="200" cy="200" r="15" fill={color} />

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
              {/* Orbiting Spheres on the 140 radius path */}
              <circle cx="200" cy="60" r="12" fill={color} fillOpacity="0.2" stroke={color} />
              <circle cx="340" cy="200" r="12" fill={color} fillOpacity="0.2" stroke={color} />
              <circle cx="200" cy="340" r="12" fill={color} fillOpacity="0.2" stroke={color} />
              <circle cx="60" cy="200" r="12" fill={color} fillOpacity="0.2" stroke={color} />
            </g>
            
            {/* Top Indicator */}
             <path d="M190 50 L210 50 L200 70 Z" fill={color} />
             
             <text x="200" y="360" textAnchor="middle" fill={color} fontSize="12" fontWeight="bold" letterSpacing="2">铁达尼号滑铲</text>
             <path d="M40 350 L60 350 L60 340 L40 355 L60 370 L60 360 L40 360 Z" fill={color} transform="rotate(180 50 355)" />
             <path d="M360 350 L380 350 L380 340 L360 355 L380 370 L380 360 L360 360 Z" fill={color} />
          </g>
        )}
      </svg>
    </div>
  );
};
