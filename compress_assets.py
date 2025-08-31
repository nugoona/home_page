#!/usr/bin/env python3
"""
Static Asset Compression Script
Converts images and videos for web optimization
"""

import subprocess
import pathlib
import os
import sys
from typing import List

# 디렉토리 설정
SRC_IMG = pathlib.Path("static_src/img")
SRC_VID = pathlib.Path("static_src/videos_src")
OUT_IMG = pathlib.Path("static/img")
OUT_VID = pathlib.Path("static/videos")

# 출력 디렉토리 생성
OUT_IMG.mkdir(parents=True, exist_ok=True)
OUT_VID.mkdir(parents=True, exist_ok=True)

def run(cmd: List[str]) -> None:
    """명령어 실행 및 로깅"""
    print(f"Running: {' '.join(cmd)}")
    try:
        subprocess.run(cmd, check=True, capture_output=True, text=True, encoding='utf-8')
        print(f"Success!")
    except subprocess.CalledProcessError as e:
        print(f"Error: {e}")
        if e.stdout:
            print(f"   stdout: {e.stdout}")
        if e.stderr:
            print(f"   stderr: {e.stderr}")
        return False
    return True

def check_tools() -> bool:
    """필요한 도구들이 설치되어 있는지 확인"""
    tools = [
        ("cwebp", "cwebp -version"),
        ("ffmpeg", "ffmpeg -version")
    ]
    
    missing = []
    for tool, check_cmd in tools:
        try:
            subprocess.run(check_cmd.split(), capture_output=True, check=True)
            print(f"{tool} is available")
        except (subprocess.CalledProcessError, FileNotFoundError):
            missing.append(tool)
            print(f"{tool} is not available")
    
    if missing:
        print(f"\n🚨 Missing tools: {', '.join(missing)}")
        print("Please install them:")
        print("  - cwebp: Download from https://developers.google.com/speed/webp/download")
        print("  - ffmpeg: choco install ffmpeg  OR  scoop install ffmpeg")
        return False
    
    return True

def is_newer(src: pathlib.Path, dst: pathlib.Path) -> bool:
    """원본 파일이 대상 파일보다 새로운지 확인"""
    if not dst.exists():
        return True
    return src.stat().st_mtime > dst.stat().st_mtime

def compress_images() -> None:
    """이미지 압축: PNG/JPG → WebP"""
    print("\nConverting images to WebP...")
    
    # 지원하는 이미지 확장자
    image_exts = ["*.png", "*.jpg", "*.jpeg", "*.PNG", "*.JPG", "*.JPEG"]
    
    converted = 0
    skipped = 0
    
    for ext in image_exts:
        for src_file in SRC_IMG.rglob(ext):
            # 상대 경로 유지하여 출력 파일 경로 생성
            rel_path = src_file.relative_to(SRC_IMG)
            out_file = OUT_IMG / rel_path.parent / (rel_path.stem + ".webp")
            
            # 출력 디렉토리 생성
            out_file.parent.mkdir(parents=True, exist_ok=True)
            
            if is_newer(src_file, out_file):
                print(f"  Converting: {src_file.name} → {out_file.name}")
                success = run([
                    "cwebp", "-q", "82", "-m", "6", "-mt", "-af", 
                    str(src_file), "-o", str(out_file)
                ])
                if success:
                    converted += 1
            else:
                print(f"  Skipped: {src_file.name} (already up to date)")
                skipped += 1
    
    print(f"Images: {converted} converted, {skipped} skipped")

def compress_videos() -> None:
    """비디오 압축: MP4/MOV/WEBM → MP4 + WebM"""
    print("\n🎥 Converting videos to MP4 + WebM...")
    
    # 지원하는 비디오 확장자
    video_exts = ["*.mp4", "*.mov", "*.m4v", "*.webm", "*.MP4", "*.MOV", "*.M4V", "*.WEBM"]
    
    converted_mp4 = 0
    converted_webm = 0
    skipped = 0
    
    for ext in video_exts:
        for src_file in SRC_VID.rglob(ext):
            # 상대 경로 유지하여 출력 파일 경로 생성
            rel_path = src_file.relative_to(SRC_VID)
            base_path = OUT_VID / rel_path.parent / rel_path.stem
            
            # 출력 디렉토리 생성
            base_path.parent.mkdir(parents=True, exist_ok=True)
            
            mp4_file = base_path.with_suffix(".mp4")
            webm_file = base_path.with_suffix(".webm")
            
            # MP4 변환
            if is_newer(src_file, mp4_file):
                print(f"  Converting to MP4: {src_file.name} → {mp4_file.name}")
                success = run([
                    "ffmpeg", "-y", "-i", str(src_file),
                    "-vf", "scale='min(1920,iw)':'min(1080,ih)':force_original_aspect_ratio=decrease:force_divisible_by=2",
                    "-c:v", "libx264", "-preset", "slow", "-crf", "23", "-g", "240",
                    "-pix_fmt", "yuv420p", "-movflags", "+faststart",
                    "-c:a", "aac", "-b:a", "128k", str(mp4_file)
                ])
                if success:
                    converted_mp4 += 1
            else:
                print(f"  Skipped MP4: {src_file.name} (already up to date)")
                skipped += 1
            
            # WebM 변환
            if is_newer(src_file, webm_file):
                print(f"  Converting to WebM: {src_file.name} → {webm_file.name}")
                success = run([
                    "ffmpeg", "-y", "-i", str(src_file),
                    "-vf", "scale='min(1920,iw)':'min(1080,ih)':force_original_aspect_ratio=decrease:force_divisible_by=2",
                    "-c:v", "libvpx-vp9", "-b:v", "0", "-crf", "32", "-row-mt", "1",
                    "-tile-columns", "2", "-g", "240",
                    "-c:a", "libopus", "-b:a", "96k", str(webm_file)
                ])
                if success:
                    converted_webm += 1
            else:
                print(f"  Skipped WebM: {src_file.name} (already up to date)")
    
    print(f"Videos: {converted_mp4} MP4s, {converted_webm} WebMs converted, {skipped} skipped")

def compress_gifs() -> None:
    """GIF를 비디오로 변환"""
    print("\nConverting GIFs to video...")
    
    converted = 0
    skipped = 0
    
    for src_file in SRC_IMG.rglob("*.gif"):
        # 상대 경로 유지하여 출력 파일 경로 생성
        rel_path = src_file.relative_to(SRC_IMG)
        base_path = OUT_VID / rel_path.parent / rel_path.stem
        
        # 출력 디렉토리 생성
        base_path.parent.mkdir(parents=True, exist_ok=True)
        
        mp4_file = base_path.with_suffix(".mp4")
        webm_file = base_path.with_suffix(".webm")
        
        # GIF → MP4
        if is_newer(src_file, mp4_file):
            print(f"  Converting GIF to MP4: {src_file.name} → {mp4_file.name}")
            success = run([
                "ffmpeg", "-y", "-i", str(src_file),
                "-vf", "scale=720:720:force_original_aspect_ratio=decrease",
                "-c:v", "libx264", "-preset", "medium", "-crf", "23",
                "-pix_fmt", "yuv420p", "-movflags", "+faststart",
                "-r", "30", str(mp4_file)
            ])
            if success:
                converted += 1
        
        # GIF → WebM
        if is_newer(src_file, webm_file):
            print(f"  Converting GIF to WebM: {src_file.name} → {webm_file.name}")
            success = run([
                "ffmpeg", "-y", "-i", str(src_file),
                "-vf", "scale=720:720:force_original_aspect_ratio=decrease",
                "-c:v", "libvpx-vp9", "-b:v", "0", "-crf", "32",
                "-row-mt", "1", "-tile-columns", "2",
                "-r", "30", str(webm_file)
            ])
            if success:
                converted += 1
    
    if converted > 0:
        print(f"GIFs: {converted} converted")

def copy_assets() -> None:
    """CSS/JS 파일 복사"""
    print("\nCopying CSS/JS assets...")
    
    # CSS 복사
    css_src = pathlib.Path("css")
    css_dst = pathlib.Path("static/css")
    css_dst.mkdir(parents=True, exist_ok=True)
    
    if css_src.exists():
        for css_file in css_src.glob("*.css"):
            dst_file = css_dst / css_file.name
            if is_newer(css_file, dst_file):
                dst_file.write_text(css_file.read_text(encoding='utf-8'), encoding='utf-8')
                print(f"  Copied: {css_file.name}")
    
    # JS 복사
    js_src = pathlib.Path("js")
    js_dst = pathlib.Path("static/js")
    js_dst.mkdir(parents=True, exist_ok=True)
    
    if js_src.exists():
        for js_file in js_src.glob("*.js"):
            dst_file = js_dst / js_file.name
            if is_newer(js_file, dst_file):
                dst_file.write_text(js_file.read_text(encoding='utf-8'), encoding='utf-8')
                print(f"  Copied: {js_file.name}")

def main():
    """메인 실행 함수"""
    print("Starting asset compression...")
    
    # 도구 확인
    if not check_tools():
        sys.exit(1)
    
    # 소스 디렉토리 확인
    if not SRC_IMG.exists():
        print(f"Source image directory not found: {SRC_IMG}")
        sys.exit(1)
    
    if not SRC_VID.exists():
        print(f"Source video directory not found: {SRC_VID}")
        sys.exit(1)
    
    try:
        # 압축 실행
        compress_images()
        compress_gifs()
        compress_videos()
        copy_assets()
        
        print("\nAsset compression completed!")
        
        # 결과 요약
        img_count = len(list(OUT_IMG.rglob("*.webp")))
        vid_count = len(list(OUT_VID.rglob("*.*")))
        
        print(f"Final results:")
        print(f"  • {img_count} WebP images in {OUT_IMG}")
        print(f"  • {vid_count} videos in {OUT_VID}")
        
    except KeyboardInterrupt:
        print("\nProcess interrupted by user")
        sys.exit(1)
    except Exception as e:
        print(f"\nUnexpected error: {e}")
        sys.exit(1)

if __name__ == "__main__":
    main()

