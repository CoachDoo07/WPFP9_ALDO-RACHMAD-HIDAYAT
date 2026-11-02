const connection = require('../config/database');

function query(sql, params) {
  return new Promise((resolve, reject) => {
    connection.query(sql, params, (err, rows) => (err ? reject(err) : resolve(rows)));
  });
}

class Model_User {
  static async getByUsername(username) {
    const rows = await query('SELECT * FROM users WHERE username = ?', [username]);
    return rows[0] || null;
  }

  static setOtp(username, otpHash, expired) {
    return query(
      'UPDATE users SET reset_otp = ?, reset_expired = ?, reset_gagal = 0 WHERE username = ?',
      [otpHash, expired, username]
    );
  }

  static tambahGagal(username) {
    return query('UPDATE users SET reset_gagal = reset_gagal + 1 WHERE username = ?', [username]);
  }

  // ganti password sekaligus hapus OTP supaya tidak bisa dipakai ulang
  static updatePassword(username, passwordHash) {
    return query(
      'UPDATE users SET password = ?, reset_otp = NULL, reset_expired = NULL, reset_gagal = 0 WHERE username = ?',
      [passwordHash, username]
    );
  }
}

module.exports = Model_User;
