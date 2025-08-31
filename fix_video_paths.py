#!/usr/bin/env python3
"""
비디오 경로 수정 스크립트
HTML 파일들의 비디오 경로를 올바른 하위 폴더 구조로 수정
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
    "proposal.html"
]

# 경로 매핑 (기존 경로 → 새 경로)
path_mappings = {
    # Hero 비디오들
    "videos/main.": "videos/hero/main.",
    "videos/main2.": "videos/hero/main2.", 
    "videos/main._ngn.": "videos/hero/main._ngn.",
    "videos/main._ngn3.": "videos/hero/main._ngn3.",
    "videos/h1.": "videos/hero/h1.",
    "videos/net.": "videos/hero/net.",
    "videos/K1.": "videos/hero/K1.",
    "videos/k2.": "videos/hero/k2.",
    "videos/K3.": "videos/hero/K3.",
    "videos/K4.": "videos/hero/K4.",
    "videos/d1.": "videos/hero/d1.",
    "videos/sns1.": "videos/hero/sns1.",
    
    # Portfolio 비디오들
    "videos/con_main.": "videos/portfolio/con_main.",
    "videos/카타1.": "videos/portfolio/카타1.",
    "videos/카탈로그.": "videos/portfolio/카탈로그.",
    "videos/팝아트영상.": "videos/portfolio/팝아트영상.",
    "videos/apt.": "videos/portfolio/apt.",
    
    # UI 비디오들
    "videos/누구나타이틀.": "videos/ui/누구나타이틀.",
}

def fix_video_paths():
    """모든 HTML 파일의 비디오 경로 수정"""
    
    for html_file in html_files:
        file_path = pathlib.Path(html_file)
        
        if not file_path.exists():
            print(f"⚠️  File not found: {html_file}")
            continue
            
        print(f"🔧 Processing: {html_file}")
        
        # 파일 읽기
        content = file_path.read_text(encoding='utf-8')
        original_content = content
        
        # 각 매핑에 대해 교체
        changes_made = 0
        for old_path, new_path in path_mappings.items():
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

def fix_navigation_links():
    """네비게이션 링크에서 .html 제거"""
    
    print("🔗 Fixing navigation links...")
    
    link_mappings = {
        'href="portfolio.html"': 'href="/portfolio"',
        'href="about.html"': 'href="/about"', 
        'href="proposal.html"': 'href="/proposal"',
        'href="services.html"': 'href="/services"',
        'href="technology.html"': 'href="/technology"',
        'href="survey.html"': 'href="/survey"',
        'href="index.html"': 'href="/"',
    }
    
    for html_file in html_files:
        file_path = pathlib.Path(html_file)
        
        if not file_path.exists():
            continue
            
        content = file_path.read_text(encoding='utf-8')
        original_content = content
        
        changes_made = 0
        for old_link, new_link in link_mappings.items():
            if old_link in content:
                content = content.replace(old_link, new_link)
                changes_made += 1
                print(f"  ✅ {old_link} → {new_link}")
        
        if content != original_content:
            file_path.write_text(content, encoding='utf-8')
            print(f"  📝 Updated navigation in {html_file}")

if __name__ == "__main__":
    print("🚀 Starting video path and navigation fixes...")
    
    fix_video_paths()
    fix_navigation_links()
    
    print("🎉 All fixes completed!")
    print("\n📋 Next steps:")
    print("1. Restart Flask app: python app/app.py")
    print("2. Test video playback on all pages")
    print("3. Test navigation links work without .html")


