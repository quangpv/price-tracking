import axios from 'axios';
import type { GoldDTOResponse } from '../types';

const GIAVANG_NOW_BASE = 'https://giavang.now/api';

// Yahoo Finance API for gold futures (GC=F) - free, public endpoint
const YAHOO_FINANCE_BASE = import.meta.env.DEV ? '/api/yahoo' : 'https://query1.finance.yahoo.com';

export const goldRepository = {
  async getCurrentVNAndWorldGold(): Promise<GoldDTOResponse> {
    const { data } = await axios.get(`${GIAVANG_NOW_BASE}/prices`);
    return data;
  },

  async getWorldGoldYearlyChart(from: number, to: number, currency: 'usd' | 'vnd' = 'usd'): Promise<any> {
    // For VND: Use giavang.now API with historical data (actual VN gold prices)
    if (currency === 'vnd') {
      const days = Math.ceil((to - from) / 86400); // Convert seconds to days
      const { data } = await axios.get(`${GIAVANG_NOW_BASE}/prices.php`, {
        params: { days },
      });

      if (!data.history) return { prices: [] };

      // Extract SJC 9999 (SJL1L10) sell prices for each day
      const prices = data.history
        .map((entry: any) => [
          new Date(entry.date).getTime(), // timestamp in ms
          entry.prices?.SJL1L10?.sell || entry.prices?.SJL1L10?.buy || 0,
        ])
        .filter(([, price]: [number, number]) => price > 0)
        .sort((a: [number, number], b: [number, number]) => a[0] - b[0]); // Sort ascending

      return { prices };
    }

    // For USD: Use Yahoo Finance for world gold (GC=F)
    const { data } = await axios.get(`${YAHOO_FINANCE_BASE}/v8/finance/chart/GC=F`, {
      params: {
        period1: from,
        period2: to,
        interval: '1d',
      },
      headers: {
        'User-Agent': 'Mozilla/5.0',
      },
    });

    if (!data.chart?.result?.[0]?.indicators?.quote?.[0]) {
      return { prices: [] };
    }

    const result = data.chart.result[0];
    const timestamps = result.timestamp || [];
    const quotes = result.indicators.quote[0];
    const closes = quotes.close || [];

    const prices = timestamps
      .map((ts: number, i: number) => [
        ts * 1000, // Convert to ms
        closes[i] !== null && closes[i] !== undefined ? closes[i] : null,
      ])
      .filter(([, price]: [number, number | null]) => price !== null)
      .sort((a: [number, number], b: [number, number]) => a[0] - b[0]); // Sort ascending

    return { prices };
  },
};
