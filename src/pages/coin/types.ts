export interface ICoinPrice {
  id: string;
  symbol: string;
  name: string;
  currentPrice: number;
  marketCap: number;
  priceChange24h: number;
  currency: 'usd' | 'vnd';
}

export interface ICoinChartData {
  date: string;
  price: number;
}
