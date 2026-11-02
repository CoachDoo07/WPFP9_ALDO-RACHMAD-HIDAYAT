const sendWhatsApp = require('./sendWhatsApp');

const waktu = () => new Date().toLocaleString('id-ID', { timeZone: 'Asia/Jakarta' });

// 1) Watchdog: server yang mati tidak bisa lapor sendiri,
//    jadi server lain yang mengecek endpoint /api/health secara berkala.
function mulaiMonitor({ nama, url, interval = 10000, timeout = 3000, batasGagal = 3 }) {
  let gagal = 0;
  let down = false;

  async function cek() {
    try {
      const r = await fetch(url, { signal: AbortSignal.timeout(timeout) });
      if (!r.ok) throw new Error('status ' + r.status);

      gagal = 0;
      if (down) {
        down = false;
        sendWhatsApp(process.env.WA_ADMIN, `*Server Pulih*\n\n${nama} sudah online lagi.\nWaktu: ${waktu()}`);
      }
    } catch (err) {
      gagal++;
      if (gagal >= batasGagal && !down) {
        down = true; // kirim sekali saja sampai server pulih (anti-spam)
        sendWhatsApp(
          process.env.WA_ADMIN,
          `*PERINGATAN: Server Loss*\n\n${nama} tidak dapat diakses (${gagal}x gagal berturut-turut).\nAlasan: ${err.message}\nWaktu: ${waktu()}`
        );
      }
    }
  }

  setInterval(cek, interval);
  console.log(`Monitor ${nama} aktif (cek tiap ${interval / 1000} detik)`);
}

// 2) Server sendiri mati / crash -> kirim WA dulu baru exit
function pasangNotifShutdown(nama) {
  let sudah = false;

  async function berhenti(alasan, kode) {
    if (sudah) return;
    sudah = true;
    await Promise.race([
      sendWhatsApp(process.env.WA_ADMIN, `*PERINGATAN: Server Loss*\n\n${nama} berhenti: ${alasan}\nWaktu: ${waktu()}`),
      new Promise((r) => setTimeout(r, 4000)),
    ]);
    process.exit(kode);
  }

  process.on('SIGINT', () => berhenti('dimatikan manual (SIGINT)', 0));
  process.on('SIGTERM', () => berhenti('dimatikan (SIGTERM)', 0));
  process.on('uncaughtException', (err) => {
    console.error(err);
    berhenti('crash - ' + err.message, 1);
  });
  process.on('unhandledRejection', (err) => {
    console.error(err);
    berhenti('unhandled rejection - ' + (err && err.message), 1);
  });
}

module.exports = { mulaiMonitor, pasangNotifShutdown };
