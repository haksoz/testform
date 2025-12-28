import mysql from "mysql2/promise";

// Debug: Environment variables kontrolü
console.log('🔍 DB Config Check:', {
  DB_HOST: process.env.DB_HOST || 'NOT SET',
  DB_USER: process.env.DB_USER || 'NOT SET',
  DB_PASSWORD: process.env.DB_PASSWORD ? '***SET***' : 'NOT SET',
  DB_NAME: process.env.DB_NAME || 'NOT SET',
  DB_PORT: process.env.DB_PORT || 'NOT SET',
  NODE_ENV: process.env.NODE_ENV || 'NOT SET',
});

// Pool'u lazy initialization ile oluştur
let poolInstance: mysql.Pool | null = null;
let poolConfig: { host: string; user: string; password: string; database: string; port: number } | null = null;

function getPool(): mysql.Pool {
  // Environment variables'ı runtime'da tekrar kontrol et
  // Hostinger'da genellikle localhost kullanılmalı, 127.0.0.1 yerine
  const dbHost = process.env.DB_HOST || "localhost";
  const dbUser = process.env.DB_USER || "root";
  const dbPassword = process.env.DB_PASSWORD || "";
  const dbName = process.env.DB_NAME || "testform_db";
  const dbPort = Number(process.env.DB_PORT) || 3306;
  
  const currentConfig = { host: dbHost, user: dbUser, password: dbPassword, database: dbName, port: dbPort };
  
  // Eğer pool yoksa veya config değiştiyse yeni pool oluştur
  if (!poolInstance || !poolConfig || 
      poolConfig.host !== currentConfig.host ||
      poolConfig.user !== currentConfig.user ||
      poolConfig.password !== currentConfig.password ||
      poolConfig.database !== currentConfig.database ||
      poolConfig.port !== currentConfig.port) {
    
    // Eski pool'u kapat
    if (poolInstance) {
      poolInstance.end().catch(() => {});
    }
    
    console.log('🔧 Pool oluşturuluyor (runtime):', {
      host: dbHost,
      user: dbUser,
      password: dbPassword ? '***SET***' : 'EMPTY',
      database: dbName,
      port: dbPort,
    });
    
    poolInstance = mysql.createPool({
      host: dbHost,
      user: dbUser,
      password: dbPassword,
      database: dbName,
      port: dbPort,
      waitForConnections: true,
      connectionLimit: 10,
      maxIdle: 10,
      idleTimeout: 60000,
      queueLimit: 0,
      enableKeepAlive: true,
      keepAliveInitialDelay: 0
    });
    
    poolConfig = currentConfig;
  }
  
  return poolInstance;
}

// Veritabanı tablosunu otomatik oluştur
async function initializeDatabase() {
  try {
    const pool = getPool();
    
    // test_form tablosunu oluştur
    await pool.execute(`
      CREATE TABLE IF NOT EXISTS test_form (
        id INT AUTO_INCREMENT PRIMARY KEY,
        ad VARCHAR(100) NOT NULL,
        soyad VARCHAR(100) NOT NULL,
        created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
        INDEX idx_created_at (created_at)
      ) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci
    `);
    console.log('✅ Veritabanı tablosu hazır (test_form)');
    
    // settings tablosunu oluştur (başlık ve diğer ayarlar için)
    await pool.execute(`
      CREATE TABLE IF NOT EXISTS settings (
        id INT AUTO_INCREMENT PRIMARY KEY,
        setting_key VARCHAR(100) NOT NULL UNIQUE,
        setting_value TEXT NOT NULL,
        updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP
      ) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci
    `);
    
    // Varsayılan başlık ayarını ekle (eğer yoksa)
    await pool.execute(`
      INSERT IGNORE INTO settings (setting_key, setting_value) 
      VALUES ('form_title', 'Test Form - Kayıt Formu')
    `);
    
    console.log('✅ Veritabanı tablosu hazır (settings)');
  } catch (error) {
    console.error('❌ Veritabanı tablosu oluşturulurken hata:', error);
  }
}

// İlk bağlantıda tabloyu oluştur (async olarak, hata oluşturmayacak şekilde)
let dbInitialized = false;
if (!dbInitialized) {
  dbInitialized = true;
  // Hata oluşsa bile uygulama çalışmaya devam etsin
  initializeDatabase().catch((err) => {
    console.error('Veritabanı initialization hatası (devam ediliyor):', err);
  });
}

// Pool'u direkt export et
export function getDbPool(): mysql.Pool {
  return getPool();
}

// Eski kod uyumluluğu için pool export'u (proxy ile)
export const pool = new Proxy({} as mysql.Pool, {
  get(target, prop) {
    const poolInstance = getDbPool();
    const value = (poolInstance as any)[prop];
    // Eğer fonksiyonsa bind et
    if (typeof value === 'function') {
      return value.bind(poolInstance);
    }
    return value;
  }
});

// Tablo oluşturma fonksiyonunu export et
export { initializeDatabase };

