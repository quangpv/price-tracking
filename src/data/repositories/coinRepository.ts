import axios from 'axios';
import type {BitcoinDTO, BitcoinChartDTO} from '../types';

export const coinRepository = {
    async getYearlyChart(currency: 'usd' | 'vnd', from: number, to: number): Promise<BitcoinChartDTO> {
        try {
            // Binance Public API - free, no API key required
            // Convert seconds to milliseconds for Binance
            const {data} = await axios.get('/api/binance/api/v3/klines', {
                params: {
                    symbol: 'BTCUSDT',
                    interval: '1d',
                    startTime: from * 1000,
                    endTime: to * 1000,
                },
            });

            // Transform Binance klines response [openTime, open, high, low, close, volume, closeTime, ...]
            const prices = data.map((kline: any) => [
                kline[0], // open time in ms
                currency === 'vnd' ? parseFloat(kline[4]) * 24850 : parseFloat(kline[4]), // close price
            ]);

            const market_caps = data.map((kline: any) => [
                kline[0],
                0, // Binance klines don't include market cap
            ]);

            const total_volumes = data.map((kline: any) => [
                kline[0],
                parseFloat(kline[5]), // volume
            ]);

            return {prices, market_caps, total_volumes};
        } catch (error: any) {
            if (error.response?.status === 429) {
                throw new Error('API_LIMIT: Binance rate limit reached. Please try again later.', {cause: error});
            }
            throw error;
        }
    },

    async getCurrentPrice(currency: 'usd' | 'vnd'): Promise<BitcoinDTO> {
        try {
            const {data} = await axios.get('/api/binance/api/v3/ticker/24hr', {
                params: {symbol: 'BTCUSDT'},
            });

            const priceUsd = parseFloat(data.lastPrice);
            const currentPrice = currency === 'vnd' ? priceUsd * 24850 : priceUsd;
            const priceChangePercent = parseFloat(data.priceChangePercent);

            const result = {
                id: 'bitcoin',
                symbol: 'btc',
                name: 'Bitcoin',
                current_price: currentPrice,
                market_cap: 0, // Binance 24hr ticker doesn't include market cap
                price_change_percentage_24h: priceChangePercent,
            };
            return result;
        } catch (error: any) {
            if (error.response?.status === 429) {
                throw new Error('API_LIMIT: Binance rate limit reached. Please try again later.');
            }
            throw error;
        }
    },
};
