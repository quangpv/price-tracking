import React from 'react';
import { FileWarning, ShieldCheck, ReceiptText } from 'lucide-react';
import type { IDebtItem } from '../types';

interface DebtCheckTabProps {
  hasDebt: boolean;
  debtItems: IDebtItem[];
}

const formatCurrency = (amount: number) => {
  return new Intl.NumberFormat('vi-VN', { style: 'currency', currency: 'VND' }).format(amount).replace('₫', 'đ');
};

export const DebtCheckTab: React.FC<DebtCheckTabProps> = ({ hasDebt, debtItems }) => {
  return (
    <div className="space-y-6">
      <div className="max-w-2xl mx-auto bg-white dark:bg-slate-800 rounded-3xl border border-slate-100 dark:border-slate-700 shadow-[0_10px_40px_-10px_rgba(0,0,0,0.05)] dark:shadow-none p-10 text-center">
        <div
          className={`w-24 h-24 rounded-full mx-auto flex items-center justify-center mb-6 shadow-sm border ${
            hasDebt
              ? 'bg-rose-50 dark:bg-rose-900/30 border-rose-100 dark:border-rose-800 text-rose-500 dark:text-rose-400 animate-pulse'
              : 'bg-emerald-50 dark:bg-emerald-900/30 border-emerald-100 dark:border-emerald-800 text-emerald-600 dark:text-emerald-400'
          }`}
        >
          {hasDebt ? <FileWarning className="w-10 h-10" /> : <ShieldCheck className="w-10 h-10" />}
        </div>
        <h3
          className={`text-2xl font-extrabold mb-3 tracking-tight ${hasDebt ? 'text-rose-600 dark:text-rose-400' : 'text-[#0c4a6e] dark:text-sky-100'}`}
        >
          {hasDebt ? 'Tài khoản chưa hoàn thành hóa đơn' : 'Tuyệt Vời! Không Có Dư Nợ'}
        </h3>
        <p className="text-slate-400 dark:text-slate-500 text-xs font-medium max-w-md mx-auto mb-8 leading-relaxed">
          {hasDebt
            ? 'Hệ thống phát hiện hóa đơn quá hạn chưa thanh toán. Quý khách vui lòng đóng tiền đúng hạn để đảm bảo cung cấp dịch vụ điện năng không bị gián đoạn.'
            : 'Tất cả các hóa đơn tiền điện trước đó của quý khách đã hoàn tất thanh toán. Xin chân thành cảm ơn!'}
        </p>

        {hasDebt && debtItems.length > 0 && (
          <div className="border border-slate-100 dark:border-slate-700 rounded-2xl overflow-hidden bg-slate-50/50 dark:bg-slate-700/50 text-left">
            <div className="px-6 py-4 border-b border-slate-100 dark:border-slate-700 bg-slate-100/50 dark:bg-slate-700 font-bold text-xs text-[#0c4a6e] dark:text-sky-100 flex items-center">
              <ReceiptText className="w-4 h-4 mr-2" /> Chi tiết hóa đơn nợ
            </div>
            <div className="p-6 divide-y divide-slate-100 dark:divide-slate-700">
              {debtItems.map((item, idx) => (
                <div key={idx} className="py-3 flex justify-between items-center text-xs font-semibold">
                  <div>
                    <p className="font-extrabold text-[#0f172a] dark:text-white text-sm">
                      Kỳ {item.ky} - Tháng {item.thang}/{item.nam}
                    </p>
                    <span className="text-[10px] text-slate-400 dark:text-slate-500 font-bold uppercase tracking-wider block mt-1">
                      Hạn đóng: {item.ngayGiao}
                    </span>
                  </div>
                  <span className="font-black text-rose-600 dark:text-rose-400 text-lg">
                    {formatCurrency(parseFloat(item.tien || '0'))}
                  </span>
                </div>
              ))}
            </div>
          </div>
        )}
      </div>
    </div>
  );
};
