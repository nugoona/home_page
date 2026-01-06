# 배포 가이드 - 슬랙 웹훅 설정

## 문제
Cloud Run 배포 환경에서 슬랙 알림이 작동하지 않는 경우, 환경 변수가 설정되지 않았을 가능성이 높습니다.

## 해결 방법

### 방법 1: GitHub Secrets 사용 (권장)

1. **GitHub 저장소에서 Secrets 추가:**
   - 저장소 → Settings → Secrets and variables → Actions
   - "New repository secret" 클릭
   - Name: `SLACK_WEBHOOK_URL`
   - Value: `https://hooks.slack.com/services/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`
   - "Add secret" 클릭

2. **배포 스크립트 확인:**
   - `.github/workflows/deploy.yml` 파일이 이미 수정되어 있습니다.
   - `SLACK_WEBHOOK_URL=${{ secrets.SLACK_WEBHOOK_URL }}`이 포함되어 있습니다.

3. **다시 배포:**
   - 코드를 커밋하고 푸시하면 자동으로 배포됩니다.

### 방법 2: Cloud Run에서 직접 설정

1. **GCP 콘솔에서:**
   ```
   gcloud run services update home-page-tokyo \
     --region asia-northeast1 \
     --set-env-vars SLACK_WEBHOOK_URL=https://hooks.slack.com/services/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
   ```

2. **또는 GCP 콘솔 UI에서:**
   - Cloud Run → home-page-tokyo 서비스 선택
   - "EDIT & DEPLOY NEW REVISION" 클릭
   - "Variables & Secrets" 탭
   - "ADD VARIABLE" 클릭
   - Name: `SLACK_WEBHOOK_URL`
   - Value: `https://hooks.slack.com/services/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`
   - "DEPLOY" 클릭

### 방법 3: 수동으로 환경 변수 확인

배포 후 환경 변수가 제대로 설정되었는지 확인:

```bash
# Cloud Run 서비스의 환경 변수 확인
gcloud run services describe home-page-tokyo \
  --region asia-northeast1 \
  --format="value(spec.template.spec.containers[0].env)"
```

## 테스트

배포 후 다음 엔드포인트로 슬랙 설정을 확인할 수 있습니다:

```
https://nugoona.co.kr/api/test-slack
```

성공하면:
```json
{
  "success": true,
  "message": "슬랙 웹훅 URL이 설정되어 있습니다.",
  "url_preview": "https://hooks.slack.com/services/T0A6Y38QB6Z/B0A7ECW3MPT/..."
}
```

실패하면:
```json
{
  "success": false,
  "message": "슬랙 웹훅 URL이 설정되지 않았습니다. .env 파일을 확인하세요."
}
```

## 중요 사항

⚠️ **보안**: 슬랙 웹훅 URL은 절대 코드에 직접 작성하지 마세요!
- GitHub Secrets 사용
- Cloud Run 환경 변수 사용
- `.env` 파일은 `.gitignore`에 포함되어 있어야 함

