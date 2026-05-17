import React, { useState } from 'react';
import { Zap, User, Lock, Contact, ArrowRight, RefreshCw, AlertCircle } from 'lucide-react';
import { evnRepository } from '../../../data/repositories/evnRepository';

interface EvnLoginProps {
  customerId: string;
  onCustomerIdChange: (id: string) => void;
  onLoginSuccess: () => void;
}

export const EvnLogin: React.FC<EvnLoginProps> = ({
  customerId,
  onCustomerIdChange,
  onLoginSuccess,
}) => {
  const [phone, setPhone] = useState('');
  const [password, setPassword] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [loginError, setLoginError] = useState('');

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsLoading(true);
    setLoginError('');
    try {
      const res = await evnRepository.login(phone, password);
      if (res.state === 'success') {
        onLoginSuccess();
      } else {
        setLoginError(res.alert || 'Đăng nhập thất bại');
      }
    } catch {
      setLoginError('Không thể kết nối đến EVN. Vui lòng thử lại sau.');
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-[radial-gradient(circle_at_10%_20%,_rgb(241,245,249)_0%,_rgb(248,250,252)_90%)] dark:bg-slate-900 dark:bg-none flex flex-col font-sans text-slate-900 dark:text-slate-100">
      <header className="bg-white/80 dark:bg-slate-800/80 backdrop-blur-md border-b border-slate-100 dark:border-slate-700 sticky top-0 z-40 shadow-sm py-3 px-6 flex items-center justify-between">
        <div className="flex items-center space-x-3">
          <div className="bg-gradient-to-br from-[#0284c7] to-[#0369a1] text-white p-2.5 rounded-xl shadow-[0_10px_30px_-10px_rgba(2,132,199,0.5)] flex items-center justify-center">
            <Zap className="w-5 h-5 text-yellow-300 animate-pulse fill-yellow-300" />
          </div>
          <div>
            <h1 className="text-base font-extrabold text-[#0c4a6e] dark:text-sky-100 tracking-tight leading-none flex items-center">
              EVN<span className="text-[#ea580c]">HCMC</span>
            </h1>
            <span className="text-[10px] text-slate-400 dark:text-slate-500 font-semibold tracking-wider uppercase block mt-0.5">
              Hệ thống Giám sát Điện năng
            </span>
          </div>
        </div>
      </header>

      <main className="flex-grow flex items-center justify-center p-4">
        <div className="w-full max-w-md bg-white dark:bg-slate-800 rounded-3xl border border-slate-100 dark:border-slate-700 shadow-[0_10px_40px_-10px_rgba(2,132,199,0.1)] dark:shadow-none overflow-hidden">
          <div className="bg-gradient-to-br from-[#0284c7] to-[#0369a1] p-8 text-white text-center relative overflow-hidden">
            <div className="absolute -right-6 -bottom-6 opacity-5 pointer-events-none">
              <Zap className="w-40 h-40" />
            </div>
            <h3 className="text-xl font-extrabold mb-2 tracking-tight">Tra Cứu & Giám Sát Điện Năng</h3>
            <p className="text-sky-100 text-xs font-medium">Đồng bộ chỉ số, kiểm tra nợ và tính toán hoá đơn chi tiết</p>
          </div>

          <form onSubmit={handleSubmit} className="p-8 space-y-6">
            <div>
              <label className="block text-[10px] font-bold text-slate-400 dark:text-slate-500 uppercase tracking-widest mb-2">
                Số điện thoại / Username
              </label>
              <div className="relative">
                <span className="absolute inset-y-0 left-0 pl-3.5 flex items-center text-slate-300 dark:text-slate-500 pointer-events-none">
                  <User className="w-4 h-4" />
                </span>
                <input
                  type="text"
                  value={phone}
                  onChange={(e) => setPhone(e.target.value)}
                  required
                  className="w-full pl-10 pr-4 py-3 border border-slate-200/80 dark:border-slate-600 rounded-xl focus:ring-2 focus:ring-[#0284c7] focus:border-[#0284c7] outline-none text-sm transition-all placeholder:text-slate-300 dark:placeholder:text-slate-500 font-medium bg-white dark:bg-slate-700 text-slate-900 dark:text-slate-100"
                />
              </div>
            </div>

            <div>
              <label className="block text-[10px] font-bold text-slate-400 dark:text-slate-500 uppercase tracking-widest mb-2">
                Mật khẩu
              </label>
              <div className="relative">
                <span className="absolute inset-y-0 left-0 pl-3.5 flex items-center text-slate-300 dark:text-slate-500 pointer-events-none">
                  <Lock className="w-4 h-4" />
                </span>
                <input
                  type="password"
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  required
                  placeholder="••••••••"
                  className="w-full pl-10 pr-4 py-3 border border-slate-200/80 dark:border-slate-600 rounded-xl focus:ring-2 focus:ring-[#0284c7] focus:border-[#0284c7] outline-none text-sm transition-all placeholder:text-slate-300 dark:placeholder:text-slate-500 font-medium bg-white dark:bg-slate-700 text-slate-900 dark:text-slate-100"
                />
              </div>
            </div>

            <div>
              <label className="block text-[10px] font-bold text-slate-400 dark:text-slate-500 uppercase tracking-widest mb-2">
                Mã Khách Hàng (Mã PE)
              </label>
              <div className="relative">
                <span className="absolute inset-y-0 left-0 pl-3.5 flex items-center text-slate-300 dark:text-slate-500 pointer-events-none">
                  <Contact className="w-4 h-4" />
                </span>
                <input
                  type="text"
                  value={customerId}
                  onChange={(e) => onCustomerIdChange(e.target.value)}
                  required
                  className="w-full pl-10 pr-4 py-3 border border-slate-200/80 dark:border-slate-600 rounded-xl focus:ring-2 focus:ring-[#0284c7] focus:border-[#0284c7] outline-none text-sm transition-all placeholder:text-slate-300 dark:placeholder:text-slate-500 font-medium font-mono bg-white dark:bg-slate-700 text-slate-900 dark:text-slate-100"
                />
              </div>
            </div>

            {loginError && (
              <div className="flex items-center gap-2 p-3 bg-red-50 dark:bg-red-900/20 border border-red-200 dark:border-red-800 rounded-xl text-xs font-medium text-red-600 dark:text-red-400">
                <AlertCircle className="w-4 h-4 shrink-0" />
                <span>{loginError}</span>
              </div>
            )}

            <button
              type="submit"
              disabled={isLoading}
              className="w-full py-3.5 px-4 bg-gradient-to-br from-[#0284c7] to-[#0369a1] hover:opacity-95 text-white rounded-xl font-bold shadow-[0_5px_15px_rgba(2,132,199,0.3)] transition-all duration-200 text-sm flex items-center justify-center tracking-wide disabled:opacity-70"
            >
              {isLoading ? (
                <RefreshCw className="w-4 h-4 animate-spin" />
              ) : (
                <>
                  <span className="mr-2">XÁC NHẬN ĐĂNG NHẬP</span>
                  <ArrowRight className="w-4 h-4" />
                </>
              )}
            </button>
          </form>
        </div>
      </main>
    </div>
  );
};
