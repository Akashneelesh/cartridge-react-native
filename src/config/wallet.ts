import AsyncStorage from '@react-native-async-storage/async-storage';
import * as WebBrowser from 'expo-web-browser';
import * as Linking from 'expo-linking';
import { ec, stark } from 'starknet';
import { CONTRACT_ADDRESS, RPC_URL } from './constants';

// Warm up the browser for faster auth session
WebBrowser.maybeCompleteAuthSession();

const PRIVATE_KEY_STORAGE_KEY = 'cartridge_session_private_key';
const SESSION_STORAGE_KEY = 'cartridge_session_data';
const KEYCHAIN_URL = 'https://x.cartridge.gg';

// Session policies for counter contract interactions
export const policies = [
  {
    target: CONTRACT_ADDRESS,
    method: 'increase_counter',
  },
  {
    target: CONTRACT_ADDRESS,
    method: 'decrease_counter',
  },
];

// Generate a valid Stark private key using starknet.js
function generateRandomKey(): string {
  // Use the proper method to generate a random private key for Stark curve
  const privateKey = ec.starkCurve.utils.randomPrivateKey();
  // Convert Uint8Array to hex string
  return '0x' + Array.from(privateKey).map(b => b.toString(16).padStart(2, '0')).join('');
}

// Get or create a session private key
export async function getOrCreatePrivateKey(): Promise<string> {
  let privateKey = await AsyncStorage.getItem(PRIVATE_KEY_STORAGE_KEY);

  // Validate existing key or generate new one
  if (privateKey) {
    try {
      // Test if key is valid by trying to derive public key
      ec.starkCurve.getStarkKey(privateKey);
    } catch {
      // Invalid key, regenerate
      privateKey = null;
    }
  }

  if (!privateKey) {
    privateKey = generateRandomKey();
    await AsyncStorage.setItem(PRIVATE_KEY_STORAGE_KEY, privateKey);
  }

  return privateKey;
}

// Derive public key from private key using starknet.js
export function getPublicKey(privateKey: string): string {
  return ec.starkCurve.getStarkKey(privateKey);
}

// Build the session authorization URL (matching Cartridge's expected format)
export function buildSessionUrl(publicKey: string, redirectUri: string): string {
  const policiesJson = policies.map(policy => ({
    target: policy.target,
    method: policy.method,
  }));

  const params = new URLSearchParams({
    public_key: publicKey,
    redirect_uri: redirectUri,
    policies: JSON.stringify(policiesJson),
    rpc_url: RPC_URL,
  });

  return `${KEYCHAIN_URL}/session?${params.toString()}`;
}

// Decode base64 string (works in React Native)
function decodeBase64(base64: string): string {
  // Use atob if available, otherwise use Buffer-like approach
  try {
    // React Native doesn't have atob, so we use a manual decode
    const chars = 'ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789+/=';
    let output = '';
    let i = 0;

    // Remove any characters that are not in the base64 characters list
    const input = base64.replace(/[^A-Za-z0-9+/=]/g, '');

    while (i < input.length) {
      const enc1 = chars.indexOf(input.charAt(i++));
      const enc2 = chars.indexOf(input.charAt(i++));
      const enc3 = chars.indexOf(input.charAt(i++));
      const enc4 = chars.indexOf(input.charAt(i++));

      const chr1 = (enc1 << 2) | (enc2 >> 4);
      const chr2 = ((enc2 & 15) << 4) | (enc3 >> 2);
      const chr3 = ((enc3 & 3) << 6) | enc4;

      output += String.fromCharCode(chr1);
      if (enc3 !== 64) output += String.fromCharCode(chr2);
      if (enc4 !== 64) output += String.fromCharCode(chr3);
    }

    return output;
  } catch {
    return '';
  }
}

// Open browser for session authorization
export async function openSessionAuthorization(): Promise<{ address: string; username?: string } | null> {
  console.log('Starting session authorization...');

  try {
    const privateKey = await getOrCreatePrivateKey();
    const publicKey = getPublicKey(privateKey);

    console.log('Generated public key:', publicKey);

    // Create redirect URI using expo-linking
    const redirectUri = Linking.createURL('session');

    const sessionUrl = buildSessionUrl(publicKey, redirectUri);

    console.log('Opening session URL:', sessionUrl);
    console.log('Redirect URI:', redirectUri);

    // Use openAuthSessionAsync to handle the redirect
    // preferEphemeralSession gives us a clean browser without cached cookies
    const result = await WebBrowser.openAuthSessionAsync(sessionUrl, redirectUri, {
      preferEphemeralSession: true,
    });

    console.log('Auth result type:', result.type);

    if (result.type === 'success' && result.url) {
      console.log('Callback URL:', result.url);

      // Parse the callback URL
      const url = Linking.parse(result.url);

      // Check for session parameter (base64-encoded JSON)
      const sessionParam = url.queryParams?.session;
      if (sessionParam && typeof sessionParam === 'string') {
        try {
          const decoded = decodeBase64(sessionParam);
          console.log('Decoded session:', decoded);

          // Extract just the JSON part (in case of trailing characters)
          const jsonMatch = decoded.match(/\{.*\}/);
          if (!jsonMatch) {
            throw new Error('No JSON object found in decoded session');
          }

          const sessionData = JSON.parse(jsonMatch[0]);
          console.log('Session data:', JSON.stringify(sessionData, null, 2));

          if (sessionData.address) {
            // Store session data
            await AsyncStorage.setItem(SESSION_STORAGE_KEY, JSON.stringify({
              address: sessionData.address,
              username: sessionData.username,
              ownerGuid: sessionData.ownerGuid,
              expiresAt: sessionData.expiresAt,
              publicKey,
              privateKey,
              timestamp: Date.now(),
            }));

            return {
              address: sessionData.address,
              username: sessionData.username,
            };
          }
        } catch (parseError) {
          console.error('Failed to parse session data:', parseError);
        }
      }

      // Fallback: try direct address parameter
      const address = url.queryParams?.address;
      if (address && typeof address === 'string') {
        await AsyncStorage.setItem(SESSION_STORAGE_KEY, JSON.stringify({
          address,
          publicKey,
          privateKey,
          timestamp: Date.now(),
        }));
        return { address };
      }

      console.log('No address found in callback');
    }

    return null;
  } catch (error) {
    console.error('Session authorization error:', error);
    throw error;
  }
}

// Store session after user provides their address
export async function saveSession(address: string): Promise<void> {
  const privateKey = await getOrCreatePrivateKey();
  const publicKey = getPublicKey(privateKey);

  await AsyncStorage.setItem(SESSION_STORAGE_KEY, JSON.stringify({
    address,
    publicKey,
    privateKey,
    timestamp: Date.now(),
  }));
}

// Get stored session data
export async function getStoredSession(): Promise<{ address: string } | null> {
  try {
    const data = await AsyncStorage.getItem(SESSION_STORAGE_KEY);
    if (data) {
      return JSON.parse(data);
    }
    return null;
  } catch {
    return null;
  }
}

// Clear session data and key pair (allows switching to a different account)
export async function clearSession(): Promise<void> {
  await AsyncStorage.removeItem(SESSION_STORAGE_KEY);
  await AsyncStorage.removeItem(PRIVATE_KEY_STORAGE_KEY);
}
