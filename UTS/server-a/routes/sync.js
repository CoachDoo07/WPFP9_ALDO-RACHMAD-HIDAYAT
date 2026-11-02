var express = require('express');
var router = express.Router();
 
const Model_Kategori = require('../model/Model_Kategori');
const Model_Produk = require('../model/Model_Produk');
const { encrypt } = require('../../crypto');
const notifTransaksi = require('../config/middleware/notifTransaksi');
 
// kirim data (sudah terenkripsi) ke Server B
async function kirimKeServerB(path, body) {
  const r = await fetch(process.env.SERVER_B_URL + path, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify(body),
  });
  return { ok: r.ok, status: r.status, body: await r.json() };
}
 
// Langkah 1: ambil dari DB A -> ENCRYPT -> POST ke Server B
// notifTransaksi dipasang sebagai middleware: kirim WA setelah response selesai
router.post('/', notifTransaksi('Sinkronisasi data ke Server B'), async function (req, res) {
  try {
    const kategori = await Model_Kategori.getAll();
    const produk = await Model_Produk.getAll();
 
    const kategoriEnc = kategori.map((k) => ({
      id: k.id,
      nama_kategori: encrypt(k.nama_kategori),
    }));
 
    const produkEnc = produk.map((p) => ({
      id: p.id,
      nama_produk: encrypt(p.nama_produk),
      harga_produk: encrypt(p.harga_produk),
      foto_produk: encrypt(p.foto_produk),
      id_kategori: p.id_kategori,
    }));
 
    const hasilKategori = await kirimKeServerB('/api/kategori', kategoriEnc);
    if (!hasilKategori.ok) {
      return res.status(502).json({ status: false, message: 'Server B menolak data kategori', detail: hasilKategori.body });
    }
 
    const hasilProduk = await kirimKeServerB('/api/produk', produkEnc);
    if (!hasilProduk.ok) {
      return res.status(502).json({ status: false, message: 'Server B menolak data produk', detail: hasilProduk.body });
    }
 
    // detail tambahan untuk isi pesan WA
    res.locals.ringkasan = `Kategori: ${kategoriEnc.length} data\nProduk: ${produkEnc.length} data`;

    return res.status(200).json({
      status: true,
      message: 'Data terenkripsi berhasil dikirim ke Server B',
      contoh_data_terkirim: { kategori: kategoriEnc[0] || null, produk: produkEnc[0] || null },
    });
  } catch (err) {
    return res.status(500).json({ status: false, message: 'Gagal sync', error: err.message });
  }
});
 
module.exports = router;
