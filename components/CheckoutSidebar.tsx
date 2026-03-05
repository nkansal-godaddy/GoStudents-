'use client';

interface CartItem {
  name: string;
  term: string;
  autoRenews: string;
  price: string;
  originalPrice?: string;
  savingsBadge?: string;
  icon?: string;
}

interface CheckoutSidebarProps {
  items?: CartItem[];
  subtotal?: string;
  discount?: string;
  onContinue?: () => void;
}

export default function CheckoutSidebar({
  items = [
    {
      name: 'GoDaddy Website Builder Basic',
      term: '12 month term',
      autoRenews: 'Auto-renews November 2025 for $XX.XX',
      price: '$XXX.XX',
      originalPrice: '$XXX.XX',
      savingsBadge: 'SAVE 92%',
      icon: '🌐'
    },
    {
      name: 'Microsoft 365 Email Essentials',
      term: '12 month term',
      autoRenews: 'Auto-renews May 2026 for $XX.XX',
      price: '$XXX.XX',
      originalPrice: '$XXX.XX',
      savingsBadge: 'SAVE 92%',
      icon: '📧'
    },
    {
      name: 'Airo Plus™',
      term: '30 days',
      autoRenews: '',
      price: '$XXX.XX',
      originalPrice: '$XXX.XX',
      savingsBadge: 'SAVE 92%',
      icon: '⚡'
    }
  ],
  subtotal = '$XXX.XX',
  discount = '$XX.XX',
  onContinue,
}: CheckoutSidebarProps) {
  const handleContinue = () => {
    console.log('Continue to Cart clicked');
    onContinue?.();
  };

  return (
    <div className="bg-white rounded-lg shadow-md border border-gray-200 p-3 sticky top-2">
      <h2 className="text-sm font-semibold text-gray-900 mb-2">Your Current Item(s)</h2>
      
      <div className="space-y-2 mb-3">
        {items.map((item, index) => (
          <div key={index} className="border-b border-gray-200 pb-2 last:border-0 last:pb-0">
            <div className="flex items-start gap-2">
              <div className="w-8 h-8 bg-gray-100 rounded flex items-center justify-center text-lg flex-shrink-0">
                {item.icon}
              </div>
              
              <div className="flex-1 min-w-0">
                <h3 className="font-medium text-gray-900 text-xs mb-0.5">{item.name}</h3>
                <p className="text-xs text-gray-600 mb-0.5">{item.term}</p>
                {item.autoRenews && (
                  <p className="text-xs text-gray-500">{item.autoRenews}</p>
                )}
                {item.savingsBadge && (
                  <span className="inline-block bg-yellow-50 text-yellow-800 text-xs font-semibold px-1.5 py-0.5 rounded mt-1">
                    {item.savingsBadge}
                  </span>
                )}
              </div>
              
              <div className="text-right flex-shrink-0">
                <div className="font-bold text-gray-900 text-sm">{item.price}</div>
                {item.originalPrice && (
                  <div className="text-xs text-gray-500 line-through">{item.originalPrice}</div>
                )}
              </div>
            </div>
          </div>
        ))}
      </div>
      
      <div className="border-t border-gray-200 pt-2 mb-2">
        <div className="flex justify-between mb-1">
          <span className="text-xs text-gray-600">Subtotal</span>
          <span className="font-bold text-gray-900 text-sm">{subtotal}</span>
        </div>
        <p className="text-xs text-gray-500">Taxes calculated at checkout.</p>
      </div>
      
      <div className="bg-yellow-50 border border-yellow-200 rounded p-1.5 mb-2">
        <p className="text-xs text-gray-700">
          Yoohoo! Your discount is <span className="font-bold">${discount}</span>
        </p>
      </div>
      
      <button
        onClick={handleContinue}
        className="w-full bg-blue-600 text-white font-medium py-2 px-3 rounded text-sm hover:bg-blue-700 transition-colors"
      >
        Continue to Cart
      </button>
    </div>
  );
}
