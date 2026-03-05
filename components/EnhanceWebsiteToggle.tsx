'use client';

import { useState } from 'react';

interface EnhanceWebsiteToggleProps {
  title: string;
  description?: string;
  savingsBadge?: string;
  monthlyPrice?: string;
  totalPrice?: string;
  isEnabled?: boolean;
  onToggle?: (enabled: boolean) => void;
}

export default function EnhanceWebsiteToggle({
  title,
  description = 'Businesses and websites should have a privacy policy. It shows you take protecting data seriously. Write yours with Airo Plus™ Compliance. Included with the purchase of Airo™ Plus.',
  savingsBadge = 'SAVE 50%',
  monthlyPrice = '$XX.XX',
  totalPrice = '$XX.XX',
  isEnabled = false,
  onToggle,
}: EnhanceWebsiteToggleProps) {
  const [enabled, setEnabled] = useState(isEnabled);

  const handleToggle = () => {
    const newValue = !enabled;
    setEnabled(newValue);
    console.log(`${title} - Toggled:`, newValue);
    onToggle?.(newValue);
  };

  return (
    <div className="bg-white rounded-lg shadow-md border border-gray-200 p-3">
      <div className="flex items-start justify-between gap-3">
        <div className="flex-1">
          <h3 className="text-sm font-semibold text-gray-900 mb-1">
            {title}
            <span className="ml-1 text-gray-400 cursor-help text-xs" title="More information">ℹ️</span>
          </h3>
          <p className="text-xs text-gray-600 mb-1">{description}</p>
        </div>
        
        <button
          onClick={handleToggle}
          className={`relative inline-flex h-5 w-9 flex-shrink-0 cursor-pointer rounded-full border-2 border-transparent transition-colors duration-200 ease-in-out focus:outline-none focus:ring-1 focus:ring-black focus:ring-offset-1 ${
            enabled ? 'bg-black' : 'bg-gray-200'
          }`}
          role="switch"
          aria-checked={enabled}
        >
          <span
            className={`pointer-events-none inline-block h-4 w-4 transform rounded-full bg-white shadow ring-0 transition duration-200 ease-in-out ${
              enabled ? 'translate-x-4' : 'translate-x-0'
            }`}
          />
        </button>
      </div>

      {enabled && (
        <div className="mt-2 pt-2 border-t border-gray-200">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-2">
              <span className="bg-orange-100 text-orange-800 text-xs font-bold px-2 py-0.5 rounded">
                {savingsBadge}
              </span>
              <span className="text-lg font-bold text-gray-900">
                {monthlyPrice}<span className="text-sm font-normal text-gray-600">/mo</span>
              </span>
            </div>
            <div className="text-xs text-gray-600">
              You pay {totalPrice} today
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
