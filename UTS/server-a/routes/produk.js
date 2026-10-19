const express = require('express');
const router = express.Router();
const Model_Produk = require('../model/Model_Produk');

router.get('/', async function (req, res) {
  try {
    const rows = await Model_Produk.getAll();
    return res.status(200).json({ status: true, message: 'Data Produk (Server A)', data: rows });
  } catch (err) {
    return res.status(500).json({ status: false, message: 'Gagal mengambil data', error: err.message });
  }
});

module.exports = router;