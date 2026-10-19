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
}
 
module.exports = Model_Kategori;
 