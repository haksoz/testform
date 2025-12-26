import { NextRequest, NextResponse } from 'next/server';
import { pool } from '@/lib/db';

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
    return NextResponse.json(
      {
        error: 'Kayıt sırasında bir hata oluştu',
        details: error.message,
      },
      { status: 500 }
    );
  }
}

