"use client"
import { getPricesItems, PriceData } from "@/lib/data/albionData";
import { refine_items, resource_items } from "@/lib/items";
import Link from "next/link";
import { useEffect, useState, useMemo } from "react";

const availableTiers = [4, 5, 6, 7, 8];

const refineCategories = ['PLANKS', 'LEATHER', 'CLOTH', 'METALBAR'];
const resourceCategories = ['ORE', 'WOOD', 'FIBER', 'HIDE'];
const categoryMap: Record<string, string> = {
  PLANKS: 'PLANKS',
  LEATHER: 'LEATHERS',
  CLOTH: 'CLOTHS',
  METALBAR: 'METAL BAR',
  ORE: 'ORE',
  WOOD: 'WOOD',
  FIBER: 'FIBER',
  HIDE: 'HIDE',
};



const getItemCategory = (itemId: string): string | null => {
  for (const cat of [...refineCategories, ...resourceCategories]) {
    if (itemId.includes(cat)) {
      const regex = new RegExp(`T\\d+_(${cat})`);
      const match = itemId.match(regex);
      if (match) return match[1];
    }
  }
  return null;
};

const getItemTier = (itemId: string): number | null => {
  const match = itemId.match(/T(\d+)/);
  if (match && match[1]) {
    return parseInt(match[1], 10);
  }
  return null;
};

export default function AlbionItems() {
  const [itemType, setItemType] = useState<'refine' | 'resource'>('refine');
  const [priceData, setPriceData] = useState<PriceData[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(false);
  const [selectedTiers, setSelectedTiers] = useState<number[]>(availableTiers);
  const [selectedCategories, setSelectedCategories] = useState<string[]>(
    [...refineCategories, ...resourceCategories]
  );

  useEffect(() => {
    const fetchData = async () => {
      setLoading(true);
      setError(false);

      try {
        const items: {
          T4: string[];
          T5: string[];
          T6: string[];
          T7: string[];
          T8: string[];
        } = itemType === 'refine' ? refine_items : resource_items;
        const data = await getPricesItems(items);

        if (!data) {
          setError(true);
        } else {
          setPriceData(data);
        }
      } catch (err) {
        console.error("Error fetching data:", err);
        setError(true);
      } finally {
        setLoading(false);
      }
    };

    fetchData();
  }, [itemType]);

  const toggleCategory = (category: string) => {
    setSelectedCategories(prevCats =>
      prevCats.includes(category)
        ? prevCats.filter(c => c !== category)
        : [...prevCats, category]
    );
  };

  // Handler untuk mengaktifkan/menonaktifkan Tier
  const toggleTier = (tier: number) => {
    setSelectedTiers(prevTiers =>
      prevTiers.includes(tier)
        ? prevTiers.filter(t => t !== tier)
        : [...prevTiers, tier].sort((a, b) => a - b)
    );
  };


  // Gunakan useMemo untuk mengelompokkan dan memfilter data HANYA ketika priceData atau selectedTiers berubah
  const groupedData = useMemo(() => {
    if (priceData.length === 0) return {};

    const filteredPriceData = priceData.filter(item => {
      const tier = getItemTier(item.item_id);
      const category = getItemCategory(item.item_id);

      // Filter 1: Tier harus aktif
      const isTierMatch = tier !== null && selectedTiers.includes(tier);

      // Filter 2: Kategori harus aktif
      const isCategoryMatch = category !== null && selectedCategories.includes(category);

      return isTierMatch && isCategoryMatch;
    });

    const grouped = filteredPriceData.reduce((acc: any, item: PriceData) => {
      const key = `${item.item_id}-Q${item.quality}`;
      if (!acc[key]) {
        acc[key] = {
          item_id: item.item_id,
          quality: item.quality,
          cities: []
        };
      }
      acc[key].cities.push(item);
      return acc;
    }, {});

    return grouped;
  }, [priceData, selectedTiers, selectedCategories]);


  const getCityColor = (city: string) => {
    const colors: Record<string, string> = {
      'Caerleon': 'from-red-500 to-red-600',
      'Bridgewatch': 'from-yellow-500 to-yellow-600',
      'Lymhurst': 'from-green-500 to-green-600',
      'FortSterling': 'from-blue-500 to-blue-600',
      'Fort Sterling': 'from-blue-500 to-blue-600',
      'Martlock': 'from-purple-500 to-purple-600',
      'Thetford': 'from-pink-500 to-pink-600'
    };
    return colors[city] || 'from-gray-500 to-gray-600';
  };

  const getCityBorderColor = (city: string) => {
    const colors: Record<string, string> = {
      'Caerleon': 'border-red-500',
      'Bridgewatch': 'border-yellow-500',
      'Lymhurst': 'border-green-500',
      'FortSterling': 'border-blue-500',
      'Fort Sterling': 'border-blue-500',
      'Martlock': 'border-purple-500',
      'Thetford': 'border-pink-500'
    };
    return colors[city] || 'border-gray-500';
  };

  const getQualityLabel = (quality: number) => {
    const labels: Record<number, string> = {
      0: 'Normal',
      1: 'Good',
      2: 'Outstanding',
      3: 'Excellent',
      4: 'Masterpiece'
    };
    return labels[quality] || 'Unknown';
  };

  const getLowestPrice = (cities: any[]) => {
    const validPrices = cities.filter(city => city.sell_price_min > 0);
    if (validPrices.length === 0) return null;
    return Math.min(...validPrices.map(city => city.sell_price_min));
  };

  const getHighestPrice = (cities: any[]) => {
    const validPrices = cities.filter(city => city.sell_price_min > 0);
    if (validPrices.length === 0) return null;
    return Math.max(...validPrices.map(city => city.sell_price_min));
  };

  // Error Handling
  if (error && !loading) {
    return (
      <div className="p-8">
        <div className="bg-red-100 border border-red-400 text-red-700 px-4 py-3 rounded dark:bg-red-900 dark:border-red-700 dark:text-red-300">
          Gagal memuat data harga Albion Online. Silakan coba lagi.
        </div>
      </div>
    );
  }

  // Loading Handling
  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-slate-50 dark:bg-slate-900">
        <div className="text-center">
          <svg className="animate-spin h-8 w-8 text-blue-500 mx-auto mb-3" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
            <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
            <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
          </svg>
          <p className="text-lg text-gray-700 dark:text-gray-300">Memuat data harga...</p>
        </div>
      </div>
    );
  }


  return (
    <main className="min-h-screen bg-gradient-to-br from-slate-50 to-slate-100 dark:from-slate-900 dark:to-slate-800 p-4 md:p-8">
      <div className="max-w-7xl mx-auto">

        <div className="mb-8">
          <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-4 mb-4">
            <div className="flex flex-row gap-2 justify-center items-center">
              <Link href={'/'}
                className={`${loading ? 'opacity-50 cursor-not-allowed' : 'bg-gradient-to-r from-blue-500 to-blue-600 text-white shadow-md px-6 py-2.5 rounded-md h-fit'}`}
              >
                Kembali
              </Link>
              <div>
                <h1 className="text-3xl md:text-4xl font-bold text-gray-900 dark:text-white mb-2">
                  Harga Item Albion Online
                </h1>
                <p className="text-gray-600 dark:text-gray-400">
                  Perbandingan harga di semua Royal Cities
                </p>
              </div>
            </div>
            {/* Item Selector */}
            <div className="flex gap-2 bg-white dark:bg-slate-800 rounded-lg p-1 shadow-md border border-gray-200 dark:border-slate-700">
              <button
                onClick={() => setItemType('refine')}
                disabled={loading}
                className={`px-6 py-2.5 rounded-md font-semibold transition-all duration-200 ${itemType === 'refine'
                  ? 'bg-gradient-to-r from-blue-500 to-blue-600 text-white shadow-md'
                  : 'text-gray-600 dark:text-gray-400 hover:bg-gray-100 dark:hover:bg-slate-700'
                  } ${loading ? 'opacity-50 cursor-not-allowed' : ''}`}
              >
                ⚒️ Refine Items
              </button>
              <button
                onClick={() => setItemType('resource')}
                disabled={loading}
                className={`px-6 py-2.5 rounded-md font-semibold transition-all duration-200 ${itemType === 'resource'
                  ? 'bg-gradient-to-r from-green-500 to-green-600 text-white shadow-md'
                  : 'text-gray-600 dark:text-gray-400 hover:bg-gray-100 dark:hover:bg-slate-700'
                  } ${loading ? 'opacity-50 cursor-not-allowed' : ''}`}
              >
                🌿 Resource Items
              </button>
            </div>
          </div>
        </div>

        {/* Tier Selector */}
        <div className="mb-8 p-4 bg-white dark:bg-slate-800 rounded-xl shadow-md border border-gray-200 dark:border-slate-700">
          <h3 className="text-md font-bold text-gray-900 dark:text-white mb-3 border-b pb-2 border-gray-200 dark:border-slate-700">
            Filter Tier (T)
          </h3>
          <div className="flex flex-wrap gap-3">
            {availableTiers.map(tier => (
              <button
                key={tier}
                onClick={() => toggleTier(tier)}
                className={`px-4 py-1.5 rounded-full font-medium text-sm transition-colors duration-200 
                            ${selectedTiers.includes(tier)
                    ? 'bg-indigo-600 text-white shadow-md hover:bg-indigo-700'
                    : 'bg-gray-100 text-gray-700 hover:bg-gray-200 dark:bg-slate-700 dark:text-gray-300 dark:hover:bg-slate-600'
                  }`}
                disabled={loading}
              >
                T{tier}
              </button>
            ))}
          </div>


        </div>

        <div className={`mb-8 p-4 bg-white dark:bg-slate-800 rounded-xl shadow-md border border-gray-200 dark:border-slate-700`}>
          <h3 className="text-md font-bold text-gray-900 dark:text-white mb-3 border-b pb-2 border-gray-200 dark:border-slate-700">
            Filter Tipe Material ({itemType === 'refine' ? 'Refined' : 'Resource'})
          </h3>
          <div className="flex flex-wrap gap-3">

            {(itemType === 'refine' ? refineCategories : resourceCategories).map(cat => (
              <button
                key={cat}
                onClick={() => toggleCategory(cat)}
                className={`px-4 py-1.5 rounded-full font-medium text-sm transition-colors duration-200 
                            ${selectedCategories.includes(cat)
                    ? 'bg-orange-600 text-white shadow-md hover:bg-orange-700'
                    : 'bg-gray-100 text-gray-700 hover:bg-gray-200 dark:bg-slate-700 dark:text-gray-300 dark:hover:bg-slate-600'
                  }`}
                disabled={loading}
              >
                {categoryMap[cat]}
              </button>
            ))}
          </div>
        </div>


        <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-4 gap-6">
          {Object.values(groupedData).map((group: any, index: number) => {
            const lowestPrice = getLowestPrice(group.cities);
            const highestPrice = getHighestPrice(group.cities);

            return (
              <div
                key={index}
                className="bg-white dark:bg-slate-800 rounded-xl shadow-lg border border-gray-200 dark:border-slate-700 overflow-hidden hover:shadow-xl transition-shadow duration-300"
              >
                <div className="bg-gradient-to-r from-slate-700 to-slate-800 dark:from-slate-900 dark:to-slate-950 p-4 border-b border-gray-200 dark:border-slate-700">
                  <h3 className="font-bold text-lg text-white truncate mb-1">
                    {group.item_id}
                  </h3>
                  <div className="flex items-center justify-between">
                    <span className="text-xs text-slate-300">
                      Quality: {getQualityLabel(group.quality)}
                    </span>
                    {lowestPrice && (
                      <span className="text-xs bg-green-500 text-white px-2 py-1 rounded-full font-medium">
                        Best: {lowestPrice.toLocaleString()}
                      </span>
                    )}
                  </div>
                </div>

                <div className="p-4 space-y-3">
                  {group.cities.map((city: any, cityIndex: number) => {
                    const isLowest = city.sell_price_min === lowestPrice && city.sell_price_min > 0;
                    const isHighest = city.sell_price_min === highestPrice && city.sell_price_min > 0 && highestPrice !== lowestPrice;

                    return (
                      <div
                        key={cityIndex}
                        className={`border-l-4 ${getCityBorderColor(city.city)} bg-gray-50 dark:bg-slate-900/50 rounded-r-lg p-3 ${isLowest ? 'ring-2 ring-green-500 ring-opacity-50' : ''
                          } ${isHighest ? 'ring-2 ring-red-500 ring-opacity-50' : ''}`}
                      >
                        <div className="flex items-center justify-between mb-2">
                          <div className="flex items-center gap-2">
                            <div className={`w-3 h-3 rounded-full bg-gradient-to-r ${getCityColor(city.city)}`}></div>
                            <span className="font-semibold text-sm text-gray-900 dark:text-white">
                              {city.city}
                            </span>
                          </div>
                          {isLowest && (
                            <span className="text-xs bg-green-500 text-white px-2 py-0.5 rounded-full">
                              ★ Best
                            </span>
                          )}
                          {isHighest && (
                            <span className="text-xs bg-red-500 text-white px-2 py-0.5 rounded-full">
                              ⚠ High
                            </span>
                          )}
                        </div>

                        <div className="flex items-baseline justify-between">
                          <span className="text-xs text-gray-500 dark:text-gray-400">
                            Sell Min:
                          </span>
                          <span className={`font-bold ${isLowest
                            ? 'text-green-600 dark:text-green-400 text-lg'
                            : isHighest
                              ? 'text-red-600 dark:text-red-400'
                              : 'text-gray-900 dark:text-white'
                            }`}>
                            {city.sell_price_min > 0
                              ? `${city.sell_price_min.toLocaleString()} 🪙`
                              : 'N/A'}
                          </span>
                        </div>

                        {city.sell_price_min_date && (
                          <div className="text-xs text-gray-400 dark:text-gray-500 mt-1">
                            {new Date(city.sell_price_min_date).toLocaleString('id-ID', {
                              day: '2-digit',
                              month: 'short',
                              hour: '2-digit',
                              minute: '2-digit'
                            })}
                          </div>
                        )}
                      </div>
                    );
                  })}
                </div>

                <div className="bg-gray-50 dark:bg-slate-900/30 px-4 py-3 border-t border-gray-200 dark:border-slate-700">
                  <div className="flex items-center justify-between text-xs">
                    <span className="text-gray-500 dark:text-gray-400">
                      {group.cities.length} cities
                    </span>
                    {lowestPrice && highestPrice && (
                      <span className="text-gray-500 dark:text-gray-400">
                        Range: {lowestPrice.toLocaleString()} - {highestPrice.toLocaleString()}
                      </span>
                    )}
                  </div>
                </div>
              </div>
            );
          })}
        </div>

        {Object.keys(groupedData).length === 0 && !loading && (
          <div className="text-center py-16">
            <div className="bg-gray-100 dark:bg-slate-800 rounded-lg p-8 max-w-md mx-auto border border-dashed border-gray-300 dark:border-slate-700">
              <p className="text-gray-500 dark:text-gray-400 text-lg font-medium">
                Tidak ada data harga yang ditemukan untuk kriteria {itemType === 'refine' ? 'Refine' : 'Resource'} dan Tier yang dipilih.
              </p>
            </div>
          </div>
        )}
      </div>
    </main >
  );
}