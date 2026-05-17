import type {BitcoinChartDTO, BitcoinDTO} from '../../data/types';
import type {ICoinChartData, ICoinPrice} from './types';
import {formatter} from "../../shared/utils/formatter.ts";

export const coinMapper = {
    toUIPrice(dto: BitcoinDTO, currency: 'usd' | 'vnd'): ICoinPrice {
        return {
            id: dto.id,
            symbol: dto.symbol,
            name: dto.name,
            currentPrice: formatter.price(dto.current_price, currency),
            marketCap: formatter.price(dto.market_cap, currency),
            priceChange24h: dto.price_change_percentage_24h,
            currency,
            updatedAt: formatter.timestamp(Date.now() / 1000)
        };
    },

    toChartData(dto: BitcoinChartDTO): ICoinChartData[] {
        return dto.prices.map(([timestamp, price]) => ({
            date: formatter.localDate(timestamp),
            price,
        }));
    },
};
