import { RpcProvider, Contract } from 'starknet';
import { COUNTER_ABI } from '../types/counter';
import { CONTRACT_ADDRESS, RPC_URL } from './constants';

// Re-export for backwards compatibility
export { CONTRACT_ADDRESS, RPC_URL };

// Use Cartridge RPC for better performance
const provider = new RpcProvider({
  nodeUrl: RPC_URL,
});

// Get contract instance for read-only operations
export function getCounterContract(): Contract {
  return new Contract({
    abi: COUNTER_ABI,
    address: CONTRACT_ADDRESS,
    providerOrAccount: provider,
  });
}

// Fetch current counter value from contract
export async function getCounterValue(): Promise<bigint> {
  const contract = getCounterContract();
  const result = await contract.get_counter();
  // starknet.js returns bigint for u128
  return result as bigint;
}
