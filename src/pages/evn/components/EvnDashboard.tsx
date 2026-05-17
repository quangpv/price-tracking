import React, { useState } from 'react';
import {
  Activity, ReceiptText, Calculator, CreditCard, Calendar, History,
  AlertCircle, LogOut, Zap,
} from 'lucide-react';
import type { IDashboardStats, EvnTabType, IDailyData, IInvoice, IDebtItem } from '../types';
import { DailyConsumptionTab } from './DailyConsumptionTab';
import { BillingHistoryTab } from './BillingHistoryTab';
import { DebtCheckTab } from './DebtCheckTab';
import { CalculatorTab } from './CalculatorTab';

interface EvnDashboardProps {
  stats: IDashboardStats;
  dailyData: IDailyData[];
  dailyTitle: string;
  soNgay: number;
  invoices: IInvoice[];
  billingTotal: {
    sanLuongFormat: string;
    soTien: number;
    tienThue: number;
    tongTien: number;
  } | null;
  debtItems: IDebtItem[];
  hasDebt: boolean;
  calcKwh: number;
  calcVat: number;
  onCalcKwhChange: (kwh: number) => void;
  onCalcVatChange: (vat: number) => void;
  onLogout: () => void;
  loading: boolean;
  onRefreshDaily: () => void;
  fromDate: string;
  toDate: string;
  onFromDateChange: (date: string) => void;
  onToDateChange: (date: string) => void;
}

const formatCurrency = (amount: number) => {
  return new Intl.NumberFormat('vi-VN', { style: 'currency', currency: 'VND' }).format(amount).replace('₫', 'đ');
};

const TABS: { id: EvnTabType; icon: React.ReactNode; label: string }[] = [
  { id: 'daily', icon: <Calendar className="w-4 h-4" />, label: 'Sản lượng ngày' },
  { id: 'billing', icon: <History className="w-4 h-4" />, label: 'Kỳ hóa đơn' },
  { id: 'debt', icon: <AlertCircle className="w-4 h-4" />, label: 'Kiểm tra nợ' },
  { id: 'calculator', icon: <Calculator className="w-4 h-4" />, label: 'Ước tính giá' },
];

export const EvnDashboard: React.FC<EvnDashboardProps> = ({
  stats,
  dailyData,
  dailyTitle,
  soNgay,
  invoices,
  billingTotal,
  debtItems,
  hasDebt,
  calcKwh,
  calcVat,
  onCalcKwhChange,
  onCalcVatChange,
  onLogout,
  loading,
  onRefreshDaily,
  fromDate,
  toDate,
  onFromDateChange,
  onToDateChange,
}) => {
  const [activeTab, setActiveTab] = useState<EvnTabType>('daily');

  return (
    <div className="min-h-screen bg-[radial-gradient(circle_at_10%_20%,_rgb(241,245,249)_0%,_rgb(248,250,252)_90%)] dark:bg-slate-900 dark:bg-none flex flex-col font-sans text-slate-900 dark:text-slate-100 antialiased">
      <header className="bg-white/80 dark:bg-slate-800/80 backdrop-blur-md border-b border-slate-100 dark:border-slate-700 sticky top-0 z-40 shadow-sm">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between h-16 items-center">
            <div className="flex items-center space-x-3">
              <div className="bg-gradient-to-br from-[#0284c7] to-[#0369a1] text-white p-2.5 rounded-xl shadow-[0_5px_15px_rgba(2,132,199,0.3)] flex items-center justify-center">
                <Zap className="w-5 h-5 text-yellow-300 animate-pulse fill-yellow-300" />
              </div>
              <div>
                <h1 className="text-base font-extrabold text-[#0c4a6e] dark:text-sky-100 tracking-tight leading-none flex items-center">
                  EVN<span className="text-[#ea580c]">HCMC</span>
                </h1>
                <span className="text-[10px] text-slate-400 dark:text-slate-500 font-semibold tracking-wider uppercase block mt-0.5">
                  Bảng Điều Khiển
                </span>
              </div>
            </div>
            <div className="flex items-center space-x-3">
              <div className="w-8 h-8 rounded-full bg-blue-50 dark:bg-slate-700 border border-blue-100 dark:border-slate-600 text-[#0284c7] dark:text-sky-300 flex items-center justify-center font-bold text-sm">
                KH
              </div>
              <div className="hidden sm:block text-left mr-2">
                <p className="text-xs font-extrabold text-[#0c4a6e] dark:text-sky-100 leading-tight">{stats.customerId}</p>
                <span className="text-[9px] text-emerald-600 dark:text-emerald-400 font-bold flex items-center mt-0.5">
                  <span className="w-1.5 h-1.5 rounded-full bg-emerald-500 dark:bg-emerald-400 inline-block mr-1 animate-ping" />
                  Kết nối an toàn
                </span>
              </div>
              <button
                onClick={onLogout}
                className="p-2 text-slate-400 dark:text-slate-500 hover:text-rose-500 dark:hover:text-rose-400 rounded-xl hover:bg-rose-50/50 dark:hover:bg-rose-900/20 transition-all"
              >
                <LogOut className="w-4 h-4" />
              </button>
            </div>
          </div>
        </div>
      </header>

      <main className="flex-grow max-w-7xl w-full mx-auto px-4 sm:px-6 lg:px-8 py-8 space-y-6">
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-5">
          <div className="bg-white dark:bg-slate-800 rounded-2xl border border-slate-100 dark:border-slate-700 p-6 shadow-[0_8px_30px_rgb(0,0,0,0.03)] dark:shadow-none hover:-translate-y-0.5 transition-all duration-300 relative overflow-hidden group">
            <div className="absolute -right-3 -bottom-3 text-slate-100/50 dark:text-slate-600/50 text-7xl font-black select-none group-hover:scale-105 transition-transform duration-300">
              kWh
            </div>
            <div className="flex justify-between items-start mb-4">
              <span className="text-[10px] font-extrabold text-slate-400 dark:text-slate-500 uppercase tracking-widest">
                Tiêu thụ tháng này
              </span>
              <span className="bg-blue-50 dark:bg-blue-900/30 border border-blue-100 dark:border-blue-800 text-[#0284c7] dark:text-sky-300 p-2.5 rounded-xl">
                <Activity className="w-4 h-4" />
              </span>
            </div>
            <h2 className="text-3xl font-black text-[#0f172a] dark:text-white mb-1">
              {stats.monthConsumption}{' '}
              <span className="text-xs font-normal text-slate-400 dark:text-slate-500">kWh</span>
            </h2>
            <p className="text-[10px] text-slate-400 dark:text-slate-500 font-semibold">{stats.monthConsumptionLabel}</p>
          </div>

          <div className="bg-white dark:bg-slate-800 rounded-2xl border border-slate-100 dark:border-slate-700 p-6 shadow-[0_8px_30px_rgb(0,0,0,0.03)] dark:shadow-none hover:-translate-y-0.5 transition-all duration-300 relative overflow-hidden group">
            <div className="absolute -right-3 -bottom-3 text-slate-100/50 dark:text-slate-600/50 text-7xl font-black select-none group-hover:scale-105 transition-transform duration-300">
              VND
            </div>
            <div className="flex justify-between items-start mb-4">
              <span className="text-[10px] font-extrabold text-slate-400 dark:text-slate-500 uppercase tracking-widest">
                Hóa đơn gần nhất
              </span>
              <span className="bg-emerald-50 dark:bg-emerald-900/30 border border-emerald-100 dark:border-emerald-800 text-emerald-600 dark:text-emerald-400 p-2.5 rounded-xl">
                <ReceiptText className="w-4 h-4" />
              </span>
            </div>
            <h2 className="text-2xl font-black text-[#0f172a] dark:text-white mb-1">
              {formatCurrency(stats.lastBillAmount)}
            </h2>
            <p className="text-[10px] text-slate-400 dark:text-slate-500 font-semibold">
              Kỳ hóa đơn cũ: {stats.lastBillLabel}
            </p>
          </div>

          <div className="bg-white dark:bg-slate-800 rounded-2xl border border-slate-100 dark:border-slate-700 p-6 shadow-[0_8px_30px_rgb(0,0,0,0.03)] dark:shadow-none hover:-translate-y-0.5 transition-all duration-300 relative overflow-hidden group">
            <div className="absolute -right-3 -bottom-3 text-slate-100/50 dark:text-slate-600/50 text-7xl font-black select-none group-hover:scale-105 transition-transform duration-300">
              EST
            </div>
            <div className="flex justify-between items-start mb-4">
              <span className="text-[10px] font-extrabold text-slate-400 dark:text-slate-500 uppercase tracking-widest">
                Ước tính Tiền Điện
              </span>
              <span className="bg-orange-50 dark:bg-orange-900/30 border border-orange-100 dark:border-orange-800 text-[#ea580c] dark:text-orange-400 p-2.5 rounded-xl">
                <Calculator className="w-4 h-4" />
              </span>
            </div>
            <h2 className="text-2xl font-black text-[#ea580c] mb-1">{formatCurrency(stats.estimatedBill)}</h2>
            <p className="text-[10px] text-slate-400 dark:text-slate-500 font-semibold">Cộng dồn biểu luỹ tiến hiện tại</p>
          </div>

          <div className="bg-white dark:bg-slate-800 rounded-2xl border border-slate-100 dark:border-slate-700 p-6 shadow-[0_8px_30px_rgb(0,0,0,0.03)] dark:shadow-none hover:-translate-y-0.5 transition-all duration-300 relative overflow-hidden group">
            <div className="absolute -right-3 -bottom-3 text-slate-100/50 dark:text-slate-600/50 text-7xl font-black select-none group-hover:scale-105 transition-transform duration-300">
              DEBT
            </div>
            <div className="flex justify-between items-start mb-4">
              <span className="text-[10px] font-extrabold text-slate-400 dark:text-slate-500 uppercase tracking-widest">
                Trạng thái nợ
              </span>
              <span
                className={`${
                  hasDebt
                    ? 'bg-rose-50 dark:bg-rose-900/30 border-rose-100 dark:border-rose-800 text-rose-500 dark:text-rose-400'
                    : 'bg-emerald-50 dark:bg-emerald-900/30 border-emerald-100 dark:border-emerald-800 text-emerald-600 dark:text-emerald-400'
                } border p-2.5 rounded-xl`}
              >
                <CreditCard className="w-4 h-4" />
              </span>
            </div>
            <h2
              className={`text-base font-extrabold mb-1 ${hasDebt ? 'text-rose-600 dark:text-rose-400' : 'text-emerald-600 dark:text-emerald-400'}`}
            >
              {hasDebt ? 'Còn dư nợ' : 'Đã hoàn thành'}
            </h2>
            <p className="text-[10px] text-slate-400 dark:text-slate-500 font-semibold">
              Mã KH: {stats.customerId.substring(0, 6)}...
            </p>
          </div>
        </div>

        <div className="bg-slate-100/80 dark:bg-slate-800/80 p-1.5 rounded-2xl flex flex-wrap gap-1 w-fit border border-slate-200/50 dark:border-slate-700">
          {TABS.map((tab) => (
            <button
              key={tab.id}
              onClick={() => setActiveTab(tab.id)}
              className={`px-5 py-2.5 rounded-xl font-bold text-xs flex items-center space-x-2 transition-all duration-200 ${
                activeTab === tab.id
                  ? 'bg-white dark:bg-slate-700 text-[#0c4a6e] dark:text-sky-100 shadow-sm border border-slate-200/50 dark:border-slate-600'
                  : 'text-slate-500 dark:text-slate-400 hover:text-[#0c4a6e] dark:hover:text-sky-100'
              }`}
            >
              <span className={activeTab === tab.id ? 'text-[#0284c7] dark:text-sky-300' : ''}>{tab.icon}</span>
              <span>{tab.label}</span>
            </button>
          ))}
        </div>

        {activeTab === 'daily' && (
          <DailyConsumptionTab
            dailyData={dailyData}
            dailyTitle={dailyTitle}
            soNgay={soNgay}
            fromDate={fromDate}
            toDate={toDate}
            onFromDateChange={onFromDateChange}
            onToDateChange={onToDateChange}
            onRefresh={onRefreshDaily}
            loading={loading}
          />
        )}
        {activeTab === 'billing' && (
          <BillingHistoryTab invoices={invoices} billingTotal={billingTotal} />
        )}
        {activeTab === 'debt' && (
          <DebtCheckTab hasDebt={hasDebt} debtItems={debtItems} />
        )}
        {activeTab === 'calculator' && (
          <CalculatorTab
            calcKwh={calcKwh}
            calcVat={calcVat}
            onCalcKwhChange={onCalcKwhChange}
            onCalcVatChange={onCalcVatChange}
          />
        )}
      </main>
    </div>
  );
};
