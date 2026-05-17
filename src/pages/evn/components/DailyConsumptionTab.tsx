import React, { useMemo } from 'react';
import {
  LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer,
} from 'recharts';
import { RefreshCw, Flag } from 'lucide-react';
import type { IDailyData } from '../types';

interface DailyConsumptionTabProps {
  dailyData: IDailyData[];
  dailyTitle: string;
  soNgay: number;
  fromDate: string;
  toDate: string;
  onFromDateChange: (date: string) => void;
  onToDateChange: (date: string) => void;
  onRefresh: () => void;
  loading: boolean;
}

const isDark = () =>
  typeof window !== 'undefined' && document.documentElement.classList.contains('dark');

const chartColors = {
  grid: '#f1f5f9',
  gridDark: '#1e293b',
  tick: '#94a3b8',
  tickDark: '#64748b',
  line: '#0284c7',
  lineDark: '#38bdf8',
  tooltipBg: 'white',
  tooltipBgDark: '#1e293b',
  tooltipShadow: '0 10px 30px rgba(0,0,0,0.1)',
  tooltipShadowDark: '0 10px 30px rgba(0,0,0,0.3)',
};

const renderCustomDot = (props: { cx?: number; cy?: number; payload?: Record<string, unknown> }) => {
  const { cx = 0, cy = 0, payload } = props;
  const dark = isDark();
  const dotStroke = dark ? '#1e293b' : '#fff';
  if (payload?.isChotHoaDon) {
    return <circle cx={cx} cy={cy} r={6} stroke={dotStroke} strokeWidth={2} fill="#f97316" />;
  }
  return <circle cx={cx} cy={cy} r={4} stroke={dotStroke} strokeWidth={1.5} fill="#0284c7" />;
};

export const DailyConsumptionTab: React.FC<DailyConsumptionTabProps> = ({
  dailyData,
  dailyTitle,
  soNgay,
  fromDate,
  toDate,
  onFromDateChange,
  onToDateChange,
  onRefresh,
  loading,
}) => {
  const dark = useMemo(() => isDark(), []);
  const colors = useMemo(() => (dark ? { ...chartColors, grid: chartColors.gridDark, tick: chartColors.tickDark, line: chartColors.lineDark, tooltipBg: chartColors.tooltipBgDark, tooltipShadow: chartColors.tooltipShadowDark } : chartColors), [dark]);

  const chartData = dailyData.map((d) => ({
    ...d,
    Tong: d.Tong,
  }));

  return (
    <div className="space-y-6">
      <div className="bg-white dark:bg-slate-800 rounded-2xl border border-slate-100 dark:border-slate-700 p-6 shadow-[0_8px_30px_rgb(0,0,0,0.03)] dark:shadow-none">
        <h3 className="font-extrabold text-[#0c4a6e] dark:text-sky-100 text-sm mb-4 flex items-center">
          <span className="w-1.5 h-3 bg-[#0284c7] rounded-full mr-2" />
          Tra cứu sản lượng điện tiêu thụ trong tháng
        </h3>
        <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 items-end">
          <div>
            <label className="block text-[9px] font-bold text-slate-400 dark:text-slate-500 uppercase tracking-widest mb-2">
              Từ ngày
            </label>
            <input
              type="date"
              value={fromDate}
              onChange={(e) => onFromDateChange(e.target.value)}
              className="w-full border border-slate-200 dark:border-slate-600 rounded-xl px-4 py-2.5 text-xs font-semibold focus:ring-2 focus:ring-[#0284c7] outline-none text-slate-700 dark:text-slate-300 bg-white dark:bg-slate-700"
            />
          </div>
          <div>
            <label className="block text-[9px] font-bold text-slate-400 dark:text-slate-500 uppercase tracking-widest mb-2">
              Đến ngày
            </label>
            <input
              type="date"
              value={toDate}
              onChange={(e) => onToDateChange(e.target.value)}
              className="w-full border border-slate-200 dark:border-slate-600 rounded-xl px-4 py-2.5 text-xs font-semibold focus:ring-2 focus:ring-[#0284c7] outline-none text-slate-700 dark:text-slate-300 bg-white dark:bg-slate-700"
            />
          </div>
          <button
            onClick={onRefresh}
            disabled={loading}
            className="w-full py-2.5 px-4 bg-slate-900 dark:bg-slate-700 hover:bg-slate-800 dark:hover:bg-slate-600 text-white rounded-xl font-bold transition-all text-xs flex items-center justify-center disabled:opacity-70"
          >
            <RefreshCw className={`w-3.5 h-3.5 mr-2 ${loading ? 'animate-spin' : ''}`} />
            CẬP NHẬT DỮ LIỆU
          </button>
        </div>
      </div>

      <div className="bg-white dark:bg-slate-800 rounded-2xl border border-slate-100 dark:border-slate-700 p-6 shadow-[0_8px_30px_rgb(0,0,0,0.03)] dark:shadow-none">
        <div className="flex flex-wrap justify-between items-center mb-6">
          <div>
            <h3 className="font-extrabold text-[#0c4a6e] dark:text-sky-100 text-base">Biểu đồ Điện năng Tiêu thụ Hàng ngày</h3>
            <p className="text-[10px] text-slate-400 dark:text-slate-500 font-semibold mt-1">{dailyTitle}</p>
          </div>
          <div className="flex items-center space-x-4 text-[10px] font-bold tracking-wider uppercase mt-2 sm:mt-0">
            <span className="flex items-center text-slate-600 dark:text-slate-400">
              <span className="w-2.5 h-2.5 rounded-full bg-[#0284c7] dark:bg-[#38bdf8] mr-1.5" />
              Sản lượng (kWh)
            </span>
            <span className="flex items-center text-slate-600 dark:text-slate-400">
              <span className="w-2.5 h-2.5 rounded-full bg-[#ea580c] mr-1.5" />
              Điểm chốt HĐ
            </span>
          </div>
        </div>
        <div className="h-80 w-full">
          <ResponsiveContainer width="100%" height="100%">
            <LineChart data={chartData} margin={{ top: 10, right: 10, left: -20, bottom: 0 }}>
              <defs>
                <linearGradient id="colorConsump" x1="0" y1="0" x2="0" y2="1">
                  <stop offset="5%" stopColor={colors.line} stopOpacity={0.2} />
                  <stop offset="95%" stopColor={colors.line} stopOpacity={0} />
                </linearGradient>
              </defs>
              <CartesianGrid strokeDasharray="3 3" vertical={false} stroke={colors.grid} />
              <XAxis
                dataKey="ngay"
                axisLine={false}
                tickLine={false}
                tick={{ fontSize: 10, fill: colors.tick, fontWeight: 600 }}
                dy={10}
              />
              <YAxis
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
                labelStyle={{ color: colors.tick, marginBottom: '4px', fontSize: '10px', textTransform: 'uppercase' }}
              />
              <Line
                type="monotone"
                dataKey="Tong"
                name="Sản lượng"
                stroke={colors.line}
                strokeWidth={3}
                fill="url(#colorConsump)"
                dot={renderCustomDot}
                activeDot={{ r: 8, strokeWidth: 0 }}
              />
            </LineChart>
          </ResponsiveContainer>
        </div>
      </div>

      <div className="bg-white dark:bg-slate-800 rounded-2xl border border-slate-100 dark:border-slate-700 shadow-[0_8px_30px_rgb(0,0,0,0.03)] dark:shadow-none overflow-hidden">
        <div className="px-6 py-5 border-b border-slate-50 dark:border-slate-700 flex justify-between items-center">
          <h3 className="font-extrabold text-[#0c4a6e] dark:text-sky-100 text-sm">Chi tiết Chỉ số theo Ngày</h3>
          <span className="bg-blue-50 dark:bg-blue-900/30 text-[#0284c7] dark:text-sky-300 text-[10px] px-3 py-1.5 rounded-full font-bold">
            {soNgay} ngày
          </span>
        </div>
        <div className="overflow-x-auto">
          <table className="w-full text-left border-collapse min-w-[600px]">
            <thead>
              <tr className="bg-slate-50/50 dark:bg-slate-800/50 text-slate-400 dark:text-slate-500 text-[10px] font-bold uppercase tracking-wider border-b border-slate-100 dark:border-slate-700">
                <th className="px-6 py-4">Ngày</th>
                <th className="px-6 py-4 text-right">Thấp Điểm (TD)</th>
                <th className="px-6 py-4 text-right">Bình Thường (BT)</th>
                <th className="px-6 py-4 text-right">Cao Điểm (CD)</th>
                <th className="px-6 py-4 text-right bg-blue-50/30 dark:bg-blue-900/20 text-[#0284c7] dark:text-sky-300 font-extrabold">Tổng Sản Lượng</th>
                <th className="px-6 py-4 text-center">Trạng Thái</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-100 dark:divide-slate-700 text-xs font-semibold text-slate-600 dark:text-slate-400">
              {dailyData.map((day, idx) => (
                <tr key={idx} className="hover:bg-slate-50/50 dark:hover:bg-slate-700/50 transition-all">
                  <td className="px-6 py-4 font-bold text-[#0f172a] dark:text-white">{day.ngayFull}</td>
                  <td className="px-6 py-4 text-right text-slate-400 dark:text-slate-500">{day.TD.toFixed(2)}</td>
                  <td className="px-6 py-4 text-right text-slate-400 dark:text-slate-500">{day.BT.toFixed(2)}</td>
                  <td className="px-6 py-4 text-right text-slate-400 dark:text-slate-500">{day.CD.toFixed(2)}</td>
                  <td className="px-6 py-4 text-right bg-blue-50/10 dark:bg-blue-900/10 text-[#0284c7] dark:text-sky-300 font-extrabold">
                    {day.Tong.toFixed(2)} kWh
                  </td>
                  <td className="px-6 py-4 text-center">
                    {day.isChotHoaDon ? (
                      <span className="bg-orange-50 dark:bg-orange-900/30 text-[#ea580c] dark:text-orange-400 border border-orange-100 dark:border-orange-800 text-[10px] font-bold px-2 py-0.5 rounded-md inline-flex items-center">
                        <Flag className="w-3 h-3 mr-1" /> Chốt sổ
                      </span>
                    ) : (
                      <span className="bg-slate-50 dark:bg-slate-700 text-slate-400 dark:text-slate-500 text-[10px] font-medium px-2 py-0.5 rounded-md inline-flex items-center">
                        Theo dõi
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
