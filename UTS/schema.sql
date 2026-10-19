-- ===================== DB A (data asli / plaintext) =====================
CREATE DATABASE IF NOT EXISTS db_a;
USE db_a;

CREATE TABLE kategori (
  id INT PRIMARY KEY AUTO_INCREMENT,
  nama_kategori VARCHAR(100) NOT NULL
);

CREATE TABLE produk (
  id INT PRIMARY KEY AUTO_INCREMENT,
  nama_produk VARCHAR(150) NOT NULL,
  harga_produk INT NOT NULL,
  foto_produk VARCHAR(255),
  id_kategori INT,
  FOREIGN KEY (id_kategori) REFERENCES kategori(id)
);

-- data contoh
INSERT INTO kategori (nama_kategori) VALUES ('Makanan'), ('Minuman');
INSERT INTO produk (nama_produk, harga_produk, foto_produk, id_kategori) VALUES
  ('Nasi Goreng', 15000, 'nasgor.jpg', 1),
  ('Es Teh', 5000, 'esteh.jpg', 2);

-- ===================== DB B (isi kolom berupa ciphertext) =====================
CREATE DATABASE IF NOT EXISTS db_b;
USE db_b;

CREATE TABLE kategori (
  id INT PRIMARY KEY,
  nama_kategori TEXT
);

CREATE TABLE produk (
  id INT PRIMARY KEY,
  nama_produk TEXT,
  harga_produk TEXT,   -- TEXT karena menyimpan hasil enkripsi
  foto_produk TEXT,
  id_kategori INT,
  FOREIGN KEY (id_kategori) REFERENCES kategori(id)
);
