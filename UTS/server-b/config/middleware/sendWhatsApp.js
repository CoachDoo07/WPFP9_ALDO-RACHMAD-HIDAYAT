// Kirim pesan WhatsApp lewat Fonnte (https://fonnte.com)
// Token & nomor diambil dari .env supaya tidak ikut ter-commit ke GitHub
// Pesan masuk antrian dan dikirim satu per satu dengan jeda, supaya tidak
// terlihat seperti spam (mengurangi risiko nomor kena banned)
const JEDA_MS = 4000;
let antrian = Promise.resolve();

const kirim = async (target, message) => {
  const tokenFonnte = process.env.FONNTE_TOKEN;

  if (!tokenFonnte || !target) {
    console.warn('WhatsApp tidak dikirim: FONNTE_TOKEN atau nomor tujuan kosong');
    return false;
  }

  try {
    const params = new URLSearchParams();
    params.append('target', target);
    params.append('message', message);
    params.append('countryCode', '62');

    const response = await fetch('https://api.fonnte.com/send', {
      method: 'POST',
      headers: { Authorization: tokenFonnte },
      body: params,
      signal: AbortSignal.timeout(8000), // jangan menggantung kalau Fonnte lambat
    });

    return await response.json();
  } catch (error) {
    console.error('Gagal mengirim WhatsApp:', error.message);
    return false;
  }
};

const sendWhatsApp = (target, message) => {
  const hasil = antrian.then(() => kirim(target, message));
  // jeda sebelum pesan berikutnya boleh jalan, apa pun hasilnya
  antrian = hasil.catch(() => {}).then(() => new Promise((r) => setTimeout(r, JEDA_MS)));
  return hasil;
};

module.exports = sendWhatsApp;
