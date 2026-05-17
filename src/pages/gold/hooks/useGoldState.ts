import { useMemo } from 'react';
import { useQueries } from '@tanstack/react-query';
import { goldRepository } from '../../../data/repositories/goldRepository';
import { goldMapper } from '../mapper';
import type { Currency } from '../../../shared/types/Currency';

const POLLING_INTERVAL = 5 * 60 * 1000;

export const useGoldState = (currency: Currency = 'usd') => {
  const from = useMemo(() => Math.floor(new Date('2025-01-01').getTime() / 1000), []);
  const to = useMemo(() => Math.floor(Date.now() / 1000), []);

  const results = useQueries({
    queries: [
      {
        queryKey: ['gold', 'currentPrices'],
        queryFn: () => goldRepository.getCurrentVNAndWorldGold(),
        refetchInterval: POLLING_INTERVAL,
        staleTime: POLLING_INTERVAL - 60 * 1000,
      },
      {
        queryKey: ['gold', 'chart', currency, from, to],
        queryFn: () => goldRepository.getWorldGoldYearlyChart(from, to, currency),
        staleTime: 1000 * 60 * 5,
      },
    ],
  });

  const [pricesQuery, chartQuery] = results;

  const vnGoldData = useMemo(
    () => (pricesQuery.data ? goldMapper.toVNGoldData(pricesQuery.data) : null),
    [pricesQuery.data],
  );

  const worldGoldPrice = useMemo(
    () => (pricesQuery.data ? goldMapper.toWorldGoldFromResponse(pricesQuery.data) : null),
    [pricesQuery.data],
  );

  const chartData = useMemo(
    () => (chartQuery.data ? goldMapper.toChartData(chartQuery.data) : []),
    [chartQuery.data],
  );

  const loading = useMemo(
    () => pricesQuery.isLoading || chartQuery.isLoading,
    [pricesQuery.isLoading, chartQuery.isLoading],
  );

  return useMemo(
    () => ({
      vnGoldData,
      worldGoldPrice,
      chartData,
      loading,
      lastPolled: pricesQuery.dataUpdatedAt ?? 0,
      refetch: () => { pricesQuery.refetch(); chartQuery.refetch(); },
    }),
    [vnGoldData, worldGoldPrice, chartData, loading, pricesQuery.dataUpdatedAt, pricesQuery.refetch, chartQuery.refetch],
  );
};
