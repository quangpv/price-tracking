import { useState, useEffect, useCallback } from 'react';
import { goldRepository } from '../../../data/repositories/goldRepository';
import { goldMapper } from '../mapper';
import type { IWorldGoldPrice, IGoldChartData, IVNGoldData } from '../types';

const POLLING_INTERVAL = 5 * 60 * 1000; // 5 minutes

export const useGoldState = (currency: 'usd' | 'vnd' = 'usd') => {
  const [vnGoldData, setVnGoldData] = useState<IVNGoldData | null>(null);
  const [worldGoldPrice, setWorldGoldPrice] = useState<IWorldGoldPrice | null>(null);
  const [chartData, setChartData] = useState<IGoldChartData[]>([]);
  const [loading, setLoading] = useState(true);
  const [lastPolled, setLastPolled] = useState<number>(0);

  const fetchCurrentGold = useCallback(async () => {
    try {
      const response = await goldRepository.getCurrentVNAndWorldGold();
      const vnData = goldMapper.toVNGoldData(response);
      setVnGoldData(vnData);

      const worldGold = goldMapper.toWorldGoldFromResponse(response);
      if (worldGold) {
        setWorldGoldPrice(worldGold);
      }

      setLastPolled(Date.now());
    } catch (error) {
      console.error('Failed to fetch current gold:', error);
    }
  }, []);

  const fetchChartData = useCallback(async () => {
    try {
      const from = Math.floor(new Date('2025-01-01').getTime() / 1000);
      const to = Math.floor(Date.now() / 1000);
      const chartRes = await goldRepository.getWorldGoldYearlyChart(from, to, currency);
      setChartData(goldMapper.toChartData(chartRes));
    } catch (error) {
      console.error('Failed to fetch gold chart:', error);
    }
  }, [currency]);

  const fetchAll = useCallback(async () => {
    setLoading(true);
    await Promise.all([fetchCurrentGold(), fetchChartData()]);
    setLoading(false);
  }, [fetchCurrentGold, fetchChartData]);

  useEffect(() => {
    fetchAll();

    const interval = setInterval(() => {
      fetchCurrentGold();
    }, POLLING_INTERVAL);

    return () => clearInterval(interval);
  }, [fetchAll, fetchCurrentGold]);

  return {
    vnGoldData,
    worldGoldPrice,
    chartData,
    loading,
    lastPolled,
    refetch: fetchAll,
  };
};
