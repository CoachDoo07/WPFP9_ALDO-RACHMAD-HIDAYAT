require('dotenv').config({ path: require('path').join(__dirname, '.env') });

var express = require('express');
var cors = require('cors');
var authRouter = require('./routes/auth');
var kategoriRouter = require('./routes/kategori');
var produkRouter = require('./routes/produk');

var app = express();

app.use(cors());
app.use(express.json({ limit: '10mb' }));

// routing
app.use('/api/login', authRouter);
app.use('/api/kategori', kategoriRouter);
app.use('/api/produk', produkRouter);

// 404
app.use(function (req, res) {
  res.status(404).json({ status: false, message: 'Route tidak ditemukan' });
});

// error handler
app.use(function (err, req, res, next) {
  res.status(err.status || 500).json({ status: false, message: err.message });
});

module.exports = app;