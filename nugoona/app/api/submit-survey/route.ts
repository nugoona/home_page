import { NextRequest, NextResponse } from 'next/server';
import { sendSlackNotification } from '@/lib/slack';

export async function POST(request: NextRequest) {
  try {
    const data = await request.json();

    if (!data || !data.name) {
      return NextResponse.json(
        { success: false, error: '필수 정보가 누락되었습니다.' },
        { status: 400 }
      );
    }

    const success = await sendSlackNotification(data);

    if (success) {
      return NextResponse.json({
        success: true,
        message: '문의가 성공적으로 접수되었습니다.',
      });
    } else {
      return NextResponse.json(
        { success: false, error: '알림 전송에 실패했습니다.' },
        { status: 500 }
      );
    }
  } catch (err) {
    console.error('Submit survey error:', err);
    return NextResponse.json(
      { success: false, error: '서버 오류가 발생했습니다.' },
      { status: 500 }
    );
  }
}
