interface SurveyData {
  name?: string;
  company?: string;
  phone?: string;
  email?: string;
  platform?: string;
  budget?: string;
  message?: string;
}

export async function sendSlackNotification(data: SurveyData): Promise<boolean> {
  const webhookUrl = process.env.SLACK_WEBHOOK_URL;
  if (!webhookUrl) {
    console.error('SLACK_WEBHOOK_URL is not set');
    return false;
  }

  const blocks = [
    {
      type: 'header',
      text: { type: 'plain_text', text: '📋 새 문의 접수', emoji: true },
    },
    {
      type: 'section',
      fields: [
        { type: 'mrkdwn', text: `*이름:*\n${data.name || '-'}` },
        { type: 'mrkdwn', text: `*회사:*\n${data.company || '-'}` },
        { type: 'mrkdwn', text: `*연락처:*\n${data.phone || '-'}` },
        { type: 'mrkdwn', text: `*이메일:*\n${data.email || '-'}` },
        { type: 'mrkdwn', text: `*플랫폼:*\n${data.platform || '-'}` },
        { type: 'mrkdwn', text: `*월 광고비:*\n${data.budget || '-'}` },
      ],
    },
    ...(data.message
      ? [
          {
            type: 'section',
            text: { type: 'mrkdwn', text: `*문의사항:*\n${data.message}` },
          },
        ]
      : []),
    { type: 'divider' },
    {
      type: 'context',
      elements: [
        {
          type: 'mrkdwn',
          text: `접수 시각: ${new Date().toLocaleString('ko-KR', { timeZone: 'Asia/Seoul' })}`,
        },
      ],
    },
  ];

  try {
    const res = await fetch(webhookUrl, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ blocks }),
    });
    return res.ok;
  } catch (err) {
    console.error('Slack notification failed:', err);
    return false;
  }
}
