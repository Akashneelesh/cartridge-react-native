import { useState, useCallback } from 'react';
import { controller } from '../config/wallet';

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

  const connect = useCallback(async () => {
    setState((prev) => ({ ...prev, isConnecting: true, error: null }));

    try {
      const account = await controller.connect();
      if (account) {
        setState({
          address: account.address,
          isConnecting: false,
          error: null,
        });
      } else {
        setState((prev) => ({
          ...prev,
          isConnecting: false,
          error: 'Connection cancelled',
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
      await controller.disconnect();
      setState({
        address: null,
        isConnecting: false,
        error: null,
      });
    } catch (err) {
      const message = err instanceof Error ? err.message : 'Disconnect failed';
      setState((prev) => ({
        ...prev,
        error: message,
      }));
    }
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
