export interface ICoinPrice {
    updatedAt: string;
    id: string;
    symbol: string;
    name: string;
    currentPrice: string;
    marketCap: string;
    priceChange24h: number;
    currency: 'usd' | 'vnd';
}

export interface ICoinChartData {
    date: string;
    price: number;
}
