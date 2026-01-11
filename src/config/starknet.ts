import { RpcProvider, Contract, Account, constants } from 'starknet';
import { COUNTER_ABI } from '../types/counter';
import { CONTRACT_ADDRESS, RPC_URL } from './constants';
import { getStoredSession } from './wallet';

// Re-export for backwards compatibility
export { CONTRACT_ADDRESS, RPC_URL };

// Starknet Sepolia provider
const provider = new RpcProvider({
  nodeUrl: constants.NetworkName.SN_SEPOLIA,
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

// Get session account for transaction signing
export async function getSessionAccount(): Promise<Account | null> {
  const session = await getStoredSession();
  if (!session || !session.address || !session.privateKey) {
    return null;
  }
  return new Account({
    provider,
    address: session.address,
    signer: session.privateKey,
  });
}

// Execute counter transaction (increase or decrease)
export async function executeCounterTransaction(
  method: 'increase_counter' | 'decrease_counter',
  amount: bigint = 1n
): Promise<string> {
  const account = await getSessionAccount();
  if (!account) {
    throw new Error('Wallet not connected');
  }

  const result = await account.execute({
    contractAddress: CONTRACT_ADDRESS,
    entrypoint: method,
    calldata: [amount.toString()],
  });

  return result.transaction_hash;
}
