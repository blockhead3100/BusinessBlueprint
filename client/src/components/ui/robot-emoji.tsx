import React from 'react';

export const RobotEmoji: React.FC<{ className?: string }> = ({ className }) => {
  return (
    <svg 
      xmlns="http://www.w3.org/2000/svg" 
      viewBox="0 0 24 24" 
      className={className}
      fill="currentColor"
    >
      <rect x="0" y="0" width="24" height="24" fill="none" />
      <path d="M12,2A2,2,0,0,1,14,4V7h5a2,2,0,0,1,2,2v8a2,2,0,0,1-2,2H5a2,2,0,0,1-2-2V9A2,2,0,0,1,5,7h5V4A2,2,0,0,1,12,2M7.5,10A1.5,1.5,0,0,0,6,11.5,1.5,1.5,0,0,0,7.5,13,1.5,1.5,0,0,0,9,11.5,1.5,1.5,0,0,0,7.5,10M16.5,10A1.5,1.5,0,0,0,15,11.5,1.5,1.5,0,0,0,16.5,13,1.5,1.5,0,0,0,18,11.5,1.5,1.5,0,0,0,16.5,10M7,15l2,2h6l2-2Z" />
      <path d="M10,4h4V7H10Z" opacity="0.5" />
    </svg>
  );
};