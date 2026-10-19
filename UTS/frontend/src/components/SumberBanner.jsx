import React from 'react';

export default function SumberBanner({ loading, sumber, catatan, error, onUlang }) {
  let cls = 'banner';
  let judul = 'Memuat data…';
  let isi = 'Menghubungi Server B.';

  if (!loading && error) {
    cls += ' gagal';
    judul = 'Data tidak dapat dimuat';
    isi = error;
  } else if (!loading && sumber === 'utama') {
    cls += ' utama';
    judul = 'Server B (utama)';
    isi = 'Data diambil dari DB B, didekripsi, dan dikirim lewat endpoint ber-JWT.';
  } else if (!loading && sumber === 'cadangan') {
    cls += ' cadangan';
    judul = 'Server A (cadangan)';
    isi = `${catatan}. Data diambil langsung dari DB A.`;
  }

  return (
    <div className={cls} role="status">
      <div>
        <strong>{judul}</strong>
        <span>{isi}</span>
      </div>
      <button onClick={onUlang} disabled={loading}>Muat ulang</button>
    </div>
  );
}
