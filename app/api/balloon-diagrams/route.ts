import { NextResponse } from 'next/server';

export async function GET() {
  return NextResponse.json({ 
    message: 'Balloon diagrams API endpoint',
    status: 'active' 
  });
}