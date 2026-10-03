#!/usr/bin/env python3
"""순서.md(체크리스트)를 읽어 PNG를 16:9 PPTX로 조립 + 제출규격 게이트 (파이프라인 5단계).

핵심: 컨펌 게이트를 '선언'이 아니라 '코드'로 강제한다.
  - 체크 안 된 [ ] 장이 있으면 빌드 거부(--force로만 우회)
  - 렌더 PNG 누락 시 거부
  - 제출규격(장수/용량) 미달 시 비정상 종료(--force로만 통과)
  - (옵션) slides_root 지정 시, html이 png보다 최신이면 'stale 렌더' 경고

순서.md 형식(맨 위 설정 + 슬라이드 목록):
  output: C:/Users/oscar/Downloads/제안서.pptx   # 상대경로면 순서.md 위치 기준
  renders_dir: renders                          # 상대경로면 순서.md 위치 기준
  slides_root: 디자인_현행/_handoff_클로드디자인  # (옵션) stale 검사용 html 루트
  max_mb: 30
  expect_slides: 15

  - [x] slide01.png   # 01 표지  (체크 = 모바일 컨펌 완료)
  - [ ] slide12.png   # 미컨펌 -> 빌드 거부

주의: 설정줄/항목줄 모두 '#' 뒤는 주석으로 잘린다.
      [x] 는 사용자 컨펌을 받은 뒤에만 사람이 체크한다(Claude 선제 체크 금지 — CLAUDE.md 규칙).

의존성: pip install python-pptx
"""
import argparse, sys, re
from pathlib import Path
from pptx import Presentation
from pptx.util import Inches
from pptx.enum.shapes import MSO_SHAPE_TYPE

_SET = re.compile(r"^\s*([a-zA-Z_]+)\s*:\s*(.+?)\s*$")
_ITEM = re.compile(r"^\s*-\s*\[([ xX])\]\s+(\S+)")
_KEYS = ("output", "renders_dir", "slides_root", "max_mb", "expect_slides")


def _resolve(base: Path, val: str) -> Path:
    p = Path(val)
    return p if p.is_absolute() else (base / p)


def parse(md: Path):
    cfg, slides, errs = {}, [], []
    for i, raw in enumerate(md.read_text(encoding="utf-8").splitlines(), 1):
        line = raw.split("#", 1)[0].rstrip()   # 인라인 주석 제거(설정·항목 공통)
        if not line.strip():
            continue
        if line.lstrip().startswith("-"):
            m = _ITEM.match(line)
            if not m:
                errs.append(f"{i}행 체크박스 형식 오류: {raw.strip()!r}  (형식: - [x] slideNN.png)")
                continue
            slides.append({"png": m.group(2), "ok": m.group(1).lower() == "x", "line": i})
        else:
            m = _SET.match(line)
            if m and m.group(1) in _KEYS:
                cfg[m.group(1)] = m.group(2).strip()
    # 중복 png
    seen = {}
    for s in slides:
        seen.setdefault(s["png"], []).append(s["line"])
    for png, lines in seen.items():
        if len(lines) > 1:
            errs.append(f"png 중복: {png} (행 {lines})")
    return cfg, slides, errs


def build(md_path: Path, force=False):
    cfg, slides, errs = parse(md_path)
    if errs:
        print("✗ 순서.md 파싱 오류:")
        for e in errs:
            print(f"    - {e}")
        sys.exit(1)
    if not slides:
        print("순서.md에서 슬라이드 목록(- [ ] ...)을 찾지 못했습니다."); sys.exit(1)
    if "output" not in cfg:
        print("순서.md 상단에 `output: <경로>` 가 필요합니다."); sys.exit(1)

    base = md_path.parent
    rdir = _resolve(base, cfg.get("renders_dir", "renders"))
    out = _resolve(base, cfg["output"])

    # 게이트 1: 미컨펌 장
    unconfirmed = [s["png"] for s in slides if not s["ok"]]
    if unconfirmed and not force:
        print("✗ 빌드 거부 — 아직 컨펌(체크)되지 않은 장이 있습니다:")
        for p in unconfirmed:
            print(f"    - [ ] {p}")
        print("  렌더를 모바일로 확인하고 순서.md에서 [x]로 바꾼 뒤 다시 실행하세요. (비상시 --force)")
        sys.exit(2)
    if unconfirmed and force:
        print(f"⚠ --force: 미컨펌 {len(unconfirmed)}장을 포함해 강제 빌드합니다.")

    # 게이트 2: PNG 존재
    missing = [s["png"] for s in slides if not (rdir / s["png"]).exists()]
    if missing:
        print(f"✗ 빌드 거부 — 렌더 PNG 누락({rdir}):")
        for p in missing:
            print(f"    {p}")
        sys.exit(3)

    # 게이트 3(옵션): stale 렌더 — html이 png보다 최신이면 재렌더 필요
    if "slides_root" in cfg:
        sroot = _resolve(base, cfg["slides_root"])
        stale = []
        for s in slides:
            stem = Path(s["png"]).stem
            htmls = list(sroot.glob(f"*/{stem}.html")) + list(sroot.glob(f"{stem}.html"))
            png = rdir / s["png"]
            if htmls and htmls[0].stat().st_mtime > png.stat().st_mtime + 1:
                stale.append(f"{s['png']} (html이 더 최신 — 재렌더 필요)")
        if stale and not force:
            print("✗ 빌드 거부 — 렌더가 오래됐습니다(html 수정 후 재렌더 안 함):")
            for p in stale:
                print(f"    {p}")
            print("  render.py로 재렌더 후 다시 빌드하세요. (비상시 --force)")
            sys.exit(5)
        elif stale:
            print(f"⚠ --force: stale 렌더 {len(stale)}건 포함.")

    prs = Presentation(); prs.slide_width = Inches(13.333); prs.slide_height = Inches(7.5)
    blank = prs.slide_layouts[6]
    for s in slides:
        sl = prs.slides.add_slide(blank)
        sl.shapes.add_picture(str(rdir / s["png"]), 0, 0,
                              width=prs.slide_width, height=prs.slide_height)
    out.parent.mkdir(parents=True, exist_ok=True)
    prs.save(str(out))

    # 검증 + 제출규격 게이트
    v = Presentation(str(out))
    n = len(v.slides)
    pics = sum(1 for sl in v.slides for sh in sl.shapes if sh.shape_type == MSO_SHAPE_TYPE.PICTURE)
    mb = out.stat().st_size / 1e6
    print(f"[build] {n}장 / 이미지 {pics}개 / {mb:.2f}MB(십진) -> {out}")

    warns = []
    if "expect_slides" in cfg and n != int(cfg["expect_slides"]):
        warns.append(f"장수 불일치: 예상 {cfg['expect_slides']} vs 실제 {n}")
    if "max_mb" in cfg and mb > float(cfg["max_mb"]):
        warns.append(f"용량 초과: {mb:.1f}MB > 한도 {cfg['max_mb']}MB (포털이 MiB 기준이면 여유 더 둘 것)")
    if pics != n:
        warns.append(f"이미지 수({pics})가 장수({n})와 다름")
    if warns:
        print("✗ 제출규격 미달 — 이대로 내면 실격 위험:")
        for w in warns:
            print(f"    - {w}")
        if not force:
            print("  규격을 맞춘 뒤 다시 빌드하세요. (비상시 --force)")
            sys.exit(4)
        print("  ⚠ --force로 규격 미달을 통과시킴.")
    else:
        print("✓ 제출규격 점검 통과(장수·용량).")
    print("  ※ 표지의 발주처명·날짜·파일명 규격은 사람이 최종 확인할 것.")


def main():
    ap = argparse.ArgumentParser()
    ap.add_argument("order_md", help="순서.md 경로")
    ap.add_argument("--force", action="store_true", help="미컨펌·stale·규격미달 무시(비상용)")
    a = ap.parse_args()
    build(Path(a.order_md), a.force)


if __name__ == "__main__":
    main()
