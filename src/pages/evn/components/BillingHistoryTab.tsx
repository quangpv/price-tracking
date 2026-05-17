import React, { useMemo } from 'react';
import {
  ComposedChart, Bar, Line, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer,
} from 'recharts';
import { CheckCircle2, AlertTriangle } from 'lucide-react';
import type { IInvoice } from '../types';

interface BillingHistoryTabProps {
  invoices: IInvoice[];
  billingTotal: {
    sanLuongFormat: string;
    soTien: number;
    tienThue: number;
    tongTien: number;
  } | null;
}

const formatCurrency = (amount: number) => {
  return new Intl.NumberFormat('vi-VN', { style: 'currency', currency: 'VND' }).format(amount).replace('₫', 'đ');
};

const chartColors = {
  grid: '#f1f5f9',
  gridDark: '#1e293b',
  tick: '#94a3b8',
  tickDark: '#64748b',
  bar: '#0284c7',
  barDark: '#38bdf8',
  line: '#ea580c',
  lineDark: '#fb923c',
  tooltipBg: 'white',
  tooltipBgDark: '#1e293b',
  tooltipShadow: '0 10px 30px rgba(0,0,0,0.1)',
  tooltipShadowDark: '0 10px 30px rgba(0,0,0,0.3)',
};

export const BillingHistoryTab: React.FC<BillingHistoryTabProps> = ({ invoices, billingTotal }) => {
  const dark = useMemo(
    () => typeof window !== 'undefined' && document.documentElement.classList.contains('dark'),
    [],
  );
  const colors = useMemo(
    () => (dark ? { ...chartColors, grid: chartColors.gridDark, tick: chartColors.tickDark, bar: chartColors.barDark, line: chartColors.lineDark, tooltipBg: chartColors.tooltipBgDark, tooltipShadow: chartColors.tooltipShadowDark } : chartColors),
    [dark],
  );

  const chartData = invoices.map((inv) => ({
    NAME: inv.name,
    SAN_LUONG: parseFloat(inv.sanLuong),
    TONG_TIEN: parseFloat(inv.tongTien),
  }));

  return (
    <div className="space-y-6">
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        <div className="bg-white dark:bg-slate-800 rounded-2xl border border-slate-100 dark:border-slate-700 p-6 shadow-[0_8px_30px_rgb(0,0,0,0.03)] dark:shadow-none h-fit">
          <h3 className="font-extrabold text-[#0c4a6e] dark:text-sky-100 text-base mb-4 flex items-center">
            <span className="w-1.5 h-3 bg-[#0284c7] rounded-full mr-2" />
            Tổng quan Lịch sử
          </h3>
          {billingTotal && (
            <div className="space-y-4">
              <div className="flex justify-between items-center py-2.5 border-b border-slate-100 dark:border-slate-700">
                <span className="text-xs text-slate-400 dark:text-slate-500 font-medium">Tổng sản lượng lũy tích</span>
                <span className="text-xs font-bold text-[#0c4a6e] dark:text-sky-100">{billingTotal.sanLuongFormat} kWh</span>
              </div>
              <div className="flex justify-between items-center py-2.5 border-b border-slate-100 dark:border-slate-700">
                <span className="text-xs text-slate-400 dark:text-slate-500 font-medium">Tổng tiền chưa thuế</span>
                <span className="text-xs font-bold text-[#0c4a6e] dark:text-sky-100">{formatCurrency(billingTotal.soTien)}</span>
              </div>
              <div className="flex justify-between items-center py-2.5 border-b border-slate-100 dark:border-slate-700">
                <span className="text-xs text-slate-400 dark:text-slate-500 font-medium">Tổng thuế VAT</span>
                <span className="text-xs font-bold text-[#0c4a6e] dark:text-sky-100">{formatCurrency(billingTotal.tienThue)}</span>
              </div>
              <div className="flex justify-between items-center py-3">
                <span className="text-xs font-bold text-slate-700 dark:text-slate-300">TỔNG THANH TOÁN</span>
                <span className="font-extrabold text-base text-emerald-600 dark:text-emerald-400">{formatCurrency(billingTotal.tongTien)}</span>
              </div>
            </div>
          )}
        </div>

        <div className="lg:col-span-2 bg-white dark:bg-slate-800 rounded-2xl border border-slate-100 dark:border-slate-700 p-6 shadow-[0_8px_30px_rgb(0,0,0,0.03)] dark:shadow-none">
          <h3 className="font-extrabold text-[#0c4a6e] dark:text-sky-100 text-base mb-6">Biến động Hóa đơn các kỳ gần đây</h3>
          <div className="h-64 w-full">
            <ResponsiveContainer width="100%" height="100%">
              <ComposedChart data={chartData} margin={{ top: 10, right: 10, left: -20, bottom: 0 }}>
                <CartesianGrid strokeDasharray="3 3" vertical={false} stroke={colors.grid} />
                <XAxis
                  dataKey="NAME"
                  axisLine={false}
                  tickLine={false}
                  tick={{ fontSize: 10, fill: colors.tick, fontWeight: 600 }}
                  dy={10}
                />
                <YAxis
                  yAxisId="left"
                  axisLine={false}
                  tickLine={false}
                  tick={{ fontSize: 10, fill: colors.tick, fontWeight: 600 }}
                />
                <YAxis
                  yAxisId="right"
                  orientation="right"
                  axisLine={false}
                  tickLine={false}
                  tick={{ fontSize: 10, fill: colors.tick, fontWeight: 600 }}
                />
                <Tooltip
                  contentStyle={{
                    borderRadius: '12px',
                    border: 'none',
                    boxShadow: colors.tooltipShadow,
                    fontSize: '12px',
                    fontWeight: 'bold',
                    backgroundColor: colors.tooltipBg,
                    color: dark ? '#f1f5f9' : '#0f172a',
                  }}
                />
                <Bar
                  yAxisId="left"
                  dataKey="SAN_LUONG"
                  name="Sản lượng (kWh)"
                  fill={colors.bar}
                  radius={[4, 4, 0, 0]}
                  maxBarSize={40}
                />
                <Line
                  yAxisId="right"
                  type="monotone"
                  dataKey="TONG_TIEN"
                  name="Tổng tiền (VND)"
                  stroke={colors.line}
                  strokeWidth={3}
                  dot={{ r: 4, strokeWidth: 2, fill: dark ? '#1e293b' : '#fff', stroke: colors.line }}
                  activeDot={{ r: 6 }}
                />
              </ComposedChart>
            </ResponsiveContainer>
          </div>
        </div>
      </div>

      <div className="bg-white dark:bg-slate-800 rounded-2xl border border-slate-100 dark:border-slate-700 shadow-[0_8px_30px_rgb(0,0,0,0.03)] dark:shadow-none overflow-hidden">
        <div className="px-6 py-5 border-b border-slate-50 dark:border-slate-700">
          <h3 className="font-extrabold text-[#0c4a6e] dark:text-sky-100 text-sm">Danh sách Hóa đơn Chi tiết</h3>
        </div>
        <div className="overflow-x-auto">
          <table className="w-full text-left border-collapse min-w-[700px]">
            <thead>
              <tr className="bg-slate-50/50 dark:bg-slate-800/50 text-slate-400 dark:text-slate-500 text-[10px] font-bold uppercase tracking-wider border-b border-slate-100 dark:border-slate-700">
                <th className="px-6 py-4">Kỳ hóa đơn</th>
                <th className="px-6 py-4">Khoảng thời gian</th>
                <th className="px-6 py-4 text-right">Sản lượng (kWh)</th>
                <th className="px-6 py-4 text-right">Tiền trước thuế</th>
                <th className="px-6 py-4 text-right font-extrabold text-[#0f172a] dark:text-white">Tổng Tiền</th>
                <th className="px-6 py-4 text-center">Trạng Thái</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-100 dark:divide-slate-700 text-xs font-semibold text-slate-600 dark:text-slate-400">
              {invoices.map((inv, idx) => (
                <tr key={idx} className="hover:bg-slate-50/50 dark:hover:bg-slate-700/50 transition-all">
                  <td className="px-6 py-4 font-extrabold text-[#0f172a] dark:text-white">
                    Kỳ {inv.ky} - Tháng {inv.name}
                  </td>
                  <td className="px-6 py-4 text-[10px] text-slate-400 dark:text-slate-500">
                    {inv.ngayDky} đến {inv.ngayCky}
                  </td>
                  <td className="px-6 py-4 text-right font-bold text-slate-700 dark:text-slate-300">
                    {inv.sanLuong} kWh
                  </td>
                  <td className="px-6 py-4 text-right text-slate-500 dark:text-slate-400">
                    {formatCurrency(parseFloat(inv.soTien))}
                  </td>
                  <td className="px-6 py-4 text-right font-extrabold text-[#0f172a] dark:text-white">
                    {formatCurrency(parseFloat(inv.tongTien))}
                  </td>
                  <td className="px-6 py-4 text-center">
                    {inv.trangThai === 0 ? (
                      <span className="bg-emerald-50 dark:bg-emerald-900/30 text-emerald-700 dark:text-emerald-400 border border-emerald-100 dark:border-emerald-800 text-[10px] font-bold px-2 py-1 rounded-md inline-flex items-center">
                        <CheckCircle2 className="w-3 h-3 mr-1" /> Đã thu
                      </span>
                    ) : (
                      <span className="bg-rose-50 dark:bg-rose-900/30 text-rose-700 dark:text-rose-400 border border-rose-100 dark:border-rose-800 text-[10px] font-bold px-2 py-1 rounded-md inline-flex items-center">
                        <AlertTriangle className="w-3 h-3 mr-1" /> Chưa thu
                      </span>
                    )}
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
};
