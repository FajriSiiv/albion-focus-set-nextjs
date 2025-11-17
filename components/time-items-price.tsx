// components/TimeframeSelector.tsx
'use client';

import { useRouter, useSearchParams } from 'next/navigation';

type Timeframe = 'current' | '6h' | '1d' | '7d';

interface TimeframeSelectorProps {
  currentTimeframe: Timeframe;
}

export default function TimeItemsPrice({ currentTimeframe }: TimeframeSelectorProps) {
  const router = useRouter();
  const searchParams = useSearchParams();

  const timeframeOptions = [
    { value: 'current', label: 'Current Price', description: 'Live market data' },
    { value: '6h', label: '6 Hours', description: 'Last 6 hours history' },
    { value: '1d', label: '1 Day', description: 'Last 24 hours history' },
    { value: '7d', label: '7 Days', description: 'Last week history' }
  ];

  const handleChange = (value: string) => {
    const params = new URLSearchParams(searchParams.toString());
    params.set('timeframe', value);
    router.push(`?${params.toString()}`);
  };

  const currentOption = timeframeOptions.find(opt => opt.value === currentTimeframe);

  return (
    <div className="relative inline-block min-w-[250px]">
      <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
        Timeframe
      </label>
      <div className="relative">
        <select
          value={currentTimeframe}
          onChange={(e) => handleChange(e.target.value)}
          className="block w-full appearance-none bg-white dark:bg-slate-800 border border-gray-300 dark:border-slate-600 text-gray-900 dark:text-white rounded-lg pl-4 pr-10 py-3 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent cursor-pointer hover:border-gray-400 dark:hover:border-slate-500 transition-colors"
        >
          {timeframeOptions.map((option) => (
            <option key={option.value} value={option.value}>
              {option.label} - {option.description}
            </option>
          ))}
        </select>
        <div className="pointer-events-none absolute inset-y-0 right-0 flex items-center px-3 text-gray-500 dark:text-gray-400">
        </div>
      </div>

      {/* Selected Info */}
      <p className="mt-2 text-xs text-gray-500 dark:text-gray-400">
        {currentOption?.description}
      </p>
    </div>
  );
}