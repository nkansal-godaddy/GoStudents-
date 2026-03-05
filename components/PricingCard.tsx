'use client';

interface Feature {
  text: string;
  hasTooltip?: boolean;
}

interface PricingCardProps {
  name: string;
  price: string;
  period: string;
  savingsBadge: string;
  isRecommended?: boolean;
  websiteFeatures: Feature[];
  marketingFeatures: Feature[];
  onAddToCart: () => void;
  onStartFree: () => void;
}

export default function PricingCard({
  name,
  price,
  period,
  savingsBadge,
  isRecommended = false,
  websiteFeatures,
  marketingFeatures,
  onAddToCart,
  onStartFree,
}: PricingCardProps) {
  return (
    <div
      className={`relative bg-white rounded-lg shadow-md border ${
        isRecommended ? 'border-cyan-400 border-2' : 'border-gray-200'
      } p-6 flex flex-col`}
    >
      {isRecommended && (
        <div className="absolute -top-3 left-1/2 -translate-x-1/2 bg-cyan-400 text-black text-xs font-bold px-4 py-1 rounded">
          RECOMMENDED
        </div>
      )}

      <div className="mb-6">
        <h3 className="text-2xl font-bold text-gray-900 mb-2">{name}</h3>
        <div className="bg-yellow-50 text-yellow-800 text-xs font-semibold px-2 py-1 rounded inline-block mb-4">
          {savingsBadge}
        </div>
        <div className="flex items-baseline gap-1">
          <span className="text-4xl font-bold text-gray-900">{price}</span>
          <span className="text-gray-600">{period}</span>
        </div>
      </div>

      <div className="space-y-3 mb-6">
        <button
          onClick={onAddToCart}
          className="w-full bg-black text-white font-medium py-3 px-4 rounded hover:bg-gray-800 transition-colors"
        >
          Add to Cart
        </button>
        <button
          onClick={onStartFree}
          className="w-full bg-white text-gray-900 font-medium py-3 px-4 rounded border border-gray-300 hover:bg-gray-50 transition-colors"
        >
          Start for Free
        </button>
      </div>

      <div className="flex-grow space-y-4">
        <div>
          <h4 className="text-sm font-semibold text-gray-900 mb-3">Website</h4>
          <ul className="space-y-2">
            {websiteFeatures.map((feature, index) => (
              <li key={index} className="flex items-start gap-2 text-sm text-gray-700">
                <span className="text-gray-400 mt-0.5">✓</span>
                <span className="flex-1">
                  {feature.text}
                  {feature.hasTooltip && (
                    <span className="ml-1 text-gray-400 cursor-help" title="More information">
                      ℹ️
                    </span>
                  )}
                </span>
              </li>
            ))}
          </ul>
        </div>

        <div>
          <h4 className="text-sm font-semibold text-gray-900 mb-3">Marketing</h4>
          <ul className="space-y-2">
            {marketingFeatures.map((feature, index) => (
              <li key={index} className="flex items-start gap-2 text-sm text-gray-700">
                <span className="text-gray-400 mt-0.5">✓</span>
                <span className="flex-1">{feature.text}</span>
              </li>
            ))}
          </ul>
        </div>
      </div>
    </div>
  );
}
