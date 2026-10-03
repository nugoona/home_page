#!/usr/bin/env python3
"""슬라이드 HTML -> 1920x1080 PNG 렌더 (제안서 파이프라인 4단계).

MCP 브라우저는 뷰포트를 리셋해 흰 여백/빈 렌더를 만든다. 반드시 이 방식
(명시적 viewport 1920x1080 + clip)을 쓸 것.

검증 기능:
  - document.fonts.ready 대기(웹폰트 fallback 렌더 방지)
  - 리소스 로드 실패(이미지 404 등) 감지 -> 해당 장 경고
  - 텍스트 오버플로(카드 밖 삐져나감) 자동 검사
  - numpy/PIL 없으면 조용히 통과하지 않고 경고
  - stem 중복(같은 slideNN.html) 시 덮어쓰기 대신 에러 종료
  - '_'/'.' 로 시작하는 폴더(_구버전_아카이브 등) 자동 제외

사용법:
  python render.py <슬라이드_루트>              # NN_이름/slideNN.html 전체
  python render.py <슬라이드_루트> --only 12
  python render.py slides/12_아카데미/slide12.html
  python render.py <루트> --scale 2             # 인쇄/PDF용(자동으로 renders_2x/에 저장)
  python render.py <루트> --thumb 900           # 모바일 컨펌용 축소본(renders/thumb/)

의존성: pip install playwright pillow numpy && playwright install chromium
"""
import argparse, sys, re
from pathlib import Path
from playwright.sync_api import sync_playwright

try:
    import numpy as np
    from PIL import Image
    _HAS_IMG = True
except ImportError:
    _HAS_IMG = False

_OVERFLOW_JS = r"""
() => {
  const bad = [];
  const slide = document.querySelector('.slide') || document.body;
  const sr = slide.getBoundingClientRect();
  document.querySelectorAll('.slide *').forEach(el => {
    const r = el.getBoundingClientRect();
    if (r.width === 0 || r.height === 0) return;
    if (r.right > sr.right + 2 || r.bottom > sr.bottom + 2 ||
        r.left < sr.left - 2 || r.top < sr.top - 2) {
      if (el.scrollWidth > el.clientWidth + 2 || el.scrollHeight > el.clientHeight + 2) {
        bad.push((el.className||el.tagName) + ' "' + (el.innerText||'').slice(0,20) + '"');
      }
    }
  });
  return bad.slice(0, 8);
}
"""


def find_slides(root: Path):
    """단일 HTML이면 그 파일. 폴더면 NN_이름/slide*.html.
    '_'/'.' 시작 폴더 제외(폐기·핸드오프 폴더 혼입 방지).
    stem 중복(같은 파일명)이면 어느 것이 정본인지 알 수 없으므로 에러."""
    if root.is_file():
        return [root]
    hits = [h for h in sorted(root.glob("*/slide*.html"))
            if not h.parent.name.startswith((".", "_"))]
    seen = {}
    for h in hits:
        seen.setdefault(h.stem, []).append(h)
    dup = {k: v for k, v in seen.items() if len(v) > 1}
    if dup:
        lines = "\n".join(f"  {k}: " + " , ".join(str(p) for p in v) for k, v in dup.items())
        sys.exit(f"✗ 슬라이드 파일명(stem) 중복 — 어느 것이 정본인지 모호합니다:\n{lines}\n"
                 "  폴더/파일명을 유일하게 하거나, 단일 파일 경로로 렌더하세요.")
    return hits


def blank_ratio(png: Path) -> float:
    a = np.asarray(Image.open(png).convert("RGB"))
    return float((a.sum(axis=2) < 745).mean()) * 100


def render(htmls, out_dir: Path, wait_ms=700, scale=1, thumb=0):
    out_dir.mkdir(parents=True, exist_ok=True)
    if not _HAS_IMG:
        print("⚠ numpy/PIL 미설치 — 빈 렌더/썸네일 검사를 건너뜁니다(검증 축소). "
              "`pip install pillow numpy` 권장.")
    ok, failed = [], []
    reqfail = []
    with sync_playwright() as p:
        b = p.chromium.launch()
        pg = b.new_page(viewport={"width": 1920, "height": 1080}, device_scale_factor=scale)
        pg.on("requestfailed", lambda req: reqfail.append(req.url))  # 루프 밖 1회 등록
        for h in htmls:
            reqfail.clear()
            try:
                pg.goto(h.resolve().as_uri(), wait_until="networkidle")
                pg.evaluate("async () => { try { await document.fonts.ready; } catch(e){} }")
                pg.wait_for_timeout(wait_ms)
                overflow = pg.evaluate(_OVERFLOW_JS)
                out = out_dir / f"{h.stem}.png"
                pg.screenshot(path=str(out),
                              clip={"x": 0, "y": 0, "width": 1920, "height": 1080})
                warns = []
                if _HAS_IMG:
                    r = blank_ratio(out)
                    if 0 <= r < 5:
                        warns.append(f"빈 렌더 의심(비백 {r:.1f}%)")
                if reqfail:
                    warns.append(f"리소스 실패 {len(reqfail)}건(예: {reqfail[0].split('/')[-1]})")
                if overflow:
                    warns.append(f"오버플로 {len(overflow)}건: {overflow[0]}")
                if thumb and _HAS_IMG:
                    tdir = out_dir / "thumb"; tdir.mkdir(exist_ok=True)
                    im = Image.open(out); im.thumbnail((thumb, thumb))
                    im.save(tdir / f"{h.stem}.png")
                if warns:
                    print(f"[render] {out.name}  ⚠ " + " | ".join(warns))
                    failed.append((h.stem, warns))
                else:
                    print(f"[render] {out.name}  OK")
                    ok.append(out)
            except Exception as e:
                print(f"[render] {h.name}  ✗ 실패: {e}")
                failed.append((h.stem, [str(e)]))
        b.close()
    print(f"\n완료: 성공 {len(ok)} / 경고·실패 {len(failed)}")
    if failed:
        print("점검 필요:")
        for name, ws in failed:
            print(f"  - {name}: {'; '.join(ws)}")
    return ok, failed


def main():
    ap = argparse.ArgumentParser()
    ap.add_argument("root", help="슬라이드 루트 폴더 또는 단일 HTML")
    ap.add_argument("--out", default="renders")
    ap.add_argument("--only", default=None, help="특정 장 번호, 예: 12 (주의: 1은 01과 01b 모두 매칭)")
    ap.add_argument("--wait", type=int, default=700)
    ap.add_argument("--scale", type=int, default=1, help="device_scale_factor(인쇄/PDF는 2)")
    ap.add_argument("--thumb", type=int, default=0, help="모바일 컨펌용 축소본 최대변 px")
    a = ap.parse_args()

    htmls = find_slides(Path(a.root))
    if a.only:
        htmls = [h for h in htmls if re.search(rf"slide0*{a.only}[a-z]?\.html$", h.name)]
    if not htmls:
        print("렌더할 슬라이드를 찾지 못했습니다.")
        sys.exit(1)

    out_dir = Path(a.out)
    if a.scale != 1 and a.out == "renders":       # 2x가 1x 컨펌본을 덮지 않게 분리
        out_dir = Path("renders_2x")
        print(f"scale={a.scale} → 출력 폴더를 {out_dir}/ 로 분리합니다(컨펌본 보호).")
    _, failed = render(htmls, out_dir, a.wait, a.scale, a.thumb)
    sys.exit(1 if failed else 0)


if __name__ == "__main__":
    main()
