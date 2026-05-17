import { useState, useCallback, useEffect, useRef } from 'react';
import { RefreshCw } from 'lucide-react';
import { EvnLogin } from './components/EvnLogin';
import { EvnDashboard } from './components/EvnDashboard';
import { evnRepository } from '../../data/repositories/evnRepository';
import { useEvnState } from './hooks/useEvnState';
import { useLogout } from './hooks/useLogout';

export const EvnPage = () => {
  const [isLoggedIn, setIsLoggedIn] = useState(false);
  const [isCheckingSession, setIsCheckingSession] = useState(true);
  const [isLoginLoading, setIsLoginLoading] = useState(false);
  const [loginError, setLoginError] = useState('');
  const [phone, setPhone] = useState('');
  const [password, setPassword] = useState('');
  const [customerId, setCustomerId] = useState('PE20000003396');
  const [fromDate, setFromDate] = useState('2026-05-01');
  const [toDate, setToDate] = useState('2026-05-18');
  const [calcKwh, setCalcKwh] = useState<number>(0);
  const calcKwhInitialized = useRef(false);
  const [calcVat, setCalcVat] = useState<number>(10);

  const handleLogin = useCallback(async () => {
    setIsLoginLoading(true);
    setLoginError('');
    try {
      const res = await evnRepository.login(phone, password);
      if (res.state === 'success') {
        setIsLoggedIn(true);
      } else {
        setLoginError(res.alert || 'Đăng nhập thất bại');
      }
    } catch {
      setLoginError('Không thể kết nối đến EVN. Vui lòng thử lại sau.');
    } finally {
      setIsLoginLoading(false);
    }
  }, [phone, password]);

  const { handleLogout } = useLogout();

  const onLogout = useCallback(async () => {
    await handleLogout();
    setIsLoggedIn(false);
  }, [handleLogout]);

  useEffect(() => {
    (async () => {
      try {
        const res = await evnRepository.checkSession();
        if (res.state === 'login') setIsLoggedIn(true);
      } catch {
        /* session expired — show login form */
      } finally {
        setIsCheckingSession(false);
      }
    })();
  }, []);

  const {
    dailyData,
    dailyTitle,
    soNgay,
    invoices,
    billingTotal,
    debtItems,
    hasDebt,
    stats,
    loading,
    refetch,
  } = useEvnState({
    customerId,
    fromDate,
    toDate,
  });

  useEffect(() => {
    if (stats.monthConsumption > 0 && !calcKwhInitialized.current) {
      setCalcKwh(stats.monthConsumption);
      calcKwhInitialized.current = true;
    }
  }, [stats.monthConsumption]);

  if (isCheckingSession) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-slate-50 dark:bg-slate-900">
        <RefreshCw className="w-6 h-6 animate-spin text-slate-400 dark:text-slate-500" />
      </div>
    );
  }

  if (!isLoggedIn) {
    return (
      <EvnLogin
        phone={phone}
        password={password}
        onPhoneChange={setPhone}
        onPasswordChange={setPassword}
        customerId={customerId}
        onCustomerIdChange={setCustomerId}
        onLogin={handleLogin}
        isLoading={isLoginLoading}
        loginError={loginError}
      />
    );
  }

  return (
    <EvnDashboard
      stats={stats}
      dailyData={dailyData}
      dailyTitle={dailyTitle}
      soNgay={soNgay}
      invoices={invoices}
      billingTotal={billingTotal}
      debtItems={debtItems}
      hasDebt={hasDebt}
      calcKwh={calcKwh}
      calcVat={calcVat}
      onCalcKwhChange={setCalcKwh}
      onCalcVatChange={setCalcVat}
      onLogout={onLogout}
      loading={loading}
      onRefreshDaily={refetch}
      fromDate={fromDate}
      toDate={toDate}
      onFromDateChange={setFromDate}
      onToDateChange={setToDate}
    />
  );
};
