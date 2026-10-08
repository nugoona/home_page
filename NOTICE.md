# 외부 소스 출처 표기

이 저장소가 쓰는 외부 디자인 소스 중 **출처 표기가 의무인 것**을 적는다.

## Paper Shaders (Apache-2.0)
Powered by Paper Shaders: https://shaders.paper.design

- 패키지: `@paper-design/shaders-react`
- 쓰는 곳: `/start` 첫 화면 배경(Dithering)
- Apache-2.0 은 NOTICE 첨부가 의무다. 이 파일을 지우지 마라.
- 고른 이유: 색을 두 개만 받는 구조라 파스텔·그라디언트가 **들어갈 자리가 없다**
  (DESIGN §7-7 금지를 소스 차원에서 지켜 준다).

## MIT (표기 의무 없음 — 기록용)
- `@number-flow/react` — 단계 숫자 전환
- `react-textarea-autosize` — 긴 입력 칸 자동 높이
