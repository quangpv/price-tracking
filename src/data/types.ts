// DTO Types - Raw API responses

export interface BitcoinDTO {
  id: string;
  symbol: string;
  name: string;
  current_price: number;
  market_cap: number;
  price_change_percentage_24h: number;
}

export interface BitcoinChartDTO {
  prices: [number, number][]; // [timestamp, price]
  market_caps: [number, number][];
  total_volumes: [number, number][];
}

export interface GoldPriceItem {
  name: string;
  buy: number;
  sell: number;
  change_buy: number;
  change_sell: number;
  currency: string;
}

export interface GoldDTOResponse {
  success: boolean;
  timestamp: number;
  time: string;
  date: string;
  prices: Record<string, GoldPriceItem>; // key is type_code
}

export interface ExchangeRateDTO {
  rates: {
    VND: number;
    USD: number;
  };
}
