import { useState, useEffect } from 'react';
import { RefreshCw } from 'lucide-react';
import { EvnLogin } from './components/EvnLogin';
import { EvnDashboard } from './components/EvnDashboard';
import { evnRepository } from '../../data/repositories/evnRepository';

export const EvnPage = () => {
  const [isLoggedIn, setIsLoggedIn] = useState(false);
  const [isCheckingSession, setIsCheckingSession] = useState(true);
  const [customerId, setCustomerId] = useState('PE20000003396');

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
        customerId={customerId}
        onCustomerIdChange={setCustomerId}
        onLoginSuccess={() => setIsLoggedIn(true)}
      />
    );
  }

  return (
    <EvnDashboard
      customerId={customerId}
      onSessionExpired={() => setIsLoggedIn(false)}
    />
  );
};
