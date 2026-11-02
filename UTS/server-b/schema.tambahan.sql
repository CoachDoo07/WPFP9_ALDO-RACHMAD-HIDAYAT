-- tambahkan di DB B (setelah tabel produk)
USE db_b;

CREATE TABLE users (
  id INT PRIMARY KEY AUTO_INCREMENT,
  username VARCHAR(50) NOT NULL UNIQUE,
  password VARCHAR(255) NOT NULL,       -- hash scrypt "salt:hash"
  no_hp VARCHAR(20) NOT NULL,           -- tujuan OTP WhatsApp
  reset_otp CHAR(64) NULL,              -- SHA-256 dari OTP
  reset_expired BIGINT NULL,            -- epoch ms
  reset_gagal INT NOT NULL DEFAULT 0
);
