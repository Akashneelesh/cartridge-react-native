import { useState, useCallback, useEffect } from 'react';
import {
  openSessionAuthorization,
  getStoredSession,
  clearSession,
} from '../config/wallet';

interface WalletState {
  address: string | null;
  isConnecting: boolean;
  error: string | null;
}

export function useWallet() {
  const [state, setState] = useState<WalletState>({
    address: null,
    isConnecting: false,
    error: null,
  });

  // Check for existing session on mount
  useEffect(() => {
    const checkExistingSession = async () => {
      try {
        const session = await getStoredSession();
        if (session?.address) {
          setState({
            address: session.address,
            isConnecting: false,
            error: null,
          });
        }
      } catch (err) {
        console.error('Error checking session:', err);
      }
    };
    checkExistingSession();
  }, []);

  const connect = useCallback(async () => {
    setState((prev) => ({ ...prev, isConnecting: true, error: null }));

    try {
      const result = await openSessionAuthorization();

      if (result?.address) {
        setState({
          address: result.address,
          isConnecting: false,
          error: null,
        });
      } else {
        setState((prev) => ({
          ...prev,
          isConnecting: false,
          error: 'Connection cancelled or no address returned',
        }));
      }
    } catch (err) {
      const message = err instanceof Error ? err.message : 'Connection failed';
      setState({
        address: null,
        isConnecting: false,
        error: message,
      });
    }
  }, []);

  const disconnect = useCallback(async () => {
    try {
      await clearSession();
    } catch {
      // Ignore disconnect errors
    }
    setState({
      address: null,
      isConnecting: false,
      error: null,
    });
  }, []);

  return {
    address: state.address,
    isConnecting: state.isConnecting,
    error: state.error,
    isConnected: !!state.address,
    connect,
    disconnect,
  };
}
