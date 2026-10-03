# 제안서_핸드오프 — 진입점 & 재개 문서

> **"제안서 이어서 / 제안서 관련 질문"이 나오면 이 문서부터 읽으면 바로 이어갈 수 있게** 만든 단일 진입점.
> 자동 회상 메모리: `project_proposal_pipeline`(파이프라인+정본 위치), `project_proposal_ppt`(제작 규칙), `feedback_fable_review_after_work`(검수는 페이블에게).

## 📌 지금 상태 (2026-07-07 기준)

1. **하나금융 웰니스케어 제안서 = 완성.**
   - 정본: `최종_제출본/0707_HANA_RESET/` — `slides/`(14장 HTML+imgs) · `renders/`(slide01~14 + 간지 01b PNG) · `순서.md` · `HANA_RESET_웰니스케어_제안서.pptx`(15장/약 10MB). `C:/Users/oscar/Downloads/`에도 사본.
   - ⚠ **미검증**: PowerPoint 앱에서 실제 열어 슬라이드쇼로 보는 E2E는 환경 제약으로 못 함 → 사용자 최종 확인 대기.

2. **제안서 제작 파이프라인 = 구축 완료, 아직 실가동 전(와이어프레임/설계 수준).**
   - 도구 3종(`tools/`) 실행 스모크 통과 + Fable 5 검토 2회(설계·구현물) 반영.
   - 규칙 = [CLAUDE.md](CLAUDE.md) / 설계·회고 = [PIPELINE.md](PIPELINE.md).

## ▶ "제안서 이어서" 하면 — 여기서 이어간다

- **새 제안서 시작**: `00_intake.template.md` 복사 → 접수 → `01_storyline`(어필 기획 텍스트, 컨펌) → 기존 `slideNN.html` 복사해 제작 → `render.py` → **모바일 컨펌** → 컨펌된 장만 `순서.md` `[x]` → `build.py`. (순서·금지사항은 [CLAUDE.md](CLAUDE.md) 절대규칙 참조)
- **이번 제안서 수정**: `최종_제출본/0707_HANA_RESET/`에서 해당 `slides/NN_이름/slideNN.html` 수정 → `python ../../tools/render.py slides --only NN` → 그 장 `순서.md` `[x]`→`[ ]` 되돌리고 재컨펌 후 `build.py 순서.md`.

## 🧰 도구 (tools/) — 한 줄 요약
- `render.py` — HTML→1920×1080 PNG(폰트/404/오버플로 자동검사, `_`폴더 제외, stem중복 에러). `--scale 2`는 `renders_2x/`로 분리, `--thumb 900` 모바일 컨펌본.
- `build.py 순서.md` — 순서.md 체크리스트를 게이트로 PPTX 조립. **미컨펌·PNG누락·stale·규격미달이면 빌드 거부**(`--force` 우회).
- `normalize_imgs.py 원본 출력.jpg` — EXIF 회전 보정+리사이즈. 투명→JPG 흰배경, `src==dst` 거부. 크롭은 CSS object-position으로.

## ⏳ 남은 할일 (지금은 안 함 — 다음에)
- 다음 실제 제안서가 오면 **파이프라인 첫 실가동** + 부족분 보완.
- P2 잔여: 원고 대조 자동화(현재는 수동 대조로 충분), `theme.css`/`_template.html` 추출(발주처 CI 바뀌므로 두 번째 제안서 때), PDF 제출 필요 시 `--scale 2` + PNG→PDF 빌드 경로 추가.
- 정본 폴더 정리: `디자인_현행/` 아래 옛 작업폴더들(`slides`, `slides_운영백업_*`, `uploads`, `_구버전_아카이브_*`)은 참고용. 정본은 위 `최종_제출본/0707_HANA_RESET/`.

## 🗺 문서 지도
| 파일 | 용도 |
|---|---|
| **README.md** (이 문서) | 진입점·재개 |
| [CLAUDE.md](CLAUDE.md) | 작업 규칙(이 폴더서 자동 로드) |
| [PIPELINE.md](PIPELINE.md) | 파이프라인 6.5단계 설계 + 회고 + Fable 검토 |
| `tools/` | render.py · build.py · normalize_imgs.py |
| `00_intake.template.md` · `순서.template.md` | 재사용 템플릿 |
| `최종_제출본/0707_HANA_RESET/` | 이번 제안서 정본 |
| (제작 당시) `디자인_설계서.md` · `장별점검표.md` · `작업상태.md` · `수정요청_음성정리_*` · `리서치_*` · `확정_헤드라인_*` | 이번 제안서 제작 근거·이력 |
