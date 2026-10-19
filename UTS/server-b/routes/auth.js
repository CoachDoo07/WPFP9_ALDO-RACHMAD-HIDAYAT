var express = require('express');
var router = express.Router();
const jwt = require('jsonwebtoken');
 
// dapatkan JWT untuk mengakses endpoint
router.post('/', function (req, res) {
  const { username, password } = req.body;
 
  if (username !== process.env.API_USER || password !== process.env.API_PASS) {
    return res.status(401).json({ status: false, message: 'Username / password salah' });
  }
 
  const token = jwt.sign({ username }, process.env.JWT_SECRET, { expiresIn: '1h' });
  return res.status(200).json({ status: true, message: 'Login berhasil', token: token });
});
 
module.exports = router;
 