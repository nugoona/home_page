const puppeteer = require('puppeteer');
const path = require('path');

async function generatePDF() {
  let browser;
  try {
    console.log('🚀 PDF 생성을 시작합니다...');
    
    // 브라우저 실행
    browser = await puppeteer.launch({
      headless: true,
      args: ['--no-sandbox', '--disable-setuid-sandbox']
    });
    
    const page = await browser.newPage();
    
    // HTML 파일 경로 (절대 경로)
    const htmlPath = 'file://' + path.resolve('./proposal.html');
    console.log('📄 HTML 파일 로드:', htmlPath);
    
    // 페이지 로드
    await page.goto(htmlPath, { 
      waitUntil: 'networkidle0',
      timeout: 30000 
    });
    
    // 페이지가 완전히 로드될 때까지 대기
    await page.waitForTimeout(2000);
    
    // PDF 생성 옵션
    const pdfOptions = {
      path: 'proposal.pdf',
      format: 'A4',
      printBackground: true,
      margin: {
        top: '20px',
        right: '20px',
        bottom: '20px',
        left: '20px'
      },
      preferCSSPageSize: true
    };
    
    console.log('📋 PDF 생성 중...');
    await page.pdf(pdfOptions);
    
    console.log('✅ PDF 생성 완료: proposal.pdf');
    
  } catch (error) {
    console.error('❌ PDF 생성 중 오류:', error.message);
  } finally {
    if (browser) {
      await browser.close();
    }
  }
}

// 스크립트 실행
generatePDF();
