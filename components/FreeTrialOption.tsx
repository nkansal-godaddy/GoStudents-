'use client';

import { useState } from 'react';

interface Feature {
  text: string;
}

interface FreeTrialOptionProps {
  title: string;
  description: string;
  trialDuration: string;
  features?: Feature[];
  defaultSelected?: boolean;
  trialValue?: string;
  onChange?: (accepted: boolean) => void;
}

export default function FreeTrialOption({
  title,
  description,
  trialDuration,
  features = [],
  defaultSelected = true,
  trialValue = '$XX.XX',
  onChange,
}: FreeTrialOptionProps) {
  const [selected, setSelected] = useState(defaultSelected);

  const handleChange = (value: boolean) => {
    setSelected(value);
    console.log(`${title} - Selected:`, value);
    onChange?.(value);
  };

  return (
    <div className="bg-white rounded-lg shadow-md border border-gray-200 p-3 mb-2">
      <div className="mb-2">
        <div className="flex items-center gap-2 mb-1">
          <span className="bg-green-100 text-green-800 text-xs font-bold px-2 py-0.5 rounded">
            FREE TRIAL
          </span>
        </div>
        <h3 className="text-sm font-semibold text-gray-900 mb-0.5">
          {title}
          <span className="ml-1 text-gray-400 cursor-help text-xs" title="More information">ℹ️</span>
        </h3>
        <p className="text-xs text-gray-600 mb-1">{description}</p>
        
        {features.length > 0 && (
          <ul className="space-y-0.5 mb-2">
            {features.map((feature, index) => (
              <li key={index} className="flex items-start gap-1 text-xs text-gray-700">
                <span className="text-green-600 mt-0.5 text-xs">✓</span>
                <span>{feature.text}</span>
              </li>
            ))}
          </ul>
        )}
      </div>

      <div className="space-y-1.5">
        <label className="flex items-start gap-2 p-2 border-2 border-gray-300 rounded-lg cursor-pointer hover:border-gray-400 transition-colors">
          <input
            type="radio"
            name={`trial-${title}`}
            checked={selected}
            onChange={() => handleChange(true)}
            className="mt-0.5 w-3 h-3 text-black focus:ring-black"
          />
          <div className="flex-1">
            <div className="font-medium text-gray-900 text-xs mb-0.5">
              Get Email Free Trial.
            </div>
            <div className="text-xs text-gray-600">
              {trialDuration}. Cancel anytime.
            </div>
          </div>
          {selected && (
            <span className="text-black font-bold text-sm">✓</span>
          )}
        </label>

        <label className="flex items-start gap-2 p-2 border-2 border-gray-300 rounded-lg cursor-pointer hover:border-gray-400 transition-colors">
          <input
            type="radio"
            name={`trial-${title}`}
            checked={!selected}
            onChange={() => handleChange(false)}
            className="mt-0.5 w-3 h-3 text-black focus:ring-black"
          />
          <div className="flex-1">
            <div className="font-medium text-gray-900 text-xs">
              No thanks.
            </div>
            <div className="text-xs text-gray-600">
              I don&apos;t want the free trial worth {trialValue}.
            </div>
          </div>
          {!selected && (
            <span className="text-black font-bold text-sm">✓</span>
          )}
        </label>
      </div>
    </div>
  );
}
