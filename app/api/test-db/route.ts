import { NextResponse } from 'next/server';
import { pool } from '@/lib/db';

export const dynamic = 'force-dynamic';

export async function GET() {
  try {
    // Basit bir test sorgusu
    const [rows] = await pool.execute('SELECT 1 as test');
    
    return NextResponse.json({
      success: true,
      message: 'Veritabanı bağlantısı başarılı',
      env: {
        DB_HOST: process.env.DB_HOST || 'NOT SET',
        DB_USER: process.env.DB_USER || 'NOT SET',
        DB_NAME: process.env.DB_NAME || 'NOT SET',
        DB_PORT: process.env.DB_PORT || 'NOT SET',
        DB_PASSWORD: process.env.DB_PASSWORD ? 'SET' : 'NOT SET',
      }
    });
  } catch (error: any) {
    console.error('DB Test hatası:', error);
    return NextResponse.json(
      {
        success: false,
        error: error.message,
        env: {
          DB_HOST: process.env.DB_HOST || 'NOT SET',
          DB_USER: process.env.DB_USER || 'NOT SET',
          DB_NAME: process.env.DB_NAME || 'NOT SET',
          DB_PORT: process.env.DB_PORT || 'NOT SET',
          DB_PASSWORD: process.env.DB_PASSWORD ? 'SET' : 'NOT SET',
        }
      },
      { status: 500 }
    );
  }
}

