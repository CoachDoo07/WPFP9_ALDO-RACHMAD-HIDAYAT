// crypto.js — dipakai di Server A (encrypt) dan Server B (decrypt)
// Pastikan ENC_KEY di .env kedua server SAMA (32 byte, format hex = 64 karakter)
const crypto = require('crypto');
 
const ALGO = 'aes-256-gcm';
 
function getKey() {
  const key = Buffer.from(process.env.ENC_KEY || '', 'hex');
  if (key.length !== 32) {
    throw new Error('ENC_KEY harus 32 byte (64 karakter hex)');
  }
  return key;
}
 
// Hasil: "iv.authTag.ciphertext" (masing-masing base64)
function encrypt(value) {
  if (value === null || value === undefined) return null;
 
  const iv = crypto.randomBytes(12); // IV baru tiap enkripsi
  const cipher = crypto.createCipheriv(ALGO, getKey(), iv);
  const enc = Buffer.concat([cipher.update(String(value), 'utf8'), cipher.final()]);
  const tag = cipher.getAuthTag();
 
  return [iv, tag, enc].map((b) => b.toString('base64')).join('.');
}
 
function decrypt(payload) {
  if (payload === null || payload === undefined) return null;
 
  const [iv, tag, enc] = payload.split('.').map((p) => Buffer.from(p, 'base64'));
  const decipher = crypto.createDecipheriv(ALGO, getKey(), iv);
  decipher.setAuthTag(tag);
 
  return Buffer.concat([decipher.update(enc), decipher.final()]).toString('utf8');
}
 
module.exports = { encrypt, decrypt };