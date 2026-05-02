import type { BitcoinDTO, BitcoinChartDTO } from '../../data/types';
import type { ICoinPrice, ICoinChartData } from './types';

export const coinMapper = {
  toUIPrice(dto: BitcoinDTO, currency: 'usd' | 'vnd'): ICoinPrice {
    return {
      id: dto.id,
      symbol: dto.symbol,
      name: dto.name,
      currentPrice: dto.current_price,
      marketCap: dto.market_cap,
      priceChange24h: dto.price_change_percentage_24h,
      currency,
    };
  },

  toChartData(dto: BitcoinChartDTO): ICoinChartData[] {
    return dto.prices.map(([timestamp, price]) => ({
      date: new Date(timestamp).toISOString().split('T')[0],
      price,
    }));
  },
};
