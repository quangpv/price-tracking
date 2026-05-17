import { useState, useCallback } from 'react';
import { evnRepository } from '../../../data/repositories/evnRepository';

export function useLogout() {
  const [isLoggingOut, setIsLoggingOut] = useState(false);
  const [logoutError, setLogoutError] = useState<string | null>(null);

  const handleLogout = useCallback(async () => {
    setIsLoggingOut(true);
    setLogoutError(null);
    try {
      await evnRepository.logout();
    } catch {
      setLogoutError('Đăng xuất thất bại');
    } finally {
      setIsLoggingOut(false);
    }
  }, []);

  return { handleLogout, isLoggingOut, logoutError };
}
