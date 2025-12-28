import { NextResponse } from 'next/server';

export const dynamic = 'force-dynamic';

export async function GET() {
  return NextResponse.json({
    DB_HOST: process.env.DB_HOST,
    DB_USER: process.env.DB_USER,
    DB_NAME: process.env.DB_NAME,
    DB_PORT: process.env.DB_PORT,
    DB_PASSWORD: process.env.DB_PASSWORD ? 'SET' : 'NOT SET',
    NODE_ENV: process.env.NODE_ENV,
  });
}

