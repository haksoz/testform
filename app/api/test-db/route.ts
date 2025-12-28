import { NextResponse } from 'next/server';
import mysql from 'mysql2/promise';

export const dynamic = 'force-dynamic';

export async function GET() {
  const env = {
    DB_HOST: process.env.DB_HOST || 'NOT SET',
    DB_USER: process.env.DB_USER || 'NOT SET',
    DB_NAME: process.env.DB_NAME || 'NOT SET',
    DB_PORT: process.env.DB_PORT || 'NOT SET',
    DB_PASSWORD: process.env.DB_PASSWORD ? '***SET***' : 'NOT SET',
  };

  try {
    const conn = await mysql.createConnection({
      host: process.env.DB_HOST,
      user: process.env.DB_USER,
      password: process.env.DB_PASSWORD,
      database: process.env.DB_NAME,
      port: Number(process.env.DB_PORT) || 3306,
    });

    await conn.ping();
    await conn.end();

    return NextResponse.json({ success: true, env });
  } catch (error: any) {
    return NextResponse.json({
      success: false,
      error: error.message,
      env,
    });
  }
}

