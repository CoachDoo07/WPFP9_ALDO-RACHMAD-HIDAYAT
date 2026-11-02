const sendWhatsApp = require('./sendWhatsApp');

// Middleware notifikasi transaksi.
// Dipasang di route; setelah response selesai dikirim (event 'finish'),
// middleware ini otomatis kirim WA: sukses (status < 400) atau gagal.
// Handler boleh mengisi res.locals.ringkasan untuk detail tambahan di pesan.
function notifTransaksi(label) {
  return (req, res, next) => {
    res.on('finish', () => {
      const waktu = new Date().toLocaleString('id-ID', { timeZone: 'Asia/Jakarta' });
      const detail = res.locals.ringkasan ? `\n${res.locals.ringkasan}` : '';

      const pesan =
        res.statusCode < 400
          ? `*Notifikasi Transaksi*\n\n${label} berhasil.${detail}\nWaktu: ${waktu}`
          : `*Transaksi Gagal*\n\n${label} gagal (HTTP ${res.statusCode}).\nWaktu: ${waktu}`;

      sendWhatsApp(process.env.WA_ADMIN, pesan); // tanpa await: tidak menunda response
    });
    next();
  };
}

module.exports = notifTransaksi;
