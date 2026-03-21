import { NextResponse } from 'next/server';

export async function GET() {
  return NextResponse.json({ 
    message: 'Balloon annotations API endpoint',
    status: 'active' 
  });
}