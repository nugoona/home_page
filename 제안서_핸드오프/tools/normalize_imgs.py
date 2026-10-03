#!/usr/bin/env python3
"""이미지 정규화 (슬라이드 만들기 직전 호출하는 습관).

  - EXIF 회전(스마트폰 눕는 사진) 자동 보정 -> 세로 사진이 세워짐
  - 최대변 리사이즈로 용량 절감
  - 투명(RGBA/LA/P) 이미지를 JPG로 저장할 때 흰 배경 합성(검정 박스 방지)
  - src == dst 거부(원본 보호 — 이 스크립트는 원본을 자르거나 덮지 않는다)
  - 크롭은 하지 말 것: 슬라이드에서 CSS object-position 으로 조정이 원칙

사용법:
  python normalize_imgs.py <원본> <출력.jpg> [--max 1600] [--rotate 0|90|180|270]
  # 회전은 EXIF 보정 후에도 방향이 틀릴 때만. 양수=시계방향.

의존성: pip install pillow
"""
import argparse
from pathlib import Path
from PIL import Image, ImageOps


def normalize(src: Path, dst: Path, maxside: int, rotate: int):
    if src.resolve() == dst.resolve():
        raise SystemExit("✗ src와 dst가 동일합니다 — 원본 보호를 위해 거부. 다른 출력 경로를 쓰세요.")

    orig = Image.open(src)
    orig_size = orig.size
    im = ImageOps.exif_transpose(orig)            # EXIF 방향 보정
    if rotate:
        im = im.rotate(-rotate, expand=True)       # 양수=시계방향
    w, h = im.size
    if max(w, h) > maxside:
        if w >= h:
            im = im.resize((maxside, round(h * maxside / w)), Image.LANCZOS)
        else:
            im = im.resize((round(w * maxside / h), maxside), Image.LANCZOS)

    dst.parent.mkdir(parents=True, exist_ok=True)
    ext = dst.suffix.lower()
    if ext in (".jpg", ".jpeg"):
        if im.mode in ("RGBA", "LA", "P"):
            rgba = im.convert("RGBA")
            bg = Image.new("RGB", rgba.size, (255, 255, 255))
            bg.paste(rgba, mask=rgba.split()[-1])  # 투명 영역 -> 흰색
            im = bg
        else:
            im = im.convert("RGB")
        im.save(dst, quality=88)
    elif ext == ".webp":
        im.save(dst, quality=88)
    else:
        im.save(dst)                               # png 등은 원래 모드 유지

    print(f"[img] {src.name} {orig_size} -> {dst}  {im.size}"
          + (f"  (회전 {rotate}°)" if rotate else ""))


def main():
    ap = argparse.ArgumentParser()
    ap.add_argument("src"); ap.add_argument("dst")
    ap.add_argument("--max", type=int, default=1600)
    ap.add_argument("--rotate", type=int, default=0, choices=[0, 90, 180, 270])
    a = ap.parse_args()
    normalize(Path(a.src), Path(a.dst), a.max, a.rotate)


if __name__ == "__main__":
    main()
