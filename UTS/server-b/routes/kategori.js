var express = require('express');
var router = express.Router();
 
const Model_Kategori = require('../model/Model_Kategori');
const verifyToken = require('../config/middleware/authMiddleware');
const { decrypt } = require('../../crypto');
 
// Langkah 2: terima data terenkripsi dari Server A, simpan ke DB B (tetap terenkripsi)
router.post('/', async function (req, res) {
  try {
    const rows = req.body;
    if (!Array.isArray(rows)) {
      return res.status(400).json({ status: false, message: 'Body harus berupa array' });
    }
 
    for (const k of rows) {
      await Model_Kategori.upsert(k);
    }
 
    return res.status(200).json({ status: true, message: 'Data Kategori tersimpan (terenkripsi)', jumlah: rows.length });
  } catch (err) {
    return res.status(500).json({ status: false, message: 'Gagal menyimpan', error: err.message });
  }
});
 
// Langkah 3 & 4: GET dari DB B -> DECRYPT -> kirim ke endpoint (wajib JWT)
router.get('/', verifyToken, async function (req, res) {
  try {
    const rows = await Model_Kategori.getAll();
 
    const data = rows.map((k) => ({
      id: k.id,
      nama_kategori: decrypt(k.nama_kategori),
    }));
 
    return res.status(200).json({ status: true, message: 'Data Kategori', data: data });
  } catch (err) {
    return res.status(500).json({ status: false, message: 'Gagal mengambil data', error: err.message });
  }
});
 
module.exports = router;
 