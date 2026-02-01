import { NextResponse } from 'next/server';

export function withCors(response: NextResponse, origin: string | null): NextResponse {
  response.headers.set('Access-Control-Allow-Origin', origin || '*');
  response.headers.set('Access-Control-Allow-Methods', 'GET, POST, PUT, PATCH, DELETE, OPTIONS');
  response.headers.set('Access-Control-Allow-Headers', 'Content-Type, Authorization');
  return response;
}

export function jsonWithCors(data: unknown, status: number, origin: string | null): NextResponse {
  const res = NextResponse.json(data, { status });
  return withCors(res, origin);
}
