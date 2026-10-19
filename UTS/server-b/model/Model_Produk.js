const connection = require('../config/database');
 
class Model_Produk {
  static async getAll() {
    return new Promise((resolve, reject) => {
      connection.query('SELECT * FROM produk ORDER BY id', function (err, rows) {
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
        `INSERT INTO produk (id, nama_produk, harga_produk, foto_produk, id_kategori)
         VALUES (?, ?, ?, ?, ?)
         ON DUPLICATE KEY UPDATE
           nama_produk = VALUES(nama_produk),
           harga_produk = VALUES(harga_produk),
           foto_produk = VALUES(foto_produk),
           id_kategori = VALUES(id_kategori)`,
        [data.id, data.nama_produk, data.harga_produk, data.foto_produk, data.id_kategori],
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
 
module.exports = Model_Produk;
 