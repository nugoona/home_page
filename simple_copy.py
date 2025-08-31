#!/usr/bin/env python3
"""
Simple asset copy script (without compression)
CSS/JS files only - no image/video compression
"""

import pathlib
import shutil

def copy_assets():
    """CSS/JS 파일만 복사"""
    print("📄 Copying CSS/JS assets...")
    
    # 출력 디렉토리 생성
    static_dir = pathlib.Path("static")
    static_dir.mkdir(exist_ok=True)
    
    # CSS 복사
    css_src = pathlib.Path("css")
    css_dst = pathlib.Path("static/css")
    
    if css_src.exists():
        css_dst.mkdir(parents=True, exist_ok=True)
        for css_file in css_src.glob("*.css"):
            dst_file = css_dst / css_file.name
            shutil.copy2(css_file, dst_file)
            print(f"  ✅ Copied: {css_file.name}")
    else:
        print("  ⚠️  CSS directory not found")
    
    # JS 복사
    js_src = pathlib.Path("js")
    js_dst = pathlib.Path("static/js")
    
    if js_src.exists():
        js_dst.mkdir(parents=True, exist_ok=True)
        for js_file in js_src.glob("*.js"):
            dst_file = js_dst / js_file.name
            shutil.copy2(js_file, dst_file)
            print(f"  ✅ Copied: {js_file.name}")
    else:
        print("  ⚠️  JS directory not found")
    
    # 기존 이미지/비디오를 static_src에서 static으로 심볼릭 링크 (임시)
    img_src = pathlib.Path("static_src/img")
    img_dst = pathlib.Path("static/img")
    vid_src = pathlib.Path("static_src/videos_src")
    vid_dst = pathlib.Path("static/videos")
    
    if img_src.exists() and not img_dst.exists():
        try:
            # Windows에서 심볼릭 링크 대신 복사
            shutil.copytree(img_src, img_dst)
            print(f"  📁 Copied images: {img_src} → {img_dst}")
        except Exception as e:
            print(f"  ❌ Failed to copy images: {e}")
    
    if vid_src.exists() and not vid_dst.exists():
        try:
            shutil.copytree(vid_src, vid_dst)
            print(f"  📁 Copied videos: {vid_src} → {vid_dst}")
        except Exception as e:
            print(f"  ❌ Failed to copy videos: {e}")
    
    print("\n✅ Asset copy completed!")
    print("📝 Note: Images and videos are not compressed yet.")
    print("   Install ffmpeg/cwebp and run compress_assets.py for optimization.")

if __name__ == "__main__":
    copy_assets()



