/**
 * 시안 O/X 제출 수신 (개발용 — /styles 갤러리 전용, 프로덕션 기능 아님)
 * POST: 사장님이 갤러리에서 고른 O/X·메모를 nugoona/.draft-feedback.json 에 저장
 * GET: 마지막 제출분 반환(페이지 재방문 시 프리필)
 */
import { NextResponse } from 'next/server';
import { writeFile, readFile } from 'fs/promises';
import path from 'path';

const FILE = path.join(process.cwd(), '.draft-feedback.json');

export async function POST(req: Request) {
  const body = await req.json();
  const data = { ...body, submittedAt: new Date().toISOString() };
  await writeFile(FILE, JSON.stringify(data, null, 2), 'utf8');
  return NextResponse.json({ ok: true, submittedAt: data.submittedAt });
}

export async function GET() {
  try {
    const raw = await readFile(FILE, 'utf8');
    return NextResponse.json(JSON.parse(raw));
  } catch {
    return NextResponse.json(null);
  }
}
