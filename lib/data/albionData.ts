export interface PriceData {
  item_id: string;
  city: string;
  quality: number;
  sell_price_min: number;
  buy_price_max: number;
}

const BASE_URL = "https://www.albion-online-data.com/api/v2/stats/Prices/";

export async function getPricesItems(category: {
  T4: string[];
  T5: string[];
  T6: string[];
  T7: string[];
  T8: string[];
}) {
  const locations = [
    "fortsterling",
    "martlock",
    "thetford",
    "lymhurst",
    "bridgewatch",
  ];

  const allTiersArrays = Object.values(category);
  const allItemsArray = allTiersArrays.flat();
  const allItemsString = allItemsArray.join(",");

  const url = `${BASE_URL}${allItemsString}.json?locations=${locations}&qualities=1`;
  try {
    const response = await fetch(url, {
      next: {
        revalidate: 600,
        tags: [`albion-price`],
      },
    });

    if (!response.ok) {
      console.error(`Error API: ${response.status} - ${response.statusText}`);
      return null;
    }

    const data: PriceData[] = await response.json();
    return data;
  } catch (error) {
    console.error("Kesalahan saat fetching data:", error);
    return null;
  }
}

export async function getAlbionPrices(
  itemIds: string[],
  locations: string[],
  qualities: number[]
): Promise<PriceData[] | null> {
  const itemStr = itemIds.join(",");
  const locationStr = locations.join(",");
  const qualityStr = qualities.join(",");

  const url = `${BASE_URL}${itemStr}.json?locations=${locationStr}&qualities=${qualityStr}`;

  try {
    const response = await fetch(url);

    if (!response.ok) {
      console.error(`Error API: ${response.status} - ${response.statusText}`);
      return null;
    }

    const data: PriceData[] = await response.json();
    return data;
  } catch (error) {
    console.error("Kesalahan saat fetching data:", error);
    return null;
  }
}
