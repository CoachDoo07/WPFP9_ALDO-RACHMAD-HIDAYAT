import axios from 'axios';

const UTAMA = import.meta.env.VITE_SERVER_UTAMA;       // Server B (port 4000)
const CADANGAN = import.meta.env.VITE_SERVER_CADANGAN; // Server A (port 3000)
const TIMEOUT = Number(import.meta.env.VITE_TIMEOUT_MS) || 3000;

let token = sessionStorage.getItem('token') || null;

// Login ke Server B untuk mendapatkan JWT
async function login() {
  const res = await axios.post(
    `${UTAMA}/login`,
    { username: import.meta.env.VITE_API_USER, password: import.meta.env.VITE_API_PASS },
    { timeout: TIMEOUT }
  );
  token = res.data.token;
  sessionStorage.setItem('token', token);
}

const bearer = () => ({ headers: { Authorization: `Bearer ${token}` }, timeout: TIMEOUT });

// GET ke Server B. Jika token belum ada / kedaluwarsa, login ulang satu kali.
async function getDariUtama(path) {
  if (!token) await login();
  try {
    return await axios.get(`${UTAMA}${path}`, bearer());
  } catch (err) {
    const s = err.response?.status;
    if (s === 401 || s === 403) {
      await login();
      return axios.get(`${UTAMA}${path}`, bearer());
    }
    throw err;
  }
}

function alasan(err) {
  if (err.code === 'ECONNABORTED') return `tidak merespons dalam ${TIMEOUT} ms`;
  if (err.response) return `membalas status ${err.response.status}`;
  return 'tidak dapat dihubungi';
}

/**
 * Mekanisme fallback:
 * 1. Coba Server utama (B). Jika sukses -> data sudah didekripsi.
 * 2. Jika gagal (mati, error, timeout) -> catch -> coba Server cadangan (A).
 * 3. Jika keduanya gagal -> lempar error.
 */
export async function ambilData(path) {
  try {
    const res = await getDariUtama(path);
    if (!res.data.status) throw new Error('Respons Server B tidak valid');
    return { rows: res.data.data, sumber: 'utama', catatan: null };
  } catch (errUtama) {
    try {
      const res = await axios.get(`${CADANGAN}${path}`, { timeout: TIMEOUT });
      if (!res.data.status) throw new Error('Respons Server A tidak valid');
      return { rows: res.data.data, sumber: 'cadangan', catatan: `Server B ${alasan(errUtama)}` };
    } catch (errCadangan) {
      console.error('Kedua server gagal:', errUtama, errCadangan);
      throw new Error('Server B dan Server A sama-sama tidak dapat diakses');
    }
  }
}
