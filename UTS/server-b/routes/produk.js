var express = require('express');
var router = express.Router();
 
const Model_Produk = require('../model/Model_Produk');
const verifyToken = require('../config/middleware/authMiddleware');
const { decrypt } = require('../../crypto');
 
// Langkah 2: terima data terenkripsi dari Server A, simpan ke DB B (tetap terenkripsi)
router.post('/', async function (req, res) {
  try {
    const rows = req.body;
    if (!Array.isArray(rows)) {
      return res.status(400).json({ status: false, message: 'Body harus berupa array' });
    }
 
    for (const p of rows) {
      await Model_Produk.upsert(p);
    }
 
    return res.status(200).json({ status: true, message: 'Data Produk tersimpan (terenkripsi)', jumlah: rows.length });
  } catch (err) {
    return res.status(500).json({ status: false, message: 'Gagal menyimpan', error: err.message });
  }
});
 
// Langkah 3 & 4: GET dari DB B -> DECRYPT -> kirim ke endpoint (wajib JWT)
router.get('/', verifyToken, async function (req, res) {
  try {
    const rows = await Model_Produk.getAll();
 
    const data = rows.map((p) => ({
      id: p.id,
      nama_produk: decrypt(p.nama_produk),
      harga_produk: Number(decrypt(p.harga_produk)),
      foto_produk: decrypt(p.foto_produk),
      id_kategori: p.id_kategori,
    }));
 
    return res.status(200).json({ status: true, message: 'Data Produk', data: data });
  } catch (err) {
    return res.status(500).json({ status: false, message: 'Gagal mengambil data', error: err.message });
  }
});
 
module.exports = router;
 