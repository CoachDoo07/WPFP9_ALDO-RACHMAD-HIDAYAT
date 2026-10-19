import React, { useState } from 'react';
import Kategori from './pages/Kategori.jsx';
import Produk from './pages/Produk.jsx';

export default function App() {
  const [halaman, setHalaman] = useState('kategori');
  return (
    <main className="wrap">
      <header className="top">
        <h1>Data Katalog</h1>
        <nav aria-label="Halaman">
          <button className={halaman === 'kategori' ? 'tab on' : 'tab'} onClick={() => setHalaman('kategori')}>Kategori</button>
          <button className={halaman === 'produk' ? 'tab on' : 'tab'} onClick={() => setHalaman('produk')}>Produk</button>
        </nav>
      </header>
      {halaman === 'kategori' ? <Kategori /> : <Produk />}
    </main>
  );
}
