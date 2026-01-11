/**
 * Converts technical errors to user-friendly messages
 */
export function getUserFriendlyError(
  error: unknown,
  context: 'counter' | 'wallet' | 'transaction'
): string {
  const message =
    error instanceof Error ? error.message.toLowerCase() : String(error).toLowerCase();

  // Network/connection errors
  if (
    message.includes('network') ||
    message.includes('fetch') ||
    message.includes('timeout') ||
    message.includes('econnrefused') ||
    message.includes('unable to connect')
  ) {
    return 'Unable to connect. Check your internet connection.';
  }

  // User cancelled
  if (message.includes('cancelled') || message.includes('canceled')) {
    return 'Connection cancelled.';
  }

  // Transaction rejected
  if (message.includes('rejected') || message.includes('denied')) {
    return 'Transaction was rejected.';
  }

  // Contract errors
  if (message.includes('contract') || message.includes('revert')) {
    return 'Smart contract error. Please try again.';
  }

  // Context-specific defaults
  switch (context) {
    case 'counter':
      return 'Failed to load counter. Please try again.';
    case 'wallet':
      return 'Wallet connection failed. Please try again.';
    case 'transaction':
      return 'Transaction failed. Please try again.';
    default:
      return 'Something went wrong. Please try again.';
  }
}
