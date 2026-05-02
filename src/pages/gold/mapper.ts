import type { GoldDTOResponse, GoldPriceItem } from '../../data/types';
import type { IWorldGoldPrice, IGoldChartData, IVNGoldPrice, IVNGoldData } from './types';

const TYPE_NAME_MAP: Record<string, string> = {
  XAUUSD: 'World Gold (XAU/USD)',
  SJL1L10: 'SJC 9999',
  SJ9999: 'SJC Ring',
  DOHNL: 'DOJI Hanoi',
  DOHCML: 'DOJI HCM',
  DOJINHTV: 'DOJI Jewelry',
  BTSJC: 'Bao Tin SJC',
  BT9999NTT: 'Bao Tin 9999',
  PQHNVM: 'PNJ Hanoi',
  PQHN24NTT: 'PNJ 24K',
  VNGSJC: 'VN Gold SJC',
  VIETTINMSJC: 'Viettin SJC',
};

// VN gold type codes to display
const VN_GOLD_TYPES = ['SJL1L10', 'SJ9999', 'DOHNL', 'DOHCML', 'BTSJC', 'BT9999NTT', 'PQHNVM', 'PQHN24NTT'];

export const goldMapper = {
  toWorldGoldPrice(price: number, timestamp: number): IWorldGoldPrice {
    return {
      currentPrice: price,
      currency: 'usd',
      timestamp,
    };
  },

  toChartData(dto: any): IGoldChartData[] {
    if (!dto.prices) return [];
    return dto.prices.map(([timestamp, price]: [number, number]) => ({
      date: new Date(timestamp).toISOString().split('T')[0],
      price,
    }));
  },

  toVNGoldData(response: GoldDTOResponse): IVNGoldData {
    const prices: IVNGoldPrice[] = Object.entries(response.prices)
      .filter(([typeCode]) => VN_GOLD_TYPES.includes(typeCode))
      .map(([typeCode, item]: [string, GoldPriceItem]) => ({
        typeCode,
        typeName: TYPE_NAME_MAP[typeCode] || typeCode,
        buy: item.buy,
        sell: item.sell,
        changeBuy: item.change_buy,
        changeSell: item.change_sell,
        updateTime: response.timestamp,
      }));

    return {
      prices,
      lastUpdated: response.timestamp,
      currentTime: response.timestamp,
    };
  },

  toWorldGoldFromResponse(response: GoldDTOResponse): IWorldGoldPrice | null {
    const xau = response.prices['XAUUSD'];
    if (!xau) return null;
    
    return {
      currentPrice: xau.buy, // Using buy price as current
      currency: 'usd',
      timestamp: response.timestamp,
    };
  },
};
