#!/usr/bin/env python3
"""
이미지 경로 수정 스크립트
HTML 파일들의 이미지 경로를 실제 파일 구조에 맞게 수정
"""

import re
import pathlib

# HTML 파일들
html_files = [
    "index.html",
    "services.html", 
    "technology.html",
    "about.html",
    "portfolio.html",
    "proposal.html",
    "survey.html"
]

# 이미지 경로 매핑 (기존 경로 → 새 경로)
image_mappings = {
    # 로고 및 파비콘
    "img/logo2.png": "img/icons/logo2.webp",
    "img/favicons/favicon.ico": "img/icons/logo2.webp",  # favicon이 없으므로 logo2 사용
    
    # UI 이미지들
    "img/aaa1.png": "img/ui/aa1.webp",
    "img/aaa1.webp": "img/ui/aa1.webp", 
    "img/ui/aaa1.webp": "img/ui/aa1.webp",
    
    # 아이콘들
    "images/instagram.png": "img/icons/instagram.webp",
    "images/search.png": "img/icons/search.webp", 
    "images/x.png": "img/icons/x.webp",
    
    # 제안서 페이지 이미지들 (PNG → WebP)
    "img/핵2.png": "img/ui/핵2.webp",
    "img/핵3.png": "img/ui/핵3.webp", 
    "img/핵4.png": "img/ui/핵4.webp",
    "img/aw.png": "img/ui/aw.webp",
    "img/aw2.png": "img/ui/aw2.webp",
    "img/aw3.png": "img/ui/aw3.webp",
    "img/aw4.png": "img/ui/aw4.webp",
    
    # 배경 이미지 (절대 경로 제거)
    "images/배경0816.png": "img/ui/배경0816.webp",
}

# 잘못된 비디오 경로들 (Portfolio 페이지)
video_path_fixes = {
    'static/videos/컨텐츠 상품/': 'static/videos/portfolio/',
    'videos/컨텐츠 상품/': 'videos/portfolio/',
}

def fix_image_paths():
    """모든 HTML 파일의 이미지 경로 수정"""
    
    for html_file in html_files:
        file_path = pathlib.Path(html_file)
        
        if not file_path.exists():
            print(f"⚠️  File not found: {html_file}")
            continue
            
        print(f"🔧 Processing: {html_file}")
        
        # 파일 읽기
        content = file_path.read_text(encoding='utf-8')
        original_content = content
        
        # 이미지 경로 수정
        changes_made = 0
        for old_path, new_path in image_mappings.items():
            if old_path in content:
                content = content.replace(old_path, new_path)
                changes_made += 1
                print(f"  ✅ {old_path} → {new_path}")
        
        # 비디오 경로 수정 (Portfolio 페이지용)
        for old_path, new_path in video_path_fixes.items():
            if old_path in content:
                content = content.replace(old_path, new_path)
                changes_made += 1
                print(f"  ✅ {old_path} → {new_path}")
        
        # 변경사항이 있으면 파일 저장
        if content != original_content:
            file_path.write_text(content, encoding='utf-8')
            print(f"  📝 Saved {changes_made} changes to {html_file}")
        else:
            print(f"  ⏭️  No changes needed for {html_file}")
        
        print()

def create_missing_favicon():
    """누락된 favicon 폴더 및 파일 생성"""
    
    print("🔧 Creating favicon structure...")
    
    # favicon 폴더 생성
    favicon_dir = pathlib.Path("static/img/favicons")
    favicon_dir.mkdir(parents=True, exist_ok=True)
    
    # logo2.webp를 favicon.ico로 복사 (임시 해결책)
    logo_path = pathlib.Path("static/img/icons/logo2.webp")
    favicon_path = favicon_dir / "favicon.ico"
    
    if logo_path.exists():
        # WebP를 ico로 변환은 복잡하므로, 일단 복사만
        import shutil
        shutil.copy2(logo_path, favicon_path)
        print(f"  ✅ Created favicon: {favicon_path}")
    else:
        print(f"  ⚠️  Source logo not found: {logo_path}")

if __name__ == "__main__":
    print("🚀 Starting image path fixes...")
    
    fix_image_paths()
    create_missing_favicon()
    
    print("🎉 All image fixes completed!")
    print("\n📋 Next steps:")
    print("1. Check Flask logs for remaining 404 errors")
    print("2. Test all pages for missing images")
    print("3. Consider creating proper favicon.ico file")
