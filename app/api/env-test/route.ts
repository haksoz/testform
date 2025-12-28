import { NextResponse } from 'next/server';

export async function GET() {
console.log('🔍 RUNTIME DB Config Check:', {
DB_HOST: process.env.DB_HOST,
DB_USER: process.env.DB_USER,
DB_PASSWORD: process.env.DB_PASSWORD ? '***SET***' : '***MISSING***',
DB_NAME: process.env.DB_NAME,
DB_PORT: process.env.DB_PORT,
NODE_ENV: process.env.NODE_ENV,
});

return NextResponse.json({
DB_HOST: process.env.DB_HOST,
DB_USER: process.env.DB_USER,
DB_PASSWORD: process.env.DB_PASSWORD ? '***SET***' : '***MISSING***',
DB_NAME: process.env.DB_NAME,
DB_PORT: process.env.DB_PORT,
NODE_ENV: process.env.NODE_ENV,
});
}

