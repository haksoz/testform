import { NextResponse } from 'next/server';
import { getDbPool } from '@/lib/db';

export const dynamic = 'force-dynamic';

export async function GET() {
  try {
    // Veritabanı bağlantısını al
    const pool = getDbPool();
    
    // Settings tablosundan form_title değerini çek
    const [rows] = await pool.execute(
      'SELECT setting_value FROM settings WHERE setting_key = ?',
      ['form_title']
    );

    const settings = rows as Array<{ setting_value: string }>;
    
    // Eğer ayar bulunamadıysa hata döndür
    if (settings.length === 0) {
      return NextResponse.json(
        {
          success: false,
          error: 'Başlık ayarı bulunamadı',
        },
        { status: 404 }
      );
    }

    return NextResponse.json({
      success: true,
      title: settings[0].setting_value,
    });
  } catch (error: any) {
    console.error('Settings çekilirken hata:', error);
    // Hata durumunda 500 döndür, varsayılan değer döndürme
    return NextResponse.json(
      {
        success: false,
        error: 'Veritabanı bağlantısı başarısız',
        details: error.message,
      },
      { status: 500 }
    );
  }
}







