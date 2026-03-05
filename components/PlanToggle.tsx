'use client';

import { useState } from 'react';

interface PlanToggleProps {
  onToggle?: (isAnnual: boolean) => void;
}

export default function PlanToggle({ onToggle }: PlanToggleProps) {
  const [isAnnual, setIsAnnual] = useState(true);

  const handleToggle = (annual: boolean) => {
    setIsAnnual(annual);
    console.log(`Plan toggle changed to: ${annual ? 'Annual' : 'Monthly'}`);
    onToggle?.(annual);
  };

  return (
    <div className="flex items-center justify-center gap-4 mb-8">
      <button
        onClick={() => handleToggle(true)}
        className={`flex items-center gap-2 px-6 py-3 rounded-full font-medium transition-all ${
          isAnnual
            ? 'bg-black text-white'
            : 'bg-white text-gray-700 hover:bg-gray-100'
        }`}
      >
        <span>Annual Plans</span>
        {isAnnual && (
          <span className="bg-white text-black text-xs font-bold px-2 py-1 rounded">
            SAVE UP TO 62%
          </span>
        )}
      </button>

      <button
        onClick={() => handleToggle(false)}
        className={`flex items-center gap-2 px-6 py-3 rounded-full font-medium transition-all ${
          !isAnnual
            ? 'bg-black text-white'
            : 'bg-white text-gray-700 hover:bg-gray-100'
        }`}
      >
        <span>Monthly Plans</span>
        {!isAnnual && (
          <span className="text-xs text-gray-500">
            Flexible Term
          </span>
        )}
      </button>
    </div>
  );
}
