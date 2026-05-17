export interface IWorldGoldPrice {
  currentPrice: number;
  currency: 'usd';
  timestamp: number;
}

export interface IGoldChartData {
  date: string;
  price: number;
}

export interface IVNGoldPrice {
  typeCode: string;
  typeName: string;
  buy: number;
  sell: number;
  changeBuy: number;
  changeSell: number;
  updateTime: number;
}

export interface IVNGoldData {
  prices: IVNGoldPrice[];
  lastUpdated: string;
}
