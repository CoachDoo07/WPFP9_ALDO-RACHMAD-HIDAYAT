var express = require('express');
var router = express.Router();
const crypto = require('crypto');
const jwt = require('jsonwebtoken');

const Model_User = require('../model/Model_User');
const { hashPassword, verifyPassword } = require('../config/password');
const sendWhatsApp = require('../config/middleware/sendWhatsApp');

const OTP_MENIT = Number(process.env.OTP_MENIT) || 10;
const MAKS_GAGAL = 5;
const sha = (s) => crypto.createHash('sha256').update(String(s)).digest('hex');

// POST /api/login  -> dapatkan JWT
router.post('/', async function (req, res) {
  try {
    const { username, password } = req.body;
    const user = username && (await Model_User.getByUsername(username));

    if (!user || !verifyPassword(String(password || ''), user.password)) {
      return res.status(401).json({ status: false, message: 'Username / password salah' });
    }

    const token = jwt.sign({ username }, process.env.JWT_SECRET, { expiresIn: '1h' });
    return res.status(200).json({ status: true, message: 'Login berhasil', token: token });
  } catch (err) {
    return res.status(500).json({ status: false, message: 'Gagal login', error: err.message });
  }
});

// POST /api/login/forgot  { username } -> kirim OTP ke WhatsApp
router.post('/forgot', async function (req, res) {
  // respons selalu sama supaya orang tidak bisa menebak username yang terdaftar
  const generik = { status: true, message: 'Jika akun terdaftar, kode OTP dikirim ke WhatsApp.' };

  try {
    const { username } = req.body;
    const user = username && (await Model_User.getByUsername(username));
    if (!user || !user.no_hp) return res.status(200).json(generik);

    // cooldown 1 menit antar permintaan OTP
    const sisa = Number(user.reset_expired || 0) - Date.now();
    if (user.reset_otp && sisa > (OTP_MENIT * 60 - 60) * 1000) return res.status(200).json(generik);

    const otp = String(crypto.randomInt(100000, 1000000)); // 6 digit
    await Model_User.setOtp(user.username, sha(otp), Date.now() + OTP_MENIT * 60 * 1000);

    const hasil = await sendWhatsApp(
      user.no_hp,
      `*Reset Password*\n\nKode OTP kamu: *${otp}*\nBerlaku ${OTP_MENIT} menit.\nJangan bagikan kode ini ke siapa pun.`
    );
    if (!hasil || hasil.status === false) {
      return res.status(502).json({ status: false, message: 'Gagal mengirim WhatsApp, coba lagi nanti' });
    }

    return res.status(200).json(generik);
  } catch (err) {
    return res.status(500).json({ status: false, message: 'Gagal memproses permintaan', error: err.message });
  }
});

// POST /api/login/reset  { username, otp, password_baru }
router.post('/reset', async function (req, res) {
  try {
    const { username, otp, password_baru } = req.body;

    if (!username || !otp || !password_baru || String(password_baru).length < 8) {
      return res.status(400).json({ status: false, message: 'username, otp, dan password_baru (min 8 karakter) wajib diisi' });
    }

    const salah = { status: false, message: 'Kode OTP salah atau sudah kedaluwarsa' };
    const user = await Model_User.getByUsername(username);

    if (!user || !user.reset_otp || Date.now() > Number(user.reset_expired) || user.reset_gagal >= MAKS_GAGAL) {
      return res.status(400).json(salah);
    }

    const cocok = crypto.timingSafeEqual(Buffer.from(sha(otp)), Buffer.from(user.reset_otp));
    if (!cocok) {
      await Model_User.tambahGagal(username);
      return res.status(400).json(salah);
    }

    await Model_User.updatePassword(username, hashPassword(String(password_baru)));
    sendWhatsApp(user.no_hp, '*Password Berhasil Diubah*\n\nJika ini bukan kamu, segera hubungi admin.');

    return res.status(200).json({ status: true, message: 'Password berhasil diubah' });
  } catch (err) {
    return res.status(500).json({ status: false, message: 'Gagal reset password', error: err.message });
  }
});

module.exports = router;
