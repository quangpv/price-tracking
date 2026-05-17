import { useMemo } from 'react';
import { useQueries } from '@tanstack/react-query';
import { coinRepository } from '../../../data/repositories/coinRepository';
import { coinMapper } from '../mapper';
import type { Currency } from '../../../shared/types/Currency';

export const useCoinState = (currency: Currency) => {
  const from = useMemo(() => Math.floor(new Date('2025-01-01').getTime() / 1000), []);
  const to = useMemo(() => Math.floor(Date.now() / 1000), []);

  const results = useQueries({
    queries: [
      {
        queryKey: ['coin', 'currentPrice', currency],
        queryFn: () => coinRepository.getCurrentPrice(currency),
        staleTime: 1000 * 60 * 2,
      },
      {
        queryKey: ['coin', 'chart', currency, from, to],
        queryFn: () => coinRepository.getYearlyChart(currency, from, to),
        staleTime: 1000 * 60 * 5,
      },
    ],
  });

  const [priceQuery, chartQuery] = results;

  const currentPrice = useMemo(
    () => (priceQuery.data ? coinMapper.toUIPrice(priceQuery.data, currency) : null),
    [priceQuery.data, currency],
  );

  const chartData = useMemo(
    () => (chartQuery.data ? coinMapper.toChartData(chartQuery.data) : []),
    [chartQuery.data],
  );

  const loading = useMemo(
    () => priceQuery.isLoading || chartQuery.isLoading,
    [priceQuery.isLoading, chartQuery.isLoading],
  );

  const error = useMemo(
    () => (priceQuery.error || chartQuery.error
      ? (priceQuery.error?.message ?? chartQuery.error?.message ?? 'Unknown error')
      : null),
    [priceQuery.error, chartQuery.error],
  );

  return useMemo(
    () => ({
      currentPrice,
      chartData,
      loading,
      error,
      refetch: () => { priceQuery.refetch(); chartQuery.refetch(); },
    }),
    [currentPrice, chartData, loading, error, priceQuery.refetch, chartQuery.refetch],
  );
};
