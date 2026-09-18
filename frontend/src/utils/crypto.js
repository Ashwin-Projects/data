/**
 * Web Crypto API utilities for client-side AES-GCM-256 envelope encryption.
 */

// Helper to convert ArrayBuffer to Hex string
function bufferToHex(buffer) {
  return Array.from(new Uint8Array(buffer))
    .map(b => b.toString(16).padStart(2, '0'))
    .join('');
}

// Helper to convert Hex string to Uint8Array
function hexToBuffer(hex) {
  const bytes = new Uint8Array(hex.length / 2);
  for (let i = 0; i < hex.length; i += 2) {
    bytes[i / 2] = parseInt(hex.substring(i, i + 2), 16);
  }
  return bytes.buffer;
}

// Derive a cryptographic key from password + salt using PBKDF2
async function deriveKey(password, saltBuffer) {
  const enc = new TextEncoder();
  
  // Import the raw password as a key material
  const keyMaterial = await window.crypto.subtle.importKey(
    'raw',
    enc.encode(password),
    { name: 'PBKDF2' },
    false,
    ['deriveBits', 'deriveKey']
  );
  
  // Derive the AES-GCM key
  return await window.crypto.subtle.deriveKey(
    {
      name: 'PBKDF2',
      salt: saltBuffer,
      iterations: 100000,
      hash: 'SHA-256'
    },
    keyMaterial,
    { name: 'AES-GCM', length: 256 },
    false,
    ['encrypt', 'decrypt']
  );
}

/**
 * Encrypts a string using AES-GCM-256.
 * @param {string} plaintext - The data to encrypt
 * @param {string} password - User passphrase
 * @returns {Promise<string>} Stringified JSON containing { ciphertext, iv, salt }
 */
export async function encryptPayload(plaintext, password) {
  try {
    const enc = new TextEncoder();
    
    // Generate salt and IV
    const salt = window.crypto.getRandomValues(new Uint8Array(16));
    const iv = window.crypto.getRandomValues(new Uint8Array(12));
    
    // Derive AES-GCM Key
    const key = await deriveKey(password, salt);
    
    // Encrypt plaintext
    const ciphertextBuffer = await window.crypto.subtle.encrypt(
      {
        name: 'AES-GCM',
        iv: iv
      },
      key,
      enc.encode(plaintext)
    );
    
    // Return structured payload representation
    return JSON.stringify({
      ciphertext: bufferToHex(ciphertextBuffer),
      iv: bufferToHex(iv.buffer),
      salt: bufferToHex(salt.buffer)
    });
  } catch (error) {
    console.error('Encryption failed:', error);
    throw new Error('Failed to encrypt payload client-side.');
  }
}

/**
 * Decrypts a stringified JSON envelope using AES-GCM-256.
 * @param {string} envelopeStr - Stringified JSON containing { ciphertext, iv, salt }
 * @param {string} password - User passphrase
 * @returns {Promise<string>} Plaintext string
 */
export async function decryptPayload(envelopeStr, password) {
  try {
    const envelope = JSON.parse(envelopeStr);
    if (!envelope.ciphertext || !envelope.iv || !envelope.salt) {
      throw new Error('Invalid encryption envelope structure.');
    }
    
    const dec = new TextDecoder();
    
    // Convert hex strings back to buffers
    const ciphertext = hexToBuffer(envelope.ciphertext);
    const iv = hexToBuffer(envelope.iv);
    const salt = hexToBuffer(envelope.salt);
    
    // Derive AES-GCM Key
    const key = await deriveKey(password, salt);
    
    // Decrypt ciphertext
    const decryptedBuffer = await window.crypto.subtle.decrypt(
      {
        name: 'AES-GCM',
        iv: iv
      },
      key,
      ciphertext
    );
    
    return dec.decode(decryptedBuffer);
  } catch (error) {
    console.error('Decryption failed:', error);
    throw new Error('Authentication failed or invalid passphrase.');
  }
}
