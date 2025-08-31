#!/usr/bin/env python3
# -*- coding: utf-8 -*-
"""
HTML을 PDF로 변환하는 스크립트
"""

import os
import weasyprint
from pathlib import Path

def html_to_pdf():
    """proposal.html을 PDF로 변환"""
    try:
        # 현재 디렉토리의 proposal.html 파일 경로
        html_file = Path("proposal.html")
        pdf_file = Path("proposal.pdf")
        
        if not html_file.exists():
            print(f"❌ {html_file} 파일을 찾을 수 없습니다.")
            return False
        
        print("📄 HTML을 PDF로 변환 중...")
        
        # HTML 파일을 읽고 절대 경로로 변환
        html_content = html_file.read_text(encoding='utf-8')
        base_url = html_file.parent.absolute().as_uri() + "/"
        
        # CSS와 이미지 경로를 절대 경로로 변환
        html_content = html_content.replace('href="css/', f'href="{base_url}css/')
        html_content = html_content.replace('src="images/', f'src="{base_url}images/')
        
        # WeasyPrint로 PDF 생성
        document = weasyprint.HTML(string=html_content, base_url=base_url)
        document.write_pdf(pdf_file)
        
        print(f"✅ PDF 생성 완료: {pdf_file}")
        print(f"📁 파일 크기: {pdf_file.stat().st_size / 1024:.1f} KB")
        
        return True
        
    except ImportError:
        print("❌ weasyprint 라이브러리가 설치되지 않았습니다.")
        print("설치 명령: pip install weasyprint")
        return False
    except Exception as e:
        print(f"❌ PDF 생성 중 오류 발생: {e}")
        return False

if __name__ == "__main__":
    html_to_pdf()
