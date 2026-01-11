// ABI for counter contract with read and write functions
// Returns u128 which starknet.js represents as bigint
export const COUNTER_ABI = [
  {
    type: 'function',
    name: 'get_counter',
    inputs: [],
    outputs: [{ type: 'core::integer::u128' }],
    state_mutability: 'view',
  },
  {
    type: 'function',
    name: 'increase_counter',
    inputs: [{ name: 'amount', type: 'core::integer::u128' }],
    outputs: [],
    state_mutability: 'external',
  },
  {
    type: 'function',
    name: 'decrease_counter',
    inputs: [{ name: 'amount', type: 'core::integer::u128' }],
    outputs: [],
    state_mutability: 'external',
  },
] as const;
