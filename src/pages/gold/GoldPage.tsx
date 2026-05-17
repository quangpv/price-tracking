import React from 'react';
import {useTranslation} from 'react-i18next';
import {useGoldState} from './hooks/useGoldState.ts';
import {LineChartComponent} from '../../shared/components/LineChart/LineChart';
import {VNGoldTable} from '../../shared/components/VNGoldTable/VNGoldTable';
import {ChartSkeleton, TableSkeleton} from '../../shared/components/Shimmer/Shimmer';
import {Card} from '../../shared/components/Card/Card';
import {formatter} from '../../shared/utils/formatter';
import type {Currency} from "../../shared/types/Currency.ts";

interface GoldPageProps {
    currency: Currency;
}

export const GoldPage: React.FC<GoldPageProps> = ({currency}) => {
    const {t} = useTranslation();
    const {
        vnGoldData, worldGoldPrice, chartData, loading, lastPolled
    } = useGoldState(currency);

    if (loading && !worldGoldPrice) {
        return (
            <div className="space-y-8 animate-pulse">
                <ChartSkeleton/>
                {currency === 'vnd' && <TableSkeleton/>}
            </div>
        );
    }

    return (
        <div className="space-y-6 md:space-y-8 max-w-full overflow-x-hidden">
            {/* Page Header */}
            <div className="mb-6 md:mb-8 animate-fade-in">
                <h1 className="text-xl md:text-2xl font-bold text-gray-900 dark:text-gray-100 tracking-tight">{t('goldPage.title')}</h1>
                <p className="text-sm text-gray-500 dark:text-gray-400 mt-1">{t('goldPage.subtitle')}</p>
            </div>

            {/* World Gold Section */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4 md:gap-6">
                <Card>
                    <div className="space-y-3">
                        <h3 className="text-lg font-semibold text-gray-900 dark:text-gray-100">{t('goldPage.worldGold')}</h3>
                        {worldGoldPrice ? (
                            <div className="space-y-3 animate-fade-in">
                                <p className="text-3xl font-bold text-gray-900 dark:text-gray-100 tracking-tight">
                                    {formatter.price(worldGoldPrice.currentPrice, 'usd')}/oz
                                </p>
                                {currency === 'vnd' && (
                                    <p className="text-sm text-gray-500 dark:text-gray-400">
                                        ≈ {formatter.price(worldGoldPrice.currentPrice * 24850, 'vnd')}/oz
                                    </p>
                                )}
                                {lastPolled > 0 && (
                                    <p className="text-xs text-gray-400 dark:text-gray-500">
                                        {t('goldPage.lastUpdated')}{formatter.timestamp(lastPolled / 1000)}
                                    </p>
                                )}
                            </div>
                        ) : null}
                    </div>
                </Card>
            </div>

            {/* World Gold Chart */}
            <Card>
                <div className="mb-6">
                    <h3 className="text-lg font-semibold text-gray-900 dark:text-gray-100">{t('goldPage.chart.title')}</h3>
                    <p className="text-sm text-gray-500 mt-1">{t('goldPage.chart.subtitle')}</p>
                </div>
                <div className="h-72 md:h-96 overflow-x-auto animate-fade-in">
                    <div className="min-w-[300px] md:w-full">
                        <LineChartComponent data={chartData} currency={currency}/>
                    </div>
                </div>
            </Card>

            {/* VN Gold Table */}
            {vnGoldData && (
                <Card className="overflow-hidden">
                    <div
                        className="flex flex-col sm:flex-row justify-between items-start sm:items-center mb-4 md:mb-6 gap-2">
                        <div>
                            <h3 className="text-lg font-semibold text-gray-900 dark:text-gray-100">{t('goldPage.vnGoldPrices.title')}</h3>
                            <p className="text-sm text-gray-500 dark:text-gray-400 mt-1">{t('goldPage.vnGoldPrices.subtitle')}</p>
                        </div>
                        <span className="text-xs text-gray-400 dark:text-gray-500 whitespace-nowrap">
              {t('goldPage.lastUpdated')}{vnGoldData.lastUpdated}
            </span>
                    </div>
                    <VNGoldTable prices={vnGoldData.prices} loading={loading}/>
                </Card>
            )}
        </div>
    );
};
