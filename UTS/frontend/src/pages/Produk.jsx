import React from 'react';
import useData from '../useData.js';
import SumberBanner from '../components/SumberBanner.jsx';

const rupiah = (n) => new Intl.NumberFormat('id-ID', { style: 'currency', currency: 'IDR', maximumFractionDigits: 0 }).format(n);

export default function Produk() {
  const { loading, rows, sumber, catatan, error, muat } = useData('/produk');
  return (
    <section>
      <SumberBanner loading={loading} sumber={sumber} catatan={catatan} error={error} onUlang={muat} />
      <table>
        <thead><tr><th>#</th><th>Nama produk</th><th>Harga</th><th>Foto</th><th>Kategori</th></tr></thead>
        <tbody>
          {rows.map((p) => (
            <tr key={p.id}>
              <td className="num">{p.id}</td>
              <td>{p.nama_produk}</td>
              <td className="num">{rupiah(p.harga_produk)}</td>
              <td>{p.foto_produk}</td>
              <td className="num">{p.id_kategori}</td>
            </tr>
          ))}
          {!loading && !error && rows.length === 0 && (
            <tr><td colSpan="5" className="kosong">Belum ada data. Jalankan POST /api/sync di Server A.</td></tr>
          )}
        </tbody>
      </table>
    </section>
  );
}
