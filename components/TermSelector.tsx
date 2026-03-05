'use client';

interface TermSelectorProps {
  selectedTerm?: string;
  monthlyPrice?: string;
  totalPrice?: string;
  onTermChange?: (term: string) => void;
}

export default function TermSelector({
  selectedTerm = '12 months',
  monthlyPrice = '$XX.XX',
  totalPrice = '$XX.XX',
  onTermChange,
}: TermSelectorProps) {
  const handleChange = (e: React.ChangeEvent<HTMLSelectElement>) => {
    console.log('Term changed to:', e.target.value);
    onTermChange?.(e.target.value);
  };

  return (
    <div className="bg-white rounded-lg shadow-md border border-gray-200 p-3 mb-2">
      <h2 className="text-base font-semibold text-gray-900 mb-1">Select term length.</h2>
      <p className="text-xs text-gray-600 mb-2">Lock in your savings with a multi-year term length.</p>
      
      <div className="border border-black rounded-lg p-2 flex items-center justify-between">
        <div className="flex-1">
          <div className="bg-yellow-600 text-white text-xs font-bold px-2 py-0.5 rounded inline-block mb-1">
            SAVE 62%
          </div>
          <select
            value={selectedTerm}
            onChange={handleChange}
            className="block w-full max-w-xs bg-transparent border-none text-sm font-medium text-gray-900 focus:ring-0 cursor-pointer"
          >
            <option value="12 months">12 months</option>
            <option value="24 months">24 months</option>
            <option value="36 months">36 months</option>
          </select>
        </div>
        
        <div className="text-right">
          <div className="text-lg font-bold text-gray-900">
            {monthlyPrice}<span className="text-sm font-normal text-gray-600">/mo</span>
          </div>
          <div className="text-xs text-gray-600">
            You pay {totalPrice} today
          </div>
        </div>
      </div>
    </div>
  );
}
