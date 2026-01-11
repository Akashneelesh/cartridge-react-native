import { useEffect, useState } from 'react';
import {
  Text,
  View,
  StyleSheet,
  ActivityIndicator,
  TouchableOpacity,
} from 'react-native';
import { getCounterValue } from './src/config/starknet';

export default function App() {
  const [counter, setCounter] = useState<bigint | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

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

  return (
    <View style={styles.container}>
      <Text style={styles.title}>Starknet Counter</Text>

      {loading && <ActivityIndicator size="large" color="#0066cc" />}

      {error && <Text style={styles.error}>{error}</Text>}

      {!loading && !error && counter !== null && (
        <Text style={styles.counter}>{counter.toString()}</Text>
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
});
