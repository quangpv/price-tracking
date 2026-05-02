import React from 'react';
import { useTranslation } from 'react-i18next';
import { useCoin } from './hooks/useCoin';
import { LineChartComponent } from '../../shared/components/LineChart/LineChart';
import { StatCardSkeleton, ChartSkeleton } from '../../components/Shimmer/Shimmer';
import { StatCard } from '../../components/StatCard/StatCard';
import { Card } from '../../components/Card/Card';
import { formatPrice, formatTimestamp } from '../../shared/utils/formatPrice';

interface CoinPageProps {
  currency: 'usd' | 'vnd';
}

export const CoinPage: React.FC<CoinPageProps> = ({ currency }) => {
  const { t } = useTranslation();
  const { currentPrice, chartData, loading, error } = useCoin(currency);

  if (loading && !currentPrice) {
    return (
      <div className="space-y-8 animate-pulse">
        <StatCardSkeleton />
        <ChartSkeleton />
      </div>
    );
  }

  return (
    <div className="space-y-6 md:space-y-8">
      {/* Page Header */}
      <div className="mb-6 md:mb-8 animate-fade-in">
        <h1 className="text-xl md:text-2xl font-bold text-gray-900 dark:text-gray-100 tracking-tight">{t('coinPage.title')}</h1>
        <p className="text-sm text-gray-500 dark:text-gray-400 mt-1">{t('coinPage.subtitle')}</p>
      </div>

      {/* Error Message */}
      {error && (
        <div className="bg-yellow-50 border border-yellow-200 rounded-xl p-4 animate-fade-in">
          <p className="text-sm text-yellow-800 dark:text-yellow-200">{error || t('coinPage.errorChartUnavailable')}</p>
        </div>
      )}

      {/* Stats Grid */}
      {currentPrice && (
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 animate-fade-in">
           <StatCard
             label={`${currentPrice.name} (${currentPrice.symbol.toUpperCase()})`}
             value={formatPrice(currentPrice.currentPrice, currency)}
             change={currentPrice.priceChange24h}
             sublabel={`${t('coinPage.marketCap')}${formatPrice(currentPrice.marketCap, currency)}`}
           />
        </div>
      )}

      {/* Chart Section */}
      <Card>
        <div className="mb-6">
           <h3 className="text-lg font-semibold text-gray-900 dark:text-gray-100">{t('coinPage.chart.title')}</h3>
          <p className="text-sm text-gray-500 dark:text-gray-400 mt-1">{t('coinPage.chart.subtitle')}</p>
        </div>
        {error ? (
          <div className="h-96 flex items-center justify-center">
             <p className="text-gray-500 dark:text-gray-400">{t('coinPage.errorChartUnavailable')}</p>
          </div>
        ) : (
          <div className="h-96 animate-fade-in">
            <LineChartComponent data={chartData} currency={currency} />
          </div>
        )}
      </Card>

      {/* Last Updated */}
      {currentPrice && (
        <p className="text-xs text-gray-400 text-right">
           <p className="text-xs text-gray-400 dark:text-gray-500 text-right">
            {t('coinPage.lastUpdated')}{formatTimestamp(Date.now() / 1000)}
          </p>
        </p>
      )}
    </div>
  );
};
