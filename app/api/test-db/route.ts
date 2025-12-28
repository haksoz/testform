import { NextResponse } from 'next/server';
import mysql from 'mysql2/promise';

export const dynamic = 'force-dynamic';

export async function GET() {
  const runtimeEnv = {
    DB_HOST: process.env.DB_HOST || 'NOT SET',
    DB_USER: process.env.DB_USER || 'NOT SET',
  };

  const hardcoded = {
    DB_HOST: 'localhost',
    DB_USER: 'u187342439_testform_user',
  };

  try {
    const conn = await mysql.createConnection({
      host: hardcoded.DB_HOST,
      user: hardcoded.DB_USER,
      password: '8c$Aj6Tn!SS',
      database: 'u187342439_testform_db',
      port: 3306,
    });

    await conn.ping();
    await conn.end();

    return NextResponse.json({ success: true, runtimeEnv, hardcoded });
  } catch (error: any) {
    return NextResponse.json({ success: false, error: error.message, runtimeEnv, hardcoded });
  }
}

