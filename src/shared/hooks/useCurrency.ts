import { useState, useMemo, useCallback } from 'react';
import { useQuery } from '@tanstack/react-query';
import { exchangeRateRepository } from '../../data/repositories/exchangeRateRepository';

export const useCurrency = () => {
  const [currency, setCurrency] = useState<'usd' | 'vnd'>('usd');
  const { data: exchangeRate = 24850 } = useQuery({
    queryKey: ['exchangeRate'],
    queryFn: exchangeRateRepository.getExchangeRate,
    staleTime: 1000 * 60 * 30,
  });

  const convertToVND = useCallback(
    (usdPrice: number): number => usdPrice * exchangeRate,
    [exchangeRate],
  );

  return useMemo(
    () => ({ currency, setCurrency, exchangeRate, convertToVND }),
    [currency, exchangeRate, convertToVND],
  );
};
