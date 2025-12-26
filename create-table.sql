-- Test Form Veritabanı Tablosu
-- Hostinger'da bu SQL'i çalıştırarak tabloyu oluşturun

CREATE TABLE IF NOT EXISTS test_form (
  id INT AUTO_INCREMENT PRIMARY KEY,
  ad VARCHAR(100) NOT NULL,
  soyad VARCHAR(100) NOT NULL,
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  INDEX idx_created_at (created_at)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

