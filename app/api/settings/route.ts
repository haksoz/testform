import { NextResponse } from 'next/server';
import { pool } from '@/lib/db';

export const dynamic = 'force-dynamic';

export async function GET() {
  try {
    // Settings tablosundan form_title değerini çek
    const [rows] = await pool.execute(
      'SELECT setting_value FROM settings WHERE setting_key = ?',
      ['form_title']
    );

    const settings = rows as Array<{ setting_value: string }>;
    
    // Eğer ayar bulunamadıysa varsayılan değeri döndür
    const title = settings.length > 0 
      ? settings[0].setting_value 
      : 'Test Form - Kayıt Formu';

    return NextResponse.json({
      success: true,
      title: title,
    });
  } catch (error: any) {
    console.error('Settings çekilirken hata:', error);
    // Hata durumunda varsayılan değeri döndür
    return NextResponse.json({
      success: false,
      title: 'Test Form - Kayıt Formu',
      error: error.message,
    });
  }
}







