// ABI for counter contract functions
// get_counter returns u128 which starknet.js represents as bigint
// increase_counter and decrease_counter modify the counter value
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
