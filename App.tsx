import { useEffect, useState, useRef } from 'react';
import {
  Text,
  View,
  StyleSheet,
  ActivityIndicator,
  TouchableOpacity,
} from 'react-native';
import { getCounterValue } from './src/config/starknet';
import { useSessionManager } from './src/hooks/useSessionManager';
import { CONTRACT_ADDRESS } from './src/config/constants';
import { TransactionModal, TransactionStatus } from './src/components/TransactionModal';
import { getUserFriendlyError } from './src/utils/errorMessages';

const truncateAddress = (addr: string) =>
  `${addr.slice(0, 6)}...${addr.slice(-4)}`;

export default function App() {
  const [counter, setCounter] = useState<bigint | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const { address, isConnecting, error: walletError, connect, disconnect, isConnected, executeTransaction } = useSessionManager();
  const [txStatus, setTxStatus] = useState<TransactionStatus>('idle');
  const [txHash, setTxHash] = useState<string | null>(null);
  const [txError, setTxError] = useState<string | null>(null);
  const lastMethodRef = useRef<'increase_counter' | 'decrease_counter' | null>(null);

  const fetchCounter = async () => {
    setLoading(true);
    setError(null);
    try {
      const value = await getCounterValue();
      setCounter(value);
    } catch (err) {
      setError(getUserFriendlyError(err, 'counter'));
    } finally {
      setLoading(false);
    }
  };

  const handleTransaction = async (method: 'increase_counter' | 'decrease_counter') => {
    lastMethodRef.current = method;
    setTxStatus('pending');
    setTxHash(null);
    setTxError(null);
    try {
      const hash = await executeTransaction(CONTRACT_ADDRESS, method, ['0x1']);
      setTxHash(hash);
      setTxStatus('success');
      await fetchCounter();
    } catch (err) {
      setTxError(getUserFriendlyError(err, 'transaction'));
      setTxStatus('error');
    }
  };

  const handleDismissModal = () => {
    setTxStatus('idle');
    setTxHash(null);
    setTxError(null);
  };

  const handleRetry = () => {
    if (lastMethodRef.current) {
      handleTransaction(lastMethodRef.current);
    }
  };

  useEffect(() => {
    fetchCounter();
  }, []);

  return (
    <View style={styles.container}>
      {/* Wallet Section */}
      <View style={styles.walletSection}>
        {!isConnected ? (
          <>
            <TouchableOpacity
              style={[styles.walletButton, isConnecting && styles.buttonDisabled]}
              onPress={connect}
              disabled={isConnecting}
            >
              {isConnecting ? (
                <ActivityIndicator size="small" color="#fff" />
              ) : (
                <Text style={styles.walletButtonText}>Connect Wallet</Text>
              )}
            </TouchableOpacity>
            {walletError && <Text style={styles.walletError}>{walletError}</Text>}
          </>
        ) : (
          <View style={styles.connectedContainer}>
            <Text style={styles.addressText}>{truncateAddress(address!)}</Text>
            <TouchableOpacity style={styles.disconnectButton} onPress={disconnect}>
              <Text style={styles.disconnectText}>Disconnect</Text>
            </TouchableOpacity>
          </View>
        )}
      </View>

      <Text style={styles.title}>Starknet Counter</Text>

      {loading && <ActivityIndicator size="large" color="#0066cc" />}

      {error && (
        <View style={styles.errorContainer}>
          <Text style={styles.error}>{error}</Text>
          <Text style={styles.errorHint}>Tap Refresh to try again</Text>
        </View>
      )}

      {!loading && !error && counter !== null && (
        <Text style={styles.counter}>{counter.toString()}</Text>
      )}

      {/* Increment/Decrement Buttons */}
      <View style={styles.buttonRow}>
        <TouchableOpacity
          style={[
            styles.actionButton,
            styles.decrementButton,
            (!isConnected || txStatus !== 'idle' || loading) && styles.buttonDisabled,
          ]}
          onPress={() => handleTransaction('decrease_counter')}
          disabled={!isConnected || txStatus !== 'idle' || loading}
        >
          <Text style={styles.actionButtonText}>-</Text>
        </TouchableOpacity>
        <TouchableOpacity
          style={[
            styles.actionButton,
            styles.incrementButton,
            (!isConnected || txStatus !== 'idle' || loading) && styles.buttonDisabled,
          ]}
          onPress={() => handleTransaction('increase_counter')}
          disabled={!isConnected || txStatus !== 'idle' || loading}
        >
          <Text style={styles.actionButtonText}>+</Text>
        </TouchableOpacity>
      </View>

      {!isConnected && (
        <Text style={styles.hintText}>Connect wallet to modify counter</Text>
      )}

      {/* Transaction Modal */}
      <TransactionModal
        visible={txStatus !== 'idle'}
        status={txStatus}
        txHash={txHash}
        error={txError}
        onDismiss={handleDismissModal}
        onRetry={handleRetry}
      />

      <TouchableOpacity
        style={styles.refreshButton}
        onPress={fetchCounter}
        disabled={loading}
      >
        <Text style={styles.refreshText}>Refresh</Text>
      </TouchableOpacity>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: '#fff',
  },
  walletSection: {
    position: 'absolute',
    top: 60,
    alignItems: 'center',
  },
  walletButton: {
    paddingHorizontal: 20,
    paddingVertical: 10,
    backgroundColor: '#0066cc',
    borderRadius: 8,
    minWidth: 140,
    alignItems: 'center',
  },
  buttonDisabled: {
    opacity: 0.6,
  },
  walletButtonText: {
    color: '#fff',
    fontSize: 14,
    fontWeight: '600',
  },
  walletError: {
    color: 'red',
    fontSize: 12,
    marginTop: 8,
    textAlign: 'center',
    maxWidth: 250,
  },
  connectedContainer: {
    alignItems: 'center',
  },
  addressText: {
    fontSize: 14,
    fontFamily: 'Courier',
    color: '#333',
    marginBottom: 8,
  },
  disconnectButton: {
    paddingHorizontal: 16,
    paddingVertical: 6,
    backgroundColor: '#dc3545',
    borderRadius: 6,
  },
  disconnectText: {
    color: '#fff',
    fontSize: 12,
    fontWeight: '600',
  },
  title: {
    fontSize: 24,
    fontWeight: 'bold',
    marginBottom: 30,
  },
  counter: {
    fontSize: 48,
    fontWeight: 'bold',
    color: '#0066cc',
    marginVertical: 20,
  },
  errorContainer: {
    alignItems: 'center',
    marginVertical: 20,
  },
  error: {
    color: 'red',
    fontSize: 16,
    textAlign: 'center',
    marginHorizontal: 20,
  },
  errorHint: {
    color: '#999',
    fontSize: 13,
    marginTop: 6,
  },
  refreshButton: {
    marginTop: 20,
    paddingHorizontal: 24,
    paddingVertical: 12,
    backgroundColor: '#0066cc',
    borderRadius: 8,
  },
  refreshText: {
    color: '#fff',
    fontSize: 16,
    fontWeight: '600',
  },
  buttonRow: {
    flexDirection: 'row',
    gap: 20,
    marginVertical: 20,
  },
  actionButton: {
    width: 60,
    height: 60,
    borderRadius: 30,
    justifyContent: 'center',
    alignItems: 'center',
  },
  incrementButton: {
    backgroundColor: '#28a745',
  },
  decrementButton: {
    backgroundColor: '#dc3545',
  },
  actionButtonText: {
    color: '#fff',
    fontSize: 32,
    fontWeight: 'bold',
  },
  hintText: {
    color: '#999',
    fontSize: 14,
    marginBottom: 10,
  },
});
