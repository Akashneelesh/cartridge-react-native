import { Text, View, StyleSheet } from 'react-native';
import { RpcProvider, constants } from 'starknet';

export default function App() {
  // Test that starknet.js loads without crashing
  const provider = new RpcProvider({
    nodeUrl: constants.NetworkName.SN_SEPOLIA,
  });

  return (
    <View style={styles.container}>
      <Text style={styles.title}>Starknet Counter</Text>
      <Text>Provider initialized: {provider ? 'Yes' : 'No'}</Text>
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
    marginBottom: 20,
  },
});
