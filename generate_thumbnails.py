#!/usr/bin/env python3
"""
Video Thumbnail Generator
자동으로 모든 비디오 파일에서 썸네일 이미지를 생성합니다
"""

import subprocess
import pathlib
import os
import sys
from typing import List

# 디렉토리 설정
SRC_VID = pathlib.Path("static_src/videos_src")
OUT_THUMBS = pathlib.Path("static/thumbs")

# 출력 디렉토리 생성
OUT_THUMBS.mkdir(parents=True, exist_ok=True)

def run(cmd: List[str]) -> bool:
    """명령어 실행 및 로깅"""
    print(f"🔧 Running: {' '.join(cmd)}")
    try:
        subprocess.run(cmd, check=True, capture_output=True, text=True)
        print(f"✅ Success!")
        return True
    except subprocess.CalledProcessError as e:
        print(f"❌ Error: {e}")
        if e.stdout:
            print(f"   stdout: {e.stdout}")
        if e.stderr:
            print(f"   stderr: {e.stderr}")
        return False

def check_ffmpeg() -> bool:
    """ffmpeg가 설치되어 있는지 확인"""
    try:
        subprocess.run(["ffmpeg", "-version"], capture_output=True, check=True)
        print("✅ ffmpeg is available")
        return True
    except (subprocess.CalledProcessError, FileNotFoundError):
        print("❌ ffmpeg is not available")
        print("Please install ffmpeg: choco install ffmpeg  OR  scoop install ffmpeg")
        return False

def generate_thumbnail(video_path: pathlib.Path, thumb_path: pathlib.Path) -> bool:
    """비디오에서 썸네일 생성"""
    # 1초 지점에서 썸네일 추출
    return run([
        "ffmpeg", "-y", "-i", str(video_path),
        "-ss", "00:00:01.000",  # 1초 지점
        "-vframes", "1",        # 1프레임만
        "-q:v", "2",           # 고품질
        "-vf", "scale='min(800,iw)':'min(600,ih)':force_original_aspect_ratio=decrease",  # 최대 800x600
        str(thumb_path)
    ])

def generate_all_thumbnails():
    """모든 비디오 파일에서 썸네일 생성"""
    print("🎬 Generating video thumbnails...")
    
    if not check_ffmpeg():
        sys.exit(1)
    
    if not SRC_VID.exists():
        print(f"❌ Source video directory not found: {SRC_VID}")
        sys.exit(1)
    
    # 지원하는 비디오 확장자
    video_exts = ["*.mp4", "*.mov", "*.m4v", "*.webm", "*.MP4", "*.MOV", "*.M4V", "*.WEBM"]
    
    generated = 0
    skipped = 0
    
    for ext in video_exts:
        for video_file in SRC_VID.rglob(ext):
            # 상대 경로 유지하여 썸네일 경로 생성
            rel_path = video_file.relative_to(SRC_VID)
            thumb_file = OUT_THUMBS / rel_path.parent / (rel_path.stem + ".jpg")
            
            # 썸네일 디렉토리 생성
            thumb_file.parent.mkdir(parents=True, exist_ok=True)
            
            # 썸네일이 없거나 비디오가 더 새로우면 생성
            if not thumb_file.exists() or video_file.stat().st_mtime > thumb_file.stat().st_mtime:
                print(f"  📸 Creating thumbnail: {video_file.name} → {thumb_file.name}")
                if generate_thumbnail(video_file, thumb_file):
                    generated += 1
                else:
                    print(f"     ❌ Failed to create thumbnail for {video_file.name}")
            else:
                print(f"  ⏭️  Skipped: {video_file.name} (thumbnail up to date)")
                skipped += 1
    
    print(f"\n📊 Thumbnails: {generated} generated, {skipped} skipped")
    print(f"📁 Thumbnails saved in: {OUT_THUMBS}")
    
    # 생성된 썸네일 목록 출력
    if generated > 0:
        print("\n📋 Generated thumbnails:")
        for thumb in OUT_THUMBS.rglob("*.jpg"):
            rel_path = thumb.relative_to(OUT_THUMBS)
            file_size = thumb.stat().st_size / 1024  # KB
            print(f"  • {rel_path} ({file_size:.1f} KB)")

def main():
    """메인 실행 함수"""
    print("🚀 Starting thumbnail generation...")
    
    try:
        generate_all_thumbnails()
        print("\n🎉 Thumbnail generation completed!")
        
    except KeyboardInterrupt:
        print("\n⚠️  Process interrupted by user")
        sys.exit(1)
    except Exception as e:
        print(f"\n❌ Unexpected error: {e}")
        sys.exit(1)

if __name__ == "__main__":
    main()






