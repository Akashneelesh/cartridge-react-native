import { useEffect, useState } from 'react';
import {
  Text,
  View,
  StyleSheet,
  ActivityIndicator,
  TouchableOpacity,
} from 'react-native';
import { getCounterValue, executeCounterTransaction } from './src/config/starknet';
import { useWallet } from './src/hooks/useWallet';

const truncateAddress = (addr: string) =>
  `${addr.slice(0, 6)}...${addr.slice(-4)}`;

export default function App() {
  const [counter, setCounter] = useState<bigint | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [txPending, setTxPending] = useState(false);
  const [txError, setTxError] = useState<string | null>(null);
  const { address, isConnecting, error: walletError, connect, disconnect, isConnected } = useWallet();

  const fetchCounter = async () => {
    setLoading(true);
    setError(null);
    try {
      const value = await getCounterValue();
      setCounter(value);
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Failed to fetch counter');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchCounter();
  }, []);

  const handleTransaction = async (method: 'increase_counter' | 'decrease_counter') => {
    setTxPending(true);
    setTxError(null);
    try {
      await executeCounterTransaction(method);
      await fetchCounter();
    } catch (err) {
      setTxError(err instanceof Error ? err.message : 'Transaction failed');
    } finally {
      setTxPending(false);
    }
  };

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

      {error && <Text style={styles.error}>{error}</Text>}

      {!loading && !error && counter !== null && (
        <Text style={styles.counter}>{counter.toString()}</Text>
      )}

      {/* Increment/Decrement Buttons */}
      <View style={styles.buttonRow}>
        <TouchableOpacity
          style={[
            styles.actionButton,
            styles.decrementButton,
            (!isConnected || txPending || loading) && styles.actionButtonDisabled,
          ]}
          onPress={() => handleTransaction('decrease_counter')}
          disabled={!isConnected || txPending || loading}
        >
          <Text style={styles.actionButtonText}>-</Text>
        </TouchableOpacity>
        <TouchableOpacity
          style={[
            styles.actionButton,
            styles.incrementButton,
            (!isConnected || txPending || loading) && styles.actionButtonDisabled,
          ]}
          onPress={() => handleTransaction('increase_counter')}
          disabled={!isConnected || txPending || loading}
        >
          <Text style={styles.actionButtonText}>+</Text>
        </TouchableOpacity>
      </View>

      {/* Transaction Status */}
      {txPending && (
        <View style={styles.txStatus}>
          <ActivityIndicator size="small" color="#0066cc" />
          <Text style={styles.txStatusText}>Transaction pending...</Text>
        </View>
      )}

      {txError && <Text style={styles.txError}>{txError}</Text>}

      {!isConnected && (
        <Text style={styles.hintText}>Connect wallet to modify counter</Text>
      )}

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
  error: {
    color: 'red',
    fontSize: 16,
    textAlign: 'center',
    marginHorizontal: 20,
    marginVertical: 20,
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
  actionButtonDisabled: {
    opacity: 0.4,
  },
  decrementButton: {
    backgroundColor: '#dc3545',
  },
  incrementButton: {
    backgroundColor: '#28a745',
  },
  actionButtonText: {
    color: '#fff',
    fontSize: 32,
    fontWeight: 'bold',
  },
  txStatus: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 8,
    marginBottom: 10,
  },
  txStatusText: {
    color: '#666',
    fontSize: 14,
  },
  txError: {
    color: 'red',
    fontSize: 14,
    textAlign: 'center',
    marginBottom: 10,
    maxWidth: 250,
  },
  hintText: {
    color: '#999',
    fontSize: 12,
    marginBottom: 10,
  },
});
