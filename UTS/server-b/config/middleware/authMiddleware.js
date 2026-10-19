const jwt = require('jsonwebtoken');
 
// Cek JWT dari header:  Authorization: Bearer <token>
function verifyToken(req, res, next) {
  const token = (req.headers.authorization || '').split(' ')[1];
 
  if (!token) {
    return res.status(401).json({ status: false, message: 'Token tidak ada' });
  }
 
  try {
    req.user = jwt.verify(token, process.env.JWT_SECRET);
    next();
  } catch (err) {
    return res.status(403).json({ status: false, message: 'Token tidak valid atau kadaluarsa' });
  }
}
 
module.exports = verifyToken;
 