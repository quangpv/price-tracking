import React, { useState, useMemo, useEffect } from 'react';
import {
    LineChart, Line, BarChart, Bar, XAxis, YAxis, CartesianGrid,
    Tooltip, ResponsiveContainer, ComposedChart, Legend
} from 'recharts';
import {
    Zap, User, Lock, Contact, ArrowRight, LogOut, Activity,
    ReceiptText, Calculator, CreditCard, Calendar, History,
    AlertCircle, RefreshCw, Flag, CheckCircle2, AlertTriangle,
    FileWarning, ShieldCheck
} from 'lucide-react';

interface TierConfig {
    tier: number;
    range: string;
    from: number;
    to: number;
    price: number;
}

interface DailyDataPoint {
    ngay: string;
    ngayFull: string;
    TD: number;
    BT: number;
    CD: number;
    Tong: number;
    sanluong_tong: string;
    isChotHoaDon: number;
}

interface InvoiceData {
    KY: string;
    THANG: string;
    NAM: string;
    NAME: string;
    NAME_FULL: string;
    SAN_LUONG: string;
    SO_TIEN: string;
    TIEN_THUE: string;
    TONG_TIEN: string;
    NGAY_DKY: string;
    NGAY_CKY: string;
    TRANG_THAI: number;
}

interface DebtItem {
    KY?: string;
    THANG?: string;
    NAM?: string;
    NGAY_GIAO?: string;
    TIEN?: string;
}

type TabType = 'daily' | 'billing' | 'debt' | 'calculator';

const EVN_TIERS: TierConfig[] = [
    { tier: 1, range: "0 - 50 kWh", from: 0, to: 50, price: 1806 },
    { tier: 2, range: "51 - 100 kWh", from: 50, to: 100, price: 1866 },
    { tier: 3, range: "101 - 200 kWh", from: 100, to: 200, price: 2167 },
    { tier: 4, range: "201 - 300 kWh", from: 200, to: 300, price: 2729 },
    { tier: 5, range: "301 - 400 kWh", from: 300, to: 400, price: 3050 },
    { tier: 6, range: "Từ 401 kWh trở lên", from: 400, to: Infinity, price: 3151 }
];

const MOCK_DATA = {
    daily: {
        tieude: "Từ 03/05/2026 đến 18/05/2026",
        soNgay: 16,
        sanluong_tong: 58.36,
        sanluong_tungngay: [
            { ngay: "03/05", ngayFull: "03/05/2026", TD: 0, BT: 2.5, CD: 0, Tong: 2.5, sanluong_tong: "2.50", isChotHoaDon: 0 },
            { ngay: "04/05", ngayFull: "04/05/2026", TD: 0, BT: 3.1, CD: 0, Tong: 3.1, sanluong_tong: "3.10", isChotHoaDon: 0 },
            { ngay: "05/05", ngayFull: "05/05/2026", TD: 0, BT: 4.2, CD: 0, Tong: 4.2, sanluong_tong: "4.20", isChotHoaDon: 0 },
            { ngay: "06/05", ngayFull: "06/05/2026", TD: 0, BT: 3.8, CD: 0, Tong: 3.8, sanluong_tong: "3.80", isChotHoaDon: 0 },
            { ngay: "07/05", ngayFull: "07/05/2026", TD: 0, BT: 3.9, CD: 0, Tong: 3.9, sanluong_tong: "3.90", isChotHoaDon: 0 },
            { ngay: "08/05", ngayFull: "08/05/2026", TD: 0, BT: 4.5, CD: 0, Tong: 4.5, sanluong_tong: "4.50", isChotHoaDon: 0 },
            { ngay: "09/05", ngayFull: "09/05/2026", TD: 0, BT: 3.6, CD: 0, Tong: 3.6, sanluong_tong: "3.60", isChotHoaDon: 0 },
            { ngay: "10/05", ngayFull: "10/05/2026", TD: 0, BT: 4.1, CD: 0, Tong: 4.1, sanluong_tong: "4.10", isChotHoaDon: 0 },
            { ngay: "11/05", ngayFull: "11/05/2026", TD: 0, BT: 3.2, CD: 0, Tong: 3.2, sanluong_tong: "3.20", isChotHoaDon: 0 },
            { ngay: "12/05", ngayFull: "12/05/2026", TD: 0, BT: 3.4, CD: 0, Tong: 3.4, sanluong_tong: "3.40", isChotHoaDon: 0 },
            { ngay: "13/05", ngayFull: "13/05/2026", TD: 0, BT: 2.9, CD: 0, Tong: 2.9, sanluong_tong: "2.90", isChotHoaDon: 0 },
            { ngay: "14/05", ngayFull: "14/05/2026", TD: 0, BT: 3.0, CD: 0, Tong: 3.0, sanluong_tong: "3.00", isChotHoaDon: 0 },
            { ngay: "15/05", ngayFull: "15/05/2026", TD: 0, BT: 4.8, CD: 0, Tong: 4.8, sanluong_tong: "4.80", isChotHoaDon: 0 },
            { ngay: "16/05", ngayFull: "16/05/2026", TD: 0, BT: 3.9, CD: 0, Tong: 3.9, sanluong_tong: "3.90", isChotHoaDon: 0 },
            { ngay: "17/05", ngayFull: "17/05/2026", TD: 0, BT: 4.1, CD: 0, Tong: 4.1, sanluong_tong: "4.10", isChotHoaDon: 0 },
            { ngay: "18/05", ngayFull: "18/05/2026", TD: 0, BT: 4.46, CD: 0, Tong: 4.46, sanluong_tong: "4.46", isChotHoaDon: 1 }
        ] as DailyDataPoint[]
    },
    billing: {
        tong: {
            SAN_LUONG_FORMAT: "1,300",
            SO_TIEN: 3097250,
            TIEN_THUE: 247780,
            TONG_TIEN: 3345030,
        },
        sanluong_hoadon: [
            { KY: "1", THANG: "11", NAM: "2025", NAME: "11/2025", NAME_FULL: "11/2025", SAN_LUONG: "81.00", SO_TIEN: "162750.00", TIEN_THUE: "13020.00", TONG_TIEN: "175770.00", NGAY_DKY: "01/11/2025", NGAY_CKY: "30/11/2025", TRANG_THAI: 1 },
            { KY: "1", THANG: "12", NAM: "2025", NAME: "12/2025", NAME_FULL: "12/2025", SAN_LUONG: "165.00", SO_TIEN: "356400.00", TIEN_THUE: "28512.00", TONG_TIEN: "384912.00", NGAY_DKY: "01/12/2025", NGAY_CKY: "31/12/2025", TRANG_THAI: 1 },
            { KY: "1", THANG: "01", NAM: "2026", NAME: "01/2026", NAME_FULL: "01/2026", SAN_LUONG: "180.00", SO_TIEN: "392000.00", TIEN_THUE: "31360.00", TONG_TIEN: "423360.00", NGAY_DKY: "01/01/2026", NGAY_CKY: "31/01/2026", TRANG_THAI: 1 },
            { KY: "1", THANG: "02", NAM: "2026", NAME: "02/2026", NAME_FULL: "02/2026", SAN_LUONG: "145.00", SO_TIEN: "305000.00", TIEN_THUE: "24400.00", TONG_TIEN: "329400.00", NGAY_DKY: "01/02/2026", NGAY_CKY: "28/02/2026", TRANG_THAI: 1 },
            { KY: "1", THANG: "03", NAM: "2026", NAME: "03/2026", NAME_FULL: "03/2026", SAN_LUONG: "210.00", SO_TIEN: "472000.00", TIEN_THUE: "37760.00", TONG_TIEN: "509760.00", NGAY_DKY: "01/03/2026", NGAY_CKY: "31/03/2026", TRANG_THAI: 1 },
            { KY: "1", THANG: "04", NAM: "2026", NAME: "04/2026", NAME_FULL: "04/2026", SAN_LUONG: "280.00", SO_TIEN: "680000.00", TIEN_THUE: "54400.00", TONG_TIEN: "734400.00", NGAY_DKY: "01/04/2026", NGAY_CKY: "30/04/2026", TRANG_THAI: 0 }
        ] as InvoiceData[]
    },
    debt: {
        isNo: 1,
        info_no: [
            { KY: "1", THANG: "4", NAM: "2026", NGAY_GIAO: "15/05/2026", TIEN: "734400.00" }
        ] as DebtItem[]
    }
};

export default function App() {
    const [isLoggedIn, setIsLoggedIn] = useState(false);
    const [isLoading, setIsLoading] = useState(false);
    const [customerId, setCustomerId] = useState("PE20000003396");
    const [activeTab, setActiveTab] = useState<TabType>('daily');

    const [calcKwh, setCalcKwh] = useState<number>(MOCK_DATA.daily.sanluong_tong);
    const [calcVat, setCalcVat] = useState<number>(10);
    const [fromDate, setFromDate] = useState('2026-05-01');
    const [toDate, setToDate] = useState('2026-05-18');

    // Format Helpers
    const formatCurrency = (amount: number) => {
        return new Intl.NumberFormat('vi-VN', { style: 'currency', currency: 'VND' }).format(amount).replace('₫', 'đ');
    };

    // Calculator Logic
    const calcResult = useMemo(() => {
        let remaining = calcKwh || 0;
        let totalBeforeTax = 0;
        const breakdown = EVN_TIERS.map(t => {
            let consumedInThisTier = 0;
            const limit = t.to - t.from;

            if (remaining > 0) {
                if (remaining >= limit) {
                    consumedInThisTier = limit;
                } else {
                    consumedInThisTier = remaining;
                }
                remaining -= consumedInThisTier;
            }

            const cost = consumedInThisTier * t.price;
            totalBeforeTax += cost;

            return { ...t, consumedInThisTier, cost, widthPercent: calcKwh > 0 ? (consumedInThisTier / calcKwh) * 100 : 0 };
        });

        const tax = totalBeforeTax * (calcVat / 100);
        const totalWithTax = totalBeforeTax + tax;

        return { breakdown, totalBeforeTax, tax, totalWithTax };
    }, [calcKwh, calcVat]);

    const handleLogin = (e: React.FormEvent) => {
        e.preventDefault();
        setIsLoading(true);
        setTimeout(() => {
            setIsLoading(false);
            setIsLoggedIn(true);
        }, 800);
    };

    // Recharts custom dot for daily chart
    const renderCustomDot = (props: any) => {
        const { cx, cy, payload } = props;
        if (payload.isChotHoaDon === 1) {
            return (
                <circle cx={cx} cy={cy} r={6} stroke="#fff" strokeWidth={2} fill="#f97316" />
            );
        }
        return <circle cx={cx} cy={cy} r={4} stroke="#fff" strokeWidth={1.5} fill="#0284c7" />;
    };

    if (!isLoggedIn) {
        return (
            <div className="min-h-screen bg-[radial-gradient(circle_at_10%_20%,_rgb(241,245,249)_0%,_rgb(248,250,252)_90%)] flex flex-col font-sans text-slate-900">
                <header className="bg-white/80 backdrop-blur-md border-b border-slate-100 sticky top-0 z-40 shadow-sm py-3 px-6 flex items-center justify-between">
                    <div className="flex items-center space-x-3">
                        <div className="bg-gradient-to-br from-[#0284c7] to-[#0369a1] text-white p-2.5 rounded-xl shadow-[0_10px_30px_-10px_rgba(2,132,199,0.5)] flex items-center justify-center">
                            <Zap className="w-5 h-5 text-yellow-300 animate-pulse fill-yellow-300" />
                        </div>
                        <div>
                            <h1 className="text-base font-extrabold text-[#0c4a6e] tracking-tight leading-none flex items-center">
                                EVN<span className="text-[#ea580c]">HCMC</span>
                            </h1>
                            <span className="text-[10px] text-slate-400 font-semibold tracking-wider uppercase block mt-0.5">Hệ thống Giám sát Điện năng</span>
                        </div>
                    </div>
                </header>

                <main className="flex-grow flex items-center justify-center p-4">
                    <div className="w-full max-w-md bg-white rounded-3xl border border-slate-100 shadow-[0_10px_40px_-10px_rgba(2,132,199,0.1)] overflow-hidden">
                        <div className="bg-gradient-to-br from-[#0284c7] to-[#0369a1] p-8 text-white text-center relative overflow-hidden">
                            <div className="absolute -right-6 -bottom-6 opacity-5 pointer-events-none">
                                <Zap className="w-40 h-40" />
                            </div>
                            <h3 className="text-xl font-extrabold mb-2 tracking-tight">Tra Cứu & Giám Sát Điện Năng</h3>
                            <p className="text-sky-100 text-xs font-medium">Đồng bộ chỉ số, kiểm tra nợ và tính toán hoá đơn chi tiết</p>
                        </div>

                        <form onSubmit={handleLogin} className="p-8 space-y-6">
                            <div>
                                <label className="block text-[10px] font-bold text-slate-400 uppercase tracking-widest mb-2">Số điện thoại / Username</label>
                                <div className="relative">
                  <span className="absolute inset-y-0 left-0 pl-3.5 flex items-center text-slate-300 pointer-events-none">
                    <User className="w-4 h-4" />
                  </span>
                                    <input type="text" defaultValue="0962221222" required
                                           className="w-full pl-10 pr-4 py-3 border border-slate-200/80 rounded-xl focus:ring-2 focus:ring-[#0284c7] focus:border-[#0284c7] outline-none text-sm transition-all placeholder:text-slate-300 font-medium" />
                                </div>
                            </div>
                            <div>
                                <label className="block text-[10px] font-bold text-slate-400 uppercase tracking-widest mb-2">Mật khẩu</label>
                                <div className="relative">
                  <span className="absolute inset-y-0 left-0 pl-3.5 flex items-center text-slate-300 pointer-events-none">
                    <Lock className="w-4 h-4" />
                  </span>
                                    <input type="password" defaultValue="password" required
                                           className="w-full pl-10 pr-4 py-3 border border-slate-200/80 rounded-xl focus:ring-2 focus:ring-[#0284c7] focus:border-[#0284c7] outline-none text-sm transition-all placeholder:text-slate-300 font-medium" />
                                </div>
                            </div>
                            <div>
                                <label className="block text-[10px] font-bold text-slate-400 uppercase tracking-widest mb-2">Mã Khách Hàng (Mã PE)</label>
                                <div className="relative">
                  <span className="absolute inset-y-0 left-0 pl-3.5 flex items-center text-slate-300 pointer-events-none">
                    <Contact className="w-4 h-4" />
                  </span>
                                    <input type="text" value={customerId} onChange={(e) => setCustomerId(e.target.value)} required
                                           className="w-full pl-10 pr-4 py-3 border border-slate-200/80 rounded-xl focus:ring-2 focus:ring-[#0284c7] focus:border-[#0284c7] outline-none text-sm transition-all placeholder:text-slate-300 font-medium font-mono" />
                                </div>
                            </div>
                            <button type="submit" disabled={isLoading} className="w-full py-3.5 px-4 bg-gradient-to-br from-[#0284c7] to-[#0369a1] hover:opacity-95 text-white rounded-xl font-bold shadow-[0_5px_15px_rgba(2,132,199,0.3)] transition-all duration-200 text-sm flex items-center justify-center tracking-wide disabled:opacity-70">
                                {isLoading ? <RefreshCw className="w-4 h-4 mr-2 animate-spin" /> : <><span className="mr-2">XÁC NHẬN ĐĂNG NHẬP</span> <ArrowRight className="w-4 h-4" /></>}
                            </button>
                        </form>
                    </div>
                </main>
            </div>
        );
    }

    const lastBill = MOCK_DATA.billing.sanluong_hoadon[MOCK_DATA.billing.sanluong_hoadon.length - 1];
    const isDebt = MOCK_DATA.debt.isNo === 1;

    return (
        <div className="min-h-screen bg-[radial-gradient(circle_at_10%_20%,_rgb(241,245,249)_0%,_rgb(248,250,252)_90%)] flex flex-col font-sans text-slate-900 antialiased">
            <style>{`
        ::-webkit-scrollbar { width: 6px; height: 6px; }
        ::-webkit-scrollbar-track { background: transparent; }
        ::-webkit-scrollbar-thumb { background: #cbd5e1; border-radius: 8px; }
        ::-webkit-scrollbar-thumb:hover { background: #94a3b8; }
      `}</style>

            {/* Header */}
            <header className="bg-white/80 backdrop-blur-md border-b border-slate-100 sticky top-0 z-40 shadow-sm">
                <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
                    <div className="flex justify-between h-16 items-center">
                        <div className="flex items-center space-x-3">
                            <div className="bg-gradient-to-br from-[#0284c7] to-[#0369a1] text-white p-2.5 rounded-xl shadow-[0_5px_15px_rgba(2,132,199,0.3)] flex items-center justify-center">
                                <Zap className="w-5 h-5 text-yellow-300 animate-pulse fill-yellow-300" />
                            </div>
                            <div>
                                <h1 className="text-base font-extrabold text-[#0c4a6e] tracking-tight leading-none flex items-center">
                                    EVN<span className="text-[#ea580c]">HCMC</span>
                                </h1>
                                <span className="text-[10px] text-slate-400 font-semibold tracking-wider uppercase block mt-0.5">Bảng Điều Khiển</span>
                            </div>
                        </div>
                        <div className="flex items-center space-x-3">
                            <div className="w-8 h-8 rounded-full bg-blue-50 border border-blue-100 text-[#0284c7] flex items-center justify-center font-bold text-sm">
                                KH
                            </div>
                            <div className="hidden sm:block text-left mr-2">
                                <p className="text-xs font-extrabold text-[#0c4a6e] leading-tight">{customerId}</p>
                                <span className="text-[9px] text-emerald-600 font-bold flex items-center mt-0.5">
                  <span className="w-1.5 h-1.5 rounded-full bg-emerald-500 inline-block mr-1 animate-ping"></span>Kết nối an toàn
                </span>
                            </div>
                            <button onClick={() => setIsLoggedIn(false)} className="p-2 text-slate-400 hover:text-rose-500 rounded-xl hover:bg-rose-50/50 transition-all">
                                <LogOut className="w-4 h-4" />
                            </button>
                        </div>
                    </div>
                </div>
            </header>

            <main className="flex-grow max-w-7xl w-full mx-auto px-4 sm:px-6 lg:px-8 py-8 space-y-6">

                {/* Quick Stats */}
                <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-5">
                    <div className="bg-white rounded-2xl border border-slate-100 p-6 shadow-[0_8px_30px_rgb(0,0,0,0.03)] hover:-translate-y-0.5 transition-all duration-300 relative overflow-hidden group">
                        <div className="absolute -right-3 -bottom-3 text-slate-100/50 text-7xl font-black select-none group-hover:scale-105 transition-transform duration-300">kWh</div>
                        <div className="flex justify-between items-start mb-4">
                            <span className="text-[10px] font-extrabold text-slate-400 uppercase tracking-widest">Tiêu thụ tháng này</span>
                            <span className="bg-blue-50 border border-blue-100 text-[#0284c7] p-2.5 rounded-xl"><Activity className="w-4 h-4" /></span>
                        </div>
                        <h2 className="text-3xl font-black text-[#0f172a] mb-1">{MOCK_DATA.daily.sanluong_tong} <span className="text-xs font-normal text-slate-400">kWh</span></h2>
                        <p className="text-[10px] text-slate-400 font-semibold">{MOCK_DATA.daily.tieude}</p>
                    </div>

                    <div className="bg-white rounded-2xl border border-slate-100 p-6 shadow-[0_8px_30px_rgb(0,0,0,0.03)] hover:-translate-y-0.5 transition-all duration-300 relative overflow-hidden group">
                        <div className="absolute -right-3 -bottom-3 text-slate-100/50 text-7xl font-black select-none group-hover:scale-105 transition-transform duration-300">VND</div>
                        <div className="flex justify-between items-start mb-4">
                            <span className="text-[10px] font-extrabold text-slate-400 uppercase tracking-widest">Hóa đơn gần nhất</span>
                            <span className="bg-emerald-50 border border-emerald-100 text-emerald-600 p-2.5 rounded-xl"><ReceiptText className="w-4 h-4" /></span>
                        </div>
                        <h2 className="text-2xl font-black text-[#0f172a] mb-1">{formatCurrency(parseFloat(lastBill.TONG_TIEN))}</h2>
                        <p className="text-[10px] text-slate-400 font-semibold">Kỳ hóa đơn cũ: {lastBill.NAME}</p>
                    </div>

                    <div className="bg-white rounded-2xl border border-slate-100 p-6 shadow-[0_8px_30px_rgb(0,0,0,0.03)] hover:-translate-y-0.5 transition-all duration-300 relative overflow-hidden group">
                        <div className="absolute -right-3 -bottom-3 text-slate-100/50 text-7xl font-black select-none group-hover:scale-105 transition-transform duration-300">EST</div>
                        <div className="flex justify-between items-start mb-4">
                            <span className="text-[10px] font-extrabold text-slate-400 uppercase tracking-widest">Ước tính Tiền Điện</span>
                            <span className="bg-orange-50 border border-orange-100 text-[#ea580c] p-2.5 rounded-xl"><Calculator className="w-4 h-4" /></span>
                        </div>
                        <h2 className="text-2xl font-black text-[#ea580c] mb-1">{formatCurrency(calcResult.totalWithTax)}</h2>
                        <p className="text-[10px] text-slate-400 font-semibold">Cộng dồn biểu luỹ tiến hiện tại</p>
                    </div>

                    <div className="bg-white rounded-2xl border border-slate-100 p-6 shadow-[0_8px_30px_rgb(0,0,0,0.03)] hover:-translate-y-0.5 transition-all duration-300 relative overflow-hidden group">
                        <div className="absolute -right-3 -bottom-3 text-slate-100/50 text-7xl font-black select-none group-hover:scale-105 transition-transform duration-300">DEBT</div>
                        <div className="flex justify-between items-start mb-4">
                            <span className="text-[10px] font-extrabold text-slate-400 uppercase tracking-widest">Trạng thái nợ</span>
                            <span className={`${isDebt ? 'bg-rose-50 border-rose-100 text-rose-500' : 'bg-emerald-50 border-emerald-100 text-emerald-600'} border p-2.5 rounded-xl`}>
                <CreditCard className="w-4 h-4" />
              </span>
                        </div>
                        <h2 className={`text-base font-extrabold mb-1 ${isDebt ? 'text-rose-600' : 'text-emerald-600'}`}>{isDebt ? 'Còn dư nợ' : 'Đã hoàn thành'}</h2>
                        <p className="text-[10px] text-slate-400 font-semibold">Mã KH: {customerId.substring(0,6)}...</p>
                    </div>
                </div>

                {/* Tabs */}
                <div className="bg-slate-100/80 p-1.5 rounded-2xl flex flex-wrap gap-1 w-fit border border-slate-200/50">
                    {[
                        { id: 'daily', icon: <Calendar className="w-4 h-4" />, label: 'Sản lượng ngày' },
                        { id: 'billing', icon: <History className="w-4 h-4" />, label: 'Kỳ hóa đơn' },
                        { id: 'debt', icon: <AlertCircle className="w-4 h-4" />, label: 'Kiểm tra nợ' },
                        { id: 'calculator', icon: <Calculator className="w-4 h-4" />, label: 'Ước tính giá' }
                    ].map(tab => (
                        <button key={tab.id} onClick={() => setActiveTab(tab.id as TabType)}
                                className={`px-5 py-2.5 rounded-xl font-bold text-xs flex items-center space-x-2 transition-all duration-200 ${
                                    activeTab === tab.id
                                        ? "bg-white text-[#0c4a6e] shadow-sm border border-slate-200/50"
                                        : "text-slate-500 hover:text-[#0c4a6e]"
                                }`}>
                            <span className={activeTab === tab.id ? "text-[#0284c7]" : ""}>{tab.icon}</span>
                            <span>{tab.label}</span>
                        </button>
                    ))}
                </div>

                {}
                {activeTab === 'daily' && (
                    <div className="space-y-6 animate-in fade-in duration-300">
                        {/* Filter */}
                        <div className="bg-white rounded-2xl border border-slate-100 p-6 shadow-[0_8px_30px_rgb(0,0,0,0.03)]">
                            <h3 className="font-extrabold text-[#0c4a6e] text-sm mb-4 flex items-center">
                                <span className="w-1.5 h-3 bg-[#0284c7] rounded-full mr-2"></span>Tra cứu sản lượng điện tiêu thụ trong tháng
                            </h3>
                            <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 items-end">
                                <div>
                                    <label className="block text-[9px] font-bold text-slate-400 uppercase tracking-widest mb-2">Từ ngày</label>
                                    <input type="date" value={fromDate} onChange={(e) => setFromDate(e.target.value)} className="w-full border border-slate-200 rounded-xl px-4 py-2.5 text-xs font-semibold focus:ring-2 focus:ring-[#0284c7] outline-none text-slate-700" />
                                </div>
                                <div>
                                    <label className="block text-[9px] font-bold text-slate-400 uppercase tracking-widest mb-2">Đến ngày</label>
                                    <input type="date" value={toDate} onChange={(e) => setToDate(e.target.value)} className="w-full border border-slate-200 rounded-xl px-4 py-2.5 text-xs font-semibold focus:ring-2 focus:ring-[#0284c7] outline-none text-slate-700" />
                                </div>
                                <button className="w-full py-2.5 px-4 bg-slate-900 hover:bg-slate-800 text-white rounded-xl font-bold transition-all text-xs flex items-center justify-center">
                                    <RefreshCw className="w-3.5 h-3.5 mr-2" />CẬP NHẬT DỮ LIỆU
                                </button>
                            </div>
                        </div>

                        {/* Daily Chart */}
                        <div className="bg-white rounded-2xl border border-slate-100 p-6 shadow-[0_8px_30px_rgb(0,0,0,0.03)]">
                            <div className="flex flex-wrap justify-between items-center mb-6">
                                <div>
                                    <h3 className="font-extrabold text-[#0c4a6e] text-base">Biểu đồ Điện năng Tiêu thụ Hàng ngày</h3>
                                    <p className="text-[10px] text-slate-400 font-semibold mt-1">{MOCK_DATA.daily.tieude} (Mã KH: {customerId})</p>
                                </div>
                                <div className="flex items-center space-x-4 text-[10px] font-bold tracking-wider uppercase mt-2 sm:mt-0">
                                    <span className="flex items-center"><span className="w-2.5 h-2.5 rounded-full bg-[#0284c7] mr-1.5"></span>Sản lượng (kWh)</span>
                                    <span className="flex items-center"><span className="w-2.5 h-2.5 rounded-full bg-[#ea580c] mr-1.5"></span>Điểm chốt HĐ</span>
                                </div>
                            </div>
                            <div className="h-80 w-full">
                                <ResponsiveContainer width="100%" height="100%">
                                    <LineChart data={MOCK_DATA.daily.sanluong_tungngay} margin={{ top: 10, right: 10, left: -20, bottom: 0 }}>
                                        <defs>
                                            <linearGradient id="colorConsump" x1="0" y1="0" x2="0" y2="1">
                                                <stop offset="5%" stopColor="#0284c7" stopOpacity={0.2} />
                                                <stop offset="95%" stopColor="#0284c7" stopOpacity={0} />
                                            </linearGradient>
                                        </defs>
                                        <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#f1f5f9" />
                                        <XAxis dataKey="ngay" axisLine={false} tickLine={false} tick={{ fontSize: 10, fill: '#94a3b8', fontWeight: 600 }} dy={10} />
                                        <YAxis axisLine={false} tickLine={false} tick={{ fontSize: 10, fill: '#94a3b8', fontWeight: 600 }} />
                                        <Tooltip
                                            contentStyle={{ borderRadius: '12px', border: 'none', boxShadow: '0 10px 30px rgba(0,0,0,0.1)', fontSize: '12px', fontWeight: 'bold' }}
                                            labelStyle={{ color: '#94a3b8', marginBottom: '4px', fontSize: '10px', textTransform: 'uppercase' }}
                                        />
                                        <Line type="monotone" dataKey="Tong" name="Sản lượng" stroke="#0284c7" strokeWidth={3} fill="url(#colorConsump)" dot={renderCustomDot} activeDot={{ r: 8, strokeWidth: 0 }} />
                                    </LineChart>
                                </ResponsiveContainer>
                            </div>
                        </div>

                        {/* Daily Table */}
                        <div className="bg-white rounded-2xl border border-slate-100 shadow-[0_8px_30px_rgb(0,0,0,0.03)] overflow-hidden">
                            <div className="px-6 py-5 border-b border-slate-50 flex justify-between items-center">
                                <h3 className="font-extrabold text-[#0c4a6e] text-sm">Chi tiết Chỉ số theo Ngày</h3>
                                <span className="bg-blue-50 text-[#0284c7] text-[10px] px-3 py-1.5 rounded-full font-bold">{MOCK_DATA.daily.soNgay} ngày</span>
                            </div>
                            <div className="overflow-x-auto">
                                <table className="w-full text-left border-collapse min-w-[600px]">
                                    <thead>
                                    <tr className="bg-slate-50/50 text-slate-400 text-[10px] font-bold uppercase tracking-wider border-b border-slate-100">
                                        <th className="px-6 py-4">Ngày</th>
                                        <th className="px-6 py-4 text-right">Thấp Điểm (TD)</th>
                                        <th className="px-6 py-4 text-right">Bình Thường (BT)</th>
                                        <th className="px-6 py-4 text-right">Cao Điểm (CD)</th>
                                        <th className="px-6 py-4 text-right bg-blue-50/30 text-[#0284c7] font-extrabold">Tổng Sản Lượng</th>
                                        <th className="px-6 py-4 text-center">Trạng Thái</th>
                                    </tr>
                                    </thead>
                                    <tbody className="divide-y divide-slate-100 text-xs font-semibold text-slate-600">
                                    {MOCK_DATA.daily.sanluong_tungngay.map((day, idx) => (
                                        <tr key={idx} className="hover:bg-slate-50/50 transition-all">
                                            <td className="px-6 py-4 font-bold text-[#0f172a]">{day.ngayFull}</td>
                                            <td className="px-6 py-4 text-right text-slate-400">{day.TD.toFixed(2)}</td>
                                            <td className="px-6 py-4 text-right text-slate-400">{day.BT.toFixed(2)}</td>
                                            <td className="px-6 py-4 text-right text-slate-400">{day.CD.toFixed(2)}</td>
                                            <td className="px-6 py-4 text-right bg-blue-50/10 text-[#0284c7] font-extrabold">{day.Tong.toFixed(2)} kWh</td>
                                            <td className="px-6 py-4 text-center flex justify-center">
                                                {day.isChotHoaDon === 1 ? (
                                                    <span className="bg-orange-50 text-[#ea580c] border border-orange-100 text-[10px] font-bold px-2 py-0.5 rounded-md flex items-center w-fit"><Flag className="w-3 h-3 mr-1" /> Chốt sổ</span>
                                                ) : (
                                                    <span className="bg-slate-50 text-slate-400 text-[10px] font-medium px-2 py-0.5 rounded-md flex items-center w-fit">Theo dõi</span>
                                                )}
                                            </td>
                                        </tr>
                                    ))}
                                    </tbody>
                                </table>
                            </div>
                        </div>
                    </div>
                )}

                {}
                {activeTab === 'billing' && (
                    <div className="space-y-6 animate-in fade-in duration-300">
                        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
                            <div className="bg-white rounded-2xl border border-slate-100 p-6 shadow-[0_8px_30px_rgb(0,0,0,0.03)] h-fit">
                                <h3 className="font-extrabold text-[#0c4a6e] text-base mb-4 flex items-center">
                                    <span className="w-1.5 h-3 bg-[#0284c7] rounded-full mr-2"></span>Tổng quan Lịch sử
                                </h3>
                                <div className="space-y-4">
                                    <div className="flex justify-between items-center py-2.5 border-b border-slate-100">
                                        <span className="text-xs text-slate-400 font-medium">Tổng sản lượng lũy tích</span>
                                        <span className="text-xs font-bold text-[#0c4a6e]">{MOCK_DATA.billing.tong.SAN_LUONG_FORMAT} kWh</span>
                                    </div>
                                    <div className="flex justify-between items-center py-2.5 border-b border-slate-100">
                                        <span className="text-xs text-slate-400 font-medium">Tổng tiền chưa thuế</span>
                                        <span className="text-xs font-bold text-[#0c4a6e]">{formatCurrency(MOCK_DATA.billing.tong.SO_TIEN)}</span>
                                    </div>
                                    <div className="flex justify-between items-center py-2.5 border-b border-slate-100">
                                        <span className="text-xs text-slate-400 font-medium">Tổng thuế VAT</span>
                                        <span className="text-xs font-bold text-[#0c4a6e]">{formatCurrency(MOCK_DATA.billing.tong.TIEN_THUE)}</span>
                                    </div>
                                    <div className="flex justify-between items-center py-3">
                                        <span className="text-xs font-bold text-slate-700">TỔNG THANH TOÁN</span>
                                        <span className="font-extrabold text-base text-emerald-600">{formatCurrency(MOCK_DATA.billing.tong.TONG_TIEN)}</span>
                                    </div>
                                </div>
                            </div>

                            <div className="lg:col-span-2 bg-white rounded-2xl border border-slate-100 p-6 shadow-[0_8px_30px_rgb(0,0,0,0.03)]">
                                <h3 className="font-extrabold text-[#0c4a6e] text-base mb-6">Biến động Hóa đơn các kỳ gần đây</h3>
                                <div className="h-64 w-full">
                                    <ResponsiveContainer width="100%" height="100%">
                                        <ComposedChart data={MOCK_DATA.billing.sanluong_hoadon} margin={{ top: 10, right: 10, left: -20, bottom: 0 }}>
                                            <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#f1f5f9" />
                                            <XAxis dataKey="NAME" axisLine={false} tickLine={false} tick={{ fontSize: 10, fill: '#94a3b8', fontWeight: 600 }} dy={10} />
                                            <YAxis yAxisId="left" axisLine={false} tickLine={false} tick={{ fontSize: 10, fill: '#94a3b8', fontWeight: 600 }} />
                                            <YAxis yAxisId="right" orientation="right" axisLine={false} tickLine={false} tick={{ fontSize: 10, fill: '#94a3b8', fontWeight: 600 }} />
                                            <Tooltip contentStyle={{ borderRadius: '12px', border: 'none', boxShadow: '0 10px 30px rgba(0,0,0,0.1)', fontSize: '12px', fontWeight: 'bold' }} />
                                            <Bar yAxisId="left" dataKey="SAN_LUONG" name="Sản lượng (kWh)" fill="#0284c7" radius={[4, 4, 0, 0]} maxBarSize={40} />
                                            <Line yAxisId="right" type="monotone" dataKey="TONG_TIEN" name="Tổng tiền (VND)" stroke="#ea580c" strokeWidth={3} dot={{ r: 4, strokeWidth: 2, fill: '#fff', stroke: '#ea580c' }} activeDot={{ r: 6 }} />
                                        </ComposedChart>
                                    </ResponsiveContainer>
                                </div>
                            </div>
                        </div>

                        <div className="bg-white rounded-2xl border border-slate-100 shadow-[0_8px_30px_rgb(0,0,0,0.03)] overflow-hidden">
                            <div className="px-6 py-5 border-b border-slate-50">
                                <h3 className="font-extrabold text-[#0c4a6e] text-sm">Danh sách Hóa đơn Chi tiết</h3>
                            </div>
                            <div className="overflow-x-auto">
                                <table className="w-full text-left border-collapse min-w-[700px]">
                                    <thead>
                                    <tr className="bg-slate-50/50 text-slate-400 text-[10px] font-bold uppercase tracking-wider border-b border-slate-100">
                                        <th className="px-6 py-4">Kỳ hóa đơn</th>
                                        <th className="px-6 py-4">Khoảng thời gian</th>
                                        <th className="px-6 py-4 text-right">Sản lượng (kWh)</th>
                                        <th className="px-6 py-4 text-right">Tiền trước thuế</th>
                                        <th className="px-6 py-4 text-right font-extrabold text-[#0f172a]">Tổng Tiền</th>
                                        <th className="px-6 py-4 text-center">Trạng Thái</th>
                                    </tr>
                                    </thead>
                                    <tbody className="divide-y divide-slate-100 text-xs font-semibold text-slate-600">
                                    {MOCK_DATA.billing.sanluong_hoadon.map((inv, idx) => (
                                        <tr key={idx} className="hover:bg-slate-50/50 transition-all">
                                            <td className="px-6 py-4 font-extrabold text-[#0f172a]">Kỳ {inv.KY} - Tháng {inv.NAME}</td>
                                            <td className="px-6 py-4 text-[10px] text-slate-400">{inv.NGAY_DKY} đến {inv.NGAY_CKY}</td>
                                            <td className="px-6 py-4 text-right font-bold text-slate-700">{inv.SAN_LUONG} kWh</td>
                                            <td className="px-6 py-4 text-right text-slate-500">{formatCurrency(parseFloat(inv.SO_TIEN))}</td>
                                            <td className="px-6 py-4 text-right font-extrabold text-[#0f172a]">{formatCurrency(parseFloat(inv.TONG_TIEN))}</td>
                                            <td className="px-6 py-4 text-center flex justify-center">
                                                {inv.TRANG_THAI === 1 ? (
                                                    <span className="bg-emerald-50 text-emerald-700 border border-emerald-100 text-[10px] font-bold px-2 py-1 rounded-md flex items-center w-fit"><CheckCircle2 className="w-3 h-3 mr-1" /> Đã thu</span>
                                                ) : (
                                                    <span className="bg-rose-50 text-rose-700 border border-rose-100 text-[10px] font-bold px-2 py-1 rounded-md flex items-center w-fit"><AlertTriangle className="w-3 h-3 mr-1" /> Chưa thu</span>
                                                )}
                                            </td>
                                        </tr>
                                    ))}
                                    </tbody>
                                </table>
                            </div>
                        </div>
                    </div>
                )}

                {}
                {activeTab === 'debt' && (
                    <div className="space-y-6 animate-in fade-in duration-300">
                        <div className="max-w-2xl mx-auto bg-white rounded-3xl border border-slate-100 shadow-[0_10px_40px_-10px_rgba(0,0,0,0.05)] p-10 text-center">
                            <div className={`w-24 h-24 rounded-full mx-auto flex items-center justify-center mb-6 shadow-sm border ${isDebt ? 'bg-rose-50 border-rose-100 text-rose-500 animate-pulse' : 'bg-emerald-50 border-emerald-100 text-emerald-600'}`}>
                                {isDebt ? <FileWarning className="w-10 h-10" /> : <ShieldCheck className="w-10 h-10" />}
                            </div>
                            <h3 className={`text-2xl font-extrabold mb-3 tracking-tight ${isDebt ? 'text-rose-600' : 'text-[#0c4a6e]'}`}>
                                {isDebt ? 'Tài khoản chưa hoàn thành hóa đơn' : 'Tuyệt Vời! Không Có Dư Nợ'}
                            </h3>
                            <p className="text-slate-400 text-xs font-medium max-w-md mx-auto mb-8 leading-relaxed">
                                {isDebt ? 'Hệ thống phát hiện hóa đơn quá hạn chưa thanh toán. Quý khách vui lòng đóng tiền đúng hạn để đảm bảo cung cấp dịch vụ điện năng không bị gián đoạn.' : 'Tất cả các hóa đơn tiền điện trước đó của quý khách đã hoàn tất thanh toán. Xin chân thành cảm ơn!'}
                            </p>

                            {isDebt && (
                                <div className="border border-slate-100 rounded-2xl overflow-hidden bg-slate-50/50 text-left">
                                    <div className="px-6 py-4 border-b border-slate-100 bg-slate-100/50 font-bold text-xs text-[#0c4a6e] flex items-center">
                                        <ReceiptText className="w-4 h-4 mr-2" /> Chi tiết hóa đơn nợ
                                    </div>
                                    <div className="p-6 divide-y divide-slate-100">
                                        {MOCK_DATA.debt.info_no.map((item, idx) => (
                                            <div key={idx} className="py-3 flex justify-between items-center text-xs font-semibold">
                                                <div>
                                                    <p className="font-extrabold text-[#0f172a] text-sm">Kỳ {item.KY} - Tháng {item.THANG}/{item.NAM}</p>
                                                    <span className="text-[10px] text-slate-400 font-bold uppercase tracking-wider block mt-1">Hạn đóng: {item.NGAY_GIAO}</span>
                                                </div>
                                                <span className="font-black text-rose-600 text-lg">{formatCurrency(parseFloat(item.TIEN || "0"))}</span>
                                            </div>
                                        ))}
                                    </div>
                                </div>
                            )}
                        </div>
                    </div>
                )}

                {}
                {activeTab === 'calculator' && (
                    <div className="space-y-6 animate-in fade-in duration-300">
                        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
                            <div className="bg-white rounded-2xl border border-slate-100 p-6 shadow-[0_8px_30px_rgb(0,0,0,0.03)] h-fit space-y-6">
                                <h3 className="font-extrabold text-[#0c4a6e] text-base border-b border-slate-50 pb-3 flex items-center">
                                    <span className="w-1.5 h-3 bg-[#ea580c] rounded-full mr-2"></span>Ước tính giá điện
                                </h3>
                                <div>
                                    <label className="block text-[9px] font-bold text-slate-400 uppercase tracking-widest mb-2">Sản lượng tiêu thụ (kWh)</label>
                                    <div className="relative">
                                        <input type="number" value={calcKwh} onChange={(e) => setCalcKwh(parseFloat(e.target.value) || 0)}
                                               className="w-full border border-slate-200 rounded-xl px-4 py-3 text-base font-extrabold text-[#0f172a] focus:ring-2 focus:ring-[#0284c7] outline-none bg-slate-50/50" />
                                        <span className="absolute right-4 top-1/2 -translate-y-1/2 text-xs font-bold text-slate-400">kWh</span>
                                    </div>
                                </div>
                                <div>
                                    <label className="block text-[9px] font-bold text-slate-400 uppercase tracking-widest mb-2">Thuế suất VAT</label>
                                    <div className="grid grid-cols-3 gap-2">
                                        {[0, 8, 10].map(vat => (
                                            <button key={vat} onClick={() => setCalcVat(vat)}
                                                    className={`py-2.5 px-3 rounded-xl text-xs font-bold transition-all border ${
                                                        calcVat === vat
                                                            ? 'border-[#0284c7] bg-blue-50 text-[#0284c7]'
                                                            : 'border-slate-200/80 hover:bg-slate-50 text-slate-600'
                                                    }`}>
                                                {vat}%
                                            </button>
                                        ))}
                                    </div>
                                </div>
                                <div className="bg-slate-50/80 p-5 rounded-2xl border border-slate-100">
                                    <h4 className="font-bold text-[9px] text-slate-400 uppercase tracking-widest mb-4">Tóm tắt tạm tính</h4>
                                    <div className="space-y-3 text-xs font-semibold text-slate-600">
                                        <div className="flex justify-between">
                                            <span className="text-slate-500">Giá gốc chưa VAT:</span>
                                            <span className="text-[#0c4a6e]">{formatCurrency(calcResult.totalBeforeTax)}</span>
                                        </div>
                                        <div className="flex justify-between">
                                            <span className="text-slate-500">Tiền thuế VAT ({calcVat}%):</span>
                                            <span className="text-[#0c4a6e]">{formatCurrency(calcResult.tax)}</span>
                                        </div>
                                        <hr className="border-slate-200/60 my-2" />
                                        <div className="flex justify-between items-baseline pt-1">
                                            <span className="text-[#0f172a] font-extrabold">TỔNG CỘNG:</span>
                                            <span className="font-black text-xl text-[#ea580c]">{formatCurrency(calcResult.totalWithTax)}</span>
                                        </div>
                                    </div>
                                </div>
                            </div>

                            <div className="lg:col-span-2 bg-white rounded-2xl border border-slate-100 p-6 shadow-[0_8px_30px_rgb(0,0,0,0.03)] space-y-6">
                                <div className="flex justify-between items-center">
                                    <div>
                                        <h3 className="font-extrabold text-[#0c4a6e] text-base">Phân Tích Đơn Giá Luỹ Tiến</h3>
                                        <p className="text-[10px] text-slate-400 font-semibold mt-1">Bảng giá điện sinh hoạt 6 bậc thang chính thức của EVN</p>
                                    </div>
                                    <span className="bg-orange-50 text-[#ea580c] border border-orange-100 text-[10px] px-3 py-1.5 rounded-full font-bold">6 Bậc thang</span>
                                </div>

                                {/* Progress Bar Visualizer */}
                                <div className="h-4 w-full bg-slate-100 rounded-full flex overflow-hidden shadow-inner">
                                    {calcResult.breakdown.map((t, idx) => {
                                        const colors = ['bg-emerald-400', 'bg-emerald-500', 'bg-sky-400', 'bg-blue-500', 'bg-orange-500', 'bg-rose-500'];
                                        if (t.widthPercent > 0) {
                                            return <div key={idx} className={`${colors[idx]} h-full transition-all duration-300`} style={{ width: `${t.widthPercent}%` }} title={`Bậc ${t.tier}: ${t.consumedInThisTier.toFixed(1)} kWh`}></div>;
                                        }
                                        return null;
                                    })}
                                    {calcKwh === 0 && <div className="bg-slate-200 w-full h-full"></div>}
                                </div>

                                {/* Breakdown Details */}
                                <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 pt-2">
                                    {calcResult.breakdown.map((t, idx) => {
                                        const colorsBg = ['bg-emerald-400', 'bg-emerald-500', 'bg-sky-400', 'bg-blue-500', 'bg-orange-500', 'bg-rose-500'];
                                        const hasData = t.consumedInThisTier > 0;
                                        return (
                                            <div key={idx} className={`p-4 border rounded-xl flex justify-between items-center transition-all ${hasData ? 'border-[#0284c7]/20 bg-blue-50/10 shadow-sm' : 'border-slate-100 opacity-50'}`}>
                                                <div className="flex items-center space-x-3">
                                                    <span className={`w-8 h-8 rounded-full ${colorsBg[idx]} text-white text-[11px] font-black flex items-center justify-center`}>{t.tier}</span>
                                                    <div>
                                                        <h4 className="font-extrabold text-xs text-[#0f172a]">BẬC {t.tier}</h4>
                                                        <p className="text-[9px] text-slate-400 font-bold uppercase tracking-wider">{t.range}</p>
                                                    </div>
                                                </div>
                                                <div className="text-right">
                                                    <p className={`font-extrabold text-sm ${hasData ? 'text-[#0284c7]' : 'text-slate-400'}`}>{t.consumedInThisTier.toFixed(1)} <span className="text-[10px]">kWh</span></p>
                                                    <span className="text-[10px] text-slate-500 font-bold block mt-0.5">{formatCurrency(t.price)}/k</span>
                                                </div>
                                            </div>
                                        );
                                    })}
                                </div>
                            </div>
                        </div>
                    </div>
                )}

            </main>
        </div>
    );
}
