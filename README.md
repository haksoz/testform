# Test Form - Basit Kayıt Formu

Bu proje, Hostinger'da MySQL veritabanı bağlantısını test etmek için oluşturulmuş basit bir Next.js uygulamasıdır.

## Özellikler

- Basit ad-soyad form sayfası
- MySQL veritabanına kayıt
- Hostinger için optimize edilmiş database connection

## Kurulum

1. Bağımlılıkları yükleyin:
```bash
npm install
```

2. Environment variables oluşturun (`.env.local`):
```
DB_HOST=127.0.0.1
DB_PORT=3306
DB_USER=your_db_user
DB_PASSWORD=your_db_password
DB_NAME=your_db_name
```

3. Veritabanı tablosunu oluşturun:
- Hostinger'da MySQL veritabanınıza giriş yapın
- `create-table.sql` dosyasındaki SQL'i çalıştırın

4. Development server'ı başlatın:
```bash
npm run dev
```

## Hostinger Deployment

1. Hostinger Node.js Web Uygulama oluşturun
2. Git repository'yi bağlayın
3. Environment Variables ekleyin:
   - DB_HOST=127.0.0.1
   - DB_PORT=3306
   - DB_USER=your_db_user
   - DB_PASSWORD=your_db_password
   - DB_NAME=your_db_name
4. Derleme ayarları:
   - Derleme komutu: `npm run build`
   - Çıktı dizini: `.next`
   - Paket yöneticisi: `npm`
5. Deploy edin

## Test

Form sayfasına gidin ve ad-soyad bilgilerini girerek kayıt yapın. Veritabanında kaydın oluşturulduğunu kontrol edin.

