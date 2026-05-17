import React from 'react';
import { useTranslation } from 'react-i18next';
import type { IVNGoldPrice } from '../../../pages/gold/types';
import { formatter } from '../../../shared/utils/formatter';
import { Shimmer } from '../Shimmer/Shimmer';

interface VNGoldTableProps {
  prices: IVNGoldPrice[];
  loading: boolean;
}

export const VNGoldTable: React.FC<VNGoldTableProps> = ({ prices, loading }) => {
  const { t } = useTranslation();
  if (loading) {
    return <Shimmer className="h-48 w-full" />;
  }

  if (prices.length === 0) {
    return <div className="text-center py-8 text-gray-400">{t('vnGoldTable.noData')}</div>;
  }

  return (
    <div className="rounded-xl border border-gray-100 dark:border-slate-700 overflow-hidden">
      {/* Mobile scroll hint */}
        <div className="md:hidden px-4 py-2 bg-gray-50/50 dark:bg-slate-800/50 text-xs text-gray-400 dark:text-gray-500 flex items-center gap-1">
        <span>←</span>
        <span>{t('vnGoldTable.swipeHint')}</span>
        <span>→</span>
      </div>
      <div className="overflow-x-auto">
        <table className="w-full min-w-[480px]">
          <thead>
            <tr className="bg-gray-50/80 dark:bg-slate-800/80 backdrop-blur-sm">
              <th className="text-left py-3.5 px-4 text-xs font-semibold text-gray-500 uppercase tracking-wider">{t('vnGoldTable.headers.type')}</th>
              <th className="text-right py-3.5 px-4 text-xs font-semibold text-gray-500 uppercase tracking-wider">{t('vnGoldTable.headers.buy')}</th>
              <th className="text-right py-3.5 px-4 text-xs font-semibold text-gray-500 uppercase tracking-wider">{t('vnGoldTable.headers.sell')}</th>
              <th className="text-right py-3.5 px-4 text-xs font-semibold text-gray-500 uppercase tracking-wider">{t('vnGoldTable.headers.change')}</th>
            </tr>
          </thead>
          <tbody>
         {prices.map((gold, index) => (
          <tr
            key={gold.typeCode}
            className={`border-t border-gray-50 dark:border-slate-700 transition-colors duration-150 ${
              index % 2 === 0 ? 'bg-white dark:bg-slate-800' : 'bg-gray-50/30 dark:bg-slate-800/50'
            } hover:bg-primary-50/30 dark:hover:bg-slate-700/50`}
              >
                 <td className="py-3.5 px-4">
                  <div className="font-medium text-gray-900 dark:text-gray-100">{gold.typeName}</div>
                  <div className="text-xs text-gray-400 dark:text-gray-500">{gold.typeCode}</div>
                </td>
                <td className="py-3.5 px-4 text-right font-mono text-gray-700 dark:text-gray-200 font-medium">
                  {formatter.price(gold.buy, 'vnd', true)}
                </td>
                <td className="py-3.5 px-4 text-right font-mono text-gray-700 dark:text-gray-200 font-medium">
                  {formatter.price(gold.sell, 'vnd', true)}
                </td>
                <td className={`py-3.5 px-4 text-right font-semibold text-sm ${
                  gold.changeBuy >= 0 ? 'text-success' : 'text-danger'
                }`}>
                  <span className="inline-flex items-center gap-1">
                    {gold.changeBuy >= 0 ? '↑' : '↓'}
                    {formatter.percent(gold.changeBuy / (gold.buy - gold.changeBuy) * 100)}
                  </span>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
};
