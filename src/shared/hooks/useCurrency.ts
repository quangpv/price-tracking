import { useState, useEffect, useCallback } from 'react';
import { exchangeRateRepository } from '../../data/repositories/exchangeRateRepository';

export const useCurrency = () => {
  const [currency, setCurrency] = useState<'usd' | 'vnd'>('usd');
  const [exchangeRate, setExchangeRate] = useState<number>(24850);
  const [rateLoading, setRateLoading] = useState(false);

  const fetchRate = useCallback(async () => {
    setRateLoading(true);
    try {
      const rate = await exchangeRateRepository.getExchangeRate();
      setExchangeRate(rate);
    } catch (error) {
      console.error('Failed to fetch exchange rate:', error);
    } finally {
      setRateLoading(false);
    }
  }, []);

  useEffect(() => {
    fetchRate();
  }, [fetchRate]);

  const convertToVND = (usdPrice: number): number => {
    return usdPrice * exchangeRate;
  };

  return {
    currency,
    setCurrency,
    exchangeRate,
    convertToVND,
    rateLoading,
  };
};
