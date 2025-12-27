import { NextRequest, NextResponse } from 'next/server';
import { getDbPool } from '@/lib/db';

export const dynamic = 'force-dynamic';

export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    const { ad, soyad } = body;

    if (!ad || !soyad) {
      return NextResponse.json(
        { error: 'Ad ve Soyad alanları zorunludur' },
        { status: 400 }
      );
    }

    // Veritabanı bağlantısını al
    const pool = getDbPool();
    
    // Veritabanına kaydet
    const [result] = await pool.execute(
      'INSERT INTO test_form (ad, soyad) VALUES (?, ?)',
      [ad, soyad]
    );

    return NextResponse.json({
      success: true,
      message: 'Kayıt başarıyla eklendi!',
      id: (result as any).insertId,
    });
  } catch (error: any) {
    console.error('Kayıt hatası:', error);
    console.error('Hata detayı:', error.message);
    console.error('Stack:', error.stack);
    
    // Production'da detayları gizle
    return NextResponse.json(
      {
        error: 'Kayıt sırasında bir hata oluştu',
        details: process.env.NODE_ENV === 'development' ? error.message : undefined,
      },
      { status: 500 }
    );
  }
}

