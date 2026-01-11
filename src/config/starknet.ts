import { RpcProvider, Contract, constants } from 'starknet';
import { COUNTER_ABI } from '../types/counter';

// Starknet Sepolia provider
const provider = new RpcProvider({
  nodeUrl: constants.NetworkName.SN_SEPOLIA,
});

// Counter contract address on Sepolia
export const CONTRACT_ADDRESS =
  '0x075410d36a0690670137c3d15c01fcfa2ce094a4d0791dc769ef18c1c423a7f8';

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
