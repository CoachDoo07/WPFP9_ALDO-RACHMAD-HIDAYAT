const connection = require('../config/database');
 
class Model_Kategori {
  static async getAll() {
    return new Promise((resolve, reject) => {
      connection.query('SELECT * FROM kategori ORDER BY id', function (err, rows) {
        if (err) {
          reject(err);
        } else {
          resolve(rows);
        }
      });
    });
  }
 
  // simpan data (tetap terenkripsi); kalau id sudah ada -> update
  static async upsert(data) {
    return new Promise((resolve, reject) => {
      connection.query(
        `INSERT INTO kategori (id, nama_kategori) VALUES (?, ?)
         ON DUPLICATE KEY UPDATE nama_kategori = VALUES(nama_kategori)`,
        [data.id, data.nama_kategori],
        function (err, result) {
          if (err) {
            reject(err);
          } else {
            resolve(result);
          }
        }
      );
    });
  }
}
 
module.exports = Model_Kategori;
 