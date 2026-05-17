import React from 'react';
import type { ICalcResult } from '../types';
import { computeCalcResult } from '../hooks/useEvnState';

interface CalculatorTabProps {
  calcKwh: number;
  calcVat: number;
  onCalcKwhChange: (kwh: number) => void;
  onCalcVatChange: (vat: number) => void;
}

const formatCurrency = (amount: number) => {
  return new Intl.NumberFormat('vi-VN', { style: 'currency', currency: 'VND' }).format(amount).replace('₫', 'đ');
};

const TIER_COLORS_BG = [
  'bg-emerald-400',
  'bg-emerald-500',
  'bg-sky-400',
  'bg-blue-500',
  'bg-orange-500',
  'bg-rose-500',
];

const TIER_COLORS_CARD = [
  'border-emerald-200 dark:border-emerald-700 bg-emerald-50/30 dark:bg-emerald-900/20',
  'border-emerald-300 dark:border-emerald-600 bg-emerald-100/20 dark:bg-emerald-900/30',
  'border-sky-200 dark:border-sky-700 bg-sky-50/30 dark:bg-sky-900/20',
  'border-blue-200 dark:border-blue-700 bg-blue-50/30 dark:bg-blue-900/20',
  'border-orange-200 dark:border-orange-700 bg-orange-50/30 dark:bg-orange-900/20',
  'border-rose-200 dark:border-rose-700 bg-rose-50/30 dark:bg-rose-900/20',
];

export const CalculatorTab: React.FC<CalculatorTabProps> = ({
  calcKwh,
  calcVat,
  onCalcKwhChange,
  onCalcVatChange,
}) => {
  const calcResult = React.useMemo<ICalcResult>(
    () => computeCalcResult(calcKwh, calcVat),
    [calcKwh, calcVat],
  );

  return (
    <div className="space-y-6">
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        <div className="bg-white dark:bg-slate-800 rounded-2xl border border-slate-100 dark:border-slate-700 p-6 shadow-[0_8px_30px_rgb(0,0,0,0.03)] dark:shadow-none h-fit space-y-6">
          <h3 className="font-extrabold text-[#0c4a6e] dark:text-sky-100 text-base border-b border-slate-50 dark:border-slate-700 pb-3 flex items-center">
            <span className="w-1.5 h-3 bg-[#ea580c] rounded-full mr-2" />
            Ước tính giá điện
          </h3>

          <div>
            <label className="block text-[9px] font-bold text-slate-400 dark:text-slate-500 uppercase tracking-widest mb-2">
              Sản lượng tiêu thụ (kWh)
            </label>
            <div className="relative">
              <input
                type="number"
                value={calcKwh}
                onChange={(e) => onCalcKwhChange(parseFloat(e.target.value) || 0)}
                className="w-full border border-slate-200 dark:border-slate-600 rounded-xl px-4 py-3 text-base font-extrabold text-[#0f172a] dark:text-white focus:ring-2 focus:ring-[#0284c7] outline-none bg-slate-50/50 dark:bg-slate-700/50"
              />
              <span className="absolute right-4 top-1/2 -translate-y-1/2 text-xs font-bold text-slate-400 dark:text-slate-500">
                kWh
              </span>
            </div>
          </div>

          <div>
            <label className="block text-[9px] font-bold text-slate-400 dark:text-slate-500 uppercase tracking-widest mb-2">
              Thuế suất VAT
            </label>
            <div className="grid grid-cols-3 gap-2">
              {[0, 8, 10].map((vat) => (
                <button
                  key={vat}
                  onClick={() => onCalcVatChange(vat)}
                  className={`py-2.5 px-3 rounded-xl text-xs font-bold transition-all border ${
                    calcVat === vat
                      ? 'border-[#0284c7] bg-blue-50 dark:bg-blue-900/30 text-[#0284c7] dark:text-sky-300'
                      : 'border-slate-200/80 dark:border-slate-600 hover:bg-slate-50 dark:hover:bg-slate-700 text-slate-600 dark:text-slate-400'
                  }`}
                >
                  {vat}%
                </button>
              ))}
            </div>
          </div>

          <div className="bg-slate-50/80 dark:bg-slate-700/80 p-5 rounded-2xl border border-slate-100 dark:border-slate-700">
            <h4 className="font-bold text-[9px] text-slate-400 dark:text-slate-500 uppercase tracking-widest mb-4">
              Tóm tắt tạm tính
            </h4>
            <div className="space-y-3 text-xs font-semibold text-slate-600 dark:text-slate-400">
              <div className="flex justify-between">
                <span className="text-slate-500 dark:text-slate-400">Giá gốc chưa VAT:</span>
                <span className="text-[#0c4a6e] dark:text-sky-100">{formatCurrency(calcResult.totalBeforeTax)}</span>
              </div>
              <div className="flex justify-between">
                <span className="text-slate-500 dark:text-slate-400">Tiền thuế VAT ({calcVat}%):</span>
                <span className="text-[#0c4a6e] dark:text-sky-100">{formatCurrency(calcResult.tax)}</span>
              </div>
              <hr className="border-slate-200/60 dark:border-slate-600 my-2" />
              <div className="flex justify-between items-baseline pt-1">
                <span className="text-[#0f172a] dark:text-white font-extrabold">TỔNG CỘNG:</span>
                <span className="font-black text-xl text-[#ea580c]">
                  {formatCurrency(calcResult.totalWithTax)}
                </span>
              </div>
            </div>
          </div>
        </div>

        <div className="lg:col-span-2 bg-white dark:bg-slate-800 rounded-2xl border border-slate-100 dark:border-slate-700 p-6 shadow-[0_8px_30px_rgb(0,0,0,0.03)] dark:shadow-none space-y-6">
          <div className="flex justify-between items-center">
            <div>
              <h3 className="font-extrabold text-[#0c4a6e] dark:text-sky-100 text-base">Phân Tích Đơn Giá Luỹ Tiến</h3>
              <p className="text-[10px] text-slate-400 dark:text-slate-500 font-semibold mt-1">
                Bảng giá điện sinh hoạt 6 bậc thang chính thức của EVN
              </p>
            </div>
            <span className="bg-orange-50 dark:bg-orange-900/30 text-[#ea580c] dark:text-orange-400 border border-orange-100 dark:border-orange-800 text-[10px] px-3 py-1.5 rounded-full font-bold">
              6 Bậc thang
            </span>
          </div>

          <div className="h-4 w-full bg-slate-100 dark:bg-slate-700 rounded-full flex overflow-hidden shadow-inner">
            {calcResult.breakdown.map((t, idx) => {
              if (t.widthPercent > 0) {
                return (
                  <div
                    key={idx}
                    className={`${TIER_COLORS_BG[idx]} h-full transition-all duration-300`}
                    style={{ width: `${t.widthPercent}%` }}
                    title={`Bậc ${t.tier}: ${t.consumedInThisTier.toFixed(1)} kWh`}
                  />
                );
              }
              return null;
            })}
            {calcKwh === 0 && <div className="bg-slate-200 dark:bg-slate-600 w-full h-full" />}
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 pt-2">
            {calcResult.breakdown.map((t, idx) => {
              const hasData = t.consumedInThisTier > 0;
              return (
                <div
                  key={idx}
                  className={`p-4 border rounded-xl flex justify-between items-center transition-all ${
                    hasData
                      ? `${TIER_COLORS_CARD[idx]} shadow-sm`
                      : 'border-slate-100 dark:border-slate-700 opacity-50'
                  }`}
                >
                  <div className="flex items-center space-x-3">
                    <span
                      className={`w-8 h-8 rounded-full ${TIER_COLORS_BG[idx]} text-white text-[11px] font-black flex items-center justify-center`}
                    >
                      {t.tier}
                    </span>
                    <div>
                      <h4 className="font-extrabold text-xs text-[#0f172a] dark:text-white">BẬC {t.tier}</h4>
                      <p className="text-[9px] text-slate-400 dark:text-slate-500 font-bold uppercase tracking-wider">
                        {t.range}
                      </p>
                    </div>
                  </div>
                  <div className="text-right">
                    <p
                      className={`font-extrabold text-sm ${hasData ? 'text-[#0284c7] dark:text-sky-300' : 'text-slate-400 dark:text-slate-500'}`}
                    >
                      {t.consumedInThisTier.toFixed(1)} <span className="text-[10px]">kWh</span>
                    </p>
                    <span className="text-[10px] text-slate-500 dark:text-slate-400 font-bold block mt-0.5">
                      {formatCurrency(t.price)}/k
                    </span>
                  </div>
                </div>
              );
            })}
          </div>
        </div>
      </div>
    </div>
  );
};
