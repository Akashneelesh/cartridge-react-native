import Controller from '@cartridge/controller';
import { CONTRACT_ADDRESS } from './starknet';

// Session policies for counter contract interactions
const policies = [
  {
    target: CONTRACT_ADDRESS,
    method: 'increase_counter',
  },
  {
    target: CONTRACT_ADDRESS,
    method: 'decrease_counter',
  },
];

// Cartridge Controller instance
export const controller = new Controller({
  policies,
  rpcUrl: 'https://api.cartridge.gg/x/starknet/sepolia',
});
