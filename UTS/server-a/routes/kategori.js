const express = require('express');
const router = express.Router();
const Model_Kategori = require('../model/Model_Kategori');

router.get('/', async function (req, res) {
  try {
    const rows = await Model_Kategori.getAll();
    return res.status(200).json({ status: true, message: 'Data Kategori (Server A)', data: rows });
  } catch (err) {
    return res.status(500).json({ status: false, message: 'Gagal mengambil data', error: err.message });
  }
});

module.exports = router;