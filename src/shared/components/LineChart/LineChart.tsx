import React, {useMemo} from 'react';
import {Area, AreaChart, CartesianGrid, ResponsiveContainer, Tooltip, XAxis, YAxis,} from 'recharts';
import {formatter} from '../../utils/formatter.ts';

const chartColors = {
    light: {
        grid: '#f1f5f9',
        tick: '#94a3b8',
        axisLine: '#e2e8f0',
        line: '#7c3aed',
        gradientStart: '#8b5cf6',
        gradientEnd: '#8b5cf6',
        tooltipBg: 'white',
        tooltipBorder: '#e2e8f0',
        tooltipLabel: '#0f172a',
        tooltipItem: '#8b5cf6',
        dotFill: '#7c3aed',
        dotStroke: 'white',
    },
    dark: {
        grid: '#1e293b',
        tick: '#64748b',
        axisLine: '#334155',
        line: '#a78bfa',
        gradientStart: '#8b5cf6',
        gradientEnd: '#8b5cf6',
        tooltipBg: '#1e293b',
        tooltipBorder: '#334155',
        tooltipLabel: '#f1f5f9',
        tooltipItem: '#a78bfa',
        dotFill: '#a78bfa',
        dotStroke: '#1e293b',
    },
};

interface ChartDataPoint {
    date: string;
    price: number;
}

interface LineChartProps {
    data: ChartDataPoint[];
    currency: 'usd' | 'vnd';
    isGoldTael?: boolean;
}

export const LineChartComponent: React.FC<LineChartProps> = ({
                                                                 data,
                                                                 currency,
                                                                 isGoldTael = false,
                                                             }) => {
    const isDark = typeof window !== 'undefined' && document.documentElement.classList.contains('dark');
    const colors = useMemo(() => isDark ? chartColors.dark : chartColors.light, [isDark]);
    if (data.length === 0) {
        return (
            <div className="flex items-center justify-center h-96 text-gray-400">
                <div className="text-center">
                    <p className="text-lg mb-2">No chart data available</p>
                    <p className="text-sm">Data will appear here once loaded</p>
                </div>
            </div>
        );
    }

    const minPrice = Math.min(...data.map(d => d.price));
    const maxPrice = Math.max(...data.map(d => d.price));
    const padding = (maxPrice - minPrice) * 0.1;

    return (
        <div className="w-full h-[300px] md:h-[400px] max-w-full overflow-x-auto">
            <ResponsiveContainer width="100%" height="100%">
                <AreaChart data={data} margin={{top: 5, right: 20, left: 10, bottom: 5}}>
                    <defs>
                        <linearGradient id="colorPrice" x1="0" y1="0" x2="0" y2="1">
                            <stop offset="5%" stopColor={colors.gradientStart} stopOpacity={0.3}/>
                            <stop offset="95%" stopColor={colors.gradientEnd} stopOpacity={0}/>
                        </linearGradient>
                    </defs>
                    <CartesianGrid strokeDasharray="4 4" stroke={colors.grid} vertical={false}/>
                    <XAxis
                        dataKey="date"
                        tickFormatter={(date: any) => {
                            const d = new Date(date);
                            return `${d.getMonth() + 1}/${d.getDate()}`;
                        }}
                        interval="preserveStartEnd"
                        tick={{fill: colors.tick, fontSize: 12}}
                        axisLine={{stroke: colors.axisLine}}
                        tickLine={{stroke: colors.axisLine}}
                    />
                    <YAxis
                        domain={[minPrice - padding, maxPrice + padding]}
                        tickFormatter={(value: number) =>
                            formatter.chartAmount(value, isGoldTael)
                        }
                        tick={{fill: colors.tick, fontSize: 12}}
                        axisLine={{stroke: colors.axisLine}}
                        tickLine={{stroke: colors.axisLine}}
                    />
                    <Tooltip
                        contentStyle={{
                            backgroundColor: colors.tooltipBg,
                            border: `1px solid ${colors.tooltipBorder}`,
                            borderRadius: '12px',
                            boxShadow: '0 4px 6px -1px rgba(0,0,0,0.07), 0 2px 4px -2px rgba(0,0,0,0.05)',
                            padding: '12px 16px',
                        }}
                        labelStyle={{color: colors.tooltipLabel, fontWeight: 600, marginBottom: '4px'}}
                        itemStyle={{color: colors.tooltipItem}}
                        formatter={(value: any) => [
                            formatter.price(value, currency, isGoldTael),
                            'Price',
                        ]}
                        labelFormatter={(label: any) => {
                            return formatter.localDateFromString(label)
                        }}
                    />
                    <Area
                        type="monotone"
                        dataKey="price"
                        stroke={colors.line}
                        strokeWidth={2.5}
                        fill="url(#colorPrice)"
                        dot={false}
                        activeDot={{r: 6, fill: colors.dotFill, stroke: colors.dotStroke, strokeWidth: 2}}
                    />
                </AreaChart>
            </ResponsiveContainer>
        </div>
    );
};
