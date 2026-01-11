// Minimal ABI for counter contract get_counter view function
// Returns u128 which starknet.js represents as bigint
export const COUNTER_ABI = [
  {
    type: 'function',
    name: 'get_counter',
    inputs: [],
    outputs: [{ type: 'core::integer::u128' }],
    state_mutability: 'view',
  },
] as const;
