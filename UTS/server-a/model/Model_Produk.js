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
}
 
module.exports = Model_Produk;
 