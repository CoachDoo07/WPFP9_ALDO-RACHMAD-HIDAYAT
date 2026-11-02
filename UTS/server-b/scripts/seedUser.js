// Buat / update user login.
// Pakai: node scripts/seedUser.js admin admin123 08xxxxxxxxxx
require('dotenv').config({ path: require('path').join(__dirname, '../.env') });
const db = require('../config/database');
const { hashPassword } = require('../config/password');

const [username, password, no_hp] = process.argv.slice(2);
if (!username || !password || !no_hp) {
  console.log('Pakai: node scripts/seedUser.js <username> <password> <no_hp>');
  process.exit(1);
}

db.query(
  `INSERT INTO users (username, password, no_hp) VALUES (?, ?, ?)
   ON DUPLICATE KEY UPDATE password = VALUES(password), no_hp = VALUES(no_hp)`,
  [username, hashPassword(password), no_hp],
  function (err) {
    if (err) console.error(err.message);
    else console.log('User "' + username + '" siap dipakai');
    process.exit(err ? 1 : 0);
  }
);
