#!/usr/bin/env python3
"""
Static Asset Compression Script
Converts images and videos for web optimization (PNG/JPG → WebP, GIF → MP4/WebM, Video → MP4/WebM)
Works on both Linux (Cloud Shell) and Windows (PowerShell) if ffmpeg & cwebp are installed.
"""

import subprocess
import pathlib
import os
import sys
import shutil
from typing import List

# --- 디렉토리 설정 ---
SRC_IMG = pathlib.Path("static_src/img")
SRC_VID = pathlib.Path("static_src/videos_src")
OUT_IMG = pathlib.Path("static/img")
OUT_VID = pathlib.Path("static/videos")

# 출력 디렉토리 생성
OUT_IMG.mkdir(parents=True, exist_ok=True)
OUT_VID.mkdir(parents=True, exist_ok=True)

def run(cmd: List[str]) -> bool:
    """명령어 실행 및 결과 로그"""
    print(f"\nRunning: {' '.join(cmd)}")
    try:
        result = subprocess.run(cmd, check=True, capture_output=True, text=True)
        if result.stdout:
            print("stdout:", result.stdout.strip())
        if result.stderr:
            print("stderr:", result.stderr.strip())
        return True
    except subprocess.CalledProcessError as e:
        print("❌ Error running command")
        print("stdout:", e.stdout)
        print("stderr:", e.stderr)
        return False

def check_tools() -> bool:
    """필요한 외부 도구 확인"""
    tools = ["cwebp", "ffmpeg"]
    missing = []
    for tool in tools:
        if shutil.which(tool) is None:
            missing.append(tool)
            print(f"🚨 {tool} not found in PATH")
        else:
            print(f"✅ {tool} is available: {shutil.which(tool)}")
    if missing:
        print("\n⚠️ Missing tools:", ", ".join(missing))
        print("Install them before running again:")
        print("  - Linux (Cloud Shell): sudo apt-get update && sudo apt-get install -y ffmpeg webp")
        print("  - Windows (PowerShell): choco install ffmpeg ; choco install webp OR scoop install ffmpeg ; scoop install webp")
        return False
    return True

def is_newer(src: pathlib.Path, dst: pathlib.Path) -> bool:
    """원본이 더 최신인지 확인 (dst가 없거나 오래됐으면 True)"""
    if not dst.exists():
        return True
    return src.stat().st_mtime > dst.stat().st_mtime

def compress_images() -> None:
    """PNG/JPG → WebP 변환"""
    print("\n🖼️ Converting images to WebP...")
    image_exts = ["*.png", "*.jpg", "*.jpeg", "*.PNG", "*.JPG", "*.JPEG"]
    converted, skipped = 0, 0

    for ext in image_exts:
        for src_file in SRC_IMG.rglob(ext):
            rel_path = src_file.relative_to(SRC_IMG)
            out_file = OUT_IMG / rel_path.parent / (rel_path.stem + ".webp")
            out_file.parent.mkdir(parents=True, exist_ok=True)

            if is_newer(src_file, out_file):
                print(f"  → {src_file.name} → {out_file.name}")
                ok = run([
                    "cwebp", "-q", "82", "-m", "6", "-mt", "-af",
                    str(src_file), "-o", str(out_file)
                ])
                if ok:
                    converted += 1
            else:
                print(f"  ↩ Skipped: {src_file.name} (already up to date)")
                skipped += 1

    print(f"Images: {converted} converted, {skipped} skipped")

def compress_gifs() -> None:
    """GIF → MP4 + WebM 변환"""
    print("\n🎞️ Converting GIFs...")
    converted = skipped = 0

    for src_file in SRC_IMG.rglob("*.gif"):
        rel_path = src_file.relative_to(SRC_IMG)
        base_path = OUT_VID / rel_path.parent / rel_path.stem
        base_path.parent.mkdir(parents=True, exist_ok=True)

        mp4_file = base_path.with_suffix(".mp4")
        webm_file = base_path.with_suffix(".webm")

        # GIF → MP4
        if is_newer(src_file, mp4_file):
            print(f"  → GIF→MP4: {src_file.name} → {mp4_file.name}")
            ok = run([
                "ffmpeg", "-y", "-i", str(src_file),
                "-vf", "scale=-2:720:force_original_aspect_ratio=decrease",
                "-c:v", "libx264", "-preset", "medium", "-crf", "23",
                "-pix_fmt", "yuv420p", "-movflags", "+faststart",
                "-r", "30", str(mp4_file)
            ])
            if ok: converted += 1
        else:
            skipped += 1

        # GIF → WebM
        if is_newer(src_file, webm_file):
            print(f"  → GIF→WebM: {src_file.name} → {webm_file.name}")
            ok = run([
                "ffmpeg", "-y", "-i", str(src_file),
                "-vf", "scale=-2:720:force_original_aspect_ratio=decrease",
                "-c:v", "libvpx-vp9", "-b:v", "0", "-crf", "32",
                "-row-mt", "1", "-tile-columns", "2",
                "-r", "30", str(webm_file)
            ])
            if ok: converted += 1
        else:
            skipped += 1

    print(f"GIFs: {converted} converted, {skipped} skipped")

def compress_videos() -> None:
    """MP4/MOV/WEBM → MP4 + WebM"""
    print("\n📹 Converting videos...")
    video_exts = ["*.mp4", "*.mov", "*.m4v", "*.webm", "*.MP4", "*.MOV", "*.M4V", "*.WEBM"]
    converted_mp4 = converted_webm = skipped = 0

    for ext in video_exts:
        for src_file in SRC_VID.rglob(ext):
            rel_path = src_file.relative_to(SRC_VID)
            base_path = OUT_VID / rel_path.parent / rel_path.stem
            base_path.parent.mkdir(parents=True, exist_ok=True)

            mp4_file = base_path.with_suffix(".mp4")
            webm_file = base_path.with_suffix(".webm")

            # MP4 변환
            if is_newer(src_file, mp4_file):
                print(f"  → To MP4: {src_file.name} → {mp4_file.name}")
                ok = run([
                    "ffmpeg", "-y", "-i", str(src_file),
                    "-vf", "scale=w=min(1920\\,iw):h=min(1080\\,ih):force_original_aspect_ratio=decrease",
                    "-c:v", "libx264", "-preset", "slow", "-crf", "28", "-g", "240",
                    "-pix_fmt", "yuv420p", "-movflags", "+faststart",
                    "-c:a", "aac", "-b:a", "96k", str(mp4_file)
                ])
                if ok: converted_mp4 += 1
            else:
                skipped += 1

            # WebM 변환
            if is_newer(src_file, webm_file):
                print(f"  → To WebM: {src_file.name} → {webm_file.name}")
                ok = run([
                    "ffmpeg", "-y", "-i", str(src_file),
                    "-vf", "scale=w=min(1920\\,iw):h=min(1080\\,ih):force_original_aspect_ratio=decrease",
                    "-c:v", "libvpx-vp9", "-b:v", "0", "-crf", "36",
                    "-row-mt", "1", "-tile-columns", "2", "-g", "240",
                    "-c:a", "libopus", "-b:a", "96k", str(webm_file)
                ])
                if ok: converted_webm += 1
            else:
                skipped += 1

    print(f"Videos: {converted_mp4} MP4s, {converted_webm} WebMs converted, {skipped} skipped")

def copy_assets() -> None:
    """CSS/JS 파일 복사 → static/ 으로"""
    print("\n📂 Copying CSS/JS assets...")
    for folder in ["css", "js"]:
        src_dir = pathlib.Path(folder)
        dst_dir = pathlib.Path("static") / folder
        dst_dir.mkdir(parents=True, exist_ok=True)
        if src_dir.exists():
            for f in src_dir.glob("*.*"):
                dst_file = dst_dir / f.name
                if is_newer(f, dst_file):
                    dst_file.write_text(f.read_text(encoding="utf-8"), encoding="utf-8")
                    print(f"  Copied: {folder}/{f.name}")

def main():
    print("🚀 Starting asset compression...")
    if not check_tools():
        sys.exit(1)

    if not SRC_IMG.exists():
        print(f"Source image dir not found: {SRC_IMG}")
        sys.exit(1)
    if not SRC_VID.exists():
        print(f"Source video dir not found: {SRC_VID}")
        sys.exit(1)

    try:
        compress_images()
        compress_gifs()
        compress_videos()
        copy_assets()

        print("\n✅ Asset compression completed!")
        print(f"  • {len(list(OUT_IMG.rglob('*.webp')))} WebP images in {OUT_IMG}")
        print(f"  • {len(list(OUT_VID.rglob('*.*')))} videos in {OUT_VID}")

    except KeyboardInterrupt:
        print("\n⏹️ Process interrupted by user")
        sys.exit(1)
    except Exception as e:
        print("\n❌ Unexpected error:", e)
        sys.exit(1)

if __name__ == "__main__":
    main()
