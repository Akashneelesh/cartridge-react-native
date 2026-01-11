import AsyncStorage from '@react-native-async-storage/async-storage';
import * as WebBrowser from 'expo-web-browser';
import * as Linking from 'expo-linking';
import * as AuthSession from 'expo-auth-session';
import { ec } from 'starknet';
import { RPC_URL } from './starknet';

// Warm up the browser for faster auth session
WebBrowser.maybeCompleteAuthSession();

const PRIVATE_KEY_STORAGE_KEY = 'cartridge_session_private_key';
const SESSION_STORAGE_KEY = 'cartridge_session_data';
const KEYCHAIN_URL = 'https://x.cartridge.gg';

// App scheme from app.json
const APP_SCHEME = 'counterapp';

// Session policies for counter contract interactions
// Note: Simplified format without target - Cartridge session expects just method names
export const policies = [
  {
    method: 'increase_counter',
  },
  {
    method: 'decrease_counter',
  },
];

// Generate a valid Stark private key using starknet.js
function generateRandomKey(): string {
  const privateKey = ec.starkCurve.utils.randomPrivateKey();
  return '0x' + Array.from(privateKey).map(b => b.toString(16).padStart(2, '0')).join('');
}

// Get or create a session private key
export async function getOrCreatePrivateKey(): Promise<string> {
  let privateKey = await AsyncStorage.getItem(PRIVATE_KEY_STORAGE_KEY);

  if (privateKey) {
    try {
      ec.starkCurve.getStarkKey(privateKey);
    } catch {
      privateKey = null;
    }
  }

  if (!privateKey) {
    privateKey = generateRandomKey();
    await AsyncStorage.setItem(PRIVATE_KEY_STORAGE_KEY, privateKey);
  }

  return privateKey;
}

// Derive public key from private key
export function getPublicKey(privateKey: string): string {
  return ec.starkCurve.getStarkKey(privateKey);
}

// Build the session authorization URL
export function buildSessionUrl(publicKey: string, redirectUri: string): string {
  const policiesJson = policies.map(policy => ({
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

// Decode base64 string (React Native compatible)
function decodeBase64(base64: string): string {
  try {
    const chars = 'ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789+/=';
    let output = '';
    let i = 0;
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

// Parse session data from callback URL
export function parseSessionFromUrl(url: string): { address: string; username?: string } | null {
  try {
    const parsed = Linking.parse(url);
    console.log('Parsing URL:', url);
    console.log('Parsed URL params:', JSON.stringify(parsed.queryParams));

    // Check for session parameter (base64-encoded JSON)
    const sessionParam = parsed.queryParams?.session;
    if (sessionParam && typeof sessionParam === 'string') {
      try {
        const decoded = decodeBase64(sessionParam);
        console.log('Decoded session:', decoded);

        const jsonMatch = decoded.match(/\{.*\}/);
        if (!jsonMatch) {
          throw new Error('No JSON object found in decoded session');
        }

        const sessionData = JSON.parse(jsonMatch[0]);
        console.log('Session data:', JSON.stringify(sessionData, null, 2));

        if (sessionData.address) {
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
    const address = parsed.queryParams?.address;
    if (address && typeof address === 'string') {
      return { address };
    }

    return null;
  } catch (error) {
    console.error('Error parsing session URL:', error);
    return null;
  }
}

// Store session after successful authorization
export async function storeSessionData(
  sessionResult: { address: string; username?: string },
  publicKey: string,
  privateKey: string
): Promise<void> {
  await AsyncStorage.setItem(SESSION_STORAGE_KEY, JSON.stringify({
    address: sessionResult.address,
    username: sessionResult.username,
    publicKey,
    privateKey,
    timestamp: Date.now(),
  }));
}

// Open browser for session authorization
// NOTE: Expo Go has limited support for custom URL scheme redirects.
// For full functionality, use a development build: npx expo run:ios
export async function openSessionAuthorization(): Promise<{ address: string; username?: string } | null> {
  console.log('Starting session authorization...');

  try {
    const privateKey = await getOrCreatePrivateKey();
    const publicKey = getPublicKey(privateKey);

    console.log('Generated public key:', publicKey);

    // Create redirect URI using AuthSession for better platform support
    // This uses the deprecated auth proxy for Expo Go compatibility
    // For production, use a development build with custom scheme
    const redirectUri = AuthSession.makeRedirectUri({
      scheme: APP_SCHEME,
      path: 'session',
    });

    console.log('Redirect URI:', redirectUri);

    // Check if we're in Expo Go (exp:// scheme)
    const isExpoGo = redirectUri.startsWith('exp://');
    console.log('Is Expo Go:', isExpoGo);

    if (isExpoGo) {
      console.warn(
        'Running in Expo Go. Custom URL scheme redirects may not work properly. ' +
        'For full functionality, use a development build: npx expo run:ios'
      );
    }

    const sessionUrl = buildSessionUrl(publicKey, redirectUri);
    console.log('Opening session URL:', sessionUrl);

    // Use openAuthSessionAsync for OAuth/auth flows
    // On iOS, this uses ASWebAuthenticationSession which handles redirects
    const result = await WebBrowser.openAuthSessionAsync(sessionUrl, redirectUri);

    console.log('Auth result type:', result.type);

    if (result.type === 'success' && result.url) {
      console.log('Callback URL:', result.url);

      const sessionResult = parseSessionFromUrl(result.url);
      if (sessionResult) {
        await storeSessionData(sessionResult, publicKey, privateKey);
        return sessionResult;
      }

      console.log('No address found in callback');
    } else if (result.type === 'cancel') {
      console.log('Auth was cancelled by user');
    } else if (result.type === 'dismiss') {
      console.log('Auth was dismissed');
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
export async function getStoredSession(): Promise<{ address: string; privateKey?: string } | null> {
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
