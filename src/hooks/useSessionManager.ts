import { useState, useCallback, useRef, useEffect } from 'react';
import AsyncStorage from '@react-native-async-storage/async-storage';
import * as WebBrowser from 'expo-web-browser';
import 'react-native-get-random-values';
import Controller, { SessionAccount, type SessionAccountInterface, type SessionPolicy, type Call } from '../../modules/controller/src';
import { ec } from 'starknet';
import { CONTRACT_ADDRESS, RPC_URL } from '../config/constants';
import { getUserFriendlyError } from '../utils/errorMessages';

const KEYCHAIN_URL = 'https://x.cartridge.gg';
const CARTRIDGE_API_URL = 'https://api.cartridge.gg';
const PRIVATE_KEY_STORAGE_KEY = 'cartridge_session_private_key';
const SESSION_STORAGE_KEY = 'cartridge_session_data';

// Session policies for counter contract
const SESSION_POLICIES: SessionPolicy[] = [
  {
    contractAddress: CONTRACT_ADDRESS,
    entrypoint: 'increase_counter',
  },
  {
    contractAddress: CONTRACT_ADDRESS,
    entrypoint: 'decrease_counter',
  },
];

// Generate a valid Stark private key
function generateRandomKey(): string {
  const privateKey = ec.starkCurve.utils.randomPrivateKey();
  return '0x' + Array.from(privateKey).map(b => b.toString(16).padStart(2, '0')).join('');
}

// Get or create a session private key
async function getOrCreatePrivateKey(): Promise<string> {
  let privateKey = await AsyncStorage.getItem(PRIVATE_KEY_STORAGE_KEY);

  if (privateKey) {
    try {
      ec.starkCurve.getStarkKey(privateKey);
    } catch {
      privateKey = null;
    }
  }

  if (!privateKey) {
    privateKey = generateRandomKey();
    await AsyncStorage.setItem(PRIVATE_KEY_STORAGE_KEY, privateKey);
  }

  return privateKey;
}

// Derive public key from private key
function getPublicKey(privateKey: string): string {
  return ec.starkCurve.getStarkKey(privateKey);
}

export interface SessionState {
  address: string | null;
  username: string | null;
  isConnected: boolean;
  isConnecting: boolean;
  error: string | null;
}

export function useSessionManager() {
  const [state, setState] = useState<SessionState>({
    address: null,
    username: null,
    isConnected: false,
    isConnecting: false,
    error: null,
  });

  const sessionAccountRef = useRef<SessionAccountInterface | null>(null);
  const privateKeyRef = useRef<string | null>(null);

  // Load existing session on mount
  useEffect(() => {
    loadExistingSession();
  }, []);

  const loadExistingSession = async () => {
    try {
      const sessionData = await AsyncStorage.getItem(SESSION_STORAGE_KEY);
      if (sessionData) {
        const parsed = JSON.parse(sessionData);
        if (parsed.address && parsed.privateKey) {
          privateKeyRef.current = parsed.privateKey;

          // Recreate session account from stored data
          const sessionPolicies = {
            policies: SESSION_POLICIES,
            maxFee: '0x2386f26fc10000', // ~0.01 ETH
          };

          try {
            const session = SessionAccount.createFromSubscribe(
              parsed.privateKey,
              sessionPolicies,
              RPC_URL,
              CARTRIDGE_API_URL
            );

            sessionAccountRef.current = session;

            setState({
              address: parsed.address,
              username: parsed.username || null,
              isConnected: true,
              isConnecting: false,
              error: null,
            });
          } catch {
            // Session may have expired, clear it
            await clearSession();
          }
        }
      }
    } catch (error) {
      console.error('Error loading session:', error);
    }
  };

  const connect = useCallback(async () => {
    setState(prev => ({ ...prev, isConnecting: true, error: null }));

    try {
      const privateKey = await getOrCreatePrivateKey();
      privateKeyRef.current = privateKey;
      const publicKey = getPublicKey(privateKey);

      // Build session URL
      const policies = SESSION_POLICIES.map(p => ({
        target: p.contractAddress,
        method: p.entrypoint,
      }));

      const params = new URLSearchParams({
        public_key: publicKey,
        redirect_uri: 'counterapp://session',
        policies: JSON.stringify(policies),
        rpc_url: RPC_URL,
      });

      const sessionUrl = `${KEYCHAIN_URL}/session?${params.toString()}`;

      console.log('Opening session URL:', sessionUrl);

      // Start background subscription before opening browser
      const subscriptionPromise = startBackgroundSubscription(privateKey);

      // Open browser for authorization
      await WebBrowser.openBrowserAsync(sessionUrl, {
        dismissButtonStyle: 'close',
        presentationStyle: WebBrowser.WebBrowserPresentationStyle.FULL_SCREEN,
      });

      // Wait for subscription to complete
      const session = await subscriptionPromise;

      if (session) {
        sessionAccountRef.current = session;

        const address = session.address();
        const username = session.username() || null;

        // Store session data
        await AsyncStorage.setItem(SESSION_STORAGE_KEY, JSON.stringify({
          address,
          username,
          privateKey,
        }));

        setState({
          address,
          username,
          isConnected: true,
          isConnecting: false,
          error: null,
        });
      } else {
        setState(prev => ({
          ...prev,
          isConnecting: false,
          error: 'Session creation failed or cancelled',
        }));
      }
    } catch (error) {
      console.error('Connection error:', error);
      setState(prev => ({
        ...prev,
        isConnecting: false,
        error: getUserFriendlyError(error, 'wallet'),
      }));
    }
  }, []);

  const startBackgroundSubscription = async (privateKey: string): Promise<SessionAccountInterface | null> => {
    return new Promise((resolve) => {
      setTimeout(async () => {
        try {
          const sessionPolicies = {
            policies: SESSION_POLICIES,
            maxFee: '0x2386f26fc10000', // ~0.01 ETH
          };

          console.log('Creating session from subscription...');

          const session = SessionAccount.createFromSubscribe(
            privateKey,
            sessionPolicies,
            RPC_URL,
            CARTRIDGE_API_URL
          );

          console.log('Session created:', session.address());

          // Dismiss browser
          await WebBrowser.dismissBrowser();

          resolve(session);
        } catch (error) {
          console.error('Subscription error:', error);
          resolve(null);
        }
      }, 0);
    });
  };

  const disconnect = useCallback(async () => {
    await clearSession();
    sessionAccountRef.current = null;
    privateKeyRef.current = null;
    setState({
      address: null,
      username: null,
      isConnected: false,
      isConnecting: false,
      error: null,
    });
  }, []);

  const clearSession = async () => {
    await AsyncStorage.removeItem(SESSION_STORAGE_KEY);
    await AsyncStorage.removeItem(PRIVATE_KEY_STORAGE_KEY);
  };

  const executeTransaction = useCallback(async (
    contractAddress: string,
    entrypoint: string,
    calldata: string[]
  ): Promise<string> => {
    if (!sessionAccountRef.current) {
      throw new Error('Not connected');
    }

    const calls: Call[] = [{
      contractAddress,
      entrypoint,
      calldata,
    }];

    console.log('Executing transaction:', { contractAddress, entrypoint, calldata });

    const txHash = sessionAccountRef.current.executeFromOutside(calls);

    console.log('Transaction hash:', txHash);

    return txHash;
  }, []);

  return {
    ...state,
    connect,
    disconnect,
    executeTransaction,
  };
}
