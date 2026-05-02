import { useState, useEffect, useCallback } from 'react';
import { coinRepository } from '../../../data/repositories/coinRepository';
import { coinMapper } from '../mapper';
import type { ICoinPrice, ICoinChartData } from '../types';

export const useCoin = (currency: 'usd' | 'vnd') => {
  const [currentPrice, setCurrentPrice] = useState<ICoinPrice | null>(null);
  const [chartData, setChartData] = useState<ICoinChartData[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const fetchData = useCallback(async () => {
    setLoading(true);
    setError(null);
    try {
      const from = Math.floor(new Date('2025-01-01').getTime() / 1000);
      const to = Math.floor(Date.now() / 1000);

      const [priceRes, chartRes] = await Promise.all([
        coinRepository.getCurrentPrice(currency),
        coinRepository.getYearlyChart(currency, from, to),
      ]);

      setCurrentPrice(coinMapper.toUIPrice(priceRes, currency));
      setChartData(coinMapper.toChartData(chartRes));
    } catch (error: any) {
      console.error('Failed to fetch coin data:', error);
      setError(error.message || 'Failed to fetch data');
    } finally {
      setLoading(false);
    }
  }, [currency]);

  useEffect(() => {
    fetchData();
  }, [fetchData]);

  return { currentPrice, chartData, loading, error, refetch: fetchData };
};
