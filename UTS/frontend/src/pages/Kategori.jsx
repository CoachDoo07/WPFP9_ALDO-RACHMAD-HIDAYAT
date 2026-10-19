import React from 'react';
import useData from '../useData.js';
import SumberBanner from '../components/SumberBanner.jsx';

export default function Kategori() {
  const { loading, rows, sumber, catatan, error, muat } = useData('/kategori');
  return (
    <section>
      <SumberBanner loading={loading} sumber={sumber} catatan={catatan} error={error} onUlang={muat} />
      <table>
        <thead><tr><th>#</th><th>Nama kategori</th></tr></thead>
        <tbody>
          {rows.map((k) => (
            <tr key={k.id}><td className="num">{k.id}</td><td>{k.nama_kategori}</td></tr>
          ))}
          {!loading && !error && rows.length === 0 && (
            <tr><td colSpan="2" className="kosong">Belum ada data. Jalankan POST /api/sync di Server A.</td></tr>
          )}
        </tbody>
      </table>
    </section>
  );
}
