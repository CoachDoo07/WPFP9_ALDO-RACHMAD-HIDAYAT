const crypto = require('crypto');

// Hash password pakai scrypt (bawaan Node, tanpa install package baru)
// Format simpan: "salt:hash" (hex)
function hashPassword(password) {
  const salt = crypto.randomBytes(16).toString('hex');
  const hash = crypto.scryptSync(password, salt, 64).toString('hex');
  return `${salt}:${hash}`;
}

function verifyPassword(password, stored) {
  const [salt, hash] = String(stored || '').split(':');
  if (!salt || !hash) return false;
  const cek = crypto.scryptSync(password, salt, 64);
  return crypto.timingSafeEqual(cek, Buffer.from(hash, 'hex'));
}

module.exports = { hashPassword, verifyPassword };
