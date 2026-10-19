let mysql = require('mysql2');
 
let connection = mysql.createConnection({
  host: process.env.DB_HOST || 'localhost',
  user: process.env.DB_USER || 'root',
  password: process.env.DB_PASS || '',
  database: process.env.DB_NAME || 'db_a',
});
 
connection.connect(function (error) {
  if (error) {
    console.log(error);
  } else {
    console.log('Connection Success');
  }
});
 
module.exports = connection;